import { Injectable } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from '@/common/entities/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
@Injectable()
export class RoleService {

  @InjectRepository(Role)
  private readonly roleRepo: Repository<Role>

  create(roleDto: RoleDto) {
    return 'This action adds a new role';
  }

  findAll(req: Request, roleName: string, status: number) {
    const user = JSON.parse(req.headers.user as string)
    this.roleRepo.find({ where: {  } })
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
