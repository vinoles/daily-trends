import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import mongoose, { Model } from 'mongoose';
import { Feed } from 'src/feeds/schemas/feed.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { createTestingFeedServiceModule } from '../feed.base.service.testing.module';

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

  describe('delete', () => {
    it('should delete a feed by its ID and return null when trying to find it', async () => {
      const mockFeed: Feed = fakeFeedService.createFakeFeed();

      const feedId = new mongoose.Types.ObjectId();
      const feedExpected = {
        ...mockFeed,
        _id: feedId,
      };

      (feedModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.delete(feedId.toString());

      expect(result).toEqual(null);

      (feedModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const resultFind = await service.findOne(feedExpected._id.toString());

      expect(resultFind).toEqual(null);
    });
  });
});
