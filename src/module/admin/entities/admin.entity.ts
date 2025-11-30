import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { CommentsEntity } from "src/module/blog/entities/comment.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";



@Entity(EntityName.Admin)
export class AdminEntity extends BaseEntityCustom {
    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: "admin" })
    role: string

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

    @OneToMany(() => ProductEntity, (product) => product.createdBy)
    products: ProductEntity[]

        @OneToMany(()=>CommentsEntity,comment=>comment.user,{cascade:true})
        blog_comments:CommentsEntity[]
}
