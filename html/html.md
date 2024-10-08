# HTMl

## defer

```js
<script defer="defer" src="xxx" />
```

- 未设置defer时，浏览器依次下载js文件并执行

- 设置defer浏览器会先下载js文件，当整个html解析完后，再执行该js文件