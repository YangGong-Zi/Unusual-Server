import { Test, TestingModule } from '@nestjs/testing';
import { DictDetailsController } from './dict-details.controller';
import { DictDetailsService } from './dict-details.service';

describe('DictDetailsController', () => {
  let controller: DictDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictDetailsController],
      providers: [DictDetailsService],
    }).compile();

    controller = module.get<DictDetailsController>(DictDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
