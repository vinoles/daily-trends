import { Test, TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import mongoose, { Model } from 'mongoose';
import { Feed } from 'src/feeds/schemas/feed.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import {
  createTestingFeedServiceModule,
  mockFeedRepository,
} from '../feed.base.service.testing.module';

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

  describe('findOne', () => {
    it('should return a feed by its ID', async () => {
      const mockFeed: Feed = fakeFeedService.createFakeFeed();

      const feedId = new mongoose.Types.ObjectId();
      const feedWithId = {
        ...mockFeed,
        _id: feedId,
      };

      // Simulate return type feed
      (feedModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(feedWithId),
      });

      const result = await service.findOne(feedId.toString());

      expect(result).toEqual(feedWithId);
    });
  });
});
