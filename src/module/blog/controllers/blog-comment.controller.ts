import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AdminGuard } from '../../auth/guards/adminGuard.guard';
import { CreateBlogCommentDto } from '../dto/create-blog-Comment.dto';
import { BlogCommentService } from '../services/blog-comment.service';
import { UserGuard } from 'src/module/auth/guards/userGuard.guard';
import { BaseAuthGuard } from 'src/module/auth/guards/BaseAuth.guard';
import { AnyAuthGuard } from 'src/module/auth/guards/anyAuthGuard.guard';

@Controller('blog-comment')
@ApiBearerAuth("Authorization")
export class BlogCommentsController {

  constructor(private blogCommentService: BlogCommentService) { }


  @Post('/')
  @UseGuards(AnyAuthGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded, swaggerConsumes.Json)
  create(@Body() blogCommentDto: CreateBlogCommentDto) {
    return this.blogCommentService.create(blogCommentDto)
  }




  @Delete("delete/:commentId")
 @UseGuards(AnyAuthGuard)
  remove(@Param("commentId") id: number) {
    return this.blogCommentService.remove(id);
  }
}