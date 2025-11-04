import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from '../auth/guards/role.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedImageParam } from 'src/common/decorators/upload-image-.decorator';
import { AdminGuard } from '../auth/guards/adminGuard.guard';





@ApiTags("product")
@ApiBearerAuth("Authorization")
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post()
  @UseGuards(AdminGuard)
  // @CanAccess(Roles.Admin)
  @ApiConsumes(swaggerConsumes.MultiPartData,swaggerConsumes.Json)
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() productDto: ProductDto, @UploadedImageParam('product') imageUrl: string) {
    await this.productService.createProduct(productDto,imageUrl);
    return {
   message :" Product created successfully"
    }
  }

  @Get()
  @pagination()
    @UseGuards(AdminGuard, RolesGuard)

  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

 


  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedImageParam('product') imageUrl: string) {
    return { url: imageUrl }
  }
}