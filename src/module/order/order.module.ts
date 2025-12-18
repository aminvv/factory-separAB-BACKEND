import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-items.entity';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports:[TypeOrmModule.forFeature([OrderEntity,OrderItemEntity]),ProductModule,DiscountModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService,TypeOrmModule]
})
export class OrderModule {}
