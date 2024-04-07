import { Controller, Get, Post, Body, Param, Delete, Query, Put, Req, Res } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Request, Response } from 'express';
import { QueryDto } from './dto/query.dto';
import { CheckPermissions } from '@/common/decorators/checkPermissions.decorator';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  @CheckPermissions(['admin', 'dict:del'])
  create(@Body() DictDto: DictDto,  @Req() req: Request) {
    return this.dictService.create(DictDto, req);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('name') name: string) {
    return this.dictService.findAll(page, pageSize, name);
  }

  @Put()
  @CheckPermissions(['admin', 'dict:edit'])
  update(@Body() updateDictDto: UpdateDictDto, @Req() req: Request) {
    return this.dictService.update(updateDictDto, req);
  }

  @Delete(':id')
  @CheckPermissions(['admin', 'dict:del'])
  remove(@Param('id') id: number) {
    return this.dictService.remove(id);
  }

  @Post('/download')
  @CheckPermissions(['admin', 'dict:download'])
  async exportExcel(@Body() queryDto: QueryDto, @Res() res: Response) {
    const buffer = await this.dictService.exportExcel(queryDto)
    res.set({
      'Content-Type': 'application/octet-stream'
    });
    res.send(buffer)
  }

  @Post('/details')
  findDetails(@Body() name: string[]) {
    return this.dictService.findDetails(name);
  }
}
