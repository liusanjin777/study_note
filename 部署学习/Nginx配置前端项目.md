# Nginx配置前端项目

## 1.将文件上传到服务器

可以使用Xftp将文件上传到服务器，这里以vue项目为例

- 根目录创建文件夹-project（在哪里创建都可以，能定位到就行）
- 上传dist文件夹到project文件夹里

## 2.修改nginx配置

找到nginx.conf

```shell
vi nginx.conf
```

![](https://pic.imgdb.cn/item/6523b2d1c458853aef4bcd53.png)

## 3.重启nginx服务

```shell
cd /usr/local/nginx/sbin      首先进入 sbin 目录
./nginx              启动 Nginx
```

如果端口被占用，可以

```sh
lsof -i:端口号
```

然后杀掉对应的进程

```shell
kill ID
```

最后再重启服务