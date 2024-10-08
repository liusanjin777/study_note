# css

## 实现水平垂直居中

```html
<div class="parent">
    <div class="child"></div>
</div>
```

- flex布局 ----- 不需要知道子容器的大小

```css
/* 第一种 通用*/
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 亮点 */ 
.parent {
  display: flex;
}
.child {
  margin: auto;
}
```

- 绝对定位

```css
/*第一种  通用 */ 
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/*第二种*/ 
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

- grid布局----实现二维布局，但是当只有一个子元素的时候就是一维布局

```css
.parent {
  display: grid;
}
.child {
  margin: auto;
}
```

## css 如何实现左侧固定 300px，右侧自适应的布局

- felx

```css
/* 利用flex固比模型 */ 
.box {
    display: flex;
}
.left {
    width: 300px;
}
.right {
    flex: 1;
}
```

- grid

```css
.box {
  display: grid;
  grid-template-columns: 300px 1fr;
}
```

- calc 

```css
.box {
    width:;
}
```



## 实现一个loading加载动画

```html
<svg class="loading" viewbox="25 25 50 50">
  <circle cx="50" cy="50" r="25" class="path" fill="none" />
</svg>
```

```css
.loading {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear 0s infinite;
}
.path {
  animation: dash 2s ease-in-out infinite;
  stroke: #00b390;
  stroke-width: 2;
  stroke-dasharray: 90 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
}

@keyframes rotate {
  from {
    tranform: rotate(0deg);
  }
  to {
    tranform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -120px;
  }
}
```

## 使用过css variable么？ 

### 用法

```css
:root {
    --color: #fff;
}
p {
  color: var(--color);
}
```

### 好处

- 减少样式重复定义
- 可在js中查询，可以减少 JavaScript 对 DOM 的介入，制作性能更高的动画
- 配合 content 等通过 CSS 给 JS 传参，得到一些通过 JavaScript 难以获取的参数

## 画一个三角形

```css
.box {
  width: 0;
  border: 100px solid transparent;
  border-bottom: 100px solid rgba(66, 142, 212, 0.4);
}
```

## display: inline 的元素设置 margin 和 padding 会生效吗

### margin

- 上下不生效，左右生效，可以撑开元素

### padding

- 都生效，但是只有左右能撑开元素

