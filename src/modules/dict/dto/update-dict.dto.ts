import { PartialType } from '@nestjs/swagger';
import { DictDto } from './dict.dto';

export class UpdateDictDto extends PartialType(DictDto) {}
