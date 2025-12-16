
import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom"
import { EntityName } from "src/common/enums/entity.enum"
import { OrderEntity } from "src/module/order/entities/order.entity"
import { Column, CreateDateColumn, Entity, OneToOne } from "typeorm"

@Entity(EntityName.Payment)
export class PaymentEntity extends BaseEntityCustom {
    @Column()
    amount:number
    @Column({default:false})
    status:boolean
    @Column({unique:true})
    invoice_number:string
    @Column({nullable:true})
    refId:string
    @Column({nullable:true})
    authority:string
    @Column()
    orderId:number
    @CreateDateColumn()
    create_at:Date

    @OneToOne(() => OrderEntity, (order) => order.payment,{onDelete:"CASCADE"})
    order: OrderEntity
}
