import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user_role", { schema: "us" })
export class UserRole {
  @PrimaryColumn({ type: "int", name: "role_id", comment: "角色id" })
  roleId: number;

  @PrimaryColumn("int", { name: "user_id", comment: "用户id" })
  userId: number;
}
