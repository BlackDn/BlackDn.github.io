---
layout: post
title: HarmonyOS：ArkTS 语言基础
subtitle: 简单介绍一下 HarmonyOS 开发语言
date: 2025-03-06
author: BlackDn
header-img: img/21mon1_28.jpg
catalog: true
tags:
  - HarmonyOS
  - ArkTS
---

> "山居于此，待到胭脂用尽时，桃花再开。"


# HarmonyOS：ArkTS 语言基础
## 前言

想起密码了=v=  
笑死，不敢相信上一文章是一年前的  
之前还豪言壮志立flag，说什么半个月一篇、一个月一篇  
现在是连个p都不敢放😭

## ArkTS 语言

因为准备简单学一下 HarmonyOS 开发，所以先简单介绍一下其开发语言 **ArkTS** 。因为是 `js/ts` 语系的所以其实看着不陌生，大概看看就好。

HarmonyOS 采用 **ArkTS** 语言进行开发，也称**方舟语言**   
ArkTS 是 TypeScript 的进一步扩展，在继承TypeScript语法的基础上进行了优化  
比如需要在编译时确定变量的数据类型，成为了**静态类型语言（强类型语言）**，强化了静态检查；禁止在运行时改变对象布局，不允许通过`delete`等操作来修改对象的属性，不支持`any`类型，减小性能开销；强化面向对象编程，取消了原型概念，通过`extends`关键字进行继承；提供`@Entry`，`@Component`等装饰器进行功能支持......

在我看来，ArkTS融合了Java这类强类型语言的静态规范检查，强化了面向对象的思想，装饰器等功能也是在Java中较为常见；同时语法规范和 TypeScript 十分相似，变量/函数的声明和使用语法基本一致。  
因此，如果你之前接触过安卓移动开发（Java/Kotlin），那么你能很快上手ArkTS；如果你之前接触过前段开发（JS/TS），那么你能很快上手ArkTS；如果你之前接触过如 React Native 的跨平台开发框架，那么你能更快上手ArkTS。

接下来我们简单看一下ArkTS的基本语法，一些和 JS/TS 相类似的语法就跳过了

### 数据类型

ArkTS 采用 `let` 和 `const` 关键字来声明变量和常量，取消了 `var` 关键字

- 基本类型：string、number、boolean、null、undefined、bigint
- 引用类型：Interface、Object、Function、Array、Class、Tuple、Enum
- 联合类型：Union 

**元组（Tuple）** 和 **枚举（Enum）** 作为特殊的类型，都属于引用类型    
**联合类型Union** 允许变量的值为多个类型：`let luckyNum: number | string = 7;`   
此外，可以通过 `type` 关键字设置**类型别名 Type Aliases**，作为现有类型的替代名称：

```typescript
type Matrix = number[][];
let arr: Matrix = [[1, 2], [2, 3]];
```

#### 类型安全和类型推断

类型安全就是上面提到的强类型语言，需要在声明时规定其类型，没有规定或者重新赋值新的类型值都会导致报错；
ArkTS支持**自动类型推断**，即声明时会根据初始值自动选择合适的类型，不需要再显示声明。

```typescript
name;  // Error: Use explicit types instead of "any", "unknown"
name: string;  // OK
name: string = 'black'; // OK
name = 'black';  //OK, 类型推断
// 声明之后
name = 42  // Error: 'name' must be of type 'string', but here has type 'number'
```

#### 空安全

这个特性和 TypeScript 类似，在变量声明时若不确定初始值，通常使用联合类型包含null，并设置为空（null）   
如此一来，这个变量则可能为空，但是当引用的时候，空值可能会导致报错：

```typescript
let name: string | null = null;
console.log(name.length.toString()); // Error: Cannot read property length of null
```

上述例子中因为 `null` 类型的对象没有 `length` 属性，因此导致报错  
为了避免这类错误，我们需要在引用前进行**非空校验**，常见的有以下三种空安全机制：

##### 1. if/else 判空

```typescript
if (name != null) {
	console.log(name.length.toString());
}
```

##### 2. 使用空值合并表达式

```typescript
let validName = name ?? 'Default Name';
console.log(validName.length.toString());
```

采用 `A ?? B`的空值合并表达式，若 A 为 `null`，则会返回 B 作为结果。  
因此若 `name` 为 `null`，则会返回 `'Default Name'` 作为结果。

##### 3. 使用 ? 可选链

```typescript
let nameLength = name?.length;
```

如果 name 为空，则会返回 `undefined`

### 语句

#### 条件语句

条件语句也就那样，`if-else`，`switch-case`等都没变化，同时三元运算的条件表达式也照样用。

```typescript
let isValid = Math.random() > 0.5 ? true : false;
```

#### 循环语句

循环也差不多，`for`，`while/do while`照样用，只不过这边用`for-of`代替了`for-each`

```typescript
for (let student of students) {
	console.log(student.name)
}
```


### 函数

函数声明基本和TS一样，这边主要看一下参数列表：

```typescript
function introduce(name: string, gender?: string, age: number = 18, ...hobbies: string[]): void {  
  console.log(`name: ${name}, age: ${age}`)  
  console.log(gender ? `gender: ${gender}` : 'gender is secret')  
  console.log(hobbies.length > 0 ? `hobbies are ${hobbies.join(',')}` : 'No hobbies')  
}
```

参数列表里的参数可分为必选参数、可选参数、默认参数、剩余参数   
**必选参数**是必须有的，调用的时候如果不传会报错；**可选参数**用`?`修饰，可以不传，如果不传的话在函数体内会作为 `undefined`；**默认参数**就是在参数列表里给函数赋一个默认值，如果调用时没有传入值就用这个默认值；**剩余参数**也称**Rest参数**，需要放在参数列表末尾，会将剩余的参数作为一个数组传入。

函数的返回类型也支持自动类型推断，如果可以从函数体内推断出函数返回类型，则可在函数声明中省略标注返回类型。  
对于不需要返回值的函数（比如上面这个例子），可以显式指定为 `void`，或者直接省略。

上述例子中用到了**字符串模板**，用反引号表示，既可以引用一个变量（如`${gender}`），也可以执行一个表达式（如`${hobbies.join(',')}`）

此外，箭头函数/lambda表达式照样用

#### 闭包

简单来说就是为这个函数创建一个对象，这样能够保留这个函数内部作用域的值，避免执行完就被销毁

```typescript
function f(): () => number {
  let count = 0;
  let g = (): number => { count++; return count; };
  return g;
}

let z = f();
z(); // 返回：1
z(); // 返回：2
```


### 类和对象

这部分就比较像 Java 了，`class` 声明类，然后 `new` 一个实例对象。  
类中可以用 `constructor` 关键字来修饰构造方法，可以设置属性、方法，可以用**可见性修饰符**修饰属性并提供配套的 `getter` 和 `setter`，可以用 `static` 声明静态属性（类的所有对象共享一个静态属性）

```typescript
class Person {  
  public name = 'black'  
  private _age = 18  
  
  constructor(name: string, age: number) {  
    this.name = name  
    this._age = age  
  }  
  
  public set setAge(age: number) {  
    this._age = age  
  }  
  public get getAge() {  
    return this._age  
  }  
}
```

可见性修饰符包括 `private`、`protected`、`public`，默认为 `public`。Java 小伙伴会比较熟悉，这就是比较基本的**封装**.  

当然还有抽象类和抽象方法，用 `abstract` 关键字修饰，基本大同小异，就不多说了。要注意抽象方法只能声明在抽象类中。

#### 继承

面向对象的老熟人了，`extends` 关键字表示继承，通过 `super` 调用父类方法

```typescript
class Student extends Person {  
  studentId: string;  
  constructor(name: string, age: number, studentId: string) {  
    super(name, age)  
    this.studentId = studentId  
  }  
}
```

封装和继承有了，当然还有多态，主要体现在方法的重写和重载，这里就不举例了。

### 接口

毕竟“接口是特殊的抽象类类”，ArkTS自然也支持接口。  
用 `interface` 关键字声明接口，其中可以包含属性、可选属性、只读属性（`readonly` 表示）等，也可以声明方法，接口和接口之间也可以继承：

```typescript
interface AreaSize {  
  x: number;  
  y: number;  
  size?: number;  
  readonly address: string;  
}  
  
interface NewAreaSize extends AreaSize {  
  z: number;  
}

interface AreaCalculator {  
  calculateAreaSize(): number;  
}
```

对于只有属性的接口可以直接使用字面量来创建实例；如果接口中有方法，则就需要通过 `implements` 关键字实现接口，并实现接口中的方法

```typescript
let area: AreaSize = {  
  x: 10,  
  y: 10,  
  address: 'center'  
}

class Rectangle implements AreaCalculator {  
  width = 2  
  height = 3  
  calculateAreaSize(): number {  
    return this.width * this.height  
  }  
}
```

### 模块

一个ArkTS文件的作用域是独立的，一个文件就可以是一个模块。如果想使用其他模块的变量或方法等，就需要通过 `import` 导入，当然前提是对方已经通过 `export` 导出了。  
导入时还可以通过 `as` 对导入的对象进行重命名

```typescript
// in Person.ets
export class Person { 
  name: string
  age: number
  
  constructor(name: string, age: number) {  
    this.name = name  
    this.age = age  
  }  
}

export function greeting() {  
  console.log('hello world')  
}

// in Index.ets
import {Person as PersonClass, greeting} from './Person';

const person = new Person('blacl', 18)
greeting()
```

#### 动态导入

在某些情况下，静态导入模块可能会带来性能或功能上的缺陷，比如导入的模块需要异步获取、模块太大导致代码加载时间过长等，这些时候我们可以采用 **动态导入（Dynamic Import）** 的方式

`import()` 方法可以加载模块并返回一个 `promise`，`resolve` 的结果为一个对象，这个对象包含了这个模块中所有 `export` 出的东西

```typescript
import('./Person').then((obj: ESObject) => {  
  obj.greeting()  
}).catch((err: Error) => {  
  console.error("Module dynamic import error: ", err);  
});
```

动态导入支持条件延迟加载，支持部分反射功能，合理使用能提高加载速度。

## 参考

1. [学习ArkTS语言](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/learning-arkts)

