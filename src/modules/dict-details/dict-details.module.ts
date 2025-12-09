import { Module, forwardRef } from '@nestjs/common';
import { DictDetailsService } from './dict-details.service';
import { DictDetailsController } from './dict-details.controller';
import { DictDetails } from '@/common/entities/DictDetails';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictModule } from '../dict/dict.module';
import { Dict } from '@/common/entities/Dict';
import { DictVersionModule } from '../dict-version/dict-version.module';

@Module({
  imports: [TypeOrmModule.forFeature([DictDetails, Dict]), forwardRef(() => DictModule), DictVersionModule],
  controllers: [DictDetailsController],
  providers: [DictDetailsService],
  exports: [DictDetailsService]
})
export class DictDetailsModule {}
