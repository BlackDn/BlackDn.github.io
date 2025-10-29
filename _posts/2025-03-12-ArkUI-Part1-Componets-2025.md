---
layout: post
title: HarmonyOS：ArkUI 框架 Part 1 - 组件和生命周期
subtitle: ArkUI 系统组件、自定义组件和生命周期
date: 2025-03-12
author: BlackDn
header-img: img/21mon1_61.jpg
catalog: true
tags:
  - HarmonyOS
  - ArkTS
---

> "日落尤其温柔，人间皆是浪漫。"

# HarmonyOS：ArkUI 框架 Part 1 - 组件和生命周期


## 前言

之前我们介绍了ArkTS 语言以及 HarmonyOS 相关的一些理论知识，现在开始 ArkUI 框架，进入到实操阶段。  
HarmonyOS 开发用的 `IDE` 是**DevEco Studio**，自己去下载安装一个就好。   
关于这个 IDE 的介绍和使用就不提了，可以自己去找资料看看，官方也挺多的。

## ArkUI开发框架

**ArkUI** 是华为在 **HarmonyOS** 中推出的一套 **声明式 UI 开发框架**，用于构建分布式应用的用户界面。自带一堆组件、布局、动画之类的，整体感觉还可以吧，给就用。

ArkUI提供了两种开发范式：

- **Declarative开发范式（基于ArkTS的声明式开发范式）**：官方推荐，简单来说，就是用 `ArkTS` 语言开发=。=
- **类Web开发范式（兼容JS的类Web开发范式**）：用 `HTML`、`CSS`、`JavaScript` 三剑客开发。便于Web前端开发者开发 HarmonyOS 应用，也便于将已有的 Web 应用改造成 ArkUI 应用

### ArkUI 的核心特性

- 丰富的组件库：提供大量基础组件（如 Text、Image、Button、List 等）和容器组件（如 Row、Column、Stack 等），方便快速构建界面。
- 状态驱动更新：通过状态变量自动刷新界面，无需手动调用刷新函数。
- 自适应布局与跨设备设计：ArkUI 支持多设备（手机、平板、智慧屏、车机、可穿戴设备等）统一开发，通过弹性布局和媒体查询实现不同设备上的适配。
- 高性能渲染引擎：基于方舟编译器和自研渲染引擎，支持原生级性能与流畅动画。
- 与分布式能力集成：ArkUI 与 HarmonyOS 的分布式特性深度结合，可以实现跨设备界面协同。

##  ArkUI 声明式开发范式

由于 HarmonyOS 推荐使用**声明式开发范式**，且声明式编程贯穿 ArkUI的设计理念，因此我们先介绍一下其是如何采用 `ArkTS` 进行声明式开发的：  
其语法风格类似 `React` 或 `SwiftUI`。开发者通过状态驱动界面更新，例如使用 `@State`、`@Prop` 等装饰器来管理数据变化

![ArkTS-Code-Struct](https://s21.ax1x.com/2025/03/11/pENjIiV.png)


- **装饰器**：用于装饰类、结构、方法以及变量，并赋予其特殊的含义，类似Java的注解。比如`@Component`表示自定义组件，`@Entry`表示该自定义组件为入口组件，`@State`表示组件中的状态变量，状态变量变化会触发UI刷新。
- **自定义组件**：可复用的UI单元，如上述被`@Component`装饰的组件。
- **UI描述**：我们称`build()`函数中的语句为UI描述
- **系统组件**：ArkUI框架中内置的基础和容器组件。
- **属性方法**：组件可以通过**链式调用**配置多项属性，如图中的`fontSize()`、`width()`、`height()`、`backgroundColor()`等。
- **事件方法**：组件可以通过**链式调用**设置多个事件的响应操作，如 **Button** 的`onClick()`。


## ArkUI 系统组件

先来介绍一下常见的系统组件及其用法。  
我在学习新语言/框架的时候，习惯过一遍这些组件的用法和常用属性/参数，然后边看边记。这就导致对应的文章显得跟文档手册一样。所以以下内容都可以在官方文档手册中看到，如果觉得不够详细可以去看官方的嗷。

### Image图片组件

Image支持加载 `PixelMap`、`ResourceStr` 和 `DrawableDescriptor` 类型的数据源，支持 `png`、`jpg`、`jpeg`、`bmp`、`svg`、`webp`、`gif` 和 `heif` 类型的图片格式。   
使用网络图片时，需要申请权限`ohos.permission.INTERNET`

```typescript
Image(src: PixelMap | ResourceStr | DrawableDescriptor)

// 加载本地图片
Image('images/view.jpg')

// 加载网络图片
Image('https://www.example.com/example.JPG')

// 加载资源图片
Image($r('app.media.icon'))
```

**Image** 还有以下几点特性：

- 加载图片失败或图片尺寸为0时，图片组件大小自动为0，不跟随父组件的布局约束
- 当原图宽高和组件不同时，默认从进行居中裁剪
- 加载成功且组件不设置宽高时，其显示大小自适应父组件

下面介绍一些 Image 组件特有的或比较常用的属性

#### objectFit缩放类型

当图片本身的宽高和Image组件的宽高不一致时，需要我们对图片进行缩放，`objectFit()`属性方法用于控制缩放的方式   
`objectFit()`接受一个 `ImageFit` 类型参数，具体作用如下：

| 缩放方式                      | 描述                              |
| ------------------------- | ------------------------------- |
| `ImageFit.Cover`（Default） | 保持宽高比进行缩放，图片两边都大于等于边界。          |
| `ImageFit.Contain`        | 保持宽高比进行缩放，图片完全显示在组件内            |
| `ImageFit.Auto`           | 图像根据其自身和组件的尺寸自适应缩放，保持比例的同时填充视图。 |
| `ImageFit.Fill`           | 不保持宽高比，让图片充满组件                  |
| `ImageFit.ScaleDown`      | 保持宽高比，图片缩小或保持不变                 |
| `ImageFit.None`           | 保持图片原有尺寸                        |

在**API 12**及以上，还新增了 `ImageFit.TOP`，`ImageFit.START`， `ImageFit.END` 等，用于在保持图片原有尺寸的情况下调整显示的区域，具体可见API参考

```typescript
  Image($r('app.media.img'))
	.width(200)
	.height(150)
	  // 保持宽高比进行缩小或者放大，使得图片完全显示在显示边界内。
	.objectFit(ImageFit.Contain)
```

#### objectRepeat重复样式

`objectRepeat()`属性方法接收 `ImageRepeat` 类型参数，用于设置图片的重复样式（不支持 `svg` 类型图片）   
默认为`ImageRepeat.NoRepeat`，如果设置了重复样式，则会从中心点向两边重复，剩余空间不足放下一张图片时会截断

| 重复样式                            | 描述          |
| ------------------------------- | ----------- |
| `ImageRepeat.X`                 | 只在水平轴上重复    |
| `ImageRepeat.Y`                 | 只在竖直轴上重复    |
| `ImageRepeat.XY`                | 水平轴和竖直轴上都重复 |
| `ImageRepeat.NoRepeat`（Default） | 不重复图片       |

#### interpolation图片差值

当原图分辨率较低并且放大显示时，图片会模糊出现锯齿。使用`interpolation()`属性对图片进行插值，使图片显示得更清晰。   
`interpolation()` 接收 `ImageInterpolation` 类型参数，有以下可选值：

| 图片差值                              | 描述             |
| --------------------------------- | -------------- |
| `ImageInterpolation.None`         | 最近邻插值          |
| `ImageInterpolation.High`         | Cubic插值，插值质量最高 |
| `ImageInterpolation.Medium`       | MipMap插值       |
| `ImageInterpolation.Low`（Default） | 双线性插值          |

要注意，高质量的差值会影响图片的渲染速度，过度使用会影响性能。

#### renderMode渲染模式

这个比较简单， `renderMode()`可以设置图片为原色或黑白，接收一个`ImageRenderMode`类型参数   
默认为 `ImageRenderMode.Original`，原色渲染；如果设置为`ImageRenderMode.Template`则使用黑白渲染

#### sourceSize图片尺寸

`sourceSize()`属性设置图片解码尺寸，仅在目标尺寸小于图源尺寸时生效，因此多用来降低图片的分辨率。    
和`ImageFit.None`配合使用时可在组件内显示小图


```typescript
Image($r('app.media.example'))
  .sourceSize({
	width: 90,
	height: 90
  })
```

#### 图片加载事件

图片加载成功后会触发 `onComplete()` 事件，其中可以获取图片的信息，如具体宽高等；如果加载失败则会触发 `onError()` 事件

```typescript
Image($r('app.media.img'))
  .width(200)
  .height(150)
  .onComplete(msg => {
	if(msg){
	  this.widthValue = msg.width
	  this.heightValue = msg.height
	  this.componentWidth = msg.componentWidth
	  this.componentHeight = msg.componentHeight
	}
  })
  .onError(() => {
	console.info('load image fail')
  })
```


### Button按钮组件

**Button**类型包括普通按钮（Normal）、胶囊按钮（Capsule）、圆形按钮（Circle）   
本身可以作为容器，在其中添加子组件实现包含文字、图片等元素的按钮。

```typescript
Button(label?: ResourceStr, options?: { type?: ButtonType, stateEffect?: boolean })
// 作为容器添加带
Button('Ok', { type: ButtonType.Normal, stateEffect: true }) {
  Row() {
    Image($r('app.media.loading')).width(20).height(40).margin({ left: 12 })
    Text('loading').fontSize(12).margin({ left: 5, right: 12 })
  }.alignItems(VerticalAlign.Center)
}.borderRadius(8) 
 .backgroundColor(0x317aff) 
 .width(90)
 .height(40)
```

接收的参数中，`label`用来设置按钮文字，`type` 用于设置Button类型，`stateEffect` 属性表示是否开启点击效果。

#### type类型

接收 ButtonType 类型参数，默认为胶囊按钮

| ButtonType                    | 描述                                  |
| ----------------------------- | ----------------------------------- |
| `ButtonType.Capsule`（Default） | 胶囊按钮，圆角默认为高度的一半，`borderRadius` 属性失效 |
| `ButtonType.Circle`           | 圆形按钮，`borderRadius` 属性失效            |
| `ButtonType.Capsule`          | 普通按钮，默认不带圆角（`borderRadius` 为0）      |

### Text/Span文本组件

**Text** 和 **Span** 可以直接传入 `string 字符串`或引用 `Resource 资源对象`来创建  
**Span** 组件则作为 Text 內的子组件显示文本内容。可以在一个Text内添加多个Span来显示一段信息，常用来分段、换行等。  
单独的Span组件不会呈现任何内容，需要作为 Text 的子组件使用。Text与Span同时配置文本内容时，Span内容覆盖Text内容。


```typescript
// string字符串创建
Text('我是一段文本')
// Resource 资源对象创建
Text($r('app.string.module_desc'))
  .fontSize(30)
  .padding(10)
  .width(300)
// 设置Span（只会显示'我是Span'）
Text('我是Text') {
  Span('我是Span')
}
.padding(10)
.borderWidth(1)
```

下面看一些常用属性，一些比较简单和基本的就略过了，比如`fontSize()`，`fontColor()`，`lineHeight()` 等


#### textAlign对其样式

`textAlign()` 接收一个 TextAlign 类型参数，用于设置文本对齐样式，如左对齐，右对齐，居中等

| 对其样式                       | 描述     |
| -------------------------- | ------ |
| `TextAlign.Start`（Default） | 水平对齐首部 |
| `TextAlign.Center`         | 水平居中对齐 |
| `TextAlign.End`            | 水平对齐尾部 |

**API 10**以上还新增了一个`TextAlign.JUSTIFY`，表示两端对齐。

#### textCase大小写

`textCase()` 接收一个 **TextCase** 类型参数，用于将文本全部设置为大写或小写

| 大小写                        | 描述        |
| -------------------------- | --------- |
| `TextCase.Normal`（Default） | 保持文本原有大小写 |
| `TextCase.LowerCase`       | 文本采用全小写   |
| `TextCase.UpperCase`       | 文本采用全大写   |


#### textOverflow文本超长控制

`textOverflow()`属性接收一个包含 `overflow`属性的对象，来控制超长文本的表现形式，如滚动显示、省略号显示等。    
其中`overflow`属性是 **TextOverflow** 类型。
需要与`maxLines`一起使用。

| TextOverflow 参数              | 描述                 |
| ---------------------------- | ------------------ |
| `TextOverflow.None`          | 文本超长时按最大行截断显示      |
| `TextOverflow.Clip`（Default） | 文本超长时按最大行截断显示      |
| `TextOverflow.Ellipsis`      | 文本超长时显示不下的文本用省略号代替 |
| `TextOverflow.MARQUEE`       | 文本超长时以跑马灯的方式滚动展示   |


```typescript
Text('我是超长文本，超出的部分显示省略号。I am an extra long text, with ellipses displayed for any excess。')
  .width(250)
  .textOverflow({ overflow: TextOverflow.Ellipsis })
  .maxLines(1)
  .fontSize(12)
```

#### decoration装饰线

`decoration()` 属性用于设置文本装饰线样式及颜色，其接收一个 `DecorationStyleInterface` 类型对象，这个类型包含以下参数：

| 参数名     | 类型                  | 必填  | 说明    | 默认值                         |
| :------ | :------------------ | :-- | :---- | --------------------------- |
| `type`  | TextDecorationType  | 是   | 装饰线类型 | `TextDecorationType.None`   |
| `color` | ResourceColor       | 否   | 装饰线颜色 | `Color.Black`               |
| `style` | TextDecorationStyle | 否   | 装饰线样式 | `TextDecorationStyle.SOLID` |

| TextDecorationType                 | 描述  |
| ---------------------------------- | --- |
| `TextDecorationType.Underline`     | 下划线 |
| `TextDecorationType.LineThrough`   | 删除线 |
| `TextDecorationType.Overline`      | 上画线 |
| `TextDecorationType.None`（Default） | 没线  |

| TextDecorationStyle                  | 描述  |
| ------------------------------------ | --- |
| `TextDecorationStyle.SOLID`（Default） | 单实线 |
| `TextDecorationStyle.DOUBLE`         | 双实线 |
| `TextDecorationStyle.DOTTED`         | 点线  |
| `TextDecorationStyle.DASHED`         | 虚线  |
| `TextDecorationStyle.WAVY`           | 波浪线 |


```typescript
// 红色删除线
Text('This is the text')
  .decoration({
    type: TextDecorationType.LineThrough,
    color: Color.Red
  })
```

### TextInput/TextArea文本输入

`TextInput` 为单行输入框、`TextArea` 为多行输入框.  
使用的时候可以设置默认文本和placeholder

```typescript
TextInput({ placeholder: '我是提示文本', text: '我是当前文本内容' })
TextArea({ placeholder: '我是提示文本', text: '我是当前文本内容' })
```

#### type类型

`type()`属性用来定义输入框的输入模式，如密码输入、纯数字输入、邮箱输入等，方便使用过程中进行校验和限制。   
其接收一个 `InputType` 类型参数，具体可选值如下：

| InputType                   | 描述                                                         |
| --------------------------- | ---------------------------------------------------------- |
| `InputType.Normal`（Default） | 基本输入模式。无特殊限制                                               |
| `InputType.Password`        | 密码输入模式。可以显示和隐藏输入内容，支持系统的自动保存和填充                            |
| `InputType.Email`           | 邮箱输入模式。有一些基本的字符校验，只能存在一个`@`字符                              |
| `InputType.Number`          | 纯数字输入模式。                                                   |
| `InputType.PhoneNumber`     | 电话号码输入模式。API 9 以上可用，支持输入数字、空格、`+` 、`-`、`*`、`#`、(`、`)，长度不限。 |
| `InputType.USER_NAME`       | 用户名输入模式。API 11以上可用，支持自动保存和填充                               |
| `InputType.NEW_PASSWORD`    | 新密码输入模式。API 11以上可用，在密码输入模式基础上，支持自动生成新密码                    |
| `InputType.NUMBER_PASSWORD` | 纯数字密码输入模式。API 11以上可用                                       |
| `InputType.NUMBER_DECIMAL`  | 带小数点的数字输入模式。API 11以上可用，支持数字，小数点（只能存在一个小数点）。                |
| `InputType.URL`             | 带URL的输入模式。API 12以上可用                                       |



## 自定义组件

如果单一的系统组件不足以满足我们的需求，我们可以将系统组件进行组合、封装，作为一个新的 **自定义组件（Custom Component）**，方便开发中进行复用、修改。自定义组件具有以下特点：

- **可组合**：允许开发者组合使用系统组件、及其属性和方法。
- **可重用**：自定义组件可以被其他组件重用，并作为不同的实例在不同的父组件或容器中使用。
- **数据驱动UI更新**：通过状态变量的改变，来驱动UI的刷新。

自定义组件基于 `struct` 实现，并用  `@Component` 装饰器装饰   
 `@Component` 仅能装饰 `struct` 关键字声明的数据结构，为其提供组件化的能力。最后通过`build()`方法**描述UI**。  
 一个`struct`只能被一个`@Component`装饰，而自定义组件必须定义`build()`函数

```typescript
@Component
struct HelloComponent {
  @State message: string = 'Hello, World!';

  build() {
    // HelloComponent自定义组件组合系统组件Row和Text
    Row() {
      Text(this.message)
        .onClick(() => {
          // 状态变量message的改变驱动UI刷新，UI从'Hello, World!'刷新为'Hello, ArkUI!'
          this.message = 'Hello, ArkUI!';
        })
    }
  }
}
```

### UI描述规则

我们将 `build()` 函数中的语句称为**UI描述**，需要遵循以下规则：

- `@Entry`的自定义组件必须以**容器组件**作为根节点（如上述例子中的`Column()`和`Row()`），`@Component`自定义组件的根节点可以为**非容器组件**。根节点唯一且必要，因此禁止以`ForEach`作为根节点。
- `build()`函数中不允许声明本地变量
- `build()`函数中不允许直接使用`console.info()`，可以在方法活函数中使用
- `build()`函数中不允许创建本地的作用域
- 不允许调用没有用``装饰的方法
- 不允许使用`switch`进行条件判断，可以使用`if`
- 不允许使用表达式（如三元表达式）
- 不允许直接改变状态变量，会导致循环渲染

### 成员函数/变量及变量传递

自定义组件除了`build()`方法外可以有其他成员变量和函数，要注意成员变量和函数都是**私有**的，且不建议声明成静态变量/函数。


```typescript
@Component
struct MyComponent {
  private countDownFrom: number = 0;
  private color: Color = Color.Blue;
  build() {
  }
}

@Entry
@Component
struct ParentComponent {
  private someColor: Color = Color.Pink;

  build() {
    Column() {
      // 在父组件中传入参数给子组件
      MyComponent({ countDownFrom: 10, color: this.someColor })
    }
  }
}
```

上述例子中我们看到父组件同时用了`@Entry`标注，`@Entry`表示该自定义组件将作为UI页面的入口。在单个UI页面中，最多可以使用`@Entry`装饰一个自定义组件。

ArkUI 提供了多种变量装饰器，用于管理数据在组件间的传递和共享：

|装饰器|用途|数据流方向|特点|
|---|---|---|---|
|`@State`|组件内部状态|内部可变|状态变化自动触发 UI 刷新|
|`@Prop`|父组件向子组件传递数据|单向（父 → 子）|只读，不可在子组件内修改|
|`@Link`|父子组件之间的双向绑定|双向|子组件修改可影响父组件|
|`@Provide` / `@Consume`|跨层级数据共享|向下传递|类似 React 的 Context|
|`@StorageProp` / `@StorageLink`|跨页面持久化存储|单向 / 双向|基于全局存储空间|
### 条件渲染和循环渲染

在 ArkUI 声明式开发中，界面由数据状态驱动。当 **状态（State）** 变化时，UI 会根据逻辑自动重新渲染。  
因此，ArkUI 提供了简洁的 **条件渲染（Conditional Rendering）** 与 **循环渲染（List Rendering）** 语法，用于动态生成界面结构。

#### 条件渲染 Conditional Rendering

在.`build()` 函数中渲染组件的时候，可以通过 `if-else-elseif` 语句来渲染对应的内容。 `ArkUI` 直接使用 `TypeScript` 的逻辑表达式即可实现，无需额外指令。   
如果判断条件是**状态变量**，其值改变时会实时渲染UI；如果是**常规变量**则不会     


```typescript
@Entry
@Component
struct MainView {
  @State toggle: boolean = true;

  build() {
    Column() {
      if (this.toggle) {
        CounterView({ label: 'CounterView #positive' })
      } else {
        CounterView({ label: 'CounterView #negative' })
      }
      Button(`toggle ${this.toggle}`)
        .onClick(() => {
          this.toggle = !this.toggle;
        })
    }
    .width('100%')
  }
}
```

上述例子中将状态变量 `@State toggle` 作为判断条件，因此每次点击 **Button** 都会触发重新渲染。虽然不论是哪个分支，里面都是一个 **CounterView** 组件，但是每次触发重新渲染后，都会先删除原本的组件并创建一个新的组件实例。
#### 循环渲染 List Rendering

当需要根据数据数组动态生成多个组件时，可通过 `ForEach` 实现。通常循环渲染会和**容器组件**配合使用。（方便实现滚动啥的）  
`ArkUI` 的循环语法是声明式的、原生支持的，并会自动追踪每个元素的状态。

```typescript
ForEach(
	arr: Array<any>,
	itemGenerator: (item: any, index?: number) => void,
	keyGenerator?: (item: any, index?: number) => string
)
```

- `arr`：用于迭代的数据源，需要是 **Array** 类型的数组。可以为空数组，此时不执行生成函数，不产生组件。
- `itemGenerator`：组件生成函数，为`arr`中每个 `item` 生成对应组件。可选参数 `index` 为 `item` 在 `arr` 中的索引
- `keyGenerator`：键值生成函数，用于为每个项生成唯一且持久的键值。当键值发生变化时，会认为对应的组件被替换或修改，并根据新的键值创建新的组件。因为是可选参数，默认生成函数为 `(item: T, index: number) => { return index + '__' + JSON.stringify(item); }`

```typescript
@Entry
@Component
struct Parent {
  @State simpleList: Array<string> = ['one', 'two', 'two', 'three'];

  build() {
    Row() {
      Column() {
        ForEach(this.simpleList, (item: string) => {
          ChildItem({ item: item })
        }, (item: string) => item)
      }
      .width('100%')
      .height('100%')
    }
    .height('100%')
  }
}
```

在 `ForEach` 首次渲染时，会根据`keyGenerator` 函数为数据源的每个项生成唯一键值，并创建相应的组件。   
在上述例子中， `keyGenerator` 函数仅以数据源的文本为键值，而我们的数据源有两个 `'two'`，因此这两个键值相同，只会渲染一个 `ChildItem` 组件，最终会渲染出3个组件。    
在后续渲染中（非首次渲染），也会通过`keyGenerator` 函数生成键值，此时会检查新生成的键值是否已存在。若不存在则正常创建；若存在则不会创建。

### 自定义组件的创建、渲染、删除

自定义组件的创建和渲染流程如下：

```
ArkUI框架创建组件 -> 
根据默认值或构造方法传参，按照变量定义顺序初始化变量 ->
触发 aboutToAppear() 回调 ->
首次渲染时，执行 build() 方法渲染系统组件以及创建自定义子组件实例（如有） ->
触发 onDidBuild() 回调
```

在首次渲染时，ArkUI会记录状态变量和子组件的**映射关系**，即**哪些组件引用了状态变量**。  
当组件的状态变量被改变，或`LocalStorage / AppStorage`中的属性更改，并导致绑定的状态变量更改其值时，会触发重新渲染。ArkUI会根据上述映射关系，来更新对应的子组件，以实现**最小化更新**。

在某些情况下，如 `if` 渲染条件改变，或`ForEach`循环的个数改变，将会触发组件的删除，触发`aboutToDisappear()`回调。   
ArkUI的节点删除机制是：将**后端节点（子组件）** 从组件树上摘下并销毁，对**前端节点（父组件）** 解除引用。当前端节点已经没有引用时，将被JS虚拟机垃圾回收。  
最后自定义组件和它的变量将被删除，如果其有同步的变量（`@Link`、`@Prop`、`@StorageLink`等），将从**同步源**上取消注册。

不建议在生命周期`aboutToDisappear()`内使用 `async await`，`Promise`等异步操作，否则组件将被保留在Promise的闭包中，直到回调方法执行完，这会阻碍系统的垃圾回收。


## 组件和页面的生命周期

在 ArkUI 的声明式开发模型中，**页面（Page）** 与 **组件（Component）** 虽然都通过 `@Component` 定义（页面通常还会加一个`@Entry`），但它们的生命周期管理机制存在本质区别：

- 页面生命周期：控制整个页面的加载、展示、隐藏、销毁等过程。
- 组件生命周期：控制页面中某个局部组件的创建、渲染与销毁。

### 页面生命周期 Page Lifecycle

页面生命周期是整个 **Stage 模型** 的一部分，与系统页面栈管理相关。当用户进入、离开、切换页面时，这些回调函数会被触发。

|生命周期函数|触发时机|常见用途|
|---|---|---|
|`onPageShow()`|页面显示时（包括返回可见）|刷新数据、恢复动画|
|`onPageHide()`|页面不可见时|暂停播放、保存状态|
|`onBackPress()`|用户按返回键时|自定义返回行为|

### 组件生命周期 Component Lifecycle

组件生命周期只与组件本身的创建和销毁有关，**不会感知页面跳转**。它适用于普通的自定义组件，用于管理组件内的状态、订阅、资源释放等。

| 生命周期函数               | 触发时机        | 常见用途                   |
| -------------------- | ----------- | ---------------------- |
| `aboutToAppear()`    | 组件即将显示时     | 初始化数据、发起网络请求           |
| `onDidBuild()`<br>   | 组件已构建并渲染完成后 | 执行依赖 UI 的逻辑，如测量布局、动画启动 |
| `aboutToDisappear()` | 组件即将销毁时     | 取消订阅、释放资源              |

### 页面组件

当一个组件同时被 `@Entry` 和 `@Component` 装饰时，**它既是一个页面（Page）组件，也是一个普通的组件（Component）**  
这种组件会经历页面和组件的生命周期，触发对应的回调函数。

一个应用可以有多个页面，但通常有一个入口页面。这个入口页面即是被 `@Entry` 装饰的内容，其本质作用是将组件声明为一个**入口页面（Page Entry Point）**，  由系统的页面管理栈（`PageAbility` 或 `AbilityStage`）控制。




![Page-Component-Lifecircle](https://s21.ax1x.com/2025/03/11/pENvjXQ.png)



## 参考

1. [HarmonyOS开发指南：ArkTS（方舟编程语言）](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/arkts-V5)
2. [HarmonyOS开发指南：ArkUI（方舟UI框架）](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/arkui-V5)
3. [HarmonyOS API参考：ArkTS组件](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/arkui-declarative-comp-V5)
4. [HarmonyOS API参考：ForEach](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/ts-rendering-control-foreach-V5) / [HarmonyOS开发指南：ForEach循环渲染](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/arkts-rendering-control-foreach-V5)