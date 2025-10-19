---
layout: post
title: HarmonyOS：鸿蒙简介及其应用程序框架
subtitle: 鸿蒙系统简介、工程目录结构
date: 2025-03-06
author: BlackDn
header-img: img/21mon1_17.jpg
catalog: true
tags:
  - HarmonyOS
---

> "一半烟火以谋生，一半诗意以谋爱。"


# HarmonyOS：鸿蒙简介及其应用程序框架
## 前言

其实这一篇和上一篇的 ArkTS 是一起写的  
但是放一起感觉太多了，所以还是拆开吧   
还能再水一篇，真好=v=

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


## 应用程序包


我们称一个应用所对应的软件包文件，称为“应用程序包”。  
当前我们的应用通常采用**多模块（Module）设计机制**：**支持模块化开发**，**支持多设备适配**  
在理想情况下，我们期望将每个功能模块作为一个独立的 Module 进行开发，Module中包含其源码、资源文件、第三方文件、配置文件等，可以在配置文件中标注支持的设备类型（如 `module.json5` 配置文件中的 `deviceTypes` 字段）

### Module类型

Module 按照使用场景可以分为两类：**Ability类型的Module** 和 **Library类型的Module**

#### Ability类型的Module 和 HAP包

Ability类型的Module用于实现应用功能，每一个Ability类型的Module编译后会生成一个 `.hap` 文件，即**HAP包（Harmony Ability Package）**。  HAP包可以独立安装和运行，是应用安装的基本单位。一个应用程序可以包含一个或多个HAP包。   
应用中通常包含以下两种Ability类型的Module：

- **entry类型的Module**：应用的主模块，包含应用的入口界面、图标、主要功能等。编译后生成 **entry 类型的HAP**。对于一个设备上的应用程序包来说，entry类型的HAP最多只能包含一个，也可以不包含（前提是得有feature类型的HAP）。
- **feature类型的Module**：应用的动态特性模块，编译后生成**feature类型的HAP**。一个应用中可以包含一个或多个feature类型的HAP，也可以不包含（前提是得有entry类型的HAP）。

每个 HarmonyOS 应用必须至少包含一个 `.hap` 文件，可以是 **entry 类型** 或 **feature 类型**。

#### Library类型的Module 和 HAR/HSP包

**Library类型的Module** 用于共享代码和资源。同一个Library类型的Module可以被其他的Module多次引用，合理地使用该类型的Module，能够降低开发和维护成本。  
Library类型的Module分为**Static静态**和**Shared动态**两种类型，编译后会生成**HAR共享包**和**HSP共享包**

- **Static Library**：静态共享库。编译后会生成`.har`文件，即**静态共享包HAR（Harmony ARchive / Harmony ARchive Package）**
- **Shared Library**：动态共享库。编译后会生成`.hsp`文件，即**动态共享包HSP（Harmony Shared Package）**

实际上，**Shared Library**编译后也会生成一个`.har`文件，作为HSP对外导出的接口，其他模块通过该`.har`文件来引用HSP。由于没有功能上的作用，所以我们通常只说Shared Library编译后生成HSP。


| 共享包类型 | 编译和运行方式                                         | 发布和引用方式                                                      |
| ----- | ----------------------------------------------- | ------------------------------------------------------------ |
| HAR   | 随**使用方**编译，若有多个使用方，则在每个使用方中会存在相同的拷贝。因此建议开启混淆后编译 | 支持应用内引用；也可以独立打包发布，供其他应用引用（类似jar包）                            |
| HSP   | 可以独立编译，运行时一个进程中代码只会存在一份                         | 随应用打包，当前支持应用内和集成态HSP。应用内HSP只支持应用内共享，集成态HSP可以发布到ohpm私仓和跨应用引用。 |

要注意的是，由于HSP仅支持应用内共享，如果HAR依赖了HSP，则该HAR也会变成仅支持应用内共享。    
**HAR和HSP均不支持循环依赖，也不支持依赖传递。**

### 编译态包结构

我们已经知道了开发态的工程目录结构，如果把我们的项目打包编译，那么从开发态到编译态，Module中的文件会发生如下变更：

- **ets目录**：ArkTS源码编译生成.abc文件
- **resources目录**：AppScope目录下的`resources/`资源文件会合入到Module下面资源目录中；如果存在重名文件，则编译打包后只保留AppScope的资源文件。
- **module配置文件**：AppScope目录下的`app.json5`会合入到Module下面的module.json5文件之中。

举个例子，如果我们的工程目录是这样的：

```
├── AppScope
│   ├── app.json5
│   └── resources/
└── entry       => Entry Module
│   └── src/main
│		├── ets/
│		├── module.json5
│		└── resources/
└── feature     => Feature Module
│   └── src/main
│		├── ets/
│		├── module.json5
│		└── resources/
└── libarayA    => Shared Library
│   └── src/main
│		├── ets/
│		├── module.json5
│		└── resources/
└── libraryB    => Static Library
    └── src/main
		├── ets/
		├── module.json5
		└── resources/
```

那么编译打包之后的结果如下：

```
└── entry.hap       => Entry Module
│   └── src/main
│		├── ets/xxx.abc
│		├── module.json5  => 包含AppScope的app.json5内容
│		└── resources/    => 包含AppScope的resources/内容
└── feature.hap     => Feature Module
│   └── src/main
│		├── ets/xxx.abc
│		├── module.json5  => 包含AppScope的app.json5内容
│		└── resources/    => 包含AppScope的resources/内容
└── libarayA.hsp    => Shared Library
│   └── src/main
│		├── ets/xxx.abc
│		├── module.json5  => 包含AppScope的app.json5内容
│		└── resources/    => 包含AppScope的resources/内容
└── pack.info
```

对于静态共享库 libraryB来说，属于 **“谁引用，谁打包”**。他会先被编译成`.har`的HAR共享包，然后打包到所有引用它的HAP或HSP包中。   
对于AppScope的资源来说，我们可以将其理解为 **“所有包都引用的HAR”**，会被打包进所有HAP或HSP包中。

### 发布态包结构

每个应用中至少包含一个`.hap`文件，可能包含若干个`.hsp`文件（也可能没有）。我们将所有的`.hap`与`.hsp`合在一起称为**Bundle**，其对应的`bundleName`是应用的唯一标识。可在`app.json5`的`bundleName`字段配置。

当应用发布到应用市场时，需要将Bundle打包成一个`.app`文件上架，称为**App Pack（Application Package）**。App Pack是发布上架到应用市场的基本单元，但是不能在设备上直接安装和运行。     
同时，DevEco Studio会生成一个**pack.info**文件，用于描述App Pack中每个HAP和HSP的属性，包含`app.json5`中的 `bundleName` 和 `versionCode`、`module.json5` 中的 `name`、`type` 、 `abilities` 等信息。

![PublishPackage](https://s21.ax1x.com/2025/03/06/pEYoKu8.png)

在应用签名、云端分发、端侧安装时，都是以HAP/HSP为单位进行签名、分发和安装的。



## 参考

1. [鸿蒙生态应用开发白皮书](https://developer.huawei.com/consumer/cn/doc/guidebook/harmonyecoapp-guidebook-0000001761818040)
2. [HarmonyOS 技术文档](https://developer.huawei.com/consumer/cn/doc/)，[HarmonyOS API参考](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/syscap-V5?catalogVersion=V5)
3. [HarmonyOS API参考：Stage模型能力的接口](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/stage-api-reference-V5)

