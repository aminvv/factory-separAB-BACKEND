import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { AddDetailDto, UpdateAddDetailDto } from './dto/detail.dto';

@Injectable()
export class ProductDetailService {
    constructor(
        @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
        private productService: ProductService

    ) { }




    async create(detailDto: AddDetailDto) {
        const { key, productId, value } = detailDto
        if (!productId) {
            throw new BadRequestException('productId is required');
        }
        await this.productService.findOne(productId)
        await this.productDetailRepository.insert({
            key,
            value,
            productId,
        })

        return {
            message: "create detail of product successfully"
        }
    }











    async update(id: number, updateAddDetailDto: UpdateAddDetailDto) {
        const { key, productId, value } = updateAddDetailDto;
        const detail = await this.findOne(id);

        if (!detail) {
            throw new NotFoundException(`Detail with id ${id} not found`)
        }

        if (productId) {
            await this.productService.findOne(productId)
            detail.productId = productId
        }

        if (key) detail.key = key;
        if (value) detail.value = value;

        await this.productDetailRepository.save(detail);

        return {
            message: "Update detail of product successfully",
        };
    }


    async find(productId: number) {
        return this.productDetailRepository.find({
            where: { productId },
        })
    }

    async findOne(id: number) {
        const detail = this.productDetailRepository.findOne({
            where: { id },
        })
        if (!detail) {
            throw new NotFoundException()
        }
        return detail
    }

    async delete(id: number) {
        await this.findOne(id)
        await this.productDetailRepository.delete(id)
        return {
            message: "Deleted detail of product successfully"
        }
    }

}
