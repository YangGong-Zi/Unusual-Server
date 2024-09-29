// 全局拦截器，统一返回格式
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import * as moment from 'moment';
import { map } from "rxjs";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler,) {
    const request = context.switchToHttp().getRequest();
    // 演示环境数据不可更改
    const env = process.env.NODE_ENV
    const isPro = env === 'prod'
    const white = ['/dict/details']
    const isPass = isPro && (request.method === 'DELETE' || request.method === 'PUT' || (request.method === 'POST' && !white.some(val => val === request.url)))
    if (isPass) {
      throw new HttpException({ message: '演示环境数据不可更改', code: 999 }, 200)
    }
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        data,
        message: "请求成功",
        path: request.url,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      })),
    );
  }
}
