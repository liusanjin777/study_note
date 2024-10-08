# Linux安装Nginx

## **1.安装依赖包**

```text
#一键安装上面四个依赖
[root@localhost ~]# yum -y install gcc pcre-devel zlib-devel openssl openssl-devel
```

## **2.下载并解压安装包**

```text
#切换目录
[root@localhost ~]# cd /
#创建一个文件夹
[root@localhost ~]# mkdir -p  www/server/nginx   
#切换目录
[root@localhost ~]# cd /www/server/nginx
#下载
[root@localhost nginx]# wget http://nginx.org/download/nginx-1.21.0.tar.gz
#解压
[root@localhost nginx]# tar -xvf nginx-1.21.0.tar.gz
```

## **3.安装nginx**

```text
#进入nginx目录
[root@localhost nginx]# cd /www/server/nginx
#进入目录
[root@localhost nginx]# cd nginx-1.21.0
#执行命令
[root@localhost nginx-1.21.0]# ./configure --prefix=/usr/local/nginx
#执行make命令
[root@localhost nginx-1.21.0]# make
#执行make install命令
[root@localhost nginx-1.21.0]# make install
```

## **4.配置nginx.conf**

```text
#备份Nginx配置文件
[root@localhost conf]# cp /usr/local/nginx/conf/nginx.conf /usr/local/nginx/conf/nginx.conf.bak
#打开配置文件
[root@localhost conf]# vi /usr/local/nginx/conf/nginx.conf
```

将端口号改成8089，因为可能apeache占用80端口，apeache端口尽量不要修改，我们选择修改nginx端口。

localhost修改为你服务器ip地址,也可以不修改。

![img](https://pic3.zhimg.com/80/v2-977c85358f6d7b3f7caa6cb6489a9422_720w.webp)

## **5.防火墙开启**

i. 开启端口8089

```text
[root@localhost conf]# firewall-cmd --zone=public --add-port=8089/tcp --permanent
```

ii. 重启防火墙

```text
[root@localhost conf]# firewall-cmd --reload
```

iii. 查看已经开放的端口

```text
[root@localhost conf]# firewall-cmd --list-ports
```

## **6.运行以下命令，进入Nginx的sbin目录，然后启动Nginx**

```text
[root@localhost nginx]# cd /usr/local/nginx/sbin/
[root@localhost sbin]# ./nginx
```

i. 安装完成一般常用命令

```text
cd /usr/local/nginx/sbin      首先进入 sbin 目录
./nginx              启动 Nginx
./nginx -s stop      停止 Nginx
./nginx -s reload    重新加载 Nginx
./nginx -v           查看 Nginx 版本
```

## **7.查看nginx是否成功启动了**

```text
[root@localhost sbin]# ps -ef | grep nginx
root       4338      1  0 16:48 ?        00:00:00 nginx: master process ./nginx
nobody     4339   4338  0 16:48 ?        00:00:00 nginx: worker process
root       4341   1549  0 16:48 pts/0    00:00:00 grep --color=auto nginx
```

## **8.配置文件修改后，需要指定配置文件进行重启**

```text
#定配置文件进行重启
[root@localhost sbin]# /usr/local/nginx/sbin/nginx -s reload -c /usr/local/nginx/conf/nginx.conf
#检测文件是否配置正确
[root@localhost sbin]# /usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

## **9.创建一个软链接启动nginx**

```text
#建立软链接
[root@localhost sbin]# ln -s /usr/local/nginx/sbin/nginx /usr/sbin/
#启动
[root@localhost sbin]# nginx
#查看nginx版本
[root@localhost ~]# nginx -v
nginx version: nginx/1.21.0
```

## **10.访问服务器ip+端口查看**

到这里基本上就已经安装好了

## **11.配置nginx开机自启动**

i. 创建一个nginx.service,按`i`键进入编辑模式，修改配置文件，按`Esc`键，然后输入`:wq`并按`Enter`键以保存

```text
#进入目录
[root@localhost system]# cd /usr/lib/systemd/system/
#创建文件
[root@localhost system]# touch nginx.service
#编辑文件内容
[root@localhost system]# vi /usr/lib/systemd/system/nginx.service
#赋予可执行的权限
[root@localhost system]# chmod +x /usr/lib/systemd/system/nginx.service
```

ii. 编辑文件内容

```text
[Unit]                                                                                      #对服务的说明
Description=nginx - high performance web server              #描述服务
After=network.target remote-fs.target nss-lookup.target   #描述服务类别

[Service]                                                                                 #服务的一些具体运行参数的设置
Type=forking                                                                         #后台运行的形式
PIDFile= /usr/local/nginx/logs/nginx.pid                               #PID文件的路径
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf   #启动准备
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf           #启动命令
ExecReload=/usr/local/nginx/sbin/nginx -s reload                                                 #重启命令
ExecStop=/usr/local/nginx/sbin/nginx -s stop                                                       #停止命令
ExecQuit=/usr/local/nginx/sbin/nginx -s quit                                                        #快速停止
PrivateTmp=true                                                                  #给服务分配临时空间

[Install]
WantedBy=multi-user.target                                               #服务用户的模式
```

iii. 查看文件内容

```text
[root@localhost ~]# cat /usr/lib/systemd/system/nginx.service
[Unit]
Description=nginx - high performance web server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile= /usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
ExecQuit=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

iiii. 启动服务

```text
#在启动服务之前，需要先重载systemctl命令
[root@localhost ~]# systemctl daemon-reload
#启动服务或者使用systemctl start nginx
[root@localhost ~]# systemctl start nginx.service
#运行以下命令设置Nginx服务开机自启动
[root@localhost ~]# systemctl enable nginx
#查看nginx
[root@localhost ~]# ps -ef | grep nginx
root      14869      1  0 17:37 ?        00:00:00 nginx: master process /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
nobody    14871  14869  0 17:37 ?        00:00:00 nginx: worker process
root      14893   1549  0 17:37 pts/0    00:00:00 grep --color=auto nginx
```

*配置systemctl之后的启动方式

```text
systemctl status nginx  #状态
systemctl start nginx  #启动
systemctl stop nginx   #停止
systemctl restart nginx  #重启
```

iiiii. 使用reboot命令重启后，查看nginx是否成功的自启动了

```text
[root@localhost ~]# reboot
Connection to 192.168.0.197 closed by remote host.
Connection to 192.168.0.197 closed.

C:\Users\beauty>ssh root@192.168.0.197
root@192.168.0.197's password:
Last login: Sat Jun  5 16:09:35 2021 from 192.168.0.194
[root@localhost ~]# ps -ef | grep nginx
root       1081      1  0 17:39 ?        00:00:00 nginx: master process /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
nobody     1084   1081  0 17:39 ?        00:00:00 nginx: worker process
root       1567   1548  0 17:40 pts/0    00:00:00 grep --color=auto nginx
```