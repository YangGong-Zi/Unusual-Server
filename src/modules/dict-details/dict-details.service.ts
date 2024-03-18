import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    if (result.affected > 0) return '修改成功';
    throw new HttpException({message: '修改失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async remove(id: number) {
    const result = await this.dictDetails.delete(id);
    if (result.affected > 0) return '删除成功';
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
}
