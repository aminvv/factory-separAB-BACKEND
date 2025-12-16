import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, } from "typeorm";
import { ProductDetailEntity } from "./product-detail.entity";
import { AdminEntity } from "src/module/admin/entities/admin.entity";
import { BasketEntity } from "src/module/basket/entities/basket.entity";
import { OrderItemEntity } from "src/module/order/entities/order-items.entity";



@Entity(EntityName.Product)
export class ProductEntity extends BaseEntityCustom {
    @Column({ unique: true })
    productCode: string;

    @Column({ nullable: true })
    productName: string;

    @Column('decimal', { precision: 12, scale: 2 })
    price: number;

    @Column('int', { default: 0 })
    quantity: number;

    @Column('int', { default: 0 })
    rating: number

    @Column({ nullable: false, default: false })
    active_discount: boolean

    @Column()
    slug: string

    @Column({ type: "decimal", nullable: true, default: 0 })
    discount: number

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    image: { url: string; publicId: string }[];


    @Column({ type: 'bool', default: true })
    status: boolean;


    @CreateDateColumn()
    create_at: Date;

    @ManyToOne(() => AdminEntity, (user) => user.products, { eager: true })
    createdBy: AdminEntity;



    @OneToMany(() => ProductDetailEntity, detail => detail.product, { cascade: true, eager: true, })
    details: ProductDetailEntity[]


    @OneToMany(() => BasketEntity, basket => basket.product, { cascade: true, eager: true, })
    baskets: BasketEntity[]

    @OneToMany(() => OrderItemEntity, orderItems => orderItems.product)
    orderItems: OrderItemEntity[]
}
