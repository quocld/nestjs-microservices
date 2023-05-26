import { RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('EMAIL', true));
  const configureService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configureService.get('PORT'));
}
bootstrap();
