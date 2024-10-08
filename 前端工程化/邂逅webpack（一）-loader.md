# 深入浅出webpack

## 什么是webpack

- `webpack is a *static module bundler for modern* JavaScript applications`
- `bundler`: webpack 可以帮助我们进行打包，是一个打包工具。
- `static`: 我们最终可以将代码打包成最终的静态资源（部署到静态服务器）。
- `module`: webpack 默认支持各种模块化开发，`ES Module`、`CommonJS`、 `AMD`等。
- `modern`: 现代前端面临着各种各样的问题，催生了webpack的出现和发展。

### webpack如何对我们的项目进行打包的呢？

- 根据命令或者配置文件找到入口文件
- 从入口开始，生成一个依赖关系图，这个依赖关系图辉包含应用程序中所需要的所有模块
- 遍历图结构，打包一个个模块（根据文件的不同使用不同的`loader`来解析）

### loader

- `loader`可以对模块的源代码进行转换
- 配置文件中`use` 里面的`loader`会从后往前处理

## 处理css

### 浏览器兼容

#### 配置

```browserlistrc
> 1%
last 2 versions
not dead
```

#### 共享工具 Browserslist

- 1.在package.json中

```json
"Browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
]
```

- 2.根目录新建文件`.browserslistrc`

```browserlistrc
> 1%
last 2 versions
not dead
```

### css-loader

- 处理css文件

### style-loader

- 将css文件添加到样式中去

### postcss-loader

#### PostCSS工具

- PostCss是一个通过js来转换样式的工具
- 帮助我们进行一些CSS的转换和适配(以Browserslist的配置浏览器为标准)，比如自动添加浏览器前缀，css样式的重置
- 实现这些功能需要对应的插件

### 处理css--------webpack.config.js

```js
const path = require('path')

module.exports = {
  // 配置入口文件
  entry: './src/index.js',
  // 配置出口文件信息
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build.js') //只能是绝对路径
  },
 module: {
  // rules里面放置的是对象
  rules: [
    {
      test: /\.css$/, // 匹配资源---以.css结尾的文件
      // ues 里面放置对象 编写顺序：从后往前
      use: [
        "style-loader",
        { 
          loader: "css-loader", // 匹配到.css结尾的文件，会使用该loader进行转换
          options: {
            importLoaders: 1 // 当遇到import引入的资源，想回头被1个loader重新处理
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('post-preset-env')
              ]
            }
          }
        }
      ]
    },
    {
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        "less-loader" 
      ]
    }
  ]  
 }
}
```

## 处理其他资源（图片等）

### file-loader

- 该loader可以帮助我们处理import/require引用的文件
- 4.x版本require返回的是资源，5.x版本后返回的对象中default字段对应的是资源

#### file-loader------rules配置

```js
{
  test: /\.(png|jpg|jpe?g|gif|svg)$/,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "[name].[hash:6].[ext]", // name后面跟 [PlaceHolders]
        /**
         * 常用的[PlaceHolders]
         * [ext]: 处理文件的扩展名
         * [name]: 处理文件的名称
         * [hash]: 使用MD4的散列函数对文件的内容进行处理，生成的一个128的hash值（32个十六进制）
         * [hash:length]: 截取长度
         */
        ootputPath: 'imgFile', //将所有的文件放到imgFile文件夹里
      }
    }
  ]
}
```

### url-loader

- 工作方式和file-loader类似，但是可以转换为base64文件，体积更小，可以直接嵌入到js里面，不会生成单独的文件

#### url-loader------rules配置

```js
{
  test: /\.(png|jpe?g|gif|svg)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "[name].[hash:6].[ext]",
        limit: 100 * 1024 // 100kb以下的图片进行转换成base64
      }
    }
  ]
}
```

### asset module type

- 在webpack5之前，加载资源需要对应的loader，如file-loader、url-loader
- 在webpack5之后，我们可以直接使用资源模块类型（asset module type）。来替代上面的loader

#### asset module type------rules配置

```js
const path = require('path')

module.exports = {
  entry: 'index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
     // 生成文件夹单独保存图片 方法1
    assetModuleFilename: "img/[name].[hash:6][ext]"  //不需要 .[ext] 因为这里[ext] 返回的类似 .jpg 的格式
  }
 
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)/,
        type: "asset/resource"
        /**  type类型
         * asset/resource 发送一个单独的文件并导出URL，之前通过file-loader实现
         * asset/inline 导出一个资源的data URL，之前通过url-loader实现
         * asset/source 导出资源的源代码，之前通过raw-loader实现
         * asset 在导出一个data URL 和发送一个单独的文件之间进行自动选择，之前通过url-loader体积限制实现
         */
        // 生成文件夹单独保存图片 方法2  二者选其一
        generator: {
           filename: 'img/[name].[hash:6][ext]'
        }
      },
      /* 体积限制模式
      {
        test: /\.(png|jpe?g|gif|svg)/,
        type: "asset"
        // 生成文件夹单独保存图片 方法2  二者选其一
        generator: {
           filename: 'img/[name].[hash:6][ext]'
        },
        parser: {
          dataUrlConditin: {
            maxSize: 100 * 1024
          }
        }
      }
      */
    ]
  }
}
```

## 加载字体文件

```js
{
  test: /\.(woff|ttf|wot)/,
  type: "asset/resource",
  generator: {
     filename: 'font/[name].[hash:6][ext]'
  },
}
```
