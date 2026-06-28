import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn, } from "typeorm";
import { ProductDetailEntity } from "./product-detail.entity";
import { AdminEntity } from "src/module/admin/entities/admin.entity";
import { BasketEntity } from "src/module/basket/entities/basket.entity";
import { OrderItemEntity } from "src/module/order/entities/order-items.entity";
import { DiscountEntity } from "src/module/discount/entities/discount.entity";
import { SaleType } from "../enums/SaleType.enum";
import { IsString } from "class-validator";
import { CommentsEntity } from "./comment.entity";
import { WishlistEntity } from "src/module/wishlist/entities/wishlist.entity";



@Entity(EntityName.Product)
export class ProductEntity extends BaseEntityCustom {
    @Column({ unique: true })
    productCode: string;

    @Column({ nullable: true })
    productName: string;

    @Column({ type: 'int', default: 0 })
    price: number;

    @Column('int', { default: 0 })
    quantity: number;

    @Column('decimal', { precision: 10, scale: 1, default: 0 })
    rating: number;

    @Column()
    slug: string


    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    image: { url: string; publicId: string }[];

    @Column({ type: 'varchar', length: 50, nullable: true })
    lifespan: string;

    @Column({ nullable: true })
    @IsString()
    weight: string;

    @Column({ nullable: true })
    @IsString()
    thickness: string;

    @Column({ type: 'enum', enum: SaleType, default: SaleType.CASH })
    saleType: SaleType;

    @Column({ nullable: true })
    @IsString()
    deliveryTime: string;

    @Column({ nullable: true })
    @IsString()
    deliveryCost: string;

    @Column({ type: 'boolean', default: true })
    returnable: boolean;

    @Column({ type: 'boolean', default: false })
    insurance: boolean;

    @Column({ type: 'bool', default: true })
    status: boolean;


    @CreateDateColumn()
    create_at: Date;


    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(() => AdminEntity, (user) => user.products, { eager: true })
    createdBy: AdminEntity;



    @OneToMany(() => ProductDetailEntity, detail => detail.product, { cascade: true, eager: true, })
    details: ProductDetailEntity[]


    @OneToMany(() => BasketEntity, basket => basket.product, { cascade: true, eager: true, })
    baskets: BasketEntity[]

    @OneToMany(() => OrderItemEntity, orderItems => orderItems.product, { cascade: true, onDelete: 'SET NULL' })
    orderItems: OrderItemEntity[]

    @OneToMany(() => DiscountEntity, discount => discount.products, { cascade: true, eager: true, })
    discounts: DiscountEntity[];

    @OneToMany(() => CommentsEntity, comment => comment.product, { cascade: true, eager: true, })
    comments: CommentsEntity[];

    @OneToMany(() => WishlistEntity, w => w.product)
    wishlists: WishlistEntity[];

}
