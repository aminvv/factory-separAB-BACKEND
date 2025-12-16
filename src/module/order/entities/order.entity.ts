import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { OrderStatus } from "../enum/order.enum";
import { OrderItemEntity } from "./order-items.entity";
import { PaymentEntity } from "src/module/payment/entities/payment.entity";


@Entity(EntityName.Order)
export class OrderEntity extends BaseEntityCustom {
    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
    status: string
    @Column()
    address: string
    @Column({ nullable: true })
    paymentId: number
    @Column()
    total_amount: number
    @Column()
    final_amount: number
    @Column()
    discount_amount: number
    @CreateDateColumn()
    create_at: Date

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order,{onDelete:"CASCADE"})
    orderItems: OrderItemEntity
    @OneToOne(() => PaymentEntity, (payment) => payment.order,{onDelete:"SET NULL"})
    @JoinColumn()
    payment: PaymentEntity
}
