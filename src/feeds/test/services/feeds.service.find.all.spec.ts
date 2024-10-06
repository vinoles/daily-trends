import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import { Model } from 'mongoose';
import { Feed } from 'src/feeds/schemas/feed.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { createTestingFeedServiceModule } from '../feed.base.service.testing.module';
import _ from 'lodash';

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

  describe('findAll', () => {
    it('should return paginated feeds with filters', async () => {
      const mockFeeds: Feed[] = fakeFeedService.createFakeFeeds(
        _.random(10, 100),
      );

      const page = 1;
      const limit = 10;

      const sortOrder = 'desc';
      const responseExpected = {
        data: mockFeeds,
        total: mockFeeds.length,
      };

      (feedModel.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(responseExpected.data),
      });

      (feedModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(responseExpected.total),
      });

      const result = await service.findAll(
        page,
        limit,
        null,
        null,
        null,
        sortOrder,
      );

      expect(result).toEqual(responseExpected);

      expect(result.total).toEqual(responseExpected.total);
    });
  });
});
