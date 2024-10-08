# vue3 代码组件拆分规范

## 组件定义

1. 组件视图：组件中用来描述视觉效果的部分，即html
2. 组件交互逻辑，如组件生命周期、点击事件等各种绑定的事件
3. 业务逻辑，如登录注册、获取用户信息、获取商品列表等与组件无关的业务抽象

## 如何拆除组件、什么时候拆除组件

### 什么时候拆除组件

需要拆除的组件一般具有的特性：

- 需要复用时（简化代码）
- 具有一定的描述性质（方便后期维护）
- 代码封闭性（外部过多干扰会让代码更加的难以阅读）

站在第三方角度过两天看看自己的代码，是否能比较容易地看懂自己的代码？如果不能就要考虑进行拆分了。如果你非要一个机械的判断标准，某人建议是代码控制在200行内。

### 如何拆除组件

高层级的抽象被称为**粗粒度**，低层级的抽象被称为**细粒度**，不同粗细粒度的抽象可以称它们为不同的**抽象层级**。一个理想的函数内部，一般只会包含同一抽象层级的代码  

我们可以按照当前的结构或者功能、业务，将组件拆分为功能清晰且单一、与外部耦合程度低的组件(即所谓高内聚，低耦合)。如果一个组件里面干了太多事，或者依赖的外部状态太多，那么就不是一个容易维护的组件了。

拆分组件原则：

1. 拆分的组件要保持功能单一。即组件内部代码的代码都只跟这个功能相关；
2. 组件要保持较低的耦合度，不要与组件外部产生过多的交互。如组件内部不要依赖过多的外部变量，父子组件的交互不要搞得太复杂等等。
3. 用组件名准确描述这个组件的功能。就像函数那样，可以让人不用关心组件细节，就大概知道这个组件是干嘛的。如果起名比较困难，考虑下是不是这个组件的功能并不单一。

## 拆分出来的组件放在哪里

为了让相关联的代码聚合到一起，我们可以把页面搞成文件夹的形式，在文件夹内部存放与当前文件相关的组成部分，并将表示页面的组件命名为index放在文件夹下。再在该文件夹下创建components目录，将组成页面的其他组件放在里面。

如果一个页面的某个组成部分很复杂，内部还需要拆分成更细的多个组件，那么就把这个组成部分也做成文件夹，将拆分出的组件放在这个文件夹下。

最后就是组件复用的问题。如果一个组件被多个地方复用，就把它单独提取出来，**放到需要复用它的组件们共同的抽象层级上。** 如下：

1. 如果只是被页面内的组件复用，就放到页面文件夹下
2. 如果只是在当前业务场景下的不同页面复用，就放到当前业务模块的文件夹下。
3. 如果可以在不同业务场景间通用，就放到最顶层的公共文件夹，或者考虑做成组件库。

下面时页面内组件复用的文件目录及解析

```js
homePage // 存放当前页面的文件夹
    |-- components // 存放当前页面组件的文件夹
        |-- componentA // 存放当前页面的组成部分A的文件夹
            |-- index.(vue|tsx) // 组件A
            |-- AChild1.(vue|tsx) // 组件a的组成部分1
            |-- AChild2.(vue|tsx) // 组件a的组成部分2
            |-- ACommon.(vue|tsx) // 只在componentA内部复用的组件
        |-- ComponentB.(vue|tsx) // 当前页面的组成部分B
        |-- Common.(vue|tsx) // 组件A和组件B里复用的组件
    |-- index.(vue|tsx) // 当前页面
```

## 如何使用hooks抽离组件逻辑

### 复杂组件抽离hooks

将组件定义中的业务逻辑和交互逻辑区分开

以一个用户模块为例，该模块具有查看用户信息、修改密码功能

- 首先是业务逻辑抽离

```tsx
// 用于业务逻辑的方法抽离

import { ref } from 'vue'

export const useUserInfoBusiness = () => {
  const userInfo = ref({
    userId: '',
    userName: ''
  })
  // 获取用户信息
  const getUserInfo = (): any => {
    // xxxxx
  }
  // 检查两次输入密码是否一致
  const checkRepeatPassword = (oldPassword, newPassword) => {
    if (oldPassword !== newPassword) {
      return false
    } else {
      return true
    }
  }
  // 改变密码
  const changePassword = () => {}

  return {
    userInfo,
    getUserInfo,
    checkRepeatPassword,
    changePassword
  }
}

```

- 交互逻辑抽离

```ts
// 用于交互逻辑的方法抽离

import { onMounted, reactive } from 'vue'
import { useUserInfoBusiness } from './useUserInfo.business'

export function useUserRegiserInteract() {
  const { userInfo, getUserInfo, checkRepeatPassword, changePassword } = useUserInfoBusiness()
  const formData = reactive({
    oldPassword: '',
    newPassword: ''
  })
  onMounted(() => {
    getUserInfo()
  })
  const errorModalState = reactive({
    visible: false, // 弹窗显示/隐藏
    errorText: '' // 弹窗文案
  })
  // 处理取消事件
  const cancel = () => {}
  // 处理提交事件
  const submit = () => {
    const flag = checkRepeatPassword(formData.oldPassword, formData.newPassword)
    if (flag) {
      changePassword()
    } else {
      errorModalState.visible = true
      errorModalState.errorText = '两次输入的密码不一致，请修改'
    }
  }
  return {
    submit,
    cancel,
    formData,
    userInfo
  }
}

```

- 在.vue文件中

```vue
<template>
  <div>用户名</div>
  <div>{{ userInfo.userName }}</div>
  <div>密码</div>
  <div>{{ formData.oldPassword }}</div>
  <div>确认密码</div>
  <div>{{ formData.newPassword }}</div>
  <button @click="cancel">取消</button>
  <button @click="submit">确认</button>
</template>

<script setup lang="ts">
import { useUserRegiserInteract } from './hooks/useUserInfo.interact'

const { submit, cancel, formData, userInfo } = useUserRegiserInteract()
</script>

<style lang="less" scoped>
.a {
  color: #000;
}
</style>

```

### 简单文件hooks抽离

可以只抽取业务逻辑，将交互逻辑依然放在vue文件中



## 详情链接

https://juejin.cn/post/7123961170188304391?share_token=0126aed0-5bc3-4e96-9c17-9f1c5fdcdd18#heading-1