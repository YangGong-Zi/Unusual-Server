import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dict as DictEntity } from '@/common/entities/Dict';
import { DictDetailsModule } from '../dict-details/dict-details.module';

@Module({
  imports: [TypeOrmModule.forFeature([DictEntity]), DictDetailsModule],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
