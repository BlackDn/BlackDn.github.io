---
layout: post
title: HarmonyOS：鸿蒙简介和ArkTS语言基础
subtitle: 鸿蒙系统简介、工程目录结构及ArkTS的基础语法等
date: 2025-03-04
author: BlackDn
header-img: img/21mon1_28.jpg
catalog: true
tags:
  - HarmonyOS
---

> "山居于此，待到胭脂用尽时，桃花再开。"


# HarmonyOS：鸿蒙简介和ArkTS语言基础
## 前言

想起密码了=v=  
笑死，不敢相信上一文章是一年前的  
之前还豪言壮志立flag，说什么半个月一篇、一个月一篇  
现在是连个p都不敢放😭

## HarmonyOS 简介

华为官方的官言官语镇楼：HarmonyOS 是新一代的智能终端操作系统，为不同设备的智能化、互联与协同提供了统一的语言，为用户带来简捷，流畅，连续，安全可靠的全场景交互体验。

在 HarmonyOS 的理念中，当前移动开发的新挑战在于 **不同屏幕和设备类型（大小屏、折叠屏、手表之类的）**、**全新的交互方式（触摸、遥控、语音等）**、**多设备分布式协同（手机、平板、电脑协同工作）**   
因此，HarmonyOS 提出了三大技术理念：
- **一次开发，多端部署**：多设备、多入口、按需分发。为此，HarmonyOS 提供了**多端开发环境**、**多端开发能力**、**多端分发机制**等核心能力
- **可分可合，自由流转**：**可分可合**指的是开发时将应用打包成多个`模块（Module）`，在部署时可以将一个或多个模块自由组合，打包成多个`App Pack`，每个`App Pack`需要单独上架，他们可以作为 **元服务** 供用户使用。**自由流转**可分为**跨端迁移**和**多端协同** ，举个例子，手机和电脑同时使用备忘录应用，两者的操作会被同步，可以协同操作；手机上复制的内容可以在电脑上直接粘贴等等。 
  **元服务**是支撑可分可合，自由流转的轻量化程序实体。
- **统一生态，原生智能**：支持业界主流跨平台开发框架（React Native、Flutter、WEEX、Taro等）。此外 HarmonyOS 还内置了AI能力，如`Core AI API`提供了语言语音、OCR、人脸等识别能力。

一些官方文档如下：
- [HarmonyOS 技术文档](https://developer.huawei.com/consumer/cn/doc/)
- [HarmonyOS API参考](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/syscap-V5?catalogVersion=V5)
- [鸿蒙生态应用开发白皮书](https://developer.huawei.com/consumer/cn/doc/guidebook/harmonyecoapp-guidebook-0000001761818040)

### 应用和元服务

在上面的`可分可合，自由流转` 中，我们提到了**元服务**，它和平时需要下载安装的App不同，是 HarmonyOS 提供的另一种服务形态


| 区别   | 特征                                         | 载体         | API范围     | 经营                                                 |
| ------ | -------------------------------------------- | ------------ | ----------- | ---------------------------------------------------- |
| App    | 手动下载安装、包大小无限制、应用内或市场更新 | 跟随设备     | 全量API     | 自主运营                                             |
| 元服务 | 免安装、包大小有限制、即用即走               | 跟随华为账号 | 元服务API集 | 支付、地图、广告等辅助经营。可用负一屏等系统分发入口 |



## 应用程序框架和应用模型

**应用模型**是一种抽象描述，提供了一种统一的语言和架构来描述程序的各个方面，如组件、任务管理、包管理、进程模型、线程模型等。从模型演进角度分为**FA模型**和**Stage模型**，HarmonyOS 选择 Stage模型 进行长期演进。   
**应用程序框架（Application Framework）** 是应用模型的一种实现方式，是一种编程框架，用来简化应用程序的开发过程。对开发者来说，它提供应用进程管理、应用和组件生命周期调度、系统环境监听等能力，是连接开发者与用户的桥梁。   
他俩的关系有点像方法论和具体实现。

### Stage模型设计

- **为复杂应用设计而生**：不同应用组件间实例共享、基于面向对象的开发模式
- **原生支持组件级的跨端迁移和多端协同**：UIAbility 与 UI分离、UI展示与服务能力合一的 UIAbility 组件
- **支持多设备和多窗口形态**：UIAbility 生命周期定义、组件管理和窗口管理解耦 
- **平衡应用能力与系统管理成本**：严格后台管理、严格进程模型、基于场景的服务机制

### 基于Stage模型的 HarmonyOS 工程目录结构

总的来说，一个HarmonyOS 项目的文件可以分成**ArkTS文件**、**配置文件**和**资源文件**，其大致结构如下：

```
├── AppScope
│   ├── app.json5
│   └── resources/
└── entry
    └── src
        └── main
            ├── ets/
            ├── module.json5
            └── resources/
```

`AppScope`目录存放项目级的全局文件，而`entry`目录则是项目工程主体，其中`ets/`目录存放我们的ArkTS文件，即开发代码。

#### ArkTS源码文件

```
└── ets
    ├── entryability
    │   └── EntryAbility.ts
    └── pages
        └── Index.ets
```

默认情况下，`ets/`包含`entryability/`目录而`pages/`目录  
`entryability/`中的`EntryAbility.ts`是模块的入口`UIAbility`文件，提供了一些生命周期回调供使用；而`pages/`的`Index.ets`则是页面文件，通过各种组件绘制页面。具体内容以后会详细介绍（可能会在新的文章里）。

#### 配置文件

```
├── AppScope
│   └── app.json5
├── entry
│   ├── oh-package.json5
│   └── src
│       └── main
│           └── module.json5
└── oh-package.json5
```

配置文件用于为编译工具（IDE）、操作系统（终端设备）、应用市场等提供信息。  

`AppScope/app.json5` 是应用级配置文件，包含应用唯一标识、版本号、图标名称等信息  

`entry/src/main/module.json5` 是模块级配置文件，包含该模块的基础信息，如模块名称、模块类型、可运行的设备种类（`deviceTypes`）等。此外还包含一些应用组件的配置信息，如入口UIAbility的名称、路径，模块的路由表。系统权限配置（`requestPermissions`）信息也包含其中。

`oh-package.json5` 是依赖管理配置文件，根目录下的是应用级配置，`entry/`目录下的则是模块级配置，其包含了名称、版本号、作者、第三方依赖等信息。

#### 资源文件

```
.
├── AppScope
│   └── resources
│       └── base
│           ├── element
│           └── media
├── entry
    └── src
        ├── main
            ├── ets/
            └── resources
                ├── base
                │   ├── element
                │   ├── media
                │   └── profile
                ├── en_US
                ├── rawfile
                └── zh_CN
```

资源文件也分应用级资源（`AppScope/resources`）和模块级资源（`entry/src/main/resources`）  

- `element/`目录：主要放置颜色、数字、字符串等元素资源
- `media/`目录：主要放置图片、音频、视频等媒体资源
- `profile/`：放置一些自定义配置文件，如页面配置、卡片配置等。DevEco Studio默认会在`profile/`目录下生成一个`main_pages.json`文件，作为该模块的路由配置，在某些特定情况下需要我们手动进行修改。
- `en_US/zh_CN`：中英文目录，包含中英文资源，应用运行时会根据设备语言环境自动匹配对应资源
- `rawfile/`：可以存放各类资源，但它们会被直接打包进应用，不经过编译，也不会被赋予资源文件ID。合理使用能优化应用性能，过度使用会导致安装包过大等弊端。


## ArkTS 语言

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

1. [鸿蒙生态应用开发白皮书](https://developer.huawei.com/consumer/cn/doc/guidebook/harmonyecoapp-guidebook-0000001761818040)
2. [HarmonyOS 技术文档](https://developer.huawei.com/consumer/cn/doc/)，[HarmonyOS API参考](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/syscap-V5?catalogVersion=V5)

