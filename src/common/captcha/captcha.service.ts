import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid'
import { RedisService } from '../redis/redis.service';

type Status = 'SUCESS' | 'ERROR' | 'TIMEOUT'
@Injectable()
export class CaptchaService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  // 获取验证码
  getCaptcha(timeOut: number = 60) {
    // 生成验证码
    const captcha = svgCaptcha.create({ size: 4, ignoreChars: '0o1i', noise: 10, width: 100, height: 34 })
    const uniqueId: string = uuidv4();
    this.redisService.setWithExpiry(uniqueId, captcha.text, timeOut)
    return {
      captcha: captcha.data,
      uid: uniqueId
    };
  }

  // 验证验证码
  async validateCaptcha(captcha: string, uid: string) {
    const correctCaptcha = await this.redisService.getValue(uid);
    if (!correctCaptcha) throw new HttpException({ message: '验证码已过期', code: 999 }, 200);
    if (captcha.toLowerCase() !== correctCaptcha.toLowerCase()) throw new HttpException({ message: '验证码错误', code: 999 }, 200);
    await this.redisService.deleteKey(uid)
  }

}
