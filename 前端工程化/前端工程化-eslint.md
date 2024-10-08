# Eslint

eslint 是一个静态代码分析工具，在没有任何程序执行的情况下，对代码进行分析

## 初始化

```js
npm init @eslint/config
```

然后按照自己期望的进行选择

## 配置文件

 **.eslintrc.js**

```js
module.exports = {
    "env": {
        "browser": true, // 环境
        "es2021": true // 支持的特性 2021
    },
    "extends": [ // 使用哪些拓展
        "eslint:recommended",
        "plugin:vue/vue3-essential" // 针对Vue3的插件
    ],
    "overrides": [ //  匹配哪些文件的 配置
        {
            "env": { // node环境
                "node": true
            },
            "files": [ // 匹配哪些文件的
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": { // 指定要使用的解析器
                "sourceType": "script" // 表示你的代码是以脚本的形式进行加载和执行的
            }
        }
    ],
    "parserOptions": { 
        "ecmaVersion": "latest", // 指定要使用的 ECMAScript 版本
        "sourceType": "module" // 指定代码的来源类型,如果你的代码是 ES 模块，则应设置为 'module'。
    },
    "plugins": [
        "vue" // 插件集合
    ],
    "rules": {
     // eslint 规则 比如
      'comma-spacing': [2,
        {
          // 强制在逗号前后使用一致的间距  例  a , b   or a, b
          before: false,
          after: true
        }
      ],
      'key-spacing': [2,
        {
          // 在对象文本属性中的键和值之间强制实施一致的间
          beforeColon: false,
          afterColon: true
        }
      ],
      "no-var": "error", //禁止使用var定义变量
    }
}

```

## 配置vite.config.ts

###  下载`vite-plugin-eslint`插件

`npm i vite-plugin-eslint --save-dev`

### **导入`vite-plugin-eslint`**

```js
import eslintPlugin from 'vite-plugin-eslint';
export default defineConfig({
    plugins: [
        vue(),
        eslintPlugin({
                fix: true, //修复错误
                include: [
                        'src/**/*.vue',
                        'src/**/*.ts',
                        'src/**/*.js'
                ],
        }),
     ]
})
```

