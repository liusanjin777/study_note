---
title: Node.js----Buffer [ 更新中... ]
date: 2021-12-24 15:06
tags: node
---

## Buffer

### 数据的二进制

- 计算机所有的内容都会通过二进制来表示
- js可以直接处理比较直观的数据（比如字符串）
- js处理图片一直是给浏览器处理，js只负责交给浏览器一个地址
- 视频：16帧/s人眼就不会感到明显的卡顿
  
### Buffer和二进制

- 可以把Buffer看作一个存储二进制的数组
- 数组的每一项，是一个保存8位二进制（1byte=8bit,1kb=1024byte）,bit的中文含义是位
- int类型4个字节，long类型8个字节

### Buffer和字符串

- 把一个字符串放入Buffer里面

```js
const message = 'Hello Buffer';
//创建方式1-------过期
const buffer = new Buffer(message); //内部将message自动编码成二进制放入Buffer数组中
//创建方式2
const buffer = Buffer.from(message);

const message1 = '你好Buffer'; //中文对应的是unicode，在UTf-8中会占用3个字节
const buffer = Buffer.from(message， 'utf16le');

//解码 (怎么样编码，就采取什么样的解码)
console.log(buffer.toString());
```

### Buffer的alloc创建方式

```js
const buffer = Buffer.alloc(8); //可以存放8位字节
buffer[0] = 88;
```

### Buffer 和文件操作

```js
const fs = require('fs');
// 读取文本文件
fs.readFile("./foo.txt", (err, data) => {
  console.log(data); //打印的是Buffer数组
  console.log(data.toString());
});
const sharp = require('sharp');
// 读取图片文件
fs.readFile("./bar.png", (err, data) => {
  console.log(data);

  fs.writeFile("./foo.png", data, err => {
    console.log(err);
  });
});
// sharp库的使用
sharp('./bar.png')
  .resize(200, 200)
  .toFile('./baz.png');

sharp('./foo.png')
  .resize(300, 300) //改变大小
  .toBuffer() //转换为Buffer
  .then(data => {
    fs.writeFile('./bax.png', data, err => console.log(err)); //打印null
  })

```

### Buffer的创建过程

- Buffer并不会频繁的向操作系统申请内存，他会默认先申请一个8*1024个字节（8kb）的大小