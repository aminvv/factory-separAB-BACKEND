import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom"
import { EntityName } from "src/common/enums/entity.enum"
import { Column, CreateDateColumn, Entity,  OneToMany,  } from "typeorm"
import { OtpEntity } from "./otp.entity"
import { ProductEntity } from "src/module/product/entities/product.entity"



@Entity(EntityName.User)
export class UserEntity extends BaseEntityCustom {

    @Column({nullable: true,})
    firstName: string

    @Column({nullable: true,})
    lastName: string

    @Column({ nullable: true, unique: true })
    mobile: string

    @CreateDateColumn()
    create_at: Date

    @OneToMany(()=>ProductEntity,(product)=>product.createdBy)
    products:ProductEntity[]

}
