import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BasketService } from '../basket/basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from '../basket/entities/basket.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BasketEntity])],
  controllers: [PaymentController],
  providers: [PaymentService,BasketService],
})
export class PaymentModule {}
