import { TestingModule } from '@nestjs/testing';
import { FeedsService } from './feeds.service';
import { createTestingFeedModule } from './feed.base.testing.module';

describe('FeedsService', () => {
  let service: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedModule();

    service = module.get<FeedsService>(FeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
