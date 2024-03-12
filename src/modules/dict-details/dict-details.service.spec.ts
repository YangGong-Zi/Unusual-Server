import { Test, TestingModule } from '@nestjs/testing';
import { DictDetailsService } from './dict-details.service';

describe('DictDetailsService', () => {
  let service: DictDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictDetailsService],
    }).compile();

    service = module.get<DictDetailsService>(DictDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
