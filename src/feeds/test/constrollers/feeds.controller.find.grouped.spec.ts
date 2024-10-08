import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';
import { FakeFeedsFactory } from '../fake.feeds.factory';
import _ from 'lodash';

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

  describe('findAllGroupedByOrigin', () => {
    /**
     * Should return a response with data list grouped by origin
     */
    it('should return a response with data list grouped by origin', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const result: any[] = [];
      fakeFeedService.origins.forEach((origin) => {
        const feedsCount = _.random(1, 5);
        result.push(
          fakeFeedService.createFeedsAndMakeStructureResponse(
            feedsCount,
            origin,
          ),
        );
      });

      jest
        .spyOn(feedService, 'findAllGroupedByOrigin')
        .mockResolvedValue(result);

      await feedController.findAllGroupedByOrigin(
        _.random(1, 5),
        'desc',
        mockResponse as Response,
      );

      const expectedResult = {
        status: 'success',
        data: result,
      };

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    /**
     * Should return a response with data list grouped by random origin
     */
    it('should return a response with data list grouped by random origin', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const origin = _.sample(fakeFeedService.origins);

      const feedsCount = _.random(1, 5);
      const result: any[] = fakeFeedService.createFeedsAndMakeStructureResponse(
        feedsCount,
        origin,
      );

      jest
        .spyOn(feedService, 'findAllGroupedByOrigin')
        .mockResolvedValue(result);

      await feedController.findAllGroupedByOrigin(
        _.random(1, 5),
        'desc',
        mockResponse as Response,
      );

      const expectedResult = {
        status: 'success',
        data: result,
      };

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });
  });
});
