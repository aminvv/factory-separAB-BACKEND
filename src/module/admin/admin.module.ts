import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { TokenService } from '../auth/token.service';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AdminEntity,UserEntity]),AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
