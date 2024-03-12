import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from '../../common/entities/User';
import { UserRole } from '@/common/entities/UserRole';
import { RoleMenu } from '@/common/entities/RoleMenu';
import { Request } from 'express';
import { Menu } from '@/common/entities/Menu';

@Injectable()
export class UserService {

  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>
  @InjectRepository(UserRole)
  private readonly userRole: Repository<UserRole>
  @InjectRepository(RoleMenu)
  private readonly roleMenu: Repository<RoleMenu>
  @InjectRepository(Menu)
  private readonly menu: Repository<Menu>

  create(createUserDto: UserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user1`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async info(req: Request) {
    const user = JSON.parse(req.headers.user as string);
    return {...user};
  }
}
