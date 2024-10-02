import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { EnumFeed } from '../entities/feed.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly subtitle: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly category?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly urlImage?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @ApiProperty()
  @IsEnum(EnumFeed)
  readonly origin: EnumFeed;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
