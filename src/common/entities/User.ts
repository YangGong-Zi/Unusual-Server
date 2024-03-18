import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user", { schema: "us" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "用户主键ID" })
  id: number;

  @Column("varchar", { name: "account", comment: "账号", length: 255 })
  account: string;

  @Column("varchar", { name: "password", comment: "用户密码", length: 255 })
  password: string;

  @Column("varchar", { name: "name", comment: "用户名称", length: 50 })
  name: string;

  @Column("int", { name: "status", comment: "用户状态（0-禁用，1-启用）" })
  status: number;

  @Column("varchar", { name: "email", comment: "邮箱", length: 50 })
  email: string;

  @Column("char", { name: "age", nullable: true, comment: "年龄", length: 3 })
  age: string | null;

  @Column("int", { name: "sex", nullable: true, comment: "性别（0-女，1-男）" })
  sex: number | null;

  @Column("varchar", { name: "phone", comment: "手机号", length: 11 })
  phone: string;

  @Column("datetime", {
    name: "createTime",
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date;

  @Column("datetime", {
    name: "updateTime",
    comment: "更新时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateTime: Date;

  @Column("varchar", {
    name: "updater",
    nullable: true,
    comment: "更新人",
    length: 50,
  })
  updater: string | null;

  @Column("varchar", {
    name: "creator",
    nullable: true,
    comment: "创建人",
    length: 50,
  })
  creator: string | null;
}
