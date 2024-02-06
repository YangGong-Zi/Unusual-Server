import { Logger, Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getYmlConfig } from './utils/yml.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './modules/user/user.module';
import { SystemModule } from './modules/system/system.module';
import { LoggerModule } from './common/logger/logger.module';
import { RedisModule } from './common/redis/redis.module';
import { CaptchaModule } from './common/captcha/captcha.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './common/auth/auth.module';
import { GithubModule } from './modules/github/github.module';
import { MenuModule } from './modules/menu/menu.module';

@Module({
  imports: [
    // 加载环境配置文件
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [getYmlConfig],
    }),
    // 数据库-typeorm配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          autoLoadEntities: true,
          keepConnectionAlive: true,
          synchronize: false, // 是否开启自动迁移，建议禁用，风险不可控
          ...config.get('MYSQL'),
        } as TypeOrmModuleOptions
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return new DataSource(options);
      }
    }),
    // jwt 全局注册
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const jwtConfig = config.get('JWT');
        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn
          }
        }
      }
    }),
    UserModule,
    SystemModule,
    LoggerModule,
    RedisModule,
    CaptchaModule,
    AuthModule,
    GithubModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
  ],
  exports: [Logger],
})
export class AppModule { }
