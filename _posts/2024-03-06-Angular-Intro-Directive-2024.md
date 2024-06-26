---
layout: post
title: Angular：指令 Directive
subtitle: 从属性型指令、结构型指令 到 指令组合API
date: 2024-03-06
author: BlackDn
header-img: img/21mon1_45.jpg
catalog: true
tags:
  - Angular
  - Web
---

> "山上层层桃李花，云间烟火是人家。"

# Angular：指令 Directive

## 前言

既组件之后是指令，结果发现已经过去一个月了，哈哈哈哈  
中间忙着给自己的博客缝缝补补，乐在其中  
之后 **Angualr** 应该还会有一两篇，看看什么时候能憋出来  
**Angular 组件**传送门：[Angular Component](../2024-02-06-Angular-Intro-Component-2024)

并且同样提一嘴，**Angular** 更新了项目结构，之前是 **基于模块（Module-Based）** ，现在推荐使用 **独立项目结构（Standalone）**  
本文内容采用 **独立项目结构（Standalone）**

## 指令 Directives

**指令（Directive）** 作为 **Angular** 的一大特性，它允许我们为 **HTML 组件** 添加自定义的行为，包括但不限于：是否渲染组件、循环渲染组件、根据条件判断更改组件样式等。     
简单碰瓷一下 **React** ，比如在 **React** 中，我们想“根据用户是否登陆来决定是否弹窗”，可以直接通过逻辑判断来渲染组件：`isLogin && <no-login-alert />`    
而在 **Angular** 中，我们可以这样实现：

```html
<no-login-alert *ngIf="isLogin"></no-login-alert>
```

上面 `no-login-alert` 组件中的 `*ngIf` 就是指令，是一个十分常用的 **Angular 内置指令**，用于条件判断；还有就是 `*ngFor`，用于循环渲染组件：

```html
<div *ngFor="let book of bookList">{{book.title}}</div>
```

这样 **Angular** 就会便利 `bookList` 数组，为其中的每个元素创建一个`<div>`，内容则是元素中的 `book.title`

不过要注意，`ngIf`  和`ngfor`  指令不能在一个元素中使用，会抛出 `Can’t have multiple template bindings on one element.` 的错误，原因在后面**结构型指令**中会提到。  
必要时可以再包一层父组件，分别套用不同的指令，比如使用 `<ng-container>` 啥的。

### 自定义指令

**自定义指令（Custom Directives）** 通常以  `directive`  为后缀（如  `custom-direct.directive.ts` ）  
我们可以用 CLI 命令快速生成指令文件：`ng generate directive highlight`，**Angular** 会自动帮我们创建 `highlight.directive.ts` 等一系列文件。  
指令用`@Directive`标识，其中包含`selector`标识，并且导出一个 **TypeScript 类**

```typescript
// hightlight.directive.ts
@Directive({
  selector: "[needHighlight]",
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = "yellow";
  }
}
```

上述指令会将包含的元素文字变为黄色以高亮显示，使用的时候在 HTML 标签中加入`selector`中的标识 `needHighlight` 即可

```html
<p needHighlight>I am highlight.</p>
```

![highlight-text](https://s21.ax1x.com/2024/05/31/pk8Un76.png)
## 指令的分类

简单来说，我们可以将指令分为 **内置指令（Built-in Directives）** 和 **自定义指令**，但这样分类未免有点脱裤子放屁的嫌疑  
所以还是跟着官方文档，将指令分成这三类：

| 类型       | 描述                                             |
| ---------- | ------------------------------------------------ |
| 组件       | 带有模板的指令，最为常见                         |
| 属性型指令 | 这类指令会更改元素、组件、或其他指令的外观或行为 |
| 结构型指令 | 这类指令通过添加和删除元素来更改页面布局。       |

是的没有错，我们之前学习了那么久的**组件**，官方将其视为指令的一个分类，即**组件是一种特殊的指令**。  
关于组件就不过多介绍了，让我们来看看**属性型指令**和**结构型指令**  
如果遇到常见的内置指令，会顺便介绍一下=v=

## 属性型指令

**属性指令（Attribute Directives）** 用以更改元素的外观或行为，比如上面我们自定义的 **HighlightDirective** 就是一个典型的属性型指令。  
我们还可以在 **HighlightDirective** 基础上进行扩展，实现鼠标 `hover` 时设置高亮颜色：

```typescript
@Directive({
  selector: "[needHighlight]",
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener("mouseenter") onMouseEnter() {
    this.highlight("yellow");
  }
  @HostListener("mouseleave") onMouseLeave() {
    this.highlight("");
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

`@HostListener('mouseenter') onMouseEnter()` 表示鼠标悬停时执行的方法监听，这里我们调用 `highlight()` 方法将文字背景高亮，同理，在鼠标离开时，`@HostListener('mouseleave') onMouseLeave()` 取消背景色的高亮。

![hover-highlight-yellow](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXRqZHQ4Ynk5dWMzazRxZWJrOXp3cnp2Njc2bW00eGFiNmt6MDM3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gvqfia6uNKMoDSgizW/giphy.gif)

再进一步，我们将上述代码的颜色常量提取出来，成为一个变量， 这样就可以从外部传递，将高亮颜色作为可控变量。

```typescript
@Directive({
  selector: "[needHighlight]",
})
export class HighlightDirective {
  @Input() needHighlight = "";
  constructor(private el: ElementRef) {}

  @HostListener("mouseenter") onMouseEnter() {
    this.highlight(this.needHighlight);
  }
  @HostListener("mouseleave") onMouseLeave() {
    this.highlight("");
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

我们提取出的颜色变量 `@Input() needHighlight = '';` 和指令的标识 `selector: '[needHighlight]',` 同名，这里都是 `needHighlight`，使用的时候可以一步到位，给组件指定指令的同时传入变量，算是个小小的语法糖吧：

```html
<!-- highlightColor = "red" -->
<p [needHighlight]="highlightColor">I am highlight.</p>
```

![hover-highlight-red](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnY2OWt4ZnVjczVwYzBkcGtyNHF1YzRzYXc2cW00Mm91MmJjcms5NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FzsueHWrsJeZdEcDyH/giphy.gif)

如果还有更多的传入属性，可以继续在后面加，比如可以再加一个**默认颜色**的传入变量：

```typescript
  // ...
  @Input() appHighlight = '';
  @Input() defaultHighlightColor = '';

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || this.defaultHighlightColor);
  }
  //...
}
```

```html
<!-- defaultColor = "yellow" -->
<p appHighlight [defaultHighlightColor]="defaultColor">I am highlight.</p>
```

### 内置属性型指令

常见的内置属性型指令有这些，我们来看看他们的功能和使用方式

| 指令      | 作用                       |
| --------- | -------------------------- |
| `NgClass` | 添加或删除 CSS 类          |
| `NgStyle` | 添加或删除一组 HTML 样式   |
| `NgModel` | 为表单属性添加双向数据绑定 |

#### NgClass

**NgClass** 其实就是为组件添加 `class` 属性：

```html
<!-- isError = true -->
<div [ngClass]="isError ? 'errorText' : 'normalText'">Hello World</div>
```

上述例子中，最后咱们的 `<div>` 会获得 `errorText` 属性，如果我们在 `css` 里设置了：

```css
.normalText {
  color: black;
}

.errorText {
  color: red;
}
```

最后咱们的 `Hello World` 就会变成红色（`color: red`）

此外，我们可以通过**键值对**的方式，来让 **NgClass** 同时设置多个 `class`

```typescript
// in ts file
  myClasses: Record<string, boolean> = {};

  constructor() {
    this.myClasses = {
      invisible: false,
      titleText: true,
      errorText: true,
    };
  }
```

可以看到，我们设置了一个名为 `myClasses` 的 **Record** 对象，代表键为 `string`，值为 `boolean` 的 一系列键值对。  
 当 `ngClass` 接收这个对象后，其中的键就代表 `css` 的类名，如果其值为 `true`，则添加这个类名；如果为 `false`，则删除这个类名  
（在实践中，通常会把 `initClasses()` 方法放到 `ngOnInit()` 中执行，这里为了方便演示放在构造方法中）   
然后给他加到某个标签上：

```html
<div class="invisible" [ngClass]="myClasses">Hello World</div>
```

上面这个例子中，虽然 `<div>`  一开始有 `invisible` 的类名，但是由于在 `myClasses` 我们设置了 `invisible: false`，所以实际上这个类名会被删除。最后这个 `<div>` 只属于 `titleText` 和 `errorText` 这两个类。

#### NgStyle

**NgStyle** 用于为元素添加 `css` 样式，跟 **NgClass** 是好兄弟，一个加样式一个加类（不过通常加类的目的好像也是为了加样式）

```js
  myStyles: Record<string, string> = {};

  constructor() {
    this.myStyles = {
      'font-weight': this.isTitle ? 'bold' : 'normal',
      'color': this.isError ? 'red' : 'black'
    };
  }
```

记得在模版中绑定 `ngStyle` 属性：

```html
<div [ngStyle]="myStyles">Hello World</div>
```

#### NgModel

**NgModel** 是用来**数据绑定**的。  
按照官方文档的话来说，**NgModel** 是这样的：

> 根据领域对象创建一个 `FormControl` 实例，并把它绑定到一个表单控件元素上。  
> 这个 `FormControl` 实例将会跟踪值、用户交互和控件的验证状态，以保持视图与模型的同步。 如果用在某个父表单中，该指令还会把自己注册为这个父表单的子控件。

一下子就给我看晕了，我们举个栗子🌰看看，假设有一个属性 `name` 以及修改它的方法：   
（敲代码的时候要注意一点，如果用的是 **Standalone** 代码结构，直接 `import NgModel` 可能会报错，因为 **NgModel** 不是 `standalone` 模块，可以导入 **FormsModule** 代替）   

```ts
/**
@Component({
  standalone: true,
  imports: [..., FormsModule],
})
**/

  name: string = '';
  setName() {
    this.name = 'BlackDn';
  }
```


然后在模板中，有如下内容：

```html
<input
  [(ngModel)]="name"
  #model="ngModel"
  required />
<p>Value: {{ name }}</p>
<p>Value: {{ model.valid }}</p>
<button (click)="setName()">Set value</button>
```


![NgModel Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemp5ZWs3eTF4dTR5dm1ubnQycDkzcXUzbnRseGpzMW9lOXYwYzhiYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XJZckqnhO82s1f99rh/giphy.gif)

我们将 `name` 和 `<input>`标签通过 `ngModel` 实现双向绑定，`#model="ngModel"` 则创建了一个名为 `model` 的本地变量，它其实就表示 `ngModel`。  
因为 **NgModel** 有很多继承自 **NgControl** 和 **AbstractControlDirective** 的属性，如 `value`、`valid`、`disabled` 等。通过这个本地变量，我们能轻松地在当前文件的其他地方获取这些变量，就好比我们后面的 `model.valid`   
由于 **NgModel** 所在的 `<input>` 添加了 `required` 约束，所以当我们啥也不填的时候，不满足这个约束，`model.valid = false`。一旦填了啥内容，约束满足，`model.valid` 就变成了 `true`   
此外，**双向数据绑定**也十分方便。`name` 的值随着我们在 `input` 填入内容而同步修改，是 `<input> -> name` 的绑定；我们点击按钮后，执行 `setName` 方法修改 `name`，同时也修改了我们 `input` 里的内容，又是 `name -> <input>` 的绑定。   

简单来说，**NgModel** 指令可以显示数据属性，并在用户进行更改时更新该属性（就是**数据绑定**咯）

## 结构型指令

**结构型指令（Structural directives）** 是通过添加和删除 DOM 元素来更改 DOM 布局的指令，也就是直接通过渲染/不渲染元素来影响页面的布局和内容。

结构型指令常以星号`*`作为前缀，我们的 **NgIf**，**NgFor** 就是典型的结构型指令。  
这个星号`*`前缀实际上是一种简写，**Angular** 会将星号转换为 `<ng-template>` 并包裹内部元素：

```html
<!-- 我们写的 -->
<div *ngIf="showTitle" class="titleText">{{item.title}}</div>

<div *ngFor="let item of itemList; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  {% raw %}({{i}}): {{item.content}}{% endraw %}
</div>

<!-- 转换后的 -->
<ng-template [ngIf]="showTitle">
  <div class="titleText">{{item.title}}</div>
</ng-template>

<ng-template
  ngFor
  let-hero
  [ngForOf]="itemList"
  let-i="index"
  let-odd="odd"
  [ngForTrackBy]="trackById"
>
  <div [class.odd]="odd">
	  {% raw %}({{i}}): {{item.content}}{% endraw %}
  </div>
</ng-template>
```

我们发现，结构指令相关的内容会被移到 `<ng-template>` 上，而其他属性都保留在原元素上。

不过随之而来的一个问题是，当一个元素遇到多个结构型指令，**Angular** 并不能判断应该优先执行哪一个指令。  
比如我将 `*ngFor` 和 `*ngIf` 放在同一个元素上，我是应该 `判断是否要渲染（if） -> 循环渲染全部内容（for）`，还是应该 `直接进入循环（for） -> 判断每个item是否要渲染（if）` ？  
为了避免这种情况，**Angular** 采取了最简单粗暴的方式：**规定一个元素只能有一个结构型指令（One structural directive per element
）** 。这也是为什么我们在前面提到，`ngIf`  和`ngfor`  在一个元素中使用，会抛出 `Can’t have multiple template bindings on one element.` 的错误。

因此，当遇到上述情况的时候，**Angular** 更推荐使用 `<ng-container>`，在执行指令的同时，避免无用的元素渲染。

### 自定义结构型指令

我们打算写一个和 `*ngIf` 相反的指令，即 **HideDirective**。当其传入的值为 `true` 时，隐藏其内容，否则正常显示。  
我们通过 **CLI** 命令 `ng generate directive hide` 自动创建了 `hide.directive.ts` ：

```ts
@Directive({
  selector: "[appHide]",
})
export class HideDirective {
  constructor() {}
}
```

因为比较简单，所以直接给出结果，然后再逐步分析：

```ts
export class HideDirective {
  private hasView = false;

  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>) {}

  @Input() set appHide(shouldHide: boolean) {
    if (shouldHide && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    } else if (!shouldHide && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
  }
}
```

首先，我们加了一个 `hasView` 的私有变量，用于判断当前组件是否已经被渲染出来。  
其次，在构造方法中，我们引入了一个 **ViewContainerRef** 和 **TemplateRef** 。前者是一个视图容器，可以动态地创建或销毁视图；而后者是一个视图模板，需要通过 **ViewContainerRef** 来将模板实例化，从而插入到 DOM 中，在页面上展示。就像后面使用的这样：`this.viewContainer.createEmbeddedView(this.templateRef)`   
因为结构型指令本质是在元素外包裹一个 `<ng-template>`，所以这里的 **ViewContainerRef** 代表的模板就是 `<ng-template>` 包裹的内容，即我们的元素内容

然后，我们定义了一个输入变量 `appHide`，它和当前指令的 `selector` 同名，并且使用 `set` 标识，让指令接受到这个变量后执行操作，不用写额外的方法进行处理。  
操作内容主要是对  `appHide` 的值（即 `shouldHide`）和 `hasView` 进行判断：如果当前组件已经展示又需要隐藏，就调用 `this.viewContainer.clear()` 将其隐藏；如果当前组件已经隐藏又需要展示，就通过 **ViewContainerRef** 和 **TemplateRef** 将其渲染。  

用的时候，为元素添加 `*appHide` 属性即可：

```html
<!-- 隐藏元素 -->
<div *appHide="true">Hello World</div>
<!-- 显示元素 -->
<div *appHide="false">Hello World</div>
```

### 内置结构型指令

| 指令       | 作用                 |
| ---------- | -------------------- |
| `NgIf`     | 判断是否渲染元素     |
| `NgFor`    | 根据数据循环渲染元素 |
| `NgSwitch` | 切换选择元素         |

这几个常见的内置结构型指令中，**NgIf** 和 **NgFor** 就不多介绍了，我们来看一下 **NgSwitch**

#### NgSwitch

**NgSwitch** 对标的是 `switch-case-default` 语句块，相对应的，除了 `ngSwitch` 属性外，我们还需要结合 **NgSwitchCase** 和 **NgSwitchDefault**  
先举例子再讲解：

```html
<div [ngSwitch]="author">
  <p *ngSwitchCase="'BlackDn'">Author: BlackDn</p>
  <p *ngSwitchCase="'Mike'">Author: Mike</p>
  <p *ngSwitchCase="'Daylight'">Author: Daylight</p>
  <p *ngSwitchDefault>Author: Unknown</p>
</div>
```

用过 `switch-case-default` 的话相信能很快理解这一部分。  
首先我们为最外层的 `<div>` 添加了 `[ngSwitch]="author"`，这个 `author` 是一个变量，我们称之为 **开关值（switch value）**。 
然后为其中的元素添加 `*ngSwitchCase` 和 `*ngSwitchDefault`。  
如果某个 `*ngSwitchCase` 的值和开关值相同，那么就会显示对应的元素，其他元素则不显示；如果没有 `*ngSwitchCase` 能匹配上，那么就显示 `*ngSwitchDefault` 的元素。  
如果 `author = 'BlackDn'`，那么就显示 `<p *ngSwitchCase="'BlackDn'">Author: BlackDn</p>`，如果 `author` 是 `BlackDn`，`Mike`，`Daylight`之外的值，就显示 `<p *ngSwitchDefault>Author: Unknown</p>`

## 指令组合 API

**指令组合API（Directive Composition API）** 是 **Angular 15** 推出的新特性，简单来说，它允许我们在一个组件/指令中组合多个其他的指令。不过，只有使用**独立结构**，即声明 `standalone: true` 的指令才能被组合。

在组件装饰器 `@Component` 中，我们可以用 `hostDirectives` 指定当前元素应用的指令，这些指令会被组合成一个指令应用在当前组件上，从而不需要在模板中声明  
我们称 `hostDirectives` 组合而成的指令为**宿主指令**，称其应用的组件元素为**宿主元素**。

先整一个指令，它可以将文本加粗，就叫他 **BoldDirective** 吧：

```ts
// in BoldDirective
@Directive({
  selector: '[appBold]',
  standalone: true, // 必须是true
})
export class BoldDirective {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.style.fontWeight = 'bold';
  }
}
```

这时候我们再写一个自定义组件 **MyTextComponent**，如果我们想要它内部的文本通过 **BoldDirective** 加粗，需要这样：

```typescript
//等价于：
@Component({
  selector: 'app-my-text',
  imports: [BoldDirective], //因为采用standalone结构，需要imports导入
  template: `<p appBold>my-text works!</p>`, // 在模板中添加selector
})
export class MyTextComponent {}
```

但是使用 **hostDirectives**，我们就不需要在模版的标签中添加 `selector` 了：

```typescript
// in component
@Component({
  selector: 'app-my-text',
  hostDirectives: [BoldDirective], // 使用hostDirectives
  template: `<p>my-text works!</p>`,  // 不需要selector
})
export class MyTextComponent {}
```

单单一个指令没什么好组合的，所以我们多加一个 **TextColorDirective**：

```ts
// in TextColorDirective
@Directive({
  selector: '[appTextColor]',
  standalone: true,
})
export class TextColorDirective {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.style.color = 'green';
  }
}
```

那么在 **MyTextComponent** 中，只用在 **hostDirectives** 中继续新加指令就好了：

```typescript
// in component
@Component({
  selector: 'app-my-text',
  template: `<p>my-text works!</p>`,
  hostDirectives: [BoldDirective, TextColorDirective],
})
export class MyTextComponent {}
```

效果就是，我们的 `<p>my-text works!</p>` 既被设置了 `font-weight = 'bold'` 又被设置了 `color = 'green'`，两个指令同时作用在当前组件上。

![green-bold-text](https://s21.ax1x.com/2024/05/31/pk8UPtU.png)

### 组合指令的输入/输出属性

接下来我们将自定义组合指令的属性，比如指定 **TextColorDirective** 的颜色。

首先，我们修改一下 **TextColorDirective**，将颜色作为一个 `@Input`，让它的颜色从外界传入：

```ts
// in TextColorDirective
export class TextColorDirective {
  constructor(private elementRef: ElementRef) {}
  
  @Input() set textColor(color: string) {
    this.elementRef.nativeElement.style.color = color || 'green';
  }
}
```

我们通过 `@Input() set textColor` 来从外部接收一个颜色，如果外部没指定颜色就给个默认值 `'green'`。   
这里之所以要用 `setter` 而不继续放在构造方法中，是因为构造方法只执行一次，且会在属性传入前执行。这会导致我们的颜色传不进来，一直是默认值绿色。

回到 **MyTextComponent**，我们扩展一下 `hostDirectives`：  
将 **TextColorDirective** 用一个对象包裹，方便我们添加 `inputs` 属性：

```ts
@Component({
  // ...
  hostDirectives: [
    BoldDirective,
    {
      directive: TextColorDirective,
      inputs: ['textColor'],
    },
  ], 
})
export class MyTextComponent {}
```

对象中，`directive` 指定生效的指令，`inputs` 指定输入变量，在父组件中就可以通过`inputs` 指定的变量来传入参数啦：

```html
  <app-my-text [textColor]="'red'"></app-my-text>
```

当然支持别名，可以改成 `inputs: ['textColor: color']`，即`<指令中的传入属性名>: <父组件标签的属性名>` ，那么父组件中就用后面的别名 `color`：

```html
  <app-my-text [color]="'red'"></app-my-text>
```

![red-bold-text](https://s21.ax1x.com/2024/05/31/pk8UihF.png)

当然还可以用 `outputs` 指定输出的回调方法：

```ts
// in TextColorDirective
export class TextColorDirective {
  // ...
  @Output() callback = new EventEmitter();
  ngOnInit(): void {
    setTimeout(() => {
      this.callback.emit();
    }, 3000);
  }
}
```

因为 **Directive** 没有UI界面，所以这里的回调就用 `setTimeout` 延迟执行。  
我们期望当组件渲染后，过三秒，执行我们传入的回调函数。  
那么在组件中：

```typescript
// in component
@Component({
  // ...
  hostDirectives: [
    BoldDirective,
    {
      directive: TextColorDirective,
      inputs: ['textColor: color'],
      outputs: ['callback'] // 加了这一行
    },
  ], 
})
export class MyTextComponent {}
```

我们添加了 `outputs: ['log']`，表示父组件的标签中需要有一个 `callback` 来表示传入的回调函数：

```ts
// in father component
@Component({
  template: `<app-my-text [color]="'red'" (callback)="onLog()"></app-my-text>`,
})
export class FatherComponent {
  onLog() {
    console.log('message from father');
  }
}
```

在父组件里声明了一个 `onLog()` 函数作为回调，`log`一下。  
不出意外的话，当这个绑定指令的**宿主元素**被渲染出来后，过3秒 `console` 就会有一条 `'message from father'` 的消息

简单来说，通过 **组合指令API**，我们让指令的特性成为组件的特性，不再需要给元素绑定指令的 `selector`，我们可以将更多功能解构成指令，再通过指令去组合，为各个组件添加功能，让代码更容易复用，更简洁，维护更高效。

### 组合出一个新的指令

还记得我们在指令的分类时提到， **组件是一种特殊的指令** 
那么当然，我们也可以将多个指令组合成一个新的指令 （回收伏笔～）  

那么我们尝试将 **BoldDirective** 和 **TextColorDirective** 组合成一个新的指令，就叫它 **BoldTextWithColorDirective** 吧：

```ts
@Directive({
  selector: '[appBoldTextWithColor]',
  hostDirectives: [
    BoldDirective,
    {
      directive: TextColorDirective,
      inputs: ['textColor'],
      outputs: ['callback'],
    },
  ],
})
export class BoldTextWithColorDirective {}
```

于是在组件中，只需要指定新的指令 **BoldTextWithColorDirective**，就可以同时应用两个指令的功能啦：

```ts
@Component({
  selector: 'app-my-text',
  template: ` <p>my-text works!</p> `,
  hostDirectives: [BoldTextWithColorDirective],
})
export class MyTextComponent {
  //...
}
```

在父组件中引用子组件则不需要变化，我们根据 **BoldTextWithColorDirective** 中的内容，传入 `textColor` 和 `callback` 即可：

```html
<!-- 保持不变 -->
<app-my-text [textColor]="'red'" (callback)="onLog()"></app-my-text>
```

### 指令组合 API 小结

**指令组合API（Directive Composition API）** 这个特性的提出，是响应了 **Github** 上的一个 **Proposal Issue**：[Proposal: Need ability to add directives to host elements in component declaration.](https://github.com/angular/angular/issues/8785)  
内容比较复杂，我简单总结了一下，就是楼主希望一个组件能够集成多个指令的功能，如果不使用指令组合API，通常我们会尝试以下方法：

- 继承：由于 **Typescript** 不支持多类继承（只能继承一个类），所以组合多个指令就比较困难
- 硬着头皮写一个新的指令，但是这多少会带来代码重复，不好不好
- 使用 **Mixin**：**Mixin模式** 常用来实现多重继承，在各个语言都可以看到它的身影，虽然 **Mixin** 一定程度上能够满足我们的需求，但是需要花一定的成本学习 **Mixin** 语法，还要不停地为代码打上 `@mixin` 标识，同样不够优雅

因此，**指令组合API（Directive Composition API）** 用更简洁的语法带来了更强大的扩展性，给我的感觉就是让指令成为类似 **Java** 中 **接口Interface** 的一样的存在，让我们能够自由组合，非常的面向对象。

## 参考

1. [Angular Doc: Attribute directives](https://angular.cn/guide/attribute-directives)
2. [Angular Doc: Structural directives](https://angular.io/guide/structural-directives)
3. [Angular Doc: NgModel](https://angular.cn/api/forms/NgModel)
4. [Angular Doc: Directive composition API](https://angular.io/guide/directive-composition-api)
5. [Angular 指令组合 API 使用指南](https://zhuanlan.zhihu.com/p/654791733)
6. [Proposal: Need ability to add directives to host elements in component declaration.](https://github.com/angular/angular/issues/8785)
