import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAuditEntity } from './entities/product-audit.entity';

@Injectable()
export class ProductAuditService {
  constructor(
    @InjectRepository(ProductAuditEntity)
    private auditRepository: Repository<ProductAuditEntity>,
  ) {}

  async log(productId: number, action: 'CREATE' | 'UPDATE' | 'DELETE', performedBy?: number, changes?: any, note?: string) {
    const entry = this.auditRepository.create({
      productId,
      action,
      performedBy,
      changes,
      note,
    });
    return this.auditRepository.save(entry)
  }
}
