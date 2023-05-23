import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() request: CreateOrderDto) {
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getAllOrders() {
    return this.ordersService.getAll();
  }
}
