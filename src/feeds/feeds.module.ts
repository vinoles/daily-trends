import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { Feed, FeedSchema } from './schemas/feed.schema';
import { FeedLog, FeedLogSchema } from './schemas/feed.logs.schema';
import { ScraperCron } from './scraper/ScraperCron';
import { FeedLogService } from './feeds.logs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
    MongooseModule.forFeature([{ name: FeedLog.name, schema: FeedLogSchema }]),
  ],
  controllers: [FeedsController],
  providers: [FeedsService, ScraperCron, FeedLogService],
})
export class FeedsModule {}
