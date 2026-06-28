import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-items.entity';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { AuthModule } from '../auth/auth.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './Invoice.service';
import { OrderUserController } from './order-user.controller';
import { OrderAdminController } from './order-admin.controller';


@Module({
  imports:[TypeOrmModule.forFeature([OrderEntity,OrderItemEntity]),ProductModule,DiscountModule,AuthModule],
  controllers: [OrderAdminController,InvoiceController,OrderUserController],
  providers: [OrderService,InvoiceService],
  exports:[OrderService,TypeOrmModule,InvoiceService]
})
export class OrderModule {}
