---
layout:       post  
title:        CTF-当你收到加密压缩包  
subtitle:     CTF中对加密压缩包的处理方法  
date:         2020-05-07  
auther:       BlackDn  
header-img:   img/acg.gy_33.jpg  
catalog:      true  
tags:  
    - Security  
---

> "错过落日余晖,请记得还有满天星辰."

# 前言
拖就硬拖  
虽然很多时候是在一点一点补充之前的博客  
本来只是看到zip伪加密,没想要扯出这么多来...

# CTF-当你收到加密压缩包
加密压缩包的思路主要有：伪加密、爆破、明文攻击、CRC32碰撞等
## 1. 伪加密
在zip文件的各数据区域中（见附件1），**压缩源文件目录区**的**全局方式位标记**定义了该文件是否进行了加密  
该位置的数字为奇数是为加密，为偶数时不加密，因此可以对次位进行修改从而达到打开zip文件需要输入密码的目的（即使一开始压缩时没有设置密码）  
因此，在爆破前建议先尝试查看是否为伪加密  
例题可以查看下方参考中的“Bugku-CTF加密篇之zip伪加密（flag.zip）”  
## 2. 爆破
包括字典爆破、掩码攻击等  
思路很简单，常用fcrackzip工具爆破zip密码，手册如下：  

```
USAGE: fcrackzip
          [-b|--brute-force]            use brute force algorithm
          [-D|--dictionary]             use a dictionary
          [-B|--benchmark]              execute a small benchmark
          [-c|--charset characterset]   use characters from charset
          [-h|--help]                   show this message
          [--version]                   show the version of this program
          [-V|--validate]               sanity-check the algorithm
          [-v|--verbose]                be more verbose
          [-p|--init-password string]   use string as initial password/file
          [-l|--length min-max]         check password with length min to max
          [-u|--use-unzip]              use unzip to weed out wrong passwords
          [-m|--method num]             use method number "num" (see below)
          [-2|--modulo r/m]             only calculcate 1/m of the password
          file...                    the zipfiles to crack
```
以下是比较常用的几个参数：

1. -b 暴力破解模式
2. -c 指定使用的字符集  
a 表示小写字母\[a-z\]  
A 表示大写字母\[A-Z\]  
1 表示阿拉伯数字\[0-9\]  
！感叹号表示特殊字符(括号符号啥的)  
：表示包含冒号之后的字符（不能为二进制的空字符），例如  a1:$%  表示 字符集包含小写字母、数字、$和%  

3. -l 指定密码长度
4. -u 压缩文件名
5. -D 表示要使用字典破解
6. -p 表示要使用那个字典破解

我们来找几个实例进行讲解：

```
fcrackzip -b -c 'aA1' -l 1-10 -u 123.zip
暴力破解123.zip，密码为数字+大小写字母，长度为1-10

fcrackzip -b -c'1' -l 3 -u flag.zip 
暴力破解flag.zip，密码为纯数字，长度为3

fcrackzip  -D -p /usr/share/wordlists/rockyou.txt -u test.zip
用rockyou.txt作为字典爆破test.zip
```
另外，Kali linux自带了一些字典在/usr/share/wordlists/文件夹下，通常爆破用rockyou.txt  

## 3. 明文攻击
明文攻击是一种较为高效的攻击手段，大致原理是因为同一个zip压缩包里的所有文件都是使用同一个加密密钥来加密的，当你不知道一个zip的密码，但是你有zip中的一个已知文件（文件大小要大于12字节）时，可以用已知文件来找加密密钥，利用密钥来解锁其他加密文件  
通常比较CRC32判断已知文件和压缩包中的文件是否相同  
可以尝试用**ARCHPR**或者**pkcrack**进行明文攻击，ARCHPR无脑工具就不多说，介绍一下pkcrack  
官方主页：[PkCrack - Breaking PkZip-encryption](https://www.unix-ag.uni-kl.de/~conrad/krypto/pkcrack.html)  

Linux安装如下，以下安装教程来自下方参考“破解Zip加密文件常用的几种方法”  

1. 写一个脚本进行安装，命名为install.sh。简单来说就是从网上下载压缩包然后将各个文件解压出来。也可以直接下载压缩包解压  

```
#!/bin/bash -ex

wget https://www.unix-ag.uni-kl.de/~conrad/krypto/pkcrack/pkcrack-1.2.2.tar.gz
tar xzf pkcrack-1.2.2.tar.gz
cd pkcrack-1.2.2/src
make

mkdir -p ../../bin
cp extract findkey makekey pkcrack zipdecrypt ../../bin
cd ../../
```

2. 给该文件执行权限并运行  

```
chmod 777 install.sh
./install.sh
```

3. 运行后生成的bin文件中的**pkcrack**就可以直接运行

#### pkcrack用法
```
./pkcrack --help 查看手册
用法：./pkcrack -c <crypted_file> -p <plaintext_file> [other_options]
-c:压缩包中需要破解的文件
-C:包含需要破解文件的压缩包
-P:包含已知文件的压缩包
-p:压缩包中的已知文件
-d:结果输出的文件

用法：./pkcrack -c "answer/key.txt" -p readme.txt -C Desktop.zip -P readme.zip
```

**注意，使用pkcrack时，要先将已知的文件压缩为zip文件，其作为-P的参数**   
举个🌰：有加密压缩包Desktop.zip，含有readme.txt和flag.txt，其中的readme.txt已知。  
首先我们要将readme.txt压缩为readme.zip，然后输入命令  

```
./pkcrack -c "flag.txt" -C Desktop.zip -p readme.txt  -P readme.zip
```
（我自己写了个测试例子，跑了蛮久的）  

## CRC32碰撞
CRC32指32位的CRC循环冗余码。  
由于源数据块的每一位都参与运算产生CRC32，即使一位改编也会产生不同的CRC32，因此可以爆破加密文件的内容  

举个🌰：  
已知CRC32为56EA988D，且flag为4位数，那么我们就爆破所有4位数，直到某一个四位数的CRC32为56EA988D  
写出脚本  

```
# coding: utf-8
# py_version=3.8

import binascii
crc = 0x56EA988D
for content in range(1000,9999):
    if (binascii.crc32(str(content).encode())) == crc:
        print(content)

print('end')
```
因为**binascii.crc32()**对byte类型的数据求CRC32，因此先用encode()将str转为byte  

运行结果为：  

```
2016
end
```
## 附件1. zip文件
zip伪加密是在文件头的加密标志位做修改，进而再打开文件时识被别为加密压缩包  
一个 ZIP 文件由三个部分组成： 压缩源文件数据区+压缩源文件目录区+压缩源文件目录结束标志  

```
压缩源文件数据区：
50 4B 03 04：头文件标记（0x04034b50）
14 00：解压文件所需 pkware 版本
00 00：全局方式位标记
08 00：压缩方式
5A 7E：最后修改文件时间
F7 46：最后修改文件日期
16 B5 80 14：CRC-32校验（1480B516）
19 00 00 00：压缩后尺寸（25）
17 00 00 00：未压缩尺寸（23）
07 00：文件名长度
00 00：扩展记录长度

压缩源文件目录区：
50 4B 01 02：目录中文件文件头标记(0x02014b50)
3F 00：压缩使用的 pkware 版本
14 00：解压文件所需 pkware 版本
00 00：全局方式位标记（有无加密，这个更改这里进行伪加密，改为09 00打开就会提示有密码了）
08 00：压缩方式
5A 7E：最后修改文件时间
F7 46：最后修改文件日期
16 B5 80 14：CRC-32校验（1480B516）
19 00 00 00：压缩后尺寸（25）
17 00 00 00：未压缩尺寸（23）
07 00：文件名长度
24 00：扩展字段长度
00 00：文件注释长度
00 00：磁盘开始号
00 00：内部文件属性
20 00 00 00：外部文件属性
00 00 00 00：局部头部偏移量
 
压缩源文件目录结束标志：
50 4B 05 06：目录结束标记
00 00：当前磁盘编号
00 00：目录区开始磁盘编号
01 00：本磁盘上纪录总数
01 00：目录区中纪录总数
59 00 00 00：目录区尺寸大小
3E 00 00 00：目录区对第一张磁盘的偏移量
00 00：ZIP 文件注释长度
```

## 参考与补充
[zip在线破解](https://passwordrecovery.io/zip-file-password-removal/)  

[CTF压缩包加密破解总结](https://blog.csdn.net/shenzhang7331/article/details/83417931)  
[破解Zip加密文件常用的几种方法](https://www.cnblogs.com/ECJTUACM-873284962/p/9387711.html)  
[Bugku-CTF加密篇之zip伪加密（flag.zip）](https://www.cnblogs.com/0yst3r-2046/p/11890498.html)  
