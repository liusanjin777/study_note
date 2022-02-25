---
title: http
date: 2022-01-05 20:20:59
tags:
---

## headers属性

### headers头信息content-type

- application/json表示是一个json类型
- application/xml表示是一个xml类型
- text/plain表示是一个文本类型
- multipart/form-data表示是一个文件

### 其他属性

#### content-length

- 文件的大小和长度

#### keep-alive

- http是基于TCP协议的，但是通常在进行一次请求和响应结束后会立刻中断；
- 在http1.0中，如果想要继续保持连接：  
    浏览器需要在请求头中添加 connection: keep-alive；  
    服务器需要在响应头中添加 connection:keey-alive；  
    当客户端再次放请求时，就会使用同一个连接，直接一方中断连接；
- 在http1.1中，所有连接默认是 connection: keep-alive的；  
    不同的Web服务器会有不同的保持 keep-alive的时间；  
    Node中默认是5s中；

#### accept-encoding

- 告知服务器，客户端支持的文件压缩格式，比如js文件可以使用gzip编码，对应 .gz文件；

#### user-agent

- 客户端相关的信息
