import { PartialType } from '@nestjs/swagger';
import { CreateFeedDto } from './create-feed.dto';

export class ExtractArticleDto extends PartialType(CreateFeedDto) {
  publishedAt: string;
  updatedAt: string;
}
