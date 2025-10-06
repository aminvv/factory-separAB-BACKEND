import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";



@Entity(EntityName.Otp)
export class OtpEntity extends BaseEntityCustom{
    @Column()
    code:string
  

    @Column({nullable:true, unique:true})
    mobile:string

    @Column()
    expiresIn:Date
    

}