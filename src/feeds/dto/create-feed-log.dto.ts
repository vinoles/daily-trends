import { IsString, IsObject, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedLogDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsObject()
  @IsNotEmpty()
  error: object;

  @IsString()
  @IsNotEmpty()
  createdAt: string;
}
