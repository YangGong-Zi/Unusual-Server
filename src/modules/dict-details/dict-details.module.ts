import { Module } from '@nestjs/common';
import { DictDetailsService } from './dict-details.service';
import { DictDetailsController } from './dict-details.controller';
import { DictDetails } from '@/common/entities/DictDetails';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DictDetails])],
  controllers: [DictDetailsController],
  providers: [DictDetailsService],
  exports: [DictDetailsService]
})
export class DictDetailsModule {}
