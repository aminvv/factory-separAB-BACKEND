import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { ProductAuditService } from './product-audit.service';
import { computeChanges } from 'src/common/utils/compute-changes.util ';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    private auditService: ProductAuditService,
  ) {}





  // ================= CREATE =================
  async createProduct(productDto: ProductDto) {
    const user = this.request.user;
    if (!user) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }

    const product = this.productRepository.create({
      ...productDto,
      createdBy: user,
    });

    const saved = await this.productRepository.save(product)


    await this.auditService.log(saved.id, 'CREATE', user?.id ?? null, { before: null, after: saved }, 'created product')

    return {
      message: 'Product created successfully',
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
 







  // ================= UPDATE =================
  async update(id: number, updateProductDto: UpdateProductDto) {
    const user = this.request.user as any;
    const product = await this.productRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }


    const importantFields = [
      'price',
      'discountAmount',
      'discountPercent',
      'quantity',
      'productCode',
    ];


    const beforeImportant: any = {};
    for (const field of importantFields) {
      beforeImportant[field] = product[field]
    }

    for (const key of Object.keys(updateProductDto)) {
      if (updateProductDto[key] !== undefined) {
        product[key] = updateProductDto[key];
      }
    }

    const saved = await this.productRepository.save(product)

    const afterImportant: any = {};
    for (const field of importantFields) {
      afterImportant[field] = saved[field]
    }

    const changes = computeChanges(beforeImportant, afterImportant, importantFields)

    if (Object.keys(changes).length > 0) {
      await this.auditService.log(
        saved.id,
        'UPDATE',
        user?.id ?? null,
        changes,
        'updated product',
      );
    }

    return {
      message: 'Product updated successfully',
      product: saved,
    };
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
