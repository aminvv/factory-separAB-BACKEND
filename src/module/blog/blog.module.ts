import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CommentsEntity } from './entities/comment.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminEntity } from '../admin/entities/admin.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BlogEntity,CommentsEntity,UserEntity,AdminEntity]),AuthModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
