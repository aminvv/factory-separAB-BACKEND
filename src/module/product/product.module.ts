import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductAuditEntity } from './entities/product-audit.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity,UserEntity,ProductAuditEntity]),AuthModule],
  controllers: [ProductController],
  providers: [ProductService,ProductAuditEntity],
})
export class ProductModule {}
