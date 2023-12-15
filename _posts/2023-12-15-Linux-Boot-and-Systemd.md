---
layout: post
title: Linux启动流程和systemd使用
subtitle: Linux启动流程一览，systemd的由来及使用
date: 2023-12-15
auther: BlackDn
header-img: img/21mon8_37.jpg
catalog: true
tags:
  - Linux
---

> "从此一别两宽，各自欢喜。虽非经久不衰，却最浓墨重彩。"

# Linux启动流程和systemd使用


## 前言

之前介绍了Linux，创建了自己的虚拟机，非常实操  
这次就换个口味，整一篇纯理论的文章  
说实话，感觉这篇文章写完后估计我自己都不会怎么来看=。=  

## Linux 开机启动流程

当Linux系统启动后，系统固件进行硬件初始化，并将控制权移交给**引导加载程序（boot loader）** ，如 `systemd-boot`或者 `GRUB`

- **systemd-boot**：也称**gummiboot**，是由**systemd项目**维护的引导加载程序，设计简单，轻量级，专注于快速引导，不提供很多高级选项，适用于用户希望引导过程尽可能简单的情况。
- **GRUB**：即**GRand Unified Bootloader**，功能丰富且强大，支持Linux、Windows等多种操作系统。它有更多的配置选项，允许用户选择不同的内核、引导参数和操作系统。GRUB有一个更广泛的用户社区和生态系统，适合那些需要高度可定制引导过程的用户。

**boot loader**从磁盘/网络/固件上调用操作系统**内核**，通常内核会通过由**dracut**挂载的内存文件系统，如今基本上是 **initramfs** 这个临时文件系统（Init RAM File System）。以前用的是固化磁盘（RAM Disk），称为**initrd**（Init RAM Disk），不过现在说 **initrd** 基本上也指的是 **initramfs**，后文将不作区分，知道是文件系统就好了。

- **Dracut**：一个用于初始化 **RAM 文件系统（initramfs）** 的工具，通常用于 Linux 发行版中作为启动过程的一部分。**Initramfs** 是一个临时文件系统，加载到内存中，以便进行初始化、设备探测和准备工作，以便成功挂载并引导到**根文件系统**。

在找到并挂载根文件系统后，**initrd** 将控制权交给存储在根文件系统中的**系统管理器（system manager）**，比如 **systemd**，后者负责探测所有剩余的硬件、挂载所有必要的文件系统和生成所有已配置的服务。  

- **systemd**：用于 Linux 操作系统的初始化系统及系统管理套件，使用广泛，取代了传统的 **SysV** 初始化系统，提供了更多的功能和性能优势，如高度并行化、以单元（unit）的形式管理系统服务、现代化日志等。

在关机时，**system manager** 停止所有服务，卸载所有文件系统（同时分离文件系统和存储设备），然后跳回 initrd 代码，卸载/分离根文件系统及其所在的存储，最后系统关闭电源。

```
系统固件 -> boot loader -> initrd/initramfs (by dracut) -> system manager
```

### System Manager 引导启动

在启动时，操作系统映像上的 **system manager** 负责初始化系统运行所需的文件系统、服务和驱动程序。在 **systemd** 系统中，这个过程分为各种离散的**target units**，因此可以高度并行运行，提高启动速度。

当 **systemd** 启动系统时，它将激活所有作为`default.target`的依赖单元。`default.target`包含了 **systemd** 引导过程中一系列默认的单元，决定了哪些系统服务和单元会在系统引导后自动启动。  
通常情况下， `default.target` 指向一个特定的目标单元，如**多用户模式（ multi-user.target）**、**图形用户界面模式（graphical.target）**，或其他自定义系统状态。  

![System Manager Bootup](https://z1.ax1x.com/2023/10/16/piCNzdI.png)

### User Manager 启动

**system manager**会为每个用户启动 `user@uid.service` 单元，这个单元会启动一个独立的 systemd 实例，我们称这个实例为**用户管理器（user manager）**   
和 **system manager** 类似，**user manager** 也通过 `default.target` 启动一系列单元。如果用户使用的是图形化界面，还会通过 `graphical-session.target` 引入图形界面所需的单元.

![User Manager Bootup](https://z1.ax1x.com/2023/10/16/piCNXsH.png)

### initrd/initramfs 初始化流程

**systemd** 会检查文件 `/etc/initrd-release` 来判断自己是否已在 **initrd** 中运行，当 **system manager** 启动到 `basic.target`，**systemd** 会启动 `initrd.target`。不过在这之前，还需要做一系列检查工作   
在挂载文件系统之前，系统首先通过 `systemd-hibernate-resume@.service`  判断自己是从**休眠中恢复**还是**正常引导启动**，这一步会在达到上述**System Manager启动流程**中的 `local-fs-pre.target` 之前完成，以确保检查完成前不会有文件系统挂载。   
当根设备变为可用时，达到 `initrd-root-device.target`，如果根设备可以挂载到 `/sysroot`，进而启动 `sysroot.mount`，达到 `initrd-root-fs.target`。之后服务 `initrd-parse-etc.service` 运行并扫描 `/sysroot/etc/fstab`，查找可`/usr/` 挂载点和被标记为 `x-initrd.mount` 的条目，将查找到的所有条目都挂载到 `/sysroot` 下。   
然后达到 `initrd-fs.target`，启动 `initrd-cleanup.service` 服务，该服务会隔离运行`initrd-switch-root.target`，用于运行一系列清理服务。  
最后，`initrd-switch-root.service`启动，系统改变**根文件系统**的位置为 `/sysroot`，准备将初始 RAM 磁盘迁移到真正的根文件系统。

![INITRD Bootup](https://z1.ax1x.com/2023/10/16/piCNxeA.png)


### 系统关机

![System Manager Shutdown](https://z1.ax1x.com/2023/10/16/piCNjLd.png)

不难发现，这些服务/单元基本对应着Linux的几个关机命令。  
`systemd-halt.service`、`systemd-reboot.service`、`systemd-poweroff.service` 和`systemd-kexec.service` 将卸载剩余所有的文件系统，终止全部进程并释放资源。

## 设置开机自启脚本：记录开机时间

我们将尝试通过 `/etc/rc.local` 脚本来执行一些我们希望在每次开机时执行的操作。每次机器启动时，`systemd-rc-local-generator` 会通过 `rc-local.service` 来执行这个脚本，所以先来认识一下他们。

```
systemd-rc-local-generator -> rc-local.service -> /etc/rc.local
```

`systemd-rc-local-generator` 是一个生成器，用于检查 `/etc/rc.local` 是否存在并可执行，如果是的话，会将 `rc-local.service` 单元引入引导过程，该单元会在引导的后期运行`/etc/rc.local`。  
在老版的 **System V （SysV）** 系统中，`rc-local.service` 会在引导的最后一个步骤执行`/etc/rc.local`，进行额外的初始化工作，如设置环境变量、启动特定服务等。但在**systemd** 中，这个步骤会和大部分其他服务并行执行（但会在`network.target`之后运行）

不过需要注意的是，如今 `/etc/rc.local` 主要功能是为了兼容**SysV**，在非必需的情况下，建议尽量不使用该脚本，你看**Ubuntu 20.04**都默认是关闭`rc-local.service`服务，不存在`/etc/rc.local` 脚本文件的（所以下面的示范还得自己创建）

### 配置服务和脚本

首先我们在 `/lib/systemd/system/rc-local.service` 文件的最后添加以下内容（用vim写入可以加`sudo`，避免其他用户没有写入权限）：

```
[Install]
WantedBy=multi-user.target
```

当我们达到多用户模式 （`multi-user.target`）的时候，启动`rc-local.service`服务，从而执行`/etc/rc.local`脚本。简单来说就是在进入**命令行**的时候执行`/etc/rc.local`脚本。 

这样就实现了在系统引导完成后，在用户登录之前运行`/etc/rc.local`脚本，但是仔细一看，尬住，我们还没有`/etc/rc.local`这个脚本文件，所以要先创建一个。  
然后我们想每次脚本执行都记录时间，且写入`/tmp/boot_time.txt`文件，所以在脚本中添加以下内容（用vim写入可以加`sudo`，避免其他用户没有写入权限）：

```
#!/usr/bin/env bash
echo "[`date`], hello world" >> /tmp/boot_time.txt
```

保存退出后发现我们创建的这个 `/etc/rc.local` 没有执行权限，需要为其加上：

```
blackdn@root:/etc$ ll | grep 'rc.local'
-rw-r--r--  1 root root         51 Oct 17 11:32 rc.local
blackdn@root:/etc$ sudo chmod a+x rc.local
blackdn@root:/etc$ ll | grep 'rc.local'
-rwxr-xr-x  1 root root         51 Oct 17 11:32 rc.local*
```

然后我们启动`rc-local.service`服务，会在`systemd/system/`创建一个软链接：

```
blackdn@root:/etc$ sudo systemctl enable rc-local.service
Created symlink /etc/systemd/system/multi-user.target.wants/rc-local.service → /lib/systemd/system/rc-local.service.
```

查看服务状态，显示 `loaded` 和 `enabled` 就行：

```
blackdn@root:/etc$ sudo systemctl status rc-local.service
○ rc-local.service - /etc/rc.local Compatibility
     Loaded: loaded (/lib/systemd/system/rc-local.service; enabled; vendor preset: enabled)
     ......
     Active: active (exited) since Tue 2023-10-17 11:50:49 CST; 2h 38min ago
	 ......
```

最后重启系统，在 `/tmp` 目录下会出现 `boot_time.txt`，且内容是系统启动的时间，脚本成功执行。

## systemd

上面说了这么多，都是围绕 **systemd** 来的，我们却还没正式介绍它。  
之前提到，**systemd** 以**单元（unit）** 的形式管理系统服务，先来看看什么是**Unit**


### systemd 由来及命令

在 **systemd** 出现以前，那会还是 **SysV** 系统的时代，我们常用 `service` 命令来启动服务（现在也用）：

```
service apache2 start
# 或者
sudo /etc/init.d/apache2 start
```
 
这两种启动服务的方式其实是一样的，因为在**SysV**系统中，所有服务脚本都存在`/etc/init.d`目录下，而`service`命令就是去`/etc/init.d`目录中寻找对应的服务脚本并运行。  
虽然上面两种方法都可以启动服务，但还是推荐使用 `service` 命令，因为它移除了许多参数，让脚本更简单，并将根目录作为工作路径，从而带来一个可控的运行环境。

```
# 启动服务/停止服务/重启服务/查看服务状态
service apache2 start/stop/restart/status
```

不过，在**SysV**系统中，由于所有服务进程是串行启动的，因此启动时间较长；而且系统不跟踪进程的状态，脚本需要自己处理各种情况，这往往使得脚本变得很长。  
为了解决这些缺点，**systemd** 问世，字母`d`是**守护进程（daemon）** 的缩写，在系统初始化完成后，**systemd**会创建一个守护进程，成为系统的第一个进程（PID为1），而其他进程都是它的子进程。

```
blackdn@root:~$ ps -e
    PID TTY          TIME CMD
      1 ?        00:00:01 systemd
      ......
```

**systemd** 的优点是功能强大，使用方便，缺点是体系庞大，非常复杂。也因此有许多人反对使用`systemd`，认为其过于复杂，与操作系统耦合过强，违反`"keep simple, keep stupid"`的Unix 哲学。  
不管怎样，**systemd** 用于大多数Linux发行版是不争的事实，所以来看看它的命令使用吧。当然只会列出一些常用命令，更多细节还是需要自己查一查。（下面内容和阮一峰的[Systemd 入门教程：命令篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)内容大同小异，可以选择性跳过）

#### systemctl

`systemctl`是 Systemd 的主命令，用于管理系统。（system control）

```
# 暂停/重启系统/关闭系统
$ sudo systemctl suspend/reboot/poweroff

# 让系统进入冬眠状态
$ sudo systemctl hibernate

# 让系统进入交互式休眠状态
$ sudo systemctl hybrid-sleep

# 启动进入救援状态（单用户状态）
$ sudo systemctl rescue
```

#### systemd-analyze

`systemd-analyze`命令用于查看耗时

```
# 查看启动耗时
$ systemd-analyze

# 查看每个服务的启动耗时
$ systemd-analyze blame

# 显示瀑布状的启动过程流
$ systemd-analyze critical-chain

# 显示指定服务的启动流
$ systemd-analyze critical-chain atd.service
```

#### hostnamectl

`hostnamectl`命令用于查看当前主机的信息

```
# 显示当前主机的信息
$ hostnamectl

# 设置主机名。
$ sudo hostnamectl set-hostname rhel7
```

#### localectl

`localectl`命令用于查看本地化设置。

```
# 查看本地化设置
$ localectl

# 设置本地化参数。
$ sudo localectl set-locale LANG=en_GB.utf8
$ sudo localectl set-keymap en_GB
```

#### timedatectl

```
# 查看当前时区设置
$ timedatectl

# 显示所有可用的时区
$ timedatectl list-timezones 

# 设置当前时区
$ sudo timedatectl set-timezone America/New_York
$ sudo timedatectl set-time YYYY-MM-DD
$ sudo timedatectl set-time HH:MM:SS
```

#### loginctl

`loginctl`命令用于查看当前登录的用户。

```
# 列出当前session
$ loginctl list-sessions

# 列出当前登录用户
$ loginctl list-users

# 列出显示指定用户的信息
$ loginctl show-user ruanyf
```

### 单元 Unit

在 **systemd** 中，**单元（unit）** 是系统中各种组件和任务的抽象表示。单元用于描述系统中的各种元素，如服务、设备、目标等，以便 **systemd** 可以管理它们的启动、停止、依赖关系等。  
简单来说，**systemd** 中的不同的资源统称为 **Unit（单元）**，一共可分为12种：

1. **Service unit**：系统服务
2. **Target unit**：多个 Unit 构成的一个组
3. **Device Unit**：硬件设备
4. **Mount Unit**：文件系统的挂载点
5. **Automount Unit**：自动挂载点
6. **Path Unit**：文件或路径
7. **Scope Unit**：不是由 **Systemd** 启动的外部进程
8. **Slice Unit**：进程组
9. **Snapshot Unit**：**Systemd** 快照，可以切回某个快照
10. **Socket Unit**：进程间通信的 socket
11. **Swap Unit**：swap 文件
12. **Timer Unit**：定时器

我们可以通过`systemctl list-units`命令来筛选和查看所需的 **Unit**

```
# 列出正在运行的 Unit
$ systemctl list-units

# 列出所有Unit，包括没有找到配置文件的或者启动失败的
$ systemctl list-units --all

# 列出所有没有运行的 Unit
$ systemctl list-units --all --state=inactive

# 列出所有加载失败的 Unit
$ systemctl list-units --failed

# 列出所有正在运行的、类型为 service 的 Unit
$ systemctl list-units --type=service
```

当然，**systemd** 有还有许多针对 **Unit** 的操作

#### 查看 Unit 状态

`systemctl status`命令用于查看系统或 Unit 的状态。

```
# 显示系统状态
$ systemctl status

# 显示单个 Unit 的状态
$ sysystemctl status bluetooth.service

# 显示远程主机的某个 Unit 的状态
$ systemctl -H root@rhel7.example.com status httpd.service
```

此外，`systemctl`还提供了三个查询状态的简单方法，一般都是在脚本中使用

```
# 判断某个 Unit 是否正在运行
$ systemctl is-active application.service

# 判断某个 Unit 是否处于启动失败状态
$ systemctl is-failed application.service

# 判断某个 Unit 服务是否建立了启动链接
$ systemctl is-enabled application.service
```

#### 管理 Unit

这里的命令用到的比较多，通常是用于启停 `apache`，`nginx`，`mysql` 等一些服务

```
# 立即启动/重启/停止一个服务
$ sudo systemctl start/stop/restart apache.service

# 杀死一个服务的所有子进程
$ sudo systemctl kill apache.service

# 重新加载一个服务的配置文件
$ sudo systemctl reload apache.service

# 重载所有修改过的配置文件
$ sudo systemctl daemon-reload

# 显示某个 Unit 的所有底层参数
$ systemctl show httpd.service

# 显示某个 Unit 的指定属性的值
$ systemctl show -p CPUShares httpd.service

# 设置某个 Unit 的指定属性
$ sudo systemctl set-property httpd.service CPUShares=500

# 列出一个 Unit 的所有依赖
$ systemctl list-dependencies nginx.service

# 列出一个 Unit 的所有依赖，且展开 target 类型依赖
$ systemctl list-dependencies --all nginx.service
```

### Unit 的配置文件


每一个 Unit 都有一个配置文件，告诉 Systemd 怎么启动这个 Unit 。   
**Systemd** 默认从目录`/etc/systemd/system/`读取配置文件。但是，里面存放的大部分文件都是符号链接，指向目录`/usr/lib/systemd/system/`，真正的配置文件存放在那个目录。  
通常文件的后缀名对应着 **Unit**  的种类，比如`sshd.socket`是一个**Socket Unit**，`clamd@scan.service`是一个**Service Unit**。如果没有写后缀名，默认会被视为**Service Unit**。

`systemctl enable`命令用于在上面两个目录之间，建立符号链接关系（相当于开机自动启动）；同理，`systemctl disable`命令就是取消这个链接（取消开机自动启动）

```
# 建立链接
$ sudo systemctl enable clamd@scan.service
# 等同于
$ sudo ln -s '/usr/lib/systemd/system/clamd@scan.service' '/etc/systemd/system/multi-user.target.wants/clamd@scan.service'

# 取消链接
$ sudo systemctl disable clamd@scan.service

# 列出所有配置文件
$ systemctl list-unit-files

# 列出指定类型的配置文件
$ systemctl list-unit-files --type=service
```

当我们用 `systemctl list-unit-files` 命令查看配置文件时，会输出一个列表用来显示每个文件的状态，共有四种：

- **enabled**：已建立启动链接
- **disabled**：没建立启动链接
- **static**：该配置文件没有`[Install]`部分（无法执行），只能作为其他配置文件的依赖
- **masked**：该配置文件被禁止建立启动链接

如果修改了配置文件，记得要重新加载并且重启对应的服务

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart httpd.service
```

### 配置文件结构

**Unit** 各自的配置文件和我们上面配置开机启动脚本时看到的`/lib/systemd/system/rc-local.service`结构是一样的，毕竟`rc-local.service`本身就是一个**Service Unit**   
虽然我们可以用文本编辑器或`cat`等命令查看配置文件，但是很多时候我们懒得去找（毕竟`/lib/systemd/system`里面有一大堆配置文件呢），这时候可以用`systemctl cat`命令来查看

```
$ systemctl cat rc-local.service
......
[Unit]
Description=/etc/rc.local Compatibility
....

[Service]
Type=forking
....

[Install]
WantedBy=multi-user.target
....
```

可以看到，大致的结构如下（键值对的等号`=`两侧不能有空格）：

```
[Section]
Directive1=value
Directive2=value
......
```

#### `[Unit]`区块

`[Unit]`区块通常是配置文件的第一个区块，用来定义 **Unit** 的元数据，以及配置与其他 Unit 的关系，其主要字段如下：

- `Description`：简短描述
- `Documentation`：文档地址
- `Requires`：当前 Unit 依赖的其他 Unit，如果它们没有运行，当前 Unit 会启动失败
- `Wants`：与当前 Unit 配合的其他 Unit，如果它们没有运行，当前 Unit 不会启动失败
- `BindsTo`：与`Requires`类似，它指定的 Unit 如果退出，会导致当前 Unit 停止运行
- `Before`：如果该字段指定的 Unit 也要启动，那么必须在当前 Unit 之后启动
- `After`：如果该字段指定的 Unit 也要启动，那么必须在当前 Unit 之前启动
- `Conflicts`：这里指定的 Unit 不能与当前 Unit 同时运行
- `Condition...`：当前 Unit 运行必须满足的条件，否则不会运行
- `Assert...`：当前 Unit 运行必须满足的条件，否则会报启动失败

#### `[Service]`区块

`[Service]`区块用来 Service 的配置，只有 **Service** 类型的 **Unit** 才有这个区块。它的主要字段如下：

- `Type`：定义启动时的进程行为。它有以下几种值。
- `Type=simple`：默认值，执行`ExecStart`指定的命令，启动主进程
- `Type=forking`：以 fork 方式从父进程创建子进程，创建后父进程会立即退出
- `Type=oneshot`：一次性进程，Systemd 会等当前服务退出，再继续往下执行
- `Type=dbus`：当前服务通过D-Bus启动
- `Type=notify`：当前服务启动完毕，会通知`Systemd`，再继续往下执行
- `Type=idle`：若有其他任务执行完毕，当前服务才会运行
- `ExecStart`：启动当前服务的命令
- `ExecStartPre`：启动当前服务之前执行的命令
- `ExecStartPost`：启动当前服务之后执行的命令
- `ExecReload`：重启当前服务时执行的命令
- `ExecStop`：停止当前服务时执行的命令
- `ExecStopPost`：停止当其服务之后执行的命令
- `RestartSec`：自动重启当前服务间隔的秒数
- `Restart`：定义何种情况 Systemd 会自动重启当前服务，可能的值包括`always`（总是重启）、`on-success`、`on-failure`、`on-abnormal`、`on-abort`、`on-watchdog`
- `TimeoutSec`：定义 Systemd 停止当前服务之前等待的秒数
- `Environment`：指定环境变量

#### `[Install]`区块

`[Install]`通常是配置文件的最后一个区块，用来定义如何启动，以及是否开机启动。它的主要字段如下：

- `WantedBy`：它的值是一个或多个 Target，当前 Unit 激活时（enable）符号链接会放入`/etc/systemd/system`目录下面以 Target 名 + `.wants`后缀构成的子目录中
- `RequiredBy`：它的值是一个或多个 Target，当前 Unit 激活时，符号链接会放入`/etc/systemd/system`目录下面以 Target 名 + `.required`后缀构成的子目录中
- `Alias`：当前 Unit 可用于启动的别名
- `Also`：当前 Unit 激活（enable）时，会被同时激活的其他 Unit

## 参考

1. [Ubuntu: bootup - System bootup process](https://manpages.ubuntu.com/manpages/jammy/man7/bootup.7.html)
2. [Ubuntu：systemd-rc-local-generator](https://manpages.ubuntu.com/manpages/jammy/man8/systemd-rc-local-generator.8.html)
3. [Ubuntu 22.04 设置开机自启脚本](https://blog.csdn.net/qq_41588556/article/details/128418888)
4. [The Difference Between Systemctl and Service Command in Linux](https://www.baeldung.com/linux/differences-systemctl-service)
5. [Systemd 入门教程：命令篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
6. 感谢ChatGPT