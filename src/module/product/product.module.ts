import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductAuditEntity } from './entities/product-audit.entity';
import { ProductDetailController } from './controllers/product-detail.controller';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { AdminEntity } from '../admin/entities/admin.entity';
import { ProductController } from './controllers/product.controller';
import { ProductAuditService } from './services/product-audit.service';
import { ProductDetailService } from './services/product-detail.service';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity,UserEntity,ProductAuditEntity,ProductDetailEntity ,AdminEntity]),AuthModule ],
  controllers: [ProductController,ProductDetailController],
  providers: [ProductService,ProductAuditService,ProductDetailService],
})
export class ProductModule {}
