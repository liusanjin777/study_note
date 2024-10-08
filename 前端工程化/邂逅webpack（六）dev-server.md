# devServer

## devServer的使用

- `npm install webpack-dev-server`
- 在package.josn中`"serve": "webpack serve"`

dev-serve在编译之后不会写入到任何的输出文件，而是将bundle文件保存到内存中

## webpack-dev-middleware

webpack-dev-middleware 可以创建自由度更高的服务，但是开发中不经常使用

- `npm i webpack-dev-middleware express -D`
- 在根目录下创建一个`server.js`文件

```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddlerware = require('webpack-dev-middleware')

const app = express();
const configUrl = require('./wepack.config.js');
// 传入配置信息，webpack会根据配置信息进行编译
const compiler = webpack(configUrl);
const middleware = webpackDevMiddlerware(compiler)

app.use(middleware);
app.listen(3000, () => {
  console.log('服务在3000端口开启！')
});
```

- `node server.js`

## HMR(模块热替换)

- 在应用程序的运行过程中，替换、添加、删除某一个模块
- 我们需要指定哪个模块去执行热更新

### 在单独的js文件中

在`webpack.config.js`中

```js
module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, './build')
  },
  /**begin */
  devServer: {
    hot: true,
  },
  /**end */
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin()
  ]
}
```

在模块文件`math.js`中

```js
if (module.hot) {
  module.accept("./math.js", () => {
    console.log("./math.js文件发生了更新")
  })
}
```

### 在框架的HMR中

- 使用框架的loader即可

### HMR原理

- webpack-dev-server会创建两个服务：提供静态资源的服务（express）和Socket服务（net.Soclet）
- express server负责提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- HMR Socket Server是一个socket的长连接  
  1.长连接有一个最好的好处是建立连接后双方都可以进行通信（与http短连接不同，服务器可以直接发送文件到客户端）  
  2.当服务监听到对应的模块发生变化的时候，会生成两个文件.json（manifest）和.js（update chunk）  
  3.通过长连接，可以直接将这两个文件发送到客户端（浏览器）  
  4.浏览器拿到这两个新文件后，通过HMR runtime机制，加载这两个文件，并且针对修改的模块进行更新；

## devServer的publicPath

```js
 devServer: {
    hot: true,
    publicPath: '/abc', //代表服务部署在：localhost:8080/abc
  },
```

## hotOnly、host配置

- hotOnly是放编译失败时，是否刷新整个页面，如果不希望，可以设置为`true`
- host设置主机地址，默认值为localhost，如果希望其他地方可以访问，可以设置为0.0.0.0

### localhost和0.0.0.0的区别

- localhost本质上是一个域名，通常情况下被解析为127.0.0.1
- 127.0.0.1是一个回环地址，表达的意思是我们主机自己发出的包，直接被自己接受
- 0.0.0.0：监听IVP4上所有的地址，在同一个网段下的主机中，通过IP地址是可以访问的

## port、open、compress

- port：设置监听的窗口
- open：是否打开浏览器
- compress是否为静态文件开启gzip compression

## proxy代理

- 解决跨域问题

### 跨域场景

发送请求

```js
axios.get("localhost:7777/login").then(res => {
  console.log(res)
})
```

此时我们的服务端口为`localhost:8080`, 请求`localhost:7777`时发生跨域（主机、端口、域名有一个不同时，便会发生跨域问题），采取下述方式解决跨域

```js
proxy: {
  "/api": {
    target: "localhost:7777",
    pathRewrite: {
      //若是不设置路径重写，则会请求 'localhost:7777/api/login'，重写后请求'localhost:7777/login',
      // ^ 的作用是表示以什么什么开头 
      "^/api": "",
      // 避免服务器进行校验
      changeOrigin: true,
      // 代理 https
      secure: false,
      
    }
  }
}
```

## historyApiFallBack属性

当路由以history的方式执行时，当我们点击渲染子路由的时候，浏览器地址栏会变成`localhost:8080/home`，此时如果点击刷新，则会404.因为后端并不存在`localhost:8080/home`能返回静态资源，此时后端能做配置，前端使用devServer的historyApiFallBack属性也可以达到要求

```js
historyApiFallBack: true, // 当遇到上面问题时，将整个index.html文件返回
```
