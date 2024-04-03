import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuDto } from './dto/menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Request } from 'express';
import { CheckPermissions } from '@/common/decorators/checkPermissions.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/add')
  @CheckPermissions(['admin', 'menu:add'])
  add(@Body() menu: MenuDto, @Req() req: Request) {
    return this.menuService.create(menu, req);
  }

  @Get('/treeMenu')
  findTreeMenu(@Req() req: Request) {
    return this.menuService.findTreeMenu(req);
  }

  @Get('/roleMenu')
  findRoleMenu(@Req() req: Request) {
    return this.menuService.findTreeMenu(req, true);
  }

  @Get()
  findAll(@Query('pid') pid: string, @Query('title') title: string) {
    return this.menuService.findAll(pid, title);
  }

  @Put()
  @CheckPermissions(['admin', 'menu:edit'])
  update(@Body() updateMenuDto: UpdateMenuDto, @Req() req: Request) {
    return this.menuService.update( updateMenuDto, req);
  }

  @Delete(':id')
  @CheckPermissions(['admin', 'menu:del'])
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
