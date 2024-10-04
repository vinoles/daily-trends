import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { Feed } from '../../schemas/feed.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import { faker } from '@faker-js/faker/.';
const _ = require('lodash');
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

  describe('delete', () => {
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
        status: true,
        message: 'The feed has been successfully deleted.',
      };

      jest.spyOn(feedService, 'delete').mockResolvedValue(feedWithId as Feed);

      await feedController.delete(feedWithId._id, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should handle errors and return 404', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const fakeId = new mongoose.Types.ObjectId();

      jest.spyOn(feedService, 'delete').mockResolvedValue(null);

      await feedController.delete(fakeId.toString(), mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: false,
        message: 'Feed not found.',
      });
    });
  });
});
