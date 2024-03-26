import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from '../../common/entities/User';
import { UserRole } from '@/common/entities/UserRole';
import { Request } from 'express';
import { generateExcel } from '@/utils/excel';
import { QueryDto } from './dto/query.dto';
import { RoleMenu } from '@/common/entities/RoleMenu';
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



  async create(userDto: UserDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const repeatuAccount = await this.userRepo.findOne({ where: {account: userDto.account} })
    const repeatuPhone = await this.userRepo.findOne({ where: {phone: userDto.phone} })
    const repeatuEmail = await this.userRepo.findOne({ where: {email: userDto.email} })
    if (repeatuAccount) throw new ConflictException('账号已存在')
    if (repeatuPhone) throw new ConflictException('手机号已存在')
    if (repeatuEmail) throw new ConflictException('邮箱已存在')
    const data = {
      ...userDto,
      password: '123456',
      createTime: new Date(),
      creator: user.account
    }
    if (userDto.roles) {
      const rolePromiss = userDto.roles.map(async item => {
        const userRole = {
          userId: userDto.id,
          roleId: item
        }
        const role = await this.userRole.save(userRole)
        return role
      })
    }
    const saveData = await this.userRepo.save(data);
    if (saveData) return '新增成功';
    throw new HttpException({message: '新增失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findAll(page: number, pageSize: number, account: string, status: number, phone: string) {
    let query = {}
    if((status ?? '') !== '') query = { status }
    if ((account ?? '') !== '') query = { ...query, account: ILike(`%${account}%`) }
    if ((phone ?? '') !== '') query = { ...query, phone: ILike(`%${phone}%`) }
    let paging = {}
    if (page !== undefined && pageSize !== undefined) paging = { skip: (page - 1) * pageSize, take: pageSize }
    const [user, total] = await this.userRepo.findAndCount({
      where: query,
      select: ['id', 'account', 'name', 'email', 'phone', 'status', 'sex', 'createTime', 'updateTime'],
      ...paging,
      order: {
        id: 'ASC'
      }
    })
    const rolePromiss = user.map(async item => {
      const role = await this.userRole.find({ where: { userId: item.id } })
      let roles = []
      if(role) roles = role.map(item => item.roleId)
      return {...item, roles}
    })
    const data = await Promise.all(rolePromiss)
    return { data, total }
  }

  findOne(id: number) {
    return `This action returns a #${id} user1`;
  }

  async update(updateUserDto: UpdateUserDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const { account, name, phone, email, status, id, sex } = updateUserDto
    const data = {
      name,
      account,
      phone,
      status,
      email,
      sex,
      updateTime: new Date(),
      updater: user.account
    }
    if (updateUserDto.roles) {
      await this.userRole.delete({ userId: updateUserDto.id })
      const rolePromiss = updateUserDto.roles.map(async item => {
        const userRole = {
          userId: updateUserDto.id,
          roleId: item
        }
        const role = await this.userRole.save(userRole)
        return role
      })
      await Promise.all(rolePromiss)
    }
    const result = await this.userRepo.update(id, data);
    if (result.affected > 0) return '修改成功';
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected > 0) return '删除成功';
    throw new HttpException({message: '删除失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async info(req: Request) {
    const user = JSON.parse(req.headers.user as string);
    const userRoles = await this.userRole.find({ select: ['roleId'], where: { userId: user.id } });
    const roleMenuPromises = userRoles.map(async (userRole) => {
      const roleMenus = await this.roleMenu.find({ where: { roleId: userRole.roleId } });
      const menuPromises = roleMenus.map(async (roleMenu) => {
        const menu = await this.menu.findOne({ where: { id: roleMenu.menuId } });
        return menu;
      });
      return Promise.all(menuPromises);
    });

    const menus = await Promise.all(roleMenuPromises);

    // 获取用户的权限标识
    const competences = menus.flat().filter(Boolean).map((menu) => {
      return menu.competence
    }).filter(Boolean);
    if (user.account === 'admin') {
      competences.push('admin')
    }

    return {...user, roles: [...new Set(competences)]};
  }

  async exportExcel(queryDto: QueryDto) {
    const { account, status, phone } = queryDto
    let query = {}
    if((status ?? '') !== '') query = { status }
    if ((account ?? '') !== '') query = { ...query, account: ILike(`%${account}%`) }
    if ((phone ?? '') !== '') query = { ...query, phone: ILike(`%${phone}%`) }

    const data = await this.userRepo.find({
      where: {
        ...query
      },
      order: {
        id: 'ASC'
      }
    })
    const header = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '账号', key: 'account', width: 50 },
      { header: '名称', key: 'name', width: 50},
      { header: '状态', key: 'status', width: 50},
      { header: '邮箱', key: 'email', width: 50},
      { header: '性别', key: 'sex', width: 50},
      { header: '手机号', key: 'phone', width: 50},
      { header: '创建时间', key: 'createTime', width: 50 },
      { header: '更新时间', key: 'updateTime', width: 50 },
      { header: '创建人', key: 'creator', width: 50 },
      { header: '更新人', key: 'updater', width: 50 }
    ]
    const buffer = await generateExcel(data, header)
    return buffer
  }
}
