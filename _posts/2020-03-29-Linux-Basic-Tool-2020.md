---
layout: post
title: Linux：基础命令和工具操作
subtitle: Linux相关知识及命令操作
date: 2020-03-29
author: BlackDn
header-img: img/18mon2_07.jpg
catalog: true
tags:
  - Linux
---

> "我与春风皆过客，你携秋水揽星河。"

# Linux：基础命令和工具操作

## 前言

最近多写写东西，希望能把博客更起来  
更重要的是感觉没啥游戏好玩了  
玩啥都是一个人没得小伙伴...

这里主要放一些 Linux 常用的命令  
一下子把这么多命令全学会有些不现实，尽量持续更新  
用到新的命令或新的参数用法再回来补充

## Linux 常见命令

虽然我们把工具和命令分开来说，其实我感觉在 Linux 中他们是一个东西  
如果我们把所有的命令看成是额外需要安装的**包或软件**（分为预安装好的和需要自行安装的），那么他们就是**工具**；如果把所有在命令行使用的工具看成是`.sh`或`.bash`的**运行程序**，那么他们就是**命令**  
感觉本质上他们都是一样的，我就不对“命令”或“工具”作出区分了，偶尔会混用一下

在 Linux 的命令中，很多时候会涉及到**正则表达式**，特别是在匹配或者输出的时候  
关于正则表达式可以看这篇文章：[正则表达式 Regex 及 Java 相关使用](./2022-03-13-Regex-and-Java-2022)  
（下面的命令主要是写一下其常用的简单用法，更多细节和详细参数还是要自己去搜嗷）

- `cat`：查看文件内容
- `grep`：筛选过滤
- `wc`：计数
- `history`：查看历史命令
- `pwd`：显示当前所在的目录
- `type`：判断命令来源（是 bash 内置还是外部程序）
- `chmod`：修改文件权限（具体可见：[Linux 权限及 chmod 命令](../2023-10-10-Linux-User-and-System-2023#linux-权限及-chmod-命令)）
- `chwon`：修改文件所有者
- `chgrp`：修改文件所属组
- `su blackdn`：更改用户（switch user），从当前用户改为用户名为 blackdn 的用户
- `su`：切换为 root 用户，相当于`su root`
- `cd xx`：进入 xx 目录
- `cd ..`：返回上一级目录
- `cd /`：返回根目录
- `ls`： 查看当前目录所有的文件和目录。
- `ls -a`： 查看所有的文件，包括隐藏文件,以.开头的文件。
- `echo`：输出之后的内容
- `echo -n`：输出后不进行换行
- `echo -e`：对引号内特殊字符（`\n`等）进行解释而非原样输出
- `head -n10`：显示结果的前 10 行，等同于`head -10`
- `tail -n10`：显示结果的最后 10 行，等同于`tail -10`
- `mkdir xxx`：创建名为 xxx 的目录
- `rmdir xxx`：删除空目录 xxx
- `rm xxx`：删除文件 xxx
- `rm -r xxx`：清空目录 xxx 下所有文件并删除目录 xxx
- `cp`：复制文件
- `cp 文件 目录`：将文件复制到目录中
- `cp 文件1 文件2`：复制文件 1，并命名为文件 2

- `mv`：重命名或者移动文件或者目录
- `mv 文件名 文件名`：将源文件名改为目标文件名
- `mv 文件名 目录名`：将文件移动到目标目录
- `mv 目录名 目录名`：目标目录已存在，将源目录移动到目标目录；目标目录不存在则改名

- `more`: 类似 `cat` ，不过会以一页一页的形式显示。空格下一页，b 键上一页。
- `more -s`： 当遇到有连续两行以上的空白行，就代换为一行的空白行
- `more +num`： 从第 num 行开始显示
- `more -s +20 testfile`:从第 20 行开始显示 testfile 之文档内容，连续两行以上的空行变为一行空行显示

- `less`：类似`more`，以分页形式查看文件，会进入自己独立的界面，支持支持搜索和正则表达式查找等
- `less -N`：显示行号
- `less -S`：强制换行，不必左右滑动查看文件
- `less -f`：强制显示（包括二进制文件）
- `less file1.txt file2.txt`：多文件查看，可以在多个文件之间切换。

- `date`：显示当前日期时间
- `date "+格式"`：自定义输出格式，比如`date "+%Y-%m-%d %H:%M:%S"`将以`YYYY-MM-DD HH:MM:SS`的格式输出时间
- `date +%s`：显示时间戳
- `date -d "2 days ago"`：日期计算，显示两天前的时间
- `sudo date -s "YYYY-MM-DD HH:MM:SS"`：修改系统时间

- `find`：查找文件
- `find / -group g -user u -size 33c` ：从根目录（`/`）开始查询大小为 33bytes 的文件，其所有组名为`g`，所有用户为`u`

- `which`：查找系统中是否存在指定的可执行程序，并显示程序的绝对路径
- `which ls`：查找是否有`ls`命令，将返回`/usr/bin/ls`，表示 `ls` 命令位于 `/bin` 目录
- `whereis`：用于查找程序的二进制、源代码和帮助页面文件的位置
- `whereis ls`：返回`ls: /usr/bin/ls /usr/share/man/man1/ls.1.gz`，表示`ls`的命令位于`/usr/bin/ls`，同时其帮助文档位于`/usr/share/man/man1/ls.1.gz`

- `netstat`：查看端口
- `netstat -a`：查看所有端口情况
- `lsof -i`：查看所有进程及其占用的端口；`lsof -i :8080`：查看占用 8080 端口的进程
- `kill [PID]`：杀死 PID 所对应的进程（释放端口）

- `ps`：显示当前用户进程
- `ps -u username`：显示特定用户的进程
- `ps -e`：显示全部进程
- `pstree`：以树状结构显示进程
- `ps -ejH`：显示进程信息，且进程名字段通过缩进表示进程的父子关系

- `free`：查看内存使用情况
- `free -h`：让输出更加易读
- `free -s 5`：持续监控内存，每五秒输出一次使用情况

- `top`：实时监视和显示系统的性能和进程信息（进入 top 后按`q`退出）
- `top -u username`：显示特定用户的进程
- 进入 top 后，按`h` 查看帮助信息，显示快捷键和选项等；按 `d` 输入刷新频率，以更改数据刷新的时间间隔；按`Shift-M` 按内存使用率排序；按`Shift-P` 按进程 ID 排序（默认排序方式）。

- `df`：显示磁盘使用情况，包括磁盘的总容量、已使用空间、剩余空间及挂载点等信息。
- `df -h`：让输出更加易读
- `df -l`：只显示本地文件系统，不显示 NFS、SMB 等网络文件系统

- `du directory_name`：查看目录的磁盘使用情况
- `du -h directory_name` ：让输出更加易读
- `du -a directory_name`：显示所有文件和目录的大小

- `lsblk`：查看所有块设备的层次结构和挂载点，以了解系统的存储配置
- `lsblk -f`：让输出更加易读
- `lsblk -d`：只显示块设备，而不包括其子设备（如分区）的信息
- `lsblk /dev/sda`：查看指定设备信息

- `fdisk`：用于管理硬盘分区，对磁盘分区进行创建、删除、修改等。具体操作可见：[Linux 磁盘分区](../2023-10-10-Linux-User-and-System-2023#linux-磁盘分区)

- `shutdown`：关机，默认一分钟后关机
- `shutdown -h now`：立即关机
- `shutdown -t 10`：10s 后关机

- `file [文件名]`：查看文件类型
- `uniq -u`： 上下相邻两行对比得到是否为单一行
- `sort data.txt | uniq -u`：筛选文本唯一行。（sort 将文本的第一列以 ASCII 码的次序排列，再用 uniq 保留只有一行的文本）

- `base64`：进行 base64 的编码解码（没指定文件则从标准输入读取）
- `base64 [文件名]`：将文件内容 base64 编码并打印到标准输出
- `base64 -d [文件名]`：将文件内容 base64 解码并打印到标准输出

- `tr`：用于转换或删除文件中的字符
- `tr 第一字符集 第二字符集`：将文件中第一字符集的字符换为第二字符集的字符（一一对应）
- `cat data.txt | tr 'a-z' 'A-Z'`：将 data.txt 文本中的 a-z 换成 A-Z

- `xxd`: 将一个文件以十六进制的形式显示出来
- `xxd -r data`：将 data 的内容由十六进制转为二进制显示
- `xxd -a -c 12 -g 1 -l 512 -s +0x200 data`：以十六进制显示 data 文件内容，自动跳过空白，每行显示 12 字节，一个字节一块，显示 512 字节内容，从 0x200 开始

菜鸟教程传送门：[Linux 常用命令学习](https://www.runoob.com/w3cnote/linux-common-command-2.html)

## Linux 命令/工具详解

因为有些命令很常用，功能也很强大，所以把它们拿出来单独再详细说说，介绍一下参数用法啥的

### grep 命令

`grep`命令是非常常用也好用的一个命令，用来对文本进行一个筛选或过滤，通常情况下会输出匹配到内容所在的一整行

`Usage: grep [OPTION]... PATTERNS [FILE]...`：`PATTERNS`指的是匹配的表达式，`[FILE]`就是需要查找的文件  
比如我想在`history.log`文件中找到含有`git`的内容：

```bash
blackdn@BlackDn-DESKTOP$ grep "git" history.log
telnet github.com 443
ssh -T git@github.com
git add -p
git commit -m 'commit'
git push
```

当然是支持**正则表达式**的，比如我们只想找以`git`开头的内容：

```bash
blackdn@BlackDn-DESKTOP$ grep "^git" history.log
git add -p
git commit -m 'commit'
git push
```

除了对文件进行查询以外，grep 还可以对已输出的内容进行过滤，这时就不需要指定文件了

```bash
blackdn@BlackDn-DESKTOP$ echo -e "123\n456"
123
456
blackdn@BlackDn-DESKTOP$ echo -e "123\n456" | grep 1
123
```

基本用法如上，常用的参数如下：

| 参数 | 作用                                                               |
| ---- | ------------------------------------------------------------------ |
| `-r` | 递归查找（遇到文件夹不跳过，查找文件夹内的文件内容）               |
| `-n` | 显示匹配行所在行号                                                 |
| `-l` | 只输出存在匹配内容的文件名，而非输出匹配行（常和`-r`一起用）       |
| `-H` | 在显示的匹配行前显示其所在的文件名                                 |
| `-o` | 只输出匹配到的内容，而非输出匹配行（GUN 特有，其他版本不一定支持） |
| `-q` | （`--quiet` / `--silence`）不输出匹配结果                          |
| `-v` | 输出除了匹配成功的内容（取反）                                     |

### cut 命令

`cut`用于选取一串文本中我们想要的一部分，常用参数如下：

| 参数 | 作用                                                   |
| ---- | ------------------------------------------------------ |
| `-b` | 以字节单位进行分割                                     |
| `-c` | 以字符单位进行分割                                     |
| `-f` | 以区域为单位进行分割，区域边界由`-d`指定               |
| `-d` | 指定区域分隔符，默认为制表符（tab）                    |
| `-n` | 常与`-b`一起用，不分割多字节字符（分割中文时比较明显） |

`cut`命令比较常用的就是`-d`和`-f`，这里就拿上面的`wc`举个例子吧：

```shell
root$ wc test.txt
 1  2 12 test.txt
root$ wc test.txt | cut -d ' ' -f2 # 输出行数
1
root$ wc test.txt | cut -d ' ' -f4 # 输出单词数
2
root$ wc test.txt | cut -d ' ' -f5 # 输出字节数
12
root$ wc test.txt | cut -d ' ' -f6 # 输出文件名
test.txt
```

由于`wc`开头带一个空格，行数和单词数中间有两个空格，所以分割后`f1`和`f3`也是空格，所以这里从`f2`开始。

### wc 命令统计行数 / 单词数

wc 命令可以用于统计文件的字节数（Byte），字数或行数，感觉它就是`words count`的缩写  
先举个例子，假设我们的文件中只有一行`Hello world`，不带参数的话`wc`输出的内容为`行数 单词数 字节数 文件名`

```shell
root$ wc test.txt
 1  2 12 test.txt
```

这分表表示`test.txt`中只有一行，有两个单词，共 13B 字节  
需要注意一点的是，由于 Linux 的换行符（LF）和 Windows 的（CRLF）不同，因此对文件的字节大小会有点影响  
比如上面的`test.txt`在 Linux 中是 12B，但我在 Windows 中创建同样的内容，大小就为 13B  
不仅如此，`wc`的**行数**实际上是从 0 开始的，由于 Linux 的文本编辑器（我用的`vim`）会在末尾保留一行空行，因此行数看起来没问题  
在 Windows 记事本中我们可以把末尾空行删掉，这样文件读出来就只有 0 行了。

最后，如果文件内容是中文，`wc`不能准确统计出其文字数。`行数`和`字节数`不变，`单词数`会变为`字符串`的数量，即**被空格（blank space）、制表符（tab）或换行符分隔的字符串**。也就是说，`你好 世界`算是两个字符串，`你好，世界`就只能算一个字符串了。

然后给出常用参数：

| 参数 | 作用                                               |
| ---- | -------------------------------------------------- |
| `-l` | （`--line` / `--lines`）输出结果为`行数 文件名`    |
| `-w` | （`--word` / `--words`）输出结果为`单词数 文件名`  |
| `-c` | （`--chars` / `--bytes`）输出结果为`字节数 文件名` |
| `-L` | 输出最长行的长度和文件名，包括空格，不包括换行     |

### sed 文本处理

`sed`全称为**stream editor**，人们多用它结合正则表达式来对文本进行选择、替换  
和`vim`这种交互式文本编辑器不同，`sed`采用流编辑模式，因此就像一个命令一样，不用打开额外的窗口对文件手动编辑  
现在有个`test.txt`文件，内容只有一行`hello world`，我们先看看用`sed`把`world`替换成`you`

```
sed [options] commands [inputfile...]

root# sed -e 's/world/you/' test.txt
hello you
```

`commands`部分是`sed`的精髓,我们这里是`'s/world/you/'`。`s`是表示替换的子命令，用`you`替换`world`。其中，`world`部分可以用正则表达式表示；而分割线也不一定要是`/`，`s#world#you#`也行，统一就好。  
此外，其末尾有个`flag`位，可选值如下：

- g：全局匹配，会替换文本行中所有匹配的字符串
- n（十进制的一个数）：替换文本行中第 n 个匹配的字符串
- p：替换第一个匹配的字符串，并且将缓冲区输出到标准输出
- w：替换第一个匹配的字符串，并且对文件进行修改
- 啥也不写：替换第一个匹配的字符串

除了`s`外，`sed`还有很多其他的**子命令**：

| 操作 | 作用                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| `p`  | 打印指定内容，通常与`-n`一起用（`-n`取消默认输出，再用`p`输出自己想要的内容） |
| `i`  | 在指定行的前一行插入文本                                                      |
| `a`  | 在指定行的后一行插入文本                                                      |
| `d`  | 删除指定行                                                                    |
| `c`  | 替换指定行                                                                    |
| `s`  | 替换指定/匹配文本                                                             |

这里针对**子命令**给出一些例子，假设有文本`color.list`：

```
black
white
red
blue
```

我们用`p子命令`进行输出：

```shell
root$ sed -n -e '1,3 p' color.list  # 输出1-3行
black
white
red
root$ sed -n -e '$ p' color.list     # 输出最后一行
blue
root$ sed -n -e '/^wh/,$ p' color.list  # 输出wh开头的一行到最后一行
white
red
blue
root$ sed -n -e '1~2 p' color.list # 输出1，3，5，7···行
black
red
```

`'1 p'`代表打印第一行；`'1,3 p'`代表打印 1 到 3 行，最后一行可以用`$`表示  
同样还支持正则，不过在两边要用`/`把表达式包起来。  
还可以用步长的方式输出指定行，格式为`first~step`，`1~2`表示从第一行开始，每两行输出一行，即 1，3，5，7...行

`a`和`i`很相似，就是一个前一个后，直接看例子吧：（其中单个`p`表示打印全部内容）

```shell
root$ sed -n -e '2 i yellow-i' -e '2 a yellow-a' -e 'p' color.list
black
yellow-i
white
yellow-a
red
blue
```

`d`和`c`也比较简单，删除或替换我们指定行的内容  
删除第一行的`black`，把最后一行的`blue`换成`purple`：

```shell
root$ sed -n -e '1 d' -e '$ c purple' -e 'p' color.list
white
red
purple
```

`[options]`部分则是命令的参数，常用参数如下：

| 参数 | 作用                                                                    |
| ---- | ----------------------------------------------------------------------- |
| `-E` | （ `-r` / `--regexp-extended`）启用扩展正则表达式（extended regex）     |
| `-n` | （`--quiet` / `--silent`）取消默认输出（默认情况下 sed 会把结果输出）   |
| `-i` | 对文件进行更改（默认是输出结果，不改文件）                              |
| `-e` | 多点编辑，可以执行多个子命令                                            |
| `-f` | 从脚本文件中读取命令（sed 操作可以事先写入脚本，然后通过-f 读取并执行） |

如果只有一个表达式，那么`-e`是可以省略的，比如直接`sed 's/world/you/' test.txt`  
但是如果有多个，那么就不能省略了。会从左到右依次执行：

```shell
root$ sed -e 's/world/me/' -e 's/me/they/' test.txt
Hello they
```

### awk 编程处理文本

awk 很强大，不过强大的工具都比较难用。名字来自于三个创始人的首字母  
简单来说它可以让我们输入代码并执行，代码是 C 语言

简单来说其结构为：`awk 'BEGIN{} {} END{}'`  
中间的语句块会对所有输入行操作，`BEGIN{}`语句块会在执行前进行一次操作，而`END{}`语句块会在执行结束后执行一次。

东西有点多，暂时不想整理=。=  
这篇文章很好可以看看：[awk](https://wangchujiang.com/linux-command/c/awk.html)

### Curl 工具

参考：[Curl 使用指南](https://www.liuxing.io/blog/curl/)  
`Curl`可以方便的从命令行创建网络请求，多用来进行调试网络请求，查看访问是否正常、返回值是否正常等。它支持 HTTP(S), FTP, SMTP, POP3 等众多协议，可以进行网络请求、上传/下载等操作，且支持 Cookie、用户密码验证、代理隧道、限速等。  
Curl 是一个客户端(client-side)工具，这也是它的名字的由来。（毕竟是客户端去向服务端发送请求嘛）

```shell
curl https://blackdn.github.io/
#输出的是该博客网站的页面代码：
#<!DOCTYPE html>
#<html lang="en">
#<head> ......
```

来看看一些常用参数：

| 参数                | 作用                                      |
| ------------------- | ----------------------------------------- |
| `-L`                | 进行重定向（如果收到 301 等重定向操作时） |
| `-o <file>`         | 将内容存到`file`中（默认放到当前目录）    |
| `-i`                | 展示响应头（也展示响应体）                |
| `-I`                | 只展示响应头（不展示响应体）              |
| `-d "key=value"`    | 构造请求参数，默认为`POST`请求            |
| `-G`                | 声明为`GET`请求                           |
| `-X PUT`            | 更改请求方法，`-X POST`则为`POST`请求     |
| `-A "user-agent"`   | 为请求设置`user agent`                    |
| `-e "source"`       | 为请求设置请求来源`Referer`               |
| `-H key: value`     | 为请求添加请求头                          |
| `-b 'cookie'`       | 为请求添加`Cookie`内容，可以为文件        |
| `--limit-rate 200k` | 显示带宽，默认使用最大带宽                |

## 工具包集成管理：Homebrew

官网：[Homebrew](https://brew.sh/)  
Homebrew 是一个包管理工具，因此我们可以使用它来进行工具/软件的安装和管理。

```shell
# 安装HomeBrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 常用命令
brew help # 查看所有命令
brew install firefox # 安装软件（通过下载源码）
brew install --cask firefox # 安装软件（通过下载安装包，和自己手动下载解压一样）
brew uninstall firefox # 卸载软件
brew list #显示已经安装软件列表
brew services list #显示安装的服务
brew info mysql #查看信息，比如目前的版本，依赖，安装后注意事项等

brew update #更新 Homebrew
brew outdated #列出可升级的软件/包
brew upgrade #更新所有可升级的软件/包
brew upgrade $mysql #更新指定的软件/包
brew cleanup # 清理所有包的旧版本
brew cleanup $mysql #清理指定的软件/包
brew cleanup -n #查看可清理的旧版本软件/包
brew home mysql #用浏览器打开官方主页
```

## 压缩操作

### .gz 文件压缩

- `gzip` ：压缩为.gz 文件
- `gzip -d xxx.gz`：解压 xxx.gz

### .zip 文件

- `zip 压缩包名 文件名`：将文件名压缩为 zip 压缩包
- `zip --password 123 a.zip test.txt`：将 test.txt 压缩为 a.zip，密码为 123
- `unzip 文件名`：解压 zip 文件
- `unzip -P 123 data.zip`：用密码 123 解压 data.zip

### .bz2 文件

- `bzip2`：压缩或解压.bz2 文件
- `bzip2 -k data`：将 data 文件压缩为 data.bz2 并保留 data（不用`-k`会删除 data）
- `bzip2 -d temp.bz2`：解压 temp.bz2

### .tar/.gz 文件

- `tar -czvf test.tar.gz a.c`：压缩 a.c 文件为 test.tar.gz
- `tar -xzvf test.tar.gz` ：解压 test.tar.gz
- `tar -xvf data_6.tar`：解压 data_6.tar

## 命令行辅助操作（快捷键）

在命令行操作的时候可以使用的快捷键（不分大小写）

1. `Tab`：自动补齐（命令或路径，连续按两次可列出全部可选项）
2. 反斜杠`\`：强制换行
3. `Alt` + . ：输出上一个命令的参数
4. `Ctrl + C`：终止当前命令
5. `Ctrl + U`：清空至行首
6. `Ctrl + K`：清空至行尾
7. `Ctrl + W`：删除光标之前的一个单词
8. `Ctrl + C`：终止正在执行的命令
9. `Ctrl + L`：清除屏幕并将当前行移到页面顶部（相当于`clear`）
10. `Ctrl + A`：光标移至行首，不删除命令
11. `Ctrl + E`：光标移至行尾，不删除命令
12. `Ctrl + D`：关闭 Shell 会话

## 关机

虽然但是，我们有很多命令可以实现关机：

- `init 0`：通常在 Unix 系统中使用，处于兼容性原因将其沿用到 Linux。它将系统完全关闭，停止所有运行的进程，卸载文件系统，然后关闭计算机或服务器。但是由于比较老，功能有限（没有提供各种关机选项），而且在某些系统上可能不再受支持，因此**不建议使用**。
- `poweroff`：将会立即关机。它会确保正常卸载文件系统、停止所有运行的进程，并关闭计算机，**建议使用**。
- `halt`：停止系统的运行，但不一定会关闭电源（有点**待机**的意思）。通常需要用户手动再关闭电源。

- `shutdown`：用于计划系统的关机操作，提供了各种选项，功能较多，因此**推荐使用**
- `shutdown -h now`：立即关机
- `shutdown -h 10`：计划十分钟后关机
- `shutdown -c`：取消关机计划
- `shutdown -r now`：立即重启

- `reboot`：重启，等效于`shutdown -r now`
