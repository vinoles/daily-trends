import { Test, TestingModule } from '@nestjs/testing';
import { FeedsController } from '../feeds.controller';
import { FeedsService } from '../feeds.service';
import { Feed, FeedSchema } from '../schemas/feed.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FakeFeedsFactory } from './fake.feeds.factory';

export const createTestingFeedServiceModule =
  async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      providers: [
        FeedsService,
        {
          provide: getModelToken('Feed'),
          useValue: mockFeedRepository,
        },
        FakeFeedsFactory,
      ],
    }).compile();
  };

export const mockFeedRepository = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findAllGroupedByOrigin: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};
