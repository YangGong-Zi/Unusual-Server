import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("test", { schema: "us" })
export class Test {
  @Column("varchar", { name: "name", nullable: true, length: 20 })
  name: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "age", nullable: true })
  age: number | null;
}
