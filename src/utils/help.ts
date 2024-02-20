import { Request } from 'express';

// 通过 请求头拿到 token
export const extractTokenFromHeader = (request: Request): string | undefined => {

  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  // return token
  return type === 'Bearer' ? token : undefined;
}