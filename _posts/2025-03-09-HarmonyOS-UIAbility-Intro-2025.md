---
layout: post
title: HarmonyOS：初识UIAbility
subtitle: UIAbility的生命周期和启动模式
date: 2025-03-09
author: BlackDn
header-img: img/21mon1_43.jpg
catalog: true
tags:
  - HarmonyOS
---

> "心似白云常自在，意如流水任东西"

# HarmonyOS：初识UIAbility
## 前言

**UIAbility** 在 **HarmonyOS** 开发中有非常重要的地位，所以单独拎出来放一篇。  
话虽如此这篇仍是处于理论阶段。  
之后应该会进入实践阶段，上手用 `ArkTS` 写代码咯

## UIAbility 简介

在之前的**Stage模型**中我们提到了 **UIAbility**，由于它贯穿应用始终，所以这里先来看一下 **UIAbility** 到底是什么。

在HarmonyOS开发中，**UIAbility** 是应用功能的基本组成单元，也是**系统调度的基本单元**。一个应用可以包含一个或多个 **UIAbility 组件**，一个 UIAbility 代表一个独立的功能模块，通常对应一个应用界面（Page），当然也可以多个，它负责管理用户界面（UI）和与用户的交互。   
比如在支付应用中，入口主页和收付款功能可以是两个独立的 UIAbility。我们可以从主页面进入收付款，也可以单独调起收付款功能的 UIAbility，从而即便不用通过主页面来执行收付款的功能。

每一个UIAbility组件实例都会在`最近任务列表`中显示一个对应的任务，比如用微信语音通话的时候，通话页面和微信本身都会显示在`最近任务列表`中，关闭其中一个应用并不会影响到另外一个应用，这就是两个 UIAbility 的妙用。  

此外，想要让 UIAbility 正常工作，需要在 `module.json5` 文件中配置 UIAbility 的相关信息，如名称、文件路径、图标等。   

我们将**UIAbility**理解成一个容器，它负责调度、载入页面，并管理生命周期，而并不关心页面的具体实现、有哪些组件。在 DevEco Studio 的默认工程中，我们看到 `entry` 模块下有 `entryability/EntryAbility.ets` 和 `pages/Index.ets` 文件，分别对应该模块的 UIAbility 和 Page页面  
在 `EntryAbility.ets` 中通过 `windowStage.loadContent` 方法将页面载入：

```typescript
    windowStage.loadContent('pages/Index', (err, data) => {
		//...
    });
```

## UIAbility 生命周期

UIAbility的生命周期包括 **Create**、**Foreground**、**Background**、**Destroy** 四个状态   
代码中分别对应 `onCreate()`，`onForeground()`，`onBackground()`， `onDestroy()` 四个回调方法

#### Create状态

在应用加载时，UIAbility实例创建完成后进入**Create状态**。  
系统会调用`onCreate()`回调，可以在其中进行页面初始化，执行定义变量、加载资源等操作

```typescript
onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {  
	//...
}
```

参数中，**Want** 是信息传递的载体，用于在应用组件之间传递信息，在`startAbility()`方法也用到了该参数。**LaunchParam** 用于描述 UIAbility 的启动模式和行为，其包含 `launchReason` 属性，描述启动原因（冷启动、热启动等）；`lastExitReason` 属性，描述上次退出的原因（主动退出、系统回收等）

#### Foreground和Background状态

在 UIAbility 实例切换至前台时进入**Foreground状态**，在UI可见之前会触发`onForeground()`回调；
在 UIAbility 实例切换至后台时进入**Background状态**，在UI完全不可见之后会触发`onBackground()`回调；

通常我们在 `onForeground()` 中申请系统需要的资源，如启动定位等；在`onBackground()`中执行一些较为耗时的操作或回收资源，如停止定位、保存状态等。

```typescript
onForeground() {  
  // Ability has brought to foreground  
}  
  
onBackground() {  
  // Ability has back to background  
}
```

如果 UIAbility 的启动模式为 `singleton`（后面会介绍启动模式） ，在应用的UIAbility实例创建后，又通过`startAbility()`方法启动该实例，只会进入其`onNewWant()`回调，在此进行资源加载或数据更新。由于不需要创建新的UIAbility实例，因此不会触发`onCreate()`和`onWindowStageCreate()` （这个回调也放在后面介绍）。

```typescript
  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam) {
    //...
  }
```

#### Destroy状态

**Destroy状态**在 UIAbility 实例销毁时触发。可以在`onDestroy()`回调中进行系统资源的释放、数据的保存等操作。

```typescript
  onDestroy() {
    //...
  }
```

#### WindowStage及其状态

事实上，在UIAbility实例创建完成之后（即`onCreate()`回调之后），在进入Foreground之前，系统会创建一个 **窗口阶段（WindowStage）**。   
**WindowStage** 是 UIAbility 中用于管理窗口和 UI 页面的核心组件。每个 UIAbility 可以有一个或多个 WindowStage，每个 WindowStage 对应一个窗口。

WindowStage创建完成后，会触发`onWindowStageCreate()`回调，可以在该回调中设置UI加载、设置WindowStage的事件订阅。比如之前提到的`windowStage.loadContent` 方法载入页面就是在这里调用的。     

```typescript
  onWindowStageCreate(windowStage: window.WindowStage) {
    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
	    //...
        return;
      }
        //...
    });
  }
```

![lifeCircleWithWindowStage](https://s21.ax1x.com/2025/03/05/pEYuqIO.png)


除了加载需要的页面，在该回调中还可以调用`on('windowStageEvent')`方法订阅WindowStage的事件，如获焦/失焦、切到前台/切到后台、前台可交互/前台不可交互等状态，以此在对应状态发生时执行需要的操作。

```typescript
  windowStage.on('windowStageEvent', (data) => {
	let stageEventType: window.WindowStageEventType = data;
	switch (stageEventType) {
	  case window.WindowStageEventType.SHOWN: // 切到前台
		//...
		break;
	  case window.WindowStageEventType.ACTIVE: // 获焦状态
		//...
		break;
	  case window.WindowStageEventType.INACTIVE: // 失焦状态
		//...
		break;
	  case window.WindowStageEventType.HIDDEN: // 切到后台
		//...
		break;
	  case window.WindowStageEventType.RESUMED: // 前台可交互状态
		//...
		break;
	  case window.WindowStageEventType.PAUSED: // 前台不可交互状态
		//...
		break;
	  default:
		break;
	}
  });
```

在 **WindowStage** 的**运行阶段**，WindowStage会变换状态，对应的状态就会被上面的`on()`方法监听到，从而执行对应的操作。    
而在UIAbility实例销毁之前，会先进入`onWindowStageWillDestroy()`回调，此时WindowStage仍可以使用，通常在此注销WindowStage事件订阅。  
最后会进入`onWindowStageDestroy()`回调，可以在该回调中释放UI资源。

```typescript
  onWindowStageWillDestroy(windowStage: window.WindowStage) {
	if (this.windowStage) {
	  this.windowStage.off('windowStageEvent');
	}
	//...
  }

  onWindowStageDestroy() {
    //...
  }
```


## UIAbility启动模式

接触过 Android 开发的话一定对启动模式不陌生，而UIAbility提供了三种启动模式：**单实例模式（Singleton）**、**多实例模式（Multiton）**、**指定实例模式（Specified）**   
要注意 **标准模式（Standard）** 指的是 **多实例模式（Multiton）**，现在改名了=。=

Ability的启动模式需要 在`module.json5` 中进行配置，修改 `abilities` 的 `launchType` 字段即可，三个启动模式对应的值分别为：`singleton` ， `multiton` ， `specified`

```json
{
  "module": {
    // ...
    "abilities": [
      {
	    "name": "EntryAbility",
        "launchType": "singleton", //singleton / multiton / specified
        // ...
      }
    ]
  }
}
```

#### 单实例模式Singleton

默认情况下 UIAbility 采用这个启动模式  

每当启动 UIAbility 时（如调用`startAbility()`方法），如果应用进程中该类型的UIAbility实例已经存在，则复用该实例，不会创建新的实例。即系统中只会存在一个该UIAbility实例。类似 Android  Activity 的 **SingleTask启动模式（栈内复用模式）**   
就如前文提到过，由于此时不会创建新的实例，因此只会进入`onNewWant()`回调，不会触发`onCreate()`和`onWindowStageCreate()`回调。

#### 多实例模式Multiton

每次启动 UIAbility 时，都会在应用进程中创建一个新的实例，不论该类型的 UIAbility 实例是否已经存在。即在最近任务列表中可以看到有多个该类型的UIAbility实例，比如微信开多个小程序等。对应 Android  Activity 的 **Standard启动模式（标准模式）** 

#### 指定实例模式Specified

简单来说，在 **Specified模式** 下，我们可以为启动的 UIAbility 实例打上唯一标识。如果对应标识的 UIAbility 实例已存在，则直接启动；否则就创建一个新的 UIAbility 实例。   
比如文档应用中每次新建文档希望都能新建一个文档实例，重复打开一个已保存的文档希望打开的都是同一个文档实例。

1. 调用`startAbility()`启动 UIAbility 实例（该UIAbility指定为Specified），在 `Want` 参数的 `parameters` 字段中设置唯一 `key` 值
2. 在拉起 SpecifiedAbility 之前，系统会先进入对应的**AbilityStage**的`onAcceptWant()`生命周期回调，获取标识的Key值
3. 系统会在资源池中查看当前的 UIAbility 是否与获取的 key 值匹配，如果匹配会直接启动该 UIAbility 实例；如果不存在匹配的实例，则创建一个新的 UIAbility实例，进入其 `onCreate()`和`onWindowStageCreate()`回调

### AbilityStage组件容器

Specified模式中提到的**AbilityStage**是一个**Module级别的组件容器**，应用的HAP包在首次加载时会创建一个AbilityStage实例，用于对Module进行初始化等操作。AbilityStage与Module一一对应，一个Module拥有一个AbilityStage。

`AbilityStage` 拥有`onCreate()`生命周期回调和`onAcceptWant()`、`onConfigurationUpdated()`、`onMemoryLevel()`事件回调：

- `onCreate()`：Module的第一个UIAbility实例加载前会先创建一个 **AbilityStage**，创建完成之后执行`onCreate()`生命周期回调，在此进行该Module的初始化（如资源预加载，线程创建等）等操作。
- `onAcceptWant()`：UIAbility为Specified模式时触发的回调，用于获取标识的Key值。
- `onConfigurationUpdated()`：当系统全局配置发生变更时触发的事件，如系统语言、深浅色等配置改变。
- `onMemoryLevel()`：当系统调整内存时触发的事件。在某些情况下系统可能资源不足，系统会进行内存回收。在该回调中可以有选择性地释放不必要的资源，避免系统直接杀死应用进程。

## 后话

内容有点少不过以后遇到 `UIAbility` 相关的内容应该会慢慢加进来，现在就先这样吧，反正是理论我自己都不怎么看。  
之后应该开始新建项目开始动手写 `ArkTS` 了，再学一下 `ArkUI` 的相关套件   
**HarmonyOS** 看着东西不多整理起来还挺麻烦的，啧

## 参考

1. [鸿蒙生态应用开发白皮书](https://developer.huawei.com/consumer/cn/doc/guidebook/harmonyecoapp-guidebook-0000001761818040)，[HarmonyOS 技术文档](https://developer.huawei.com/consumer/cn/doc/)，[HarmonyOS API参考](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/syscap-V5?catalogVersion=V5)
2. [HarmonyOS API参考：UIAbility]([HarmonyOS API参考](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/syscap-V5?catalogVersion=V5))
3. [HarmonyOS技术文档：AbilityStage组件容器](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/abilitystage-V5)
