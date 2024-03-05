import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict as DictEntity } from '@/common/entities/Dict';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class DictService {

  @InjectRepository(DictEntity)
  private readonly dictEntity: Repository<DictEntity>

  create(createDictDto: CreateDictDto) {
    return 'This action adds a new dict';
  }

  async findAll(page: number, pageSize: number, name: string) {
    const dict = await this.dictEntity.find({
      where: [
        {name: ILike(`%${name}%`)},
        {description: ILike(`%${name}%`)}
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        id: 'ASC'
      }
    });
    return dict;
  }

  update(id: number, updateDictDto: UpdateDictDto) {
    return `This action updates a #${id} dict`;
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}
