import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { AdminEntity } from "src/module/admin/entities/admin.entity";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
@Entity(EntityName.Image)
export class ImageEntity extends BaseEntityCustom {
    @Column()
    name: string
    @Column()
    location: string
    @Column()
    alt: string
    @Column()
    adminId: number
    @CreateDateColumn()
    create_at: Date
    @ManyToOne(() => AdminEntity, (admin) => admin.images, { onDelete: "CASCADE" })
    admin: AdminEntity
}