import { booleanTransformer } from "@/utils/typeorm-help";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("menu", { schema: "us" })
export class Menu {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "菜单id" })
  id: number;

  @Column("int", { name: "pid", comment: "pid" })
  pid: number;

  @Column("varchar", { name: "path", comment: "路由path", length: 60 })
  path: string;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "组件名称",
    length: 60,
  })
  name: string | null;

  @Column("tinyint", {
    name: "visibily",
    comment: "是否可见(0：不可见，1：可见)",
    width: 1,
    transformer: booleanTransformer
  })
  visibily: boolean;

  @Column("tinyint", {
    name: "externalLink",
    comment: "外部链接(0：是，1：不是)",
    width: 1,
    transformer: booleanTransformer
  })
  externalLink: boolean;

  @Column("int", { name: "menuType", comment: "菜单类型(0:)" })
  menuType: number;

  @Column("int", { name: "sort", comment: "sort排序" })
  sort: number;

  @Column("tinyint", {
    name: "keepAlive",
    nullable: true,
    comment: "KeepAlive缓存(0：不缓存，1：缓存)",
    width: 1,
    transformer: booleanTransformer
  })
  keepAlive: boolean | null;

  @Column("varchar", {
    name: "icon",
    nullable: true,
    comment: "图标名称",
    length: 100,
  })
  icon: string | null;

  @Column("varchar", {
    name: "title",
    nullable: true,
    comment: "名称",
    length: 100,
  })
  title: string | null;

  @Column("varchar", {
    name: "link",
    nullable: true,
    comment: "link",
    length: 255,
  })
  link: string | null;

  @Column("varchar", {
    name: "component",
    nullable: true,
    comment: "组件路径",
    length: 100,
  })
  component: string | null;

  @Column("varchar", {
    name: "competence",
    nullable: true,
    comment: "权限标识",
    length: 50,
  })
  competence: string | null;

  @Column("datetime", {
    name: "updateTime",
    nullable: true,
    comment: "更新时间",
  })
  updateTime: Date | null;

  @Column("varchar", {
    name: "updater",
    nullable: true,
    comment: "更新人",
    length: 50,
  })
  updater: string | null;

  @Column("datetime", {
    name: "createTime",
    nullable: true,
    comment: "创建时间",
  })
  createTime: Date | null;

  @Column("varchar", {
    name: "creator",
    nullable: true,
    comment: "创建人",
    length: 50,
  })
  creator: string | null;

  @Column("tinyint", {
    name: "isLeaf",
    nullable: true,
    comment: "是否存在子节点（0：不存在，1：存在）",
    width: 1,
    transformer: booleanTransformer
  })
  isLeaf: boolean | null;
}
