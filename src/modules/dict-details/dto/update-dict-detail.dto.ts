import { PartialType } from '@nestjs/swagger';
import { DictDetailDto } from './dict-detail.dto';

export class UpdateDictDetailDto extends PartialType(DictDetailDto) {}
