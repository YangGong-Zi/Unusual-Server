import { Controller, Get } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Public } from '../decorators/public.decorator';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  @Public()
  getCaptcha() {
    return this.captchaService.getCaptcha();
  }
}
