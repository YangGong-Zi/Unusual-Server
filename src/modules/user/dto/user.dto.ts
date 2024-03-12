export class UserDto {
  id: number;
  account: string | null;
  password: string;
  name: string;
  status: number;
  email: string;
  age: string;
  sex: number | null;
  phone: string;
  createTime: Date;
  updateTime: Date;
}
