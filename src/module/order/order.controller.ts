import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiConsumes } from '@nestjs/swagger';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Get()
  getAllOrdered(){
   return this.orderService.getAllOrdered()
  }



    @Get("setInProcess/:orderId")  
     setInProcess(@Param("orderId") orderId: number) {
      return this.orderService.setInProcess(orderId) 
    }



    @Get("setPacked/:orderId")  
     setPacked(@Param("orderId") orderId: number) {
      return this.orderService.setPacked(orderId) 
    }
  
  
    @Get("setToTransit/:orderId")  
    setToTransit(@Param("orderId") orderId: number) {
     return this.orderService.setToTransit(orderId) 
   }
  

  
   @Get("delivery/:orderId")  
   delivery(@Param("orderId") orderId: number) {
    return this.orderService.delivery(orderId) 
  }


    
  @Get("cancel/:orderId")  
  cancel(@Param("orderId") orderId: number) {
   return this.orderService.cancel(orderId) 
 }
  

  
  

}