import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { FeedsService } from '../../feeds.service';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';

describe('FeedsController', () => {
  let feedController: FeedsController;
  let feedService: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedControllerModule();

    feedController = module.get<FeedsController>(FeedsController);
    feedService = module.get(FeedsService);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });
});
