import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  controllers: [RedisController],
  exports: [RedisService], // 导出 RedisService
  providers: [RedisService],
  imports: [ConfigModule.forRoot()] // 导入配置文件
})
export class RedisModule {}
