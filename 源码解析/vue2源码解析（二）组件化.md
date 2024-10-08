# 组件化

## createComponent 创建组件

在分析`createElement`的实现时，曾和`createComponent`有关联，当传入的节点是一个普通的html的时候，会实例化一个普通的`VNode`节点，否则将通过`createComponent`去创建一个组件`VNode`

来看下`createComponent`的实现

文件地址: `src/core/vdom/create-component.js`

```js
export function createComponent(
  Ctor: typeof Component | Function | ComponentOptions | void,
  data: VNodeData | undefined,
  context: Component,
  children?: Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }
  // 构造子类构造函数
  // 我们在编写一个组件时，通常时抛出一个对象
  // baseCtor指的就是Vue
  const baseCtor = context.$options._base
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor as typeof Component)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (__DEV__) {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  // @ts-expect-error
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor as typeof Component)

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    // @ts-expect-error
    transformModel(Ctor.options, data)
  }

  // extract props
  // @ts-expect-error
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  // @ts-expect-error
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(
      Ctor as typeof Component,
      propsData,
      data,
      context,
      children
    )
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  // @ts-expect-error
  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  // @ts-expect-error
  const name = getComponentName(Ctor.options) || tag
  const vnode = new VNode(
    // @ts-expect-error
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    // @ts-expect-error
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
}
```



 `createComponent`函数逻辑复杂，但是我们只关注3个核心过程：构造子类构造函数、安装组件钩子函数和实例化`vnode`

### 构造子类函数

```js
const baseCtor = context.$options._base
if (isObject(Ctor)) {
Ctor = baseCtor.extend(Ctor as typeof Component)
}
```

我们在编写一个组件时，其实就是创建一个普通对象，通过export 导出

`baseCtor`其实就是Vue，因为有定义如下，文件地址：`src/core/global-api/index.js`

```js
// this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
```

而`$options`方法其实就是将`Vue`的`options`和用户传入的`options`进行合并，会保留Vue的`options`，文件地址如下：`src/core/instance/init.js`

```js
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor as any),
    options || {},
    vm
)
```

再看看`extend`方法，他定义在`src/core/global-api/extend.js`中

```js
 Vue.extend = function (extendOptions: any): typeof Component {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    // 缓存
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name =
      getComponentName(extendOptions) || getComponentName(Super.options)
    if (__DEV__ && name) {
      validateComponentName(name)
    }
    // 创建Super的子类
    const Sub = function VueComponent(this: any, options: any) {
      this._init(options)
    } as unknown as typeof Component
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub['super'] = Super

    // 初始化props
    if (Sub.options.props) {
      initProps(Sub)
    }
    // 初始化计算属性
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
```

`extend`函数的主要作用就是构造一个`Vue`的子类，它使用原型式继承方式把一个纯对象转换一个继承`Vue`构造器`Sub`并赶回，然后对`Sub`这个对象本身扩展了一些属性，如`options`、全局API，再对`props`和计算属性初始化，最后加入缓存，避免对同一个子组件重复构造。当我们去实例化`Sub`的时候，会执行`this._init`逻辑再次走到`Vue`实例的初始化逻辑

```js
 const Sub = function VueComponent(this: any, options: any) {
      this._init(options)
    } as unknown as typeof Component
```

### 安装组件钩子函数

```js
// install component management hooks onto the placeholder node
installComponentHooks(data)
```

```js
const hooksToMerge = Object.keys(componentVNodeHooks)
```

```js

function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    // @ts-expect-error
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}
```

整个安装组件钩子函数的过程，其实就是把`componentVNodeHooks`的钩子函数合并到data.hook中，在VNode执行patch的过程中执行相关的钩子函数

```js
const componentVNodeHooks = {
  init(vnode: VNodeWithData, hydrating: boolean): boolean | void {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ))
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = (vnode.componentInstance = oldVnode.componentInstance)
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy(vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
```

### 实例化VNode

通过`new VNode` 实例化一个`vnode`并返回，需要注意的是和普通元素节点的`vnode`不同，组件的`vnode`是没有`children`的

```js
 const name = getComponentName(Ctor.options) || tag
  const vnode = new VNode(
    // @ts-expect-error
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    // @ts-expect-error
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
```

## patch

之前有介绍过初次渲染时patch的实现，其中涉及到了`createComponent`函数，来看下：

```js
  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    // 对vnode.data进行判断
    // 如果vnode是一个组件VNode，那么条件就会满足
    // 并且将init函数赋值给i去执行init(vnode, false)
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
      if (isDef((i = i.hook)) && isDef((i = i.init))) {
        i(vnode, false /* hydrating */)
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue)
        insert(parentElm, vnode.elm, refElm)
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
  }
```

`init`函数在`creatComponent`中涉及到了，在不考虑`keep-alive`的情况下，其实就是执行了`createComponentInstanceForVnode`来创建`Vue`的实例，并通过`mount`函数挂载子组件

```js
init(vnode: VNodeWithData, hydrating: boolean): boolean | void {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ))
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
```

看下`createComponentInstanceForVnode`的实现

```js
export function createComponentInstanceForVnode(
  // we know it's MountedComponentVNode but flow doesn't
  vnode: any,
  // activeInstance in lifecycle state
  parent?: any
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true, // 是否为组件
    _parentVnode: vnode,// 当前激活组件实例
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  // vnode.componentOptions.Ctor对应的就是子组件的构造函数
  // 这里相当于 new Sub(options)
  return new vnode.componentOptions.Ctor(options)
}
```

之前分析过，调用`Sub`构造函数去创建实例时，会执行`_init`方法，其中有这么一段函数

```js
 // 合并配置
if (options && options._isComponent) {
  // 有配置并且vnode为组件
  initInternalComponent(vm, options as any)
} else {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor as any),
    options || {},
    vm
  )
}
```

此时在创建组件时，会执行`initInternalComponent`这个函数，其实也是个合并配置的过程

```js
export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create((vm.constructor as any).options))
  // 之前通过createComponentInstanceForVnode 传入的参数合并到内部的配置里
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions!
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

再来看下`_init`函数最后执行的语句，

```js
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

组件初始化的时候是不传el的，所以由在`creatComponent`函数中`init`接管`mount`

```js
// 客户端中选相当于
// child.$mount(undefined, false)
child.$mount(hydrating ? vnode.elm : undefined, hydrating)
```

之前了解过，这个方法先是调用`mountComponent`，在`Watcher`的回调函数中会调用`_render`函数来创建`vnode`

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  // _parentVnode是父虚拟节点
  const { render, _parentVnode } = vm.$options

  
  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    // ...
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

再执行`_update`函数来更新`DOM`

```js

Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    // vnode为_render函数返回的虚拟节点
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

`_update`过程中有几个关键的代码，首先是`vm._vnode = node`的逻辑，这个vnode是`vm._render()`返回的组件渲染，`vm._vnode`是`vm.$vnode`的父组件

```js
// 保持当前上下文的 Vue 实例
export let activeInstance: any = null
export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}
```

`Vue`整个初始化是一个深度遍历的过程，在实例化子组件的时候，我们需要知道当前上下文的`Vue`实例是什么，并且把它作为子组件的父`Vue`实例。之前在对子组件的实例化过程中，会调用`initInternalComponent(vm, options)`方法，把`parent`存储在`vm.$options中`，在`$mount`之前会调用`initLifecycle(vm)`方法：

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  // ...
}
```

可以看到`vm.$parent`就是用来保存当前vm的父实例，并且把vm推当父实例的$children中。

在vm._update的过程中，prevActiveInstance也就是当前vm的父实例，当一个vm实例完成它的所以子树的patch或者update过程后，activeInstance就会回到它的父实例，这样就保证了createComponentInstanceForVnode整个深度遍历的过程中，我们在实例化子组件的时候能传入当前子组件的父vue实例，

