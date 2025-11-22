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
import { json } from 'stream/consumers';

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
    // const images = Array.isArray(productDto.image) ? productDto.image : [productDto.image]
    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }

    const images = Array.isArray(productDto.image)
      ? productDto.image.filter(Boolean)
      : productDto.image
        ? [productDto.image]
        : [];

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
  async update(id: number, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!product) throw new NotFoundException(NotFoundMessage.NotFound);

    for (const key of Object.keys(updateProductDto)) {
      if (updateProductDto[key] !== undefined) {
        product[key] = updateProductDto[key];
      }
    }

    product.price = Number(product.price) || 0;
    product.quantity = Number(product.quantity) || 0;
    product.rating = Number(product.rating) || 0;
    product.discountAmount = Number(product.discountAmount) || 0;
    product.discountPercent = Number(product.discountPercent) || 0;

    if (!product.image) product.image = [];
    if (updateProductDto.image !== undefined) {
      let incomingImages: string[] = [];

      if (typeof updateProductDto.image === 'string') {
        try {
          incomingImages = JSON.parse(updateProductDto.image);
        } catch (e) {
          console.error('خطا در پارس images:', e);
          incomingImages = [];
        }
      } else if (Array.isArray(updateProductDto.image)) {
        incomingImages = updateProductDto.image;
      }

      product.image = incomingImages
        .filter(url => typeof url === 'string' && url.includes('cloudinary.com'))
        .slice(0, 10);
    }



    const saved = await this.productRepository.save(product);
    return { message: 'Product updated successfully', product: saved };
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