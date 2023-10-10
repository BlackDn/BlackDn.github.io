---
layout:       post  
title:        Linux：基础知识和工具操作  
subtitle:     Linux相关知识及命令操作  
date:         2020-03-29   
auther:       BlackDn  
header-img:   img/18mon2_07.jpg   
catalog:      true  
tags:  
    - Linux  
---

> "我与春风皆过客，你携秋水揽星河。"

# Linux：基础知识和工具操作

## 前言

最近多写写东西，希望能把博客更起来  
更重要的是感觉没啥游戏好玩了  
玩啥都是一个人没得小伙伴...

这里主要放一些Linux尝试和用到的Linux命令  
由于linux命令很多很多很多，所以不会马上全部po上来，遇到新的就更新一点点   
反正是给自己看的=。=

## Linux目录

1. /：根目录 
2. /bin：存放必要的命令 
3. /boot：存放内核以及启动所需的文件
4. /dev：存放设备文件 
5. /etc：存放系统配置文件 
6. /home：普通用户的宿主目录，用户数据存放在其主目录中 
7. /lib：存放必要的运行库 
8. /mnt：存放临时的映射文件系统，通常用来挂载使用。
9. /proc：存放存储进程和系统信息 
10. /root：超级用户的主目录 
11. /sbin：存放系统管理程序 
12. /tmp：存放临时文件
13. /usr：存放应用程序，命令程序文件、程序库、手册和其它文档。 
14. /var：系统默认日志存放目录  

## 变量

### 环境变量

1. $PATH：主要是命令的搜索路径，比如一些`/bin`的路径都在其中
2. $SHELL：当前使用的解析器（`/bin/bash`等）
3. $PWD：当前工作目录（和`pwd`命令结果相同）
4. $HOME：当前用户的`/home`目录路径
5. $PS1：当前终端显示前缀（`\u`代表用户，`\H`代表主机，`\W`代表目录）

`export`可以新建或修改当前命令行的变量（在新的命令行中不生效）。比如如果我们想修改当前命令行的**前缀**可以进行如下操作：

```
root@BlackDn-DESKTOP:/mnt/c/Users/BlackDn# export PS1='\u \$'
root #
```

以上方法是暂时的，如果想要永久生效，需要在`/root/.bashrc`文件中增加这一行（`export PS1='\u \$'`）

此外，`env`命令可以显示所有环境变量，而`set`命令可以显示所有本地定义的变量（包括环境变量和其他的变量）；而`unset`则可以删除某个环境变量。

### 特殊变量

| 特殊变量 | 说明                          |
| ---- | --------------------------- |
| `$?` | 上一条语句/命令的退出码。执行成功则为0，失败则为非0 |
| `$$` | 保存当前Shell进程的ID              |
| `$_` | 保存上一条语句/命令的最后一个参数           |
| `$!` | 保存上一个后台执行的异步命令的进程 ID        |
| `$0` | 保存当前 Shell 的名称              |
| `$-` | 保存当前 Shell 的启动参数            |
| `$#` | 保存脚本的参数数量                   |
| `$@` | 保存脚本的参数值                    |

## Linux操作命令

在Linux的命令中，很多时候会涉及到**正则表达式**，特别是在匹配或者输出的时候  
关于正则表达式可以看这篇文章：[正则表达式Regex及Java相关使用](https://blackdn.github.io/2022/03/13/Regex-and-Java-2022/)

### grep命令

`grep`命令是非常常用也好用的一个命令，用来对文本进行一个筛选或过滤，通常情况下会输出匹配到内容所在的一整行

`Usage: grep [OPTION]... PATTERNS [FILE]...`：`PATTERNS`指的是匹配的表达式，`[FILE]`就是需要查找的文件  
比如我想在“history.log”文件中找到含有`git`的内容：

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

除了对文件进行查询以外，grep还可以对已输出的内容进行过滤，这时就不需要指定文件了

```bash
blackdn@BlackDn-DESKTOP$ echo -e "123\n456"
123
456
blackdn@BlackDn-DESKTOP$ echo -e "123\n456" | grep 1
123
```

基本用法如上，常用的参数如下：

| 参数   | 作用                                 |
| ---- | ---------------------------------- |
| `-r` | 递归查找（遇到文件夹不跳过，查找文件夹内的文件内容）         |
| `-n` | 显示匹配行所在行号                          |
| `-l` | 只输出存在匹配内容的文件名，而非输出匹配行（常和`-r`一起用）   |
| `-H` | 在显示的匹配行前显示其所在的文件名                  |
| `-o` | 只输出匹配到的内容，而非输出匹配行（GUN特有，其他版本不一定支持） |
| `-q` | （`--quiet` / `--silence`）不输出匹配结果   |
| `-v` | 输出除了匹配成功的内容（取反）                    |

### cut命令

`cut`用于选取一串文本中我们想要的一部分，常用参数如下：

| 参数   | 作用                            |
| ---- | ----------------------------- |
| `-b` | 以字节单位进行分割                     |
| `-c` | 以字符单位进行分割                     |
| `-f` | 以区域为单位进行分割，区域边界由`-d`指定        |
| `-d` | 指定区域分隔符，默认为制表符（tab）           |
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

### wc命令统计行数 / 单词数

wc命令可以用于统计文件的字节数（Byte），字数或行数，感觉它就是`words count`的缩写  
先举个例子，假设我们的文件中只有一行`Hello world`，不带参数的话`wc`输出的内容为`行数 单词数 字节数 文件名`

```shell
root$ wc test.txt
 1  2 12 test.txt
```

这分表表示`test.txt`中只有一行，有两个单词，共13B字节  
需要注意一点的是，由于Linux的换行符（LF）和Windows的（CRLF）不同，因此对文件的字节大小会有点影响  
比如上面的`test.txt`在Linux中是12B，但我在Windows中创建同样的内容，大小就为13B  
不仅如此，`wc`的**行数**实际上是从0开始的，由于Linux的文本编辑器（我用的`vim`）会在末尾保留一行空行，因此行数看起来没问题  
在Windows记事本中我们可以把末尾空行删掉，这样文件读出来就只有0行了。

最后，如果文件内容是中文，`wc`不能准确统计出其文字数。`行数`和`字节数`不变，`单词数`会变为`字符串`的数量，即**被空格（blank space）、制表符（tab）或换行符分隔的字符串**。也就是说，`你好 世界`算是两个字符串，`你好，世界`就只能算一个字符串了。

然后给出常用参数：

| 参数   | 作用                                    |
| ---- | ------------------------------------- |
| `-l` | （`--line` / `--lines`）输出结果为`行数 文件名`   |
| `-w` | （`--word` / `--words`）输出结果为`单词数 文件名`  |
| `-c` | （`--chars` / `--bytes`）输出结果为`字节数 文件名` |
| `-L` | 输出最长行的长度和文件名，包括空格，不包括换行               |

### 其他常用命令

- su blackdn：更改用户（switch user），从当前用户改为用户名为blackdn的用户  
  su：默认改为root用户，相当于`su root`

- cd xx：进入xx目录  
  cd ..：返回上一级目录  
  cd /：返回根目录  

- type：判断命令来源（是bash内置还是外部程序）

- ls： 查看当前目录所有的文件和目录。  
  ls  -a 查看所有的文件，包括隐藏文件,以.开头的文件。  

- echo：输出之后的内容  
  echo -n：输出后不进行换行
  echo -e：对引号内特殊字符（\\n等）进行解释而非原样输出

- pwd：显示当前所在的目录。

- mkdir xxx：创建名为xxx的目录

- rmdir xxx：删除空目录xxx

- rm xxx：删除文件xxx  
  rm -r xxx：清空目录xxx下所有文件并删除目录xxx

- cp：拷贝文件。    
  cp 文件 目录：将文件复制到目录中  
  cp 文件1 文件2：将文件1复制在当前文件夹，命名为文件2  
  cp 目录1 目录2：将目录1及其内容复制到目录2中

- mv：重命名或者移动文件或者目录  
  mv 文件名 文件名：将源文件名改为目标文件名  
  mv 文件名 目录名：将文件移动到目标目录  
  mv 目录名 目录名：目标目录已存在，将源目录移动到目标目录；目标目录不存在则改名  

- cat：查看文件内容
- history：查看历史命令

- netstat：查看端口  
  `netstat -a`：查看所有端口情况  

- `lsof -i`：查看所有进程及其占用的端口；`lsof -i :8080`：查看占用8080端口的进程
- `kill [PID]`：杀死PID所对应的进程（释放端口）

- shutdown：关机，默认一分钟后关机  
  `shutdown -h now`：立即关机  
  `shutdown -t 10`：10s后关机  

- `file [文件名]`：查看文件类型
- `xdg-open`：打开图片  
- `uniq -u`： 上下相邻两行对比得到是否为单一行  
  `sort data.txt | uniq -u`：筛选文本唯一行。（sort将文本的第一列以ASCII码的次序排列，再用uniq保留只有一行的文本）

- find：查找文件  
  `find / -group g -user u -size 33c` ：从根目录（/）开始查询大小为33bytes的文件，其所有组名为g，所有用户为u  

- base64：进行base64的编码解码（没指定文件则从标准输入读取）  
  `base64 [文件名]`：将文件内容base64编码并打印到标准输出   
  `base64 -d [文件名]`：将文件内容base64解码并打印到标准输出   

- tr：用于转换或删除文件中的字符   
  tr 第一字符集 第二字符集：将文件中第一字符集的字符换为第二字符集的字符（一一对应）  
  `cat data.txt | tr 'a-z' 'A-Z'`：将data.txt文本中的a-z换成A-Z  

- xxd: 将一个文件以十六进制的形式显示出来  
  `xxd -r data`：将data的内容由十六进制转为二进制显示  
  `xxd -a -c 12 -g 1 -l 512 -s +0x200 data`：以十六进制显示data文件内容，自动跳过空白，每行显示12字节，一个字节一块，显示512字节内容，从0x200开始  

- more: 类似 cat ，不过会以一页一页的形式显示。空格下一页，b键上一页。  
  -num 一次显示的行数  
  -s 当遇到有连续两行以上的空白行，就代换为一行的空白行  
  +num 从第 num 行开始显示  
  more -s +20 testfile:从第 20 行开始显示 testfile 之文档内容，连续两行以上的空行变为一行空行显示  

- `head -n10`：显示结果的前10行，等同于`head -10`
- `tail -n10`：显示结果的最后10行，等同于`tail -10`

## 一些好用的工具

因为很多工具是要额外下载的，所以这里新开一栏放一些工具的使用命令，让上面命令的那部分少一些。

### 工具包集成管理：Homebrew

官网：[Homebrew](https://brew.sh/)  
Homebrew是一个包管理工具，因此我们可以使用它来进行工具/软件的安装和管理。  
其实Mac里的开发者工具Xcode和其比较类似，但是因为XCode太大了（好像有几十个G吧），所以很多时候人们选择用Homebrew来安装需要的工具。

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

### sed文本处理

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
- n（十进制的一个数）：替换文本行中第n个匹配的字符串
- p：替换第一个匹配的字符串，并且将缓冲区输出到标准输出
- w：替换第一个匹配的字符串，并且对文件进行修改
- 啥也不写：替换第一个匹配的字符串

除了`s`外，`sed`还有很多其他的**子命令**：

| 操作  | 作用                                           |
| --- | -------------------------------------------- |
| `p` | 打印指定内容，通常与`-n`一起用（`-n`取消默认输出，再用`p`输出自己想要的内容） |
| `i` | 在指定行的前一行插入文本                                 |
| `a` | 在指定行的后一行插入文本                                 |
| `d` | 删除指定行                                        |
| `c` | 替换指定行                                        |
| `s` | 替换指定/匹配文本                                    |

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

`'1 p'`代表打印第一行；`'1,3 p'`代表打印1到3行，最后一行可以用`$`表示  
同样还支持正则，不过在两边要用`/`把表达式包起来。  
还可以用步长的方式输出指定行，格式为`first~step`，`1~2`表示从第一行开始，每两行输出一行，即1，3，5，7...行

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

| 参数   | 作用                                                     |
| ---- | ------------------------------------------------------ |
| `-E` | （ `-r` / `--regexp-extended`）启用扩展正则表达式（extended regex） |
| `-n` | （`--quiet` / `--silent`）取消默认输出（默认情况下sed会把结果输出）         |
| `-i` | 对文件进行更改（默认是输出结果，不改文件）                                  |
| `-e` | 多点编辑，可以执行多个子命令                                         |
| `-f` | 从脚本文件中读取命令（sed操作可以事先写入脚本，然后通过-f读取并执行）                  |

如果只有一个表达式，那么`-e`是可以省略的，比如直接`sed 's/world/you/' test.txt`  
但是如果有多个，那么就不能省略了。会从左到右依次执行：

```shell
root$ sed -e 's/world/me/' -e 's/me/they/' test.txt
Hello they
```

### awk编程处理文本

awk很强大，不过强大的工具都比较难用。名字来自于三个创始人的首字母  
简单来说它可以让我们输入代码并执行，代码是C语言

简单来说其结构为：`awk 'BEGIN{} {} END{}'`  
中间的语句块会对所有输入行操作，`BEGIN{}`语句块会在执行前进行一次操作，而`END{}`语句块会在执行结束后执行一次。

东西有点多，暂时不想整理=。=  
这篇文章很好可以看看：[awk](https://wangchujiang.com/linux-command/c/awk.html)

### Curl工具

参考：[Curl 使用指南](https://www.liuxing.io/blog/curl/)  
`Curl`可以方便的从命令行创建网络请求，多用来进行调试网络请求，查看访问是否正常、返回值是否正常等。它支持HTTP(S), FTP, SMTP, POP3等众多协议，可以进行网络请求、上传/下载等操作，且支持 Cookie、用户密码验证、代理隧道、限速等。  
Curl是一个客户端(client-side)工具，这也是它的名字的由来。（毕竟是客户端去向服务端发送请求嘛）

```shell
curl https://blackdn.github.io/
#输出的是该博客网站的页面代码：
#<!DOCTYPE html>
#<html lang="en">
#<head> ......
```

来看看一些常用参数：

| 参数                  | 作用                         |
| ------------------- | -------------------------- |
| `-L`                | 进行重定向（如果收到301等重定向操作时）      |
| `-o <file>`         | 将内容存到`file`中（默认放到当前目录）     |
| `-i`                | 展示响应头（也展示响应体）              |
| `-I`                | 只展示响应头（不展示响应体）             |
| `-d "key=value"`    | 构造请求参数，默认为`POST`请求         |
| `-G`                | 声明为`GET`请求                 |
| `-X PUT`            | 更改请求方法，`-X POST`则为`POST`请求 |
| `-A "user-agent"`   | 为请求设置`user agent`          |
| `-e "source"`       | 为请求设置请求来源`Referer`         |
| `-H key: value`     | 为请求添加请求头                   |
| `-b 'cookie'`       | 为请求添加`Cookie`内容，可以为文件      |
| `--limit-rate 200k` | 显示带宽，默认使用最大带宽              |

## Linux权限及chmod命令

Linux的用户分组和权限一直是比较严格的，通常对一个文件来说，其所面对的用户分为三个类别，即**文件创建者、创建者所属组、其他用户**（其实Windows也有，但是用到的比较少）。  
同样，对一个用户来说，他所拥有以下三种权限：

| 权限  | 数值  | 作用            |
| --- | --- | ------------- |
| r   | 4   | read，读权限      |
| w   | 2   | write，写权限     |
| x   | 1   | execute, 执行权限 |

当我们在当前目录运行`ll`的时候，在文件或目录前会有一串字母，分别代表其`类型`和`权限`：

```bash
drwxrwxrwx 1 root root 4096 Mar  3 23:46 ./
drwxrwxrwx 1 root root 4096 Mar  3 23:45 ../
-rwxrwxrwx 1 root root  554 Mar  3 23:46 READNEME.md
```

第一个字母表示文件类型，常见的有：`d`表示目录（directory），`l`表示链接文件（link），`-`表示普通文件  
权限则是上面的rwx，三个一组，分别表示**文件创建者、创建者所属组、其他用户**的rwx权限。

而`chmod`命令则可以对文件的权限进行修改，当然为了保证有“可以修改权限”的权限，所以通常都是root用户进行该操作  
u，g，o，a分别表示**文件创建者（user）**，创建者所属组（group），**其他用户（others）**和**以上三者（all）**；  
`+`表示增加权限、`-`表示取消权限、`=`表示唯一设定权限；  
`r`表示可读取，`w`表示可写入，`x`表示可执行。

于是，修改一个文件权限的命令就如下：

```bash
# 为test.py的创建者添加可执行权限
chmod u+x test.py
# 为所有用户添加可读取file.txt的权限
chmod a+r file.txt
```

此外还有**八进制**的命令形式，读写执行（rwx）的权限分别用4、2、1表示。权限组合就是对应权限值求和，如下：  

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

## 添加用户并给予sudo权限

源于一个小bug，在Linux中添加了用户，结果该用户没有`/home`目录，还不能进行sudo操作

在Linux中添加用户有两个命令，分别是`useradd`和`adduser`。其中，`useradd`比较低级不推荐使用，我就是用这个命令才导致上面的那个bug。  
如果已经用useradd并产生以上bug，建议先用`userdel` 用户名删除用户，再用`adduser`添加用户。

```shell
root$ userdel blackdn
root$ adduser blackdn
正在添加用户"blackdn"...
·····（中间省略一堆输出）
请输入新值，或直接敲回车键以使用默认值
        全名 []: 
        房间号码 []:
        工作电话 []:
        家庭电话 []:
        其它 []:
这些信息是否正确？ [Y/n] y
```

该方法建立的用户应该是有`/home`目录的，不过可能还是不能进行`sudo`操作，为此我们要编辑`/etc`目录下的`sudoer`文件

```shell
root$ vim /etc/sudoers

# User privilege specification
root    ALL=(ALL:ALL) ALL
blackdn ALL=(ALL:ALL) ALL （新增）
```

在上面这行新增一行，内容为改变前面的用户名为新增用户的名字即可（`用户名 ALL=(ALL:ALL) ALL`） 

## 压缩操作

1. .gz文件  
   gzip ：压缩为.gz文件  
   gzip -d xxx.gz，解压xxx.gz  

2. .zip文件  
   zip 压缩包名 文件名：将文件名压缩为zip压缩包  
   zip --password 123 a.zip test.txt：将test.txt压缩为a.zip，密码为123  
   unzip 文件名：解压zip文件  
   unzip -P 123 data.zip：用密码123解压data.zip  

3. .bz2文件  
   bzip2：压缩或解压.bz2文件  
   bzip2 -k data：将data文件压缩为data.bz2并保留data（不用-k会删除data）  
   bzip2 -d temp.bz2：解压temp.bz2  

4. .tar/.gz文件  
   tar:用来建立，还原备份文件的工具程序，它可以加入，解开备份文件内的文件  
   tar -czvf test.tar.gz a.c：压缩 a.c文件为test.tar.gz  
   tar -xzvf test.tar.gz ：解压test.tar.gz  
   tar -xvf data_6.tar：解压data_6.tar  
   （.gz需要命令-z解压）  

## 命令行辅助操作（快捷键）

1. Tab：自动补齐（命令或路径，连续按两次可列出全部可选项）
2. 反斜杠“\”：强制换行
3. Alt + . ：输出上一个命令的参数
4. Ctrl + C：终止当前命令
5. Ctrl + U：清空至行首
6. Ctrl + K：清空至行尾
7. Ctrl + W：删除光标之前的一个单词
8. Ctrl + C：终止正在执行的命令  
9. Ctrl + L：清除屏幕并将当前行移到页面顶部（相当于`clear`）
10. Ctrl + A：光标移至行首，不删除命令
11. Ctrl + E：光标移至行尾，不删除命令
12. Ctrl + D：关闭Shell会话

## Linux文本操作（vi/vim）

vi和vim都是linux的文本编辑器，vim比vi更加高级  

基本上 vi/vim 共分为三种模式，分别是**命令模式（Command mode）**，**输入模式（Insert mode）**和**底线命令模式（Last line mode）**。 

#### 命令模式

启动 vi/vim进入命令模式  

1. vim xxx：编辑xxx文件（若无则先创建）
2. i：切换到输入模式，以输入字符
3. x：删除当前光标所在处的字符
4. “：”：切换到底线命令模式，以在最底一行输入命令  
5. u：撤销上次操作（类似常用的ctrl+z）
6. ctrl+r：取消上次撤销（类似常用的ctrl+y）

#### 输入模式

按 i 进入输入模式  

1. BACK SPACE（退格键）：删除光标前一个字符
2. DEL（删除键）：删除光标后一个字符
3. HOME/END：移动光标到行首/行尾
4. Page Up/Page Down：上/下翻页
5. Insert：切换光标为输入/替换模式
6. ESC：退出输入模式，切换到命令模式  

#### 底线命令模式

按 ：进入底线命令模式  

1. :w ：保存文本
2. :q：退出编辑器
3. :wq：保存并退出
4. :q!：不保存退出
5. :e!：还原为初始状态
6. :set nu：显示行号
7. :set nonu：不显示行号
8. 小写v：字符选择模式
9. 大写V：行选择模式
10. y：复制；p：粘贴（常和以上两种选择模式结合使用）
