import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, } from "typeorm";
import { ProductDetailEntity } from "./product-detail.entity";



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

    @Column('text', { default: 0 })
    status: string

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    discountPercent: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    discountAmount: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column("text", { array: true, nullable: true })
    image: string[];

    @CreateDateColumn()
    create_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.products, { eager: true })
    createdBy: UserEntity;



    @OneToMany(() => ProductDetailEntity, detail => detail.product)
    details: ProductDetailEntity[]
}
