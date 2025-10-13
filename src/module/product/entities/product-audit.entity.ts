// src/product/entities/product-audit.entity.ts
import { EntityName } from 'src/common/enums/entity.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

@Entity(EntityName.Product_Audit)
export class ProductAuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  productId: number;

  @Column({ type: 'varchar', length: 20 })
  action: AuditAction;

  @Column({ nullable: true })
  performedBy?: number;


  @Column({ type: 'text', nullable: true })
  note?: string;

 
  @Column({ type: 'json', nullable: true })
  changes?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
