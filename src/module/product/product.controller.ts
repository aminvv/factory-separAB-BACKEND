import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from '../auth/guards/role.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';



@ApiTags("product")
@ApiBearerAuth("Authorization")
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard,RolesGuard)
  // @CanAccess(Roles.Admin)
  @ApiConsumes(swaggerConsumes.Json)
  create(@Body() ProductDto: ProductDto) {
    return this.productService.createProduct(ProductDto);
  }

  @Get()
  @pagination()
    @ApiConsumes(swaggerConsumes.UrlEncoded)
  findAll(@Query()paginationDto:PaginationDto) {
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
}
