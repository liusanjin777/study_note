# resolve属性

resolve用于设置模块如何被解析

## 绝对路径

- 不需要进一步解析

## 相对路径

- 在这种情况下，使用import或者require的资源文件所在的魔力，被认定为上下文目录
- 在import或者require中给定的相对路径中，会拼接此上下文路径，来生成模块的绝对路径

## 模块路径

- 在`resolve.modules`中指定的所有文件检索模块，默认值是`['node_modules']`,所以会从node_modules中查找文件
- 可以通过设置别名的方式来替换初始模块路径

## 查找方式

### 文件

- 文件如果具有扩展名，直接打包该文件
- 否则，使用`resolve.extensions`选项作为文件扩展名就解析

### 文件夹

- 会在文件夹中根据`resolve.mainFiles`配置选项中指定的文件顺序查找  
  1.`resolve.mainFiles`的默认值为`['index']`  
  2.再根据`resolve.extensions`来解析扩展名

```js
resolve: {
  extensions: ['.wasm', '.mjs', '.js', '.json'], //默认就是这几个,
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```
