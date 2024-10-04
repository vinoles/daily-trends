import { Test, TestingModule } from '@nestjs/testing';
import { FeedsController } from '../feeds.controller';
import { FeedsService } from '../feeds.service';
import { Feed, FeedSchema } from '../schemas/feed.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

export const createTestingFeedModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    controllers: [FeedsController],
    providers: [FeedsService],
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
      }),
      MongooseModule.forRoot(process.env.DB_CONNECTION),
      MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
    ],
  }).compile();
};
