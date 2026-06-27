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
import axios from 'axios';


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


    const orderItems = basket.products.map(product => ({
      orderId: order.id,
      productId: product.id,
      quantity: product.quantity,
      price: product.finalPrice,
    }));

    await this.orderItemRepository.insert(orderItems);



    const { authority, gateWayUrl } = await this.zarinnpalService.sendRequest({
      amount: basket.finalAmount,
      description: "خرید محصولات فیزیکی",
      user,
    });

    const generateNumericInvoice = (): string => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(1000 + Math.random() * 9000);
      return `${timestamp}${random}`;
    };


    let payment = this.paymentRepository.create({
      user: user,
      amount: basket.finalAmount,
      authority,
      invoice_number: generateNumericInvoice(),
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
      relations: ['order', 'order.user'],
    });

    if (!payment) throw new NotFoundException('پرداخت یافت نشد');
    if (payment.status) throw new BadRequestException('پرداخت قبلاً تایید شده');

    if (status !== 'OK') {
      return `${process.env.FRONTEND_URL}/payment/failedUrl?authority=${authority}`;
    }

    // ← تایید با زرین‌پال
    const response = await axios.post(
      'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
      {
        merchant_id: process.env.ZARINNPAL_MERCHANT_ID,
        amount: payment.amount,
        authority,
      }
    );

    const code = response.data.data.code;
    if (code !== 100 && code !== 101) {
      throw new BadRequestException('پرداخت تایید نشد');
    }

    const order = await this.orderRepository.findOne({
      where: { id: payment.order.id },
    });
    if (!order) throw new NotFoundException('سفارش یافت نشد');

    const userId = payment.order.user.id;

    const basketItems = await this.basketRepository.find({
      where: { userId },
      relations: ['discount'],
    });

    const orderItems = await this.orderItemRepository.find({
      where: { orderId: order.id },
    });

    order.status = OrderStatus.Ordered;
    payment.status = true;
    payment.refId = response.data.data.ref_id;

    // کاهش موجودی
    for (const item of orderItems) {
      await this.productService.decreaseQuantity(item.productId, item.quantity);
    }

    // افزایش استفاده از تخفیف
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

    // پاک کردن سبد
    await this.clearUserBasket(userId);

    // ذخیره
    await this.orderRepository.save(order);
    await this.paymentRepository.save(payment);

    return `${process.env.FRONTEND_URL}/payment/success?order_no=${order.id}`;
  }



  // ================= FIND  =======================
  async find() {
    return this.paymentRepository.find({
      relations: {
        order: {
          orderItems: {
            product: true
          }
        },
        user: true
      },
      order: {
        create_at: 'DESC'
      }
    });
  }


  // =================  CLEAR USER BASKET  =======================
  private async clearUserBasket(userId: number) {
    try {
      await this.basketService.clearBasketForUser(userId);
    } catch (error) {
      console.error("خطا در پاک کردن سبد خرید:", error);
    }
  }







  async findByAuthority(authority: string) {
    const userId=this.request.user?.id
    const payment = await this.paymentRepository.findOne({
      where: { authority, order: { user: { id: userId } } },
      relations: ['order', 'order.user', 'order.shippingAddress', 'order.orderItems', 'order.orderItems.product', 'order.payment',],
    });
    if (!payment) throw new NotFoundException('پرداخت یافت نشد');
    return payment.order;
  }















}




