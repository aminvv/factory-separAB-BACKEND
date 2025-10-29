import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";



@Entity(EntityName.Product)
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
}
