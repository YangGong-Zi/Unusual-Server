import { Controller, Get, Post, Body, Param, Delete, Req, Query, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { QueryDto } from './dto/query.dto';
import { CheckPermissions } from '@/common/decorators/checkPermissions.decorator';

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
  @CheckPermissions(['admin', 'user:add'])
  create(@Body() userDto: UserDto, @Req() req: Request) {
    return this.userService.create(userDto, req);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('account') account: string,
    @Query('status') status: number,
    @Query('phone') phone: string
  ) {
    return this.userService.findAll(page, pageSize, account, status, phone);
  }

  @Get('/info')
  findOneInfo(@Req() req: Request) {
    return this.userService.info(req)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put()
  @CheckPermissions(['admin', 'user:edit'])
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.userService.update( updateUserDto, req);
  }

  @Delete(':id')
  @CheckPermissions(['admin', 'user:del'])
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('/download')
  @CheckPermissions(['admin', 'user:download'])
  async exportExcel(
    @Body() queryDto: QueryDto,
    @Res() res: Response
  ) {
    const buffer = await this.userService.exportExcel(queryDto)
    res.set({
      'Content-Type': 'application/octet-stream'
    });
    res.send(buffer)
  }
}
