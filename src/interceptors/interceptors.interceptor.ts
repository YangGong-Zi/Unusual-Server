// 全局拦截器，统一返回格式
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import * as moment from 'moment';
import { map } from "rxjs";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler,) {
    const request = context.switchToHttp().getRequest();
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
