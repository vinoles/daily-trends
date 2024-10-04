import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { EnumOrigin } from '../../schemas/feed.schema';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createTestingFeedModule } from '../feed.base.testing.module';
import { FakeFeedService } from '../fake-feed.service';
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

  describe('findAllGroupedByOrigin', () => {
    /**
     * Should return a response with data list grouped by origin
     */
    it('should return a response with data list grouped by origin', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const origins = [
        EnumOrigin.COUNTRY_PAGE,
        EnumOrigin.LOCAL_PAGE,
        EnumOrigin.WORD_PAGE,
      ];

      let result: any[] = [];
      origins.forEach((origin) => {
        const feedsCount = _.random(1, 5);
        result.push(createFeedsAndMakeStructureResponse(feedsCount, origin));
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

      const origins = [
        EnumOrigin.COUNTRY_PAGE,
        EnumOrigin.LOCAL_PAGE,
        EnumOrigin.WORD_PAGE,
      ];

      const origin = _.sample(origins);

      const feedsCount = _.random(1, 5);
      let result: any[] = createFeedsAndMakeStructureResponse(
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

    /**
     * Create feeds by origin parameter and create response structure for controller
     *
     * @param count
     * @param origin
     * @returns
     */
    function createFeedsAndMakeStructureResponse(
      count: number,
      origin: EnumOrigin,
    ): any {
      const categories = ['technology', 'sport', 'finance'];
      const categoryResults = categories.map((category) => {
        const feeds = fakeFeedService.createFakeFeedsByOriginAndCategory(
          count,
          category,
          origin,
        );

        return {
          category: category,
          feeds: feeds,
          total: feeds.length,
        };
      });

      return {
        _id: origin,
        categories: categoryResults,
      };
    }
  });
});
