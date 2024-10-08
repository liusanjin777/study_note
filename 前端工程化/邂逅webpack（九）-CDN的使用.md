# CDN

**CDN 被称为内容分发网络**

- 它是指通过相互连接的网络系统，利用最靠近每个用户的服务器
- 更快、更可靠的将音乐、图片、视频、应用程序及其它文件发送给用户
- 来提高高性能、可扩展性及低成本的网络内容传递给用户

**使用方式**

- 一：打包的所有静态资源，放到cdn服务器，用户所有资源都是通过cdn服务器加载的
- 二：一些第三方资源放到cdn服务器上

**例子**

- 首先在webpack配置文件中配置 externals

```js
{	
    // key: 下载包的名称
    // value： 导出的全局对象
    externals: {
        loadsh: '_'
    }
}
```

- 其次在index.html中手动引用 cdn链接

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
   <!-- use ejs  -->
  <% if (process.env.NODE_ENV === 'production') { %>
  <script src="xxx" />
  <% } %>
</body>
</html>
```
