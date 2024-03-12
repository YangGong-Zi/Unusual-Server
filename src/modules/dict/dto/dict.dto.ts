import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DictDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string | null;

  @IsDate()
  @IsNotEmpty()
  createTime: Date;

  @IsDate()
  updateTime: Date | null;

  @IsString()
  creator: string | null;

  @IsString()
  updater: string | null;
}
