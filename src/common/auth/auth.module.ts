import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User as UserEntity } from '~/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../entities/UserRole';
import { RoleMenu } from '../entities/RoleMenu';
import { Menu } from '../entities/Menu';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRole, RoleMenu, Menu])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
