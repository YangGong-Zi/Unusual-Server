import { Inject, Injectable, Query } from '@nestjs/common';
import { MenuDto } from './dto/menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ILike, Repository } from 'typeorm';
import { Menu as MenuEntity } from '~/entities/Menu';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { extractTokenFromHeader } from '@/utils/help';
import { RedisService } from '@/common/redis/redis.service';


@Injectable()
export class MenuService {

  @InjectRepository(MenuEntity)
  private readonly menuRepo: Repository<MenuEntity>
  @Inject(RedisService)
  private readonly redisService: RedisService

  async create(createMenuDto: MenuDto, req: Request) {
    const token = extractTokenFromHeader(req)
    const user = JSON.parse(await this.redisService.getValue(token))
    this.menuRepo.save({ ...createMenuDto, createTime: new Date(), creator: user?.name });
    return '创建成功';
  }

  async findTreeMenu() {
    const menu = await this.menuRepo.find();
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
          icon: menu.icon || '',
          keepAlive: menu.keepAlive || false,
          menuType: menu.menuType,
          externalLink: menu.externalLink || false,
          link: menu.link || '',
          sort: menu.sort,
          children: map[id]?.children || [],
          createTime: menu.createTime,
          creator: menu.creator,
          updateTime: menu.updateTime,
          updater: menu.updater,
          isLeaf: menu.isLeaf || false
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
