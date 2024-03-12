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

@Injectable()
export class AuthService {

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

  // 登录
  async login(loginAuthDto: LoginAuthDto) {
    await this.captchaService.validateCaptcha(loginAuthDto.captchaText, loginAuthDto.captchaUid);
    const pwd = md5Encrypt(md5Encrypt(decrypt(loginAuthDto.password)))
    const user = await this.userRepo.findOneBy({ account: loginAuthDto.name, password: pwd })
    const userRoles = await this.userRole.find({ select: ['roleId'], where: { userId: user.id } });

    const roleMenuPromises = userRoles.map(async (userRole) => {
      const roleMenus = await this.roleMenu.find({ where: { roleId: userRole.roleId } });
      const menuPromises = roleMenus.map(async (roleMenu) => {
        const menu = await this.menu.findOne({ where: { id: roleMenu.menuId } });
        return menu; // 如果menu存在则返回competence，否则返回空字符串
      });
      return Promise.all(menuPromises);
    });

    const menus = await Promise.all(roleMenuPromises);

    // 获取用户的权限标识
    const competences = menus.flat().map((menu) => {
      return menu.competence
    }).filter(Boolean);

    if (!user) throw new HttpException({ message: '用户名或密码错误', code: 999 }, 200);
    const token = this.jwtService.sign({
      user: {
        ...user,
        password: undefined,
        role: competences,
        menu: menus.flat()
      }
    })
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
