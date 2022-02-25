---
title: css
date: 2021-12-22 19:40:25
tags:
---
# css

## magin

- 如果 margin 属性有四个值：
`margin: 25px 50px 75px 100px;`  
上外边距是 `25px`  
右外边距是 `50px`  
下外边距是 `75px`  
左外边距是 `100px`

## padding

- 如果 padding 属性有四个值：
`padding: 25px 50px 75px 100px;`  
上内边距是 `25px`  
右内边距是 `50px`  
下内边距是 `75px`  
左内边距是 `100px`

## css中的 , > + ~

- 1、群组选择器（','）
  
```css
/* h1 和 h2 有一个被用来作为类名就可以上样式*/
h1,h2 { 
  color: red;
}
```

- 2、后代选择器（空格）
  
```css
/* 表示 h1 下面的所有 span 元素，不管是否以 h1 为直接父元素 */
h1 span {}
```

- 3、子元素选择器（'>'）

```css
/* 表示 h1 下面的所有以 h1 为直接父元素的 span 元素，注意必须以 h1 为直接父元素 */
h1 > span {
 
}
```

- 4、相邻兄弟选择器（'+'）
  
```css
 <ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ul>
  <ol>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ol>
```

- 5、兄弟选择器（'~'）
  
```css
/* A之后的所有B元素，不一定要紧跟在A后面、相同父元素 */
A ~ B{
    
}
```

## sass学习

- & 表示嵌套的上一级
  
```css
ul{
    margin-bottom: 20px;
    & >li {
        margin-bottom: 0;
    }
  }
/* 与下面等价 */
ul{margin-bottom: 20px;}
ul > li {margin-bottom: 0;}
```

## css伪元素

CSS 伪元素用于设置元素指定部分的样式。可用于：

- 设置元素的首字母、首行的样式  
  `::first-line`：用于向文本的首行添加特殊样式  
  `::first-letter`：用于向文本的首字母（中文是首个字，英文是第一个字母）添加样式  
- 在元素的内容之前或之后插入内容  
  `::before` 伪元素可用于在元素内容之前插入一些内容。  
  `::after` 伪元素可用于在元素内容之后插入一些内容。  
- `::selection` 伪元素匹配用户选择的元素部分  
- 注意：
  伪类对象要配合content属性一起使用  
  伪类对象不会出现在DOM中，所以不能通过js来操作，仅仅是在 CSS 渲染层加入  
  伪类对象的特效通常要使用:hover伪类样式来激活

## css中一些想不到的属性

### z-index

- 用与提高图层等级  
  `z-index : 1`会覆盖一起的图层

## 浏览器读取css样式的顺序

- `tbody tr td{}`

浏览器是先查找td,然后去找td tr,然后去找td tr tbody

- `div p{}`和`div>p{}`的区别

`.div p{}` 是会查找页面中所有符合条件的p标签。会耗损许多资源。  

`.div>p{}`是只会查找该div下的所有符合条件的p标签。比上面的这种方法会更好些。  
  