# JavaScript字符串的操作方法

## 字符串的拼接与截取

### `concat`

- `concat`方法用于拼接两个字符串，不会影响到原字符串。

```js
let stringA = 'hello'
let stringB = stringA.concat(' world!')
console.log(stringA); // hello
console.log(stringB); // hello world!
```

- `concat`可以同时拼接多个字符

```js
let stringC = stringA.concat(' ','hello', '!')
```

- 更常用的方式是使用加号操作符（+）

### `slice`、`substr` 、`substring`

#### `slice`

- `String.slice(a, b)` a、b为数值参数，a表示从下标a开始（包含a），表示到下标为b结束（不包含b）。
- `String.slice(a)` 表示从下标a开始（包含a），截取到字符串的末尾。

```js
let string = 'hello world'
console.log(string.slice(3));  //'lo world'
console.log(string.slice(3, 7));  //'lo w'
```

### `substr`  `substring`

- slice()、 substr()和 substring()如果是以相同方式被调用的，而且多数情况下返回的值也相同。

#### 三者不同之处

##### 1.当只传一个参数，且为负数时

- `slice`与`substr`会将负数和字符串得长度相加得到得数值在放入方法里面。例如下面得例子 `-3 + 11 = 8`。
- `substring` 会将负参转换为0。

```js
let string = 'hello world'
console.log(string.slice(-3));  //'rld' 相当于slice(8)
console.log(string.substr(-3));  //'rld'
console.log(string.substring(-3));  // '' (empty string)
```

##### 2.当传2个参数，且第二个为负数时

- `slice`会将第二个参数`b`，从字符串末尾开始找到下标为`|b|`的字符，并将`b`转化为该字符从首位开始的坐标。以下例子，`-3`被转化为`7`
- `substr` 会将第二个参数转化为0，即最后会返回一个空的字符串。
- `substring`会将第二个参数转化为0，并且a，b相比较，数值大的在前面。

```js
let string = 'hello world'
console.log(string.slice(3, -3));  //'lo w' 相当于slice(3,7)
console.log(string.substr(3, -3));  //'' (empty string)
console.log(string.substring(3, -3));  // 'hel' 第一步：转化为substring(3, 0) ---- 第二步：转化为substring(0, 3)
```

## 字符串位置方法

### `indexOf`

- 从字符串首位开始进行寻找子字符串，找到返回字符串所在位置下标索引，未找到则返回-1

```js
let string = "hello world";
console.log(string.indexOf("o")); // 4
console.log(string.indexOf("x")); // -1
```

- 可以接收第二个参数，表示从什么位置开始进行搜索(相对首位而言)

```js
let string = "hello world";
console.log(string.indexOf("o", 6)); // 7
console.log(string.indexOf("h", 6)); // -1
```

### `lastIndexOf`

- 从字符串尾部开始进行寻找子字符串，找到返回字符串所在位置下标索引，未找到则返回-1

```js
let string = "hello world";
console.log(string.lastIndexOf("d")); // 10
console.log(string.lastIndexOf("x")); // -1
```

- 可以接收第二个参数，表示从什么位置开始进行搜索(同样相对首部而言)

```js
let string = "hello world";
console.log(string.lastIndexOf("o", 6)); // 5
console.log(string.lastIndexOf("d", 6)); // -1
```

## 字符串包含方法

### `startWith`

- 在索引为0的地方开始检查

```js
let stringValue = "foobarbaz";
console.log(stringValue.startWith('foo')); //true
console.log(stringValue.startWith('bar')); //false
```

- 可接受第2个参数，表示从什么位置开始检查，会舍去该位置之前的字符(包含该位置)

```js
let stringValue = "foobarbaz";
console.log(stringValue.startsWith('foo', 0)); //true
console.log(stringValue.startsWith('bar', 3)); //true
```

### `endWith`

- 在索引为`string.length - substring.length`的地方开始检查

```js
let stringValue = "foobarbaz";
console.log(stringValue.endsWith('baz')); //true
console.log(stringValue.endsWith('bar')); //false
```

- 可接受第2个参数，表示从什么位置当作字符串末尾(不包含该位置)

```js
let stringValue = "foobarbaz";
console.log(stringValue.endsWith('bar', 6)); //true
console.log(stringValues.endsWith('bar', 5)); //false
```

### `includes`

- 判断是否包含子字符串

```js
let stringValue = "foobarbaz";
console.log(stringValue.includes('bar')); //true
console.log(stringValue.includes('qux')); //false
```

- 可接受第2个参数，表示从什么位置开始检查，会舍去该位置之前的字符

## trim()方法

- 用于删除字符串前面和后面的空格

```js
let stringValue = " hello world ";
let trimmedStringValue = stringValue.trim();
console.log(stringValue); // " hello world "
console.log(trimmedStringValue); // "hello world"
```

## repeat()方法

- 用于重复字符串，接受一个参数，表示重复几遍，不会更改字符串本身

```js
let stringValue = "na ";
console.log(stringValue.repeat(16) + "batman");
// na na na na na na na na na na na na na na na na batman
```

## padEnd() 和 padStart() 方法

- 这两个方法用于赋值字符串，接受两个参数`a, b` 如果`a`大于原本字符串的长度，那么复制后的字符在则由`b`补充

```js
let stringValue = "foo";
console.log(stringValue.padEnd(6, '.')); // foo...
console.log(stringValue.padStart(6, '.')); // ...foo
```

- 如果长度小于或等于字符串长度，则会返回原始字符串

```js
let stringValue = "foo";
console.log(stringValue.padEnd(2)); // foo
console.log(stringValue.padStart(2)); // foo
```

## 字符串迭代与解构

- 字符串的原型上暴露了一个@@iterator 方法，表示可以迭代字符串的每个字符

### 手动使用迭代器

```js
let stringValue = 'abcd';
const stringIterator = stringValue[Symbol.iterator()];
console.log(stringIterator.next()); // {value: "a", done: false}
console.log(stringIterator.next()); // {value: "b", done: false}
console.log(stringIterator.next()); // {value: "c", done: false}
console.log(stringIterator.next()); // {value: "d", done: false}
```

### for-of

```js
let stringValue = 'abcd';
for (const iterator of stringValue) {;
    console.log(iterator); // 依次打印a、b、c、d
}
```

### 解构赋值

```JavaScript
let stringValue = 'abcd';
const stringArray = [...stringValue];
console.log(stringArray); // ['a', 'b', 'c', 'd']
```

## 字符串大小写转换

- 总共有4个方法：toLowerCase()、 toLocaleLowerCase()、toUpperCase()和toLocaleUpperCase()。
- toLowerCase()和toUpperCase()方法是原来就有的方法，与 java.lang.String 中的方法同名。
- toLocaleLowerCase()和 toLocaleUpperCase()方法旨在基于特定地区实现。

```js
let stringValue = 'AbcD'
console.log(stringValue.toLowerCase()); // 'abcd'
console.log(stringValue.toUpperCase()); // 'ABCD'
```

## 字符串模式匹配方法

### match()方法

- 与exec方法类似，接受一个正则表达式或者RegExp对象

```js
let text = "cat, bat, sat, fat";
let pattern = /.at/;
// 等价于 pattern.exec(text)
let matches = text.match(pattern);
console.log(matches.index); // 0
console.log(matches[0]); // "cat"
console.log(pattern.lastIndex); // 0
```

- match()方法返回的数组与 RegExp 对象的 exec()方法返回的数组是一样的：第一个元素是与整个模式匹配的字符串，其余元素则是与表达式中的捕获组匹配的字符串（如果有的话）。

### search()方法

- 与exec方法类似，接受一个正则表达式或者RegExp对象。
- 匹配到了返回模式第一个匹配的位置索引，如果没找到则返回-1。

```js
let text = "cat, bat, sat, fat";
let pos = text.search(/at/);
console.log(pos); // 1
```

### 字符串替换-replace()方法

- 这个方法接收两个参数，第一个参数可以是一个 RegExp 对象或一个字符串（这个字符串不会转换为正则表达式），第二个参数可以是一个字符串或一个函数。
- 如果第一个参数是字符串，那么只会替换第一个子字符串。要想替换所有子字符串，第一个参数必须为正则表达式并且 带全局标记

```js
let text = "cat, bat, sat, fat";
const text1 = text.replace('at', 'ond') // 'cond, bat, sat , fat'
const text1 = text.replace('\at\g', 'ond') // 'cond, bond, sond , fond'
```

### 字符串比较方法-localeCmpare

这个方法运行遵循下面3个规则：

- 如果按照字母表顺序，字符串应该排在字符串参数前头，则返回负值。（通常是-1，具体还要看与实际值相关的实现。）
- 如果字符串与字符串参数相等，则返回 0。
- 如果按照字母表顺序，字符串应该排在字符串参数后头，则返回正值。（通常是 1，具体还要看与实际值相关的实现。）

```js
let stringValue = "yellow";
console.log(stringValue.localeCompare("brick")); // 1
console.log(stringValue.localeCompare("yellow")); // 0
console.log(stringValue.localeCompare("zoo")); // -1
```
