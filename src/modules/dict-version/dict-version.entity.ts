import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("dict_version", { schema: "us" })
export class DictVersion {
  @PrimaryColumn("int", { name: "id", comment: "主键ID，固定为1，确保单条记录" })
  id: number;

  @Column("varchar", { 
    name: "version", 
    comment: "版本号，格式：XX.XX.XX", 
    length: 10, 
    default: "00.00.00" 
  })
  version: string;

  @Column("datetime", { 
    name: "updateTime", 
    comment: "更新时间" 
  })
  updateTime: Date;

  @Column("varchar", { 
    name: "updater", 
    nullable: true, 
    comment: "更新人", 
    length: 50 
  })
  updater: string | null;
}
