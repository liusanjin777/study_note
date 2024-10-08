# JavaScript 设计模式

## 工厂模式

- 抽象创建特定模式的过程；

```JavaScript
function factory(name, message) {
    const obj = new Object();
    obj.name = name;
    obj.message = message;
    obj.say = function() {
        console.log(`${this.name} say：${this.message}`);
    }
    return obj;
}

const p1 = factory('zhangsan', 'I am pig!');
const p2 = factory('lisi', 'I am lick dog');
console.log(p1.name); //zhangsan
console.log(p2.name); //lisi
p1.say(); //zhangsan say：I am pig!
p2.say(); //lisi say：I am lick dog
```

- 可以解决创建多个类似对象的问题，但没有解决对象标识问题（即新创建的对象是什么类型）。

## 构造函数模式

- 用于创建特定对象的模式

```js
function Person(name, message) {
    this.name = name,
    this.message = message,
    this.say = function() {
        console.log(`${this.name} say：${this.message}`);
    }
}

const p1 = new Person('zhangshan', 'I am a pig!');

console.log(p1.name); //zhangshan
p1.say(); //zhangshan say：I am a pig!
```

### 与工厂函数的区别

- 构造函数一般首字母大写（`Person`）；
- 没有显示的创建对象；
- 将所有的值交给了`this`；
- 没有`return`;

### 原因：new关键字

`new`在执行的时候会有下面几个步骤：

- 创建一个新的对象obj；
- 对象obj的原型指向构造函数的原型属性，即 这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的 `prototype` 属性;
- 构造函数内部的this被赋值为该对象obj，即this指向该对象obj；
- 执行构造函数内部代码；
- 如果构造函数没有返回非空对象，则返回对象obj；

### 问题

- 其定义的方法会在每个实例上都重新创建一遍。

例如上述例子中的say()方法，再创建新实例的时候，say()方法也会被重新创建,可以使用在函数外部定义的方式来解决，但是会导致全局作用域混乱。

```js
function Person(name, message) {
    this.name = name,
    this.message = message,
    this.say = sayName
}
const sayName = function() {
    /*code */
}
```

## 原型模式

每个函数，都会创建一个prototype属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。

```js
function Person() {}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
console.log(this.name);
};
let person1 = new Person();
person1.sayName(); // "Nicholas"
let person2 = new Person();
person2.sayName(); // "Nicholas"
console.log(person1.sayName == person2.sayName); // true
```

### 原型模式语法

```js
function Person() {}
Person.prototype = {
    name: 'zhangssn',
    age: '18'
};
```

#### 语法问题

1.此时Person.prototype.constructor !== Person, 因为上面的写法会让prototype被设置为一个全新的对象

- 解决方法

```js
function Person() {}
Person.prototype = {
    name: 'zhangssn',
    age: '18'
};
Object.defineProperty(Person.prototype, constructor, {
    enumerable: false,
    values: Person,
})
```

2.重写整个原型会切断最初原型与构造函数的联系，但实例引用的仍然是最初的原型。实例只有指向原型的指针，没有指向构造函数的指针

```js
function Person() {}
let friend = new Person();
Person.prototype = {
constructor: Person,
name: "Nicholas",
age: 29,
job: "Software Engineer",
sayName() {
console.log(this.name);
}
};
friend.sayName(); // 错误
```

## 原型模式的问题

- 首先，它弱化了向构造函数传递初始化参数的能力，会导致所有实例默认都取得相同的属性值
- 实例之前是共享原型的，当原型有属性为数组或者对象时，那么修改数组/对象值，会导致其他的也被修改

```js
function Person() {}
Person.prototype.name = ['a', 'b']

let p1 = new Person();
let p2 = new Person();
p1.name.push('c');

console.log(p1.name); //[ 'a', 'b', 'c' ]
console.log(p2.name); //[ 'a', 'b', 'c' ]
console.log(Person.prototype.name); //[ 'a', 'b', 'c' ]
```
