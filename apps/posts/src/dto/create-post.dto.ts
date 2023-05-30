import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  likeId: {}[];

  media: {
    type: string;
    url: string;
  }[];

  location: {
    latitude: number;
    longitude: number;
  };

  active: boolean;

  updated_at: Date;

  created_at: Date;
}
