
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";

@Entity(EntityName.ProductDetail)
export class ProductDetailEntity extends BaseEntityCustom {
    @Column()
    productId: number
    @Column()
    key: string
    @Column()
    value: string

    @ManyToOne(() => ProductEntity, product => product.details, { onDelete: 'CASCADE' })
    @JoinColumn({name:"productId"})
    product: ProductEntity;
}
