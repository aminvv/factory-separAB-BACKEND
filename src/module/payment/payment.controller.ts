import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UserGuard } from '../auth/guards/userGuard.guard';
export class addressDto {
  @ApiProperty()
  address: string
}
@ApiBearerAuth("Authorization")
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }


  @UseGuards(UserGuard)
  @Post()
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() addressDto: addressDto) {
    return this.paymentService.create(addressDto.address);
  }
  @Get("/verify")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async verify(@Query("authority") authority: string, @Query("status") status: string, @Res() res: Response) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url)
  }
  @Get("/find-payment")
  async find() {
    return this.paymentService.find();

  }


}