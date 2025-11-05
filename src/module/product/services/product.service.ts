import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { ProductAuditService } from './product-audit.service';
import { computeChanges } from 'src/common/utils/compute-changes.util ';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { isArray } from 'class-validator';
import { ProductDetailEntity } from '../entities/product-detail.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
    @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    private auditService: ProductAuditService,
  ) { }





  // ================= CREATE =================
  async createProduct(productDto: ProductDto, imageUrls: string[] | string) {
    const adminJwt = this.request.admin;
    const images = Array.isArray(imageUrls) ? imageUrls : [imageUrls]
    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }


    const user = await this.adminRepository.findOne({ where: { id: adminJwt.id } });
    if (!user) {
      throw new NotFoundException('User not found in database');
    }

    const product = this.productRepository.create({
      ...productDto,
      image: images,
      createdBy: user,
    });

    const saved = await this.productRepository.save(product)


    await this.auditService.log(saved.id, 'CREATE', user?.id ?? null, { before: null, after: saved }, 'created product')
    return {
      message: 'Product created successfully',
      product: saved,
    };
  }





// ================= UPDATE =================
// ================= UPDATE =================
async update(id: number, updateProductDto: UpdateProductDto) {
  const admin = this.request.admin;

  const product = await this.productRepository.findOne({
    where: { id },
    relations: ['details'],
  });
  if (!product) {
    throw new NotFoundException(NotFoundMessage.NotFound);
  }

  const importantFields = [
    'price',
    'discountAmount',
    'productName',
    'productCode',
    'discountPercent',
    'quantity',
    'image',
  ];

  const beforeImportant: any = {};
  for (const field of importantFields) beforeImportant[field] = product[field];

  // Parse کردن details اگر string است (برای form-data)
  if (updateProductDto.details && typeof updateProductDto.details === 'string') {
    try {
      updateProductDto.details = JSON.parse(updateProductDto.details);
    } catch (e) {
      updateProductDto.details = [];
    }
  }

  // آپدیت فیلدهای اصلی محصول
  for (const key of Object.keys(updateProductDto)) {
    if (updateProductDto[key] !== undefined && key !== 'details' && key !== 'product') {
      product[key] = updateProductDto[key];
    }
  }

  // 🔥 منطق کامل Sync برای details
  if (updateProductDto.details && Array.isArray(updateProductDto.details)) {
    const existingDetails = product.details ?? [];
    
    // 🔥 FIX: تعیین نوع صریح برای آرایه
    const detailsToSave: ProductDetailEntity[] = [];

    // 1️⃣ آپدیت جزئیات موجود و اضافه کردن جزئیات جدید
    for (const detailDto of updateProductDto.details) {
      if (detailDto.id) {
        // ✅ اگر ID دارد -> پیدا کن و آپدیت کن
        const existing = existingDetails.find(d => d.id === detailDto.id);
        if (existing) {
          existing.key = detailDto.key ?? existing.key;
          existing.value = detailDto.value ?? existing.value;
          detailsToSave.push(existing);
        }
      } else {
        // ✅ اگر ID ندارد -> جدید ایجاد کن
        const newDetail = this.productDetailRepository.create({
          productId: id,
          key: detailDto.key,
          value: detailDto.value,
          product: product,
        });
        existingDetails.push(newDetail);
        detailsToSave.push(newDetail);
      }
    }

    // 2️⃣ پیدا کردن جزئیاتی که باید حذف شوند
    const dtoIds = updateProductDto.details
      .filter(d => d?.id)
      .map(d => d.id);
    
    const toRemove = existingDetails.filter(d => 
      d.id && !dtoIds.includes(d.id)
    );

    // 3️⃣ اجرای عملیات
    if (detailsToSave.length > 0) {
      await this.productDetailRepository.save(detailsToSave);
    }
    
    if (toRemove.length > 0) {
      await this.productDetailRepository.remove(toRemove);
    }

    // آپدیت رابطه محصول - فقط مواردی که حذف نشده‌اند
    product.details = existingDetails.filter(d => !toRemove.includes(d));
  }

  const saved = await this.productRepository.save(product);

  const afterImportant: any = {};
  for (const field of importantFields) afterImportant[field] = saved[field];

  const changes = computeChanges(beforeImportant, afterImportant, importantFields);

  if (Object.keys(changes).length > 0) {
    await this.auditService.log(
      saved.id,
      'UPDATE',
      admin?.id,
      changes,
      'updated product',
    );
  }

  return {
    message: 'Product updated successfully',
    product: saved,
  };
}











  // ================= FIND ALL =================
  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [products, count] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      order: { create_at: 'DESC' },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }

    return {
      pagination: paginationGenerator(count, page, limit),
      products,
    };
  }




  // ================= FIND ONE =================
  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }
    return product
  }














  // ================= REMOVE =================
  async remove(id: number) {
    const user = this.request.user as any;
    const product = await this.findOne(id);

    await this.auditService.log(
      product.id,
      'DELETE',
      user?.id ?? null,
      { before: product, after: null },
      'deleted product',
    );

    await this.productRepository.delete({ id: product.id });

    return { message: 'Product deleted successfully' };
  }
}