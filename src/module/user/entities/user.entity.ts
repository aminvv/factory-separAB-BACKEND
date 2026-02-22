import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom"
import { EntityName } from "src/common/enums/entity.enum"
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, } from "typeorm"
import { Roles } from "src/common/enums/roles.enum"
import { CommentsEntity } from "src/module/blog/entities/comment.entity"
import { BasketEntity } from "src/module/basket/entities/basket.entity"
import { OrderEntity } from "src/module/order/entities/order.entity"
import { PaymentEntity } from "src/module/payment/entities/payment.entity"
import { AddressEntity } from "src/module/address/entities/address.entity";
import { AdminEntity } from "src/module/admin/entities/admin.entity"



@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {

    @Column({ nullable: true, })
    firstName: string

    @Column({ nullable: true, })
    lastName: string

    @Column({ nullable: true, unique: true })
    mobile: string

    @Column({ enum: Roles, default: Roles.User })
    role: Roles

    @CreateDateColumn()
    create_at: Date

    @Column({ nullable: true })
    last_login: Date;

    @OneToMany(() => CommentsEntity, comment => comment.user, { cascade: true })
    blog_comments: CommentsEntity[]

    @OneToMany(() => OrderEntity, order => order.user, { cascade: true })
    orders: OrderEntity[]

    @OneToMany(() => PaymentEntity, payment => payment.user, { cascade: true })
    payments: PaymentEntity[]

    @OneToMany(() => BasketEntity, (basket) => basket.user)
    baskets: BasketEntity[];


    @OneToMany(() => AddressEntity, address => address.user, { cascade: true })
    addresses: AddressEntity[];


    @OneToOne(() => AdminEntity, (admin) => admin.user)

    admin: AdminEntity

}
