import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/adminGuard.guard';
import { UserGuard } from '../auth/guards/userGuard.guard';



@Controller('orders')
@ApiBearerAuth("Authorization")
@UseGuards(UserGuard)
export class OrderUserController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  getDetail(@Param('id') id: number) {
    return this.orderService.findByIdForUser(+id);
  }

}
