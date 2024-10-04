import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { Feed } from '../../schemas/feed.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';
import { FakeFeedsFactory } from '../fake.feeds.factory';
const _ = require('lodash');

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

  describe('findAll', () => {
    /**
     * Should return a response with data list
     */
    it('should return a response with data list', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const feeds: Feed[] = fakeFeedService.createFakeFeeds(_.random(10, 100));

      const result = {
        status: 'success',
        data: { data: feeds, total: feeds.length },
      };

      jest
        .spyOn(feedService, 'findAll')
        .mockResolvedValue({ data: feeds, total: feeds.length });

      await feedController.findAll(1, 10, 'asc', mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    /**
     * Should handle errors and return 500
     */
    it('should handle errors and return 500', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // simulate error
      jest
        .spyOn(feedService, 'findAll')
        .mockRejectedValue(new Error('Service Error'));

      await feedController
        .findAll(1, 10, 'asc', mockResponse as Response)
        .catch((error) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual(
            'An error occurred while retrieving the feeds.',
          );
        });
    });
  });
});
