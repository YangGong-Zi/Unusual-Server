import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Put } from '@nestjs/common';
import { DictDetailsService } from './dict-details.service';
import { DictDetailDto } from './dto/dict-detail.dto';
import { UpdateDictDetailDto } from './dto/update-dict-detail.dto';
import { Request } from 'express';

@Controller('dictDetails')
export class DictDetailsController {
  constructor(private readonly dictDetailsService: DictDetailsService) {}

  @Post()
  create(@Body() createDictDetailDto: DictDetailDto, @Req() req: Request) {
    return this.dictDetailsService.create(createDictDetailDto, req);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('pid') pid: number) {
    return this.dictDetailsService.findAll(page, pageSize, pid);
  }
  @Put()
  update(@Body() updateDictDetailDto: UpdateDictDetailDto, @Req() req: Request) {
    return this.dictDetailsService.update(updateDictDetailDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.dictDetailsService.remove(id);
  }
}
