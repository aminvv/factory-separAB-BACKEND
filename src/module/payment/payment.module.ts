import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BasketService } from '../basket/basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from '../basket/entities/basket.entity';
import { BasketModule } from '../basket/basket.module';
import { HttpApiModule } from '../http/http.module';
import { OrderModule } from '../order/order.module';
import { PaymentEntity } from './entities/payment.entity';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BasketEntity,PaymentEntity,UserEntity]),BasketModule,HttpApiModule,OrderModule,AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
 