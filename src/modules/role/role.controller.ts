import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: RoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(@Req() req: Request, @Query() roleName: string, @Query() status: number) {
    return this.roleService.findAll(req, roleName, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
