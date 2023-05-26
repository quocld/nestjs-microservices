import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE, EMAIL_SERVICE } from './constants/services';
import { CreateOrderDto } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    @Inject(EMAIL_SERVICE) private emailClient: ClientProxy,
  ) {}

  async sendMailOrder(request: CreateOrderDto) {
    try {
      this.emailClient.emit('send_mail_order_created', { request });
    } catch (error) {
      throw error;
    }
  }

  async createOrder(request: CreateOrderDto) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      lastValueFrom(this.billingClient.emit('order_created', { request }));
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getAll() {
    return this.ordersRepository.find({});
  }
}
