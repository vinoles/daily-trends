import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { Feed } from '../../schemas/feed.schema';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { faker } from '@faker-js/faker/.';
import mongoose from 'mongoose';

describe('FeedsController', () => {
  let feedController: FeedsController;
  let feedService: FeedsService;
  let fakeFeedService: FakeFeedsFactory;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedControllerModule();

    feedController = module.get<FeedsController>(FeedsController);
    feedService = module.get(FeedsService);
    fakeFeedService = new FakeFeedsFactory();
  });

  describe('findOne', () => {
    it('should return a response for id feed', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const feed: Partial<Feed> = fakeFeedService.createFakeFeed();

      const feedWithId = {
        ...feed,
        _id: faker.string.uuid(),
      };

      const result = {
        status: 'success',
        data: feedWithId,
      };

      jest.spyOn(feedService, 'findOne').mockResolvedValue(feedWithId as Feed);

      await feedController.findOne(feedWithId._id, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should handle errors and return 404', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const fakeId = new mongoose.Types.ObjectId();

      jest.spyOn(feedService, 'findOne').mockResolvedValue(null);

      await feedController.findOne(fakeId.toString(), mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Feed not found.',
      });
    });
  });
});
