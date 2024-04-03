// pm2启动文件
module.exports = {
  apps: [
    {
      name: "unusual-server",
      script: "dist/main.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "prod" // 设置环境变量为生产环境
      },
    }
  ]
};
