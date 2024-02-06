---
layout: post
title: Linux：用户与系统
subtitle: Linux的用户、组、权限、系统文件结构
date: 2023-10-10
author: BlackDn
header-img: img/19mon5_37.jpg
catalog: true
tags:
  - Linux
---

> "吉下两点一口，又有欠字相依。"

# Linux：用户与系统

## 前言

Linux 一直有在用，却一直没系统地学过这些基础知识，所以来补一补  
也不难，就是想过一遍让自己有点印象  
大部分时间在复制粘贴=。=

## Linux 用户

Linux 系统是一个多用户多任务的分时操作系统，这意味着其允许多个用户同时登录，比如上面我们是用的`blackdn`账号登录，与此同时我们可以再开一个命令行再登录一个新的账号（前提是该账号在 Linux 中已经创建了）  
当然还可以对用户分组，这些管理操作可以帮助管理员分配系统资源权限，也可以帮助用户组织文件，并为用户提供安全性保护。

### 查看用户

因为本地用户信息存储在文件`/etc/passwd`中，其中每一行代表一个用户的登录信息。所以可以通过查看这个文件来看看我们有哪些用户：

```
balckdn@root:~$ cat /etc/passwd
>
root:x:0:0:root:/root:/bin/bash
bin:x:2:2:bin:/bin:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
...
blackdn:x:1000:1000:root:/home/blackdn:/bin/bash
```

可以看到，我们`cat`一下这个文件，呼啦给我们输出了一大串，开玩笑，我刚装的虚拟机，哪来这么多用户，撑死就`root`和`blackdn`两个用户才对。  
先别急，我们先来看看每一行的格式，了解这个文件是如何记录用户信息的。每行有七个字段，它们通过冒号`:`分隔

```
username:password:UID:GID:User Info:home_directory:shell
```

1. `username`：用户的登录名
2. `password`：用户登录的密码。不过现在基本都用一个`x`或`*`占位，表示密码都存储在`/etc/shadow`中
3. `UID`：即**User ID**，用户标识符。一般来说，0 是代表 root 用户，`1～1000`的 UID 通常保留给系统用户和特殊账户，从`1000`开始用于普通用户
4. `GID`：即**Group ID**，组标识符
5. `User Info`：一些我们在创建用户时输入的注释或详细信息，如全名、电话号码等
6. `home_directory`：用户的主目录路径，即用户登录后的起始目录
7. `shell`：用户使用的 shell 程序

那么问题来了，为什么会有那么多用户呢？有些用户名看着甚至不像用户名，而更像我们平常使用的一些命令或程序（如`bin`，`shutdown`，`mail`，`ftp`等）  
实际上，在 `/etc/passwd` 文件中，除了普通用户之外，还会包含一些系统用户或服务账户。这些系统用户不是用来登录系统的，而是用于运行系统服务或执行特定系统任务的账户，比如：

- `bin`：通常用于存储系统二进制文件（可执行文件）
- `shutdown`：用于执行系统关机和重启操作。这个用户通常由关机程序使用。
- `mail`：用于管理邮件系统，包括接收和投递邮件。这个用户通常由邮件服务器程序使用

这些系统服务和特定任务的账户通常具有受限的权限，不允许登录（shell 字段通常被设置为 `/sbin/nologin` 或 `/bin/false`）。一些服务可能会利用这些系统账户来完成某些操作，因此为了支持系统的正常运行，将它们保存在该文件中。

此外，我们还可以用`getent`命令来获取用户信息（`get entities`）。  
`getent`命令用于从系统的各种数据库中检索特定类型的信息（说是数据库，其实就是 Linux 的一些配置信息啦，实际上就是`/etc/`目录下的一些文件内容），包括用户信息（`/etc/passwd`）、组信息`(/etc/group`)、主机信息(`/etc/hosts` )等。  
所以执行`getent passwd`命令结果和上面的`cat /etc/passwd`是一样的，最多就是不用指定目录，所以用起来会稍微方便一点。

```
balckdn@root:~$ getent passwd
>
root:x:0:0:root:/root:/bin/bash
bin:x:2:2:bin:/bin:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
...
blackdn:x:1000:1000:root:/home/blackdn:/bin/bash
```

此外，`getent`命令可以在后面跟一个`key`参数，用来检索更具体的内容，比如后面跟个用户名就可以只看这个用户的信息：

```
getent passwd blackdn
> blackdn:x:1000:1000:root:/home/blackdn:/bin/bash
```

### 创建用户

创建用户有两个命令可以用`adduser`和`useradd`：

- `adduser`：这个命令更加高级、友好、交互性更强，会在执行后提出一系列问题以指定用户密码等信息，同时自动创建家目录（/home/xx）、设置默认 shell 等。简单来说就是**一键式创建用户**。该命令通常在**Debian**和**基于 Debian（比如 Ubuntu）** 的系统上可用
- `useradd`：这个命令更加底层，在各种 Linux 系统中都可用。他的优点就是他的缺点：需要额外手动指定许多选项，如用户名、密码、用户组、家目录、shell 等等。这使得创建用户的过程变得复杂，但也更加灵活。

| `useradd`常用参数  | 意义                                       |
| ------------------ | ------------------------------------------ |
| `-c "comment"`     | 指定一段注释性描述                         |
| `-d /home/xx [-m]` | 指定家目录，如果不存在可以加上`-m`进行创建 |
| `-g`               | 指定用户所属组                             |
| `-G`               | 指定用户所属附加组                         |
| `-s`               | 指定用户登录的 Shell                       |
| `-u`               | 指定用户的标识号（ID）                     |
| `-m`               | 创建用户主目录                             |

因为`adduser`比较简单就不示范了，这里用`useradd`举例：

```
blackdn@root:~$ sudo useradd -m -s /bin/bash -G adm yang
blackdn@root:~$ getent passwd
>
...
blackdn:x:1000:1000:root:/home/blackdn:/bin/bash
yang:x:1001:1002::/home/yang:/bin/bash
```

我们创建了一个名为 yang 的用户，为其生成主目录（`useradd`默认不会生成主目录），指定其`shell`为`bash`，并且将其加入`adm`组中（该组用户能够查看和分析系统的日志信息）。  
通过`passwd`文件我们知道该用户被成功创建了，因为我们没有指定其 UID，所以默认往后加一（`1001`）。然后创建用户后会默认创建一个同名组作为其主组，这个同名组 GID 也是默认加一（`1002`）；然后因为没有用`-d`指定目录名，所以默认主目录和用户同名（`/home/yang`）。

### 修改用户

修改用的命令是`usermod`：

```
usermod 选项 用户名
```

可用的选项和创建用户没什么差别，`-c，-d，-g，-G，-s，-u`等，此外可以用`-i 新用户名`来修改用户名。

```
blackdn@root:~$ sudo usermod -c "test user" -G guests -d /home/yang_home -m yang
blackdn@root:~$ getent passwd
>
...
yang:x:1001:1002:test user:/home/yang_home:/bin/bash
```

上面我们就修改了用户`yang`，为其添加了注释`“test user”`，为其添加附加组`guests`中，并修改其主目录为`/home/yang_home` ，`-m`参数表示将其原来主目录内容迁移到新的主目录下。  
然后可以用`getent group`看一下组信息：

```
blackdn@root:~$ getent group
>
...
guests:x:1001:yang
yang:x:1002:
```

可以看到，`guests`中已经有`yang`用户了。至于`yang`组作为主组，后面是不会跟主组用户的，毕竟它的名字就已经暴露了主组用户这个信息。  
具体组的内容在本文后面。

### 删除用户

删除用户就是要将/etc/passwd 等系统文件中的该用户记录删除，必要时还删除用户的主目录，可以通过`userdel`命令实现。

```
userdel 选项 用户名
```

常用的参数`-r`用于删除系统文件中（`/etc/passwd`，`/etc/shadow`，`/etc/group`等）的记录，同时删除用户的主目录（`/home/xx`）。  
删完可以用`getent passwd`看一下用户还在不在，不在就说明删除成功了。这里就不演示了，下面还要接着用这个用户呢。

### 修改密码

好不容易创建完用户，我想试着登录一下，结果发现，我们上面的创建过程中并没有为用户配置**密码（口令）**。  
事实上，刚创建用户是没有密码的，被系统锁定无法使用，必须为其指定密码后才可以使用（空密码也是允许的）。  
超级用户（root）可以为自己和其他用户指定密码，而普通用户只能用修改自己的密码。使用的命令是`passwd`（如果不加用户名则默认修改自己的密码）：

```
passwd 选项 用户名
```

常用选项如下：

- `-l`：锁定密码，即禁用账号（lock）
- `-u`：对应`-l`，解锁账号（unlock）
- `-d`：使账号无密码
- `-f`：使用户下次登录时修改密码

使用`passwd`后，如果是`root`用户修改别人的密码，那么会直接要求输入新密码；如果是修改自己的密码，则要先输入当前密码，且新密码和当前密码不能相同：

```
blackdn@root:~$ passwd
>
Changing password for blackdn.
Current password:
New password:
Retype new password:
passwd: password updated successfully

blackdn@root:~$ sudo passwd yang
>
New password:
Retype new password:
passwd: password updated successfully
```

### 登录新用户和 root 提权

修改完密码后我们就能登录`yang`用户了，这里要注意一点，如果在创建用户的时候没有通过`-m`来生成主目录，需要先用`mkhomedir_helper`命令来生成，比如：

```
sudo mkhomedir_helper yang
```

然后就可以登录了，用`su`命令来切换用户（`switch user`）：

```
blackdn@root:~$ su yang
> Password:
yang@root:/home/blackdn$ cd ~
yang@root:~$ pwd
/home/yang_home
```

通过`su yang`并输入`yang`的密码后我们就切换到`yang`用户，但是当前路径不变，我们仍在`blackdn`用户的主目录下。在这个目录下我们是没有权限的，甚至连文件夹都看不到进不去。所以我们切换回自己的目录下，可以看到自己的主目录是`/home/yang_home`，和我们配置的一样。

虽然可以成功登录了，但还有个小问题：这个用户没有管理员权限，不能`sudo xxx`：

```
yang@root:~$ cat /etc/sudoers
cat: /etc/sudoers: Permission denied
yang@root:~$ sudo cat /etc/sudoers
[sudo] password for yang:
yang is not in the sudoers file.  This incident will be reported.
```

因此要为其提权，其实这个过程在[《给予 root 的权限》](https://blackdn.github.io/2022/01/01/Linux-in-Windows-2022/#%E7%BB%99%E4%BA%88root%E7%9A%84%E6%9D%83%E9%99%90)里提到过，现在再走一遍，简单来说就是修改`/etc/sudoers`文件（`/etc/sudoers`文件改错了会导致系统无法启动，建议做好备份，虚拟机可以打个快照）。  
`/etc/sudoers` 文件是用于配置 `sudo`命令（`"superuser do"`）命令的配置文件，其定义了**哪些用户**、可以在**哪些主机**上以超级用户（root）权限执行**哪些命令**，从而使管理员精确地控制权限分配。  
（这里插一嘴，之所以有`sudo`这个命令也是出于安全性考虑，它允许管理员授予有限的特权给其他用户，而不必共享`root`密码。）

我们先看看`/etc/sudoers`文件的大致内容：

```
... # 一堆注释
# User privilege specification
root    ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
```

简单来说，每一行的格式是这样的：

```
用户/组 主机=(终端:用户身份) 允许执行的命令
```

所以上面三行的含义就是`root用户/admin组/sudo组`能在任何主机任何终端上以任何用户身份执行任何命令（前面加`%`就表示组）  
`(ALL:ALL)`可以简写为`(ALL)`，表示对用户身份不作限制。  
下面多举两个例子看看：

- `alice ALL=(ALL) NOPASSWD: /sbin/shutdown`：允许用户 "alice" 执行 `shutdown` 命令以关闭系统，而不需要 root 密码
- `bob ALL=(ALL) /bin/ls`：允许用户 "bob" 执行 `/bin/ls` 命令，需要输入自己的密码
- `carol webserver=(ALL) ALL`：允许用户 "carol" 在主机 "webserver" 上执行所有命令：

因为我们的`blackdn用户`已经在`sudo组`中所以可以通过`su`提权，但是`yang`用户不在。因此我们可以将`yang`用户加入`root组`中：

```
blackdn@root:~$ sudo usermod -G sudo yang
blackdn@root:~$ getent group
>
...
sudo:x:27:blackdn,yang
```

或者，我们可以在`/etc/sudoers`文件中为其单独配置一行：

```
# User privilege specification
root	ALL=(ALL:ALL) ALL
yang	ALL=(ALL:ALL) ALL
......
```

两种方法都可以，之后我们再尝试`sudo`提权就可以成功了：

```
yang@root:~$ sudo cat /etc/sudoers
>
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
...
```

## Linux 组

### 查看组

和查看用户类似，可以通过`/etc/group`文件来查看现有的全部组：

```
cat /etc/group
root:x:0:
bin:x:2:
mail:x:8:
...
blackdn:x:1000:
```

其格式如下，分别表示组名称，组密码，GID，属于该组的用户名：

```
groupname:password:GID:user_list
```

需要注意的是，组本身是不需要密码的，但是密码在此仍是一个遗留字段，在大多数情况下，它不会被使用。  
默认情况下，在 Linux 中创建一个用户时，会同时创建一个与其同名的用户组（也称**主要用户组**），以简化用户管理和权限控制。因此我们并没有新建任何组，但`/etc/group`中仍有对应的组，组名还和`/etc/passwd`中的用户名对应。

同样，和用户类似，可以用`getent group`获取组信息，也可以加`key`获取特定组的信息，就不演示了。

如果是查看当前用户所属的用户组，可以使用`groups`命令：

```
blackdn@root:~$ groups
> blackdn adm cdrom sudo dip plugdev lxd
```

### 创建组

和创建用户类似，使用：

```
groupadd 选项 组名
```

常用的参数有：

- `-g GID`：为该组指定一个**组识别号（Group ID，GID）**
- `-o`：允许`-g`指定的 GID 和已有组的 GID 相同

我们创建一个`group`名为`devs`，指定其 GID 为`1025`（注意，可能需要`root`权限）：

```
blackdn@root:~$ sudo groupadd -g 1025 devs
blackdn@root:~$ getent group
>
...
devs:x:1025:
```

可以看到`group`数据中已经多了一个`devs:x:1025:`，只不过里面还没用户。

### 修改组

用 groupmod 命令来修改组的信息（组名、GID 等）

```
groupmod 选项 组名
```

常用参数如下：

- `-g GID`：和创建时类似，指定修改后的 GID
- `-o`：和创建时类似，允许新的 GID 和已有的重复
- `-n`：指定新的组名

把我们之前创建的`devs:1025`改成`developers:1111`（注意提权）：

```
blackdn@root:~$ sudo groupmod -g 1111 -n developers devs
blackdn@root:~$ getent group
>
...
developers:x:1111:
```

### 删除组

用`groupdel`命令删除组：

```
blackdn@root:~$ sudo groupdel developers
```

然后再`getent group`一下就发现我们的组没了，成功删除。

## Linux 权限及 chmod 命令

Linux 的用户分组和权限一直是比较严格的，通常对一个文件来说，其所面对的用户分为三个类别，即**文件所有者、所属组、其他用户**（其实 Windows 也有，但是用到的比较少）。  
同样，对一个用户来说，他所拥有以下三种权限：

| 权限 | 数值 | 作用              |
| ---- | ---- | ----------------- |
| r    | 4    | read，读权限      |
| w    | 2    | write，写权限     |
| x    | 1    | execute, 执行权限 |

当我们在当前目录运行`ll`的时候，在文件或目录前会有一串字母，分别代表其`类型`和`权限`：

```bash
drwxrwxrwx 1 root root 4096 Mar  3 23:46 ./
drwxrwxrwx 1 root root 4096 Mar  3 23:45 ../
-rwxrwxrwx 1 root root  554 Mar  3 23:46 READNEME.md
```

第一个字母表示文件类型，常见的有：`d`表示目录（directory），`l`表示链接文件（link），`-`表示普通文件  
权限则是上面的`rwx`，三个一组，分别表示**文件所有者、所属组、其他用户**的`rwx`权限。

而`chmod`命令则可以对文件的权限进行修改，当然为了保证有“可以修改权限”的权限，所以通常都是 root 用户进行该操作  
u，g，o，a 分别表示**文件所有者（user）**，**所属组（group）**，**其他用户（others）** 和**以上三者（all）**；  
`+`表示增加权限、`-`表示取消权限、`=`表示唯一设定权限；  
`r`表示可读取，`w`表示可写入，`x`表示可执行。

于是，修改一个文件权限的命令就如下：

```bash
# 为test.py的创建者添加可执行权限
chmod u+x test.py
# 为所有用户添加可读取file.txt的权限
chmod a+r file.txt
```

此外还有**八进制**的命令形式，读写执行（rwx）的权限分别用 4、2、1 表示。权限组合就是对应权限值求和，如下：

```
7 = 4 + 2 + 1：      读写运行权限
5 = 4 + 1：          读和运行权限
4 = 4：              只读权限
```

于是，`chmod`还可以这样用：

```bash
# 为test.py文件的文件所有者、群组用户、其他用户三组用户权限设置分别设置为7，7，7（可读、可写、可执行）
chmod 777 test.py
```

### 修改文件所有者和所属组

此外，我们可以用`chown`命令来修改**文件所有者**和**所属组** （除了**所有者**和**所属组**外的用户都属于其他`others`）：

```
chown [–R] 属主名 文件名
chown [-R] 属主名:属组名 文件名
```

`–R`参数用于递归，将更改应用于目录下所有文件  
比如修改文件`test`的**文件所有者**和**所属组**：

```
blackdn@root:~$ ll
-rw-rw-r-- 1 blackdn blackdn    0 Oct 10 11:51 test
blackdn@root:~$ sudo chown yang:yang test
blackdn@root:~$ ll
-rw-rw-r-- 1 yang    yang       0 Oct 10 11:51 test
blackdn@root:~$ sudo chown blackdn test
blackdn@root:~$ ll
-rw-rw-r-- 1 blackdn yang       0 Oct 10 11:51 test
```

如果我们只想修改所属组，可以使用`chgrp`命令

```
chgrp [-R] 属组名 文件名

blackdn@root:~$ chgrp blackdn test
blackdn@root:~$ ll
-rw-rw-r-- 1 blackdn blackdn    0 Oct 10 11:51 test
```

## 系统和文件

### 系统目录结构

其实就是根目录下各个文件夹，看看他们大致有啥用

```
blackdn@root:~$ ls /
bin   dev  home  lost+found  mnt  proc  run   srv  tmp  var
boot  etc  lib   media       opt  root  sbin  sys  usr
```

- `/`：根目录，即 Linux 文件系统的顶层目录，所有其他目录和文件都位于根目录下
- `/bin`：二进制文件（binaries），包含系统启动和运行所需的基本二进制可执行文件，如`ls`、`cp`、`mv`等命令
- `/boot`：包含**引导加载程序（bootloader）** 的文件和内核镜像，用于系统启动
- `/dev`：设备文件（device），用于访问和控制硬件设备，例如磁盘、键盘等
- `/etc`：包含系统级别的配置文件（etcetera），如网络配置、软件包管理配置、用户和组配置等
- `/home`：用户的个人主目录，每个用户都有一个独立的子目录，用于存储其个人文件和设置
- `/lib`：库文件（library），包含系统运行时所需的共享库文件
- `/lost+found`：失物招领文件夹，通常为空，用于系统非法关机后的文件恢复
- `/media`：用于挂载 Linux 识别到的媒体设备（U 盘、光驱等）
- `/mnt`：用于临时**挂载（mount）** 别的文件系统，比如[WSL](https://blackdn.github.io/2022/01/01/Linux-in-Windows-2022/)里通过`/mnt`可以访问 Windows 主机的内容
- `/opt`：用于安装可选软件（optional）的目录，通常由第三方软件包使用，如 ORACLE 数据库等
- `/proc`：是一种**伪文件系统（虚拟文件系统）** ，包含有关正在运行的进程（Process）和系统内核状态的信息
- `/root`：超级用户（root）的个人主目录
- `/run`：包含运行时文件，如进程 ID 文件和套接字文件，用于系统和服务的运行时信息
- `/sbin`：超级用户的二进制文件（superuser bin），包含系统管理员和超级用户使用的系统管理命令，如`ifconfig`和`fdisk`
- `/srv`：包含本地系统提供的服务（service）的相关数据文件，通常由服务软件使用
- `/sys`：虚拟文件系统，用于访问和配置内核参数和硬件设备。其中安装了**Linux2.6 内核**新的文件系统  **sysfs**，集成了针对进程信息的 **proc** 文件系统、针对设备的 **devfs** 文件系统以及针对伪终端的 **devpts** 文件系统。
- `/tmp`：用于存储临时文件的目录（temporary），通常在系统重新启动时被清除
- `/usr`：共享资源目录（unix shared resources），也有称其是用户目录（user），包含很多供用户使用或用户下载的应用程序和文件，类似于 **Windows** 的 `program files` 目录
- `/var`：包含一系列不断扩充的可变数据（variable），如各种日志文件

```
blackdn@root:~$ ls /usr/
bin  games  include  lib  libexec  local  sbin  share  src
```

在`/usr`的文件结构和外面的文件比较类似，比如`/bin`和`/sbin`是供用户使用的应用程序，`/src`是内核源码默认的放置目录等。

### Home 目录

**Home 目录**（`/home`），是用户存储文件、文档、配置文件和个人数据的目录，通常情况下 Home 目录中存有每个用户的**主目录（宿主目录）**。可以看作是一个私有工作区，一般只有本用户才有权限能访问其中的目录和文件（不考虑 root 用户）。

```
yang@root:~$ la /home
blackdn  yang_home
```

默认情况下在创建用户的时候会在`/home`创建一个同名的目录作为当前用户的 Home 目录（比如`/balckdn`），除非自定了目录名或后续进行了修改（比如`/yang_home`）  
通常我们用`~`表示用户的**主目录**，可以通过`cd ~`来快速回到 Home 目录。其中主要有`bashrc`、`.bash_profile`、`.bash_history`、`.ssh`等文件/目录，此外还有`/etc/profile`、`/etc/profile.d/`等相关配置文件/目录，我们简单看一下他们的作用。

```
blackdn@root:~$ ll
total 40
drwxr-x--- 5 blackdn blackdn 4096 Sep 25 17:34 ./
drwxr-xr-x 4 root    root    4096 Sep 28 17:08 ../
-rw------- 1 blackdn blackdn 4076 Oct  9 14:46 .bash_history
-rw-r--r-- 1 blackdn blackdn 3771 Jan  7  2022 .bashrc
drwx------ 2 blackdn blackdn 4096 Oct  9 14:46 .ssh/
......
```

- `.bashrc`：用户级别文件，每个用户都有一个自己的`.bashrc`，每次启动**交互式 Bash Shell** 时该文件会被读取并执行，用于设置用户的个性化的 shell 环境变量、别名和自定义命令等。
- `.bash_profile`：同样是用户级别文件，只会在用户登录时被读取并执行一次，用于设置用户的登录 shell 的环境变量和启动脚本或一些耗时操作。通常，`.bash_profile`会加载`.bashrc`文件，以便在登录 shell 和交互式 shell 中都能应用相同的配置。
- `.bash_history`：用于记录命令行执行命令历史的日志文件，每当用户在终端执行一个命令时，该命令会被追加到`.bash_history`文件中。其文件大小和记录命令数量均可修改。
- `.ssh`：老朋友来的，是存储 SSH 相关配置和密钥文件的目录。通常包含`authorized_keys`（允许通过 SSH 进行身份验证的公钥列表），公私钥文件，`known_hosts`（连接过的远程主机的主机密钥信息），`config`（指定连接选项和自定义 SSH 客户端的配置文件）等文件。

- `/etc/profile`：全局级别文件，在用户登录时被读取并执行，用于设置系统全局环境变量和启动脚本，该文件对所有用户都生效。
- `/etc/profile.d/`：一个目录，包含一系列`.sh`或`.bash`脚本文件，用户登录时会其中的脚本会被执行，用于设置全局范围的环境变量、别名和启动脚本等。

### Linux 磁盘分区

**磁盘分区（Partitioning）** 是将物理磁盘分割成不同部分的过程，每个部分被称为一个分区，每个分区可以独立地格式化、挂载并用于存储文件和数据。  
分区有利于我们组织和管理存储空间，使文件系统更有组织性，提高文件系统的性能。

Linux 将分区分为**主分区（Primary Partition）**，**扩展分区（Extended Partition）** 和 **逻辑分区（Logical Partition）**

- **主分区**：物理硬盘上的基本分区，用于存储文件系统和数据。一个硬盘可以包含多个主分区，但是数量受到**硬盘分区表**的限制，但通常只有一个主分区被标记为**active 激活**（用于启动引导）
- **扩展分区**：由于**主分区**的数量有限，为了增加一个硬盘的分区数量，就有了扩展分区，一个扩展分区可以包含多个**逻辑分区**。虽然一个硬盘可以有多个扩展分区，但通常只有一个（实在不够用就增加**逻辑分区**嘛）
- **逻辑分区**：位于扩展分区内，用于存储文件和数据，且通常数量不受限制
- **分区表（Partition Table）**：记录硬盘分区信息的数据结构，用于标识和管理分区

`fdisk` 是一个用于磁盘分区管理的命令行工具，可用于创建、删除、查看和编辑磁盘分区  
`fdisk -l`会显示系统上所有磁盘的分区信息，包括磁盘设备名称、分区类型、大小等

```
blackdn@root:~$ sudo fdisk -l
Disk /dev/loop0: 109.61 MiB, 114929664 bytes, 224472 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
......
Disk /dev/sda: 64 GiB, 68719476736 bytes, 134217728 sectors
Disk model: Ubuntu Linux Ser
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: A4675FCA-75C1-411C-AE11-C20BDFAD53CD
......
Device       Start       End   Sectors  Size Type
/dev/sda1     2048   2203647   2201600    1G EFI System
/dev/sda2  2203648   6397951   4194304    2G Linux filesystem
/dev/sda3  6397952 134215679 127817728 60.9G Linux filesystem
......
```

`fdisk 磁盘名`会打开该磁盘，进入`fdisk`交互模式，之后就可以进行分区：

```
blackdn@root:~$ sudo fdisk /dev/sda
Welcome to fdisk (util-linux 2.37.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

This disk is currently in use - repartitioning is probably a bad idea.
It's recommended to umount all file systems, and swapoff all swap
partitions on this disk.

Command (m for help): m

Help:

  GPT
   M   enter protective/hybrid MBR
......
Command (m for help):

```

进入交互模式后输入`m`查看指令说明，我这里弹了一个警告，说当前硬盘正在使用中，需要把文件都卸载了（umount）再进行分区操作。所以就不演示了，具体操作可以看：[Ubuntu 挂载新硬盘](https://zhuanlan.zhihu.com/p/35774442)

总之，在交互模式下，输入`n`进行分区创建，`fdisk`交互模式会引导用户，指定创建的是**主分区**还是**扩展分区**、分区数量和分区大小等  
之后，我们需要用`mkfs`格式化分区，`mount`挂载分区到某个目录，这种分区对应的目录称之为**挂载点（Mount Point）**。
最后用`df`命令查看磁盘空间使用情况，显示了我们刚分的区，且挂载点正确，那就说明我们分区成功，能正常使用了。

### Linux 支持的文件系统

不同的操作系统有各自的文件系统，采用不同的方式读取文件。许多文件系统是互不兼容的，比如拿一个**Windows**上操作过的**SD 卡**插到**IOS**中，可能需要你先将其格式化，然后才能用（别问我是怎么知道的，说多了都是泪）  
Linux 能够支持很多文件系统，因此有着良好的兼容性

- `minix`：**Minix**中使用的文件系统，是 Linux 第一个支持的文件系统。
- `ext`：对**minix**文件系统的扩展
- `ext2`：`ext`的升级版，旨在淘汰`ext`，可以理解为`ext`的扩展
- `ext3`：启用日志的`ext2`
- `ext4`：`ext3`的升级版，改进性能和可靠性，提升了卷、文件、目录等最大尺寸，适用于大多数 Linux 发行版
- `hpfs`：**OS/2** 使用的高性能文件系统。由于缺乏可用的文档， 在 Linux 仅对其可读
- `iso9660`：满足 **ISO 9660 标准**的 **CD-ROM 文件系统**类型
- `JFS`：IBM 开发的日志文件系统，从内核 2.4.24 版开始被集成进 Linux
- `msdos`：**DOS**、**Windows**、和一些 **OS/2** 计算机使用的文件系统
- `ncpfs`：支持 **NCP 协议**的网络文件系统
- `nfs`：用于访问位于远程计算机上的磁盘的网络文件系统
- `ntfs`：**Windows**采用的文件系统，其取代了 **FAT 文件系统（VFAT，FAT32）**
- `proc`：伪文件系统，被用作内核数据结构的接口
- `Reiserfs`：日志文件系统
- `smb`：支持 **smb 协议**的网络文件系统
- `sysv`：Linux 中 **SystemV/Coherent 文件系统**的实现
- `umsdos`：Linux 使用的扩展**DOS 文件系统**
- `vfat`：**Windows95** 和 **Windows NT** 使用的扩展 **DOS 文件系统**
- `XFS`：日志文件系统，适用于高性能计算和大规模存储环境
- `xiafs`：旨在通过扩展 Minix 文件系统来提高稳定性和安全性，但由于不再活跃开发和维护，已从内核 `2.1.21` 及之后被移除

## 参考

1. [Linux 用户和用户组管理](https://www.runoob.com/linux/linux-user-manage.html)
2. [Linux 列出所有用户](https://www.myfreax.com/how-to-list-users-in-linux/)
3. [Linux 列出组与成员](https://www.myfreax.com/how-to-list-groups-in-linux)
4. [Create Home Directory for Existing Users in Linux](https://linuxhandbook.com/create-home-directory-existing-user)
5. [Linux 文件系统](https://manpages.ubuntu.com/manpages/jammy/zh_CN/man5/fs.5.html)
6. [HowtoPartition/PartitioningBasics](https://help.ubuntu.com/community/HowtoPartition/PartitioningBasics)
7. [Ubuntu 挂载新硬盘](https://zhuanlan.zhihu.com/p/35774442)
8. 感谢 ChatGPT
