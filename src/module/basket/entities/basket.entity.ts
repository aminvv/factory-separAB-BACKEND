

import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { DiscountEntity } from "src/module/discount/entities/discount.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityName.Basket)
export class BasketEntity extends BaseEntityCustom {

    @Column({ nullable: true })
    productId: number | null;

    @Column({ nullable: true })
    discountId: number | null;

    @Column()
    quantity: number;

    @Column()
    userId: number;


    @ManyToOne(() => ProductEntity, (product) => product.baskets, { onDelete: "CASCADE" })
    product: ProductEntity;

    @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, { onDelete: "CASCADE", })
    discount: DiscountEntity;

    @ManyToOne(() => UserEntity, (user) => user.baskets, { onDelete: "CASCADE" })
    user: UserEntity;
}


