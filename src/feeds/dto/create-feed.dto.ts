import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { EnumOrigin } from '../schemas/feed.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedDto {
  @ApiProperty({
    description: 'Title of the feed',
    default: 'Lorem Ipsum Title',
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  readonly title: string;

  @ApiProperty({
    description: 'Subtitle of the feed',
    default: 'Lorem Ipsum Subtitle',
  })
  @IsString({ message: 'Subtitle must be a string.' })
  @IsNotEmpty({ message: 'Subtitle is required.' })
  readonly subtitle: string;

  @ApiProperty({
    description: 'Category of the feed (optional)',
    default: 'technology',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Category must be a string.' })
  readonly category?: string;

  @ApiProperty({
    description: 'URL of the feed',
    default: 'https://example.com/lorem-feed',
  })
  @IsString({ message: 'URL must be a string.' })
  @IsNotEmpty({ message: 'URL is required.' })
  readonly url: string;

  @ApiProperty({
    description: 'Image URL of the feed (optional)',
    default: 'https://example.com/lorem-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string.' })
  readonly urlImage?: string;

  @ApiProperty({
    description: 'Author of the feed',
    default: 'John Doe',
  })
  @IsString({ message: 'Author must be a string.' })
  @IsNotEmpty({ message: 'Author is required.' })
  readonly author: string;

  @ApiProperty({
    description: 'Origin of the feed',
    enum: EnumOrigin,
    default: EnumOrigin.COUNTRY_PAGE,
  })
  @IsEnum(EnumOrigin, {
    message: `Origin must be a valid enum value: ${Object.values(EnumOrigin).join(', ')}.`,
  })
  readonly origin: EnumOrigin;

  @ApiProperty({
    description: 'Content of the feed',
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsString({ message: 'Content must be a string.' })
  @IsNotEmpty({ message: 'Content is required.' })
  readonly content: string;
}
