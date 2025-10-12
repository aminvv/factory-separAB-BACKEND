import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, } from "typeorm";



@Entity(EntityName.Product)
export class ProductEntity extends BaseEntityCustom {
    @Column({ unique: true })
    productCode: string

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    rollWeight: number

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    thickness: number

    @Column({ nullable: true })
    dimensions: string

    @Column({ nullable: true })
    lifespan: string

    @Column({ nullable: true })
    bitumenType: string

    @Column({ nullable: true })
    warranty: string

    @Column("text", { array: true, nullable: true })
    image: string[]

    @Column('decimal', { precision: 12, scale: 2 })
    price: number

    @Column('int', { default: 0 })
    quantity: number

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    discountPercent: number

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    discountAmount: number

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ nullable: true })
    productName: string

    @Column({ nullable: true })
    nationalProductCode: string

    @Column({ nullable: true })
    fiberBaseType: string
    @Column({ nullable: true })
    internationalCode: string

    @Column({ nullable: true })
    brandRegistrationNumber: string;

    @Column({ nullable: true })
    coatingType: string

    @Column({ type: 'text', nullable: true })
    productBenefits: string

    @Column({ nullable: true })
    applicationType: string;

    @Column({ nullable: true })
    isogumType: string

    @Column({ type: 'text', nullable: true })
    technicalSpecifications: string;


    @CreateDateColumn()
    create_at: Date

    @ManyToOne(() => UserEntity, (user) => user.products, { eager: true })
    createdBy: UserEntity;
}
