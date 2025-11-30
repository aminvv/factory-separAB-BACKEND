import { Module } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CommentsEntity } from './entities/comment.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminEntity } from '../admin/entities/admin.entity';
import { BlogCommentService } from './services/blog-comment.service';
import { BlogCommentsController } from './controllers/blog-comment.controller';

@Module({
  imports:[TypeOrmModule.forFeature([BlogEntity,CommentsEntity,UserEntity,AdminEntity]),AuthModule],
  controllers: [BlogController,BlogCommentsController],
  providers: [BlogService,BlogCommentService],
})
export class BlogModule {}
