---
title: ES Module 导出原理
date: 2021-12-22 19:40:25
tags:
---

# ES Module 导出原理

有两个文件：  

- foo.js:  

```js
let name = "kobe"
let age = 18
export {
  name,
  age
}
```

- bar.js:  

```js
import {name,age} from './foo.js'
console.log(name);
console.log(age);
```

注意：  

- export{} 这个大括号并不是一个对象，而是相当于建立了一个模块环境记录

```js
const name = name
const age = age
```

这个模块环境记录是实时绑定的，也就是当foo里面的name发生改变，模块环境记录里的name也会被重新赋值，导致bar里面引入的name的值发生改变，同时因为模块环境记录里面是const赋值，所以当bar里引入的是基本类型的数据的时候，无法改变其的值，引入的是引用类型的值的时候，无法重新分配内存地址。
