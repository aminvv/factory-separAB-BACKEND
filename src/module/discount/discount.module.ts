import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports:[TypeOrmModule.forFeature([DiscountEntity,ProductEntity]),ProductModule],
  controllers: [DiscountController],
  providers: [DiscountService,],
})
export class DiscountModule {}
