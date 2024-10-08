# 环境分离 

## 配置分离

### process.env.NODE_ENV简单的判断

- 在package.json中

```json
"build": "webpack --mode production",
"serve": "webpack serve --mode development"
```

在src文件夹下

```js
// 运行 npn run serve时
console.log(process.env.NODE_ENV === 'production') // true
// 运行 npm run build时
console.log(process.env.NODE_ENV === 'development') // true

```

### 文件分离

- 利用process.env.NODE_ENV做判断，然后将配置分离，再利用`webpack-merge`进行合并

## 代码分离

### 手动分离

- 原本的index.js

```js
console.log("hello index!");
console.log("hello main!");
```

- 分离成index.js文件和main.js文件

```js
/*index.js 中 */
console.log("hello index!");
/*main.js 中*/
console.log("hello main!");
```

在webpack.config.js中

```js
const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    main: './src/main.js',
  },
  mode: 'development',
  output: {
    filename: '[name]_dist.js', // [name] 值为entry的key值
    path: path.resolve(__dirname, './build')
  },
}
```

### 当两个文件都引用了第三方库，例如`loadsh`

- 第一种(并不是很推荐)

```js
entry: {
  main: {
    import: './src/main.js', 
    depandOn: 'shared'
  },
  index: {
    import: './src/index.js', 
    depandOn: 'shared'
  },
  shared: ['loadsh', 'dayjs']
}
```

- 第二种：SplitChunks

```js
const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    main: './src/main.js',
  },
  mode: 'development',
  output: {
    filename: '[name]_dist.js', // [name] 值为entry的key值
    path: path.resolve(__dirname, './build')
  },
  optimization: {
    splitChunks: {
      // async:处理异步导入
      // initial：同步导入
      // all: 全部导入
      chunk: 'all'
    },
     //配置runtime环境代码是否抽取到单独的chunk中
     //runtime环境代码： 运行环境中，对模块进行解析、加载、模块信息相关的代码
     /* 
     true
     multiple
     single
     */
    runtimeChunk: true
  }
}
```

### 异步代码分离

```js
import('./foo.js').then(res => {
    console.log(res)
})
```

**动态导入**这种方式无论`chunk`设置成什么值，都会被打包成单独的文件

### 代码的懒加载

动态导入最常用的方式是懒加载，例如vue里面的路由懒加载

```js
import(
    /* webpackChunkName: 'foo' */
    /*webpackPrefetch: true */
    './foo.js').then(res => {
    console.log(res)
})
```

- `prefetch`: 将来某些导航下可能需要的资源

- `preload`: 当前导航下可能需要资源
- `preload chunk` 会在父chunk加载时，以并行的方式开始加载，而`prefetch chunk`会在父chunk加载结束后开始加载
- `preload chunk` 具有中等优先级，并立即下载。`prefetch chunk` 再浏览器闲置时下载
- `preload chunk` 会在父chunk中立即请求，用于当下时刻。`prefetch chunk` 会用于未来某个时刻

### 代码抽取

#### js

js代码抽取时只需要将相应的filename设置成 'js/xxxx'

```js
cacheGroups: {
    test: /[\\/]node_modules[\\/]/,
    filename: 'js/[id]_vendors.js',
    priority: -10
}
```

#### css

需要插件 MiniCssExtractPlugin

- 在plugins配置中

```js
import MiniCssExtractPlugin from 'mini-css-extract-plugn'
module.exports = {
    /* other code */
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css'
        })
    ]
}
```

- 在loader中

```js
{
    test: /\.css/i,
    use: [ 
          isProduction ? MiniCssExtractPlugin.loader : 'style-loade'
          'css-loader']
}
```



