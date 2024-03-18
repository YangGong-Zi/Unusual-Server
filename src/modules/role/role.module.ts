import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@/common/entities/Role';
import { RoleMenu } from '@/common/entities/RoleMenu';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenu])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
