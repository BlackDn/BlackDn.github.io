---
layout: post
title: AndroidX是什么？
subtitle: Debug时发现的疑问
date: 2019-09-06
author: BlackDn
header-img: img/acg.gy_12.jpg
catalog: true
tags:
  - Android
---

> "要去远的海岸边，看天空把雨滴结成晶亮的星，看浪起时吞没尘埃"

# 前言

-2019.10.7 更新，解决 Nullable 报错问题  
没想到过了新生周还是这么忙...我要裂开  
明天试试网安面试  
然后周末想去看罗小黑，等了好久，点映的时候没上到这边的电影院，好遗憾哦

# AndroidX 是什么？

之前敲码的时候总是报错，几乎是我新建的所有工程都有这个问题，这可把我苦恼坏了  
![Bug](https://s3.ax1x.com/2020/12/20/rasrfx.png)  
主要是 Nullable 和 NonNull 的声明总是出错  
万能方法 ALT+ENTER 也只是指标不治本，新建出空的 Nullable 和 NonNull。  
一筹莫展的时候，我发现我导入的库是

```
andoid.support.annotation
```

而声明中是

```
@androidx.annotation.Nullable/NonNull
```

显然导入的包是不同的。support 库是我们经常用的，但这个 androidx 是什么东西？  
我们先认识认识 androidx，最后再来想想解决方法

## 库来实现向下兼容

任何一个系统都需要进行更新迭代来提供更好的用户体验，适应最新的技术，当然 Android 也不例外  
新版本的系统发布后，并不是所有人都会第一时间进行更新，甚至有人一直不进行更新，这就导致的不同用户的**版本差异**  
新版本中，通常会加入新的 API（Application Programming Interface，应用程序编程接口），由于版本差异，老版本的系统中并不存在这些 API，这就需要进行**向下兼容**  
以 3.0 的 Android 系统为例，其中新加了 Fragment 功能。但是这个功能的初衷是针对平板设计的，但是我手机也想用怎么办？  
于是 Android 团队将其封装成库，推出了 Android Support Library，实现向下兼容的功能。  
比如我们使用的 support-v4 库的包名如下

```
android.support.v4.app
```

表示这个库中提供的 API 能够向下兼容到版本号为 4 的 Android API，即 Android 1.6 系统

## AndroidX 的产生

但是随着时间推移，Android 1.6 系统被淘汰，现在 Android 官方支持的最低系统版本已经是 4.0.1，对应的 API 版本号是 15。  
虽然 support-v4 等库的内容也有被修改，但是命名却被保留下来，实际上不再支持那么久远的系统了。  
但是显然这种命名是不合理的，于是 Android 团队对这些 API 的架构进行了一次重新的划分，推出了 AndroidX。  
要注意的是，AndroidX 和 Android Support Library 是同一等级的，support-v4 等库是 Android Support Library 下的子库，比他们要低一级。  
在本质上，AndroidX 是对 Android Support Library 的一次升级，完善了以下两个方面

#### 一、包名

原来的 Android Support Library 下，他们的包名都形如

```
android.support.*
```

比如

```
android.support.v4.app
android.support.v7.appcompat
```

而 AndroidX 库中所有 API 的包名都变成了

```
androidx.*
```

比如一开始我遇到的

```
androidx.annotation
```

好处是，这能实现 androidx.\*包下面的 API 都随着扩展库发布的，从而实现这些 API 基本不依赖于操作系统的具体版本。

#### 二、命名规则

在 AndroidX 所有库的命名不再含有 API 版本号，比如 appcompat-v7 库就叫 appcompat 库

```
implementation 'androidx.appcompat:appcompat:1.0.2'
```

## 官方建议

所以，AndroidX 是对 android.support.xxx 包的整理后产物。由于之前的 support 包过于混乱，官方也懒得整理，所以干脆做个新的库出来。  
当然官方会推荐使用 AndroidX，并声明会慢慢停止对 Android Support Library 的维护。  
从 Android Studio 3.4.2 开始，新建的项目已经强制勾选使用 AndroidX，这也是为什么我的项目中自动生成的代码是@androidx  
官方描述如下

```
Existing packages, such as the Android Support Library, are being refactored into AndroidX.
Although Support Library versions 27 and lower are still available on Google Maven,
all new development will be included in only AndroidX versions 1.0.0 and higher.
```

## 进行迁移

当然，需要我们对之前的项目进行迁移。回到一开始的问题，我对于我这个报错的地方要怎么办呢？  
最方便快捷的方法是用 Android Studio 的一键迁移，项目名右击 -> Refactor -> Migrate to AndroidX  
![Migrate](https://s3.ax1x.com/2020/12/20/rasDt1.png)  
当然，可能出现一些错误需要我们手动去调试，基本上是一些命名问题或者重名问题等小问题。  
另外，Android Studio 还会将你原来的项目备份成一个 zip 文件，这样即使迁移之后的代码出现了问题你还可以随时还原回之前的代码。

## 解决我的 bug

如果迁移后还是报错，那么需要进一步进行处理  
首先介绍一下 Nullable 的作用，Nullable 类在修饰参数时，这表示该参数可以合法地为空  
我们需要做的就是在 build.gradle 中导入依赖即可

```
dependencies {
    implementation 'androidx.annotation:annotation:+'
}
```

##### 参考

[Android:你好,androidX！再见,android.support(公众号：郭霖)](https://www.jianshu.com/p/41de8689615d)  
[@androidx.annotation.Nullable 报错问题](https://blog.csdn.net/m0_37692318/article/details/89710765)
