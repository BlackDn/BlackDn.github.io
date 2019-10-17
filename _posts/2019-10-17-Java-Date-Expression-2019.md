---
layout:       post
title:        Java日期表示
subtitle:     从Date类到代替它的Calendar类
date:         2019-10-17
auther:       BlackDn
header-img:   img/ACG.GY_23.jpg
catalog:      true
tags:
    - Java
---

>"看黄昏退落，看黑夜行进，看林梢闪出的第一颗星"

# 前言
来了来了，拖了好久这篇。  
一开始在做安卓控件的时候接触到Calendar，被绕的有点晕，就打算来总结一下  
谁能想到Java课作业居然也接触到了GregorianCalendar类  
# Java表示日期
Java中表示日期主要有两个类，分别是Date类和Calendar类。  
由于Date类本身设计存在许多问题，比如其getYear方法指的是1900年以来的年数，getMonth方法是从0开始的等。而且Date类不利于国际化而基本被Calendar代替，至于原因，我们在后面可以根据源码分析。  
### Date类
#### 构造方法
Date类可以直接通过调用构造方法实例化出一个对象，当然也有对应的构造方法船舰自己指定的日期  
```
Date date = new Date();    //创建当前日期的Date对象
Date myDate = new Date(time);    //创建自己指定得日期
```
在Date类中有一个不被序列化的（transient）属性**fastTime**，数据类型是long，代表距离1970年1月1日到对应时间的毫秒数。  
调用无参构造方法的时候是将系统当前时间（System.currentTimeMillis()）的毫秒数存入fastTime；而调用创建指定日期的构造方法则将指定毫秒数存入fastTime，代表相应日期  
其实剩下还有几个构造方法，包括创建自己指定的日期（也有精确到时间），但是都被Deprecated了，所以就不多说了。  
其中有的构造方法允许我们传入年月日构造Date对象，年份需要减去1900，月份需要减去1。这是因为**Date本身的年份属性存储的是1900到当年的年份差；其月份属性是从0开始的，及0表示一月，1表示二月······**6月需要用5表示，因此要减一。非常麻烦，这也是Date被Calendar代替的原因之一  
#### 成员方法
许多方法都被Deprecated了，所以这里列一下剩下用的比较多的方法

1. boolean after(Date when): 测试该时期是否在指定日期when之后。
2. boolean before(Date when) : 测试该日期是否在指定日期when之前。
3. long getTime() : 返回该时间对应的long型整数，即从GMT 1970.1.1 00:00:00到该Date对象之间的时间差，单位毫秒。
4. void setTime(long time) : 设置该Date对象的fastTime时间。
5. compareTo(Date when) : 测试的Date在指定的Date之前返回小于0的数，之后，返回大于0的数，相等，返回0。

### Calendar类
为什么Calendar代替了Date类我们还需要学Date类呢？  
因为Calendar很多地方是继承了Date类的，有很多相像的地方现在就开始讲Calendar类  
#### 实例化对象
不同于Date类，Calendar类不允许直接new一个对象，因为Calender实际上是一个抽象类  
因此需要调用静态方法getInstance()产生对象，默认产生的是当前日期的对象  
```
Calendar calendar = Calendar.getInstance();    //当前日期对象
```
之所以说Calendar类比Date类更利于国际化，在于它根据系统的时区和地区来生成日期对象  
我们来看看getInstance的源码  

```
 public static Calendar getInstance() {
        Locale aLocale = Locale.getDefault(Category.FORMAT);
        return createCalendar(defaultTimeZone(aLocale), aLocale);
    }

    public static Calendar getInstance(TimeZone zone) {
        return createCalendar(zone, Locale.getDefault(Category.FORMAT));
    }

    public static Calendar getInstance(Locale aLocale) {
        return createCalendar(defaultTimeZone(aLocale), aLocale);
    }

    public static Calendar getInstance(TimeZone zone, Locale aLocale) {
        return createCalendar(zone, aLocale);
    }
```
看个大概，不用全懂，我们发现有Locale和TimeZone两个参数很常用，他代表的就是地区和时区。最后返回的都是createCalendar()方法，它就是根据传入的Locale和TimeZone判断不同国家地区从而返回不同的日期。比如西方国家第一天是星期天，而我们习惯认为第一天是星期一，Calendar可以很好的适配这些情况  
可以看看createCalendar()中的部分源码：

```
        if (aLocale.hasExtensions()) {
            String caltype = aLocale.getUnicodeLocaleType("ca");
            if (caltype != null) {
                byte var6 = -1;
                switch(caltype.hashCode()) {
                case -1581060683:
                    if (caltype.equals("buddhist")) {
                        var6 = 0;
                    }
                    break;
                case -752730191:
                    if (caltype.equals("japanese")) {
                        var6 = 1;
                    }
                    break;
                case 283776265:
                    if (caltype.equals("gregory")) {
                        var6 = 2;
                    }
                }

                switch(var6) {
                case 0:
                    cal = new BuddhistCalendar(zone, aLocale);
                    break;
                case 1:
                    cal = new JapaneseImperialCalendar(zone, aLocale);
                    break;
                case 2:
                    cal = new GregorianCalendar(zone, aLocale);
                }
            }
        }
```
可以看出，createCalendar()会根据地区自动选择佛历（buddhist），日本日历（japanese，比如他们用耀日作为星期），格里高利历（gregory），因此利于国际化。
####  常用方法
Calendar类中有许多方法和Date类中的类似，比如before，after，compareTo等，就不列举了，下面说一些常用的方法  
###### 获取时间信息
Calendar中有YEAR、MONTH、DAY_OF_MONTH、HOUR等日历字段的常量，可以利用get方法获取。注意月份要+1，因为仍是用0~11来表示月份（0为一月）  
```
int year = calendar.get(Calendar.YEAR);
int month = calendar.get(Calendar.MONTH) + 1;
```
###### 设定特定日期
利用set方法可以给Calendar对象设定特定日期，当然月份要-1。不过Java推荐用类中自带的常量，如Calendar.JANUARY，Calendar.FEBRUARY等  
```
calendar.set(2019, Calendar.OCTOBER, 17);    //设置为2019年十月17日
```
当然set有很多重载，甚至可以设置到秒，这里拿年月日做个示例。  
值得一提的是，**setTimeInMillis()**允许我们用**偏移毫秒**为参数设定时间，类型为long。  
**偏移毫秒**指的是距离“格林威治标准时间 1970 年 1 月 1 日的 00:00:00.000，格里高利历”后所过的毫秒，即表示1970年1月1日的 00:00:00.000后，过了偏移毫秒后的那个日期。（偏移毫秒这个名字是我自己取的，暂时没找到它的具体名称）  
相对的，可以用**getTimeInMillis()**方法获取当前日期的**偏移毫秒**  
```
long millionTime = calendar.getTimeInMillis();    //获取偏移毫秒
calendar.setTimeInMillis(millionTime);        //利用偏移毫秒指定日期
calendar.setTimeInMillis(123456789L);           //距1970年1月1日的 00:00:00.000后123456789毫秒的日期
```
之所以要强调这个~~是因为我题目做到了~~是因为毫秒是比较官方的一个单位，不管是Date，Calendar还是Calendar的实现子类（Calendar是抽象类还记得嘛）都用到了它，方便不同国家地区对日期进行统一操作。
###### Calendar和Date转换
Calendar是建立在Date的基础上的，因此两者可以相互转换  
```
//Calendar的getTtime()返回其相应的Date类型
Date date = calendar.getTime();
//利用setTime将Date转为相应的Calendar
calendar.setTime(date);
```
两者是靠什么转化的呢？我们可以到getTime()和setTime()的源码中看看  

```
    public final Date getTime() {
        return new Date(this.getTimeInMillis());
    }
    
    public final void setTime(Date date) {
        this.setTimeInMillis(date.getTime());
    }
```
不难看出，其实就是上面说的偏移毫秒
###### add()方法
最后来看看 add方法，就是在写安卓控件的时候被add方法绕晕了才让我决定来过一遍Java的日期类的  
不过其实很简单，就是给对象的某个属性（年月日啥的）加上一个数（减就用负数），分别对应add方法的两个参数  
```
calendar.add(Calendar.MONTH, 1);    //为当前月+1
calendar.add(Calendar.YEAR, -1);       //为当前年-1
```
如果超过了最大值，比如月份超过12月，年份会自动+1然后月份从头开始（进位？！）
#### GregorianCalendar类
GregorianCalendar类是Calendar类的一个实现子类，提供了世界上大多数国家使用的标准日历系统（~~要不是作业做到了我真不想写~~）  
可以通过构造方法实例化，和Calendar一样，默认是当前时间，也可以传入参数指定时间  
```
GregorianCalendar gregorianCalendar = new GregorianCalendar();    //当前日期
GregorianCalendar gregorianCalendar = new GregorianCalendar(2019, Calendar.OCTOBER, 17);    //2019年10月17日的对象，月份用数字的话仍需要-1
```
很多方法GregorianCalendar类并没重写，而实直接用父类Calendar的，比如setTimeInMillis()，这里就不多说啦  
它有一个比较特殊但是很好用的方法就是**boolean isLeapYear(int year)**，用于判断是否为闰年  
想要具体了解可以看参考的第四条手册，非常详细的介绍。  
~~大致看了一下发现那Java作业完全可以用Calendar实现我会乱说？~~
### 参考
[Date类与Calendar类](https://blog.csdn.net/qq_41915601/article/details/83046202)  
[Java Calendar类的使用总结](https://www.cnblogs.com/huangminwen/p/6041168.html)  
[JAVA中Date类的使用](https://www.cnblogs.com/gu-bin/p/10022703.html)（这里还有Date，Calendar，long，String间相互转换，挺好用）  
[类 GregorianCalendar-JavaTM Platform
Standard Ed. 6](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/GregorianCalendar.html)
