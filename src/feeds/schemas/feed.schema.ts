import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type FeedDocument = HydratedDocument<Feed>;

export enum EnumOrigin {
  COUNTRY_PAGE = 'the_country_page',
  WORD_PAGE = 'the_word_page',
  LOCAL_PAGE = 'local_page',
}

@Schema({
  autoIndex: true,
})
export class Feed {
  @ApiProperty({
    description: 'Title of the feed',
    default: 'Lorem Ipsum Title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Subtitle of the feed',
    default: 'Lorem Ipsum Subtitle',
  })
  @Prop({ required: true })
  subtitle: string;

  @ApiProperty({
    description: 'Category of the feed',
    default: 'technology',
    required: false,
  })
  @Prop({ required: false })
  category: string;

  @ApiProperty({
    description: 'URL of the feed',
    default: 'https://example.com/lorem-feed',
  })
  @Prop({ required: true, unique: true })
  url: string;

  @ApiProperty({
    description: 'URL of the image associated with the feed',
    default: 'https://example.com/lorem-image.jpg',
    required: false,
  })
  @Prop({ required: false })
  urlImage: string;

  @ApiProperty({
    description: 'Author of the feed',
    default: 'John Doe',
  })
  @Prop({ required: true })
  author: string;

  @ApiProperty({
    description: 'Origin of the feed',
    enum: EnumOrigin,
    default: EnumOrigin.COUNTRY_PAGE,
  })
  @Prop({
    required: true,
    enum: EnumOrigin,
    type: String,
  })
  origin: EnumOrigin;

  @ApiProperty({
    description: 'Content of the feed',
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Date the feed was published',
    default: new Date().toISOString(),
  })
  @Prop({ required: true })
  publishedAt: string;

  @ApiProperty({
    description: 'Date the feed was last updated',
    default: new Date().toISOString(),
    required: false,
  })
  @Prop({ required: false })
  updatedAt: string;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

FeedSchema.index({ url: 1 }, { unique: true });
