
import { Column, Entity, ManyToOne } from "typeorm";
import { OrderStatus } from "../enum/order.enum";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";


@Entity(EntityName.OrderItem)
export class OrderItemEntity extends BaseEntityCustom {
    @Column()
    orderId: number
    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
    status: string
    @Column()
    productId: number
    @Column({ nullable: true })
    quantity: number


    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    order: OrderEntity
    @ManyToOne(() => ProductEntity, (product) => product.orderItems)
    product: ProductEntity


}