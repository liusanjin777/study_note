---
title: koa框架
date: 2022-02-10 14:31:56
tags:
---

## 认识koa

koa旨在为Web应用程序和API提供更小、更丰富和更强大的能力；

### koa初体验

```javascript
const Koa = require('koa');
const app = new Koa();
app.use((context, next)=>{
  // context.request-----context.response
  context.response.body = "hello kor~";
  console.log('中间件被执行~');
  next();
})
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## koa中间件

- koa不提供app.get or app.post 等的方式注册中间件
- koa不提供连续注册中间件方式注册中间件
- koa只能使用app.use的方式注册中间件

```javascript
const Koa = require('koa');
const app = new Koa();
app.use((context, next)=>{
  if (context.request.url === '/login') {
    if(context.request.method === 'GET') {
      context.response.body = "welcome back~";
    }
  }else {
    context.response.body = "faile~";
  }
  next();
})
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## koa路由

- 创建一个users.js

```javascript
// npm install koa-router
const Router = require('koa-router');
const router = new Router({prefix: '/users'})
router.get('/', (context, next)=>{
  context.response.body = "get request~";
})
router.put('/', (context, next)=>{
  context.response.body = "put request~";
})
module.exports = router;
```

- 在服务器.js中

```javascript
const Koa = require('koa');
const userRouter = require('./router/user');
const app = new Koa();
app.use(userRouter.routes())
app.use(userRouter.allowedMethods()) //会表示router里面出现的请求方法才会被实现，其他的方法会返回错误信息
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## 参数解析 params-query

```javascript
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  console.log(ctx.requset.url);
  console.log(ctx.requset.query);
  ctx.response.body = "hello"
});
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

- 解析params

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router({prefix: '/users'})
router.get('/:id', (ctx, next)=>{
  console.log(ctx.requset.query);
  console.log(ctx.requset.params);
})
const app = new Koa();
app.use(userRouter.routes())
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## 参数解析json-urlencoded

```javascript
const Koa = require('koa');
// npm install koa-bodyparser
const bodyParser = require('koa-bodyparser');
const multer = require('koa-multer');
const upload = multer();
const app = new Koa();
app.use(bodyParser())
app.use(upload.any())
app.use((ctx, next) => {
  console.log(ctx.requset.body);
  ctx.response.body = "hello"
});
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## 数据的响应

### body将响应主体设置为以下之一

- string
- Buffer
- Stream: 流数据
- Object|Array
- null
- 如果response.status尚未设置，Koa会自动将状态设置为200或204

```javascript
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  //设置状态码
  ctx.response.status = 200;
  ctx.status = 200;
  //响应数据
  // ctx.response.body = "hello";
  // ctx.response.body = {name:"zhangsan", age:18};
  // ctx.response.body =[1, 2, 3];
  ctx.body =[1, 2, 3];
});
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## 传回静态资源

```javascript
const Koa = require('koa');
const staticAssets = require('koa-static')
const app = new Koa();
app.use(staticAssets('./build'));
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## koa错误处理方式

```javascript
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  if(false) {
    ctx.app.emit('error', new Error("No Login！")) //发送事件，不会阻塞
  }
});
app.on('error', (err, ctx)=>{
  ctx.status = 401;
  ctx.body = err.message;
})
app.listen(8000, ()=>{
  console.log('服务器启动成功');
})
```

## koa洋葱模型

### 两层理解含义

- 中间件处理代码的过程；
- Response返回body执行；

[![HUeQl8.jpg](https://s4.ax1x.com/2022/02/11/HUeQl8.jpg)](https://imgtu.com/i/HUeQl8)

```javascript
const Koa = require('koa')
const app = new Koa()
app.use((ctx, next)=>{
  console.log(1);
  next()
  console.log(2);
})

app.use((ctx, next)=>{
  console.log(3);
  next()
  console.log(4);
})

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)

/*
* 打印结果为： 1 3 4 2
* 当打印结束后才会返回 Hello World
*/
```
