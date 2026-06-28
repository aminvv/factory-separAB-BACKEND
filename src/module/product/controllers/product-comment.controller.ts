import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AnyAuthGuard } from 'src/module/auth/guards/anyAuthGuard.guard';
import { CreateProductCommentDto } from '../dto/create-product-Comment.dto';
import { ProductCommentService } from '../services/product-comment.service';
import { PaginationDto } from 'src/common/dtos/paginationDto';

@Controller('product-comment')
@ApiBearerAuth("Authorization")
export class ProductCommentsController {

  constructor(private ProductCommentService: ProductCommentService) { }


  @Post('/')
  @UseGuards(AnyAuthGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded, swaggerConsumes.Json)
  create(@Body() blogCommentDto: CreateProductCommentDto) {
    return this.ProductCommentService.create(blogCommentDto)
  }



  @Get('my')
  @UseGuards(AnyAuthGuard)
  getMyComments() {
    return this.ProductCommentService.findMyComments();
  }



  @Delete("delete/:commentId")
  @UseGuards(AnyAuthGuard)
  remove(@Param("commentId") id: number) {
    return this.ProductCommentService.remove(id);
  }






  @Get('/product/:productId')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async getProductComments(
    @Param('productId') productId: number,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ProductCommentService.findCommendOfproduct(productId, paginationDto);
  }

}