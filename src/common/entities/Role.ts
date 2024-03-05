import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role", { schema: "us" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "角色ID" })
  id: number;

  @Column("varchar", { name: "name", comment: "角色名称", length: 50 })
  name: string;

  @Column("varchar", { name: "sort", comment: "角色排序", length: 10 })
  sort: string;

  @Column("int", { name: "status", comment: "角色状态：1-启用、0-禁用" })
  status: number;

  @Column("varchar", { name: "menu", comment: "菜单权限", length: 500 })
  menu: string;

  @Column("varchar", {
    name: "remark",
    nullable: true,
    comment: "角色描述",
    length: 255,
  })
  remark: string | null;

  @Column("datetime", {
    name: "createTime",
    nullable: true,
    comment: "创建时间",
  })
  createTime: Date | null;

  @Column("datetime", {
    name: "updateTime",
    nullable: true,
    comment: "更新时间",
  })
  updateTime: Date | null;

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
