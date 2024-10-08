# 环境搭建

## 安装nodejs

```bash
mkdir nodejs
tar xvf node-v12.13.0-linux-x64.tar.xz
mv node-v12.13.0-linux-x64/* /usr/local/nodejs
```

- 添加软链接到/usr/local/bin目录
  ```bash
  ln -s /usr/local/nodejs/bin/npm /usr/local/bin
  ln -s /usr/local/nodejs/bin/node /usr/local/bin
  ```

  

- 检测软链接是否生效
  ```bash
  node -v npm
  ```

  

## 安装mongodb

```bash
mkdir mongodb
tar xvf mongodb-linux-x86_64-3.0.6.tgz
mv mongodb-linux-x86_64-3.0.6/* /usr/local/mongodb
```

- 增加mongodb环境变量
  ```bash
  vi /etc/profile
  export PATH=$PATH:/usr/local/mongodb/bin
  ```

  

- 生效环境变量
  ```bash
  source /etc/profile
  ```

  

- 检查mongodb环境变量是否生效
  mongo --version

- 配置mongodb配置文件信息
  ```bash
  cd mongodb
  mkdir data
  vim mongodb.cnf
  ```

  

- 配置信息详情
  ```
  #指定数据存储目录 需要提前创建
  dbpath=/usr/local/mongodb/data/
  #指定日志文件
  logpath=/usr/local/mongodb/data/mongo.log
  #日志追加写
  logappend=true
  #创建后台子进程
  fork=true
  #指定端口号
  port=27017
  #配置信息详情
  ```

  

- 启动mongodbserver
  `mongod -f /usr/local/mongodb/mongdb.cnf`

- 连接本机的mongodb
  `cd /usr/local/mongodb/bin/`
  `mongo`

- 当前所有数据库
  `show dbs`

- 创建用户名/密码
  第一步：创建数据库
  `use yapi`
  第二步：创建用户并配置权限
  `db.createUser({user:“username”,pwd:“123456”,roles:[{“role”:“readWrite”,“db”:“yapi”}]})`

## 安装YApi

```ba
mkdir yapi
cd yapi
tar -xvf yapi.tar
cp vendors/config_example.json ./config.json
```

- 配置config.json
  ```json
  {
      “port”: “3000”,
      “adminAccount”: “admin@admin.com”,
      “db”: {
          “servername”: “127.0.0.1”,
          “DATABASE”: “yapi”,
          “port”: 27017,
          “user”: “username”,
          “pass”: “123456”,
          “authSource”: “”
      },
      “mail”: {
          “enable”: true,
          “host”: “smtp.exmail.qq.com”,
          “port”: 465,
          “from”: “xxx@xxx.cn”,
          “auth”: {
              “user”: “xxx@xxx.cn”,
              “pass”: “xxx”
              }
      }
  }
  #配置config.json
  ```

  

- 初始化数据库
  `cd vendors`
  `npm run install-server`

- 启动yapi server
  `node server/app.js`

浏览器访问 ip:3000 yapi接口管理平台

默认的管理员为admin@admin.com 密码ymfe.org

## 离线安装PM2

- 查看服务器的npm默认安装目录
  `npm config get prefix`

- 如果目录是 /usr/local/nodejs
  `cd /usr/local/nodejs/lib/node_modules/`

- 拷贝 pm2.tar.gz 到该目录后解压
  `tar xvf pm2.tar.gz`

- 添加软链接
  `ln -s /usr/local/nodejs/lib/node_modules/pm2/bin/pm2 /usr/local/bin`

- 用pm2启动和重启YApi
  #启动 --watch参数，意味着当你的express应用代码发生变化时，pm2会帮你重启服务
  `pm2 start /usr/local/yapi/vendors/server/app.js --watch`

- 重启
  `pm2 restart /usr/local/yapi/vendors/server/app.js`

PM2实用入门指南
https://imweb.io/topic/57c8cbb27f226f687b365636