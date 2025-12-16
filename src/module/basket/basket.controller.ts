import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketDto } from './dto/create-basket.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AddDiscountToBasketDto } from './dto/create-discount.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UserGuard } from '../auth/guards/userGuard.guard';

@Controller('basket')
@ApiTags('basket')
@ApiBearerAuth("Authorization")
export class BasketController {
  constructor(private readonly basketService: BasketService) { }

  @Post("/addToBasket")
  @UseGuards(UserGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded,)
  addToBasket(@Body() addToBasketDto: BasketDto) {
    return this.basketService.addToBasket(addToBasketDto);
  }

  @Get()
  @UseGuards(UserGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  getBasket() {
    return this.basketService.getBasket();
  }

  @Post('/add-discount')
  @UseGuards(UserGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  addDiscountToBasket(@Body() addDiscountBasket: AddDiscountToBasketDto) {
    return this.basketService.addDiscountToBasket(addDiscountBasket);
  }

  @Delete('/removeFromBasket')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  removeFromBasket(@Body() removeBasketDto: BasketDto) {
    return this.basketService.removeFromBasket(removeBasketDto);
  }

  @Delete('/removeFromBasketById/:id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  removeFromBasketById(@Param("id", ParseIntPipe) id: number) {
    return this.basketService.removeFromBasketById(id);
  }

  @Delete('/removeDiscount-FromBasket')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  removeDiscountFromBasket(@Body() discountDto: AddDiscountToBasketDto) {
    return this.basketService.removeDiscountFromBasket(discountDto);
  }
}
