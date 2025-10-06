import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom"
import { EntityName } from "src/common/enums/entity.enum"
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne } from "typeorm"
import { OtpEntity } from "./otp.entity"



@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ nullable: true, unique: true })
    mobile: string



    @CreateDateColumn()
    create_at: Date

}
