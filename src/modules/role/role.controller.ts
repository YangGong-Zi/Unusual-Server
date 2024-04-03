import { Controller, Get, Post, Body, Param, Delete, Req, Query, Put, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request, Response } from 'express';
import { QueryDto } from './dto/query.dto';
import { CheckPermissions } from '@/common/decorators/checkPermissions.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @CheckPermissions(['admin', 'role:add'])
  create(@Body() createRoleDto: RoleDto, @Req() req: Request) {
    return this.roleService.create(createRoleDto, req);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number,  @Query('name') name: string, @Query('status') status: number) {
    return this.roleService.findAll(name, status, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Put()
  @CheckPermissions(['admin', 'role:edit'])
  update(@Body() updateRoleDto: UpdateRoleDto, @Req() req: Request) {
    return this.roleService.update(updateRoleDto, req);
  }

  @Delete(':id')
  @CheckPermissions(['admin', 'role:del'])
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }

  @Post('/download')
  @CheckPermissions(['admin', 'role:download'])
  async exportExcel(@Body() queryDto: QueryDto, @Res() res: Response) {
    const buffer = await this.roleService.exportExcel(queryDto)
    res.set({
      'Content-Type': 'application/octet-stream'
    });
    res.send(buffer)
  }

  @Get('/menu/:id')
  getRoleMenuId(@Param('id') id: string) {
    return this.roleService.getRoleMenuId(+id);
  }

  @Put('/menu/:id')
  async saveRoleMenu(@Param('id') roleId: number, @Body() menuIds: number[]) {
    return this.roleService.saveRoleMenu(roleId, menuIds);
  }
}
