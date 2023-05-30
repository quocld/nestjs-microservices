import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMAIL_SERVICE } from './constants/services';
import { CreateOrderDto } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(EMAIL_SERVICE) private emailClient: ClientProxy,
  ) {}

  async sendMailOrder(request: CreateOrderDto) {
    try {
      this.emailClient.emit('send_mail_order_created', { request });
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    return this.ordersRepository.find({});
  }
}
