import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Repository } from 'typeorm';
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

  async create(createMenuDto: CreateMenuDto, req: Request) {
    const token = extractTokenFromHeader(req)
    const user = JSON.parse(await this.redisService.getValue(token))
    this.menuRepo.save({ ...createMenuDto, createTime: new Date(), creator: user?.name });
    return '创建成功';
  }

  async findTreeMenu() {
    const menu = await this.menuRepo.find();
    const treeMenu = this.convertToTree(menu as CreateMenuDto[]);

    return treeMenu;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }

  convertToTree(menus: CreateMenuDto[]): CreateMenuDto[] {
    const map: Record<number, CreateMenuDto> = {}
    const tree: CreateMenuDto[] = []

    menus.forEach(menu => {
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
        keepAlive: menu.keepAlive || 0,
        menuType: menu.menuType,
        externalLink: menu.externalLink || 0,
        link: menu.link || '',
        sort: menu.sort,
        children: map[id]?.children || [],
        createTime: menu.createTime,
        creator: menu.creator,
        updateTime: menu.updateTime,
        updater: menu.updater,
        isLeaf: false
      }
      if (pid === 0) {
        tree.push(map[id])
      } else {
        if (!map[pid]) {
          map[pid] = {} as CreateMenuDto
          map[pid].children = []
        }
        map[pid].children?.push(map[id])
      }
    })
    return this.removeEmptyAndSortTree(tree)
  }

  // 排序和去除空children
  removeEmptyAndSortTree(tree: CreateMenuDto[]) {
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

  // 生成懒加载结构跟排序
  sortMenu(menu: CreateMenuDto[], menus: CreateMenuDto[]) {
    menu.sort((a, b) => a.sort - b.sort)
    menu.map(item => {
      const children = menus.filter(menu => item.id === menu.pid)
      item.isLeaf = children.length > 0 ? false : true
    })
    return menu
  }
}
