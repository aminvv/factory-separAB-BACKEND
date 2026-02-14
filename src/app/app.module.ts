import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { AddressModule } from 'src/module/address/address.module';
import { AuthModule } from 'src/module/auth/auth.module';
import { BasketModule } from 'src/module/basket/basket.module';
import { BlogModule } from 'src/module/blog/blog.module';
import { DiscountModule } from 'src/module/discount/discount.module';
import { HttpApiModule } from 'src/module/http/http.module';
import { OrderModule } from 'src/module/order/order.module';
import { PaymentModule } from 'src/module/payment/payment.module';
import { ProductModule } from 'src/module/product/product.module';
import { UserModule } from 'src/module/user/user.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    ProductModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    BlogModule,
    OrderModule,
    UserModule,
    AddressModule,
    HttpApiModule
  ],
  providers: [ CloudinaryService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected');
    } else {
      console.log('❌ Database not connected');
    }



  }
}
