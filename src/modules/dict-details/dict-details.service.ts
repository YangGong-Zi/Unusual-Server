import { Injectable } from '@nestjs/common';
import { DictDetailDto } from './dto/dict-detail.dto';
import { UpdateDictDetailDto } from './dto/update-dict-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DictDetails } from '@/common/entities/DictDetails';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class DictDetailsService {

  @InjectRepository(DictDetails)
  private readonly dictDetails: Repository<DictDetails>

  async create(dictDetailDto: DictDetailDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...dictDetailDto,
      createTime: new Date(),
      creator: user.account
    }
    const savedDict = await this.dictDetails.save(data);
    if (savedDict) return '新增成功';
    throw new Error('新增失败');
  }

  async findAll(page: number, pageSize: number, pid: number) {
    const dictDetail = await this.dictDetails.find({
      where: { pid: pid },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        id: 'ASC'
      }
    });
    const total = await this.dictDetails.count({ where: { pid: pid } });
    return { data: dictDetail, total };
  }

  async update(updateDictDetailDto: UpdateDictDetailDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...updateDictDetailDto,
      updateTime: new Date(),
      updater: user.account
    }
    const result = await this.dictDetails.update(updateDictDetailDto.id, data);
    if (result.affected > 0) return '修改成功';
    throw new Error('修改失败');
  }

  async remove(id: number) {
    const result = await this.dictDetails.delete(id);
    if (result.affected > 0) return '删除成功';
    throw new Error('删除失败');
  }
}
