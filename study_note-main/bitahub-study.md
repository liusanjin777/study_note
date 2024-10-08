---
title: bitahub-study
date: 2021-12-22 19:40:25
tags:
---
## 滚动加载

设置一个 `scrollFinished` 为`false`，再设置一个 `scrollLoading`为 `true`，当需要滚动加载的时候，将`scrollFinished`与`scrollLoading`都设置为`true`，加载数据，加载完毕后再将其设置回原来的状态。

## 判断样式active的激活

``` js

 headerNavActive: {
        get: function() {
          const returnVal = this.$route.path.indexOf('/training/project') > 0 ? 0 : 1  //利用路由的索引值判断样式active激活
          return returnVal
        }
      }
```

## FormData.append()

向 FormData 中添加新的属性值，FormData 对应的属性值存在也不会覆盖原值，而是新增一个值，如果属性不存在则新增一项属性值。

## 利用`let that=this` 来操作在箭头函数里面的数据

## 关于计算的方法会放在vue中的`computed`中（`computed`与`watch`的区别）

- computed 是基于响应性依赖来进行缓存的。只有依赖数据发生改变，才会重新进行计算（当触发重新渲染，若依赖数据没有改变，则 computed 不会重新计算）。若没改变，计算属性会立即返回之前缓存的计算结果。
- watch不支持缓存，数据变或者触发重新渲染时，直接会触发相应的操作。
- watch 支持异步
- 当一个属性发生变化时，需要执行对应的操作；一对多时，一般用 watch。
- omputed 只有当依赖的数据变化时才会计算, 会缓存数据。
- watch 每次都需要执行函数。watch 更适用于数据变化时的异步操作。
  
## `Promise.all(iterable)` 方法返回一个 Promise 实例

`Promise.all(iterable)`方法返回一个 `Promise` 实例，此实例在 iterable 参数内所有的 `promise` 都完成 `resolved` 或参数中不包含 `promise` 时回调完成 `resolve`；如果参数中  `promise` 有`rejected`，此实例回调失败 `reject`，失败原因的是第一个失败 `promise` 的结果。

## vue中ref的使用

`ref`被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs`对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向该子组件实例，通俗的讲，ref特性就是为元素或子组件赋予一个ID引用,通过`this.$refs.refName`来访问元素或子组件的实例

## `Object.keys()`用于获得由对象属性名组成的数组
