import { Module, forwardRef } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dict as DictEntity } from '@/common/entities/Dict';
import { DictDetailsModule } from '../dict-details/dict-details.module';
import { DictVersionModule } from '../dict-version/dict-version.module';

@Module({
  imports: [TypeOrmModule.forFeature([DictEntity]), forwardRef(() => DictDetailsModule), DictVersionModule],
  controllers: [DictController],
  providers: [DictService],
  exports: [DictService]
})
export class DictModule {}
