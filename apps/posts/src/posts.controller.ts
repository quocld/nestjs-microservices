import { JwtAuthGuard } from '@app/common';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getHello() {
    return await this.postsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPost(@Payload() data: CreatePostDto, @Req() req: any) {
    return await this.postsService.createPost(data, req.user);
  }

  @Post('find-by-id')
  async findById(@Payload() data: { id: string }, @Req() req: any) {
    return await this.postsService.getPostsByUserId(data.id);
  }
}
