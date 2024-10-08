# source-map

## 认识source-map

- source-map是从已转换的代码，映射到源文件
- 让浏览器可以重构原始文件，并在调试器中显示源文件

## 如何使用source-map

- 1.根据源文件，生成source-map文件，webpack在打包的时候，可以通过配置生成source-map

```js
module.exports = {
  /**other code */
  devtool: 'source-map',
  /**other code */
}
```

- 2.在转换后的代码，最后添加一个注释，他指向sourcemap

```js
//# sourceMappingURL=build.js.map
```

## 下面几个值不会生成source-map

- false：不使用source-map
- none：（什么值也不写），production模式下的默认值，不生成source-map
- eval：development下的默认值，不生成source-map  
  1.但是它回在eval执行的代码中，添加`//#sourceURL=xxx`  
  2.它会被浏览器在执行时解析，并且在调试面板中生成对应的一些文件目录，方便我们调试代码。

## cheap-source-map

- 会生成source-map，但是会更加高效一些，没有生成列映射

## cheap-module-source-map

- 会生成source-map，类似cheap-source-map, 但是源自loader的sourcemap处理会更好

## nosources-source-map

- 会生成source-map，但是只有错误信息的提示，不会生成源代码文件

## 推荐（最佳实践）

- 开发阶段：cheap-module-source-map
- 测试阶段：cheap-module-source-map
- 发布阶段：false，缺省值
