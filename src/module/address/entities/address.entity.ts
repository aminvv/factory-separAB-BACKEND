import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/module/user/entities/user.entity";
import { OrderEntity } from "src/module/order/entities/order.entity";

@Entity(EntityName.Address)
export class AddressEntity extends BaseEntityCustom {

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  postalCode: string;

  @Column({ nullable: true })
  plaque: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => UserEntity, user => user.addresses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @OneToMany(() => OrderEntity, order => order.shippingAddress)
  orders: OrderEntity[];
}
