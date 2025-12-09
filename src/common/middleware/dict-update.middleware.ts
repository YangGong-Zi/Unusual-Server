import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DictUpdateMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // 原子操作：获取并删除Redis中的dict-update值
      const dictUpdateValue = await this.redisService.getValue('dict-update');
      
      if (dictUpdateValue) {
        // 添加到响应头
        res.setHeader('dict-update', dictUpdateValue);
        
        // 清空Redis中的值
        await this.redisService.deleteKey('dict-update');
      }
    } catch (error) {
      // Redis操作失败，记录错误但不影响请求处理
      console.error('DictUpdateMiddleware处理失败:', error);
    }
    
    // 继续处理请求
    next();
  }
}
