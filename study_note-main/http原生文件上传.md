---
title: http原生文件上传
date: 2022-01-06 20:15:31
tags:
---

## http原生文件上传

### 错误示范

```js
const http = require('http')
cosnt fs = require('fs')
const server1 = http.createServer((request, response) => {
  if (request.url === '/upload') {
    if (request.method === 'post') {
      const fw = fs.createWriteStream('./foo.png', { flag:'a'})
      request.on('data', (data) => {
        fw.write(data)   //data中会包含其他的信息，如body里面的，故这种方法写入的图片解码会不成功，导致打不开
      })      
    }
  }
  response.end("1") 
});
server1.listen(8080, 'localhost',() => { /
  console.log("文件上传服务器启动成功");
});
```

### 正确示范

```js
const http = require('http')
cosnt fs = require('fs')
const qs = require('queryString')
const server1 = http.createServer((request, response) => {
  if (request.url === '/upload') {
    if (request.method === 'post') {
      //设置编码
      request.setEncoding('binary')
      let body = '';
      const message = request.headers['content-type'].split(';')[1]
      const boundry = message.split('=')[1] 
      request.on('data', (data) => {
        body += data;
      })      
    }
  }
  response.on('end', ()=>{
    //处理body
    //1.获取image/png
    const payload = qs.parse(body, '\r\n', ': ')
    const type = payload['Content-type']
    //2.进行截取
    const typeIndex = body.indexOf(type);
    const typeLength = type.length
    let imageData = body.substring(typeIndex + typeLength)
    //3.去除空格
    imageData = imageData.repalce(/^\s\s*/,'')
    //4.截掉boundry
    imageData = imageData.substing(0, imageData.indexOf(`--${boundry}--`))
    fs.writeFile('/.foo.png', imageData, 'binary', (err) => {
      res.end('文件上传成功！')
    })
  })
});
server1.listen(8080, 'localhost',() => { /
  console.log("文件上传服务器启动成功");
});
```
