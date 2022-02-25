---
title: TS_study
date: 2021-12-31 17:27:44
tags:
---
## ts的安装与使用

- ts的安装及使用
- 1.cnpm i -g typescript
- 2.在文件夹里cmd 然后tsc --init，创建一个tsconfig.json,在此文件里将"outDir": "./"更改为"outDir": "./js"
- 3.在新建-运行任务-typescript-监视，然后vscode就会自动将.ts文件翻译成.js文件

## ts数据的类型

- 定义数组的方式

```js
var str:string = "你好 ts"
// 第一种
  let arr1:number[] = [1,2,3]
  console.log(arr1)     //[1,2,3]
// 第二种
  let arr2:Array<number> = [1,2,3]
  console.log(arr2)     //1,2,3
// 第三种
  let arr3:any[]=[1,"ts",true]
  console.log(arr3)     //[1,"ts",true]
//元组类型 数组的一种（tuple）
  let arr4:[string,number,boolean] = ["ts",123,true]
  console.log(arr4)     //["ts",123,true]
```

- 枚举类型

```js
  enum flag {
    success = 1,
    err = -1
  }
  let f:flag = flag.err
  console.log(f) // -1
  enum Color1 {
    red,
    blue,
    orange
  }// 若是没有赋值，则默认输出从0开始的索引值
  let c:Color1 = Color1.red
  console.log(c) // 0
  enum Color2 {
    red,
    blue=5,
    orange
  }
  console.log(Color2.red) //0
  console.log(Color2.blue) //5
  console.log(Color2.orange) //6
  ```

- any类型

```js
  let any:any = "你好 ts"
  any = 1
  console.log(any)
  // 任意类型的用法：可以获取节点。
  // let obox:any = document.getElementById("box")
  // obox.style.color = "red"

  //1.5 undefined null 类型  是其他数据类型（never类型 ）的子类型
  let num:number | undefined
  //定义了但未赋值，会是undefined 
  ```

- void 类型   表示方法没有返回值

```js
  function run():void {
    console.log("run")
  }
  function run2():number {
    return 13 //返回值需要是number类型
  }
```

- never类型 never类型的值代表从不会出现的值，这意味着声明never类型的变量只能被never类型赋值

```js
  let never:never
  // never = 123 错误的写法
  // never = (()=>{
  //   throw new Error("err")
  // })() 
  //正确写法  一般不经常用，可以用any代替，或者用返回值的类型代替
```

- ts中定义函数的方法
  
```js
  function getInfo(name:string,age:number):string {
    return `${name}--${age}`
  }
  let res = getInfo("zhangsan",20)
  console.log(res)
  // 可选参数    es5中形参和实参的数量可以不一样，但是ts需要相同，如果不同，需要使用可选参数
  function getInfo1(name:string,age?:number):string { //注意：可选参数必须配置到参数的最后面
    if(age){
      return `${name}--${age}`
    }else{
      return `${name}--年龄保密`
    }
  }
  let res1 = getInfo1("zhangsan")
  console.log(res1)
// 默认参数   es5中不支持默认参数，es6和ts都支持默认参数
  function getInfo2(name:string,age:number=20):string {
    return `${name}--${age}`
  }
  let res2 = getInfo2("zhangsan")
  console.log(res2)
  // 剩余函数  
  function add(...res:number[]):number {
    let sum:number = 0
    for(let i of res){
      sum += i
    }
    return sum
  }
  let res3:number=add(1,2,3,4,5)
  console.log(res3)
  //  函数的重载(定义相同名字的函数，参数类型，个数不一样时，ts会通过你的传参来确定你调用哪一个函数)
  //在ts中支持函数的重载，     ------如果在es5中，出现同名的函数，下面的函数将会替换上面的函数
  function getInfo3(name:string):string;
  function getInfo3(age:number):number;
  function getInfo3(str:any):any{
    if(str === "string"){
      return "我的名字是"+str
    }else{
      return "我的年龄是"+str
    }
  }
```

## 类与继承

- es5中的类
  
```js
  function Person(name,age){
    this.name = name
    this.age = age
    this.run = function(){
      console.log(this.name+"在运动")
    }
  }
  //原型链和对象冒充组合继承
  function Web(name,age){
    Person.call(this,name,age) // 这一步很重要，把name，age传参。对象冒充继承 
  }
  Web.prototype = new Person() //原型链继承
  let w = new Web("zhangsan",20)
  w.run()
```

- ts中的类

```js
  class Person{
    name:string
    constructor(n:string){ //当实例化的时候就会触发构造函数
      this.name = n
    }
    run():void{
      console.log(this.name+"在运动")
    }
  }
  let p = new Person("张三")
  p.run
```

## ts接口

- 接口的作用：在面向对象的编程中，接口是一种规范的定义，它定义了行为和动作的规范，在程序设计里，接口起到一种限制和规范的作用。接口定义了某一批所需要遵守的规范，接口不关心这些类的内部状态数据，也不关心这些类里方法的实现细节，它只规定这批类里必须提供的某些方法，提供这些方法的类就可以满足实际需要，ts中的接口类似java，同时还增加了更灵活的接口类型，包括属性，函数，可索引和类等

- 属性接口   对json的约束

  ```js
    function printLabel(labelInfo:{label:string}):void {
      console.log("printLabel")
    }
    printLabel({label:"zhansan"}) //正确的写法
    // printLabel({name:"zhansan"})   错误的写法

    //接口的定义和使用
    interface FullName{
      firstName:string,
      secondName:string
    }
    function printName(name:FullName) {
      console.log(name.firstName+"--"+name.secondName)
    }
    printName({
      firstName:"zhang",
      secondName:"san"
    }) //这种写法只能填入fristName和secondName
    let obj = {
      age:20,
      firstName:"zhang",
      secondName:"san"
    }
    printName(obj) //这种写法包含fristName和secondName就行

    //接口可选属性
    interface FullName1{
      firstName:string,
      secondName?:string //可选可不选
    }
    function getName(name:FullName1):void {
      console.log("getname"+name.firstName)
    }
    getName({firstName:"li"}) //用途：用于网络请求的参数
  ```

  - 函数类型接口    对方法传入的参数和返回值进行约束
  
  ```js
    interface Encrypt{
      (key:string,value:string):string
    }
    var md5:Encrypt = function(key:string,value:string):string {
      return key+value
    }
    md5("name","zhangsan")
  ```

  - 可索引接口：数组，对象的约束（不常用）
  
  ```js
    interface UseArr {
      [index:number]:string //索引值需要是number
    }
    var arr:UseArr = ["111","222"]
    interface UseObj {
      [index:string]:string
    }
  ```

- 类类型接口 和抽象类非常相似
  
  ```js
    interface Animal {
      name:string;
      eat(str:string):void;
    }
    class Dog implements Animal{
      name:string;
      constructor(name:string){
        this.name = name
      }
      eat(){}
    }
    let dog=new Dog("zhang")
    dog.eat()
  ```

- 接口的扩展   接口可以继承接口

```js
  interface Father {
    work(str:string):void
  }
  interface Son extends Father {
    play(str:string):void
  }
  class Me implements Son{
    play(){}
    work(){}
  }
```

## ts泛型

- 泛型：使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据，
    这样用户就可以使用自己的数据来使用组件

- 通俗理解：泛型就是解决 类 接口 方法的复用性，以及对不特定数据的支持
  
```js
  function getData<T>(value:T):T {
    return value;
  }
  //T表示泛型，可以用任何大写字母表示，推荐T，参数，返回值与其保持一致
  getData<number>(123)
  getData<string>("123")
```

- 泛型类：
  
```js
  class MinClass<T> {
    public list:T[]=[];
    add(value:T){
      this.list.push(value)
    }
    min():T{
      var minNum = this.list[0]
      for(let i = 0; i<this.list.length; i++) {
        if(minNum>this.list[i])  minNum=this.list[i]
      }
      return minNum
    }
  }
  let m = new MinClass<number>();
  m.add(1) 
  m.add(2) 
  m.add(3) 
  m.add(4) 
  m.add(5)
  let m1 = new MinClass<string>();
  m1.add("a") 
  m1.add("e") 
  m1.add("d") 
  m1.add("c") 
  m1.add("b")
```

- 泛型接口

```js
  //第一种
  interface Fuc {
    <T>(value:T):T
  }
  let setData:Fuc = function<T>(value:T):T {
    return value
  };
  setData<string>("name");
  setData<number>(123);

  //第二种
  interface Fuc<T> {
    (value:T):T
  }
  function setData<T>(value:T):T {
    return value
  };
   let myData:Fuc<string> = setData;
   myData("name")

  
  class User {
    username:string | undefined;
    passwrod:string | undefined;
  }
  class MysqlDb {
    add(user:User):void {
      console.log(user)
    }
  }
  let u = new User()
  u.username = "zhangsan"
  u.passwrod = "123456"
  let db = new MysqlDb();
  db.add(u)
```

- 操作数据库的泛型类     把类作为参数来约束数据传入的类型

```js
  class MysqlDb<T> {
    add(user:T):void {
      console.log(user)
    }
  }
  class User {
    username:string | undefined;
    passwrod:string | undefined;
  }
  let u = new User()
  u.username = "zhangsan"
  u.passwrod = "123456"
  let db = new MysqlDb<User>(); //可以对传入的数据进行校验
  db.add(u)
```

## 实现一个泛型接口

```js
  interface DBI<T> {
    add(info:T):boolean;
    updata(info:T,id:number):boolean;
    delete(id:number):boolean;
    get(id:number):any[]
  }

  //要实现一个泛型接口，这个类应该也是是一个泛型接口
  class Mysql<T> implements DBI<T>{
    add(info: T): boolean {
      return true
    }
    updata(info: T, id: number): boolean {
      return true
    }
    delete(id: number): boolean {
      return true
    }
    get(id: number): any[] {
      return []
    }
  }
  class User1{
    name:string | undefined;
    pw:string | undefined;
  }
  let u1 = new User1();
  u1.name = "zhangsan"
  u1.pw = "123456"
  let sql = new Mysql<User1>();  //用类约束传入的参数
  sql.add(u1) 
```

## 命名空间

- 命名空间：避免命名冲突

```js
namespace A{
  class A{}
}
namespace B{
  class A{}
```

- 如果想在外部访问内部空间，需要再命名空间内暴露，一个模块可以包含多个命名空间

## 装饰器

- 装饰器：是一种特殊类型的声明，它能够被附加到类声明，方法，属性或参数上，可以修改类的行为。通俗的讲，装饰器就是一个方法，可以注入到类，方法，属性参数上来扩展类，属性，方法，参数的功能。
- 常见的装饰器有：类装饰器，属性装饰器，方法装饰器，参数装饰器
- 装饰器方法：普通装饰器（无法传参），装饰器工厂（可以传参）

- 类装饰器（普通装饰器）：类装饰器在类声明之前被声明（紧靠着类声明）。装饰器应用于类构造函数，可以用来监视，修改或替换类定义

```js
  namespace C{
    function logClass(params:any){
      console.log(params)   //打印出f HttpClient
      params.prototype.run = function (){
        console.log("我是run")
      }
    }
    
    @logClass   // 紧靠着
    class HttpClient{
      constructor(){
    
      }
      getData(){}
    }
  }

  //2，类装饰器（装饰器工厂）（）可以传参
  namespace D{
    function logClass(params:any){
      return function(target:any) {
        console.log(target) // HttpClient
        console.log(params)   //hello
      }
      
    }
    
    @logClass("hello") // 紧靠着
    class HttpClient{
      constructor(){
    
      }
      getData(){}
    }
  }
  /*
    3，类装饰器：类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
    如果类装饰器返回一个值，它会使用
  */ 
  namespace E{
    function logClass(target:any){
      return class extends target{
        url:any = "我是修改后的数据"
        getData(){
          this.url = this.url+"---------" //可以替换类里面的函数

        }
      }
    }
    
    @logClass// 紧靠着
    class HttpClient{
      public url:string | undefined
      constructor(){
        this.url = "我是constructor里的Url"
      }
      getData(){
        console.log(this.url)
      }
      
  }}

  namespace F{
    //类装饰器
    function logClass(params:any){
      return function(target:any) {
        console.log(target) // HttpClient
        console.log(params)   //hello
      }
      
    }
    //属性装饰器
    function logProperty(params:string){
      return function(target:any,attr:any){
        console.log(target);  //类的原型对象
        console.log(attr);
        target[attr] = params
      }
    }
    @logClass("hello") // 紧靠着
    class HttpClient{
      @logProperty("leinao.ai")
      public url:any | undefined
      constructor(){
    
      }
      getData(){
        console.log(this.url);
        
      }
    }
  }
```

- 方法装饰器：他会应用到方法的属性描述符上，可以用来监视，修改或者替换方法定义
- 方法装饰会在运行时传入下面3个参数：  
      1.对于静态成员来说时类的构造函数，对于实例成员时类的原型对象。  
      2.方法的名字。  
      3.成员的属性描述符。  

```js
  namespace G{

    function logMethods(params:any){
      return function(target:any,name:any,desc:any){
        console.log(target);   //类的原型对象
        console.log(name); //方法的名字
        console.log(desc);//方法的描述
        //修改装饰器的方法
        //1.保存当前的方法
        var oMethod = desc.value
        //2.修改方法
        desc.value = function(...args:any[]){
          args = args.map((v)=>{
            return String(v)
          })
          oMethod.apply(this,args) //扩展
        }     
      }
    }
    class HttpClient{
      
      public url:any | undefined
      constructor(){
    
      }
      @logMethods("xxxx")
      getData(...args:any[]): void{
        console.log(this.url);
        
      }
    }
  }
  /*
    方法参数装饰器：参数装饰器表达式会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元素数据
    3个参数：
      1.对于静态成员来说时类的构造函数，对于实例成员时类的原型对象。
      2.方法的名字。
      3.参数在函数参数列表的索引
  */
  namespace H{
    function logParams(params:any){
      return function(target:any,name:any,index:any){}
    }
    class HttpClient{
      getData(@logParams('xx') id:number){}
    }
  }

```

  装饰器执行顺序：
  属性装饰器-->
  方法装饰器（有多个时从后往前）-->
  方法参数参数器（有多个时从后往前）-->
  类装饰器
