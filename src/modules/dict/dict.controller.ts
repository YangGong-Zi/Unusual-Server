import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  create(@Body() createDictDto: CreateDictDto) {
    return this.dictService.create(createDictDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('name') name: string) {
    return this.dictService.findAll(page, pageSize, name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
    return this.dictService.update(+id, updateDictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictService.remove(+id);
  }
}
