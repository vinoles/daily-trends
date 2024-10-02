import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Feed>;

export enum EnumFeed {
  COUNTRY_PAGE = 'the_country_page',
  WORD_PAGE = 'the_word_page',
  LOCAL_PAGE = 'local_page',
}

@Schema()
export class Feed {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: false })
  category: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: false })
  urlImage: string;

  @Prop({ required: true })
  author: string;

  @Prop({
    required: true,
    enum: EnumFeed,
    type: String,
  })
  origin: EnumFeed;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  publishedAt: string;

  @Prop({ required: false })
  updatedAt: string;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
