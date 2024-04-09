import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ILike, Repository } from 'typeorm';
import { Role } from '@/common/entities/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { generateExcel } from '@/utils/excel';
import { RoleMenu } from '@/common/entities/RoleMenu';
import { QueryDto } from './dto/query.dto';
@Injectable()
export class RoleService {

  @InjectRepository(Role)
  private readonly roleRepo: Repository<Role>

  @InjectRepository(RoleMenu)
  private readonly roleMenu: Repository<RoleMenu>

  async create(roleDto: RoleDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...roleDto,
      createTime: new Date(),
      creator: user.account
    }
    const saveData = await this.roleRepo.save(data);
    if (saveData) return '新增成功';
    throw new HttpException({message: '新增失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findAll(name: string, status: number, page: number, pageSize: number) {
    let query = {}
    if((status ?? '') !== '') query = { status: status }
    if ((name ?? '') !== '') query = { ...query, name: ILike(`%${name}%`) }
    let paging = {}
    if (page !== undefined && pageSize !== undefined) paging = { skip: (page - 1) * pageSize, take: pageSize }
    const [role, total] = await this.roleRepo.findAndCount({
      where: query,
      ...paging,
      order: {
        sort: 'ASC'
      }
    })
    return { data: role, total }
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(updateRoleDto: UpdateRoleDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const { name, remark, sort, status, id } = updateRoleDto
    if (id === 1) throw new HttpException({message: '管理员账号不可操作'}, HttpStatus.INTERNAL_SERVER_ERROR);
    const data = {
      name,
      remark,
      sort,
      status,
      updateTime: new Date(),
      updater: user.account
    }
    const result = await this.roleRepo.update(id, data);
    if (result.affected > 0) return '修改成功';
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    if (id === 1) throw new HttpException({message: '管理员账号不可操作'}, HttpStatus.INTERNAL_SERVER_ERROR);
    const result = await this.roleRepo.delete(id);
    if (result.affected > 0) return '删除成功';
    throw new HttpException({message: '删除失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async exportExcel(queryDto: QueryDto) {
    const { status, name } = queryDto
    let query = {}
    if(status !== null) {
      query = {
        status: status
      }
    }
    if (name) {
      query = {
        name: ILike(`%${name}%`),
        ...query
      }
    }
    const data = await this.roleRepo.find({
      where: {
        ...query
      },
      order: {
        sort: 'ASC'
      }
    })
    const header = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '角色名称', key: 'name', width: 50 },
      { header: '角色排序', key: 'sort', width: 50},
      { header: '角色状态', key: 'status', width: 50},
      { header: '角色描述', key: 'remark', width: 50},
      { header: '创建时间', key: 'createTime', width: 50 },
      { header: '更新时间', key: 'updateTime', width: 50 },
      { header: '创建人', key: 'creator', width: 50 },
      { header: '更新人', key: 'updater', width: 50 }
    ]
    const buffer = await generateExcel(data, header)
    return buffer
  }

  async getRoleMenuId(roleId: number) {
    const roleMenuIds = await this.roleMenu.find({
      where: {
        roleId: roleId
      }
    })
    return roleMenuIds.map(item => item.menuId)
  }

  async saveRoleMenu(roleId: number, menuIds: number[]) {
    try {
      await this.roleMenu.delete({ roleId: roleId })
      const resultPromiss = await menuIds.map(async item => {
        const menu = await this.roleMenu.save({
          menuId: item,
          roleId: roleId
        })
        return menu
      })
      await Promise.all(resultPromiss)
      return '保存成功'
    } catch (error) {
      throw new HttpException({message: '保存失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
