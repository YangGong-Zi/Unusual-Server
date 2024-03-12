import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller({
  path: "user",
  version: '1'
})
@ApiTags("用户管理")
@ApiHeader({
  name: 'authoriation',
  required: true,
  description: '本次请求请带上token',
})

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/info')
  findOneInfo(@Req() req: Request) {
    return this.userService.info(req)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
