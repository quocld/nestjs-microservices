import { JwtAuthGuard } from '@app/common';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() request: CreateOrderDto, @Req() req: any) {
    console.log(req.user);
    await this.ordersService.sendMailOrder(request);
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getAllOrders() {
    return this.ordersService.getAll();
  }
}
