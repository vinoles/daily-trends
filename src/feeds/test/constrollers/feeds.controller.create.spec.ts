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
import { CreateFeedDto } from '../../dto/create-feed.dto';

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

  describe('create', () => {
    it('should return a response for id feed', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const feedDto: CreateFeedDto = fakeFeedService.createFakeFeedDto();

      jest.spyOn(feedService, 'create');

      await feedController.create(feedDto, mockResponse as Response);
    });

    it('should handle errors and return 400', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      let feedDto: CreateFeedDto = fakeFeedService.createFakeFeedDto();
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
          metatype: CreateFeedDto,
        });

        await feedController.create(feedDto, mockResponse as Response);
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
