# web动画

## 一、什么是web动画

**理解3个概念**

- `屏幕刷新率`：设备显示器每秒绘制新图像的次数，单位`Hz`。目前大多数设备为60Hz
- `卡顿`：每帧的预算时间，例如60Hz的显示器为：1s / 60 = 16.6ms。如果浏览器无法在这一帧完成工作，则帧率将下降，可能导致跳帧，内容会在屏幕上抖动。这个现象称为卡帧。
- `跳帧`：假如浏览器动画分别在16ms、32ms、48ms时进行切帧。等到了32ms，浏览器其他任务还未完成，没有执行动画切帧。等到恢复动画切帧时，浏览器到了48ms的动画切帧。浏览器直接从16ms的画面跳转到了48ms处的画面，这发生了跳帧。

**Web 动画本质是元素的外观样式或布局位置随着浏览器的逐帧绘制，以平滑的状态完成变化** 。

## 二、css动画

### Transitions

`transition` 是指从一个状态到另一个状态的变化。比如当鼠标在某个元素上悬停时，我们会修改它的样式，采用 `transition` 可以创建一个平滑的动画效果，通常用于主动触发。

#### 属性

```css
// 简写方式
.transition-test {
    transition: [property] [duration] [delay] [timing-function];
}
// 单独写
.transition-test {
    transition-property: [property];
    transition-duration: [duration];
    transition-delay: [delay];
    transition-timing-function: [timing-function];
}
```

- property 通常是简写形式的第一个属性，规定应用过渡的css属性的名称。例如要修改`background`，这可以在[property]的位置填上`background`。可以使用`all`属性，为所有适用的css过渡的属性创建过渡效果
- duration 表示过渡效果的持续时间，`transition-duration: 3s;`表示该过渡效果为`3s`，即3倍的`1000ms`
- delay 表示过渡效果的延迟时间，即效果开始前的等待时间，单位可以是`s`或者`ms`
- timing-function 时间函数，时间函数有很多可选值，后续会详解

##### Transitions不会触发的属性

- font-family
- 用CSS创建的背景图像（例如渐变效果），background-image图片变化可以使用

#### timing-function 时间函数详解

- `linear`: 表示属性值按照一个固定的速度线性的变化，中间不有突变，不会出现加快或者减慢的状态。

- `ease-in`: 先以较慢得速度变化，然后速度越来越快。

- `ease-out`: 先以较快得速度变化，然后越来越慢。

- `ease-in-out`: 先慢、中间快、结尾慢。

- `cubic-bezier`: 上面讲的时间函数本质上都是贝塞尔曲线，利用`cubic-bezier`我们可以自定义具体的变化曲线，`cubic-bezier` 有4个参数，代表两个控制点的坐标。

  ```css
  transition-timing-function: cubic-bezier(1,-0.49,.13,1.09);
  ```

  可以使用[cubic-bezier.com](http://cubic-bezier.com/)来实时观看贝塞尔曲线和获取坐标。

- `steps`：`steps` 可以将过渡时间分成大小相等的时间时隔来运行。适合做精灵动画。

  ```css
  transition-timing-function: steps(4);
  ```

  `steps`有两个参数，第一个参数代表分几步，第二个参数为`end || start`，`start`表示要过渡的属性值会在开始时就立马变成第一个步进点对应的属性值，并报纸一个步进的时间，而`end`表示要过渡的属性值在开始的时候并不会立马改变，而是保持一个步进时间之后，变成第一个步进点的属性值
  
  ```js
  transition: all 2s steps(10, start);
  transition: all 2s steps(10, end)
  ```

#### 多个Transitions

- 可以给多个元素添加同一个过渡效果

- 可以给一个元素添加不同的过渡效果

  ```css
  transition: background 1s ease-out, border 0.5s linear;
  ```

  

#### JavaScript触发过渡效果

##### 1.添加或者删除class

`transitions`的作用就是在两个状态之间创建平滑的变化效果，可以在两个状态分别用不同的class对应，通过使用js来控制添加喝删除class。从而触发效果

##### 2.修改css属性

```js
document.getElementById('transitions-box').style.transition = 'opacity 1s ease-out';
```

值得注意的是：需要带上浏览器前缀

```js
document.getElementById('transitions-box').style.webkitTransition = 'opacity 1s ease-out';
document.getElementById('transitions-box').style.transition = 'opacity 1s ease-out';
```

### Animation

多个状态之间的变化，

#### 属性

`animation`与`transitions`一样，可以使用简写形式，也可以分开单独指定属性值

- `delay：表示在开始之前动画的等待时间，在定义多个动画的情况下特别有用。如果定义的动画是不断循环的，那么只有第一次循环前才会有等待时间，其余的没有。

- `direction`：从动画开始到结束可以看作是一个有向的变化，`direction`决定了动画开始的方向，`normal`: 0-100, `reverse`: 100-0，`alternate`：动画轮流反复播放，0-100后再100-0；`alternate-reverse`：100-0， 0-100.

- `fill-mode`：默认情况下，动画播放完成后元素返回其正常状态。通过改变`fill-mode`的值，可以定义元素在动画结束或开始前的状态，`forwards`表示动画完成后，元素保持最后一个关键帧的值。`backwards`：表示动画完成后，元素属性变成了第一帧。

- `iteration-count`：动画播放的次数，默认一次，可以指定一个数字，也可以指定`infinite`让其永久循环

- `name`指定动画使用的`keyframes`的名字，例如`name`指定为`foo`，它将使用一组下面这样的关键帧：

  ```css
  @keyframes foo {
      ...
  }
  ```

- `play-state`:  `running`| `paused`，暂停或者恢复动画，默认`running`，可以使用js来控制动画播放状态

- `timing-function`：和`transitions`类似，但是`animation`里作用于关键帧之间

#### keyframes

和0% 100%的写法是等价的

```css
@keyframes foo {
    from {
        ...
    }
    to {
        ...
    }
}
```

有时候我们会在一行内写好几个百分比数值，这类似一个暂停效果，下面的`0%,20%`的意思是，在`0%`的时候，元素的`opacity`的值为0，然后保持这个状态直到`20%`，然受`opacity`的值开始改变，在`100%`的时候到达1

```css
@keyframes foo {
    0%, 20% {
        opacity: 0
    }
    100% {
        opacity: 1
    }
}
```

