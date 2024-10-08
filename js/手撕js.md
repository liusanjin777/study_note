# 手撕js api

## Promise

```js
class myPromise {
    /*定义Promise三种状态*/
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    
    constructor(func) {
        this.state = myPromise.PENDING;
        this.result = null;
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }
    resolve(value) {
        if (this.state === myPromise.PENDING) {
            this.state = myPromise.FULFILLED;
            this.result = value;
        }
    }
    reject(reason) {
        if (this.state === myPromise.PENDING) {
            this.state = myPromise.REJECTED;
            this.result = reason;
        }
    }
    then(onFulfilled, onRejceted) { 
        onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : value => value;
        onRejceted = typeof onRejceted == 'function' ? onRejceted : (reason) => { throw reason };
        if (this.state === myPromise.FULFILLED) {
            onFulfilled(this.result);
        }
        if (this.state === myPromise.REJECTED) {
            onRejceted(this.result);
        }
    }
}
```

### Promise.all

```js
/**
 * @params {*} promises 需要执行的promise数组
 * 功能：Promise.all可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值
 */
function myAll(promises) {
    const arr = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        promises.forEach((item, i) => {
            Promise.resolve(item).then(res => {
                arr[i] = res;
                count ++
                if (count === promises.length) {
                    resolve(arr)
                }
            }).catch(reject) 
        });
    })
}
```

### Promise.race

```js
/**
 * @params {*} promises 需要执行的promise数组
 * 功能：race赛跑的意思，哪个promise执行的快，就返回哪个，无论成功还是失败
 */
function myRace(promises) {
    return new Promise((resolve, reject) => {
        for (const p of promises) {
            Promise.resolve(p).then(resolve, reject)
        }
    })
}
```

## apply、bind、call

### call

```js
/**
 * @params {*} target 需要指向的上下文
 * @params {*} args 需要传的参数
 */
Function.prototype.myCall = function(target, ...args) {
    // target不存在时绑定为window，即全局对象
    target = target || window;
    // 将this绑定给target一个唯一标识的字段
    const key = Symbol();
    target[key] = this 
    // 执行
    const res = target[key](...args)
    // 删除
    delete target[key]
    return res
}
```

### apply

```js
/**
 * @params {*} target 需要指向的上下文
 * @params {*} args 需要传的参数数组
 */
Function.prototype.myCall = function(target, args) {
    target = target || window;
    const key = Symbol();
    target[key] = this
    const res = target[key](...args)
    delete target[key]
    return res
}
```

### bind

```js
/**
 * @params {*} target 需要指向的上下文
 * @params {*} outerParams 需要传的外部参数
 * @params {*} outerParams 需要传的内部参数
 */
Function.prototype.myCall = function(target, ...outerParams) {
    target = target || window;
    const key = Symbol();
    target[key] = this
    return function(...innerParams) {
        const res = target[key](...outerParams, ...innerParams)
        // delete target[key] 没必要删除，防止返回的函数不止调用一次
        return res
    }
}
```

## 深拷贝

- 简易的深拷贝，考虑了数组对象、循环引用。
- 写出一个很牛的深拷贝：<https://juejin.cn/post/6844903929705136141#heading-9>

```js
/**
 * @params {*} target 需要复制的对象
 * @params {*} map map结构
 */
function deepClone(target, map = new Map()) {  //使用Map考虑到了循环计数的情况，可以使用WeakMap解决垃圾回收机制的问题
    if (typeof target === 'object') {
        const cloneTarget = Array.isArray(target) ? [] : {} //数组 or 对象
        if (map.get(target)) {
            return map.get(target)
        }
        map.set(target, cloneTarget)
        for(let key in target) {
            cloneTarget[key] = deepClone(target[key], map)
        }
        return cloneTarget
    } else {
        return target
    }
}
```

## 实现instanceof

- instanceof用法

```js
const a = {}
console.log(a instanceof Object) // true
```

- 实现

```js
/**
 * @params {*} instance 实例
 * @params {*} classFnc 类或者构成函数
 */
funct
function myInstanceof(instance, classFnc) {
  //找到实例的原型 和 构造函数或者类的原型
  let instanceProto = instance.prototype; 
  let classFncProto = classFnc._proto_;
  while(true) {
  // 是否相等，相等返回true
    if (instanceProto === classFncProto) {
      return true
  // 是否找到尽头，找到尽头返回false
    } else if (instanceProto === null) {
      return false
    }
  //原型链向上查找
    instanceProto = instanceProto._proto_
  }
}
/**
 * 可以使用Object.getPrototypeOf()
 * 该方法用来获取某个实例对象的原型
*/
```

## 手写new

```js
/**
 * @params {*} fnc 需要执行的构造函数
 * @params {*} args 需要传入的参数
 */
function myNew(fnc, ...args) {
 // 1.创建一个空对象
  let obj = {}
 // 2. obj的_proto_属性，即[[prototype]]特性指向函数的prototype属性
  obj._proto_ = fnc.prototype
 // 3.函数内部的this指向obj
  const res = fnc.apply(obj, ...args)
 // 4. 函数是否有返回值res，若是有，返回res，否则返回obj
  return res ? res : obj  
}
```

## 数组扁平化

```js
/**
 * @params {*} arr 需要进行扁平话的数组
 */
function myFlat(arr) {
  let newArr = []
  const handleArr = (target) => {
    if (Array.isArray(target)) {
      target.forEach(v => {
        handleArr(v)
      })
    } else {
      newArr.push(target)
    }
  }
  handleArr(arr)
  return newArr
}
```

## 防抖

```js
function debounce(func, delay) {
    let timer = null
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
```

