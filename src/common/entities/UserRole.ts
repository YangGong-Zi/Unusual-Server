import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_role", { schema: "us" })
export class UserRole {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "角色ID" })
  id: number;

  @Column("varchar", { name: "role_name", comment: "角色名称", length: 255 })
  roleName: string;

  @Column("varchar", { name: "role_sort", comment: "角色排序", length: 255 })
  roleSort: string;

  @Column("int", { name: "role_status", comment: "角色状态：1-启用、0-禁用" })
  roleStatus: number;

  @Column("varchar", { name: "role_menu", comment: "菜单权限", length: 500 })
  roleMenu: string;

  @Column("varchar", {
    name: "role_remark",
    nullable: true,
    comment: "角色描述",
    length: 255,
  })
  roleRemark: string | null;
}
