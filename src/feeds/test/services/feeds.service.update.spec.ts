import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import mongoose, { Model } from 'mongoose';
import { Feed } from 'src/feeds/schemas/feed.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { createTestingFeedServiceModule } from '../feed.base.service.testing.module';
import { UpdateFeedDto } from 'src/feeds/dto/update-feed.dto';

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

  describe('update', () => {
    it('should update feed by its ID', async () => {
      const feedDto: UpdateFeedDto = fakeFeedService.updateFakeFeedDto();
      const mockFeed: Feed = fakeFeedService.createFakeFeed();

      const feedId = new mongoose.Types.ObjectId();
      const feedExpected = {
        ...mockFeed,
        _id: feedId,
      };

      (feedModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(feedDto),
      });

      const resultUpdated = await service.update(
        feedExpected._id.toString(),
        feedDto,
      );

      expect(resultUpdated).toEqual(feedDto);
    });
  });
});
