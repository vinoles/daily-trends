import { ApiProperty } from '@nestjs/swagger';
import { Feed } from './feeds/schemas/feed.schema';

export class FeedResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: Feed })
  data: Feed;
}

export class FeedResponseListDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: [Feed] })
  data: Feed[];
}
