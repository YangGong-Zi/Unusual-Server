## 简介

使用 `Nest.js` 开发的一套后台管理系统，支持角色、用户、按钮权限配置。

[前端项目地址](https://github.com/wzwdream/Unusual-Admin)

## 配置项目

- 修改配置文件 `src/config/test.yml`，填写对应的信息，需要把 `test.yml` 改为 `dev.yml`。
- 项目根目录下有 `us.sql` 文件，为  `mysql` 数据库的数据文件，

## 安装依赖

```bash
pnpm install
```

## 启动项目

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## 结语

感谢你喜欢我的项目，如果有什么问题，欢迎提issue。