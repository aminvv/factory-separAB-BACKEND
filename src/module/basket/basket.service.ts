import { BadRequestException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { BasketDto, } from './dto/create-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { ProductService } from '../product/services/product.service';
import { DiscountService } from '../discount/discount.service';
import { AddDiscountToBasketDto } from './dto/create-discount.dto';
import { DiscountType } from '../discount/enum/type.enum';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { BasketProduct } from './types/BasketProduct.type';
import { BasketDiscount } from './types/BasketDiscount.type';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {


  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
    private productService: ProductService,
    private discountService: DiscountService,
  ) { }


  //================== ADD TO BASKET ==============================
  async addToBasket(addToBasket: BasketDto) {
    const userId = this.request.user?.id
    const { productId, quantity } = addToBasket

    const product = await this.productService.findOne(productId,);
    if (product.quantity < quantity)
      throw new BadRequestException("product inventory not enough");


    let basketItem = await this.basketRepository.findOne({
      where: {
        productId: product.id,
        userId,
        discountId: IsNull()
      }
    })

    if (basketItem) {
      basketItem.quantity += quantity;
      if (basketItem.quantity > product.quantity) {
        throw new BadRequestException("product inventory not enough");
      }
      await this.basketRepository.save(basketItem)
    } else {

      const discountedItem = await this.basketRepository.findOne({
        where: {
          productId: product.id,
          userId,
          discountId: Not(IsNull())
        }
      })

      if (discountedItem) {
        discountedItem.quantity += quantity

        if (discountedItem.quantity > product.quantity) {
          throw new BadRequestException("product inventory not enough")
        }
        await this.basketRepository.save(discountedItem)
      } else {
        basketItem = this.basketRepository.create({
          productId,
          userId,
          quantity: quantity,
          discountId: null
        })
        await this.basketRepository.save(basketItem)
      }
    }
    return {
      message: "product added to basket",
    };



  }













  //================== ADD DISCOUNT TO BASKET ==============================
  async addDiscountToBasket(addDiscountBasket: AddDiscountToBasketDto) {
    const userId = this.request.user?.id
    if (!userId) {
      throw new UnauthorizedException("User not authenticated")
    }

    const basketItemsCount = await this.basketRepository.count({
      where: {
        userId,
        productId: Not(IsNull()),
        quantity: MoreThan(0)
      }
    })

    if (basketItemsCount === 0) {
      throw new BadRequestException("سبد خرید شما خالی است. ابتدا محصولی اضافه کنید")
    }
    const { code } = addDiscountBasket
    const discount = await this.discountService.getDiscountByCode(code)
    if (!discount) throw new NotFoundException("notFound discount")


    if (discount.expires_in && new Date(discount.expires_in) < new Date()) {
      throw new BadRequestException("تخفیف منقضی شده است")
    }

    if (discount.limit && discount.usage >= discount.limit) {
      throw new BadRequestException("تعداد استفاده از این تخفیف به پایان رسیده")
    }

    if (discount.usedByUsers && discount.usedByUsers.includes(userId.toString())) {
      throw new BadRequestException("شما قبلاً از این کد تخفیف استفاده کرده‌اید")
    }

    const existingDiscount = await this.basketRepository.findOne({
      where: {
        userId,
        discountId: discount.id
      }
    })

    if (existingDiscount) {
      throw new BadRequestException("این کد تخفیف قبلاً به سبد خرید شما اضافه شده است")
    }





    if (discount.type === DiscountType.product && discount.productId) {
      const basketItem = await this.basketRepository.findOne({
        where: {
          productId: discount.productId,
          userId,
          discountId: IsNull()
        }
      })

      if (!basketItem) {
        throw new BadRequestException("این تخفیف فقط برای محصول خاصی است که در سبد خرید شما نیست")
      }
    }

    if (discount.limit && (discount.limit <= 0 || discount.usage >= discount.limit)) {
      throw new BadRequestException("discount is limited")
    }
    if (discount.expires_in && discount.expires_in <= new Date()) {
      throw new BadRequestException("discount is expired")
    }


    if (discount.type === DiscountType.product && discount.productId) {
      const basketItem = await this.basketRepository.findOne({
        where: {
          productId: discount.productId,
          userId,
          discountId: IsNull()
        }
      })

      if (!basketItem) {
        throw new BadRequestException("not found item for this discount code")
      }

      basketItem.discountId = discount.id
      await this.basketRepository.save(basketItem)

      return { message: "discount added to product" }
    }

    if (discount.type === DiscountType.Basket) {
      const existingBasketDiscount = await this.basketRepository.findOne({
        where: {
          userId,
          discount: { type: DiscountType.Basket }
        },
        relations: ['discount']
      })

      if (existingBasketDiscount) {
        throw new BadRequestException('you already used basket discount')
      }

      await this.basketRepository.insert({
        userId,
        productId: null,
        discountId: discount.id,
        quantity: 0
      })

      return { message: "basket discount added" }
    }

    throw new BadRequestException("invalid discount type")
  }









  //================== GET BASKET ==============================
  async getBasket() {
    const userId = this.request.user?.id
    let products: BasketProduct[] = []
    let discounts: BasketDiscount[] = []
    let finalAmount = 0
    let totalPrice = 0
    let totalDiscountAmount = 0

    const items = await this.basketRepository.find({
      where: { userId },
      relations: {
        product: true,
        discount: true,
      },
    })

    const productItems = items.filter(i => i.product)

    for (const item of productItems) {
      const { product, quantity } = item
      let discountAmount = 0
      let price = +product.price

      totalPrice += price * quantity

      if (product.active_discount) {
        const d = this.checkDiscountPercent(price, +product.discount)
        price = d.newPrice
        discountAmount += d.newDiscountAmount
      }

      if (item.discount && this.validateDiscount(item.discount)) {
        const discount = item.discount

        if (!discounts.some(d => d.code === discount.code)) {
          discounts.push({
            percent: discount.percent,
            amount: discount.amount,
            code: discount.code,
            type: discount.type as DiscountType,
            productId: discount.productId,
          })
        }

        if (discount.percent) {
          const d = this.checkDiscountPercent(price, discount.percent)
          price = d.newPrice
          discountAmount += d.newDiscountAmount
        } else if (discount.amount) {
          const d = this.checkDiscountAmount(price, discount.amount)
          price = d.newPrice
          discountAmount += d.newDiscountAmount
        }
      }

      totalDiscountAmount += discountAmount * quantity
      finalAmount += price * quantity

      products.push({
        id: product.id,
        slug: product.slug,
        title: product.productName,
        active_discount: product.active_discount,
        discount: product.discount,
        price,
        quantity,
      })
    }

    const basketDiscountItems = items.filter(
      i => i.discount?.type === DiscountType.Basket && this.validateDiscount(i.discount)
    )

    for (const basketItem of basketDiscountItems) {
      const discount = basketItem.discount
      let discountAmount = 0

      discounts.push({
        percent: discount.percent,
        amount: discount.amount,
        code: discount.code,
        type: discount.type as DiscountType,
        productId: discount.productId,
      })

      if (discount.percent) {
        const d = this.checkDiscountPercent(finalAmount, discount.percent)
        finalAmount = d.newPrice
        discountAmount = d.newDiscountAmount
      } else if (discount.amount) {
        const d = this.checkDiscountAmount(finalAmount, discount.amount)
        finalAmount = d.newPrice
        discountAmount = d.newDiscountAmount
      }

      totalDiscountAmount += discountAmount
    }

    const productDiscounts = items.filter(
      i => i.discount && i.discount.type === DiscountType.product
    )

    return {
      totalPrice,
      finalAmount,
      totalDiscountAmount,
      products,
      discounts,
      productDiscounts,
    }
  }








  validateDiscount(discount: DiscountEntity) {
    let limitCondition = discount.limit && discount.limit > discount.usage;
    let timeCondition = discount.expires_in && discount.expires_in > new Date();
    return limitCondition || timeCondition;
  }


  checkDiscountPercent(price: number, percent: number) {
    let newDiscountAmount = +price * (+percent / 100);
    let newPrice = +newDiscountAmount > +price ? 0 : +price - newDiscountAmount;
    return {
      newPrice,
      newDiscountAmount,
    };
  }


  checkDiscountAmount(price: number, amount: number) {
    let newPrice = +amount > +price ? 0 : +price - +amount;
    return {
      newPrice,
      newDiscountAmount: +amount,
    };
  }














  //================== REMOVE DISCOUNT FORM BASKET ==============================

  async removeDiscountFromBasket(addDiscountBasket: AddDiscountToBasketDto) {
    const { code } = addDiscountBasket
    const discount = await this.discountService.getDiscountByCode(code)
    if (!discount) throw new NotFoundException("notFound discount")

    const existDiscount = await this.basketRepository.findOneBy({ discountId: discount.id })
    if (existDiscount) {
      await this.basketRepository.delete({ id: existDiscount.id })
    } else {
      throw new NotFoundException("notFound discount")
    }

    return {
      message: "discount removed"
    }
  }




  //================== REMOVE FORM BASKET ==============================
  async removeFromBasket(removeBasketDto: BasketDto) {
    const { productId } = removeBasketDto

    const product = await this.productService.findOne(productId);
    let basketItem = await this.basketRepository.findOneBy({ productId: product.id });

    if (basketItem) {
      if (basketItem.quantity <= 1) {
        await this.basketRepository.delete({ id: basketItem.id })
      } else {
        basketItem.quantity -= 1;
        await this.basketRepository.save(basketItem);
      }

    } else {
      throw new NotFoundException(" not found item in basket")
    }

    return {
      message: "product remove from  basket",
    };
  }




  //================== REMOVE FORM BASKET BY ID ==============================

  async removeFromBasketById(id: number) {
    let basketItem = await this.basketRepository.findOneBy({ id });
    if (basketItem) {
      if (basketItem.quantity <= 1) {
        await this.basketRepository.delete({ id: basketItem.id })
      } else {
        basketItem.quantity -= 1;
        await this.basketRepository.save(basketItem);
      }

    } else {
      throw new NotFoundException(" not found item in basket")
    }

    return {
      message: "product remove from  basket",
    };
  }





  //================== CLEAR BASKET FOR USER ==============================
  async clearBasketForUser(userId: number) {
    await this.basketRepository.delete({ userId });

    return {
      message: "basket deleted success"
    };
  }





}
