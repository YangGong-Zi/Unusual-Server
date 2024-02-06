import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("menu", { schema: "us" })
export class Menu {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "菜单id" })
  id: string;

  @Column("bigint", { name: "pid", comment: "pid" })
  pid: string;

  @Column("varchar", { name: "path", comment: "路由path", length: 255 })
  path: string;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "组件名称",
    length: 255,
  })
  name: string | null;

  @Column("int", {
    name: "visibility",
    comment: "是否可见(0：不可见，1：可见)",
  })
  visibility: number;

  @Column("int", { name: "externalLink", comment: "外部链接" })
  externalLink: number;

  @Column("int", { name: "menuType", comment: "菜单类型" })
  menuType: number;

  @Column("int", { name: "sort", comment: "sort排序" })
  sort: number;

  @Column("int", {
    name: "keepAlive",
    nullable: true,
    comment: "KeepAlive缓存(0：不缓存，1：缓存)",
  })
  keepAlive: number | null;

  @Column("varchar", {
    name: "icon",
    nullable: true,
    comment: "图标名称",
    length: 255,
  })
  icon: string | null;

  @Column("varchar", {
    name: "title",
    nullable: true,
    comment: "名称",
    length: 255,
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
    length: 255,
  })
  component: string | null;
}
