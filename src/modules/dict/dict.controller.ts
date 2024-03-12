import { Controller, Get, Post, Body, Param, Delete, Query, Put, Req, Res } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Request, Response } from 'express';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  create(@Body() DictDto: DictDto,  @Req() req: Request) {
    return this.dictService.create(DictDto, req);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('name') name: string) {
    return this.dictService.findAll(page, pageSize, name);
  }

  @Put()
  update(@Body() updateDictDto: UpdateDictDto, @Req() req: Request) {
    return this.dictService.update(updateDictDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.dictService.remove(id);
  }

  @Post('/download')
  async exportExcel(@Query('name') name: string, @Res() res: Response) {
    const buffer = await this.dictService.exportExcel(name)
    res.set({
      'Content-Type': 'application/octet-stream'
    });
    res.send(buffer)
  }
}
