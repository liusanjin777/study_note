---
title: Node.js [ 更新中... ]
date: 2021-12-22 19:40:25
tags: node
---

## 快速切换工具

- nvm （不支持windows）(可以去github寻求解决方法)
- n 交互式管理node版本（不支持windows）

## NodeJs 的 REPL交互环境

REPL是一个简单的，交互式的编程环境，例如浏览器的console

## Node全局对象和模块化开发

### 给node传递参数（node的输出）

process是node的全局对象，包括了很多东西  
在命令行：`node demo.js name=zhangsan age=20`  
在js文件：`process.argv`便可以拿到

### node的输出

- console.log()
- console.clear() 清除控制台
- console.trace() 函数调用栈的跟踪
  
### 全局对象

#### 特殊的全局对象

- __dirname  
  打印当前文件所在的目录
- __filename  
  打印当前文件所在的目录包括文件名

#### 常见的全局对象

- process 包含进程相关的信息：node运行环境，参数信息等；
- console
- setTimeout  定时器
- setInterval  会持续打印  
- setImmdiate  立即打印
- global  

### 模块化

所有规范都要用两个核心得功能：模块本身可以暴露的属性，模块又可以导入自己需要得属性

#### AMD规范

- 异步加载
  
##### AMD使用

- 1.下载require.js文件

```js
<script src = "./lib/require.js" data-main = "index.js"></script>
```

在index.js中

```js
(function() {
 require.config{(
   path 
 )}
})() 
```

#### CMD规范

#### CommonJS规范

在node中每个js就是一个单独的模块

- exports 和 Module.exports 可以负责对模块的内容进行导出
  
  ```js
  //exports
  const name = "zhangsan"
  exports.name = name 
  //Module.exports
  Module.exports = {
    name
  }//Module.exports的内存地址变了
  ```

  module是node的一个类，一个js文件就是一个module实例，在node源码中，`Module.exports = exports`
- require可以导入（自定义模块，系统模块，第三方库模块）
- commonjs的缺点：  同步，容易堵塞
- 与webpack的关系：webpack会将模块加载转换成普通的js代码

#### ES Module

- node 里面使用ES Module需要把.js的后缀名改成.mj或者修改pack.jons
- export关键字
- import关键字
- 采用es module会自动开启严格模式
- 通常情况下，commonjs不能加载ES Module
- 多数情况下，ES Module可以加载commonjs
- 在本地文件引入js文件，并且未开启服务（live serve等），可能会报协议的错误
- 导出

```js
export const name = 'zhangan'
export const age = 18
export {
  name,
  age
}//此时的大括号不是一个对象，而是一个语法，故不能写key-value对，它的作用是放置要导出的变量的引用列表
export {
  name as Name,
  age as Age
}
//默认导出，在一个模块中只能有一个
export default function (){
  let name='kobe'
}
```

- 导入

```js
//1
import {name, age } from 'filePath'
//2，起别名
import {name as Name} from 'filePath'
//3.as
import * as filename from 'filePath'
filename.name
//4.引入后直接导出
export {name, age} from 'filePath' // 在开发和封装一个功能库的时候，通常我们希望将暴露的所有接口放到一个文件中；
//5.导入默认导出的文件
import AllName from 'filePath'
//6.
impprt ('filePath').then(res => {
  res.name
  res.age
})
```

##### import函数

- import不能放在逻辑语句中
- 想放在模块中需要使用上面导入的第6种语法
  
##### ES Module的加载过程

- 异步（不会阻塞index.html的js文件的加载运行）

###### ES Module的导出原理

- 看之前的博客

#### require

##### require的查找规则

- 1.X是一个核心模块，比如path、http
- 2.X是以./ 或../ 或/ 开头的  
    a.如果有后缀名，直接找文件
    b.如果没有后缀名 则按照下面的顺序：  
        `X>.X.js>X.json>X.node`  
    c.找不到X，X则作为一个目录，则在里面寻找index文件，规则同上
- 3.是一个模块，在node_modules文件夹里面找

#### 模块的加载过程

- 加载过程是同步的
- 模块只会加载一次，内部的代码只会执行一次，会缓存下来
- 循环加载采用深度优先搜索

## npm  (Node Package Manager)

- `npm i gulp --dev--save`  
  save 本地安装  
  dev 开发环境安装  
  dependence：生产环境  
  devdependence：开发环境
- `npm list`
  查看安装包的树
- `npm list | gulp`
- `npm install --production`
  安装生产环境的包
- `npm view gulp`
  查看安装包的版本
- `npm view gulp version`
  查看包的所有版本
- `npm outdated`
  查看那个包是过期的
- `npm update`
  更新
- `npm config set registry  xxxx`
  切换npm源

## yarn

- yarn upgrade === rm -rf node_modules(删除node_modules) && npm install (下载))
- yarn install === npm install
- yarn add [package] === npm install [pakcage]
- yarn remove [package] === npm uninstall [pakcage]

## cnpm

- 国内访问`https://rehistry.nomjs.org`慢
- taobao镜像 ----> 链接registry仓库
- 查看镜像：npm config get registry
- 设置镜像taobao：npm config set registry `https://registry.npm.taobao.org/`
- 设置源镜像:npm config set registry `https://registry.npmjs.org`

## 安装包的版本

- 13.4.6  
  `major`: 13, `minor`: 4, `patch`: 6
  `major`: 大方向改动
  `minor`: 小方向更新
  `patch`：补丁，偶数稳定
- 版本符号的意思  
  ^：只锁定主版本`major`的号  
  ~：锁定主版本号`major`和副版本号`minor`
  空：锁定到`patch`
  *：最新版本

## 如何上传自己的包

### buildins (内置的包)

无

### 第三方包

无

### 自己开发的包

npm login
  
`npm init`or`npm init -y`(一路回车)

```js

const _ = require("loadsh")
function myChunk(arr) {
  let arr2 = _.chunk(arr, 2)
}
module.export myChunk

```

1.npm官网 注册用户  
2.`npm adduser`
3.`npm publish`

## npm脚本

```js

"scripts": {
  "dev": "gulp -v"
  "runjs1": "node a.js & node b.js"   //并行
  "runjs2": "node a.js && node b.js"   //串行
}

```

- test与start命令可以不需要run

### 项目配置文件

```js
{
  "name": "npmDemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js", // 入口文件
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
/*-------------------------------*/
const demo = require('xxxxx') // 会去入口文件去找
/*-------------------------------*/
```

### 常见的属性

- engines 用于指定node和npm的版本号
- browserslist用于配置打包后的js浏览器的兼容情况

### npm install

- 全局安装  `npm install xxxx -g`
- 项目（局部）安装`npm install xxx`

#### npm i 原理

- .package.json--->2.npm--->3.检查是否有package-lock.json，若有，转到8--->4.构建依赖关系--->5.registry仓库--->6.压缩包，并添加缓存--->7.压缩到node_modules
- 8.检查依赖一致性，不一致，转4；一致--->9.查找缓存，没找到转5，存在--->缓存文件获取到压缩包。转6

### 常用的命令

- npm uninstall xxx 卸载某个包
- npm rebuild 强制重新build
- npm cache clean 清除缓存

### 访问package里面的文件

- `process.env.npm_package_config_env` 需要访问到具体的变量名。

### cross-env的使用

- `npm i cross-env -D`
- cross-cnv可以运行跨平台设置使用环境变量的脚本

### nrm 管理源

- NRM是npm的镜像源管理工具，使用这个可以快速的在npm源间切换。
- 安装nrm----------`npm i -g nrm`
- `nrm ls` 可以查看可选的源
- `nrm use taobao`使用淘宝源
- `nrm test` 测试相应源的响应时间

### npx

- 用来调用项目的包依赖命令
- npx 不会在本地和全局安装，会有一个临时文件夹，用完就删了。
- npx --no-install http-server  
  可以让npx强制使用本地模块，不下载远程模块，如果本地不存在该模块，就会报错
- npx --ignore-existing heep-server
  忽略本地的同名模块，强制安装使用远程模块  

## 模块/包 与 commonjs

### commonjs规范

- 浏览器没有require对象，nodejs内部有，可以直接使用  
  暴露模块：Module.exports = xxxx  
  引入模块：const xxx = require('./xxx')  

### nodejs内置模块(最好的方法是查看官方文档)

#### path

- path模块用于对模块的路径处理
- `path.resolve(filenameA, filenameB)`拼接路径，可以不用考虑操作系统的问题

```js
const path = require('path')
```

#### 文件系统（fs）

- 读取文件的信息（同步，异步，期约函数）
- 文件的读写

```js
const fs = require('fs')
//写入文件
const content = 'zhangsan'
fs.writeFile('./a.txt', content, {flag: w}，err =>{
  console.log(err)
})
//读取文件
fs.readFile('./a.txt', {encoding: 'utf-8'}, (err, data) => {
  console.log(data)  //zhangshan
})
```

- 文件夹的操作

```js
const fs = require('fs')
//创建文件夹
const dirname = './a'
if(!fs.existSync(dirname)) {
  fs.mkdir(dirname, err => {
    console.log(err)
  })
}
//读取文件夹
fs.readdir(dirname, (err, files) => {
  console.log(files)
})
//重命名
fs.rename
```

#### events模块

```js
const EventEmittter = require("events");
const emitter = new EventEmittter();
//监听某一个事件  addListener 是 on的一个简写（Alias）
emitter.on('click', (args) => {
  console.log(1)
})
emitter.emit('click')
emitter.off('click',FucName) // 关闭发送

//获取注册的事件
emitter.eventsNames()
```

#### Stream

程序中的流===> 当从一个文件中读取数据时，文件的二进制（字节）数据会源源不断的被读取到我们的程序中

- 所有的流都是EventEmitter的实例

##### 读取文件

```js
  const fs = require('fs')
  const reader = fs.createReadStream('a.txt', {
    start:3,
    end:6,
    higWaterMarK:2,
  })
  //--- 数据读取过程
  reader.on('data', data => {
    console.log(data);
    reader.pause()

    setTimeout(()=>{
      reader.resume()
    },1000)
  })
  // start :开始位置
  // end:结束位置
  //higWaterMarK:每次读多少

  reader.open("open", ()=>{

  });
  reader.close("close", ()=>{

  });
```

##### 写入文件

```js
const writer = fs.createWriteStream('a.txt', {
  falgs: 'r+',
  start: 4,
});
writer.write('xxxx',(err)=>{})
writer.close()//关闭文件
writer.end("xxx") //做了两件事1.关闭文件；2.再在文章的最后写入东西
```

##### pipe方法的使用

```js
const fs = require('fs');
//传统的写法
fs.readFile('a.txt', (err,data) => {
  fs.writeFile('b.txt', data, (err)=>{
    console.log(err)
  })
})
//pipe写法
const reader = fs.createReadStream('a.txt');
const writer = fs.createWriteStream('b.txt');
reader.pipe(writer);
```

#### url

- `url.parse('urlString')`  解析url地址成为一个url对象
- `url.format('urlObj')` 解析一个url对象成为一个url地址
- `url.resove('http://www.aab.com/a', '../')`   打印出'http://www.aab.com'  
 `url.resove('http://www.aab.com/a', '/b')`  打印出'http://www.aab.com/b'

#### http/https

##### server.js

- 创建一台服务器
  
```js
const http = require('http')
const server = http.createServer((request, response) => {
  response.writeHead(200, {
    'content-type': 'text/html'  //浏览器怎么解析由你决定
  })
  response.write("<div>hello node</div>")   //可以传html,结果也可以直接写在end里
  response.end() // response.end("<div>hello node</div>")
})
server.listen(8080, 'localhost',() => { //不要写1024一下得端口号
  console.log("8080");
})
```

- 建立多台服务器

```js
const http = require('http')
const server1 = http.createServer((request, response) => {
  response.end("1") 
});
server1.listen(8080, 'localhost',() => { /
  console.log("server1启动成功");
});
const server2 = http.createServer((request, response) => {
  response.end("2") 
});
server2.listen(8080, 'localhost',() => { /
  console.log("server2启动成功");
});
//传统方法
cosnt server3 = new http.server((req, res) => {
  response.end("3")
});
server3.listen(8080, 'localhost',() => { /
  console.log("server3启动成功");
});
```

##### request对象分析

- request对象封装了个客户端给我们服务器传递过来的所有信息
- request.headers ： 请求头信息
- request.url : url
- content-length：文件的大小和长度
- header头信息content-type:
- application/json表示是一个json类型
- application/xml表示是一个xml类型
- text/plain表示是一个文本类型
- multipart/form-data表示是一个文件
  
```js
const http = require('http')
const url = require('url')
const qs = require('queryString')
const server1 = http.createServer((request, response) => {
  //处理get请求
  //最简单的写法
  if(request.url === '/login') {
    response.end('欢迎回来')
  }else if(request.url === '/users') {
    response.end('用户列表')
  }
  //---------------------------
  //解析路径
  url.parse(request.url)
  const { pathname, query } =  url.parse(request.url);
  //解析参数
  qs.parse(query);
});
server1.listen(8080, 'localhost',() => { /
  console.log("server1启动成功");
});
```

- request.method : 请求方法

```js
const http = require('http')
const url = require('url')
const qs = require('queryString')
const server1 = http.createServer((request, response) => {
  const { pathname } = url.parse(request.url)
  if(pathname = '/login') {
    if(request.method === 'POST') {
      //拿到body的东西
      request.setEncoding('utf-8')
      request.on('data', (data) => {
        // data.toString();  不需要setEncoding
        console.log(data)  //此时data为string类型
        const { username, password } = JSON.parse(data)
      })
      response.end("1")
    }
  }
   
});
server1.listen(8080, 'localhost',() => { /
  console.log("server1启动成功");
});
```

##### response对象分析

```js
const http = require('http')
const server1 = http.createServer((request, response) => {
  //设置响应的header
  response.setHeader('Content-Type', 'text/plain')
  //设置状态码
  //1.直接给属性赋值
  response.statusCode = 400；
  //2.和Head一起使用
  response.writeHead(503, {
    'Content-Type': 'text/plain'
  });
  //响应结果
   response.write'响应结果1');
   response.end();
});
server1.listen(8080, 'localhost',() => { /
  console.log("server1启动成功");
});
```

##### 发送网络请求

- axios在前端中基于xhr，在node中基于http内置模块

```js
const http = require('http');
http.get('url', (res = Imagecoming类型)=>{
  res.on('data', (data) => {
    conlose.log(data.toString())
  })
});
const req = http.request({
  method:'POST',
  pathname:'localhost',
  port:8000
}, (res)=>{
  res.on('data', (data) => {
    conlose.log(data.toString())
  })
})
req.end()
```
