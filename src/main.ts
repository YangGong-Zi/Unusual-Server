import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filter/httpException.filter';
import { TransformInterceptor } from './interceptors/interceptors.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './common/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 访问配置项
  const configService = app.get(ConfigService);
  const appConfig = configService.get('APP') // 应用配置
  const swaggerConfig = configService.get('SWAGGER') // swagger配置

  // 设置接口前缀
  app.setGlobalPrefix(appConfig.prefix);

  // 统一响应体格式
  app.useGlobalInterceptors(new TransformInterceptor());

  // swagger
  const options = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(swaggerConfig.prefix, app, document);

  // 全局注册logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局守卫
  const jwtService = app.get<JwtService>(JwtService)
  const redisService = app.get<RedisService>(RedisService)
  app.useGlobalGuards(new AuthGuard(jwtService, redisService));

  await app.listen(appConfig.port);

}

bootstrap();
