import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictVersion } from './dict-version.entity';
import { DictVersionService } from './dict-version.service';

@Module({
  imports: [TypeOrmModule.forFeature([DictVersion])],
  providers: [DictVersionService],
  exports: [DictVersionService]
})
export class DictVersionModule {}
