import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role_menu", { schema: "us" })
export class RoleMenu {
  @PrimaryGeneratedColumn({ type: "int", name: "menu_id", comment: "菜单id" })
  menuId: number | null;

  @Column("int", { name: "role_id", nullable: true, comment: "角色id" })
  roleId: number | null;
}
