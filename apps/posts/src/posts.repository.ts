import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Post } from './schema/post.schema';

@Injectable()
export class PostsRepository extends AbstractRepository<Post> {
  protected readonly logger = new Logger(PostsRepository.name);

  constructor(
    @InjectModel(Post.name) postModule: Model<Post>,
    @InjectConnection() connection: Connection,
  ) {
    super(postModule, connection);
  }
}
