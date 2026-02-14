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
import { Request } from 'express';
import { NotFoundMessage } from 'src/common/enums/message.enum';
import { ProductService } from '../product/services/product.service';
import { DiscountService } from '../discount/discount.service';
import { BasketEntity } from '../basket/entities/basket.entity';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { AddressEntity } from '../address/entities/address.entity';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
    @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
    @InjectRepository(AddressEntity) private addressRepository: Repository<AddressEntity>,
    @Inject(REQUEST) private request: Request,
    private basketService: BasketService,
    private productService: ProductService,
    private zarinnpalService: ZarinnpalService,
    private discountService: DiscountService,
  ) { }





  // ================= CREATE  =======================

  async create(addressId?: number) {
    const user = this.request.user;
    if (!user) {
      throw new BadRequestException('کاربر یافت نشد');
    }

    let address: AddressEntity | null = null;

    if (addressId) {
      address = await this.addressRepository.findOne({
        where: { id: addressId, user: { id: user.id } }
      });
      if (!address) {
        throw new BadRequestException('آدرس انتخاب شده معتبر نیست');
      }
    } else {
      address = await this.addressRepository.findOne({
        where: { user: { id: user.id }, isDefault: true }
      });
      if (!address) {
        throw new BadRequestException('لطفاً یک آدرس پیش‌فرض انتخاب کنید');
      }
    }



    const basket = await this.basketService.getBasket();

    const order = await this.orderRepository.save({
      user,
      final_amount: basket.finalAmount,
      total_amount: basket.totalPrice,
      discount_amount: basket.totalDiscountAmount,
      shippingAddress: address,
      status: OrderStatus.Pending,
    });
    await this.orderRepository.save(order);

    // لاگ اضافه کن
    const orderItems = basket.products.map(product => ({
      orderId: order.id,
      productId: product.id,
      quantity: product.quantity,
      price: product.price,
    }));

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
    const payment = await this.paymentRepository.findOne({
      where: { authority },
      relations: ['order', 'order.user']
    });


    if (!payment) throw new NotFoundException("not found payment");
    if (payment.status) throw new BadRequestException("already verified payment");

    if (status === "OK") {
      const order = await this.orderRepository.findOne({
        where: { id: payment.order.id }
      });

      if (!order) throw new NotFoundException("orderNotFound");

      const userId = payment.order.user.id;

      const basketItems = await this.basketRepository.find({
        where: { userId },
        relations: ['discount']
      });
      const orderItems = await this.orderItemRepository.find({
        where: { orderId: order.id }
      });

      order.status = OrderStatus.Ordered;
      payment.status = true;

      for (const item of orderItems) {
        await this.productService.decreaseQuantity(item.productId, item.quantity);
      }
      for (const item of basketItems) {
        if (item.discountId) {
          try {
            await this.discountService.increaseDiscountUsage(item.discountId);
          } catch (error) {
            console.warn(`تخفیف ${item.discountId} قابل افزایش نبود:`, error.message);
          }

          const discount = await this.discountRepository.findOneBy({ id: item.discountId });
          if (discount) {
            const usedByUsers = discount.usedByUsers || [];
            if (!usedByUsers.includes(userId.toString())) {
              usedByUsers.push(userId.toString());
              discount.usedByUsers = usedByUsers;
              await this.discountRepository.save(discount);
            }
          }
        }
      }

      if (payment.order?.user?.id) {
        await this.clearUserBasket(payment.order.user.id);
      }





      await this.paymentRepository.save(payment);
      await this.orderRepository.save(order);

      return `http://frontEndUrl/payment/success?order_no=${order.id}`;
    } else {
      return "http://frontEndUrl/payment/failedUrl";
    }
  }





  async find() {
    return this.paymentRepository.find({
      order: {
        create_at: "DESC"
      }
    })
  }



  private async clearUserBasket(userId: number) {
    try {
      await this.basketService.clearBasketForUser(userId);
    } catch (error) {
      console.error("خطا در پاک کردن سبد خرید:", error);
    }
  }
}
