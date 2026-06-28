import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../auth/guards/userGuard.guard';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth('Authorization')
@UseGuards(UserGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  add(@Param('productId') productId: number) {
    return this.wishlistService.add(+productId);
  }

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Delete(':productId')
  remove(@Param('productId') productId: number) {
    return this.wishlistService.remove(+productId);
  }

  @Get('check/:productId')
  check(@Param('productId') productId: number) {
    return this.wishlistService.check(+productId);
  }
}