import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MenuDto } from './dto/menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ILike, Repository } from 'typeorm';
import { Menu as MenuEntity } from '~/entities/Menu';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UserRole } from '@/common/entities/UserRole';
import { RoleMenu } from '@/common/entities/RoleMenu';


@Injectable()
export class MenuService {

  @InjectRepository(MenuEntity)
  private readonly menuRepo: Repository<MenuEntity>
  @InjectRepository(UserRole)
  private readonly userRole: Repository<UserRole>
  @InjectRepository(RoleMenu)
  private readonly roleMenu: Repository<RoleMenu>


  async create(menuDto: MenuDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const menu = await this.menuRepo.save({ ...menuDto, createTime: new Date(), creator: user?.name, isLeaf: true });
    if (menu.menuType === 0) {
      await this.menuRepo.update({ id: menu.pid }, { isLeaf: false });
    }
    if(!menu) throw new HttpException({message:'创建失败'}, HttpStatus.BAD_REQUEST);
    return '创建成功';
  }

  async findTreeMenu(req: Request, isAll: boolean = false) {
    const user = JSON.parse(req.headers.user as string)
    if (user.account === 'admin') {
      const menus = await this.menuRepo.find();
      return this.convertToTree(menus as MenuDto[], isAll);
    }
    const userRoles = await this.userRole.find({ select: ['roleId'], where: { userId: user.id } });
    const roleMenuPromises = userRoles.map(async (userRole) => {
      const roleMenus = await this.roleMenu.find({ where: { roleId: userRole.roleId } });
      const menuPromises = roleMenus.map(async (roleMenu) => {
        const menu = await this.menuRepo.findOne({ where: { id: roleMenu.menuId } });
        return menu;
      });
      return Promise.all(menuPromises);
    });

    const tempMenus = await Promise.all(roleMenuPromises);
    const menus = tempMenus.flat().filter(Boolean);
    const parentMenuPromiss = menus.map(async menu => {
      if (menu.pid !== 0 && menus.findIndex(item => menu.pid === item.id) < 0) {
        return await this.menuRepo.findOne({ where: { id: menu.pid } });
      }
    })
    const parentMenus = await Promise.all(parentMenuPromiss);
    const treeMenu = this.convertToTree([...menus, ...parentMenus.filter(Boolean)] as MenuDto[], isAll);

    return treeMenu;
  }

  async findAll(pid: string, title: string) {
    let query = {}
    if(pid !== undefined) query = { pid };
    if(title) query = { ...query, title: ILike(`%${title}%`) };
    const menu = await this.menuRepo.find({ where : query } );
    return { data: menu };
  }

  async update(updateMenuDto: UpdateMenuDto, req: Request) {
    const { id } = updateMenuDto
    const user = JSON.parse(req.headers.user as string)
    const data = { ...updateMenuDto, updateTime: new Date(), updater: user.account }
    const result = await this.menuRepo.update(id, data);
    if (data.pid !== 0) {
      await this.menuRepo.update({ id: data.pid }, { isLeaf: false });
    }
    if (result.affected > 0) return '修改成功';
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    const menu = await this.menuRepo.findOne({where: { id }});
    if (menu.pid === 0) {
      const menus = await this.menuRepo.find({ where: { pid: menu.id } });
      const menuPromiss = menus.map(async item => {
        const result = await this.menuRepo.delete(item.id);
        return result
      })
      await Promise.all(menuPromiss);
    } else {
      const menus = await this.menuRepo.find({ where: { pid: menu.id } });
      if (menus.length <= 1) await this.menuRepo.update({ id: menu.pid }, { isLeaf: true });
    }
    const result = await this.menuRepo.delete(id);
    if (result.affected > 0) return '删除成功';
    throw new HttpException({message: '删除失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // 转为树形结构
  convertToTree(menus: MenuDto[], isAll: boolean = true): MenuDto[] {
    const map: Record<number, MenuDto> = {}
    const tree: MenuDto[] = []

    menus.forEach(menu => {
      if (menu.menuType !== 2 || isAll) {
        const { id, pid } = menu

        map[id] = {
          id: menu.id,
          pid: menu.pid,
          path: menu.path,
          name: menu.name,
          component: menu.component,
          title: menu.title,
          visibily: menu.visibily,
          icon: menu.icon,
          keepAlive: menu.keepAlive,
          menuType: menu.menuType,
          externalLink: menu.externalLink,
          link: menu.link,
          sort: menu.sort,
          children: map[id]?.children || [],
          createTime: menu.createTime,
          creator: menu.creator,
          updateTime: menu.updateTime,
          updater: menu.updater,
          isLeaf: menu.isLeaf
        }
        if (pid === 0) {
          tree.push(map[id])
        } else {
          if (!map[pid]) {
            map[pid] = {} as MenuDto
            map[pid].children = []
          }
          map[pid].children?.push(map[id])
        }
      }
    })
    return this.removeEmptyAndSortTree(tree)
  }

  // 排序和去除空children
  removeEmptyAndSortTree(tree: MenuDto[]) {
    tree.sort((a, b) => a.sort - b.sort)
    tree.forEach(item => {
      if (!item.children || item.children.length === 0) {
        return item.children = undefined
      } else {
        this.removeEmptyAndSortTree(item.children)
      }
    })
    return tree
  }
}
