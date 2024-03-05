import { Column, Entity } from "typeorm";

@Entity("role_menu", { schema: "us" })
export class RoleMenu {
  @Column("int", { name: "role_id", nullable: true, comment: "角色id" })
  roleId: number | null;

  @Column("int", { name: "menu_id", nullable: true, comment: "菜单id" })
  menuId: number | null;
}
