# 流动特性和BFC

## 流动特性

- 块状元素，在默认情况下（flex、浮动等除外），水平方向会撑满父元素

- 在添加margin，padding,border后，实际content区域自动变化

## BFC

### 何为BFC

- Block Formatting Context：格式化上下文，是web页面中，盒模型布局的css渲染模式，是指一个独立的渲染区域或者容器

### BFC触发条件

- 浮动：float的值不是none
- overflow：hidden、auto、scroll
- 绝对定位：position
- display：inline-block、table-cell、table-caption

### BFC的特性

- 内部的box会在垂直方向上挨个放置
- 垂直方向上的距离由margin决定
- bfc的区域不会与float的元素区域重叠
- 计算bfc的高度时，浮动元素也参与计算
- bfc就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。