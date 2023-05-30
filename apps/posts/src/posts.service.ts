import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMAIL_SERVICE } from './constant/services';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import { Post } from './schema/post.schema';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    @Inject(EMAIL_SERVICE) private emailClient: ClientProxy,
  ) {}

  getAll() {
    return this.postsRepository.find({});
  }

  async createPost(data: CreatePostDto, user: any) {
    try {
      const newPost = await this.postsRepository.create({
        ...data,
        user_id: user._id,
      });
      await this.emailClient.emit('send-mail-for-new-post', {
        ...data,
        user,
      });

      return newPost;
    } catch (error) {
      return new HttpException('Cant not create Post', HttpStatus.BAD_REQUEST);
    }
  }

  async getPostsByUserId(user_id: string): Promise<Post> {
    return await this.postsRepository.findById(user_id);
  }
}
