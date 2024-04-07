import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict as DictEntity } from '@/common/entities/Dict';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Request } from 'express';
import { generateExcel } from '@/utils/excel';
import { DictDetailsService } from '../dict-details/dict-details.service';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class DictService {

  constructor(private readonly dictDetailsService: DictDetailsService) {}

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
    throw new HttpException({message: '新增失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findAll(page: number, pageSize: number, name: string) {
    const [dict, total] = await this.dictEntity.findAndCount({
      where: [
        { name: ILike(`%${name}%`) },
        { description: ILike(`%${name}%`) }
      ],
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        id: 'ASC'
      }
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
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    const result = await this.dictEntity.delete(id);
    if (result.affected > 0) return '删除成功';
    throw new HttpException({message: '删除失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async exportExcel(queryDto: QueryDto) {
    const name = queryDto.name || '';
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

  async findDetails(names: string[]) {
    const dictPromise = names.map(async name => {
      const dict = await this.dictEntity.findOne({ where: { name } });
      const data = await this.dictDetailsService.findByPid(dict.id)
      return {
        [name]: data
      }
    })
    const data = await Promise.all(dictPromise)
    return Object.assign({}, ...data.flat());
  }
}
