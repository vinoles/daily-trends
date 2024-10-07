import { Test, TestingModule } from '@nestjs/testing';
import { FeedsService } from '../feeds.service';
import { getModelToken } from '@nestjs/mongoose';
import { FakeFeedsFactory } from './fake.feeds.factory';
import { FeedLogService } from '../feeds.logs.service';

export const createTestingFeedServiceModule =
  async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      providers: [
        FeedsService,
        FeedLogService,
        {
          provide: getModelToken('Feed'),
          useValue: mockFeedRepository,
        },
        {
          provide: getModelToken('FeedLog'),
          useValue: mockFeedLogRepository,
        },
        FakeFeedsFactory,
      ],
    }).compile();
  };

export const mockFeedRepository = {
  aggregate: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const mockFeedLogRepository = {
  create: jest.fn(),
};
