import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { UserEntity } from "src/module/user/entities/user.entity";
import { BlogEntity } from "./blog.entity";
import { AdminEntity } from "src/module/admin/entities/admin.entity";

@Entity(EntityName.BlogComments)
export class CommentsEntity extends BaseEntityCustom {

    @Column({ nullable: true })
    userId?: number | null;

    @Column({ nullable: true })
    AdminId?: number | null;

    @Column()
    blogId: number

    @Column()
    text: string

    @Column({ nullable: true })
    parentId: number | null = null;

    @Column({ default: false })
    accepted: boolean

    @CreateDateColumn()
    created_at: Date


    @ManyToOne(() => CommentsEntity, parent => parent.children, { onDelete: "CASCADE" })
    parent: CommentsEntity
    @OneToMany(() => CommentsEntity, comment => comment.parent)
    @JoinColumn({ name: "parent" })
    children: CommentsEntity[]


    @ManyToOne(() => UserEntity, user => user.blog_comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @ManyToOne(() => AdminEntity, user => user.blog_comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "AdminId" })
    admin: AdminEntity

    @ManyToOne(() => BlogEntity, blog => blog.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "blogId" })
    blog: BlogEntity;

}

