import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { createTestingFeedModule } from '../feed.base.testing.module';

describe('FeedsController', () => {
  let feedController: FeedsController;
  let feedService: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedModule();

    feedController = module.get<FeedsController>(FeedsController);
    feedService = module.get(FeedsService);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });
});
