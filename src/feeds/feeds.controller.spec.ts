import { Test, TestingModule } from '@nestjs/testing';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { EnumFeed, Feed, FeedSchema } from './schemas/feed.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

describe('FeedsController', () => {
  let feedController: FeedsController;
  let feedService: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedsController],
      providers: [FeedsService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DB_CONNECTION),
        MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
      ],
    }).compile();

    feedController = module.get<FeedsController>(FeedsController);
    feedService = module.get(FeedsService);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a response with data list', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const feed = new Feed();
      feed.title = 'Lorem Ipsum Title';
      feed.subtitle = 'Lorem Ipsum Subtitle';
      feed.category = 'technology';
      feed.url = 'https://example.com/lorem-feed';
      feed.urlImage = 'https://example.com/lorem-image.jpg';
      feed.author = 'John Doe';
      feed.origin = EnumFeed.COUNTRY_PAGE;
      feed.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      feed.publishedAt = new Date('2024-10-03T14:34:30.008Z').toISOString();

      const result = { status: 'success', data: { data: [feed], total: 1 } };

      console.log(result);
      jest
        .spyOn(feedService, 'findAll')
        .mockResolvedValue({ data: [feed], total: 1 });

      await feedController.findAll(1, 10, 'asc', mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

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
