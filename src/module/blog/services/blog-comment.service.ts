import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { IsNull, Repository } from 'typeorm';
import { CommentsEntity } from '../entities/comment.entity';
import { NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { createSlug, RandomId } from 'src/common/utils/functions.util';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { CreateBlogCommentDto } from '../dto/create-blog-Comment.dto';
import { BlogService } from './blog.service';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {



  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @InjectRepository(CommentsEntity) private commentBlogRepository: Repository<CommentsEntity>,
    @Inject(forwardRef(() => BlogService)) private blogService: BlogService
  ) { }




  // =====================   CREATE   ======================
  async create(blogCommentDto: CreateBlogCommentDto) {
    const user = this.request.user;
    const admin = this.request.admin;

    if (!user?.id && !admin?.id) {
      throw new UnauthorizedException("شما باید لاگین کنید تا کامنت بذارید");
    }

    const { blogId, parentId, text } = blogCommentDto;

    await this.blogService.checkExistBlogById(blogId);

    let parent: CommentsEntity | null = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.commentBlogRepository.findOneBy({ id: +parentId });
    }

    const payload: Partial<CommentsEntity> = {
      text,
      accepted: true,
      blogId,
      parentId: parent ? parentId : null,
      userId: user ? user.id : null,
      AdminId: admin ? admin.id : null,
    };

    await this.commentBlogRepository.insert(payload);

    return {
      message: publicMessage.CreatedComment,
    };
  }















  async findCommendOfBlog(blogId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [comments, count] = await this.commentBlogRepository.findAndCount({
      where: {
        blogId,
        parentId: IsNull()
      },
      relations: {
        user: true,
        admin: true,
        children: {
          user: true,
          admin: true,
          children: {
            user: true,
            admin: true,
          },
        },
      },
      select: {
        user: {
          firstName: true,

        },
          admin:{
            fullName:true
          },
        children: {
          text: true,
          parentId: true,
          created_at: true,
          user: {
            firstName: true,

          },
          admin: {
            fullName: true
          },
          children: {
            text: true,
            parentId: true,
            created_at: true,
            user: {
              firstName: true,

            },
            admin: {
              fullName: true
            },
          }
        }
      },
      skip,
      take: limit
    })
    return {
      pagination: paginationGenerator(limit, page, count),
      comments
    }

  }














  // ===================== REMOVE ======================
  async remove(commentId: number) {
    const userJwt = this.request.user;
    const adminJwt = this.request.admin;

    if (!userJwt && !adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser);
    }

    const comment = await this.commentBlogRepository.findOneBy({ id: commentId });
    if (!comment) throw new NotFoundException(NotFoundMessage.NotFound);

    if (!adminJwt && (!userJwt || comment.userId !== userJwt.id)) {
      throw new ForbiddenException("You cannot delete this comment");
    }

    await this.commentBlogRepository.delete(commentId);

    return { message: publicMessage.Delete };
  }






}
