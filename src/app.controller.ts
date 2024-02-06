import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './common/redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly redisService: RedisService) {}

  @Get()
  async getHello() {
    const A = await this.redisService.getValue('status')
    console.log('123', A);
    return this.appService.getHello();
  }

  @Get('bbb/:id')
  bbb(@Param('id') id) {
      console.log(id);
      return 'bbb success';
  }

  @Post('ccc')
  ccc(@Body('ccc') ccc) {
      console.log(ccc);
      return 'ccc success';
  }
}
