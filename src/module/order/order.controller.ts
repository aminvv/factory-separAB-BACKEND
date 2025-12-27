import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/adminGuard.guard';

@Controller('admin/orders')
@ApiBearerAuth("Authorization")
@UseGuards(AdminGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll() {
    return this.orderService.getAllForAdmin();
  }

  @Get(':id')
  getDetail(@Param('id') id: number) {
    return this.orderService.findById(+id);
  }

  @Patch(':id/next')
  advanceStatus(@Param('id') id: number) {
    return this.orderService.advanceStatus(+id);
  }

  @Patch(':id/revert')
  revertStatus(@Param('id') id: number) {
    return this.orderService.revertStatus(+id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: number) {
    return this.orderService.cancel(+id);
  }
}
