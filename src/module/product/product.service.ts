import { Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundMessage } from 'src/common/enums/message.enum';
import { throwError } from 'rxjs';


@Injectable({ scope: Scope.REQUEST })


export class ProductService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>
  ) { }



  async createProduct(ProductDto: ProductDto) {
    const user = this.request.user
    if (!user) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser);
    }
    const {
      price, productCode, applicationType, bitumenType, brandRegistrationNumber,
      coatingType, description, dimensions, discountAmount,
      discountPercent, fiberBaseType, image, internationalCode, isogumType, lifespan,
      nationalProductCode, productBenefits, productName,
      quantity, rollWeight, technicalSpecifications, thickness, warranty,

    } = ProductDto


    const product = this.productRepository.create({
      price, productCode, applicationType, bitumenType, brandRegistrationNumber,
      coatingType, description, dimensions, discountAmount,
      discountPercent, fiberBaseType, image, internationalCode, isogumType, lifespan,
      nationalProductCode, productBenefits, productName,
      quantity, rollWeight, technicalSpecifications, thickness, warranty,
      createdBy: user,
    })

    await this.productRepository.save(product)
    return {
      message: "create product successfully"
    }


  }

  async findAll() {
    const products = await this.productRepository.find()
    if (!products) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }
    return products
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }

    const allowedFields = [
      'price', 'productCode', 'applicationType', 'bitumenType', 'brandRegistrationNumber',
      'coatingType', 'description', 'dimensions', 'discountAmount',
      'discountPercent', 'fiberBaseType', 'image', 'internationalCode', 'isogumType',
      'lifespan', 'nationalProductCode', 'productBenefits', 'productName',
      'quantity', 'rollWeight', 'technicalSpecifications', 'thickness', 'warranty'
    ]

    for (const field of allowedFields) {
      if (updateProductDto[field] !== undefined) {
        product[field] = updateProductDto[field]
      }
    }

    await this.productRepository.save(product)

    return {
      message: 'Product updated successfully ',
      product,
    };
  }


  async  remove(id: number) {
    const product= await this.findOne(id)
    await this.productRepository.delete(product)
    
  }
}
