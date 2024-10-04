import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import { Model } from 'mongoose';
import { Feed } from 'src/feeds/schemas/feed.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { createTestingFeedServiceModule } from '../feed.base.service.testing.module';
const _ = require('lodash');

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

  describe('findAllGrouped', () => {
    it('should return feeds group by origins', async () => {
      const responseExpected: any[] = [];

      fakeFeedService.origins.forEach((origin) => {
        const feedsCount = _.random(1, 5);
        responseExpected.push(
          fakeFeedService.createFeedsAndMakeStructureResponse(
            feedsCount,
            origin,
          ),
        );
      });

      const limit = _.random(1, 5);

      (feedModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(responseExpected),
      });

      (feedModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(responseExpected),
      });

      (feedModel.aggregate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(responseExpected),
      });

      const result = await service.findAllGroupedByOrigin(limit);

      expect(result).toEqual(responseExpected);
    });

    it('should return feeds group by random origin', async () => {
      const origin = _.sample(fakeFeedService.origins);

      const feedsCount = _.random(1, 5);
      const responseExpected: any[] =
        fakeFeedService.createFeedsAndMakeStructureResponse(feedsCount, origin);

      const limit = _.random(1, 5);

      (feedModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(responseExpected),
      });

      (feedModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(responseExpected),
      });

      (feedModel.aggregate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(responseExpected),
      });

      const result = await service.findAllGroupedByOrigin(limit);

      expect(result).toEqual(responseExpected);
    });
  });
});
