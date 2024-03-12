import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { extractTokenFromHeader } from '@/utils/help';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService, private readonly redisService: RedisService) { }

  private readonly reflector: Reflector = new Reflector();

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公共路由（不需要token验证，例：验证码、登录、注册等）
    if (isPublic) {
      return true;
    }

    // 获取请求的内容
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    // 是否存在token
    if (!token) {
      throw new UnauthorizedException();
    }
    // 验证token是否有效
    try {
      const info = this.jwtService.verify(token);

      // 如果redis中没有已当前token为键的值，那么说明当前token用户已经退出登录
      if(!await this.redisService.getValue(token)) throw new UnauthorizedException('登录 token 失效，请重新登录');

      request.headers.user = JSON.stringify(info.user);
    } catch(e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
    return true;
  }
}
