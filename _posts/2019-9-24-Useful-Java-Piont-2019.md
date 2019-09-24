---
layout:       post
title:        接触较少的Java知识点
subtitle:     主要是日期表示和保留位数
date:         2019-09-24
auther:       BlackDn
header-img:   img/acg.gy_04.jpg
catalog:      true
tags:
    - Java
---

>"请和我门外的花坐一会，它们很温暖，我注视它们很多很多日子了"

## 前言
新学期的Java课，随着作业的推进会发现很多不懂的地方，比如保留小数后几位之类的需求
所以特地回过头来整理一下，不然每次都要再搜，怪麻烦的...  
这里按顺序列一下所提及的知识点，比较粗略的认识没什么逻辑，以后有必要就单独列出探讨：
1. 日期时间的表示方法：Date、SimpleDateFormat和Calendar类  
2. 保留数位：Math.round(), BigDecimal, DecimalFormat
3. Object类  
4. 接口
5. 类型转换
6. 抽象类


## Date、SimpleDateFormat和Calendar类
#### Date对象表示时间
利用无参构造函数创造的Date类表示当前时间前  
```
public static void main(String[] args) {
        Date date = new Date();
        System.out.println(date);
    }
//运行结果
Tue Sep 24 09:17:59 CST 2019
```
（CST 代表 China Standard Time (中国标准时间，也就是北京时间，东八区)）  
由于这种形式不利于理解，所以需要用SimpleDateFormat按指定的格式进行显示，如 2014-06-11 09:22:30  
##### SimpleDateFormat转换
可以将日期转换为指定格式的文本，也可将文本转换为日期  
######  format() 方法将Date转化为String
```
public static void main(String[] args) {
        Date date = new Date();
        System.out.println("Date类: " + date);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");    //和被转化对象格式对应
        String present = simpleDateFormat.format(date);
        System.out.println("SimpleDateFormat类: " + present);
    }
//运行结果
Date类: Tue Sep 24 10:37:33 CST 2019
SimpleDateFormat类: 2019-09-24 10:37:33
```
yyyy-MM-dd HH:mm:ss” 为预定义字符串， yyyy 表示四位年， MM 表示两位月份， dd 表示两位日期， HH 表示小时(使用24小时制)， mm 表示分钟， ss 表示秒  
这样就指定了转换的目标格式，最后调用 format() 方法将时间转换为指定的格式的字符串  
###### parse() 方法将String转化为Date
```
public class Main{
    public static void main(String[] args) {
        String present = "2019年09月24日 10:51:13";

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");    //和被转化对象格式对应
        try{
            Date date = simpleDateFormat.parse(present);
            System.out.println("Date类: " + date);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
//运行结果
Date类: Tue Sep 24 10:51:13 CST 2019
```
“yyyy年MM月dd日 HH:mm:ss” 指定了字符串的日期格式，调用 parse() 方法将文本转换为日期  
调用 SimpleDateFormat 对象的 parse() 方法时可能会出现转换异常，即 ParseException ，因此需要进行异常处理  
## Calender类
java.util.Calendar 类是一个抽象类，可以通过调用 getInstance() 静态方法获取一个 Calendar 对象，此对象已由当前日期时间初始化，即默认代表当前时间  
调用 Calendar 类的 getInstance() 方法获取一个实例，然后通过调用 get() 方法获取日期时间信息，参数为需要获得的字段的值    

```
    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();

        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        System.out.println("现在: " + year + "-" + month + "-" + day);
    }
//运行结果
现在: 2019-8-24
```
用同样的方法可以获取时、分、秒  
#### getTime() 方法和getTimeInMillis()方法
Calendar 类提供了 getTime() 方法，用来获取 Date 对象，完成 Calendar 和 Date 的转换  
还可通过 getTimeInMillis() 方法，获取此 Calendar 的时间值，以毫秒为单位。返回long型的整数，表示从1790-1-1 00:00:00到当前时间的毫秒数

```
    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();
        Long time = calendar.getTimeInMillis();

        System.out.println("Date: " + date);
        System.out.println("毫秒: " + time);
    }
//运行结果
Date: Tue Sep 24 11:10:22 CST 2019
毫秒: 1569294622566
```

## 保留位数
#### Math.round()
Math.round()可以对小数进行“四舍五入”，在参数上加0.5然后进行下取整，返回的时整数  
```
Math.round(1.5);    //返回值是2
Math.round(-1.5);    //返回值是-1
```  
实际上Math.round()存在方法重载，为了保证精度不丢失，一个接收float类型返回int类型，另一个接收double类型返回long类型  
#### BigDecimal
使用时，先实例化其对象，并传入相应的值进行实例化，这个值可为double，也可为String  
BigDecimal的对象间的运算不能简单的进行加减乘除，必须调用其对应的方法  
```
BigDecimal b1 = BigDecimal.valueOf(value1);
```
示例如下  
```
    public static void main(String[] args) {
        BigDecimal bigDecimal = BigDecimal.valueOf(2.0358);
        System.out.println("print BigDecimal: " + bigDecimal);
    }
//运行结果
print BigDecimal: 2.0358
```
利用**setScale()方法**用于格式化小数点，可以实现四舍五入。它接收两个参数，第一个表示保留小数位数，第二个参数若不传则默认四舍五入，也可传入以下值：  
```
1. BigDecimal.ROUND_HALF_UP表示四舍五入
2. BigDecimal.ROUND_HALF_DOWN也是五舍六入
3. BigDecimal.ROUND_UP表示进位处理（就是直接加1）
4. BigDecimal.ROUND_DOWN表示直接去掉尾数
```
示例如下  

```
    public static void main(String[] args) {
        BigDecimal bigDecimal = BigDecimal.valueOf(2.0358);
        double d = bigDecimal.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        System.out.println("print BigDecimal: " + d);
    }
//运行结果
print BigDecimal: 2.04
```
但是我的IDEA会显示**xxx is deprecated**，于是我去查了Java文档，在Java SE 10 & JDK 10及以上中，将这些移除了，要用以下替换。  

|      Field      |                  Description                  |
| :-------------: | :-------------------------------------------: |
|  ROUND_HALF_UP  |  Deprecated,Use RoundingMode.HALF_UP instead  |
| ROUND_HALF_DOWN | Deprecated,Use RoundingMode.HALF_DOWN instead |
|    ROUND_UP     |    Deprecated,Use RoundingMode.UP instead     |
|   ROUND_DOWN    |   Deprecated,Use RoundingMode.DOWN instead    |

不过我是Java8所以没有影响  
[Java文档](https://docs.oracle.com/javase/10/docs/api/java/math/BigDecimal.html)  
#### DecimalFormat
DecimalFormat能方便地将数字进行格式化，通常用0和#作为占位符进行格式设定  
format中，0.000和#.###的区别是，如果小数部分不足3位，前者会用0补足，而后者不会  

```
    public static void main(String[] args) {
        double test = 3.56;
        DecimalFormat decimalFormat1 = new DecimalFormat("0");   //四舍五入取整
        DecimalFormat decimalFormat2 = new DecimalFormat("0.000");  //四舍五入保留三位小数，不足用0补位
        DecimalFormat decimalFormat3 = new DecimalFormat("00.000");     //四舍五入保留两位整数+三位小数。不足用0补位
        DecimalFormat decimalFormat4 = new DecimalFormat("#.000");   //四舍五入保留所有整数+三位小数，小数不足用0补位
        DecimalFormat decimalFormat5 = new DecimalFormat("#");      //四舍五入保留所有整数
        DecimalFormat decimalFormat6 = new DecimalFormat("#.###");   //四舍五入保留所有整数和小数，不足不补位
        DecimalFormat decimalFormat7 = new DecimalFormat("#.##%");      //有%会自动变成百分数
        DecimalFormat decimalFormat8 = new DecimalFormat("##.##E0");     //科学计数法，显示两个整数，保留两位小数
        DecimalFormat decimalFormat9 = new DecimalFormat(",###");      //每三位逗号分隔

        System.out.println("format 0: " + decimalFormat1.format(test));
        System.out.println("format 0.000: " + decimalFormat2.format(test));
        System.out.println("format 00.000: " + decimalFormat3.format(test));
        System.out.println("format #.000: " + decimalFormat4.format(test));
        System.out.println("format #: " + decimalFormat5.format(test));
        System.out.println("format #.##: " + decimalFormat6.format(test));
        System.out.println("format #.##%: " + decimalFormat7.format(test));
        System.out.println("format ##.##E0: " + decimalFormat8.format(test));
        System.out.println("format .###: " + decimalFormat9.format(test));
    }
//运行结果
format 0: 4
format 0.000: 3.560
format 00.000: 03.560
format #.000: 3.560
format #: 4
format #.##: 3.56
format #.##%: 356%
format ##.##E0: 3.56E0
format .###: 4
```
更多地占位符及其作用可以参考Java SE8手册中的部分  
[Java SE8手册](https://docs.oracle.com/javase/8/docs/api/java/text/DecimalFormat.html)
## Object类
在Java中，Object类是所有类的父类，如果一个类没有明确extends另外一个类，那么这个类默认继承Object类。  
Object类中的方法适用于所有子类  
#### 常用的方法
##### toString()
在Object类中定义toString()方法返回对象地址字符串（哈希code码）  
可以通过重写表示出对象属性  
##### equals()
比较对象的引用是否指向同一块内存地址  
可以通过重写比较两个对象的值是否一致


## 接口
1. 用关键字interface定义接口
2. 接口通常是被用来继承、实现的，建议用public而非protect、private
3. 接口会自动添加abstract关键字，即使没有显式写出，也会被自动加上
4. 接口中的属性是常量，需要public static final修饰符，即使没有显式写出，也会被自动加上
5. 接口中的方法是抽象方法，需要public abstract修饰符，即使没有显式写出，也会被自动加上

```
[修饰符] (abstract) interface 接口名[extends 父接口1，父接口2...]{  
    零到多个常量定义；
    零到多个抽象方法定义；
}
```
#### 接口的使用
1. 一个类可以继承多个接口，用implement关键字
2. 接口对象指向实现接口的对象
3. 匿名内部类实现接口

```
[修饰符] class 类名 extends 父类 implements 接口1，接口2...{
    //如果继承抽象类，要实现其中抽象方法
    //如果继承接口，要实现其中抽象方法
}

//匿名内部类实现接口
Interface inter = new Interface(){
    @Override
    public void method(){
    ···
    }
};
inter.method();

new Interface(){
    @Override
    public void method(){
    ···
    }
};
inter.method();
```

## 引用类型转换
1. 向上类型转换：隐式、自动进行转换。从小类型到大类型（子类赋值父类）  
2. 向下类型转换：强制类型转换。大类型到小类型的转换（父类赋值子类）
#### instanceof运算符
解决引用对象的类型，避免类型转换的安全性问题
```
if (animal instanceof Dog)    //判断animal这个对象是否能转换成Dog类
```

## 抽象类
1. 用关键字abstract定义抽象方法和抽象类
2. 抽象类不一定具有抽象方法，具有抽象方法的一定是抽象类  
3. 抽象方法只有声明，不用实现
4. 子类继承抽象类后一定要重写（Override）抽象类中的抽象方法  
