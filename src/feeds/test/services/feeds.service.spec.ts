import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import { createTestingFeedControllerModule } from '../feed.base.controller.testing.module';

describe('FeedsService', () => {
  let service: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedControllerModule();

    service = module.get<FeedsService>(FeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
