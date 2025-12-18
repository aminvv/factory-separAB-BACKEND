import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { BasketEntity } from './entities/basket.entity';
import { ProductModule } from '../product/product.module';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { DiscountService } from '../discount/discount.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[ProductModule,AuthModule,TypeOrmModule.forFeature([DiscountEntity,BasketEntity,])],
  controllers: [BasketController],
  providers: [BasketService,DiscountService],
  exports:[BasketService,TypeOrmModule]
})
export class BasketModule {}
