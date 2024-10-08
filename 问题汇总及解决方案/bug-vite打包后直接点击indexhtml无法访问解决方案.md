# bug-vite打包后直接点击indexhtml无法访问解决方案

## 问题原因

打包后并不支持file引用协议

## 解决方案

### 下载兼容插件

```json
npm i @vitejs/plugin-legacy
```

### 在vite.config.js配置

```js
// 引入@vitejs/plugin-legacy
import legacy from '@vitejs/plugin-legacy';
// 在plugins中添加
legacy({
  targets: ['defaults', 'not IE 11']
}),
```

### 在打包后的index.html文件的末尾添加下面代码段

- 也可以直接在根目录下的index.html文件得末尾添加下面代码，打包时会自动带入

```html
<script>
  (function (win) {
    // 获取页面所有的 <script > 标签对象
    let scripts = document.getElementsByTagName('script')
    // 遍历标签
    for(let i = 0; i < scripts.length; i++) {
      // 提取单个<script > 标签对象
      let script = scripts[i]
      // 获取标签中的 src
      let url = script.getAttribute("src")
      // 获取标签中的 type
      let type = script.getAttribute("type")
      // 获取标签中的js代码
      let scriptText = script.innerHTML
      // 如果有引用地址或者 type 属性 为 "module" 则代表该标签需要更改
      if (url || type === "module") {
        // 创建一个新的标签对象
        let tag=document.createElement('script');
        // 设置src的引入
        tag.setAttribute('url',url);
        // 设置js代码
        tag.innerHTML = scriptText
        // 删除原先的标签
        script.remove()
        // 将标签添加到代码中
        document.getElementsByTagName('head')[0].appendChild(tag)
      }
    }
  })(window)
</script>
```

## 注意

路由请采用hash模式
