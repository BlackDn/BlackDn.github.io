---
layout: post
title: Git基本操作及连接Github
subtitle: 勉强算是搞懂了git基础
date: 2022-03-08
author: BlackDn
header-img: img/19mon5_23.jpg
catalog: true
tags:
  - Git
  - Tutorial
---

> "两手空空，眼眶红红，蠢蠢欲动。"

# Git 基本操作及连接 Github

## 前言

其实在古早时期写过一篇类似的文章：[Git 与 Github 的连接与使用](../2019-05-28-Git-Github-Use-2019)  
但是那时候其实也是搞不太清  
最近自己用的多了，想着应该没啥问题了吧，所以来重新梳理一下，都是些自己的理解  
本内容只局限于基本使用，深度有限，如果看不起本文，或者想要深入学习，在文末给出了一些我觉得比较不错的 git 学习资源  
不过这东西一搜一大把=。=

## Git 基本操作

Git 本身是一个版本控制工具，而根据其大致的操作流程，人们常将其分为**本地 git**和**远程 git**。  
为了对命令本身有一个大致的印象，我们先从简单的本地 git 入手  
Git 的安装就不多说了， 人家有自己的安装包的，所以不同操作系统下的 git 命令都差不多  
这边有个常用 Git 命令汇总可以看看：[Git 指令整理](../2017-02-15-Git-Command-Arrangement)

### Git 创建本地仓库

```
用到的命令：
git init：创建git仓库
```

为了方便操作，下面的演示都在 WSL 的 Linux 中进行（[WSL：Windows 自带 Linux 使用指南](../2022-01-01-Linux-in-Windows-2022)）

首先最基本的操作是创建一个本地 git 仓库，命令是`git init`：  
这里建议用 root 用户创建噢，不然可能会因为权限问题而报错。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git init
Reinitialized existing Git repository in /mnt/f/GitTest/git-test/.git/
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# ll
total 0
drwxrwxrwx 1 root root 4096 Mar  7 12:13 ./
drwxrwxrwx 1 root root 4096 Mar  7 12:13 ../
drwxrwxrwx 1 root root 4096 Mar  7 12:14 .git/
```

可以看到，在执行`git init`之后，我们的当前文件夹下就多了个隐藏文件夹`.git`  
有这个文件就代表当前文件夹一个**git 仓库**，而这个隐藏文件夹就是用来保存我们的版本信息，用于版本更新、回退等操作  
所谓“版本”，其实就是当前仓库的历史记录。我们创建了新文件后，可以是一个版本；删除文件后，可以是一个版本；修改文件，可以是一个版本。Git 就是帮助我们在这些版本之间穿梭的工具。  
接下来我们开始对文件进行修改。

### Git 进行修改、提交

```
用到的命令：
git status：查看git状态（是否有修改，修改是否提交等）
git add：确认修改
git commit：提交并保存修改
git diff：查看修改内容
```

我们先创建一个文件`test.txt`，里面有一行`“Hello world”`（用 vim 编辑的过程省略了）

```shell
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# touch 'test.txt'
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# ll
total 0
drwxrwxrwx 1 root root 4096 Mar  7 13:27 ./
drwxrwxrwx 1 root root 4096 Mar  7 12:13 ../
drwxrwxrwx 1 root root 4096 Mar  7 12:14 .git/
-rwxrwxrwx 1 root root    0 Mar  7 13:27 test.txt*
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# cat test.txt
Hello world
```

这个时候我们运行`git status`，来查看当前 git 的状态

```shell
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        test.txt

nothing added to commit but untracked files present (use "git add" to track)
```

这里提示我们的`test.txt`是**Untracked files**，并且还没有任何提交（`No commits yet`）  
还提示我们使用`git add <file>...`来进行提交，这里就是 git 的核心用法了：`git add`和`git commit`

#### git add 和 git commit 提交修改

事实上，git 内部划分了三个区域，分别为**工作区（working directry）**，**暂存区（stage index）**，**历史记录区（history）**，名字没什么官方翻译，随便起的。  
**工作区**实际上就是我们正在操作、进行修改的地方；  
当我们用`git add`命令后，git 就会保存我们到目前为止所作的更改，并放入**暂存区**中保存；  
而`git commit`则是将我们在**暂存区**的内容提交至**历史记录区**，成为一个新的版本。  
说白了就是，`git add`告诉 git 我们对某些文件确实进行了修改，而且这些修改是我们想要保存的；而`git commit`则是让 git 保存这些修改。

而上面用到的`git status`则是查看这些区域的状态，查看我们在这些区域里有哪些文件。

接下来我们对`test.txt`进行 add 和 commit 操作：

```shell
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git add test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   test.txt

root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git commit -m "add test.txt"
[master (root-commit) 885f71d] add test.txt
 1 file changed, 1 insertion(+)
 create mode 100644 test.txt
 root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
nothing to commit, working tree clean
```

可以看到，我们进行了 add 和 commit 之后，git 显示`nothing to commit, working tree clean`，即所有修改都被提交到**历史记录区**。现在是一个新的版本，所以在有新的修改以前，git 没有显示任何记录。  
在用`git commit`提交的时候，我们常用参数`-m`来添加提交的消息，就像是版本更新之后我们得发布通告，告诉别人我们更新了什么，所以常用简单的一两句话概括。

#### git diff 查看修改内容

接下来我们尝试修改`test.txt`，在其中多加一句话。  
如何快速查看我们修改了什么呢？这时候就可以使用`git diff`命令  
该命令将会比较当前修改的文件和之前提交的文件有什么区别，前面是`+`则代表新添加的内容，而`-`则代表删去的内容

```shell
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# cat test.txt
Hello world

I am learning git.
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git diff
diff --git a/test.txt b/test.txt
index 802992c..7a52701 100644
--- a/test.txt
+++ b/test.txt
@@ -1 +1,3 @@
 Hello world
+
+I am learning git.
```

这里我们看到，`test.txt`中多加了一行空行和一行`I am learning git.`

#### git add 的便利操作

```
git add . ：提交所有修改文件
git add -p ：分区块查看修改内容，并判断是否提交
```

在前面的提交中，我们采用的是`git add <filename>`的操作，这样可以指定提交某个文件。但是当文件很多的时候，我们可以用`git add .`来一次性 add 所有修改的文件（`.`表示当前目录，`..`表示上级目录）

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   test.txt
        modified:   test_another.txt

no changes added to commit (use "git add" and/or "git commit -a")
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git add .
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   test.txt
        modified:   test_another.txt
```

我们有两个文件，`test.txt`和`test_another.txt`，都被修改了。而用`git add .`，我们一次性将两者的修改都进行提交，就不用再写两次了。

此外，有时候我们修改了许多东西，然后想要看看修改内容，再进行提交。这时候先用`git diff`，再用`git add .`，会显得有些麻烦。为此，我们可以使用`git add -p`  
`git add -p`结合了`git diff`和`git add .`，它将每一个修改的代码块看成一个片段（hunk），并对每个片段单独显示修改内容，交给用户来判断是否需要进行提交。  
比如我们又尝试修改`test.txt`和`test_another.txt`：

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git add -p
diff --git a/test.txt b/test.txt
index 7a52701..c43d55f 100644
--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
 Hello world

-I am learning git.
+What am i doing?
(1/1) Stage this hunk [y,n,q,a,d,e,?]? y

diff --git a/test_another.txt b/test_another.txt
index ef0882e..a81c719 100644
--- a/test_another.txt
+++ b/test_another.txt
@@ -1 +1,3 @@
 I am another test
+
+Hello my dear.
(1/1) Stage this hunk [y,n,q,a,d,e,?]? y

root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   test.txt
        modified:   test_another.txt
```

我们有两个片段。第一个是`test.txt`，我们删掉了一行`I am learning git.`，并添加了一行`What am i doing?`；第二个是`test_another.txt`，添加了一个空行和一行`Hello my dear.`  
每个片段进行判断时，有几个选项可以选择：`[y,n,q,a,d,e,?]`

```
y - （yes），stage this hunk，确认修改当前片段
n - （no），do not stage this hunk，不确认修改当前片段
q - （quit），quit; do not stage this hunk or any of the remaining ones，不确认修改当前片段并退出
a - （all），stage this hunk and all later hunks in the file，确认修改本文件当前及之后的片段
d - （do not），do not stage this hunk or any of the later hunks in the file，不确认修改本文件当前及之后的片段
e - （edit），manually edit the current hunk，手动编辑当前片段
? - print help，输出帮助
```

更多参数可以用`git add -h`，`git commit -h`进行查看。

### git 回退操作

```
git restore：git add的逆操作
git restore --staged：git commit的逆操作
```

之前说的都是对修改的确认和保存操作，当然还得有反悔的操作。

我们`git commit`完后，觉得现在 commit 好像还太早，还有其他地方一起修改完再 commit，那么可以用`git restore --staged <filename>`操作，当然`git restore --staged .`也是可以的  
执行完后`git commit`的内容会变为`git add`的内容，不过文件的内容是不会变的。（只是从**保存修改**变为**确认修改**的状态）

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git restore --staged test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   test.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

然后，我们可以接着回退`git add`的操作，觉得这个文件还是不改的好，想让文件变回去  
这时可以使用`git restore <filename>`操作，当然`git restore .`也是可以的：

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   test.txt

no changes added to commit (use "git add" and/or "git commit -a")
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# cat test.txt
Hello world

What am i doing?

poiiiiiiiiiiiiii
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git restore test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# cat test.txt
Hello world

What am i doing?
```

### git 版本切换

```
git log：查看git commit提交日志
git reset --hard commit_id：切换至对应commit_id的版本
git reflog：查看git命令及其结果
```

首先，我们用`git log`来查看我们的 git 提交日志，注意指挥记录`git commit`的内容，包括一个**提交序列号**、**提交人信息**、**提交日期**和**提交时我们输入的消息**

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git log
commit 609b6b0c9931520c395d5bf7cdff94c3d15bf99d (HEAD -> master)
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 15:18:20 2022 +0800

    change test & another test

commit 373fc04d481d36747603a34ab48a742316d32b21
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:57:06 2022 +0800

    add new line in test.txt

commit 117f92085c4508ba09bb03e0c10feec9523d9244
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:43:12 2022 +0800

    add another test

commit 885f71da6db9faf007ff3b6637f1a065eb5544e2
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:05:24 2022 +0800

    add test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test#
```

可以看到，最上面最新的提交有一个`(HEAD -> master)`它标志着当前最新的版本。  
如果我们想回到某个版本，可以使用`git reset --hard commit_id`，其中`commit_id`就是所谓的序列号。比如我们想回到最初的版本：

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git reset --hard 885f71da6db9faf007ff3b6637f1a065eb5544e2
HEAD is now at 885f71d add test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git log
commit 885f71da6db9faf007ff3b6637f1a065eb5544e2 (HEAD -> master)
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:05:24 2022 +0800

    add test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# cat test.txt
Hello world
```

此时我们发现，`git log`里只有一个提交记录，而当前目录下也只有一个`test.txt`文件，里面也只有一行`Hello world`  
当然想要回去也可以，我们选择对应的序列号即可。  
但是万一我关闭了窗口，找不到序列号了怎么办？这时我们可以用`git reflog`，该命令显示我们的 git 操作历史及其结果

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git reflog
885f71d (HEAD -> master) HEAD@{0}: reset: moving to 885f71da6db9faf007ff3b6637f1a065eb5544e2
609b6b0 HEAD@{1}: commit: change test & another test
373fc04 HEAD@{2}: commit: add new line in test.txt
117f920 HEAD@{3}: commit: add another test
885f71d (HEAD -> master) HEAD@{4}: commit (initial): add test.txt
```

可以看到，我们最后的提交序列号为`609b6b0`，以此我们可以回到之前最新的版本。  
实际上序列号可以只用输入前 7 位，比如一开始我们可以只输入`885f71d`来回到最初的版本。大概是因为 git 基本保证我们的序列号连前 7 位都不会重复吧。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git reset --hard 609b6b0
HEAD is now at 609b6b0 change test & another test
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git log
commit 609b6b0c9931520c395d5bf7cdff94c3d15bf99d (HEAD -> master)
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 15:18:20 2022 +0800

    change test & another test

commit 373fc04d481d36747603a34ab48a742316d32b21
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:57:06 2022 +0800

    add new line in test.txt

commit 117f92085c4508ba09bb03e0c10feec9523d9244
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:43:12 2022 +0800

    add another test

commit 885f71da6db9faf007ff3b6637f1a065eb5544e2
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:05:24 2022 +0800

    add test.txt
```

还有一种更方便的回退方法。  
回退到上个版本可以用`git reset --hard HEAD^`，上上个版本可以用`git reset --hard HEAD^^`，比如我们要回到最初版本，中间差了 3 个版本，可以用`HEAD^^^`

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git reset --hard HEAD^^^
HEAD is now at 885f71d add test.txt
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-test# git log
commit 885f71da6db9faf007ff3b6637f1a065eb5544e2 (HEAD -> master)
Author: blackdn <940045828@qq.com>
Date:   Mon Mar 7 14:05:24 2022 +0800

    add test.txt
```

如果中间差了很多版本，比如 100 个，我们可以`HEAD~100`来表示。

ok，至此，我们已经完全 git 入门，用 git 进行版本控制已经不在话下。

## 远程 Git：连接 Github

### 配置 SSH 密钥

远程的 Git 我们以 GitHub 为例，当然许多其他代码库都是支持 git 连接的。

第一步是要让 Github 知道，连接的是拥有 Github 账号的我们，这就需要进行 SSH 认证。  
简单来说就是我们本地根据 Github 账号（邮箱）创建一个密钥，以下两种方式都可以选择，就是加密方式不同，分别为`ed25519`和`rsa`：

```bash
ssh-keygen -t rsa -C "your email"
ssh-keygen -t ed25519 -C "your_email@example.com"
```

之后会生成两个密钥，分为公钥和私钥，保存的目录则在用户目录的`.ssh`下。Windows 中则在`/c/Users/you/.ssh/`下  
比如我以用户`blackdn`生成`ed25519`的密钥：

```bash
blackdn@BlackDn-DESKTOP:/mnt/f/GitTest$ ssh-keygen -t ed25519 -C "940045828@qq.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/blackdn/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/blackdn/.ssh/id_ed25519
Your public key has been saved in /home/blackdn/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:e4okusTOxJqLUeYDH9cXkrPf4pJiXYfX0oWF73V8jpA 940045828@qq.com
The key's randomart image is:
+--[ED25519 256]--+
|             .   |
|       .    . .  |
|      + .    = . |
|     . + .  E o =|
|. + . o S. o + +o|
| O o   ooo+ o o .|
|. O ...o+oo.     |
|.O ooo+o +       |
|=.=o ...o        |
+----[SHA256]-----+
```

中途会让我们输入保存目录和口令，我们都空着直接回车，这样目录就是默认目录，口令就是没有口令。  
然后在用户目录的`.ssh`目录（`/home/blackdn/.ssh/`）下就会多出两个文件：

```bash
blackdn@BlackDn-DESKTOP:/mnt/f/GitTest$ ll $HOME/.ssh/
drwx------ 2 blackdn blackdn 4096 Mar  7 23:28 ./
drwxr-xr-x 6 blackdn blackdn 4096 Mar  7 22:02 ../
-rw------- 1 blackdn blackdn  411 Mar  7 23:28 id_ed25519
-rw-r--r-- 1 blackdn blackdn   98 Mar  7 23:28 id_ed25519.pub
```

后缀有`.pub`的就是公钥，我们要复制其中的全部内容到`Github -> Settings -> SSH and GPG keys -> SSH keys -> New SSH key`其中，基本就成功启用了。

这里要注意，由于 root 用户和其他用户的用户目录是不同的，所以想要两个用户都能连接，则需要分别为两个用户都配置各自的 ssh 密钥。

### 对 Git 账户进行配置

首先我们配置账户名和邮箱，通常选择和 github 的登录名和邮箱一致，这些也会记录在 git commit 的提交记录中。

```bash
$ git config --global user.name  "your name"
$ git config --global user.email "your e-mail"
```

然后是对**换行符**的配置，由于 Windows 下的换行符是`“\r\n”`，即 CRLF；Linux 下的则是`“\n”`，即 LF；Mac 则为`“\n”`，CR。如果不进行统一的话，如果一个团队不用的操作系统使用者共同修改同一个仓库内容，会因为换行符不一致而报错。  
因此，git 提供了换行符的转换处理，`autocrlf`可以自动进行转换，`safecrlf`可以弹出警告：

```bash
# autocrlf
git config --global core.autocrlf true # add 时去掉CRLF, checkout 时加回CRLF (应该只在win下配置)
git config --global core.autocrlf input # commit 时去掉CRLF, checkout 时什么都不做
git config --global core.autocrlf false # 什么都不做 (所有开发人员都在相同平台下)
# safecrlf
git config --global core.safecrlf warn # 发现CRLF是警告并继续
```

我的话，由于是 Windows 系统（虽然 git 用的是 WSL 的 Linux，但是对文件编辑时多用 Windows 下的软件，比如 IDEA 等），所以我的配置是`autocrlf=input`，`safecrlf=warn`。可以用`--list`参数查看自己当前的配置

```bash
blackdn@BlackDn-DESKTOP:/mnt/f/GitTest$ git config --global --list
user.name=BlackDn
user.email=940045828@qq.com
core.safecrlf=warn
core.autocrlf=input
```

最后一步就是测试我们和 Github 的连接，毕竟 Github 是外网，连接不一定稳定，懂得都懂。  
出现以下消息则表示连接成功，网络没有问题。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# ssh -T git@github.com
Hi BlackDn! You've successfully authenticated, but GitHub does not provide shell access.
```

### 克隆仓库到本地、修改内容后提交

最后就是我们对远程仓库的操作了，首先我们将仓库克隆到本地  
找到仓库的 ssh 代码，利用`git clone`克隆到本地。注意这里最好用 root 用户进行克隆，其他用户容易出现权限问题而克隆失败。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest# git clone git@github.com:BlackDn/git-remote-test.git
Cloning into 'git-remote-test'...
remote: Enumerating objects: 57, done.
remote: Counting objects: 100% (57/57), done.
remote: Compressing objects: 100% (37/37), done.
remote: Total 57 (delta 6), reused 56 (delta 5), pack-reused 0
Receiving objects: 100% (57/57), 5.03 KiB | 302.00 KiB/s, done.
Resolving deltas: 100% (6/6), done.
root@BlackDn-DESKTOP:/mnt/f/GitTest# ll
total 0
drwxrwxrwx 1 root root 4096 Mar  8 00:10 ./
drwxrwxrwx 1 root root 4096 Mar  7 22:19 ../
drwxrwxrwx 1 root root 4096 Mar  8 00:10 git-remote-test/
```

克隆完成后当前目录会新建一个仓库同名目录，这个目录自带 git 管理，所以不需要我们再`init`初始化仓库。这样就成功将仓库克隆到本地了。

将仓库克隆到本地后，再我们之前其他用户的 commit 操作都会在 log 中呈现。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest# cd git-remote-test/
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# git log
commit 116983e4821113030908f4eb66b7d575454ebd91 (HEAD -> master, origin/master, origin/HEAD)
Author: BlackDn <940045828@qq.com>
Date:   Tue Jan 11 17:24:28 2022 +0800

    finish homework 5
······
```

我们对该仓库进行修改，比如新建一个`test.txt`文件，确认修改并 commit。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# git status
On branch master
Your branch is up to date with 'origin/master'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        test.txt

nothing added to commit but untracked files present (use "git add" to track)
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# git add .
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# git commit -m "add test.txt"
[master 6020e78] add test.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 test.txt
```

最后一步就是将我们的修改提交至 Github。  
不过，有可能在我们修改的期间有其他成员先我们一步对仓库进行了修改并提交，这就导致当前 Github 的仓库内容和我们克隆下来的不匹配。  
为了防止这种情况，我们先`git pull`一下，将最新的更新（如果有）拉取到本地，再用`git push`将我们自己的更新上传至远端仓库。

```bash
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# git pull --rebase
Current branch master is up to date.
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test# git push
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Delta compression using up to 12 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 289 bytes | 36.00 KiB/s, done.
Total 2 (delta 0), reused 0 (delta 0)
To github.com:BlackDn/git-remote-test.git
   116983e..6020e78  master -> master
root@BlackDn-DESKTOP:/mnt/f/GitTest/git-remote-test#
```

至此，我们就成功实现了远端的 git 连接。可以和项目组一起享受 git 带来的版本控制和团队协作啦！

## Semantic Commit Messages：推荐 commit 消息格式

由于大多情况需要我们进行团队合作，那么`git commit`时所附带的消息内容就显得比较重要了，毕竟我们希望能看懂别人的消息，自己的消息也能轻易地被小伙伴理解。  
根据[Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)的定义，建议 commit 的消息如下：

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

- `feat`: 新功能的实现。(new feature for the user, not a new feature for build script)
- `fix`: bug 的修复。(bug fix for the user, not a fix to a build script)
- `docs`: 文档的修改。(changes to the documentation)
- `style`: 代码格式的变化。(formatting, missing semi colons, etc; no production code change)
- `refactor`: 代码重构，如重命名等。(refactoring production code, eg. renaming a variable)
- `test`: 测试的修改。(adding missing tests, refactoring tests; no production code change)
- `chore`: grunt tasks 等的修改。(updating grunt tasks etc; no production code change)

## Git 学习推荐

1. [通关 Git 指令](https://learngitbranching.js.org/?locale=zh_CN)：以过关+可视化的方式帮助学习 Git 指令
2. [git - 简易指南](https://www.bootcss.com/p/git-guide/)：通俗易懂，界面简洁好看，快速入门

## 参考

1. [Git 指令整理](../2017-02-15-Git-Command-Arrangement)
2. [Git 与 Github 的连接与使用](../2019-05-28-Git-Github-Use-2019)
3. [使用 git add -p 整理 patch](https://blog.csdn.net/keocce/article/details/106471132)
4. [Git 三大区域的操作分析](https://blog.csdn.net/a13590394462/article/details/74857360)
5. [官方文档：生成新 SSH 密钥并添加到 ssh-agent](https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
6. [git-config - Get and set repository or global options](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)
7. [Git 错误 fatal: CRLF would be replaced by LF in xxx](https://www.cnblogs.com/hlooc/p/15309556.html)
8. [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
