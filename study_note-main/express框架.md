---
title: express框架
date: 2022-01-13 20:09:25
tags:
---

## 认识express

- 安装express---`npm install -g express-generator`
- 创建项目---`express workName`
- 安装依赖---`npm install`
- 启动项目---`node bin/www`

### 中间件（核心）

- 就是一个回调函数
- express本质上事一系列中间件的调用
- 中间件的本质事转递express的一个回调函数  
  这个回调函数接受三个参数：请求对象（request）、响应对象(response)、next函数(在express中定义的用于执行下一个中间件的函数)

#### 中间件执行的任务

- 执行任何代码
- 更改请求(request)和响应(response)对象
- 结束请求-响应周期（返回数据）
- 调用栈中的下一个中间件
- 如果当前中间件功能没有接受请求-响应周期，则必须调用next()将控制权传递给下一个中间件，否则请求将会被挂起

#### 应用中间件

- app/router.use and app/router.methods
- app.methods ===> app.get and app.post...

##### 最普通的中间件

```js
const express = require('express')
const app = express()
//使用use的方式注册中间件
app.use((req,res,next) => {
  next()
  res.end('common middleware')
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

##### 路径匹配中间件

```js
const express = require('express')
const app = express()
//使用use的方式注册中间件
app.use('/home', (req,res,next) => {
  res.end('enter home')
  next()
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

##### 路径和方法中间件

```js
const express = require('express')
const app = express()
//使用use的方式注册中间件
app.get('/home', (req,res,next) => {
  res.end('path and method for home')
  next()
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

##### 注册连续中间件

```js
const express = require('express')
const app = express()
//使用use的方式注册中间件
app.use((req,res,next) => {
  res.end('01')
  next()
})
app.get('/home', (req,res,next) => {
  res.end('02-1')
  next()
}, (req,res,next) => {
  res.end('02-2')
  next() 
}, (req,res,next) => {
  res.end('02-3')
  next()
}, (req,res,next) => {
  res.end('02-4')
  next()
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

##### 中间件的应用

- 一. 自己编写中间件

```js
const express = require('express')
const app = express()
app.use((req, res. next) => {
  if (req.headers['content-type'] === 'application/json') {
    req.on('data', (data) => {
      const info = JSON.parse(data.toString())
    })
    req.body = {};
    req.body = Object.assgin({}, info);
  }
})
app.post('/login', (req,res,next) => {
  // req.on('data', (data) => {
  //   console.log(data.toString())
  // })
  console.log(req.body)
  res.end('welcome back ~')
  next()
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

- 二. 使用express内置中间件---`body-parser`

```js
const express = require('express')
const app = express()
app.use(express.json());
//extended为true时使用第三方库：qs
//extended为false时使用Node内置模块：querystring
app.use(express.urlencoded({extended: true}));
app.post('/login', (req,res,next) => {
  console.log(req.body)
  res.end('welcome back ~')
  next()
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

- 三. from-data解析

```js
// 安装官方的第三方库---multer
const multer = require('multer')
const express = require('express')
const app = express()
const upload = multer()
app.use(upload.any());
app.post('/login', (req,res,next) => {
  console.log(req.body)
  res.end('welcome back ~')
  next()
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

- 四. from-data文件上传

```js
const multer = require('multer')
const express = require('express')
const app = express()
const upload = multer({
  dest: './uploads/'
})
// 自定义路径和文件名
// const upload = multer({
//   storage
// })
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, './uploads/')
//   },
//   filename:(req, file, callback) => {
//     callback(null, 'foo.png')
//   },
// })
// app.use(upload.any());  注意：不要将multer作为全局中间件使用
app.post('/login',upload.any(), (req,res,next) => {
  res.end('welcome back ~')
  next()
})
app.post('/upload', upload.single('key'),(req,res,next) => {
  console.log(req.files)
  res.end('upload success!')
})
app.listen('8080',(err)=>{
  console.log('服务器启动成功');
})
```

- requset参数解析

```javascript
const express = require('express');
const app = express();
app.get('users/:id',(req, res, next) => {
  console.log(req.params);
  res.end('hello')
});
app.get('login',(req, res, next) => {
  console.log(req.query);
});
app.listen(8000, ()=>{
  console.log("服务器启动了");
})
```

- response响应结果

```javascript
const express = require('express');
const app = express();
app.get('login',(req, res, next) => {
  res.status(200) //设置响应码
  // 返回数据第一种方法
  // res.type('application/json')
  // res.end(JSON.stringify({name:"zhangsan",age:18}))
  //第二种方法(用的最多)
  res.json({name:"zhangsan",age:18})
});
app.listen(8000, ()=>{
  console.log("服务器启动了");
})
```

### express路由

**例子**:

- 请求所有用户信息：get/users
- 请求某个用户信息：get/users/:id
- 修改某个用户信息：post/users body {username:xx,password:xxx}
- 删除用户信息：delete/users/:id

创建一个users.js

```js
const express = require('express');
const router = express('router');
router.get('/',(req, res, next) => {
  res.json(["zhangsan","lisi","kobe","curry"])
});
router.get('/:id',(req, res, next) => {
  res.json(`${req.params.id}用户的信息`)
});
app.listen(8000, ()=>{
  console.log("服务器启动了");
})
module.exports = router;
```

使用user.js

```javascript
const express = require('express');
const useRouter = require('./router/users');
const app = express();
app.user("/users",useRouter)
app.listen(8000, ()=>{
  console.log("服务器启动了");
})
```

### 传回静态资源

```javascript
const express = require('express');
const app = express();
app.use(express.static('./dist'))
app.listen(8000, ()=>{
  console.log("服务器启动了");
})
```

### express的错误处理

```javascript
const express = require('express');
const app = express();
app.post('/login',(req, res, next)=>{
  if(req.query.username === "xxx" && req.query.passwrod === "xxx") {
    res.status(200);
    res.json("登录成功！")
  } else {
    next(new Error(USERNAME_DOES_EXISTS));
  }
})
app.post('/register',(req, res, next)=>{
  if(req.query.username !== "xxx") {
    res.status(200);
    res.json("注册成功！")；
  } else {
    next(new Error(USERNAME_ALREADY_EXISTS));
  }
})

app.use((err, req, res, next)=>{
  let status = 400;
  let message = "";
  switch (err.message) {
    case USERNAME_DOES_EXISTS:
      message = "登录失败！"
      break;
    case USERNAME_ALREADY_EXISTS:
      message = "注册失败！"
      break;
    default
      message = "Not Found!"
  }
  res.status(status);
  res.json(message)
})
app.listen(8000, ()=>{
  console.log("服务器启动了");
})
```

### exxpress源码理解

#### 调用express()到底创建的是什么

- `exports = module.exports = createApplication;`

```javascript
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };
```

#### app.listen()启动服务器

```js
  app.listen = function listen() {
    var server = http.createServer(this); //this就是app
    return server.listen.apply(server, arguments);
  };
```

#### app.use(中间件)内部到底发生了什么

1

#### 用户发送了一个网络请求，中间件是如何被回调的

#### next为什么执行下一个中间件