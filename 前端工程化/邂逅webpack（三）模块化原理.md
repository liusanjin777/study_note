# 模块化原理

## CommonJs模块化实现原理

- 打包后的源码阅读以及解析

```js
 // 整体是一个立即执行函数
(function() {
  var __webpack_modules__ = ({
 "./src/js/bar.js": (function(module) {
    const bar = () => {
      console.log('bar1111');
    }
    module.exports = {
      bar
    }
  })
});
// 缓存对象
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  // 判断缓存中是否有 __webpack_module_cache__[moduleId]
  var cachedModule = __webpack_module_cache__[moduleId];
  // 若有，直接返回
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  // 将 module 和 __webpack_module_cache__[moduleId] 共同指向 { exports: {} } 对象
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  // __webpack_modules__[moduleId] 是一个函数
  // 处理 module
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

var __webpack_exports__ = {};
// !取反操作符相当于自执行匿名函数， 即 (function() {})()
/** 第一步 */
!function() {
  // 调用 __webpack_require__ 函数
  const { bar } = __webpack_require__("./src/js/bar.js")
  console.log(bar)
  }();
})()
```

## esModule模块化实现原理

- 打包后的源码阅读以及解析

```js
"use strict";
var __webpack_modules__ = ({
  "./src/js/foo.js": (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "foo": function() { return foo; }
      });
      const foo = () => {
        console.log('foo');
      }
  })
});
// 同CommonJS原理
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}
// 挂载 __webpack_require__.d = function
!function() {
  __webpack_require__.d = function(exports, definition) {
    for(var key in definition) {
      // 如果definition上存在key的属性且exports不存在key的属性
      // 那么设置为：在exports中读取key的值时，获取的是definition[key]的值
      if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  }; 
}();
// 挂载 __webpack_require__.o = function
!function() {
  // 判断prop是否为obj的属性
  __webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
}();
// 挂载 __webpack_require__.r = function
!function() {
  // 判断是否使用了esModule ，若是使用了，则将 __esModule 赋值为 true
  __webpack_require__.r = function(exports) {
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
}();
  
var __webpack_exports__ = {};
!function() {
  __webpack_require__.r(__webpack_exports__);
  var _js_foo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/js/foo.js");
  console.log(_js_foo_js__WEBPACK_IMPORTED_MODULE_0__.foo)
}();
```

## 混合导入

- esModule 导入 CommonJS导出的函数
- CommonJS 导入 esModule导出的函数

```js

var __webpack_modules__ = ({
  "./src/js/bar.js": (function(module) {
    const bar = () => {
      console.log('bar');
    }
    module.exports = {
      bar
    }
  }),
  "./src/js/foo.js": (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "foo": function() { return  foo; }
    });
    const foo = () => {
      console.log('foo');
    }
 })
});
// 同上，缓存处理，exports处理
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };

  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  return module.exports;
}
  
!function() {
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
      function() { return module['default']; } :
      function() { return module; };
    __webpack_require__.d(getter, { a: getter });
    return getter;
  };
}();
  
!function() {
  __webpack_require__.d = function(exports, definition) {
    for(var key in definition) {
      if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
}();

!function() {
  __webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
}();

!function() {
  __webpack_require__.r = function(exports) {
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
}();

var __webpack_exports__ = {};
/*第一步*/
!function() {
  "use strict";
  // 给使用 esModule的加标记
  __webpack_require__.r(__webpack_exports__);
   var _js_bar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( "./src/js/bar.js");
   var _js_bar_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_bar_js__WEBPACK_IMPORTED_MODULE_0__);
  const { foo } = __webpack_require__( "./src/js/foo.js")
  console.log(foo)
  console.log(_js_bar_js__WEBPACK_IMPORTED_MODULE_0__.bar)
}();
```
