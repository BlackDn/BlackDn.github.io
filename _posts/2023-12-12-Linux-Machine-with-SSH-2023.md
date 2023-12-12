---
layout: post 
title: Linux 简介 / 虚拟机创建及换源 / ssh 连接及转发 
subtitle: 创建Linux虚拟机，换源，通过ssh进行操作 
date: 2023-12-12 
auther: BlackDn 
header-img: img/21mon8_31.jpg 
catalog: true 
tags:
  - Linux
---

> "星河滚烫，你是人间理想。"

# Linux 简介 / 虚拟机创建及换源 / ssh 连接及转发

## 前言

自己在 **Parallel Desktop** 装了一个 Linux 虚拟机，不过因为用的是 M1 的 Mac（**arm64**架构），在官网只找到了**Linux Server**（只有终端的那种，如果要图形界面得自己额外装，具体可见[Mac M 系列芯片 Parallels Desktop 安装 Ubuntu](https://blog.csdn.net/zhangHP_123/article/details/128908701)）  
所以下面的演示内容均以 Parallel Desktop 中的**ubuntu-22.04.3-live-server**为例

## Linux 简介

在挑选虚拟机的时候，在各个版本里纠结了一会，顺便查了下 Linux 历史、发行版啥的  
查了不能白查，所以在这顺便写一写=v=

我们常说 **“Linux 来自 Unix”**，或说 **“Linux 是 Unix 的一个克隆”**，但这种说法有失偏颇，更准确的表达应该是 **“Linux 是一个 Unix-like 系统”**。  
实际上 Linux 是一个独立的操作系统，并没有直接继承 Unix 代码，但它采用了 Unix 的一些基本设计原则和理念。

**Unix**操作系统在 20 世纪 60 年代构思完成并实现，并在 1970 年首次发布，它获取简单、可移植性高，到 1980 年代末其在在商业领域占主导地位。不过由于大多数商业 **Unix 变种**是闭源的，需要付费或受到严格的许可限制，导致人们开始追求一种更开放、更灵活的操作系统。  
1991 年，**Linus Torvalds**（Linux 创始人）在赫尔辛基上学，据说他不喜欢当时**MINIX**（Mini UNIX，用于教育和研究的小型操作系统）只能在教育研究领域，因此打算自己写一个**虚拟终端**，能够在自己的 MINIX 上访问学校的 Unix 服务器，且不包含任何 MINIX 代码。  
同年 8 月，Linus 将这个系统发布在**Usenet**（一个分布式的互联网交流系统）；9 月，他打算将这个系统命名为 **Freax**，并将其（`0.01`版本）上传到学校的的**FTP 服务器**，但是 FTP 服务器管理员嫌“**Freax**”的名称不好听，就改成了“**Linux**”（没和 Linus 商量就改了），以至于在`Linux 0.01`版本源码中的文件名还是**Freax**，但最终还是以 **Linux** 流传了下来。

1996 年，Linus Torvalds 为 Linux 选定了企鹅作为它的吉祥物（就是那只坐着的企鹅），并为其命名为**Tux**。  
一说是因为 Linus 在澳洲时曾被一座动物园里的小蓝企鹅咬了一口，又有说法是企鹅代表南极，而南极又是全世界所共有的一块陆地，这也就代表 Linux 是所有人的 Linux。

1993 年，**Debian** 项目成立，致力于创建一个 Linux 发行版的社区；1994 年，**Slackware** 和 **Red Hat** 都发布了早期的商业 Linux 发行版，为企业和个人用户提供了更多 Linux 选项。到了 21 世纪，Linux 已经成为了主流的**服务器**操作系统，并开始在云计算、嵌入式系统、移动设备、超级计算和物联网等领域扩展。

Linux 内核的开发仍在持续进行，众多的 Linux 发行版，如 Ubuntu、Debian、Fedora、CentOS 等，为不同的用户需求提供了各种版本和包管理工具。这使得 Linux 成为一种十分 受欢迎的操作系统选择，同时也表现出其开放和灵活的本质。（顺便一提，当初学网络安全的时候用的 **Kali Linux**，里面内置很多安全工具，嘎嘎好用）

### Linux 发行版

所谓 **Linux 发行版**，指的是预先集成好的**Linux 操作系统**，在直接安装之后，只需要小幅度更改设置就可以使用，通常内置了一系列应用软件，以软件包管理器来进行软件管理。  
如今有超过 300 个 Linux 发行版，按照**软件包管理器**的不同来划分，主要可以分为以下几个系列：

- **Debian**系：强调使用自由软件的发行版，使用 **dpkg** 作为软件包管理器，**Ubuntu** （Canonical 公司赞助）和我曾用过的 **Kali** 就属于这门分支。值得注意的是，**Ubuntu** 使用的是自己的软件包库，和 Debian 有所不同，且本身又衍生出许多发行版分支。
- **Red Hat**系：基本上指使用**RPM 格式**软件包的发行版，比较出名的有**Fedora**（Red Hat 公司赞助）及其商业版 **Red Hat Enterprise Linux**，还有**SUSE Linux**及其分支、CentOS 等。
- **Slackware**系：力图成为“UNIX 风格”的 Linux 发行版，只吸收稳定版本的应用程序，缺少定制化配置工具，但更加稳定。

还有一些小众系列就不细说了，还可以根据发行方式分为**商业版 Linux** 和 **社区版 Linux**，更多内容可以查看[Wiki: List of Linux distributions](https://en.wikipedia.org/wiki/List_of_Linux_distributions)。
这里还有一张很炸裂的一览图：[Linux 发行版发布时间线](https://upload.wikimedia.org/wikipedia/commons/8/8c/Linux_Distribution_Timeline_Dec._2020.svg)。太长了就不贴出来了，可以点击链接跳过去看看。

## 给 Linux 换源

这里说一下我给自己 M1 的 Mac 中的 Linux 换源的过程。  
在[中国科学技术大学开源软件镜像](https://mirrors.ustc.edu.cn/)中找到[Ubuntu Ports 源使用帮助](https://mirrors.ustc.edu.cn/help/ubuntu-ports.html)（注意要找针对 M1 芯片的**arm64**架构），按照提示修改配置文件  
在  `/etc/apt/sources.list`  文件中，将软件源的地址改为  `http://mirrors.ustc.edu.cn/ubuntu-ports`，最后有效的就这四行：（可以在修改前先备份，或者打个快照）

```
deb https://mirrors.ustc.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse
```

修改并保存后，更新源并重新下载依赖包：

```
$ sudo apt-get update
```

## 使用 ssh 连接到 Linux

介绍了一下 Linux，我们的**Linux 虚拟机**应该也差不多装好了，现在来进行一下配置，首先是让我们从 Mac 的命令行能直接登录 Linux，这就需要**ssh**了

#### 安装 ssh 并获取 IP 地址

首先要保证我们的本机安装了 **ssh**，我们的 Mac 应该默认就有的，可以在命令行输入`ssh -V`：

```
$ ssh -V
> OpenSSH_9.0p1, LibreSSL 3.3.6
```

如果没有安装可以通过**Homebrew**安装：`brew install ssh`  
或者安装`git`，因为`ssh`是`git`的依赖之一，安装完`git`，`ssh`会一并装上。

然后我的 Linux 是个没有图形界面的虚拟机（Linux Server Parallels Desktop），需要先获取其 IP，输入`ifconfig`命令（如果没有命令就执行 `sudo apt install net-tools` 安装），输出的`enp0s*`就是对应的网卡 IP 信息。比如我的就是`enp0s5`，对应 IPv4 地址为`10.211.55.3`：

```
root:~$ ifconfig
enpOs5: flags=4163<UP, BROADCAST, RUNNING, MULTICAST> mtu 1500
inet 10.211.55.3 netmask 255.255.255.0 broadcast 10.211.55.255
inet6 fdb2:2c26:f4e4:0:21c:42ff:fe9c:f760 prefixien 64
......
```

#### 通过 ssh 连接 Linux

在我们主机通过`ssh [user]@[hostname]`命令来登录主机，`user`对应的是我们使用虚拟机开机登录时输入的用户名，`hostname`则对应的是上面获取的**ip 地址**：

```
ssh blackdn@10.211.55.3
//...第一次登录可能会说什么这个host是未知的，要不要加入到known hosts中啥的
> blackdn@10.211.55.3's password:
//密码输入正确了就登录成功了，弹一些Linux信息啥的
blackdn@root:~$
logout
Connection to 10.211.55.3 closed.
```

然后输入`exit`就可以退出 Linux，回到 Mac 来：

```
blackdn@root:~$ exit
logout
Connection to 10.211.55.3 closed.
```

#### 生成 ssh 密钥并上传

如果觉得每次登录要输入密码很麻烦，我们可以为 Linux 生成一个密钥，用于免密登录。  
在自己机子生成密钥对，默认使用**RSA**加密：

```
ssh-keygen
```

然后会让你选择密钥文件的存储位置、文件名、密码啥的，一般情况下啥也不用输入保持默认就好了（默认文件名为`id_rsa`，我改成了`id_rsa_linux`，我之前给 Github 生成过一个，怕搞混了）。在对应目录会出现两个文件：私钥`id_rsa_linux` 和 公钥`id_rsa_linux.pub`  
然后我们需要把公钥上传到服务器（Linux 虚拟机），命令是：`ssh-copy-id -i [pub_key] [user]@[host]` ，我的话就是：

```
ssh-copy-id -i ~/.ssh/id_rsa_linux.pub blackdn@10.211.55.3
>
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/blackdn/.ssh/id_rsa_linux.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
blackdn@10.211.55.3's password:   //简单输个密码

Number of key(s) added:        1

Now try logging into the machine, with:   "ssh 'blackdn@10.211.55.3'"
and check to make sure that only the key(s) you wanted were added.
```

然后到我们 Mac 机子保存密钥的目录下（默认为`~/.ssh/`），有个 `authorized_keys`文件，查看是否有刚上传的东西，有的话则是成功了。

```
blackdn@root:~$ cat ~/.ssh/authorized_keys
ssh-rsa AAAAB3NzaC1yc2.....
```

接下来再登录就不需要密码了。  
不过要注意的是，如果之前配置过~/.ssh/config 的话（比如[Git 配置多用户](https://blackdn.github.io/2022/10/04/Git-Advance-2022/#%E4%B8%80%E4%B8%AA%E8%AE%BE%E5%A4%87%E9%85%8D%E7%BD%AE%E5%A4%9A%E4%B8%AAgithub%E7%94%A8%E6%88%B7)），需要在其中额外为这次的 Linux 添加配置：

```
# Github ssh
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
User blackdn

# Linux Server VM
Host 10.211.55.3
User blackdn
IdentityFile ~/.ssh/id_rsa_linux
```

上面的**Github ssh**是我之前为 Github 的 ssh 连接配置的，这次我们要为 Linux 添加配置，指定一下 Host（IP 地址）、User（登录账户）和所用的**私钥**密钥文件就好了。

## ssh 使用

### ssh 连接

- `ssh user@hostname`：建立 SSH 连接到远程主机，使用用户名`user`和主机名`hostname`。
- `ssh -p <port> user@hostname`：指定 SSH 连接使用的端口号（默认端口是 22）。
- `ssh -i <private-key> user@hostname`：使用指定的 SSH 私钥文件进行身份验证。
- `ssh -l user hostname`：指定用户名和主机名，等同于 `ssh user@hostname`。
- `ssh -A user@hostname`：启用 SSH 代理转发，以便通过跳板机访问其他主机。
- `logout`：断开连接

### 文件传输

- `scp file user@hostname:remote_path`：使用 SCP 命令将本地文件传输到远程主机。
- `scp user@hostname:remote_path local_path`：从远程主机下载文件到本地计算机。
- `sftp user@hostname`：启动 SFTP 会话，用于交互式地上传和下载文件。

### 端口转发

- `ssh -L <local-port>:<target-host>:<target-port> user@hostname`：本地端口转发，将本地端口映射到远程主机上的服务。
- `ssh -R <remote-port>:<target-host>:<target-port> user@hostname`：远程端口转发，将远程主机上的端口映射到本地计算机上的服务。
- `ssh -D <local-socks-port> user@hostname`：动态端口转发，创建本地 SOCKS 代理服务器，可用于路由流量到远程网络。

### 会话管理

- `ssh -t user@hostname command`：在 SSH 连接上执行特定命令，然后退出。
- `ssh -N -f -L <local-port>:<target-host>:<target-port> user@hostname`：在后台运行 SSH 连接以设置端口转发，不执行远程命令。

值得注意的是，`-f`和`-N`常常一起使用。`-f`让 SSH 在后台运行，以便用户继续使用终端；`-N`表示让 SSH 不要执行任何远程命令，只建立 SSH 连接并设置端口转发，以便仅建立连接而不在远程主机上执行命令。

### 密钥管理

- `ssh-keygen`：生成 SSH 密钥对（公钥和私钥）。
- `ssh-copy-id user@hostname`：将本地 SSH 公钥复制到远程主机的`~/.ssh/authorized_keys` 文件，以便进行无密码登录。

## ssh 转发

**ssh 转发（SSH Forwarding）** 是一种网络安全通信技术，以便在两个计算机之间建立安全的通信通道，进行传输数据或访问网络。大致可分为以下两类：

- **ssh 代理转发（SSH Agent Forwarding）**：主要用于在 SSH 连接之间共享 SSH 密钥以方便跳板机访问，常用于需要通过多个中间服务器（跳板机）访问其他主机的情况。
- **ssh 端口转发（SSH Port Forwarding）**：又称**ssh 隧道（ssh tunnel）**，用于在 SSH 连接上建立端口映射，从而在不暴露远程主机端口的情况下访问远程主机上的网络服务，如数据库服务器、Web 应用等。可以进一步分为**本地端口转发**、**远程端口转发**和**动态端口转发**。

### ssh 代理转发

**ssh 代理转发（SSH Agent Forwarding）** 比较好理解，一个很直观的应用场景就是让我们在 SSH 连接之间共享 SSH 密钥，以便在跳转到其他 SSH 服务器时无需再次输入 SSH 密钥密码。

比如我们想从自己的机器连接**机器 A**，再从 A 连接**机器 B**（A 相当于跳板机），一般来说我们自己要连接 A，那么我们本机要存放 A 的密钥；A 要连接 B，A 中要存放 B 的密钥。

```
Me <---> A <---> B
```

但是由于 A 是跳板机，通常会公开在网络中，或者有多个用户可以连接到 A，那么在 A 中保存密钥是具有安全风险的。更合理的做法是在我们自己的机器中保存 A 和 B 的密钥，以此来免密登录 A 和 B。  
然而上面我们知道，机器 B 直接和机器 A 交流，并不知道我们本机的存在。但是密钥又存在我们本机上，A 上没有，因此会导致认证的失败。为了解决这种问题，就需要**ssh 代理转发**了。

我们需要在机器 A 上建立一个**ssh 代理**，当收到来自 B 的认证请求后，将这个请求转发给我们本机，让本机来处理这个认证。

#### 配置并启用 ssh 代理转发

首先，我们要在本机的 ssh 配置中允许转发，打开`/etc/ssh/ssh_config`配置文件，将`ForwardAgent`设置为`yes`。默认情况下它是被注释的，且值为`no`，我们要取消注释并改成`yes`。

```
......
Host *
    ForwardAgent yes
#   ForwardX11 no
......
```

然后启动代理，并用`ssh-add`添加机器 A 和 B 的**对应私钥**：

```
└─> ssh-agent bash
└─> ssh-add ./id_rsa_linux
Identity added: ./id_rsa_linux
```

最后，在跳板机（机器 A）中，我们要启动 ssh 服务端的代理转发功能。  
在`/etc/ssh/sshd_config`配置文件中，将`AllowAgentForwarding`的值设置为`yes`

配置完成之后，ssh 代理转发就可用了，举个例子，我们可以在本机不需要密码地将`机器A（10.211.55.3）`上的文件复制到`机器B（10.211.55.4）`上：

```
└──> scp blackdn@10.211.55.3:~/test blackdn@10.211.55.4:~/
test     100% 1570     2.3MB/s   00:00
```

### ssh 端口转发

**ssh 端口转发（ssh 隧道）** 和**ssh 代理转发**类似，都是对通信的一种转发手段，使得其更加安全可靠。简单来说，两者的区别在于，**ssh 代理转发**针对的是 ssh 连接，而**ssh 隧道**则针对的是对机器端口的请求。  
上面提到，**ssh 隧道**允许我们在不暴露远程主机端口的情况下访问远程主机上的网络服务，也就是说，如果我们建立了`A机器a端口`到`B机器b端口`的**ssh 隧道**，那么访问`A机器a端口`就相当于访问了`B机器b端口`，与此同时我们保护了`B机器b端口`不被公开，从而提高了安全性。

下面举一个例子，用于演示**本地端口转发**  
假设我们现在有两个机器，一个本机，一个服务器`（10.211.55.3）`。  
服务器上启动了**nginx 服务**，我们希望通过 ssh 隧道，来在本机的`xxx端口`访问到服务器的 nginx 服务。

#### 启动 nginx 服务

在服务器上运行命令 `systemctl status nginx.service`，检测**nginx 服务**是否启动。  
没有启动则运行命令 `systemctl start nginx` 启动服务。  
此外，可以通过访问本机的 nginx 页面查看服务是否能被正常访问：

```
blackdn@root:~$ curl localhost
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
......
```

#### 创建 ssh 隧道

我们在本机执行以下命令来创建**ssh 隧道**：

```
ssh -fNL 12345:10.211.55.3:80 blackdn@10.211.55.3
```

- `-f`：在后台运行 ssh 隧道，常与`-N`连用
- `-N`：创建隧道后不连接到服务端，即留在当前命令行
- `-L`：使用本地端口转发
- `-R`：使用远程端口转发（这里没用到）

后面跟着的参数用于指定隧道两端的端口。因为通过`-L`表明使用本地端口，所以不需要指定本机的地址：

```
本机端口 : 服务器地址 : 服务器端口
```

最后跟一个 ssh 目标的`账号@地址`，执行后这个隧道就创建完了，我们可以通过本机的`12345端口`访问到服务器的**nginx 服务**，可以在浏览器中访问`127.0.0.1:12345`查看是否能访问 nginx 页面。

#### 利用跳板机建立隧道

我们可以进一步提高安全需求：假设我们不能直接访问服务器，不能直接在本机和服务器之间建立隧道，而是需要通过中间跳板机建立隧道——一条我们本机到跳板机的隧道，一条跳板机到服务器的隧道。

其实实现起来十分简单，在`ssh`命令后面加个`-J`参数即可，后面所跟的地址就是我们的跳板机

```
 ssh -fNL 12345:10.211.55.3:80 blackdn@10.211.55.3 -J blackdn@10.211.55.4
```

上述命令就将`10.211.55.4`作为跳板机，先构建了本机`12345`端口到跳板机的隧道，再建立了跳板机到服务器（`10.211.55.3`）的隧道。不过观感上还是和之前一样，访问本机的`127.0.0.1:12345`就可以访问到服务器的 nginx 页面。

如果在公网上有一台自己的机器，且机器开放了对应防火墙，那么在这个公网机器和服务器之间建立隧道，就算是**远程端口转发**了。  
如此一来，我们就可以在家通过访问这个公网机器，来实现比如访问公司内网等操作，这种情景会更加多见。

## 为 Linux VM 配置静态 IP

在`/etc/netpian/`的目录下，不出意外的话应该只有一个`00-installer-config.yaml`文件：

```
root: ^$ cat /etc/netplan/00-installer-config.yaml
>
# This is the network config written by 'subiquity'
network:
	ethernets:
		enp0s5:
			dhcp4: true
	version: 2
```

可以看到目前我们的配置为空，且`dhcp4: true`，说明目前这个机器采用**动态主机配置协议 (DHCP)** 来动态获取 IPv4 的地址。  
我们需要修改该文件，关闭 DHCP 并配置 IP 地址、网关等。  
在这之前我们先要看看当前虚拟机的可用网段，在 Parallels Desktop 中打开当前虚拟机的`设置 -> Hardware 硬件 -> Advanced 高级 -> Network Preferences 网络首选项`，然后就能看到起始/结束地址、子网掩码等消息，从地址范围内挑一个喜欢的作为静态地址。  
我看了下我的网段是`10.211.55.0/24`，我们可以挑个`10.211.55.55`：

```ymal
network:
	ethernets:
	    enp0s5:
		    dhcp4: false   # 关闭DHCP
		    addresses: [10.211.55.5/24]  # 配置IP
		    gateway4: 10.211.55.1   # 配置默认网关
    version: 2
```

由于`yaml`使用缩进表示数据的层次结构和嵌套关系，注意缩进不要弄错了。  
保存后出去重启一下网络配置：

```
$ sudo netplan apply
```

最后可以验证一手，看看网络配置：

```
$ ip address show enp0s5
> inet 10.211.55.5/24 ...
...
```

当`inet`这行显示的地址是我们配置的地址，说明配置是生效了的，可以 ping 一下其他网络看看能不能 ping 通。

## 参考

1. [Wiki: Linux](https://zh.wikipedia.org/wiki/Linux)/ [Wiki: Linux 发行版](https://zh.wikipedia.org/wiki/Linux%E5%8F%91%E8%A1%8C%E7%89%88) / [Wiki: List of Linux distributions](https://en.wikipedia.org/wiki/List_of_Linux_distributions)
2. [Linux 发行版一览图](https://upload.wikimedia.org/wikipedia/commons/8/8c/Linux_Distribution_Timeline_Dec._2020.svg)
3. [Mac M 系列芯片 Parallels Desktop 安装 Ubuntu](https://blog.csdn.net/zhangHP_123/article/details/128908701)
4. [中国科学技术大学开源软件镜像](https://mirrors.ustc.edu.cn/)
5. [SSH 命令的 11 种用法](https://www.linuxprobe.com/ssh-use-11.html)
6. [SSH 三步解决免密登录](https://blog.csdn.net/jeikerxiao/article/details/84105529)
7. [ssh 代理转发](https://www.zsythink.net/archives/2422)
8. [如何在 Ubuntu 22.04 上配置静态 IP 地址？](https://bbs.huaweicloud.com/blogs/406313)
9. 感谢 ChatGPT
