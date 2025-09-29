import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom"
import { EntityName } from "src/common/enums/entity.enum"
import { Column, CreateDateColumn, Entity } from "typeorm"



@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column()
    username:string

    @Column()
    email:string

    @Column()
    password:string

    @CreateDateColumn()
    create_at:Date
}
