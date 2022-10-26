---
layout:       post
title:        WSL：Windows自带Linux使用指南  
subtitle:     在Win10中安装Linux及简单WSL的使用  
date:         2022-01-01
auther:       BlackDn
header-img:   img/19mon5_34.jpg  
catalog:      true
tags:
    - Linux  
    - Windows  
    - Tutorial  
---

> "生活明朗，万物可爱。人间值得，未来可期。"

# WSL：Windows自带Linux使用指南
## 前言
新年快乐~  
因为玩的有点疯所以咕咕了好久  
隔壁同学都开始写开题报告了，我还在这肝推送，可恶  
最近没什么动力啊=。=

## Windows自带的Linux

在我们Windows玩家中，说到安装Linux，第一反应大部分都是VM或者VB里装个虚拟机。比如我就习惯用VM，每次要用的时候就打开，文件拖来拖去，有时候会感觉比较麻烦。而且吧这玩意还占内存占空间。  
不过呢，退一步讲，我们用Linux很多时候想用的是它的控制台，学习它的命令、工具，而虚拟机所带的图形界面反而是次要的。  

于是乎，有了今天的主角——Windows自带的Linux。  
说是自带的也不准确，其实是Microsoft为我们提供的一个WSL工具（Windows Subsystem for Linux）。这篇文章主要就是**在Windows（Win10）上安装WSL及其简单使用的指南**。  
简单分析一下优缺点：虚拟机的好处在于，其是一个沙盒空间，不会影响到本机，中病毒了也没事；而且可以使用“快照”之类的功能，进行时间回溯等  
而WSL的优点就在于其轻量、启动快；而且可以随时访问本机的文件等；不过没有图形化界面。  

PS：由于我已经装过了，所以安装过程可能用的是网上其他人的，所以可能会有中英文互用的，请忽略，嘻嘻

### 安装

安装共分为两步，十分简单  
这里提一嘴，安装的Win10的版本要2004以上的，不过都快2022年了，应该不会有人不行吧？不会吧不会吧

#### 1. 启动WSL功能与Linux

来到控制面板 -> 卸载程序界面，左上角进入“启动或关闭Windows功能”，里面勾选“适用于Linux的Windows子系统”和“虚拟机平台”，英文分别是“Virtual Machine Platform”和“Windows Subsystem for Linux”。  
然后重启就好了

#### 2. 下载Linux

虽然是下载吧，但是不用我们自己找，在**Microsoft Store**里搜索`Linux`或`Ubuntu`就行了  
我写文章的时候看到的是有一个Kali，有三个Ubuntu，分别是“Ubuntu”、“Ubuntu 20.04 LTS”和“Ubuntu 18.04 LTS”。因为我自己下的是Ubuntu所以以Ubuntu为例（Kali的我有VM的虚拟机了），其实你都下了也没关系，反正到时候会有个列表可以选择，也可以修改默认的启动机器。我下的是**Ubuntu 20.04**，听说下Ubuntu直接是下的最新版，大家可以尝试一下。  
下完就好了，不出意外就安装成功了。然后在桌面或者菜单栏会出现Ubuntu的图标，点击就可以启动了。

![usage](https://s4.ax1x.com/2022/01/01/TIaIHJ.jpg)  

### 初始配置

点击Ubuntu图标后会打开一个类似cmd的**命令提示符窗口**，然后等个几分钟让他装装完。  
之后会让你输入用户名和密码，作为一个初始用户，老生常谈了。不过要注意这个用户和root用户是不一样的。  
大致内容如下，你也有可能是中文的。

```bash
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: （你输入的用户名）
New password:（你输入的密码，看不见的）
Retype new password:（你输入的密码，还是看不见的）
passwd: password updated successfully
Installation successful!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Welcome to Ubuntu 20.04 LTS (GNU/Linux 4.19.104-microsoft-standard x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Jul 6 12:07:38 BST 2020

  System load:  0.27               Processes:             8
  Usage of /:   0.4% of 250.98GB   Users logged in:       0
  Memory usage: 0%                 IPv4 address for eth0: 172.21.232.173
  Swap usage:   0%

0 updates can be installed immediately.
0 of these updates are security updates.

The list of available updates is more than a week old.
To check for new updates run: sudo apt update
```

如果在安装过程中，显示 **“不受支持的控制台设置。若要使用此功能，必须禁用旧的控制台”**，那就需要在命令提示符的标题栏 `右键 -> 属性 -> 选项` ，取消勾选 **“使用旧版控制台”** 的选项，不过之后需要重启命令提示符。    
还有一种方法，就是在 **Microsoft Store** 里搜索并下载 `“Windows Terminal”`，这个控制台不仅比自带的控制台好看，还不会出现上面的错误。

如果有一个人很不爽这个提示，然后在安装完后，在输入密码前，就关闭了这个命令提示符（比如我）。就会发现，再次打开后就直接以root身份进入Linux了，没有之前要我们设置用户名密码了，这就会导致我们的Linux只有一个root用户而没有其他用户，这是不合理的。  
这就需要我们之后再手动添加一个用户。不过因为出现这个问题的概率比较低，所以添加用户放后面再讲。

### 升级系统

到此我们的Linux就算安装完成了，不过咱也不能保证我们的Linux是最新的，所以还是检索一下看看有没有更新的安装包  
在Linux界面以此输入以下指令，升级完后把安装包也删了：

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt-get autoremove
```

搞定，接下来就是用WSL操作我们的Linux啦

## 用WSL简单操作Linux

WSL的全称是Windows Subsystem for Linux，所以当然应该是要在Windows里使用的。  
所以带有wsl的命令都是在Windows的命令提示符中进行的操作，而不是在Linux中的，这点要注意。

### 查看Linux列表、设置默认虚拟机

用以下命令可以查看已经安装的Linux列表。

```bash
wsl --list

PS C:\Users\BlackDn> wsl --list
适用于 Linux 的 Windows 子系统分发版:
Ubuntu-20.04 (默认)
```

就像上面一样，输入命令后会显示可用的Linux列表，因为我只装了一个所以只显示了一个。后面有“（默认）”就表示是默认使用的Linux。  
如果安装了多个Linux，可以用以下命令修改默认Linux

```bash
wsl --setdefault <Name>

PS C:\Users\BlackDn> wsl --setdefault Ubuntu-20.04
```

注意这里的`<DistributionName>`要和列表里的一样，所以在修改前要先查看看Linux列表确认名字。

### 在Windows控制台启动Linux

在有多个Linux的情况下，我们想启动某个Linux，需要用以下命令：

```bash
wsl -d, --distribution <Name>

PS C:\Users\BlackDn> wsl -d Ubuntu-20.04
root@BlackDn-DESKTOP:/mnt/c/Users/BlackDn#
```

由于我只指定了Linux，没有指定用户，所以默认以`root用户`启动。如果我们要指定用户，比如我之前创建了名为`blackdn`的用户，则要用以下命令：

```bash
wsl -u, --user <user>

PS C:\Users\BlackDn> wsl -u blackdn
blackdn@BlackDn-DESKTOP:/mnt/c/Users/BlackDn$
```

当然也可以两者联合起来用，以某用户启动某Linux，当然这个用户要存在于该Linux中。

```bash
PS C:\Users\BlackDn> wsl -d Ubuntu-20.04 -u blackdn
blackdn@BlackDn-DESKTOP:/mnt/c/Users/BlackDn$
```

这时我们已经进入了Linux，可以使用Linux的命令。输入`exit`命令可以回到Windows控制台。

### 在Windows文件资源管理器访问Linux

PS：Windows文件夹的学术名称为“文件资源管理器”

更进一步，我们既然在Windows里装了Linux，那么这个Linux的文件在哪呢？  
实际上它在“文件资源管理器”的“网络”文件夹下，我们可以通过`“\\wsl$\<Name>`来访问，我的就是`“\\wsl$\Ubuntu-20.04”`。在其中的`home`目录下就有该Linux的所有用户。

![windowsdir](https://s4.ax1x.com/2022/01/01/TIa5B4.jpg)    

### 修改WSL版本

先介绍一下WSL，Windows Subsystem for Linux，简单来说就是Windows的一个用于管理、使用GNU/Linux的工具。有WSL 1和WSL 2两个版本。  
两者区别在于，WSL 2采用了更新的技术，在轻量级实用工具虚拟机 (VM，Virtual Machine) 中运行 Linux 内核，实现**提高文件系统性能**，以及**添加系统调用兼容性**。

在Windows命令行中，我们可以修改一下WSL版本，因为WSL本质上是一个工具，就像Linux里的python一样，python分python2、python3，WSL也分WSL 1和WSL 2。  
至于不同版本的WSL怎么用，有什么区别呢，我们之后再讲。总之现在普遍用WSL 2的会比较多。  
我们先用以下命令查看所用的Linux及其WSL版本：

```bash
wsl --list --verbose

PS C:\Users\BlackDn> wsl --list --verbose
  NAME            STATE           VERSION
* Ubuntu-20.04    Stopped         1
```

这里可以看到`VERSION`为1，我们用以下命令进行修改为2，当然也可以用同样的方法将其改回1。

```bash
PS C:\Users\BlackDn> wsl --set-version Ubuntu-20.04 2
正在进行转换，这可能需要几分钟时间...
有关与 WSL 2 的主要区别的信息，请访问 https://aka.ms/wsl2
转换完成。
```

如果想要以后安装的Linux默认都是WSL 2，那么可以用以下命令将其设为默认版本：

```bash
wsl --set-default-version 2

PS C:\Users\BlackDn> wsl --set-default-version 2
有关与 WSL 2 的主要区别的信息，请访问 https://aka.ms/wsl2
操作成功完成。
```

这里要注意一点，如果一开始不能切换为WSL 2的话，需要在[这里下载WSL 2 Linux 内核更新包](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)，安装完之后就可以了。

## 在Linux中访问Windows

既然是在Windows中安装的Linux，自然可以访问我们Windows的文件了  
从`“\\wsl$\Ubuntu-20.04”`的目录中也可以看到，在其中的`/mnt/`目录下，就对应着Windows本机的硬盘目录。比如我要访问D盘，可以在Linux中访问`/mnt/d`：

```bash
PS C:\Users\BlackDn> wsl -u blackdn
blackdn@BlackDn-DESKTOP:/mnt/c/Users/BlackDn$ cd /mnt/d
blackdn@BlackDn-DESKTOP:/mnt/d$ ls
ls: cannot access 'pagefile.sys': Permission denied
'$RECYCLE.BIN'   EpicLibrary     OverWatch             'Sakuna Of Rice and Ruin'     pagefile.sys
 ASUS            HomeSweetHome  'Program Files (x86)'   SteamLibrary
 CS1.6           MSOCache        Recovery              'System Volume Information'
blackdn@BlackDn-DESKTOP:/mnt/d$
```

### 在Linux中运行Windows程序

大部分Windows程序都可以通过Linux来启动，不过当然是在Windows中运行，Linux只不过是提供一个启动的命令。  
通常Windows的可执行程序，在Linux中需要加上`".exe"`来启动，比如以下命令分别表示**启动文件资源管理器**、**用notepad打开test.txt文件**

```bash
blackdn@BlackDn-DESKTOP:/mnt/d$ explorer.exe
blackdn@BlackDn-DESKTOP:/mnt/d$ notepad.exe test.txt
```



## 用户

现在回过头来，处理一下之前没有用户的问题。具体表现为，Linux安装完后，在其home目录下（我的是`“\\wsl$\Ubuntu-20.04\home”`）没有用户，即除了root用户外没有其他的用户。于是我们就要自己创建一个新的用户，并给予其成为root的权限。

### 创建用户

创建用户建议使用`adduser`命令，后面跟用户名作为参数，然后回让我们设置密码，甚至还有全名、电话之类的信息，这些信息可以不填直接跳过，最后确认即可。我这里以创建用户`blackdn`为例。

```bash
adduser <username>

root@BlackDn-DESKTOP:/mnt/c/Users/BlackDn# adduser blackdn
正在添加用户"blackdn"...
······
这些信息是否正确？ [Y/n] y
```

这时候我们发现`“\\wsl$\Ubuntu-20.04\home”`目录中已经有`blackdn`的文件夹了，说明该用户成功创建。

### 给予root的权限

虽然目录中已经有了该用户，但是该用户还不能成为root，比如我们在该用户状态下无法使用`“sudo”`命令，会提示`“blackdn is not in the sudoers file”`。所以我们要在`sudoers`文件中为该用户添加权限。

首先要打开该文件的读写权限：

```bash
root@BlackDn-DESKTOP:~# chmod u+w ../etc/sudoers
```

然后对该文件进行修改：

```bash
root@BlackDn-DESKTOP:~# vi ../etc/sudoers
```

找到`root	ALL=(ALL:ALL) ALL`部分，在这行下面添加`<username> ALL=(ALL:ALL) ALL`，比如我是`blackdn ALL=(ALL:ALL) ALL`

```bash
# User privilege specification
root	ALL=(ALL:ALL) ALL
blackdn ALL=(ALL:ALL) ALL
```

最后关闭该文件的读写权限即可：

```bash
root@BlackDn-DESKTOP:~# chmod u-w ../etc/sudoers
```

## 后话

总之，只要能成功安装Linux并且学会在Linux和Windows之间互相访问，就算成功了  
之后主要就是学习一些Linux命令啦，我曾经也稍稍整理过，传送门：[Linux：基础知识和工具操作](https://blackdn.github.io/2020/03/29/Linux-Basic-Tool-2020/)  
关于WSL还有一些其他操作，比如转移Linux所在的硬盘空间等，因为我用不太到所以就不作示范了  
有需要的可以按照参考的第一篇内容跟着做就行了👇  
新年快乐，元旦快乐♥

## 参考

1. [Windows Subsystem for Linux 2: The Complete Guide](https://www.sitepoint.com/wsl2/)
2. [Windows文档：WSL文档](https://docs.microsoft.com/zh-cn/windows/wsl/)
3. [Windows文档：基本WSL命令](https://docs.microsoft.com/zh-cn/windows/wsl/basic-commands)
4. [Linux系统使用添加新用户后，没有用户目录（没有home）解决办法](https://blog.csdn.net/u013053075/article/details/106070566?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link&utm_relevant_index=2)
5. [xxx is not in the sudoers file.This incident will be reported.的解决方法](https://blog.csdn.net/zsw12013/article/details/51243884)
6. [Linux：基础知识和工具操作](https://blackdn.github.io/2020/03/29/Linux-Basic-Tool-2020/)
