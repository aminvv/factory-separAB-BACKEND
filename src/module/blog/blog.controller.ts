import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AdminGuard } from '../auth/guards/adminGuard.guard';

@Controller('blog')
@ApiBearerAuth("Authorization")
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @ApiConsumes(swaggerConsumes.UrlEncoded,swaggerConsumes.Json)
  @UseGuards(AdminGuard)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  @pagination()
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogService.findAll(paginationDto);
  }
  
  @Get(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }
  
  @Patch(':id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }
  
  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
