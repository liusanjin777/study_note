# TIPS

## code tips

### JavaScript tips

- 把数组置空时，可以采用`array.length = 0` 而不是 `arrar = []`，避免分配多余的内存。
- `!`可将变量转换成`boolean`类型，`null`、`undefined`、`NaN`以及空字符串('')取反都为`true`，其余都为`false`
- 类数组可以通过扩展运算符转化为数组: `[...arguments]`

## project tips

- 页面布局时，大致的框架都不要定死，合理运用min-height、scroll、flex达到布局的效果。

### loading

- 可以封装框架的loading

```JavaScript
import { Loading } from "element-ui";
let  loading = null
let needLoadingRequestCount = 0
const loadingHelper = {
    startLoading() {
        loading = Loading.service({
            lock: true, 
            text: '努力加载中。。。',
            background: 'rgba(0,0,0,0.7)'
        })
    },
    endLoading() {
        Loading.close()
    },
    showFullScreenLoading() {
        if( needLoadingRequestCount === 0 ) {
            this.startLoading();
        }
        needLoadingRequestCount ++;
    },
    hideFullScreenLoading() {
        if( needLoadingRequestCount <=0 ) return;
        needLoadingRequestCount --;
        if( needLoadingRequestCount === 0 ) {
            this.endLoading()
        }
    }
}
export default loadingHelper
```

- 在其他组件中，就可以：

```JavaScript
import loadingHelper from '@help/loading.js'

/****** other code*/
loadingHelper.startLoading()
/***** other code*/
loadingHelper.endLoading()
```

### 子组件动态渲染（不使用路由）

- 创建components.js文件，在该文件中引入子组件，并导出

```js
  import components1 from "./components1.vue";
  import components2 from "./components2.vue";
  import components3 from "./components3.vue";

  export default {
    components1,
    components2,
    components3,
  }
```

- 在父组件中

```js
<component :is="cpt[activeIndex]"/>
/**other code */
<script>
import childComponents from './components.js'
export default {
    components: childComponents
    data() {
        return {
            cpt: ['components1', 'components2', 'components3']
        }
    }
}
<script/>
```
