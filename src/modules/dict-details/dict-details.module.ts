import { Module, forwardRef } from '@nestjs/common';
import { DictDetailsService } from './dict-details.service';
import { DictDetailsController } from './dict-details.controller';
import { DictDetails } from '@/common/entities/DictDetails';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictModule } from '../dict/dict.module';
import { Dict } from '@/common/entities/Dict';

@Module({
  imports: [TypeOrmModule.forFeature([DictDetails, Dict]), forwardRef(() => DictModule)],
  controllers: [DictDetailsController],
  providers: [DictDetailsService],
  exports: [DictDetailsService]
})
export class DictDetailsModule {}
