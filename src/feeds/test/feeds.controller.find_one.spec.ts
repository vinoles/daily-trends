import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../feeds.controller';
import { FeedsService } from '../feeds.service';
import { Feed } from '../schemas/feed.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedModule } from './feed.base.testing.module';
import { FakeFeedService } from './fake-feed.service';
const _ = require('lodash');

describe('FeedsController', () => {
  let feedController: FeedsController;
  let feedService: FeedsService;
  let fakeFeedService: FakeFeedService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedModule();

    feedController = module.get<FeedsController>(FeedsController);
    feedService = module.get(FeedsService);
    fakeFeedService = new FakeFeedService();
  });

  describe('findOne', () => {
    /**
     * Should return a response for id feed
     */
    it('should return a response for id feed', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const feed: Feed = fakeFeedService.createFakeFeed();

      const result = {
        status: 'success',
        data: feed,
      };

      jest.spyOn(feedService, 'findOne').mockResolvedValue(feed);

      await feedController.findOne(feed._id, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    /**
     * Should handle errors and return 500
     */
    it('should handle errors and return 404', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // simulate error
      jest.spyOn(feedService, 'findOne');

      await feedController
        .findOne('no_found_id', mockResponse as Response)
        .catch((error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('Feed not found.');
        });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });
  });
});
