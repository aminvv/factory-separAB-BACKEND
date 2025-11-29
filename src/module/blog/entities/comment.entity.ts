import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { UserEntity } from "src/module/user/entities/user.entity";
import { BlogEntity } from "./blog.entity";

@Entity(EntityName.BlogComments)
export class CommentsEntity extends BaseEntityCustom {

   @Column()
   userId: number

   @Column()
   blogId: number

   @Column()
   text: string


   @CreateDateColumn()
   created_at: Date




   @ManyToOne(() => UserEntity, user => user.blog_comments, { onDelete: "CASCADE" })
   @JoinColumn({ name: "blogId" })
   user: UserEntity;
   
   
   @ManyToOne(() => BlogEntity, blog => blog.comments, { onDelete: "CASCADE" })
   @JoinColumn({ name: "userId" })
   blog: BlogEntity;
}

