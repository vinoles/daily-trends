import { Test, TestingModule } from '@nestjs/testing';
import { FeedsService } from '../feeds.service';
import { getModelToken } from '@nestjs/mongoose';
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
  aggregate: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndDelete: jest.fn(),
};
