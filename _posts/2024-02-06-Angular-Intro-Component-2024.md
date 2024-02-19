---
layout: post
title: Angular JS 入门指南
subtitle: Angular JS 简介及 Component 使用
date: 2024-02-06
author: BlackDn
header-img: img/21mon1_30.jpg
catalog: true
tags:
  - JavaScript
  - AngularJS
---

> "像亿万星辰奔波漫漫长夜，不诉怨语。"

# Angular JS 入门指南

## 前言

新年新气象，年前赶紧发一篇=v=  
开始学习 **Angular JS** ，开始整一篇基本用法，结果一看光是 **Component** 内容就多到可以喝一壶。其他像是 **Directive 指令** 等其他内容就放在之后的文章里吧  
武汉大雪，银装素裹，怪好看的咧

## Angular JS 入门指南

**Angular JS（简称 Angular）** 是一个由 Google 开源维护的 **JavaScript MVC 框架**，基于 HTML 和 **JavaScript**，不过随着其更新迭代，现在是基于 **TypeScript** ，并引入了一系列 MVVM 架构的思想特性  
Angular JS 的主要特性和优势如下：

- **基于 MVC**：通过 `Model`，`View`，`Controller` 的模式，将**数据层**、**表示层**、**业务逻辑层**拆分为单独的部分，从而以**声明式**的方式构建数据模型（Model）。Angular JS 认为，**声明式的代码在构建 UI 和组件时更加友好，而命令式的代码更擅长展现业务逻辑**。
- **数据绑定（Data Binding）** ：Angular 能够实现 **自动化双向数据绑定**。通过在数据模型（Model）中声明需要绑定的数据后，Angular JS 会自动为我们同步数据。
- **基于组件（Component-Based）**：Angular JS 允许我们构建 **HTML 组件** 并复用，以此将应用划分为可管理、组织良好、职责明确的结构，以提高代码的可维护性和可扩展性。
- **指令（Directive）**：Angular JS 通过指令来**扩展 HTML 语法**。比如在 HTML 标签中加入 `ngIf` / `ngFor` 来实现是否渲染 / 循环渲染元素；支持自定义指令等。
- **测试（Testing）**：Angular JS 支持**单元测试（Unit Test）** 和 **端到端测试（e2e Test）**，能很方便地使用 Google 自家出品的**Karma 测试框架**。
- **Angular CLI**：Angular JS 有一套自己的命令行工具，比如用于编译项目的`ng build`、用于生成组件的`ng generate`、用于执行单元测试的`ng test`等。将一些**代码无关**的工作交给命令行工具，方便开发者专注于代码和构建应用。
- ······

要注意的是，[Angular 中文网](https://www.angularjs.net.cn/)和百度（百度抄的中文网）说**Angular JS**是**MVVM 架构**，而其他大部分博客和维基百科说是**MVC 架构**，那么到底谁对谁错呢？  
事实上，**Angular JS** 是建立在**MVC 架构的基础**上的，但是在其迭代更新的过程中，逐渐融入了一些**MVVM 架构的概念**，比如**双向数据绑定**、比如“通过指令（Directives）扩展 HTML”类似于**视图模型（ViewModel）**。  
所以严格来说，**AngularJS** 在设计上结合了 MVC 和 MVVM 的思想，但其基础是建立在 MVC 架构上的。

简单来说，**Angular JS**的一系列特性和优势使其成为一个功能强大，易于构建、开发、测试、更新的开发框架

## 组件 Components

因为 Angular JS 是 **基于组件（Component-Based）** 的，因此我们就先接触一下组件及其相关功能/特性的使用

**Angular JS** 中的组件通常以  `component`  作为后缀，如  `my-name.component.ts` 。通常一个组件包含以下几个文件：

- `my-name.component.ts` ：当前组件的数据模型，相当于 MVC 中的 Model。组件的数据、行为、方法都在这里定义，同时声明了组件的**HTML 样式**和**css 样式**。
- `my-name.component.html` ：当前组件的 HTML 模板文件，若 HTML 以代码形式声明则可以不用。
- `my-name.component.css` ：当前组件的 css 样式文件，若 css 样式以代码形式声明则可以不用。
- `my-name.component.spec.css` ：测试文件

安装**Angular CLI**后，使用命令`ng generate component my-name`，会自动生成上述四个文件。

我们通过 `@Component()` 来标识一个组件，称之为**装饰器 Decorator**。  
在**装饰器**中，通常会指定以下几个内容：

- `selector`：用于表示当前组件的**选择器**，以便在 **HTML 模板** 中进行引用，可以理解为当前组件的唯一名字标识。
- `template` / `templateUrl`：当前组件的 **HTML 模板**。`template`是内联**HTML 代码**，`templateUrl` 则指向一个**HTML 文件**
- `styles` / `styleUrl` / `styleUrls`：当前组件的样式。和 `template` 类似， `styles` 是内联 css 语句，`styleUrl` 和 `styleUrls`则指向对应的 css 文件，区别在于单个还是多个文件

此外，还会定义一个 **TypeScript 类** 将当前组件导出，在其中定义组件的属性、方法等。一个组件的大致样子就是这样：

```typescript
// hello-world.component.ts
@Component({
  selector: "hello-world",
  templateUrl: "./hello-world.component.html",
  styleUrl: "./hello-world.component.css",
})
export class HelloWorld {
  /* Define Component behavior */
}
```

如果想要在其他 HTML 中使用该组件，就可以用 `selector` 所定义的标签，即`<hello-world></hello-world>`

### 属性和方法

组件的属性和方法可以直接在类中声明定义：

```typescript
// hello-world.component.ts
@Component({ ... })
export class HelloWorld {
  title = '';
  isComplete = false;

  updateTitle(newTitle: string) {
    this.taskTitle = newTitle;
  }

  complete() {
    this.isComplete = true;
  }
}
```

定义完的属性变量可以在模板中引用，而方法也可以在其中绑定给按钮啥的组件

### 模板 Templates

每个组件都有一个 **HTML 模板** ，可以是 `template` 声明的 **Typescript 的內联模版**（用 ` `` ` 包裹的 HTML 代码），也可以是`templateUrl`  指向的 **html 文件** ，实际开发中后者居多。  
不过为了让示例代码更加简洁，下面的例子更多采用**內联模版**展示。

#### 插值

在模板中，使用双大括号`{% raw %}{{}}{% endraw %}`来传递一些动态变量或内容，称之为**插值（Interpolation）**

```typescript
@Component({
  template: ` <p>Title: {{ title }}</p> `,
})
export class DemoComponent {
  title = "data to show";
}
```

当插值内容发生变化时，**Angular** 会自动更新 DOM 来刷新组件。  
此外，插值内容也可以是表达式，`Angular` 会对其进行运算，比如  
 `{% raw %}<p>Title: {{ 1 + 1 }}</p>{% endraw %}`  
 会显示 `Title: 2`

如果想要将其作为文本而非表达式，则需要添加 `ngNonBindable`标识：  
`{% raw %}<p ngNonBindable>Title: {{ 1 + 1 }}</p>{% endraw %}`  
会显示  
 `{% raw %}Title: {{ 1 + 1 }}{% endraw %}`

`ngNonBindable`实际上是一个**指令**，关于指令的更多内容会在以后提到。

#### 绑定属性和方法

在模板中我们用方括号`[]`传入动态属性，以实现数据绑定，即**属性绑定**。  
这让 **Angular** 以 **Javascript** 来解释传入的内容，而非单纯的字符串，比如之前`hello-world`组件的示例：

```javascript
  <hello-world
    [title]="myTitle"
  ></app-product-alerts>
```

我们给组件的`[title]`属性传入了`"myTitle"`，虽然用了双引号包裹，但实际上这个`myTitle` 是外部组件的一个**变量**

同理，我们用小括号`()`指定监听事件，比如我们想为 `button` 组件添加点击事件：

```html
<button (click)="onSave()">Save</button>
```

上面的`(click)`传入的`"onSave()"`就是外部已经写好的方法，即**事件绑定**。  
如果需要传递 **事件对象** 本身，可以用 **Angular** 提供的一个隐式变量  `$event` ，例如`(myClick)="onSave($event)"`。

### 样式 Styles

样式比较简单，之前也提到过，可以用`styles`设置**内联样式**，也可以用 `styleUrl` 或 `styleUrls` 指定一个或多个 `css` 文件：

```typescript
@Component({
  styles: [
	  `
	  img { ... }
	  `,
	  `
	  p {...}
	  `,
	  //...
  ],
})
```

需要注意的是，**Angular** 通过隔离 CSS 选择器来让组件的样式仅作用于当前组件，不会影响到其他组件，包括当前组件的子组件。

## 生命周期 Lifecycle

**组件**的生命周期从组件被实例化并渲染开始，一直到组件实例被销毁并移除 DOM 中渲染出的内容结束。  
**Angular** 提供了一系列 `hooks`，方便我们在各个阶段执行各种操作。**Angular** 会按顺序分别调用这些 `hooks`：

| hooks                     | 调用时机                                                                       | 注意事项                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `ngOnChanges()`           | 当**数据绑定的输入属性**被设置或更新时被调用，如果没有绑定任何属性，则不会调用 | 由于该方法调用频繁，任何一个属性变化都会调用，因此在这个方法里执行操作会**对性能造成一定影响**             |
| `ngOnInit()`              | 在组件 / 指令设置完属性后，初始化时调用                                        | 在第一次执行`ngOnChanges()`后调用，且仅调用一次。如果没有属性而不执行`ngOnChanges()`，则会直接调用该方法。 |
| `ngDoCheck()`             | 在`ngOnInit()`和每次`ngOnChanges()`调用后执行                                  | 该方法通常用于给开发者做一些自定义检查                                                                     |
| `ngAfterContentInit()`    | 第一次`ngDoCheck()`执行后调用                                                  | 仅调用一次                                                                                                 |
| `ngAfterContentChecked()` | `ngAfterContentInit()`  后和每次  `ngDoCheck()`  后调用                        | -                                                                                                          |
| `ngAfterViewInit()`       | 第一次  `ngAfterContentChecked()`  之后调用                                    | 仅调用一次                                                                                                 |
| `ngAfterViewChecked()`    | `ngAfterViewInit()`  和每次  `ngAfterContentChecked()`  之后调用               | -                                                                                                          |
| `ngOnDestroy()`           | 销毁组件 / 指令前调用                                                          | 可以在此释放一些事件处理器等资源对象，以防内存泄漏                                                         |

对于 `ngOnInit()`  来说，我们通常会把**获取服务器数据**、**初始化输入属性（input properties）** 等复杂的初始化操作放在其中。

大部分情况下，我们希望组件的**构造方法**简单且安全，所以对数据请求等复杂的耗时操作会放在 `ngOnInit()`中，而非构造方法中；  
由于组件只有在构造方法结束后才会设置数据绑定的**输入属性**，这意味着构造方法中并不能正确地获取到输入属性，因此如果我们要对输入属性初始化，也应该放在`ngOnInit()`中，而非构造方法中。

## 服务 Service

**服务（Service）** 常用于在多个组件之间共用一段逻辑，比如共享一个全局的属性、数据或操作。可以简单理解成一个全局的工具  
服务以  `service`  作为后缀（如  `my-custom-serv.service.ts` ），用 `@Injectable` 标识，其中需要有一个 `providedIn` 属性，用于定义哪些组件可以使用该服务，比如 `root` 表示任何组件都可以访问服务。  
我们整一个计算两数之和的服务：

```typescript
<!-- sum.service.ts -->
@Injectable({
  providedIn: 'root',
})
class SumService {
  sum(x: number, y: number) { return x + y; }
}
```

在调用的时候，通过 `inject()` 方法获得一个服务的对象，就可以直接调用服务里的方法了：

```typescript
// hello-world.component.ts
@Component({ ... })
export class HelloWorld {
	private sumService = inject(SumService);
	total = this.SumService.sum(50, 25);
}
```

## 组件的交互

### 输入型绑定

**输入型绑定（Input Binding）** 是最常见的数据传递方式，其实就是最基础的，父组件将数据传递给子组件的方式  
需要传递的属性用`@Input()`标识，可以指定**别名**，比如 `@Input('taskContent')`

```typescript
import { Component, EventEmitter, Input } from '@angular/core';

@Component({ ... })
export class HelloWorld {
  @Input() title: String;
  @Input('taskContent') content: Stirng;
}
```

上面的例子中，我们有两个参数`title`和 `content` ，不过在模板中传递的时候，如果有别名就得用别名：

```javascript
  <hello-world
    [title]="myTitle"
    [taskContent]="myContent"
  ></app-product-alerts>
```

### 子组件通过 setter 监听输入属性

我们通常在子组件中通过`@Input`定义输入属性，而输入属性本身的值是来自父组件的。  
通过 `setter`，我们得以在子组件中监听输入属性，并对其值进行处理。`setter` 使得我们将这段逻辑处理放在子组件中，无需污染外部组件。

```typescript
@Component({
  selector: "hello-world",
  template: '<p>"{{name}}"</p>',
})
export class HelloWorld {
  private _name = "";
  @Input()
  get name(): String {
    return this._name;
  }
  set name(name: String) {
    this._name = "Hello " + name;
  }
}
```

上面这个例子 🌰 中，我们有个私有属性`_name`（为了和输入属性`name`区分加了个下划线），然后用`@Input`标识`name()`，这个`name()`就是我们的输入属性，需要用 `get` 标识。  
而 `set` 则对这个输入属性`name`进行操作，通过`set`方法，我们给每个传入的`name`前面都加个`Hello`  
在父组件的模板中使用的时候要用`@Input`标识的属性，这里是 `name` ：

```html
<hello-world [name]="'blackdn'"></hello-world>
```

`setter` 就像是流水线的加工环节，原料是来自父组件的数据（`name`），产出则是听过`set`处理后的`_name`

```
name -> setter -> _.name
```

### 父组件监听子组件的事件

简单点说就是**回调**啦，父组件的逻辑处理交给子组件调用，因此需要将回调方法传递给子组件。大部分点击事件都是通过这种方式进行回调。  
因为方法在子组件中被调用，但是方法本体在父组件中，需要从父组件传入子组件，因此要用`@Output` 标识对应方法。  
对于点击事件来说，这个方法通常是一个 `EventEmitter()` 对象

```typescript
@Component({})
export class HelloWorld {
  @Output() clickButton = new EventEmitter();
}
```

然后在模板中通过小括号传递`()`：

```typescript
@Component({
  //...
  template: '<hello-wrold (clickButton)="onButtonClick()"></hello-world>',
})
export class FatherComponent {
  onButtonClick() {
    //...
  }
}
```

### 父组件与子组件通过本地变量交互

有些 **类似父组件获取子组件的引用**，这个本地的引用变量用井号`#`标识，和我们在`css`中为标签绑定 `id` 一样。  
某些情况下，我们想在父组件中获取子组件的属性，或调用子组件的方法  
比如子组件有一个`greeting()`方法：

```typescript
export class HelloWorld {
  greeting() {
    window.alert("greetings!");
  }
}
```

而父组件的某个按钮想要调用这个`greeting()`，就先用`#`标识，比如`#world`，然后在调用的地方通过`world.greeting()`获取这个方法：

```html
<button type="button" (click)="world.greeting()">Greeting</button>
<hello-world #world></hello-world>
```

这个`#world`是我们在父组件模板里创建的一个**本地变量（local variable）**，用来代表子组件。

### 父组件通过 @ViewChild() 获取子组件实例

上面**本地变量**的方法有些许缺陷，比如其实现必须全部**在父组件的模板中进行**，而且实际上父组件对子组件的内容并没有访问权，无法真正访问子组件的属性和方法，更像是 **“通知”** 子组件来调用方法 。  
如果我想在父组件的`.ts`文件中访问子组件，就无法通过本地变量实现。  
于是，我们在父组件的`.ts`文件中，通过`@ViewChild()`来将子组件导入，从而真正让父组件持有一个子组件的实例：

```typescript
@Component({})
export class FatherComponent {
  @ViewChild(HelloWorld)
  private world!: HelloWorld;

  greeting() {
    this.world.greeting();
  }
}
```

### 父子组件通过服务通讯

这个稍微复杂一些，我们先假定一个情景：实现一个学生签到的功能。  
首先，我们有一个子组件类`Student`，用于表示学生：

```typescript
// student.component.ts
@Component({
  selector: "app-student",
  template: `
    <div>
      <p>Hello, I'm {{ name }}</p>
    </div>
  `,
})
export class StudentComponent {
  @Input() name = "";
}
```

有个父组件包含学生名单 `students`，和一个签到表 `signPaper`。  
在**模板**中遍历 `students` 来生成**Student 组件**，最后遍历 `signPaper` 来生成签到记录，当然现在是空的。

```typescript
// father.component.ts
@Component({
  selector: "app-father",
  template: `
    <div class="container">
      <app-student *ngFor="let student of students" [name]="student"></app-student>

      <ul>
        <li *ngFor="let signedStudent of signPaper">
          {{ signedStudent }}
        </li>
      </ul>
    </div>
  `,
})
export class FatherComponent {
  students = ["Mike", "Alice", "Black"];
  signPaper: string[] = [];
}
```

然后我们可以开始写服务了，新建文件`sign.service.ts`，或者通过`ng generate service Sign`自动创建（会自动加上`Service`后缀，我们不用加）

```typescript
// sign.service.ts
@Injectable({
  providedIn: "root",
})
export class SignService {
  private signedSource = new Subject<string>();
  signed = this.signedSource.asObservable();
  sign(student: string) {
    this.signedSource.next(student);
  }
}
```

在文件中，我们有一个 `signedSource` 用来保存数据，不过它是私有的，通过`asObservable()`方法将其以订阅的方式暴露给外界，同时定义一个方法`sign`，用于接收外面的数据并保存到 `signedSource`中。

```typescript
// fater.component.ts
@Component({
  //...
  providers: [SignService],
})
export class FatherComponent {
  students = ["Mike", "Alice", "Black"];
  signPaper: string[] = [];

  constructor(private signService: SignService) {
    signService.signed.subscribe((student) => {
      this.signPaper.push(`${student} has signed!`);
    });
  }
}
```

在父组件中，我们在**装饰器**中先用`providers`声明导入的服务，这里是`SignService`。然后在**构造方法**中得到这个服务的实例对象，并对`SignService`中的 `signed` 对象进行订阅，将其中所有学生姓名取出，放入父组件自身的 `signPaper` 中。

然后来到子组件，首先我们在子组件的构造方法中将`SignService`对象注入，不过因为结构比较简单，构造方法中没啥要做的。  
然后创建一个`sign()`方法作为按钮的点击事件，给每个子组件调用，它将每个子组件的名字属性 `name` 传给服务对象的`sign()`方法。即每个学生点击按钮签到后，将学生的名字存入服务的`signedSource`。

```typescript
// student.component.ts
@Component({
  //...
  template: `
    <div>
      <p>Hello, I'm {{ name }}</p>
      <button (click)="sign()">Sign</button>
    </div>
  `,
})
export class StudentComponent {
  @Input() name = "";

  constructor(private signService: SignService) {}
  sign() {
    this.signService.sign(this.name);
  }
}
```

到此为止，我们的子组件和父组件通过服务的通讯就实现了，我们的这个服务就像是一个存储数据的中间人，父子组件没有直接通讯，两者都和这个服务直接交流。  
一开始服务的`signedSource`是空的，当我们点击子组件的按钮，子组件通过调用服务的`sign()`方法，将数据存入服务的`signedSource`中；然后父组件以`signedSource`为数据源，将其中数据放入自己的`signPaper`中，最后根据`signPaper`中的数据进行渲染。

```
子组件 --(点击签到按钮，调用sign()方法)-->
服务(signedSource) --(获取数据，存入signPaper)--> 父组件渲染
```

## 内容投影 Content Projection

**内容投影（Content Projection）** 是一种将内容插入组件的形式，主要通过 **Angular** 自带的 `<ng-content>` 标签实现。  
之前我们使用子组件的时候，都是单纯的闭合标签，比如`<hello-world xxx=xxx></hello-world>`，而通过内容投影，我们可以在标签中插入其他想要显示的内容。这么一说还有点像 **React** 中的 `children`
主要有以下三种内容投影：

| 类型         | 描述                     |
| ------------ | ------------------------ |
| 单槽内容投影 | 从单一来源接收投影内容   |
| 多槽内容投影 | 从多个来源接收投影内容   |
| 条件内容投影 | 满足条件后才渲染投影内容 |

### 单槽内容投影

**单插槽内容投影（Single-Slot Content Projection）** 是最基本的内容投影形式。  
在被投影的模板中，我们添加一个空的 `<ng-content>` 元素：

```typescript
@Component({
  selector: "hello-world",
  template: `
    <h2>Hello World</h2>
    <ng-content></ng-content>
  `,
})
export class HelloWorld {}
```

在使用的时候，将需要投影的内容（通常是另一个元素）放入组件的标签中，这个投影的内容会自动替换`<ng-content></ng-content>`所在位置：

```html
<hello-world>
  <p>I am Single-Slot Content Projection</p>
</hello-world>
```

效果相当于：

```html
<h2>Hello World</h2>
<p>I am Single-Slot Content Projection</p>
```

要注意的是，`<ng-content>` 元素是一个**占位符**，它不会创建真正的 DOM 元素，其中的自定义属性也会被忽略

### 多槽内容投影

**多槽内容投影（Multi-Slot Content Projection）** 就是有多个插槽（废话），其实就是有多个`<ng-content>`标签进行占位。  
那么在投影的时候如何判断要投影到哪个插槽呢？我们可以给`<ng-content>`标签指定 `select` 属性：

```typescript
@Component({
  selector: "hello-world",
  template: `
    Title:
    <ng-content></ng-content>
    Question:
    <ng-content select="[question]"></ng-content>
  `,
})
export class HelloWorld {}
```

我们在模板中标识了 `select="[question]"`，在投影对象的标签里通过这个标识指定位置：

```html
<hello-world>
  <p>Pop Quiz</p>
  <p question>What is your name?</p>
</hello-world>
```

要注意的是，如果不给 `<ng-content>` 标签设置 `select` 属性，那么这个标签会接收其他**所有没被匹配上的投影内容**。比如我们修改一下 `<hello-world>` 中的投影内容：

```html
<hello-world>
  <p>Pop Quiz</p>
  <p question>What is your name?</p>
  <p>Hello World</p>
</hello-world>
```

那么在模板中渲染的时候相当于：

```html
Title:
<p>Pop Quiz</p>
<p>Hello World</p>
Question:
<p question>What is your name?</p>
```

### 条件内容投影

**条件内容投影（Conditional Content Projection）** 其实就是给投影标签上加上 `ngIf` 等指令。虽然 `<ng-content>` 也能实现，不过更推荐使用 `<ng-container>` 和 `<ng-template>`

`<ng-container>` 是一个**容器元素**，本身并不会被渲染，只会渲染其内部的内容，比如：

```html
<ng-container>
  <div>Hello World</div>
</ng-container>
```

上面这块内容在网页渲染出来的结果就只有 `<div>Hello World</div>`，`<ng-container>`标签会被解释成一段**注释**，不会被渲染。因此常在其中添加 `ngIf` 等指令，既能发挥作用，又不会被渲染，利于性能优化，一举两得。毕竟不论 `ngIf` 是否生效， 标签 `<ng-content>` 都会被初始化，这也是在这种情况下不推荐使用原因。

`<ng-template>` 是一个**模板元素**，它本身及其内部的内容都不会被渲染，通常用作定义可复用的模板。

```html
<ng-template #helloTemplate>
  <p>Hello world template.</p>
</ng-template>

<div *ngIf="showTemplate; then helloTemplate"></div>
```

`showTemplate` 是一个变量，用于判断是否展示。`#helloTemplate` 是`<ng-template>`所定义的模板的**本地变量**，`then helloTemplate`则表示通过模板定义的样式渲染内容。  
也就是说，如果`showTemplate = true`，那么就会渲染 `<ng-template>` 中的 `<p>Hello world template.</p>`。

如果想要将 `<ng-template>` 作为投影内容，就需要组合使用 `<ng-container>` 和 `<ng-template>`，而 `<ng-container>` 中的 `*ngTemplateOutlet` 用来指向对应的模板：

```html
<ng-template #helloTemplate>
  <p>Hello world template.</p>
</ng-template>

<hello-world>
  <p>Pop Quiz</p>
  <p question>What is your name?</p>
  <ng-container *ngTemplateOutlet="helloTemplate"></ng-container>
</hello-world>
```

输出内容就是：

```html
Title:
<p>Pop Quiz</p>
<p>Hello world template.</p>
Question:
<p question>What is your name?</p>
```

## 双向数据绑定

在**组件-模板**一栏中，介绍了**属性绑定**、**事件绑定**等方法，不过这些都是单向的数据绑定。前者数据从父组件流向子组件，后者反之。如果将它们结合起来，就是简单的**双向数据绑定**。  
双向数据绑定用`[()]`实现，在子组件中需要分别有 `@Input` 和 `@Output` 针对双向绑定的变量  
举个例子，我们绑定一个`age`年龄属性：

```typescript
export class AgeComponent {
  @Input() age!: number;
  @Output() ageChange = new EventEmitter<number>();

  happyBirthday() {
    this.age += 1;
    this.ageChange.emit(this.age);
  }
}
```

要注意的是，，`@Output()` 的变量名需要遵循 `inputChange` 模式，就是在 `@Input` 变量名后面加上 `Change`。比如上面是 `@Input() age`，那么就应该是 `@Output() ageChange`  
然后在这个子组件的模板中，我们给一个按钮用来绑定事件，给一串文本来显示属性：

```html
<!-- age.component.html -->
<div>
  <button (click)="happyBirthday()">Happy Birthday!</button>
  <span>I am {{ age }} years old</span>
</div>
```

那么在使用的时候，用 `[()]` 传入数据就可以实现双向绑定了：

```html
<!-- father.component.html -->
<app-student [(age)]="currentAge"> </app-student>
```

`currentAge` 是父组件的一个变量，我们实现了将 `currentAge` 和子组件中的 `age` 属性双向绑定。  
显示的数据是父组件传递给子组件的：`currentAge -> age` ，当我们点击按钮后执行`happyBirthday()` 方法，修改的是子组件自己的 `age` 属性，然后将修改完的结果传给父组件：`age -> currentAge`

## CLI 和 自带库

Angular 自带一套 CLI 工具（命令行工具），能简化许多任务，常用的命令如下：  
（虽然没有明说，但是我觉得 `ng` 应该是 **Angular** 的音译，所以拿它来做前缀）

| 命令          | 作用                                   |
| ------------- | -------------------------------------- |
| `ng build`    | 编译 Angualr 项目输出到指定目录        |
| `ng serve`    | 构建并运行项目，文件变化后自动重新构建 |
| `ng generate` | 生成对应文件                           |
| `ng test`     | 运行单元测试                           |
| `ng e2e`      | 编译并运行项目，且运行端到端测试       |

一两句话解释起来有些云里雾里的，但是这些命令在某些时候确实挺方便的。如果我们想要新建一个组件，通常会有`.ts`，`.html`，`.css` 这些当前组件对应的文件，更别说还可能会有`.spec`测试文件等，自己一个个创建十分麻烦。  
这时候可以使用命令 `ng generate component my-component`，这个时候 Angular 会在当前目录下创建一个文件夹，其中就包含了上述的所有文件，就不需要自己一个个新建了，十分方便。

Angular 有很多自带库来实现一些常见的功能，比如路由、表单、请求、动画等。

| 库                     | 作用                                                           |
| ---------------------- | -------------------------------------------------------------- |
| **Angular Router**     | 提供路由机制和导航功能，支持懒加载、嵌套路由、自定义路径匹配等 |
| **Angular Forms**      | 表单填写和输入验证                                             |
| **Angular HttpClient** | 客户端 - 服务器通信                                            |
| **Angular Animations** | 动画                                                           |
| **Angular PWA**        | 用于构建渐进式 Web 应用（Progressive Web App）                 |
| **Angular Schematics** | 一系列部署、重构、升级的自动化工具                             |

## 后话

到最后我们会发现，**Angular JS** 的大部分内容都离不开**模板**，或者说 **HTML** 代码。  
也许是因为 Angular 主打一个**扩展 HTML**的招牌，不论是插值、绑定、内容投影，还是指令，最终都是为 HTML 服务的，因此都要回归 HTML 代码。  
所以每次写例子的时候最后都要再搞一块 HTML 内容，文章就会像这样嘎嘎长，哭 😭

## 参考

1. [Angular JS 简介](https://www.angularjs.net.cn/tutorial/1.html)
2. [What is Angular?](https://angular.io/guide/what-is-angular)
3. [Understanding Angular](https://angular.io/guide/understanding-angular-overview)
4. [深入理解 Angular 中 ng-container 和 ng-template](https://frontend.devrank.cn/traffic-information/7280490426879150117)
5. [Everything you need to know about ng-template, ng-content, ng-container, and \*ngTemplateOutlet in Angular](https://www.freecodecamp.org/news/everything-you-need-to-know-about-ng-template-ng-content-ng-container-and-ngtemplateoutlet-4b7b51223691/)
6. 感谢 ChatGPT（由于 3.5 的知识库中最新的 Angular 版本为`v12`，如今已经到`v17`，很多新特性会回答有误或回答不上来）
