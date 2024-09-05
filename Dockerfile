# 构建阶段
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

# 设置 npm 镜像源
COPY package.json .
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# 复制所有源代码并构建应用
COPY . .
RUN npm run build

# 生产阶段
FROM node:18.0-alpine3.14 as production-stage

WORKDIR /app

# 从构建阶段复制构建结果和 package.json
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/config /app/config

# 暴露端口并启动应用
EXPOSE 3000
CMD ["node", "dist/main.js"]