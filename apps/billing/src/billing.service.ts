import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  getHello(): string {
    return 'Hello World!, Im Billing Services';
  }

  async bill(data: any) {
    this.logger.log('Billing...', data);
  }
}
