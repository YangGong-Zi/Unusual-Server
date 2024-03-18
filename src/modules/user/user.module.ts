import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from '~/entities/User';
import { UserRole } from '@/common/entities/UserRole';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRole])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
