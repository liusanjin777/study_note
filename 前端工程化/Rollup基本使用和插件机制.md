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

**对于某些第三方库，不希望`rollup`对其进行打包的时候可以使用`external`对其外部化**

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

每一个方块代表一个`hook`，方块的边框颜色代表同步或者异步，方块的填充颜色代表`Parallel`、`Sequential` 和`First` 类型。

<img src="https://raw.githubusercontent.com/liusanjin777/image/main/202410081440570.png" style="zoom:50%;" />

下面来解析一下这个流程图：

- 首先经过`option` 钩子进行配置的转化，生成一个配置对象。
- 再调用`buildStart`钩子，正式进入构建流程。
- `Rollup`会进入`resolveId`钩子中解析文件的路径，从入口配置（`input`）中开始寻找。
- 随后通过`load`钩子来加载模块的内容，会判断当前内容是否缓存，缓存过进入`shouldTransformCachedModule`进行比较，未缓存直接调用`transform`进行转换
- 紧接着，`rollup`会在`shouldTransformCachedModule`中和缓存的code进行比较，缓存中存在则直接进入下一步，否则进入`transform`针对文件内容进行转换，例如`babel`转译
- 现在`rollup`拿到转换后的模块内容，进行AST分析，得到所有的`import`内容，调用`moduleParsed`钩子
  - 如果是普通的`import`，回到`resolveId`钩子中继续解析，往下执行。
  - 如果是动态的`import`，调用`resolveDynamicImport`钩子去解析路径，解析成功回到load，解析不成功继续回到`resolvedId`钩子
- 直到所有的`import`都解析成功，就会调用`buildEnd`钩子。`Build`工作阶段结束。

**在`rollup`解析路径的时候，即调用`resolveId`钩子和`resolveDynamicImport`钩子的时候，有些路径可能会被标记为`external`（意为排除），此类路径不参与`rollup build` 过程** 

当`rollup`开启`watch`模式时，内部会初始化一个`watcher`对象，文件的内容发生了变化，那么`watcher`会调用`watchChange`重新进行打包，当监视器关闭时，则`Rollup`会调用`closeWatcher`来清除`watcher`对象

#### output工作流程

<img src="https://raw.githubusercontent.com/liusanjin777/image/main/202410081455665.png" style="zoom:50%;" />

- 执行`ouputOptions`钩子，进行输出配置转换。
- 调用`renderStart`钩子，正式开始打包。
- 从入口处开始扫描，针对动态`import`采用`renderDynamicImport`钩子进行自定义动态`import`的内容
- 查看`import.meta`的内容
  - `import.meta.url`: 调用resolveFileUrl钩子来自定义`url`解析逻辑。
  - 其他: 调用`resolveImportMeta`钩子来自定义解析逻辑。
- 并发执行`banner`、`footer`、intro、`outro`钩子（底层采用`Promise.all`来包括这4个钩子），这4个钩子的功能很简单，就是往打包产物的固定位置塞入一些自定义的内容。
- 接着`rollup`会生成所有`chunk`的内容，针对每个`chunk`会调用`renderChunk`方法进行自定义操作，也就说这个时候就可以操作`chunk`了。
- 执行`augmentChunkHash`钩子，来决定是否更改`chunk`的`hash`值，在`watch`模式中会比较使用。如果还有其他需要处理的`chunk`，则继续回到上一步。
- 随后会调用`generateBundle`钩子，这个钩子的入参会包含所有的打包信息，包括`chunk`（打包后的代码）和`asset`（静态资源），你可以在这里删除一些内容，最后这些内容则不会在产物中输出。
- 当`bundle`调用`close`方式时，调用`closeBundle`钩子。

**上面提到过调用rollup.rollup方法返回的bundle对象里有两个方法：`generate`和`write`，两个方法唯一的区别是后者会把代码写入到磁盘中，同时会触发writeBundle钩子，传入所有的打包产物信息。这个方法和 generateBundle的区别在于，执行的时候产物已经输出到磁盘了，而generateBundle是执行后才输出的产物。**

### 常用Rollup插件解析

开发rollup插件，实际上就是在编写hook函数，一个rollup插件是各种hook函数的组合。

#### resolveId

`resolveId`钩子一般用来解析模块路径，以官方插件[`alias`](https://github.com/rollup/plugins/blob/master/packages/alias/src/index.ts)为例，类型为`async` +`First`，即异步优先钩子

- 用法：`rollup.config.js`

  ```js
  import alias from "@rollup/plugin-alias";
  
  const buildOptions = {
    // 入口
    input: ["src/index.js"],
    output: {
      // 产物输出目录
      dir: "dist",
    },
    plugins: [
      // 打包时将import { xx } from 'utils' 解析为 import { xx } from './util'
      alias({
        entries: [{ find: "utils", replacement: "./util" }],
      }),
    ],
  };
  
  export default buildOptions;
  ```

- 源码解析

  ```js
  export default function alias(options) {
    // 获取入口文件
    const entries = getEntries(options);
    // 未获取到入口文件，直接跳过
    if (entries.length === 0) {
      return {
        name: "alias",
        resolveId: () => null,
      };
    }
  
    return {
      name: "alias",
      async buildStart(inputOptions) {
        /* 省略 */
      },
      /**
       *
       * @param {*} importee 当前模块路径  import { foo } from "utils" 中的 utils
       * @param {*} importer 引用当前模块路经 引用b的文件路径，此处为/src/index.js
       * @param {*} resolveOptions 其余参数
       * @returns
       */
      resolveId(importee, importer, resolveOptions) {
        // 是否能匹配到路径
        const matchedEntry = entries.find((entry) =>
          matches(entry.find, importee)
        );
        // 匹配不到直接跳过
        if (!matchedEntry) {
          return null;
        }
        // 将当前模块路径替换, 获取替换后的路径：updatedId
        const updatedId = importee.replace(
          matchedEntry.find,
          matchedEntry.replacement
        );
        // resolverFunction对应选项中的customResolver，自定义的路径解析算法
        if (matchedEntry.resolverFunction) {
          return matchedEntry.resolverFunction.call(
            this,
            updatedId,
            importer,
            resolveOptions
          );
        }
        // 每个插件执行时都会绑定一个上下文对象作为 this
        // this.resolve 会调用其他插件的reolveId钩子函数
        return this.resolve(
          updatedId,
          importer,
          Object.assign({ skipSelf: true }, resolveOptions)
        ).then((resolved) => {
          // 其他插件处理了路径则返回其他插件处理后的结果
          if (resolved) return resolved;
  
          if (!path.isAbsolute(updatedId)) {
            this.warn("error");
          }
          // 否则直接返回替换后的路径 updatedId
          return { id: updatedId };
        });
      },
    };
  }
  
  ```

  resolveId钩子函数可以返回`null`、`string`和对象：

  - `null`：会默认交给下一个插件的 `resolveId` 钩子处理。
  - `string`：停止后续插件的处理，这里为了让后续插件也能处理，使用了`this.resolve`函数来调用其他插件的`resolveId`钩子函数。
  - 对象：停止后续插件的处理，包含了[更多信息](https://rollupjs.org/plugin-development/#resolveid)：解析后的路径、是否被排除（`external`）,是否需要`tree-shaking`等等。大部分清况下返回一个`string`就够用了。

#### `load`

load钩子用于加载文件内容，以官方插件[`image`](https://github.com/rollup/plugins/blob/master/packages/image/src/index.js)为例，这个插件主要的用法是将图片导入到文件中。类型为`async` +`First`，即异步优先钩子。

- 源码解析

  ```js
  import { readFileSync } from "fs";
  import { extname } from "path";
  
  import { createFilter } from "@rollup/pluginutils";
  import svgToMiniDataURI from "mini-svg-data-uri";
  
  const defaults = {
    dom: false,
    exclude: null,
    include: null,
  };
  
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  
  const domTemplate = ({ dataUri }) => `
    var img = new Image();
    img.src = "${dataUri}";
    export default img;
  `;
  
  const constTemplate = ({ dataUri }) => `
    var img = "${dataUri}";
    export default img;
  `;
  
  const getDataUri = ({ format, isSvg, mime, source }) =>
    isSvg ? svgToMiniDataURI(source) : `data:${mime};${format},${source}`;
  
  export default function image(opts = {}) {
    const options = Object.assign({}, defaults, opts);
    const filter = createFilter(options.include, options.exclude);
  
    return {
      name: "image",
  	// 文件路径
      load(id) {
        if (!filter(id)) {
          return null;
        }
        // 是否为图片，不是图片的时候跳过，交给下一个插件处理
        const mime = mimeTypes[extname(id)];
        if (!mime) {
          // not an image
          return null;
        }
  
        this.addWatchFile(id);
        // 是否为svg格式
        const isSvg = mime === mimeTypes[".svg"];
        // 编码格式
        const format = isSvg ? "utf-8" : "base64";
        // 获取图片内容，移除所有的换行符、回车符
        const source = readFileSync(id, format).replace(/[\r\n]+/gm, "");
        // 非svg类型生成base64， svg类型生成对应的uri
        const dataUri = getDataUri({ format, isSvg, mime, source });
        const code = options.dom
          ? // 生成dom中可用的代码
            domTemplate({ dataUri })
          : // 将base64设置成一个const变量
            constTemplate({ dataUri });
  	
        return code.trim();
      },
    };
  }
  
  ```

load钩子函数可以返回`null、string`和对象：

- `null`：会默认交给下一个插件的 `resolveId` 钩子处理。
- `string`：停止后续插件的处理，这里为了让后续插件也能处理，使用了`this.resolve`函数来调用其他插件的`resolveId`钩子函数。
- `对象`：停止后续插件的处理，包含了[更多信息](https://rollupjs.org/plugin-development/#load)

#### transform

`transform`钩子函数主要用于对加载后的模块进行代码转换。为`Async` + `Sequential`类型，也就是`异步串行`钩子

- 使用方式：

  ```js
  import replace from "@rollup/plugin-replace";
  
  const buildOptions = {
    // 入口
    input: ["src/index.js"],
    output: {
      // 产物输出目录
      dir: "dist",
    },
    plugins: [
      replace({
        __test__: 1,
      }),
    ],
  };
  
  export default buildOptions;
  
  ```

  

- 源码解析

  ```js
  export default function replace(options = {}) {
    const filter = createFilter(options.include, options.exclude);
    const {
      delimiters = ["\\b", "\\b(?!\\.)"],
      preventAssignment,
      objectGuards,
    } = options;
    const replacements = getReplacements(options);
    if (objectGuards) expandTypeofReplacements(replacements);
    const functionValues = mapToFunctions(replacements);
    const keys = Object.keys(functionValues).sort(longest).map(escape);
    const lookbehind = preventAssignment ? "(?<!\\b(?:const|let|var)\\s*)" : "";
    const lookahead = preventAssignment ? "(?!\\s*=[^=])" : "";
    // 正则匹配target
    const pattern = new RegExp(
      `${lookbehind}${delimiters[0]}(${keys.join("|")})${
        delimiters[1]
      }${lookahead}`,
      "g"
    );
  
    return {
      name: "replace",
  
      transform(code, id) {
        // 去除边界处理，
        return executeReplacement(code, id);
      },
    };
  
    function executeReplacement(code, id) {
      const magicString = new MagicString(code);
      // 判断代码里是否有需要替换的部分，存在的话利用MagicString.overwrite替换掉
      // 返回false的时候跳过，交给下个插件处理
      if (!codeHasReplacements(code, id, magicString)) {
        return null;
      }
      const result = { code: magicString.toString() };
      // sourceMap处理
      if (isSourceMapEnabled()) {
        result.map = magicString.generateMap({ hires: true });
      }
      return result;
    }
    // 判断代码里是否有需要替换的部分，存在的话替换掉
    function codeHasReplacements(code, id, magicString) {
      // 定义是否匹配上
      let result = false;
      // 匹配后的数组
      let match;
  
      // pattern.exec(code) 将会匹配code中是否还有传入的要替换的字符target，不存在返回null，存在返回一个数组
      while ((match = pattern.exec(code))) {
        result = true;
        // code中包含target的起始索引
        const start = match.index;
        // code中包含target的最终索引
        const end = start + match[0].length;
        // 需要替换的值
        const replacement = String(functionValues[match[1]](id));
        // 替换
        magicString.overwrite(start, end, replacement);
      }
      return result;
    }
  
    function isSourceMapEnabled() {
      return options.sourceMap !== false && options.sourcemap !== false;
    }
  }
  ```

  入参对象为模块代码(code)和模块标识(id)，返回一个包含code和map属性对象的对象，也可以返回null值来交给下一个插件处理，

  **transform 钩子返回的值会作为下一个插件transform 钩子中的第一个入参（串行钩子函数逻辑）**

#### generateBundle

generateBundle是异步串行钩子，自定义生成产物，可以在这个钩子里删除一些无用产物或者静态资源，或者自己添加文件。以官方的[`html`](https://github.com/rollup/plugins/blob/master/packages/html/src/index.ts)插件为例

```js
export default function html(opts: RollupHtmlOptions = {}): Plugin {
  // 初始化配置
  return {
    name: 'html',
    async generateBundle(output: NormalizedOutputOptions, bundle: OutputBundle) {
      // 省略一些边界情况的处理
      // 1. 获取打包后的文件
      const files = getFiles(bundle);
      // 2. 组装 HTML，插入相应 meta、link 和 script 标签
      const source = await template({ attributes, bundle, files, meta, publicPath, title});
      // 3. 通过上下文对象的 emitFile 方法，输出 html 文件
      const htmlFile: EmittedAsset = {
        type: 'asset',
        source,
        name: 'Rollup HTML Asset',
        fileName
      };
      this.emitFile(htmlFile);
    }
  }
}
```

