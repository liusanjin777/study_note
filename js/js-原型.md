# JavaScript 原型

## 理解原型

- 在创建函数的同时，会按照特定的规则创建一个`prototype`属性，这个属性指向该函数的原型对象。
- 原型对象也拥有一个`constructor`属性，**指回**构造函数。例如`Person.prototype`为`Person`构造函数的原型对象，那么`Person.prototype.constructor === Person`
- 在创建实例的同时，实例内部的`[[Prototype]]`会被赋值为构造函数的原型对象，这个特性可以通过属性`__proto__`访问，即：

```JavaScript
function Person() {}
const p1 = new Person()
console.log(p1.__proto__ == Person.prototype); // true
```

- 通过下面代码理解原型：

```js
// 定义函数，创建函数的同时会给该函数创建一个prototype属性，指向该函数的原型对象
function Person() {};

// 原型对象的constructor属性指回构造函数
console.log(Person.prototype.constructor === Person); //true

//正常的原型链都会终止于 Object对象，而 Object的原型对象为null
console.log(Person.prototype.__proto__ === Object.prototype);
console.log(Object.prototype.__proto__ === null); //true

//构造函数、实例、原型对象，是3个完全不同的对象
const p1 = new Person();
console.log(p1 === Person); //false
console.log(p1 === Person.prototype); //false
console.log(Person === Person.prototype); //false

// 实例通过[[Prototype]]特性可以访问到构造函数的原型对象，__proto__属性指向[[Prototype]]特性
// 实例与构造函数没有直接关系，与构造函数的原型对象有直接关系
console.log(p1.__proto__ === Person.prototype); //true
console.log(p1.__proto__.constructor === Person); //true

// 同一个构造函数new出来的实例共享一个原型对象
const p2 = new Person();
console.log(p1.__proto__ === p1.__proto__); //true
```

## 原型层级

- 在通过对象访问属性的时候，会先搜索实例本身，如果实例上有该属性，则直接返回该属性，若是没有，则搜索沿着指针进入原型对象，在原型对象上进行搜索该属性。
- 如果在实例上创建原型上同名的属性，那么访问属性时，实例上的的属性会遮蔽原型的属性，即使把该属性设置为null，除非使用delete关键字删除该属性。

### 判断属性是否在原型上：hasOwnProperty()

hasOwnProperty()方法在该属性是实例上时，返回true，否则返回false

```js
function Person() {}
Person.prototype.name = 'zhansan';
let p1 = new Person();
p1.age = 18

console.log(p1.hasOwnProperty('name')); //false
console.log(p1.hasOwnProperty('age')); //true
// 值得一提的实例或者原型都不存在的属性，hasOwnProperty()方法也会返回false
console.log(p1.hasOwnProperty('sex'));// false
```

### in操作符

in操作符有两种使用方式，单独使用和在for-in中使用

#### 单独使用

- 判断属性是否存在，无论实例还是原型上，若存在返回true，反之返回false

```js
function Person() {}
Person.prototype.name = 'zhansan';
let p1 = new Person();
p1.age = 18

console.log('name' in p1); //true
console.log('age' in p1); //true
console.log('sex' in p1);// false
```

- 使用in操作符和hasOwnProperty()方式准确的判断属性是存在实例上，还是原型上

```js
// 在原型上返回true
function isPrototype(obj, name) {
    return (name in obj) && !obj.hasOwnProperty(name)
}
```

#### for-in

- 使用for-in时，**通过对象可以访问到的属性都会被列举出来，无论时实例还是原型上的属性**
- Object.keys(params)，若params为实例，则返回实例上的属性名数组，若params为原型，则返回原型上的属性名数组。

```js
function Person() {}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
console.log(this.name);
};
let p1 = new Person()


p1.sex = 'man'

for( let key in  p1) {
    console.log(key); //sex、name、age、job、sayName
}
console.log( Object.keys(p1)); // ['sex']
console.log( Object.keys(p1.__proto__)); // [ 'name', 'age', 'job', 'sayName' ]
console.log( Object.keys(Person.prototype)); // [ 'name', 'age', 'job', 'sayName' ]
```

##### 属性枚举属性

- for-in 循环、 Object.keys()、 Object.getOwnPropertyNames()、 Object.getOwnPropertySymbols()以及 Object.assign()在属性枚举顺序方面有很大区别。
- for-in 循环和 Object.keys()的枚举顺序是不确定的，取决于 JavaScript 引擎，可能因浏览器而异。
- Object.getOwnPropertyNames()、 Object.getOwnPropertySymbols()和 Object.assign()的枚举顺序是确定性的。先以升序枚举数值键，然后以插入顺序枚举字符串和符号键。在对象字面量中定义的键以它们逗号分隔的顺序插入。

##### 对象迭代

- Object.values()返回对象值的数组。
- Object.entries()返回键/值对的数组。

## 原型链

原型链的基本思想就是通过原型继承多个引用类型的属性和方法。每个构造函数都有一个原型对象，而原型对象又有一个属性指回构造函数，实例内部有个指针指向原型对象，如果原型对象是另外一个原型对象的实例，原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本构想。

- 属性查找机制会对属性或者方法的查找持续到原型链的末端

### 默认原型

所有的应用类型都继承至Object，所以一般原型链的顶端的实例内部的指针会指向Object.prototype。

### 原型继承关系

- 第一种方式是使用 instanceof 操作符，如果一个实例的原型链中出现过相应的构造函数，则 instanceof 返回 true。
- 第二种方式是使用 isPrototypeOf()方法。原型链中的每个原型都可以调用这个，方法只要原型链中包含这个原型，这个方法就返回 true。

### 子类覆盖父类方法

子类有时候需要覆盖父类的方法，或者增加父类没有的方法。为此，这些方法必须在原型赋值之后再添加到原型上。

```js
function SuperType() {
this.property = true;
}
SuperType.prototype.getSuperValue = function() {
return this.property;
};
function SubType() {
this.subproperty = false;
}
// 继承 SuperType
SubType.prototype = new SuperType();
// 新方法
SubType.prototype.getSubValue = function () {
return this.subproperty;
};
// 覆盖已有的方法
SubType.prototype.getSuperValue = function () {
return false;
};
let instance = new SubType();
console.log(instance.getSuperValue()); // false
```

- 以对象字面量方式创建原型方法会破坏之前的原型链，因为这相当于重写了原型链。

```js
function SuperType() {
this.property = true;
}
SuperType.prototype.getSuperValue = function() {
return this.property;
};
function SubType() {
this.subproperty = false;
}242 第 8 章 对象、类与面向对象编程
// 继承 SuperType
SubType.prototype = new SuperType();
// 通过对象字面量添加新方法，这会导致上一行无效
SubType.prototype = {
getSubValue() {
return this.subproperty;
},
someOtherMethod() {
return false;
}
};
let instance = new SubType();
console.log(instance.getSuperValue()); // 出错！
```

### 原型链的问题

- 原型中包含的引用值会在实例中共享。

``` js
function Fn1() {
    this.name = ['a', 'b', 'c']
}
function Fn2() {}
Fn2.prototype = new Fn1();
const instance1 = new Fn2()
instance1.name.push('d')
const instance2 = new Fn2()
console.log(instance1.name); //[ 'a', 'b', 'c', 'd' ]
console.log(instance1.name); //[ 'a', 'b', 'c', 'd' ]
```
