---
title: front-end-study
date: 2021-12-22 19:40:25
tags:
---

## Object.assignde 使用：（浅拷贝）

- <https://www.jianshu.com/p/f9ec860ecd81>
- Object.assign可以用来处理数组，但是会把数组视为对象。key是索引值，value是数组值

```js
Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]
```

上面代码中，`Object.assign` 把数组视为属性名为 `0、1、2` 的对象，因此源数组的 `0` 号属性`4`覆盖了目标数组的 `0` 号属性1。

## 深拷贝与浅拷贝

- 浅拷贝：因为浅复制只会将对象的各个属性进行依次复制，并不会进行递归复制，而` JavaScript `存储对象都是存地址的，所以浅复制会导致 `obj.arr` 和 `shallowObj.arr` 指向同一块内存地址
- 深拷贝：它不仅将原对象的各个属性逐个复制出去，而且将原对象各个属性所包含的对象也依次采用深复制的方法递归复制到新对象上。
- 赋值符号与拷贝的区别：在对象是引用类型`a=b`时赋值会将b的内存地址赋值给a，a改变值时，b也会改变。浅拷贝会将b第一层的内存地址与值传给a，a就算改变值，b的第一层也不会改变，但是改变a的更深层的值时，b就会改变；深拷贝无论a怎么改变，都不会影响b的值。

## `import`引用的会先执行，无论语句的顺序

## `appendChild()` 方法向节点添加最后一个子节点

## 路径问题

- "./"：代表目前所在的目录。
- " . ./"代表上一层目录。
- "/"：代表根目录。电脑中即c，盘，项目中即项目所在的文件夹
- "@/" ：vue专用，指向src文件夹
  
## hash值

所有`hash`值都不会传给服务器
`hash`的兼容性更好一点，`history`兼容性稍差。（上线后刷新会有问题，由后端解决）

## this.$nextTick(回调函数)

- 在下一次DOM更新结束后执行其指定的回调
- 当改变数据后，要基于更新后 的新DOM进行某些操作时，要在`nextTick`所指定的回调函数中执行

## JSON.stringify()

- `JSON.stringify()`的作用是将 JavaScript 对象转换为 JSON 字符串，而JSON.parse()可以将JSON字符串转为一个对象。
- `JSON.parse()`需要注意一点，由于此方法是将JSON字符串转换成对象，所以你的字符串必须符合JSON格式，即键值都必须使用双引号包裹

## JavaScript split() 方法

- `stringObject.split(a,b)`  a为一个字符串，表示以a来分隔，b表示希望得到的个数

```js
  let a = "Hello World!"
  let b = "123456"
  console.log(a.split("",3))   //['H','e','l']
  console.log(b.split("",3))   //['1','2','3']
  console.log(a.split(" "))    //['Hello','World']
```

- `split`不修改原数组

## js修改原数组的方法

- 1.sort() 排序

``` js
let myfoo =function(a,b){
  return a-b;
}
a = [22,1,444,3]
console.log(a.sort()) // [1,22,3,444]
console.log(a.sort(myfoo // [1,3,22,444]
```

- 2.reverse()  颠倒数组
- 3.splite() 插入/删除数组

如果是删除，返回值是被删除的元素

```js
array.splice(start, deleteCount, value, ...)
//start 
//开始插入和(或)删除的数组元素的下标。

//deleteCount 
//从start开始，包括start所指的元素在内要删除的元素个数。这个参数是可选的，如果没有指定它，splice()将删除从start开始到原数组结尾的所有元素。

//value, ... 
//要插人数组的零个或多个值，从start所指的下标处开始插入。

var a = [1,2,3,4,5,6,7,8]
console.log(a.splice(4),a);        // 返回 [5,6,7,8]; a is [1,2,3,4]
console.log(a.splice(1,2),a);      // 返回 [2,3]; a is [1,4]
console.log(a.splice(1,1),a);      // 返回 [4]; a is [1]
console.log(a.splice(1,0,2,3),a);  // 返回 []; a is [1,2,3]

```

- 4.push()
向数组末尾添加一项，返回值是新长度
- 5.pop()
删除最后一个元素，返回值是数组最后一个元素
- 6.shift()
在数组开头删除一项数组，返回值是数组第一个元素
- 7.unshift()
向数组开头添加一项，返回值是新长度

## 理解对象的引用赋值

- 浅拷贝和引用赋值是一个概念

## 三目运算符判断2个条件

-`{{list.status==0 ?"等待付款":(list.status =="1"?"已支付":"已取消")}}`
