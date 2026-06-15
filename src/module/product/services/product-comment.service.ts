import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { createSlug, RandomId } from 'src/common/utils/functions.util';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { ProductEntity } from '../entities/product.entity';
import { CommentsEntity } from '../entities/comment.entity';
import { ProductService } from './product.service';
import { CreateProductCommentDto } from '../dto/create-product-Comment.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductCommentService {



  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(CommentsEntity) private productCommentRepository: Repository<CommentsEntity>,
    @Inject(forwardRef(() => ProductService)) private productService: ProductService
  ) { }




  // =====================   CREATE   ======================
  async create(productCommentDto: CreateProductCommentDto) {
    const user = this.request.user;
    const admin = this.request.admin;

    if (!user?.id && !admin?.id) {
      throw new UnauthorizedException("شما باید لاگین کنید تا کامنت بذارید");
    }

    const { productId, parentId, text, rating } = productCommentDto;

    await this.productService.checkExistProductById(productId);

    let parent: CommentsEntity | null = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.productCommentRepository.findOneBy({ id: +parentId });
    }

    const payload: Partial<CommentsEntity> = {
      text,
      accepted: true,
      rating,
      productId,
      parentId: parent ? parentId : null,
      userId: user ? user.id : null,
      AdminId: admin ? admin.id : null,
    };

    await this.productCommentRepository.insert(payload);
    await this.updateProductRating(productId);

    return {
      message: publicMessage.CreatedComment,
    };
  }










  private async updateProductRating(productId: number): Promise<void> {
    const result = await this.productCommentRepository
      .createQueryBuilder('c')
      .select('AVG(c.rating)', 'avg')
      .where('c.productId = :productId', { productId })
      .andWhere('c.rating IS NOT NULL')
      .andWhere('c.rating > 0')
      .andWhere('c.accepted = true')
      .getRawOne();

    const avg = result?.avg ? Math.round(parseFloat(result.avg) * 10) / 10 : 0;

    await this.productRepository.update(productId, { rating: avg });
  }







  async findCommendOfproduct(productId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [comments, count] = await this.productCommentRepository.findAndCount({
      where: {
        productId,
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

    const comment = await this.productCommentRepository.findOneBy({ id: commentId });
    if (!comment) throw new NotFoundException(NotFoundMessage.NotFound);

    if (!adminJwt && (!userJwt || comment.userId !== userJwt.id)) {
      throw new ForbiddenException("You cannot delete this comment");
    }

    const productId = comment.productId; 
    await this.productCommentRepository.delete(commentId);
    await this.updateProductRating(productId);
    return { message: publicMessage.Delete };

  }






}
