import { Column, Entity } from "typeorm";

@Entity("user_role", { schema: "us" })
export class UserRole {
  @Column("int", { name: "user_id", nullable: true, comment: "用户id" })
  userId: number | null;

  @Column("int", { name: "role_id", nullable: true, comment: "角色id" })
  roleId: number | null;
}
