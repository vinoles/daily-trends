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

export class SimpleResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Message example response.' })
  message: string;
}
