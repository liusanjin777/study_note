# 邂逅webpack（二）

## 认识Plugin

- loader是用于特定的模块类型进行转换
- Plugin可以用于执行更加开放的任务，比如打包优化、资源管理、环境变量注入等；

## CleanWebpackPlugin

- 用于删除之前的打包文件夹

```js
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

module.exports = {
  /**other code */
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

## HtmlWebpackPlugin

- 用于生成index.html文件

```js
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = {
  /**other code */
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'sanjin webpck', //标题
      template: "./public/index.html" //生成自己的html模板
    })
    /**
     * 语法 <% 变量 %> 这是EJS模块填充数据的方式
     */
  ]
}
```

## DefinePlugin

- DefinePlugin允许在编译时创建配置的全局常量，是一个webpack内置的插件

```js
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { DefinePlugin } from 'webpack'

module.exports = {
  /**other code */
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'sanjin webpck', //标题
      template: "./public/index.html" //生成自己的html模板
    }),
    /**
     * 语法 <% 变量 %> 这是EJS模块填充数据的方式
     */
    new DefinePlugin({
      BASE_URL: "'./ '"
    })
  ]
}
```

## CopyWebpackPlugin

- 1

```js
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { DefinePlugin } from 'webpack'

module.exports = {
  /**other code */
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'sanjin webpck', //标题
      template: "./public/index.html" //生成自己的html模板
    }),
    new DefinePlugin({
      BASE_URL: "'./ '"
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: "public", // 从public文件夹复制
        globOptions: {
          ignore: [
            "**/index.html" //需要忽略的文件。 **/ 代表 public/
          ]
        }
      }]
    })
  ]
}
```
