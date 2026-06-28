import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { WishlistEntity } from '../wishlist/entities/wishlist.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,WishlistEntity]),AuthModule],
  controllers: [UserController],
  providers: [UserService,],
  
})
export class UserModule {}
