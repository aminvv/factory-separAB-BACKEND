import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom"
import { EntityName } from "src/common/enums/entity.enum"
import { Column, CreateDateColumn, Entity, OneToMany, } from "typeorm"
import { Roles } from "src/common/enums/roles.enum"
import { CommentsEntity } from "src/module/blog/entities/comment.entity"
import { BasketEntity } from "src/module/basket/entities/basket.entity"



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


    @OneToMany(() => CommentsEntity, comment => comment.user, { cascade: true })
    blog_comments: CommentsEntity[]

    @OneToMany(() => BasketEntity, (basket) => basket.user)
    baskets: BasketEntity[];


}
