import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DictDetailDto } from './dto/dict-detail.dto';
import { UpdateDictDetailDto } from './dto/update-dict-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DictDetails } from '@/common/entities/DictDetails';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { DictVersionService } from '../dict-version/dict-version.service';

@Injectable()
export class DictDetailsService {

  constructor(private readonly dictVersionService: DictVersionService) {}

  @InjectRepository(DictDetails)
  private readonly dictDetails: Repository<DictDetails>

  async create(dictDetailDto: DictDetailDto, req: Request) {
    const user = JSON.parse(req.headers.user as string)
    const data = {
      ...dictDetailDto,
      createTime: new Date(),
      creator: user.account
    }
    
    // Use transaction to ensure data consistency
    await this.dictDetails.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(DictDetails, data);
      
      // Update dict version
      await this.dictVersionService.updateVersion(user.account);
    });
    
    return '新增成功';
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
    
    // Use transaction to ensure data consistency
    await this.dictDetails.manager.transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.update(DictDetails, updateDictDetailDto.id, data);
      
      if (result.affected === 0) {
        throw new HttpException({ message: '修改失败' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      // Update dict version
      await this.dictVersionService.updateVersion(user.account);
    });
    
    return '修改成功';
  }

  async remove(id: number, req: Request) {
    const user = JSON.parse(req.headers.user as string);
    
    // Use transaction to ensure data consistency
    await this.dictDetails.manager.transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.delete(DictDetails, id);
      
      if (result.affected === 0) {
        throw new HttpException({message: '删除失败'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      // Update dict version
      await this.dictVersionService.updateVersion(user.account);
    });
    
    return '删除成功';
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
