import { Injectable } from '@nestjs/common';
import { DictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict as DictEntity } from '@/common/entities/Dict';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Request } from 'express';
import { generateExcel } from '@/utils/excel';

@Injectable()
export class DictService {

  @InjectRepository(DictEntity)
  private readonly dictEntity: Repository<DictEntity>

  async create(dictDto: DictDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...dictDto,
      createTime: new Date(),
      creator: user.account
    }
    const savedDict = await this.dictEntity.save(data);
    if (savedDict) return '新增成功';
    throw new Error('新增失败');
  }

  async findAll(page: number, pageSize: number, name: string) {
    const dict = await this.dictEntity.find({
      where: [
        { name: ILike(`%${name}%`) },
        { description: ILike(`%${name}%`) }
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        id: 'ASC'
      }
    });
    const total = await this.dictEntity.count({
      where: [
        { name: ILike(`%${name}%`) },
        { description: ILike(`%${name}%`) }
      ]
    });

    return { data: dict, total };
  }

  async update(updateDictDto: UpdateDictDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...updateDictDto,
      updateTime: new Date(),
      updater: user.account
    }
    const result = await this.dictEntity.update(updateDictDto.id, data);
    if (result.affected > 0) return '修改成功';
    throw new Error('修改失败');
  }

  async remove(id: number) {
    const result = await this.dictEntity.delete(id);
    if (result.affected > 0) return '删除成功';
    throw new Error('删除失败');
  }

  async exportExcel(name: string = '') {
    const data = await this.dictEntity.find({
      where: [
        { name: ILike(`%${name}%`) },
        { description: ILike(`%${name}%`) }
      ],
      order: {
        id: 'ASC'
      }
    });
    const header = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '字典名称', key: 'name', width: 50 },
      { header: '字典描述', key: 'description', width: 50},
      { header: '字典创建时间', key: 'createTime', width: 50 },
      { header: '字典更新时间', key: 'updateTime', width: 50 },
      { header: '创建人', key: 'creator', width: 50 },
      { header: '更新人', key: 'updater', width: 50 }
    ]
    const buffer = await generateExcel(data, header)
    return buffer
  }
}
