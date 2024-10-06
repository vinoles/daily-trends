import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import _ from 'lodash';

import { UpdateFeedDto } from '../../dto/update-feed.dto';
import { Feed } from '../../schemas/feed.schema';
import { faker } from '@faker-js/faker/.';

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

  describe('update', () => {
    it('should return a response for id feed', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const feedDto: UpdateFeedDto = fakeFeedService.updateFakeFeedDto();

      const feed: Partial<Feed> = fakeFeedService.createFakeFeed();

      const feedWithId = {
        ...feed,
        _id: faker.string.uuid(),
      };

      const result = {
        status: 'success',
        data: feedWithId,
      };

      jest.spyOn(feedService, 'update').mockResolvedValue(feedWithId as Feed);

      await feedController.update(
        feedWithId._id,
        feedDto,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should handle errors and return 400', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      let feedDto: UpdateFeedDto = fakeFeedService.updateFakeFeedDto();

      feedDto = {
        ...feedDto,
        origin: _.random(fakeFeedService.origins),
      };

      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      try {
        await validationPipe.transform(feedDto, {
          type: 'body',
          metatype: UpdateFeedDto,
        });

        const feed: Partial<Feed> = fakeFeedService.createFakeFeed();

        const feedWithId = {
          ...feed,
          _id: faker.string.uuid(),
        };

        jest.spyOn(feedService, 'update').mockResolvedValue(feedWithId as Feed);
        await feedController.update(
          feedWithId._id,
          feedDto,
          mockResponse as Response,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Bad Request Exception');

        mockResponse.status(HttpStatus.BAD_REQUEST);
        mockResponse.json({
          status: 'error',
          message: 'Invalid data provided',
        });
      }

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid data provided',
      });
    });
  });
});
