import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class Post extends AbstractDocument {
  @Prop({ type: String, required: true })
  user_id: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ required: false })
  likeId: {}[];

  @Prop([
    {
      type: {
        type: String,
        enum: ['image', 'video'],
      },
      url: String,
    },
    { required: false },
  ])
  media: {
    type: string;
    url: string;
  }[];

  @Prop({
    type: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    required: false,
  })
  location: {
    latitude: number;
    longitude: number;
  };

  @Prop({ type: Boolean, default: true, required: false })
  active: Boolean;

  @Prop({ type: Date, default: Date.now, required: false })
  updated_at: Date;

  @Prop({ type: Date, default: Date.now, required: false })
  created_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
