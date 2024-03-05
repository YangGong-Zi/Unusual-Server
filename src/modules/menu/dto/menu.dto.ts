import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MenuDto {

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
  visibily: boolean

  @IsNotEmpty()
  @IsNumber()
  sort: number

  @IsNotEmpty()
  @IsNumber()
  externalLink: boolean

  @IsNotEmpty()
  @IsNumber()
  menuType: number

  @IsNumber()
  keepAlive: boolean

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

  children: MenuDto[]

  isLeaf: boolean
}
