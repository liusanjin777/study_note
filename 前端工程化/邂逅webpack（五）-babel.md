# babel的深入解析

- babel是一个工具链，主要用于旧浏览器或者缓解中将`es6 +`代码转换为向后兼容的版本
- 包括：语法转换、源代码转换、ployfill实现目标缓解缺少的功能等

## babel的使用

- 安装Babel `npm install babel -D`
- 安装@babel/core `npm install @babel/core -D`
- 安装对应的plugins `npm install @babel/preset-env -D`

### webpack.config.js

```js
module.exports = {
  /**other code */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env"
              ]
            }
          }
        ]
      }
    ]
  },
}

```

## babel的配置文件

- babel.config.json
- .babelrc.json

### 区别

多包管理的时候配置第二种方式较为麻烦

### babel.config.js

```js
module.exports = {
  presets: [
    "@babel/preset-env"
  ]
}
```

## polyfill

- 一个填充物、垫片、补丁，可以帮助我们更好的使用js

### 为什么使用polyfill

- 当我们使用一些语法特性（ES6：Promise、Symbol等），但是浏览器不认识这些特性，此时polyfill可以来填充或者说打一个补丁，那么浏览器就认识该特性了

### 使用polyfill

- babel7.4.0之前可以使用
- babel7.4.0之后不推荐使用了，用`core.js` 和 `regenerator-runtime` 代替

1.下载：`npm install core.js regenerator-runtime --save`  
2.在`babel.config.js`文件中

```js
module.exports = {
  presets: [
    ["@babel/preset-env", {
      // false: 不使用任何与polyfill相关的代码
      // usage：代码中需要哪些polyfill，就引用相关的api
      // entry：需要手动在入口文件中引用对应的api
      // 当使用fusage或者entry时，需要在webpack.config.js中的rules包含的对象中，添加exclude属性
      useBuiltIns: '',
      corejs: 3 //指定版本，否则默认使用2版本
    }]
  ]
}
```

## plugin-transform-runtime

- 功能与polyfill类似
- 但是polyfill是全局的，而plugin-transform-runtime拥有自己的作用域

## TypeScript的编译

### 第一种

- 使用ts-loader----`npm install ts-loader`
- 初始化ts文件----`tsc --init`

### 第二种

在`webpack.config.js`中

```js
/* other code */
rules: [
  {
    test: /\.ts$/,
    use: ["babel-loader"]
  }
]
```

在`babel.config.js`文件中

```js
module.exports = {
  presets: [
    ["@babel/preset-env", {
      useBuiltIns: 'usage',
      corejs: 3 //指定版本，否则默认使用2版本
    }],
    ["@babel/preset-typescript"]
  ]
}
```

### ts编译的最佳实践

#### ts-loader

#### babel-loader

- 缺点：不会对类型做校验
- 优点：支持polyfill

#### 实践方式

***使用babel-loader进行转换，使用tsc进行类型校验***

- 在package.json中添加两个脚本  
  1. `"check": "tsc --noEmit"`：类型校验不生成`.js`文件
  2. `"check-watch": "tsc --noEmit --watch"`：类型校验不生成`.js`文件，同时监听错误的变化
- 在编译之前，执行上述其中一个命令来进行类型校验

## 加载vue文件

- 安装`vue-loader`、`vue-tempalte-compiler`

rules中：

```js
{
  test: /\.vue$/,
  use: "vue-loader",
}
```

plugins中：

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
/* other code*/
new VueLoaderPlugin()
```
