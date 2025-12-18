import { BadRequestException, Inject, Injectable, NotFoundException, Redirect, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';
import { ZarinnpalService } from '../http/zarinnpal.service';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderStatus } from '../order/enum/order.enum';
import * as shortid from 'shortid';
import { OrderItemEntity } from '../order/entities/order-items.entity';
import { REQUEST } from '@nestjs/core';
import {  Request } from 'express';
import { NotFoundMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private orderItemRepository: Repository<OrderItemEntity>,
    @Inject(REQUEST) private request: Request,
    private basketService: BasketService,
    private zarinnpalService: ZarinnpalService,
  ) { }





  // ================= CREATE  =======================

  async create(address: string) {
    const user = this.request.user
    if (!user) {
      throw new BadRequestException(NotFoundMessage.NotFoundUser)
    }
    const basket = await this.basketService.getBasket();
    let order = this.orderRepository.create({
      user: user,
      final_amount: basket.finalAmount,
      total_amount: basket.totalPrice,
      discount_amount: basket.totalDiscountAmount,
      address,
      status: OrderStatus.Pending,
    });
    order = await this.orderRepository.save(order);
    let orderItems = basket.products.map((product) => {
      return {
        orderId: order.id,
        productId: product.id,
        quantity: product?.quantity,
      };
    });
    await this.orderItemRepository.insert(orderItems);
    const { authority, gateWayUrl } = await this.zarinnpalService.sendRequest({
      amount: basket.finalAmount,
      description: "خرید محصولات فیزیکی",
      user,
    });
    let payment = this.paymentRepository.create({
      user: user,
      amount: basket.finalAmount,
      authority,
      invoice_number: shortid.generate(),
      status: false,
    });
    payment = await this.paymentRepository.save(payment);
    order.payment = payment;
    await this.orderRepository.save(order);
    return { gateWayUrl };
  }







  // ================= VERIFY  =======================
  async verify(authority: string, status: string) {
    const payment = await this.paymentRepository.findOne({where:{ authority },relations:['order']})
    if (!payment) throw new NotFoundException("not found payment")
    if (payment.status) throw new BadRequestException("already verified payment")



    if (status === "OK") {
      const order = await this.orderRepository.findOneBy({ id: payment.order.id })
      if (!order) throw new NotFoundException("orderNotFound")
      order.status = OrderStatus.Ordered
      payment.status = true
      await Promise.all([
        this.paymentRepository.save(payment),
        this.orderRepository.save(order)
      ])
      return "http://frontEndUrl/payment/success? order_no=" + order.id
    } else {
      return "http://frontEndUrl/payment/failedUrl"
    }
  }








  async find() {
    return this.paymentRepository.find({
      order: {
        create_at: "DESC"
      }
    })
  }
}
