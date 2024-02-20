import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { Request } from 'express';

@Controller()
@ApiTags("用户登录、注册、退出登录")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @Post('/login')
  @Public()
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @ApiOperation({ summary: '退出登录' })
  @Post('/logout')
  @Public()
  async logout(@Req() req: Request) {
    return this.authService.logout(req);
  }
}
