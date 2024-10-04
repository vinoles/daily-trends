import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { Feed } from '../../schemas/feed.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedModule } from '../feed.base.testing.module';
import { FakeFeedService } from '../fake-feed.service';
import { faker } from '@faker-js/faker/.';
const _ = require('lodash');
import mongoose from 'mongoose';

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
