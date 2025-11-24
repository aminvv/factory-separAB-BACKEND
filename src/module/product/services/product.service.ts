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
import { AdminEntity } from '../../admin/entities/admin.entity';
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
  async createProduct(productDto: ProductDto) {
    const adminJwt = this.request.admin;
    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }

    const imageInput = productDto.image || [];
    let images: string[] = [];

    if (typeof imageInput === 'string') {
      images = imageInput
        .split(',')
        .map(url => url.trim())
        .filter(url => url.includes('cloudinary.com'));
    } else if (Array.isArray(imageInput)) {
      images = imageInput.filter(url => typeof url === 'string' && url.includes('cloudinary.com'));
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
      message: 'محصول با موفقیت ساخته شد',
      product: saved,
    };
  }





  // ================= UPDATE =================
  async update(id: number, updateProductDto: UpdateProductDto) {

    const adminJwt = this.request.admin;
    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser);
    }

    const user = await this.adminRepository.findOne({ where: { id: adminJwt.id } });
    if (!user) throw new NotFoundException('User not found in database');

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!product) throw new NotFoundException(NotFoundMessage.NotFound)



    const original = JSON.parse(JSON.stringify(product));

    for (const key of Object.keys(updateProductDto)) {
      if (updateProductDto[key] !== undefined) {
        product[key] = updateProductDto[key];
      }
    }




    if (updateProductDto.image !== undefined) {
      product.image = Array.isArray(updateProductDto.image)
        ? updateProductDto.image.slice(0, 5)
        : [];
    }


    const before: any = {};
    const after: any = {};

    for (const key of Object.keys(product)) {
      if (JSON.stringify(original[key]) !== JSON.stringify(product[key])) {
        before[key] = original[key];
        after[key] = product[key];
      }
    }


    const saved = await this.productRepository.save(product);
    if (Object.keys(before).length > 0) {
      await this.auditService.log(
        saved.id,
        'UPDATE',
        user.id,
        { before, after },
        'updated product'
      );
    }

    return { message: 'محصول  با  موفقیت ویراش شد', product: saved };
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

    return { message: 'حذف با موفقیت انجام شد' };
  }
}