import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_role", { schema: "us" })
export class UserRole {
  @PrimaryGeneratedColumn({ type: "int", name: "role_id", comment: "角色id" })
  roleId: number | null;

  @Column("int", { name: "user_id", nullable: true, comment: "用户id" })
  userId: number | null;
}
