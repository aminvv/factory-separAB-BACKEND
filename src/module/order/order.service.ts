import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/order.enum';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @Inject(REQUEST) private request: Request
  ) { }

  // ===============  GET ALL FOR ADMIN =========================
  getAllForAdmin() {
    return this.orderRepository.find({
      relations: {
        user: true,
        payment: true,
        shippingAddress: true,
        orderItems: {
          product: true
        }
      },
      order: {
        create_at: 'DESC',
      },
    });
  }

  // ===============  FIND BY ID ORDER =========================
  async findById(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        user: true,
        shippingAddress: true,
        payment: true,
        orderItems: {
          product: true,
        },
      },
    });
    if (!order) throw new NotFoundException("order not found");
    return order;
  }




  // ===============   ADVANCE STATUS =========================
  async advanceStatus(orderId: number) {
    const order = await this.findById(orderId);

    const nextStatusFlow = {
      [OrderStatus.Pending]: OrderStatus.Ordered,
      [OrderStatus.Ordered]: OrderStatus.InProcess,
      [OrderStatus.InProcess]: OrderStatus.Packed,
      [OrderStatus.Packed]: OrderStatus.InTransit,
      [OrderStatus.InTransit]: OrderStatus.Delivered,
    };

    const nextStatus = nextStatusFlow[order.status];
    if (!nextStatus) {
      throw new BadRequestException("cannot advance from current status");
    }

    order.status = nextStatus;
    await this.orderRepository.save(order);
    return { message: "status advanced", status: nextStatus };
  }




  // ===============  REVERT STATUS =========================
  async revertStatus(orderId: number) {
    const order = await this.findById(orderId);

    const prevStatusFlow = {
      [OrderStatus.InProcess]: OrderStatus.Ordered,
      [OrderStatus.Packed]: OrderStatus.InProcess,
      [OrderStatus.InTransit]: OrderStatus.Packed,
      [OrderStatus.Delivered]: OrderStatus.InTransit,
    };

    const prevStatus = prevStatusFlow[order.status];
    if (!prevStatus) {
      throw new BadRequestException("cannot revert from current status");
    }

    order.status = prevStatus;
    await this.orderRepository.save(order);
    return { message: "status reverted", status: prevStatus };
  }



  // ===============  CANCEL ORDER =========================
  async cancel(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status === OrderStatus.Canceled || order.status === OrderStatus.Delivered) {
      throw new BadRequestException("cannot cancel this order");
    }

    order.status = OrderStatus.Canceled;
    await this.orderRepository.save(order);
    return { message: "order canceled successfully" };
  }












  // ===============  FIND BY ID FOR USER =========================
  async findByIdForUser(orderId: number) {
    const userId = this.request.user?.id
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: {
        user: true,
        shippingAddress: true,
        payment: true,
        orderItems: {
          product: true,
        },
      },
    });
    if (!order) throw new NotFoundException('سفارش یافت نشد');
    return order;
  }





  // ===============  GET ALL FOR USER =========================
  async getAllForUser() {
    const userId = this.request.user?.id;
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: {
        payment: true,
        shippingAddress: true,
        orderItems: {
          product: true,
        },
      },
      order: { create_at: 'DESC' },
    });
  }


}
