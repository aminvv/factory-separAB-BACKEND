
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
    @Column()
    productId: number
    @Column({ nullable: true })
    quantity: number

        @Column({ type: "decimal", precision: 12, scale: 2, default: 0 }) // اضافه کن
    price: number;


    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    order: OrderEntity
    @ManyToOne(() => ProductEntity, (product) => product.orderItems)
    product: ProductEntity


}