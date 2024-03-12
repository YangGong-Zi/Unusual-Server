import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuDto } from './dto/menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Request } from 'express';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/add')
  add(@Body() menu: MenuDto, @Req() req: Request) {
    return this.menuService.create(menu, req);
  }

  @Get('/treeMenu')
  findTreeMenu(@Req() req: Request) {
    return this.menuService.findTreeMenu(req);
  }

  @Get()
  findAll(@Query('pid') pid: string, @Query('title') title: string) {
    return this.menuService.findAll(pid, title);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
