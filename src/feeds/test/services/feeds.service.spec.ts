import { TestingModule } from '@nestjs/testing';
import { FeedsService } from '../../feeds.service';
import { createTestingFeedServiceModule } from '../feed.base.service.testing.module';

describe('FeedsService', () => {
  let service: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingFeedServiceModule();

    service = module.get<FeedsService>(FeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
