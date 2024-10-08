# Rollup

## Rollup 打包基本概念及使用

Rollup是一款基于ES Module模块规范实现的JavaScript打包工具，他是vite生产环境下的打包工具，同时他的插件机制也被vite兼容

### 快速上手

#### 1. 准备

- 建立一个npm项目`npm init -y`
- 项目根目录新建一个`rollup.config.js`文件
- `package.json`新增命令`"build":"rollup -c" ` （-c 是指使用本地配置文件，即`rollup.config.js`）

#### 2. 打包产物

- 新建`util.js`和`index.js`

  `util.js`文件内容如下

  ```js
  export const foo = (name) => {
    console.log(`foo - ${name}`);
  };
  
  export const bar = (name) => {
    console.log(`bar - ${name}`);
  };
  ```

  `index.js`文件内容如下

  ```js
  import { foo } from "./util";
  foo("rollup");
  ```

- `rollup.config.js`文件内容如下

  ```js
  const buildOptions = {
    // 入口
    input: ["src/index.js"],
    // 出口  可以为数组或者对象
    output: {
      // 产物输出目录
      dir: "dist/esModule",
      // 产物输出格式
      format: "esm",
    },
  };
  
  export default buildOptions;
  ```

- 执行`npm run build`

- 打包后得产物如下

  ```js
  // 代码已经打包到了一起
  const foo = (name) => {
    console.log(`foo - ${name}`);
  };
  
  foo("rollup");
  
  // 自动treeshaking将不需要的函数（bar）去除
  ```

**rollup会在编译阶段分析代码依赖关系，将AST语法树上没有涉及到的模块进行去除。**

### 常用配置解读

#### 1. 多产物配置

通过将`output`修改为数组格式，从而打包根据`dir`生成不同的文件格式

```js
const buildOptions = {
  // 入口
  input: ["src/index.js"],
  // 出口  可以为数组或者对象
  // 配置成数组，数组中每个元素都是一个描述对象
  output: [
    {
      // 产物输出目录
      dir: "dist/esModule",
      // 产物输出格式
      format: "esm",
    },
    {
      // 产物输出目录
      dir: "dist/commonjs",
      // 产物输出格式
      format: "cjs",
    },
  ],
};

export default buildOptions;

```



#### 2. 多入口配置

将`input`数组中增加入口地址。

```js
const buildOptions = {
  // 入口
  input: ["src/index.js", "src/util.js"],
  // 出口  可以为数组或者对象
  // 配置成数组，数组中每个元素都是一个描述对象
  output: [
    {
      // 产物输出目录
      dir: "dist/esModule",
      // 产物输出格式
      format: "esm",
    },
    {
      // 产物输出目录
      dir: "dist/commonjs",
      // 产物输出格式
      format: "cjs",
    },
  ],
};

export default buildOptions;

```

在实际开发中，可能不同的入口文件对应不同的产出格式，这时需要`rollup.config.js`导出一个数组，数组里包含了多个配置项。

```js
const buildESMOptions = {
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist/esModule",
    // 产物输出格式
    format: "esm",
  },
};
const buildCJSOptions = {
  input: ["src/util.js"],
  output: {
    // 产物输出目录
    dir: "dist/commonjs",
    // 产物输出格式
    format: "cjs",
  },
};

export default [buildESMOptions, buildCJSOptions];
```



#### 3. 自定义`output`配置

```js
output: {
    // 产物输出目录
    dir: "dist/output",
    // 以下三个配置项都可以使用这些占位符:
    // 1. [name]: 去除文件后缀后的文件名
    // 2. [hash]: 根据文件名和文件内容生成的 hash 值
    // 3. [format]: 产物模块格式，如 es、cjs
    // 4. [extname]: 产物后缀名(带`.`)
    // 入口模块的输出文件名
    entryFileNames: `[name].js`,
    // 非入口模块(如动态 import)的输出文件名
    chunkFileNames: "chunk-[hash].js",
    // 静态资源文件输出文件名
    assetFileNames: "assets/[name]-[hash][extname]",
    // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
    format: "cjs",
    // 是否生成 sourcemap 文件
    sourcemap: true,
    // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
    // name: "MyBundle",
    // 全局变量声明
    globals: {
      // 项目中可以直接用`$`代替`jquery`
      jquery: "$",
    },
  },
```



#### 4. 依赖 external

对于某些第三方库，不希望`rollup`对其进行打包的时候可以使用`external`对其外部化

```js
{
  external: ['vue', 'loadsh']
}
```



#### 5. 接入插件能力

在`rollup`的日常使用中，会遇到`rollup`本身不支持的场景，比如`注入环境变量`、`配置路径别名`等等。

以`rollup-plugin-visualizer`为例，这个插件的作用是生成一个对打包后的产物体积分析的html。

1. `npm i  rollup-plugin-visualizer`

2. ```js
   import { visualizer } from "rollup-plugin-visualizer";
   ```

3. 在output同级下或者在output里面新增

   ```js
   plugins: [
       // 将 visualizer 插件放到最后
       visualizer(),
   ],
   ```

   需要注意的是`output.plugins`中配置的插件是有一定限制的，只有使用`Output 阶段`相关钩子的插件才能够放到这个配置中

### Javascript API

以上都是经过`rollup -c`去拿配置文件进行打包的，当我们需要基于rollup去定制化打包的时候，通过配置文件就不满足了，这时候我们需要调用`rollup `的`js api`，主要分为`rollup.rollup`和`rollup.watch`两个 API。

#### rollup.rollup 一次性打包

新建`build.js`文件

```js
const rollup = require("rollup");

const inputOptions = {
  input: "./src/index.js",
  external: [],
  plugins: [],
};

const outputOptionsList = [
  {
    // 产物输出目录
    dir: "dist/esModule",
    // 产物输出格式
    format: "esm",
  },
  {
    // 产物输出目录
    dir: "dist/commonjs",
    // 产物输出格式
    format: "cjs",
  },
];

(async function () {
  let bundle;
  let buildFaild = false;
  try {
    // 1.利用rollup.rollup创建一个bundle产物
    bundle = await rollup.rollup(inputOptions);
    // 2.循环调用输出配置列表
    for (let index = 0; index < outputOptionsList.length; index++) {
      const outputOptions = outputOptionsList[index];
      // 根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
      await bundle.generate(outputOptions);
      await bundle.write(outputOptions);
    }
       
  } catch (error) {
    console.log(error);
    buildFaild = true;
  }
   if (bundle) {
     // 最后调用 bundle.close 方法结束打包
     await bundle.close();
   }
})();

```

#### rollup.watch

可以利用`rollup.watch`来完成`watch`模式下的打包，每次源文件变动的时候，都会重新打包

新建`watch.js文件`

```js
const rollup = require("rollup");

const watcher = rollup.watch({
  // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
  input: "./src/index.js",
  output: [
    {
      dir: "dist/es",
      format: "esm",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
  watch: {
    exclude: ["node_modules/**"],
    include: ["src/**"],
  },
});

// 监听watcher各种事件
watcher.on("restart", () => {
  console.log("重新构建...");
});

watcher.on("change", (id) => {
  console.log("发生变动的模块id: ", id);
});

watcher.on("event", (e) => {
  if (e.code === "BUNDLE_END") {
    console.log("打包信息:", e);
  }
});

```

## 深入理解 Rollup 的插件机制

仅仅使用`rollup`内置的打包能力，很难满足项目的复杂性，例如`路径别名`、`代码压缩`等，因此，`rollup`设计出一套完整的插件机制，讲自身的能力和插件的能力分离，利用插件来满足项目的需求。

`rollup`会在打包的过程，会定义一套完整的声明周期，从开始打包到输出，会有标志性的阶段，并在对应的阶段执行对应的钩子函数（`hooks`）。

### rollup整体构建

执行rollup打包命令后，会经历两个大阶段`Build`和`Output`，cli内部简化逻辑如下

```js
// build阶段
const bundle = await rollup.rollup(inputOptions)

// output阶段
await Promise.all(outputOptions.map(bundle.write))

// 结束
await bundle.colse()
```

看下执行`build`过程阶段的函数会打印出什么信息

```js
const rollup = require("rollup");

const util = require("util");

const build = async () => {
  const boundle = await rollup.rollup({
    input: ["./src/index.js"],
  });
  console.log(
    util.inspect(boundle, { showHidden: false, depth: null, colors: true })
  );
};

build();
```

执行node命令，可以看到控制台打印下面的内容

```txt
{
  cache: {
    modules: [
      {
        ast: 'AST 节点信息，具体内容省略',
        code: 'export const a = 1;',
        dependencies: [],
        id: '/Users/code/rollup-demo/src/data.js',
        // 其它属性省略
      },
      {
        ast: 'AST 节点信息，具体内容省略',
        code: "import { a } from './data';\n\nconsole.log(a);",
        dependencies: [
          '/Users/code/rollup-demo/src/data.js'
        ],
        id: '/Users/code/rollup-demo/src/index.js',
        // 其它属性省略
      }
    ],
    plugins: {}
  },
  closed: false,
  // 挂载后续阶段会执行的方法
  close: [AsyncFunction: close],
  generate: [AsyncFunction: generate],
  write: [AsyncFunction: write]
}
```

由此可见，当执行`rollup.rollup`函数后，并不会将内容打包，而是在`bundle`中存储各个模块的内容和依赖关系，并暴露出`write`和`generate`方法。（`write`会将打包内容写入磁盘中，而`generate`不会）

所以，模块打包是发生在`output`的时候，即调用`bundle`的`write`和`generate`方法时，会打包内容。

```js
const rollup = require("rollup");

const build = async () => {
  const bundle = await rollup.rollup({
    input: ["./src/index.js"],
  });
  const res = await bundle.generate({
    format: "es",
  });

  console.log(res);
};

build();

```

执行命令，打包后的内容如下：

```powershell
{
  output: [
    {
      exports: [],
      facadeModuleId: 'D:\\studysapce\\Rollup-study\\src\\index.js',
      isDynamicEntry: false,
      isEntry: true,
      isImplicitEntry: false,
      moduleIds: [Array],
      name: 'index',
      type: 'chunk',
      dynamicImports: [],
      fileName: 'index.js',
      implicitlyLoadedBefore: [],
      importedBindings: {},
      imports: [],
      modules: [Object: null prototype],
      referencedFiles: [],
      code: 'const foo = (name) => {\r\n' +
        '  console.log(`foo - ${name}`);\r\n' +
        '};\n' +
        '\n' +
        'foo("rollup1");\n',
      map: null,
      preliminaryFileName: 'index.js',
      sourcemapFileName: null
    }
  ]
}
```

由此可见，**对于一次完整的打包过程，`rollup`会在`build`的阶段解析各个模块的内容和依赖关系并暴露出关于`output`的方法，而在`output`阶段会完成打包和输出的过程**

### 拆解插件工作流

#### 不同类型的插件hooks

不同类型的插件hooks分别代表着不同的特点，插件hooks可以根据他们的工作特点及构建流程分为`build hooks`和`output hooks`

- `build hooks`：在这个阶段主要进行模块代码的转换、AST解析及模块之间的依赖关系。这个类型的hooks对于项目的操作粒度主要是单文件的级别，即模块级别。
- `ouput hooks`：主要进行代码的打包，操作粒度为一个`chunk`（指打包后合在一起的产物）

除了根据构建阶段给hooks分类外，也可以根据hooks的不同的执行方式进行分类

- **`Async`和`sync`**：异步和同步钩子函数，同步钩子函数里面不可以有异步逻辑。
- **`Parallel`**：并行的钩子函数，底层逻辑由`Promise.all()`实现，如果有多个插件实现了这个钩子逻辑，一旦函数里面有异步操作，则会并发执行。例如`build`阶段的`buildStart`函数，很多插件会在里面做状态的初始化的操作，但是这些插件并不是依赖的，如果有插件依赖的情况，则不能使用此类型的钩子函数。

- **`Sequential`**：串行的钩子函数，某个插件依赖于其他插件，例如后一个插件需要前一个插件的返回值作为入参。
- **`First`**：如果有多个插件实现了这个`hooks`，那么将会根据先后顺序，依次执行，直到返回一个非`null`或者非`undefined`的值为止，例如`resolveId`，一旦有插件的`resolveId`返回了路径，那么后续的插件的`resolveId`将不再执行。

不同类型的hooks是可以叠加的，`Async`和`sync`可以搭配后面3种的任意一种。

#### build阶段工作流
