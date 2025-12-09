import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { DictDetailDto } from './dto/dict-detail.dto';
import { UpdateDictDetailDto } from './dto/update-dict-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DictDetails } from '@/common/entities/DictDetails';
import { Dict } from '@/common/entities/Dict';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RedisService } from '@/common/redis/redis.service';
import { DictService } from '../dict/dict.service';

@Injectable()
export class DictDetailsService {

  constructor(
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => DictService))
    private readonly dictService: DictService
  ) {}

  @InjectRepository(DictDetails)
  private readonly dictDetails: Repository<DictDetails>
  
  @InjectRepository(Dict)
  private readonly dictEntity: Repository<Dict>

  async create(dictDetailDto: DictDetailDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...dictDetailDto,
      createTime: new Date(),
      creator: user.account
    }
    const savedDict = await this.dictDetails.save(data);
    if (savedDict) {
      // 获取字典名称
      const dict = await this.dictEntity.findOne({ where: { id: savedDict.pid } });
      if (dict) {
        // 更新Redis中的dict-update键
        await this.updateDictRedis(dict.name);
      }
      return '新增成功';
    }
    throw new HttpException({message: '新增失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findAll(page: number, pageSize: number, pid: number) {
    const [dictDetail, total] = await this.dictDetails.findAndCount({
      where: { pid: pid },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        id: 'ASC'
      }
    });
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
    if (result.affected > 0) {
      // 获取字典名称
      const dict = await this.dictEntity.findOne({ where: { id: updateDictDetailDto.pid } });
      if (dict) {
        // 更新Redis中的dict-update键
        await this.updateDictRedis(dict.name);
      }
      return '修改成功';
    }
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    // 先获取字典详情，以便获取pid
    const dictDetail = await this.dictDetails.findOne({ where: { id } });
    if (!dictDetail) {
      throw new HttpException({message: '字典详情不存在'}, HttpStatus.NOT_FOUND);
    }
    
    const result = await this.dictDetails.delete(id);
    if (result.affected > 0) {
      // 获取字典名称
      const dict = await this.dictEntity.findOne({ where: { id: dictDetail.pid } });
      if (dict) {
        // 更新Redis中的dict-update键
        await this.updateDictRedis(dict.name);
      }
      return '删除成功';
    }
    throw new HttpException({message: '删除失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findByPid(pid: number) {
    const dictDetail = await this.dictDetails.find({
      where: { pid: pid },
      order: {
        dictSort: 'ASC'
      }
    });
    return dictDetail;
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
