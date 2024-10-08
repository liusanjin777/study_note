# 数据驱动

vue的核心思想是数据驱动，所谓数据驱动，指视图由数据驱动生成，我们对视图的修改，不会直接操作DOM，而是通过修改数据。大大简化了代码的复杂度，只关心数据的修改会让代码逻辑变的清晰，因为DOM变成了数据的映射。

## new Vue 发生了什么

文件地址：`src/core/instance/index.js`

```js
// 创建Vue构造函数，并且init传入的组件
function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化传入的组件
  this._init(options)
}
```

来看下如何初始化组件的 

文件地址：`src/core/instance/init.  js`

```js
let uid = 0

export function initMixin(Vue: typeof Component) {
  // 将_init方法挂载到Vue的原型上
  Vue.prototype._init = function (options?: Record<string, any>) {
    const vm: Component = this
    // 创建唯一标识
    vm._uid = uid++

    let startTag, endTag
    // 开发环境打印开始、结束日志
    if (__DEV__ && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // 一个标志，将其标记为 Vue 实例，而无需执行 instanceof
    vm._isVue = true
    // 避免实例被观察到
    vm.__v_skip = true
    // effect scope
    vm._scope = new EffectScope(true /* detached */)
    vm._scope._vm = true
    // 合并配置
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options as any)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor as any),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (__DEV__) {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 初始化生命周期
    initLifecycle(vm)
    // 初始化事件中心
    initEvents(vm)
    // 初始化渲染函数
    initRender(vm)
    callHook(vm, 'beforeCreate', undefined, false /* setContext */)
    // 初始化data、props、computed、watch
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (__DEV__ && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

总的来说，vue初始化就干了几件重要的事情：合并配置、初始化生命周期、初始化事件中心、初始化渲染、初始化data、props、computed、watch等

## vue实例挂载的实现

vue中我们是通过`$mount`实例方法去挂载vm的，接下来我们抛开webpack，在纯前端浏览器环境中去分析`$mount`的工作原理

文件地址：`src/platform/web/runtime-with-compiler.js`

```js
// 缓存mount
const mount = Vue.prototype.$mount
/**
 * @param el: 表示挂载的元素，可以是DOM对象，可以是字符串（内部通过query方法转化为DOM对象）
 * @param hydrating: 服务端渲染需要的参数
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 将el转化为DOM对象
  el = el && query(el)

  // 如果节点是body或者html，抛出错误
  if (el === document.body || el === document.documentElement) {
    __DEV__ &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }

  const options = this.$options
  // 解析模板并转化为render方法
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (__DEV__ && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (__DEV__) {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 模板被赋值为el的innerHTML
      template = getOuterHTML(el as Element)
    }
    if (template) {
      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: __DEV__,
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // 会去调用src/platform/web/runtime/index.js的
  return mount.call(this, el, hydrating)
}
```

值得注意的是，无论我们编写的.vue文件、或者el & template属性，在vue中都会编译成render函数

在最后的return中，会去调用缓存的mount方法，也就是原先的$mount

文件地址：`src/platform/web/runtime/index.js`

```js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

来看下mountComponent的实现

文件地址：`src/core/instance/lifecycle.js`

```js
export function mountComponent(
  vm: Component,
  el: Element | null | undefined,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    // @ts-expect-error invalid type
    vm.$options.render = createEmptyVNode
    if (__DEV__) {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el ||
        el
      ) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (__DEV__ && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  const watcherOptions: WatcherOptions = {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }

  if (__DEV__) {
    watcherOptions.onTrack = e => callHook(vm, 'renderTracked', [e])
    watcherOptions.onTrigger = e => callHook(vm, 'renderTriggered', [e])
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    watcherOptions,
    true /* isRenderWatcher */
  )
  hydrating = false

  // flush buffer for flush: "pre" watchers queued in setup()
  const preWatchers = vm._preWatchers
  if (preWatchers) {
    for (let i = 0; i < preWatchers.length; i++) {
      preWatchers[i].run()
    }
  }

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

这个函数的核心思想是先实例化一个渲染`Watcher`，在它的回调函数中调用`updateComponent`方法，这个方法会调用`_render`函数生成`vnode`，最后调用`vm._update`更新DOM

## render

Vue 的 `_render` 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。

文件地址：`src/core/instance/render.js`

```js
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode && vm._isMounted) {
      vm.$scopedSlots = normalizeScopedSlots(
        vm.$parent!,
        _parentVnode.data!.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
      if (vm._slotsProxy) {
        syncSetupSlots(vm._slotsProxy, vm.$scopedSlots)
      }
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode!
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      setCurrentInstance(vm)
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e: any) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (__DEV__ && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          )
        } catch (e: any) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
      setCurrentInstance()
    }
    // if the returned array contains only a single node, allow it
    if (isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (__DEV__ && isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```

这段代码比较关键的是render函数的调用，即`vnode = render.call(vm._renderProxy, vm.$createElement)`，通过`createElement`函数创建出虚拟DOM

## Virtual DOM

查看之前文章

## createElement

文件地址：`src/core/vdom/create-element.js`

```js
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

`createElement`实际上是对`_createElement`函数的封装，他允许传入的参数更加灵活

```js
/**
 * 
 * @param context VNode 的上下文环境
 * @param tag 标签
 * @param data 数据
 * @param children 当前VNode的子节点
 * @param normalizationType 表示子节点规范的类型
 * @returns 
 */
export function _createElement(
  context: Component,
  tag?: string | Component | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data as any).__ob__)) {
    __DEV__ &&
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(data)}``
        + 'Always create fresh vnode data objects in each render!',
        context
      )
    return createEmptyVNode()
  }
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (__DEV__ && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
    warn(
      'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
      context
    )
  }
  // support single function children as default scoped slot
  if (isArray(children) && isFunction(children[0])) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 规范化 children
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (
        __DEV__ &&
        isDef(data) &&
        isDef(data.nativeOn) &&
        data.tag !== 'component'
      ) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      )
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag as any, data, context, children)
  }
  if (isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

流程很多，但是我们关注重点的流程->`childern`的规范化和`VNode`的创建

### `childern`的规范化

```js
/**
 * @description 1. 当子组件包含组件时 - 因为函数组件
  可能返回一个数组而不是单个根。在这种情况下，只需一个简单的
  需要规范化 - 如果任何children是数组，我们将整个展平
  Array.prototype.concat 的事情。保证只有1层深
  因为功能组件已经使它们自己的children标准化了。
 */
// children 简单标准化
export function simpleNormalizeChildren(children: any) {
  for (let i = 0; i < children.length; i++) {
    if (isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

/**
 * 
 * @description 2. 当children包含始终生成嵌套数组的构造时，
  例如<template>、<slot>、v-for 或当children由用户提供时
  带有手写渲染函数/JSX。在这种情况下，完全正常化
  需要满足所有可能类型的children。
 */
// children标准化
export function normalizeChildren(children: any): Array<VNode> | undefined {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : isArray(children)
    ? normalizeArrayChildren(children)
    : undefined
}
```

- `simpleNormalizeChildren`的调用场景是`children`由编译生成，按理说编译生成的`children`已经是vnode了，但是有一个例外，就是`functional component`函数式组件返回的是一个数组而不是一个根节点，所以会通过`concat`方法将数组扁平化

- `normalizeChildren`的调用场景有两种

  1. render函数由用户手写。当children只有一个节点的时候，vue从接口层面允许用户把children写成基础类型来创建单个简单的文本节点，这时会调用`createTextVNode`创建vnode

  2. 当编译v-slot、v-for的时候会产生嵌套数组的情况，会调用normalizeArrayChildren方法

     ```js
     /**
      * 
      * @param children 规范的子节点
      * @param nestedIndex 嵌套的索引值
      */
     function normalizeArrayChildren(
       children: any,
       nestedIndex?: string
     ): Array<VNode> {
       const res: VNode[] = []
       let i, c, lastIndex, last
       // 利用递归，将children规范化
       for (i = 0; i < children.length; i++) {
         c = children[i]
         if (isUndef(c) || typeof c === 'boolean') continue
         lastIndex = res.length - 1
         last = res[lastIndex]
         //  nested
         if (isArray(c)) {
           if (c.length > 0) {
             c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
             // merge adjacent text nodes
             if (isTextNode(c[0]) && isTextNode(last)) {
               res[lastIndex] = createTextVNode(last.text + c[0].text)
               c.shift()
             }
             res.push.apply(res, c)
           }
         } else if (isPrimitive(c)) {
           if (isTextNode(last)) {
             // merge adjacent text nodes
             // this is necessary for SSR hydration because text nodes are
             // essentially merged when rendered to HTML strings
             res[lastIndex] = createTextVNode(last.text + c)
           } else if (c !== '') {
             // convert primitive to vnode
             res.push(createTextVNode(c))
           }
         } else {
           if (isTextNode(c) && isTextNode(last)) {
             // merge adjacent text nodes
             res[lastIndex] = createTextVNode(last.text + c.text)
           } else {
             // default key for nested array children (likely generated by v-for)
             if (
               isTrue(children._isVList) &&
               isDef(c.tag) &&
               isUndef(c.key) &&
               isDef(nestedIndex)
             ) {
               c.key = `__vlist${nestedIndex}_${i}__`
             }
             res.push(c)
           }
         }
       }
       return res
     }
     ```
     
     

### `VNode`的创建

```js
let vnode, ns
  // 判断是否为普通的内置节点，如果是内置节点，将创建一个普通的VNode
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (
        __DEV__ &&
        isDef(data) &&
        isDef(data.nativeOn) &&
        data.tag !== 'component'
      ) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      )
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  // 否则返回一个组件VNode
  } else {
    // direct component options / constructor
    vnode = createComponent(tag as any, data, context, children)
  }
  if (isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
```

## update

update方法回在两个场景下执行：首次渲染、数据更新，这里只讨论首次渲染，首次渲染update的作用就是将vnode转化为真实DOM。

文件地址：`src/core/instance/lifecycle.js`

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    let wrapper: Component | undefined = vm
    while (
      wrapper &&
      wrapper.$vnode &&
      wrapper.$parent &&
      wrapper.$vnode === wrapper.$parent._vnode
    ) {
      wrapper.$parent.$el = wrapper.$el
      wrapper = wrapper.$parent
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

可以看出，update主要就是调用了`vm.__patch__`方法，这个方法在不同的平台实现方式不同，这里讨论浏览器的实现方式

文件地址: `src/platforms/web/runtime/patch.js`

```js
/**
 * @param nodeOps 对 “平台 DOM” 的一些操作方法
 * @param modules 平台的一些模块
 */
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

接下来看看主要实现函数`createPatchFunction`，这个函数利用函数柯里化返回了`patch`函数

文件地址：`src/core/vdom/patch.js`

```js
/**
   * @param oldVnode 对应首次渲染的app.vue
   * @param vnode 对应render函数返回的虚拟节点
   * @param hydrating 服务端渲染
   * @param removeOnly false
   */
  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue: any[] = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      // 首次渲染主要执行步骤
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (__DEV__) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          // 将oldVnode转化为虚拟DOM
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```

在来看下`createElm`函数，非常重要，他的主要作用就是通过虚拟节点创建真实的DOM并插入到它的父节点中。

```js
  function createElm(
    vnode,
    insertedVnodeQueue,
    parentElm?: any,
    refElm?: any,
    nested?: any,
    ownerArray?: any,
    index?: any
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    vnode.isRootInsert = !nested // for transition enter check

    // 创建子组件、首次渲染的场景下为false
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {
      if (__DEV__) {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' +
            tag +
            '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }
      // 创建占位元素
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      setScope(vnode)
      // 创建子元素
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        // 执行所有的create hook
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)

      if (__DEV__ && data && data.pre) {
        creatingElmInVPre--
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }
```

看下`createChildren`函数，他的作用就是遍历子虚拟节点，递归调用`createElm`，值得注意的一点是在遍历的过程中会把`VNode.elm`作为父容器的DOM节点占位符传入

```js
  function createChildren(vnode, children, insertedVnodeQueue) {
    if (isArray(children)) {
      if (__DEV__) {
        checkDuplicateKeys(children)
      }
      for (let i = 0; i < children.length; ++i) {
        createElm(
          children[i],
          insertedVnodeQueue,
          vnode.elm,
          null,
          true,
          children,
          i
        )
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }
```

调用`invokeCreateHooks`函数执行所以的create狗钩子函数并把`vnode`推入到`insertedVnodeQueue`中

```js
 function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
      cbs.create[i](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode)
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
    }
  }
```

最后调用`insert`方法将DOM插入到父节点中，由于是递归调用，所以子元素会优先调用`insert`，所以整个`vnode`树节点的插入顺序是先子后父，来看下`insert`方法

文件路径：`src/core/vdom/patch.js`

```js
 function insert(parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }
```



···



## 总结

`new Vue` --> `init`-->`$mount`-->`complie`-->`render`-->`vnode`-->`patch`-->`DOM`
