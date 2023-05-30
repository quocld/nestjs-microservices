import { RmqService } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly rmqService: RmqService,
  ) {}

  @Get('send-mail')
  public sendMail() {
    this.emailService.sendMail(1);
  }

  @EventPattern('send-mail-for-new-post')
  async sendMailForCreatedNewPost(
    @Payload()
    data: {
      content: string;
      user: {
        _id: string;
        email: string;
        password: string;
        fisrtName: string;
        lastName: string;
        phoneNumber: string;
      };
    },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log(data);
    await this.emailService.sendMailForNewPost(data);
    this.rmqService.ack(context);
  }

  @EventPattern('send_mail_order_created')
  async handleOrderCreated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.emailService.sendMail(data);
    this.rmqService.ack(context);
  }
}
