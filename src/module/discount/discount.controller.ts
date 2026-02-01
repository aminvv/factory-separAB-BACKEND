import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/create-discount.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('discount')
@ApiTags('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  @Post("/create-discount")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto)
  }

  @Put("/update-discount/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id") id: number, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updateDiscountDto)
  }
  @Get("/get-discounts")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  find() {
    return this.discountService.find()
  }
  @Get("/get-discount/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findById(@Param("id") id: number) {
    return this.discountService.findById(id)
  }


  @Get("/get-discounts-by-product/:productId")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findByProduct(@Param("productId") productId: number) {
    return this.discountService.findByProduct(productId)
  }


  @Delete("/delete-discount/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  delete(@Param("id") id: number) {
    return this.discountService.delete(id)
  }
}
