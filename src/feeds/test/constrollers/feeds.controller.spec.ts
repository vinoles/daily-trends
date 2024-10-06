import { TestingModule } from '@nestjs/testing';
import { FeedsController } from '../../feeds.controller';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';

describe('FeedsController', () => {
  let feedController: FeedsController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedControllerModule();

    feedController = module.get<FeedsController>(FeedsController);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });
});
