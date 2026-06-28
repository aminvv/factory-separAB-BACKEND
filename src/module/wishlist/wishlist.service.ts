import { ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { WishlistEntity } from './entities/wishlist.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable({ scope: Scope.REQUEST })
export class WishlistService {

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(WishlistEntity) private wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
  ) { }

  // ===== ADD =====
  async add(productId: number) {
    const user = this.request.user;
    if (!user) throw new UnauthorizedException('لاگین کنید');

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('محصول یافت نشد');

    const exists = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });
    if (exists) throw new ConflictException('محصول قبلاً به علاقه‌مندی‌ها اضافه شده');

    const wishlist = this.wishlistRepository.create({ user, product });
    await this.wishlistRepository.save(wishlist);
    return { message: 'به علاقه‌مندی‌ها اضافه شد' };
  }

  // ===== GET ALL =====
  async findAll() {
    const user = this.request.user;
    if (!user) throw new UnauthorizedException('لاگین کنید');

    return this.wishlistRepository.find({
      where: { user: { id: user.id } },
      relations: { product: true },
      select: {
        id: true,
        created_at: true,
        product: {
          id: true,
          productName: true,
          price: true,
          slug: true,
          image: true,
          quantity: true,
          rating: true,
        },
      },
      order: { created_at: 'DESC' },
    });
  }

  // ===== REMOVE =====
  async remove(productId: number) {
    const user = this.request.user;
    if (!user) throw new UnauthorizedException('لاگین کنید');

    const wishlist = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });
    if (!wishlist) throw new NotFoundException('آیتم یافت نشد');

    await this.wishlistRepository.remove(wishlist);
    return { message: 'از علاقه‌مندی‌ها حذف شد' };
  }

  // ===== CHECK =====
  async check(productId: number) {
    const user = this.request.user;
    if (!user) return { isWishlisted: false };

    const exists = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });
    return { isWishlisted: !!exists };
  }
}