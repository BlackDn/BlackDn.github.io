# Linux脚本：浅入Bash编程

## 前言

其实关于Linux脚本，不同的人叫法不同，有的叫**Bash**，也有的叫**Shell**  
具体区别会简单说一下，不过大家本质都一样，都是通过Linux命令行执行一连串指令  
我也懒得分那么细，所以Tag就简单给一个[Linux](https://blackdn.github.io/tags/#Linux)吧，下面也简称`Linux命令`好了。  
这里推荐一本Bash编程教程的电子书，来自Linux中国，请放心食用：[电子书：An introduction to programming with Bash](https://opensource.com/downloads/bash-programming-guide)

## Shell 和 Bash

从广义上来讲，我们可以把操作系统分为`Shell（壳）`和`Kernel（内核）`  
`Kernel`包含着计算机的许多基本功能，包括但不限于管理系统进程、内存、网络等。这部分内容往往是用户/应用程序不可达、不能直接调用的。这也是考虑到操作系统的高效性与安全性，不然随便来个程序都给自己最多的内存等资源，那不是乱套了。  
而`Shell`则是操作系统用来沟通外界和`Kernel`的桥梁，用于沟通用户和`Kernel`。最早的`Shell`通过**命令行（CLI，Command Line Interface）**实现，发展到如今的**图形界面（GUI，Graphical User Interface）**。因此，事实上`Shell`是一种抽象概念，而Windows中的命令行和桌面都是一种`Shell` 

`Bash`则是**Linux GNU**中最常用的一种Shell，全称为`Bourne-Again Shell`，是当前大多数Linux发行版的默认Shell。  
其他的shell还有sh、bash、ksh、rsh、csh等。`sh`全称是Bourne Shell，源自其作者玻恩（Bourne ），`Bash`则是其改进版。

在命令行界面输入`echo $SHELL`可以看到当前系统所使用的`Shell`

```bash
root# echo $SHELL
/bin/bash
```

## 一些Linux命令

因为Linux脚本的本质就是让很多Linux命令一起执行，这里就不从头介绍Linux命令了，假设大家多多少少都会一点  
一些用到比较多的Linux命令和一些基础都在这：[有用的linux操作](https://blackdn.github.io/2020/03/29/Linux-Command-2020/)  
这里主要放一些在脚本编写时候用到的知识或容易见到的命令。

### Shebang：注释

在Linux脚本开头，我们需要先写上`#!/bin/bash` 或 `#!/usr/bin/env bash`，这就是所谓的Shebang，没怎么找到它的中文名，就这么叫着先吧。  
这一段注释是用来告诉Shell，我这个文件是一个Linux脚本，需要将其中的内容当作Linux命令解释执行。  
虽然不同Shell的Shebang不同，但都大同小异。这里我们就简单区别一下`#!/bin/bash` 和 `#!/usr/bin/env bash`的区别。



## 参考

1. [Bash编程入门-1：Shell与Bash](https://zhuanlan.zhihu.com/p/56532223/)
2. [#!/bin/bash 和 #!/usr/bin/env bash 的区别](https://blog.csdn.net/qq_37164975/article/details/106181500)
3. [Bash 的基本语法](https://wangdoc.com/bash/grammar.html)
4. [电子书：An introduction to programming with Bash](https://opensource.com/downloads/bash-programming-guide)
