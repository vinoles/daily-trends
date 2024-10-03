import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Feed, FeedSchema } from './schemas/feed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
  ],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
