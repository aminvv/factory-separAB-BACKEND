import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Roles } from "src/common/enums/roles.enum";
import { CommentsEntity } from "src/module/blog/entities/comment.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";



@Entity(EntityName.Admin)
export class AdminEntity extends BaseEntityCustom {
    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ type:"enum", enum:Roles, default: Roles.Admin })
    role: Roles

    @Column({ nullable: true })
    fullName: string

    @Column({ nullable: true })
    avatar: string

    @Column({ default: true })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleted_at: Date

    @OneToMany(() => ProductEntity, (product) => product.createdBy)
    products: ProductEntity[]

    @OneToMany(() => CommentsEntity, comment => comment.user, { cascade: true })
    blog_comments: CommentsEntity[]


    @OneToOne(() => UserEntity, (user) => user.admin)
    user: UserEntity
}
