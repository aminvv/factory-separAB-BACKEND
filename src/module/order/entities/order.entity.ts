import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderStatus } from "../enum/order.enum";
import { OrderItemEntity } from "./order-items.entity";
import { PaymentEntity } from "src/module/payment/entities/payment.entity";
import { UserEntity } from "src/module/user/entities/user.entity";


@Entity(EntityName.Order)
export class OrderEntity extends BaseEntityCustom {
    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
    status: string
    @Column()
    address: string

    @Column()
    total_amount: number
    @Column()
    final_amount: number
    @Column()
    discount_amount: number
    @CreateDateColumn()
    create_at: Date

    @ManyToOne(() => UserEntity, user => user.orders)
    user: UserEntity;

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, { onDelete: "CASCADE" })
    orderItems: OrderItemEntity

    @OneToOne(() => PaymentEntity, (payment) => payment.order, { onDelete: "SET NULL" })
    @JoinColumn()
    payment: PaymentEntity
}
