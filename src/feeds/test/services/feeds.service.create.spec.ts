import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import { Model } from 'mongoose';
import { Feed } from 'src/feeds/schemas/feed.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { createTestingFeedServiceModule } from '../feed.base.service.testing.module';
import { CreateFeedDto } from 'src/feeds/dto/create-feed.dto';

describe('FeedsService', () => {
  let service: FeedsService;
  let feedModel: Model<Feed>;
  let fakeFeedService: FakeFeedsFactory;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedServiceModule();

    service = module.get<FeedsService>(FeedsService);
    feedModel = module.get<Model<Feed>>(getModelToken('Feed'));

    fakeFeedService = new FakeFeedsFactory();
  });

  describe('create', () => {
    it('should create a feed', async () => {
      const feedDto: CreateFeedDto = fakeFeedService.createFakeFeedDto();

      (feedModel.create as jest.Mock).mockResolvedValue(feedDto);

      const resultCreated = await service.create(feedDto);

      expect(resultCreated).toEqual(feedDto);
    });
  });
});
