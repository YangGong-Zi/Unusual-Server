import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {

  id: number

  @IsNotEmpty()
  @IsNumber()
  pid: number

  @IsNotEmpty()
  @IsString()
  path: string

  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  visibily: number

  @IsNotEmpty()
  @IsNumber()
  sort: number

  @IsNotEmpty()
  @IsNumber()
  externalLink: number

  @IsNotEmpty()
  @IsNumber()
  menuType: number

  @IsNumber()
  keepAlive: number

  @IsString()
  icon: string

  @IsString()
  title: string

  @IsString()
  link: string

  @IsString()
  component: string

  @IsDate()
  createTime: Date

  @IsDate()
  updateTime: Date

  @IsString()
  creator: string

  @IsString()
  updater: string

  children: CreateMenuDto[]

  isLeaf: boolean
}
