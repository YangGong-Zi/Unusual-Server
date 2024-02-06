import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { }

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
    const token = this.extractTokenFromHeader(request);
    // 是否存在token
    if (!token) {
      throw new UnauthorizedException();
    }
    // 验证token是否有效
    try {
      const info = this.jwtService.verify(token);
      (request as any).user = info.user;
    } catch(e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
    return true;
  }

  // 通过 请求头拿到 token
  private extractTokenFromHeader(request: Request): string | undefined {

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return token
    return type === 'Bearer' ? token : undefined;
  }

}
