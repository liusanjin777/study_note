---
title: vue3-watch监听props
date: 2021-12-31 17:11:43
tags:
---

## 使用watch监控props的值

```js
import { defineComponent, watch } from 'vue';
export default defineComponent({
  props: {
    jobId:Number
  },
  setup(){
    // 只有这种方法才生效
    watch(
      () => props.jobId,
      (newValue, oldValue) => {
        console.log(newValue);
        console.log(oldValue);
      },
    );
    //这种方法不生效
    watch(props.jobId, (newValue, oldValue) => {
      console.log(newValue);
      console.log(oldValue);
    },);
  },
})
```
