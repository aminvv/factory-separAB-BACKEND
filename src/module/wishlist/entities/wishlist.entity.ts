import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { UserEntity } from "src/module/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity(EntityName.Wishlist)
@Unique(['user', 'product'])
export class WishlistEntity extends BaseEntityCustom {

  @ManyToOne(() => UserEntity, user => user.wishlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, product => product.wishlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @CreateDateColumn()
  created_at: Date;
}