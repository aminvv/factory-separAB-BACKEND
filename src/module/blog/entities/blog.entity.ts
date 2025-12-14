import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { CommentsEntity } from "./comment.entity";



@Entity(EntityName.blog)
export class BlogEntity extends BaseEntityCustom {

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    content: string

    @Column()
    slug: string


    @Column()
    category: string

    @Column()
    status: string

    @Column({ type: 'json', nullable: true })
    thumbnail: { url: string; publicId: string }[];


    @CreateDateColumn()
    create_at: Date
    @UpdateDateColumn()
    update_at: Date



    @OneToMany(() => CommentsEntity, comment => comment.blog, { cascade: true })
    comments: CommentsEntity[]

}
