import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { DiscountType } from "../enum/type.enum";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { BasketEntity } from "src/module/basket/entities/basket.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";

@Entity(EntityName.Discount)
export class DiscountEntity extends BaseEntityCustom {
  @Column({ type: 'varchar', nullable: true, unique: true })
  code: string | null
  @Column({ nullable: true, type: "decimal" })
  percent: number
  @Column({ nullable: true, type: "decimal" })
  amount: number
  @Column({ nullable: true })
  limit: number
  @Column({ nullable: true, default: 0 })
  usage: number
  @Column({ type: "timestamp", nullable: true })
  expires_in: Date
  @Column({ type: 'int', nullable: true })
  productId: number | null
  @Column({ type: "enum", enum: DiscountType })
  type: string

  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets: BasketEntity[];

  @ManyToOne(() => ProductEntity, product => product.discounts,{nullable:true,onDelete: "CASCADE"})
  @JoinColumn({ name: 'productId' }) 
  products: ProductEntity;

}

