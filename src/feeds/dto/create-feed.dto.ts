import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { EnumFeed } from '../schemas/feed.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedDto {
  @ApiProperty({
    description: 'Title of the feed',
    default: 'Lorem Ipsum Title',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: 'Subtitle of the feed',
    default: 'Lorem Ipsum Subtitle',
  })
  @IsString()
  @IsNotEmpty()
  readonly subtitle: string;

  @ApiProperty({
    description: 'Category of the feed (optional)',
    default: 'Technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly category?: string;

  @ApiProperty({
    description: 'URL of the feed',
    default: 'https://example.com/lorem-feed',
  })
  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @ApiProperty({
    description: 'Image URL of the feed (optional)',
    default: 'https://example.com/lorem-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly urlImage?: string;

  @ApiProperty({
    description: 'Author of the feed',
    default: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @ApiProperty({
    description: 'Origin of the feed',
    enum: EnumFeed,
    default: EnumFeed.COUNTRY_PAGE,
  })
  @IsEnum(EnumFeed)
  readonly origin: EnumFeed;

  @ApiProperty({
    description: 'Content of the feed',
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
