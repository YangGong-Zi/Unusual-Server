import { Test, TestingModule } from '@nestjs/testing';
import { DictController } from './dict.controller';
import { DictService } from './dict.service';

describe('DictController', () => {
  let controller: DictController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictController],
      providers: [DictService],
    }).compile();

    controller = module.get<DictController>(DictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
