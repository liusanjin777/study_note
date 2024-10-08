# JavaScript 继承

## 盗用构造函数

为了解决原型继承的引用值实例共享的问题，盗用构造函数应运而生，其基本思路是在子类构造函数调用父类构造函数的方法。

```JavaScript
function Person() {
    this.name = ['zhangsan', 'lisi', 'wanger']
}
function Child() {
    Person.call(this)
}
const p1 = new Child()
const p2 = new Child()
console.log(p1.name); //[ 'zhangsan', 'lisi', 'wanger', 'mazi' ]
console.log(p2.name); //[ 'zhangsan', 'lisi', 'wanger' ]
```

### 优点

- 可以传送参数

```JavaScript
function Person(name) {
    this.name = name
}
function Child(name) {
    Person.call(this, name)
}
const p1 = new Child('zhangsan')
const p2 = new Child('lisi')
console.log(p1.name); // 'zhangsan'
console.log(p2.name); // 'lisi'
```

- 可以解决引用值共享的问题

### 缺点

- 盗用构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：必须在构造函数中定义方法，因此函数不能重用。此外，**子类也不能访问父类原型上定义的方法**，因此所有类型只能使用构造函数模式。由于存在这些问题，盗用构造函数基本上也不能单独使用。

## 组合继承

- 利用原型链和盗用构造函数来进行继承，基本思路是：使用原型链继承原型上的属性和方法，使用盗用构造函数继承实例的属性

```JavaScript
function Person(name) {
    this.name = name;
    this.colors = ['blue', 'red'];
}
Person.prototype.sayName = function() {
    console.log(this.name, 'sayName');
}
function Child(name, age) {
    Person.call(this, name);
    this.age = age
}
Child.prototype = new Person();
Child.prototype.sayAge = function () {
    console.log(this.age, 'sayAge');
}
const p1 = new Child('zhangsan', 18);
const p2 = new Child('lisi', 22);
p1.colors.push('black')
console.log(p1.colors); //[ 'blue', 'red', 'black' ]
p1.sayAge(); //18 sayAge
p1.sayName();  //zhangsan sayName
console.log(p2.colors); //[ 'blue', 'red' ]
p2.sayAge(); //22 sayAge
p2.sayName();  //lisi sayName
```

### 组合继承缺点

- 效率问题：**父类构造函数会被执行两次，第一次是子类构造函数原型赋值的时候，第二次是在子类构造函数内部会被执行。**

## 原型式继承

一个函数:

```JavaScript
function object(o) {
    function F() {}
    F.prototype = o
    return new F()
}
```

这个函数接受一个对象，创建一个临时构造函数，在将这个对象赋值给临时构造函数的原型，返回这个构造函数的实例，本质上是进行了一次浅复制。

```JavaScript
function object(o) {
    function F() {}
    F.prototype = o
    return new F()
}
const person = {
    name: 'zhangsan',
    colors: ['blue', 'red']
}
const p1 = object(person)
const p2 = object(person)
p1.colors.push('black')
p1.name = 'lisi'
p2.name = 'wanger'
console.log(p1.name); // 'lisi'
console.log(p2.name); // 'wanger'
console.log(p1.colors); // [ 'blue', 'red', 'black' ]
console.log(p2.colors); // [ 'blue', 'red', 'black' ]
```

- 原型式继承适用下面情况：当你有一个对象，想在他的基础上再创建一个新的对象，你可以把这个对象传给object()，然后再对返回的对象进行修改。

### Object.create()

- Object.create()将原型式继承的概念规范化了。
- 这个方法接收两个参数，第一个参数是要一个基础对象，即例子里面的`person`，第二个参数类似Object.defineProperties()所接受的第二个参数: 每个新增
属性都通过各自的描述符来描述。以这种方式添加的属性会遮蔽原型对象上的同名属性。

```js
const person = {
    name: 'zhangsan',
    colors: ['blue', 'red']
}
const p1 = Object.create(person)
const p2 = Object.create(person)
p1.colors.push('black')
p1.name = 'lisi'
p2.name = 'wanger'
console.log(p1.name); // 'lisi'
console.log(p2.name); // 'wanger'
console.log(p1.colors); // [ 'blue', 'red', 'black' ]
console.log(p2.colors); // [ 'blue', 'red', 'black' ] 

/**-------------------------------------------------- */
const p3 = Object.create(person, {
    name: {
        value: 'mazi'
    }
})
console.log(p3.name); // 'mazi'
```

## 寄生式继承

基本思路是：创建一个实现继承的函数，以某种方式增强这个对象，然后返回这个对象。

```js
function object(o) {
    function F() {}
    F.prototype = o
    return new F()
}
function createAnother(o) {
    let clone = object(o);
    clone.sayAge = function() { //增强对象
        console.log('age');
    }
    return clone;
}
const person = {
    name: 'zhangsan',
    colors: ['blue', 'red']
}
const p1 = createAnother(person)
p1.colors.push('black')
console.log(p1.name); // 'zhangshan'
console.log(p1.colors); //[ 'blue', 'red', 'black' ]
console.log(person.colors); //[ 'blue', 'red', 'black' ]
p1.sayAge(); // 'age'
```

- 寄生式继承同样使用于不在乎类型和构造函数的场景，object()不是必须的，任何返回对象的函数都可以。

## 寄生式组合继承

- 解决了组合继承的效率问题
- 基本思路：不通过父类构造函数给子类原型赋值，而是取得一个父类构造函数得副本。即使用寄生式继承创建一个父类构造函数的副本

寄生式组合继承的基本模式如下所示：

```js
/*
* subType 子类
* superType 父类
*/
function inheritPrototype(subType, superType) {
    let prototype = Object.create(superType.prototype); // 创建副本
    prototype.constructor = subType; // 增强对象
    subType.prototype = prototype; // 赋值对象
}
    
function Person(name) {
    this.name = name
}
Person.prototype.sayName = function() {
    console.log(this.name);
}
function Child(name) {
    Person.call(this, name)
}
inheritPrototype(Child, Person);

const p1 = new Child('lisi')
p1.sayName() // 'lisi 
```

这里只调用了一次 Person 构造函数，避免了 Child.prototype 上不必要也用不到的属性，因此可以说这个例子的效率更高。而且，原型链仍然保持不变，因此 instanceof 操作符和isPrototypeOf()方法正常有效。**寄生式组合继承可以算是引用类型继承的最佳模式。**

## 总结

1. **盗用构造函数**主要是在子函数内部使用call方法来调用父函数的属性和方法，但是无法调用父函数原型上的方法
2. **组合继承**在盗用构造函数继承的方法上增加了将父函数的实例赋值给子函数的原型，这样就可以调用父函数原型的方法，缺点是父函数调用了两次
3. **原型式继承**由公式实现，类似Object.create，传入一个对象，内部新建一个函数，函数的原型指向这个对象，返回对象的实例。
4. **寄生式继承**在原型式继承的方式上先增强返回的实例，在返回实例
5. **寄生式组合继承**最为完美的继承，先履行盗用构造函数的步骤，再创建一个类似寄生式继承的函数

- 创建副本：利用Object.create()创造一个父函数原型的副本
- 增强对象：创造出来的副本的构造器函数指向子函数
- 赋值对象：子函数的原型指向副本

