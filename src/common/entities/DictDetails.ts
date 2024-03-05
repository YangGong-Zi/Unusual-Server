import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dict_details", { schema: "us" })
export class DictDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "字典值id" })
  id: number;

  @Column("int", { name: "pid", comment: "字典id" })
  pid: number;

  @Column("varchar", { name: "label", comment: "字典值", length: 50 })
  label: string;

  @Column("varchar", { name: "value", comment: "字典键", length: 10 })
  value: string;

  @Column("varchar", {
    name: "dictSort",
    nullable: true,
    comment: "字典值描述",
    length: 100,
  })
  dictSort: string | null;

  @Column("datetime", {
    name: "createTime",
    nullable: true,
    comment: "字典值创建时间",
  })
  createTime: Date | null;

  @Column("datetime", {
    name: "updateTime",
    nullable: true,
    comment: "字典值更新时间",
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
