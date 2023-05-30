import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schema/post.schema';
import { EventsModule } from './events/events.module';
import { EMAIL_SERVICE } from './constant/services';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    RmqModule.register({
      name: EMAIL_SERVICE,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/posts/.env',
    }),
    EventsModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
