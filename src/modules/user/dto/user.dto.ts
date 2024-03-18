export class UserDto {
  id: number;
  account: string;
  password: string;
  name: string;
  status: number;
  email: string;
  age: string | null;
  sex: number | null;
  phone: string;
  createTime: Date;
  updateTime: Date;
  updater: string | null;
  creator: string | null;
  roles: number[] | null
}
