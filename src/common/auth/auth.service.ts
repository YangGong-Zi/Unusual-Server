import { HttpException, Inject, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegistAuthDto } from './dto/regist-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/common/entities/User';
import { Repository } from 'typeorm';
import { CaptchaService } from '../captcha/captcha.service';
import { RedisService } from '../redis/redis.service';
import { extractTokenFromHeader } from '@/utils/help';
import { Request } from 'express';
import { decrypt } from '@/utils/ase';
import { md5Encrypt } from '@/utils/md5';
import { UserRole } from '../entities/UserRole';
import { RoleMenu } from '../entities/RoleMenu';
import { Menu } from '../entities/Menu';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  // constructor (private configService: ConfigService) {}
  @InjectRepository(User)
  private readonly userRepo: Repository<User>
  @InjectRepository(UserRole)
  private readonly userRole: Repository<UserRole>
  @InjectRepository(RoleMenu)
  private readonly roleMenu: Repository<RoleMenu>
  @InjectRepository(Menu)
  private readonly menu: Repository<Menu>

  @Inject(CaptchaService)
  private readonly captchaService: CaptchaService;
  @Inject(JwtService)
  private readonly jwtService: JwtService
  @Inject(RedisService)
  private readonly redisService: RedisService
  @Inject(ConfigService)
  private readonly configService: ConfigService

  // 登录
  async login(loginAuthDto: LoginAuthDto) {
    await this.captchaService.validateCaptcha(loginAuthDto.captchaText, loginAuthDto.captchaUid);
    const pwd = md5Encrypt(md5Encrypt(decrypt(loginAuthDto.password)))
    const user = await this.userRepo.findOneBy({ account: loginAuthDto.name, password: pwd })

    if (!user) throw new HttpException({ message: '用户名或密码错误', code: 999 }, 200);
    const token = this.jwtService.sign({
      user
    })
    const appconfig = this.configService.get('APP');
    this.redisService.setWithExpiry(token, JSON.stringify(user), appconfig.tokenTime)
    await this.redisService.setValue(token, JSON.stringify(user))
    return token
  }
  // 注册
  regist(createAuthDto: RegistAuthDto) {
    return 'This action adds a new auth';
  }
  // 退出登录
  async logout(request: Request) {
    const token = extractTokenFromHeader(request)
    if(token) this.redisService.deleteKey(token)
    return '退出登录成功';
  }
}
