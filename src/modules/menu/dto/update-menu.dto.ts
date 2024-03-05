import { PartialType } from '@nestjs/swagger';
import { MenuDto } from './menu.dto';

export class UpdateMenuDto extends PartialType(MenuDto) {}
