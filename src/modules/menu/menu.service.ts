import { Injectable } from '@nestjs/common';
import { MenuDto } from './dto/menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ILike, Repository } from 'typeorm';
import { Menu as MenuEntity } from '~/entities/Menu';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';


@Injectable()
export class MenuService {

  @InjectRepository(MenuEntity)
  private readonly menuRepo: Repository<MenuEntity>

  async create(menuDto: MenuDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    this.menuRepo.save({ ...menuDto, createTime: new Date(), creator: user?.name });
    return '创建成功';
  }

  async findTreeMenu(req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const menu = user.menu;
    const treeMenu = this.convertToTree(menu as MenuDto[], false);

    return treeMenu;
  }

  async findAll(pid: string, title: string) {
    let query = {}
    if(pid !== undefined) query = { pid };
    if(title) query = { ...query, title: ILike(`%${title}%`) };
    const menu = await this.menuRepo.find({ where : query } );
    return menu;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
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
