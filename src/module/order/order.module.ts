import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-items.entity';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { AuthModule } from '../auth/auth.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './Invoice.service';

@Module({
  imports:[TypeOrmModule.forFeature([OrderEntity,OrderItemEntity]),ProductModule,DiscountModule,AuthModule],
  controllers: [OrderController,InvoiceController],
  providers: [OrderService,InvoiceService],
  exports:[OrderService,TypeOrmModule,InvoiceService]
})
export class OrderModule {}
