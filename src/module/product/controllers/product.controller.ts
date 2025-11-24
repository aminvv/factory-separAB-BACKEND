import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { UploadedImageParam } from 'src/common/decorators/upload-image-.decorator';
import { ProductService } from '../services/product.service';
import { AdminGuard } from 'src/module/auth/guards/adminGuard.guard';
import { ProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';





@ApiTags("product")
@ApiBearerAuth("Authorization")
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post('/create-product')
  @UseGuards(AdminGuard)
  // @CanAccess(Roles.Admin)
  @ApiConsumes( swaggerConsumes.Json)
  async create(@Body() productDto: ProductDto,) {
    return await this.productService.createProduct(productDto);

  }




  @UseGuards(AdminGuard)
  @Patch('edit-product/:id')
  @ApiConsumes(swaggerConsumes.MultiPartData)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }


  @Get('get-products')
  @pagination()
  @UseGuards(AdminGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded) 
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get('get-product/:id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  


  
  @Delete(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }





} 