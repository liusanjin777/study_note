---
title: Vue2
date: 2021-12-22 19:40:25
tags: vue,css
---

## 路由守卫

### 全局前置路由守卫

- 守护路由的安全（权限）  ```router.beforeEach(callback)```
- `callback`在跳转路由之前会调用
- `callback`在初始化的时候会调用

```js
router.beforeEach((to,from,next)=>{
    next（）
}) 
```

 to：去哪个组件     from：来自哪个组件     next：放行

- 可以在路由文件中配置meta（路由元信息）属性 来判断一个组件是否需要校验

### 全局后置路由守卫

- `router.afterEach(callback)`     可以用来改变页面的title值
- `callback`在跳转路由之后会调用
- `callback``在初始化的时候会调用
- `router.beforeEach((to,from)=>{})`
to：去哪个组件     from：来自哪个组件     无next参数

### 独享守卫

- `beforeEnter：(to,from,next)=>{ }`
独享路由守卫只有前置没有后置

### 组件内路由守卫

- `beforeRouteEnter (to,from,next){}`   通过路由规则进入的组件，在进入之前调用
- `beforeRouteLeave (to,from,next){}`  通过路由规则离开的组件，在离开之前调用

## 插槽

### 默认插槽

使用组件时`<component>  hhhhh</component>`，然后再component中hhh中改放入的地方`<slot>我是默认语句，当hhh为无的时候我就会出现</slot>`
使用多个插槽时，可以再`<component   slot="xxx">`   然后再编辑`<slot  name="xxx">`

### 具名插槽

在template中使用`v-slot:xxxx`
作用域插槽：数据在组件额自身，但根据数据生成的结构需要组件的使用者来决定。（games数据在Category组件中，但是用数据所便利出来的结构由父组件决定）

## ref的使用

- 1、ref 加在普通的元素上，用`this.ref.name`获取到的是dom元素
- 2、ref 加在子组件上，用`this.ref.name` 获取到的是子组件实例，可以使用子组件的所有方法。
- 3、如何利用 v-for 和 ref 获取一组数组或者dom 节点

## vue中mvvm的理解

- M就是：模型（Model）：数据模型；负责数据存储。泛指后端进行的各种业务逻辑处理和数据操控，主要围绕数据库系统展开。
- V就是：View 视图，负责页面展示，也就是用户界面。主要由 HTML 和 CSS 来构建
- VM就是：视图模型（View-Model）：负责业务逻辑处理（比如Ajax请求等），对数据进行加工后交给视图展示
- 通过vue类创建的对象叫Vue实例化对象，这个对象就是MVVM模式中的VM层，模型通过它可以将数据绑定到页面上，视图可以通过它将数据映射到模型上
- ViewModel 是由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。

## prop的使用

- 一般在父组件中通过v-bind定义一个动态值（`<child  type="要传入的值"><child>`），子组件通过Prop接收该值  ( `props:["type"]` )
- `https://blog.csdn.net/qq_37994886/article/details/98742513`
- 如果子组件需要操作Prop中的值，需要将Prop中的值赋值给本地定义的属性

## emit的使用

- 子组件可以使用$emit调用父组件的方法并传递数据

## vue2小坑

vue2中直接利用数组下标(  a[0]=1 ）, 进行修改是改变不了view层的  
解决方法：

```js
this.$nextTick，
vue.set(数组，索引，值)，
this.$set(数组，索引，值))
array.splice()
```

添加对象的属性使用this.obj.a = 1 也是改变不了view层  
解决方法：

```js
vue.set(对象，"key"，值)
this.$set(对象，"key"，值))
```

删除对象的属性delete this.obj.a也改变不来view层  

解决方法：
`this.$delete(对象名，key)`

## 动态绑定class

```js
//第一种（用逗号隔开）
:class="{ 'active': isActive, 'sort': isSort }"
//第二种（放在data里面）
//也可以把后面绑定的对象写在一个变量放在data里面，可以变成下面这样
:class="classObject"
  data() {
  return {
    classObject:{ active: true, sort:false }
  }
  }
//第三种（使用computed属性）
:class="classObject"
  data() {
  return {
    isActive: true,
    isSort: false
  }
  },
  computed: {
  classObject: function () {
  return {
   active: this.isActive,
   sort:this.isSort
  }
  }
  }

```
