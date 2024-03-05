import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dict", { schema: "us" })
export class Dict {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "字典id" })
  id: number;

  @Column("varchar", { name: "name", comment: "字典名称", length: 50 })
  name: string;

  @Column("varchar", {
    name: "description",
    nullable: true,
    comment: "字典描述",
    length: 100,
  })
  description: string | null;

  @Column("datetime", { name: "createTime", comment: "字典创建时间" })
  createTime: Date;

  @Column("datetime", {
    name: "updateTime",
    nullable: true,
    comment: "字典更新时间",
  })
  updateTime: Date | null;

  @Column("varchar", {
    name: "creator",
    nullable: true,
    comment: "创建人",
    length: 50,
  })
  creator: string | null;

  @Column("varchar", {
    name: "updater",
    nullable: true,
    comment: "更新人",
    length: 50,
  })
  updater: string | null;
}
