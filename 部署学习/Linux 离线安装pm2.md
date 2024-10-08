# Linux 离线安装pm2

## 准备pm2包

1. 第一种方式：下载pm2.git项目，并进入到项目中`npm install`,将依赖都下载下载，压缩为`pm2.zip`

2. 第二种方式：找个npm工程，`npm install pm2 --global-style`, `--global-style`将pm2所需要的依赖都打包在一个文件夹内，进入到该工程的`node_modules`文件，找到`pm2`，压缩为`pm2.zip`

## 上传pm2包

1. 将压缩后的pm2包上传到服务器中，上传后以`/usr/app/pm2.zip`为例，进入到app文件夹`cd /usr/app` 执行

2. `unzip pm2.zip`命令解压包
3. `./bin/pm2 list`看看包是否正常

## 建立node软链接

1. 查找node位置`which node`，这里以`/opt/node`为例
2. 建立软连接

```js
ln -s /usr/app/pm2/bin/pm2 /opt/node/bin/pm2
ln -s /usr/app/pm2/bin/pm2-dev /opt/node/bin/pm2-dev
ln -s /usr/app/pm2/bin/pm2-docker /opt/node/bin/pm2-docker
ln -s /usr/app/pm2/bin/pm2-runtime /opt/node/bin/pm2-runtime
```

## 建立全局软连接

`ln -s /opt/node/bin/pm2 /usr/local/bin/pm2`

## 验证

`pm2 list`