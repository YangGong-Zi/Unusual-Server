import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { DictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict as DictEntity } from '@/common/entities/Dict';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Request } from 'express';
import { generateExcel } from '@/utils/excel';
import { DictDetailsService } from '../dict-details/dict-details.service';
import { QueryDto } from './dto/query.dto';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class DictService {

  constructor(
    @Inject(forwardRef(() => DictDetailsService))
    private readonly dictDetailsService: DictDetailsService,
    private readonly redisService: RedisService
  ) {}

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
    if (savedDict) {
      // 更新Redis中的dict-update键
      await this.updateDictRedis(savedDict.name);
      return '新增成功';
    }
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
    if (result.affected > 0) {
      // 更新Redis中的dict-update键
      await this.updateDictRedis(updateDictDto.name);
      return '修改成功';
    }
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    // 先获取字典名称
    const dict = await this.dictEntity.findOne({ where: { id } });
    if (!dict) {
      throw new HttpException({message: '字典不存在'}, HttpStatus.NOT_FOUND);
    }
    
    const result = await this.dictEntity.delete(id);
    if (result.affected > 0) {
      // 更新Redis中的dict-update键
      await this.updateDictRedis(dict.name);
      return '删除成功';
    }
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

  /**
   * 更新Redis中的dict-update键
   * @param dictName 字典名称
   */
  private async updateDictRedis(dictName: string): Promise<void> {
    try {
      // 获取当前的dict-update值
      const currentValue = await this.redisService.getValue('dict-update');
      let newValue: string;
      
      if (currentValue) {
        // 如果已有值，检查是否已包含当前字典名称
        const dictNames = currentValue.split(',');
        if (!dictNames.includes(dictName)) {
          // 如果不包含，添加到现有值中
          newValue = `${currentValue},${dictName}`;
        } else {
          // 如果已包含，不需要更新
          return;
        }
      } else {
        // 如果没有值，直接设置为当前字典名称
        newValue = dictName;
      }
      
      // 保存到Redis
      await this.redisService.setValue('dict-update', newValue);
    } catch (error) {
      // Redis操作失败，记录错误但不影响正常业务
      console.error('更新Redis dict-update失败:', error);
    }
  }
}
