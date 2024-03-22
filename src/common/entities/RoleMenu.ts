import { Entity, PrimaryColumn } from "typeorm";

@Entity("role_menu", { schema: "us" })
export class RoleMenu {
  @PrimaryColumn("int", { name: "menu_id", comment: "菜单id" })
  menuId: number;

  @PrimaryColumn("int", { name: "role_id", comment: "角色id" })
  roleId: number;
}
