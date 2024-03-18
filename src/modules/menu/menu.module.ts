import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu as MenuEntity } from '~/entities/Menu';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '@/common/entities/UserRole';
import { RoleMenu } from '@/common/entities/RoleMenu';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, UserRole, RoleMenu])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
