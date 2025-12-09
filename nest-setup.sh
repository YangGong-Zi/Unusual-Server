#!/usr/bin/env bash

# 复制配置文件
cp /home/Unusual-server/config/prod.yml /home/Unusual-server/app/config;
cp /home/Unusual-server/config/.env /home/Unusual-server/app;
# 进入应用目录
cd /home/Unusual-server/app;

# 关闭容器
docker-compose stop;
# 删除容器
docker-compose down;
# 构建镜像
docker-compose build;
# 启动并后台运行
docker-compose up -d;
# 查看日志
# docker logs nest-app;
# 对空间进行自动清理
docker system prune -a -f
