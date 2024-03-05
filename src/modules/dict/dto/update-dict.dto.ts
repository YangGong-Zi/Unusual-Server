import { PartialType } from '@nestjs/swagger';
import { CreateDictDto } from './dict.dto';

export class UpdateDictDto extends PartialType(CreateDictDto) {}
