---
title: less-study
date: 2022-02-08 17:00:27
tags:
---

## 注释

- 以//开头的注释不会编译到css文件中，但是/*开头的注释会被编译到css文件中

## less变量variable

- 在样式表中多次被引用的值可以将其定义为变量这样就易于维护

```less
  @color: #5b83ad; /*用@定义一个变量*/
  @add-color: @color + #111111; /*颜色可以进行加减*/

  div{
    color: @add-color;
  }
```

- 也可以用变量名定义变量

```less
  @color: red;
  @color2: "color"; //这里写的必须是变量名 类似于二级指针
  div {
    background-color: @@color2
  }
  @news: "this is news"
  @message: "news"
  div {
    content: @@message
  }
```

## 定义一个URL

```less
  @imgURL: '../img';
  body {
    background: url(@imgURL);
    //background: url("@imgURL");
    //加不加引号不影响最终结果
  }
```

## 定义引入声明标准写法

```less
  @themes: "./../lessStudy";  //定义一个根路径变量
  @import "@themes/demo.css";
```

## 可变插值

- @{}可以引用一个变量使其插入到样式，也可以插入类名

```less
  @my-selector: banner;
  @widthPro: width;
  .@{my-selector} {
    @{widthPro}: 10px;
  }
```

## 转义~

- 转义允许将任何字符串作为属性值或变量值  
**除了插值外，里面的任何字符将原样输出**

```less
  .box{
    content: ~"/*something just like this*/"; 
    width: ~"10px"; // width: 10px;
    height: ~"20px";
  }
```

## 作用域

- 在css属性集中使用的变量总是在当前作用域中先去查找数据，如果没有找到，则会去他的上一级寻找，直到找到为止

```less
  @var: red;
  #page {
    @var: white;
    #header {
      @var: blue;
      color: @var;
      @var: yellow;
    }
    color: @var;
  }
```

