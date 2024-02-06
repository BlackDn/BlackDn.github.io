---
layout: post
title: Java日期/时间表示
subtitle: 旧版java.util和新版java.time包的日期/时间API
date: 2022-07-15
author: BlackDn
header-img: img/21mon8_04.jpg
catalog: true
tags:
  - Java
---

> “尖酸刻薄，不擅温言宽慰；惰于交流，独自沉默执着。”

# Java 日期/时间表示

## 前言

之前写过一个[Java 日期表示](https://blackdn.github.io/2019/10/17/Java-Date-Expression-2019/)，但是没写全，只是比较简单地讲了下`Data类`和`Calendar类`  
所以重新来整理一下，搞个相对全面的 Java 日期和时间的文章出来  
最近经历了好多事情，毕业照、毕业视频、生日、漫协嘉年华，不过都一一落幕了  
大学生活啊，已经结束了

## 日期和时间的一些概念

首先我们来看一看日期和时间相关的一些概念，有些是生活中所用到的，有些是计算机领域采用的标准，又有些是格式规定啥的=。=

1. **本地时间**：这个比较好理解，当我们明确`地点+时间`的时候，这时候指的就是本地时间，比如`“北京时间2022-05-23 21:20”`。还有一些缩写，如**CST**可以表示`China Standard Time`（中国标准时间）或`Central Standard Time USA`（美国中部时间）。此外还可以用`洲／城市`的方式表达本地时间，如上海时间表示为`Asia/Shanghai`。注意不是任何城市都能这样表示，而是由 ISO 规定的。
2. **时区**：如果用本地时间还是会出现问题，万一有人不知道北京这个地方呢？所以就有了**时区**的概念。每隔 15° 经度划分共 24 个时区，以英国伦敦（格林尼治天文台）所在的时区称为标准时区/中时区（零时区），向东向西分为东 1\~东 12 区，西 1\~西 12 区。东八区指的就是北京时间。
3. **GMT**：格林尼治标准时间（Greenwich Mean Time），也称**世界时**（UT，Universal Time）。东八区可以表示为`GMT+08:00`，西八区可以表示为`GMT-08:00`，比如`“2022-05-23 21:20 UTC+08:00”`。当然这是基于时区来表示的。
4. **UTC**：协调世界时（Universal Time Coordinated），UTC 和 GMT 类似，也是通过时区来表示时间，东八区为`UTC+08:00`，西八区可以表示为`UTC-08:00`。不过，由于 UTC 采用原子钟计时，即每隔几秒会有一个闰秒（就像地球自转回归年周期为 365.2422 天，所以每四年一个闰年），因此更加精确。
5. **夏令时**：DST，Daylight Saving Time，也称夏时制。说白了就是在夏天日长夜短的时候把时间拨快一点，让大家早点醒；冬天就反过来。不过由于这样做省不了多少点，还容易打乱生物钟，所以很多地方都取消了。比如本来中国在 1986 年开始采用夏令时，但是 1992 后就停止实行了。又比如美国的夏令时由各个州自行安排。
6. **ISO_8601**：这是由国际标准化组织（ISO）设定的日期时间表示方法，要求年月日分别用 4 位，2 位，2 位数表示，且日期和时间中间用`T`分隔。主要标准格式有：日期表示为`yyyy-MM-dd`，时间表示为`HH:mm:ss`，日期和时间表示为：`yyyy-MM-ddTHH:mm:ss`等。
7. **Locale**：因为不同地区采用不同的表示方法，计算机中用 Locale 特指当地的日期、时间等格式，并用`语言_国家`表示（当然要是世界范围内统一度量衡就没有这玩意了）。比如中国的日期表示形式为：`zh_CN：2016-11-30`，美国的表示形式为：`en_US：11/30/2016`
8. **Epoch Time**：新纪元时间，又称时间戳，程序员们会对这个时间比较熟悉，即`1970年1月1日零点（格林威治时区／GMT+00:00）到现在所经历的时间`，其单位在不同语言中存在差异，Java 中常以`long表示的毫秒`的形式出现，最后三位表示毫秒数。比如`1574208900123L`表示`北京时间2019-11-20T8:15:00.123`。Java 中常用`System.currentTimeMillis()`语句获取时间戳。

## API: java.util 包

这个包中是 Java 比较老旧的 API，主要包括`Date`、`Calendar`和`TimeZone`等类

### Date 类

这个类表示一个日期和时间对象，要和数据库中表示时间的`java.sql.Date`区分。通过这个对象，我们可以轻易获取一个时间的年月日等信息。  
当我们实例化这个类的时候，其无参构造方法调用`System.currentTimeMillis()`获取当前时间戳，然后哦我们可以通过`getYear()`，`getMonth()`，`getDate()`等方法获取信息

```java
    //构造方法
	public Date() {
        this(System.currentTimeMillis());
    }

    //测试用例
    Date date = new Date();
    System.out.println(date.toString());        // 转换为String: Tue Jul 12 00:11:05 CST 2022
    System.out.println(date.toGMTString());        // 转换为GMT时区: 11 Jul 2022 16:11:05 GMT
    System.out.println(date.toLocaleString());        // 转换为本地时区:2022-7-12 0:11:05

    System.out.println(date.getYear() + 1900);	//输出年：2022
    System.out.println(date.getMonth() + 1);	//输出月：7
    System.out.println(date.getDate());			//输出日：11
```

由于 Date 对象是处理时间戳来获取年月日等信息的，因此其并不能表示此刻准时的事件，需要我们进行进一步操作。  
比如`getYear()`得到年份是以 1900 年为元年的年份，需要我们加上 1900 得到此刻的年份。（简单查了一下没找到为啥，可能写这段代码的程序员喜欢）  
`getMonth()`得到的月份表示为`0-11`，所以要+1 得到准确月份。`getDate()`得到的日期倒是没啥问题。
还有其他的一些方法，比如`getHours()`，`getMinutes()`，`getSeconds()`分别获取小时，分钟，秒等方法。

不过，Date 类存在许多弊端，比如它不能设置时区，只能以当前计算机的时区进行输出（除了`toGMTString()`可以输出`GMT`）。此外，Date 也难以比较两个日期，计算其相差时间；难以计算某日期是某个月第几个星期几等。

### SimpleDateFormat

如果我们想要自己进一步格式化日期的格式，比如想让日期表示为`yyyy-MM-dd`的格式，就可以用`SimpleDateFormat`类来帮助实现。  
其常见预定义的字符如下，详见[JDK 的官方文档](https://docs.oracle.com/en/java/javase/12/docs/api/java.base/java/text/SimpleDateFormat.html)：

```
yyyy：年
MM：月
dd: 日
HH: 小时
mm: 分钟
ss: 秒
```

比如我们想让时间表示为`"yyyy-MM-dd HH:mm:ss"`的格式

```java
Date date = new Date();
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
System.out.println(dateFormat.format(date));	//输出：2022-07-11 11:21:59
```

此外，JDK 文档中提到，字母越长，输出越长。以 7 月为例，`M`：输出`7`，`MM`：输出`07`，`MMM`：输出`Jul`，`MMMM`：输出`July`。  
不过可能因为是中国时区的关系，我试了一下，`MMM`和`MMMM`输出的都是`七月`，即`"E MMM dd, yyyy"`输出的是：`星期二 七月 12, 2022`、（`E`表示星期）

### Calendar

可以用于获取并设置年、月、日、时、分、秒，和`Date`相比，`Calendar`可以进行简单的运算，计算日期间隔等。  
`Calendar`只能通过`getInstance()`方法获取对象，它似乎考虑到了线程安全，这相比于`Date`是一个进步。但是注意`Calendar`并非单例模式，它内部还是通过`new`来创建对象，只不过多了很多判断操作。以`2022-07-11 11:21:59`为例：

```java
Calendar calendar = Calendar.getInstance();
int year = calendar.get(Calendar.YEAR);			//输出年：2022
int month = calendar.get(Calendar.MONTH) + 1;		//输出月：7（0-11表示）
int day = calendar.get(Calendar.DAY_OF_MONTH);		//输出日：11
int week = calendar.get(Calendar.DAY_OF_WEEK);		//输出星期：2（表示周一。1-7表示，1=周日，2=周一...7=周六）
int hour = calendar.get(Calendar.HOUR_OF_DAY);		//输出时：11
int minute = calendar.get(Calendar.MINUTE);			//输出分：21
int second = calendar.get(Calendar.SECOND);			//输出秒：59
int milli_second = calendar.get(Calendar.MILLISECOND);	//输出毫秒：881
```

如果想要重新为 Calendar 对象设置时间，需要用清空其内容，然后用 set 进行设置。（可以看到它很努力想变成单例模式）

```java
        Calendar calendar = Calendar.getInstance();
        calendar.clear();		//清空calendar
        calendar.set(Calendar.YEAR, 2019);	//设置年份为2019年
		······	//设置其他时间
```

虽然`Calendar`解决了`Date`的一些缺点，但它仍存在自己的不足。比如月份还是用 0-11 表示（好在年份不是 1900 开始了）；`Calender`没有自定义的格式化操作，因此还需要和 Date 进行转换从而使用`DateFormat`进行格式化。  
用`getTime()`方法将 Calender 对象转变为 Date 对象

```java
        Date date = calendar.getTime();
```

顺便再看看 Calendar 进行时间的加减  
根据其 add 方法和标志就可以快速进行加减操作。如果小时不够减了会自动跳到前一天，很智能的不用担心。

```java
Calendar calendar = Calendar.getInstance();
calendar.clear();
//设置Calendar
TimeZone myTimeZone = TimeZone.getTimeZone("Asia/Shanghai");
calendar.setTimeZone(myTimeZone);
calendar.set(2022, 6, 11, 11, 30, 0);   //设置为2022年7月11日 11时30分0秒
//加5天，减2小时
calendar.add(Calendar.DAY_OF_MONTH, 5);
calendar.add(Calendar.HOUR_OF_DAY, -2);
Date date = calendar.getTime();
SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
System.out.println(simpleDateFormat.format(date));  //输出：2022-07-16 09:30:00
```

### TimeZone

之前提到，`Date`不能进行时区的转换，于是这个任务就交给了`TimeZone`  
我们可以通过`TimeZone`的`ID`来设置或者获取时区

```java
TimeZone timeZoneDefault = TimeZone.getDefault();
System.out.println(timeZoneDefault.getID());
//获取本地时区，输出：Asia/Shanghai
TimeZone timeZoneGMT9 = TimeZone.getTimeZone("GMT+9:00");
System.out.println(timeZoneGMT9.getID());
//获取GMT+9的时区，输出：GMT+09:00
TimeZone timeZoneNewYork = TimeZone.getTimeZone("America/New_York");
System.out.println(timeZoneNewYork.getID());
//获取美国纽约的时区，输出：America/New_York
```

此外， 可以通过`TimeZone.getAvailableIDs()`语句来获取全部可用的时区 ID

由于`Calendar`和`SimpleDateFormat`都存在`TimeZone`属性，我们可以以此实现时区的转换（Date 没有`TimeZone`属性）  
比如我们将`2022年7月11日 11时30分0秒`的时间改为美国纽约时区：

```java
        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        //设置Calendar
        TimeZone myTimeZone = TimeZone.getTimeZone("Asia/Shanghai");
        calendar.setTimeZone(myTimeZone);
        calendar.set(2022, 6, 11, 11, 30, 0);   //设置为2022年7月11日 11时30分0秒
        //SimpleDateFormat设置时区，并将Calendar转换为Date，通过SimpleDateFormat转换时区
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        TimeZone newTimeZone = TimeZone.getTimeZone("America/New_York");
        simpleDateFormat.setTimeZone(newTimeZone);
        String newDate = simpleDateFormat.format(calendar.getTime());	//内容为：2022-07-10 23:30:00
```

我们先用 Calendar 设置当前时区，然后更改 SimpleDateFormat 的时区。  
最后将 Calendar 转换为 Date，并通过 SimpleDateFormat 格式化 Date，从而得到新时区的时间。  
可以看到`2022年7月11日 11时30分0秒`在美国纽约时区来看是`2022年7月10日 23时30分0秒`（东八区和西五区，相差 13 小时，不过此时美国执行夏令时，调快了一个小时，所以相差 12 小时）

## API：java.time 包

Java 8 引入的 java.time 包提供了新的时间日期 API，遵守 ISO 8601 标准，功能更准确，功能更丰富，线程安全  
主要类型有：

- 本地日期/时间：`LocalDateTime`，`LocalDate`，`LocalTime`
- 时区日期/时间：`ZonedDateTime`
- 时区：`ZoneId`，`ZoneOffset`
- 时间间隔：`Duration`
- 格式化类型：`DateTimeFormatter`
- 时刻（时间戳）：`Instant`

这些新的 API 严格区分时刻、本地日期或时间、时区等，并且用 1-12 表示`1月~12月`，用 1-7 表示`周一~周日`

java.time 包下的这些类和[Joda Time](https://www.joda.org/)的开源工具类很像，这也是因为 Joda Time 的设计很好，因此 JDK 团队将其作者 Stephen Colebourne 挖去设计了 java.time API

### LocalDateTime，LocalDate，LocalTime

这个类比较常用，`LocalDate`和`LocalTime`两个类分别表示日期和时间，不过通常多用`LocalDateTime`来同时获取这两个信息  
这三个类比较类似，都可以用`now()`方法获取当前时间。如果直接打印的话，会按照`ISO 8601格式`进行输出

```java
        LocalDate localDate = LocalDate.now();
        System.out.println(localDate);  //输出：2022-07-12

        LocalTime localTime = LocalTime.now();
        System.out.println(localTime);  //输出：23:31:31.116

        LocalDateTime localDateTime = LocalDateTime.now();
        System.out.println(localDateTime);  //输出：2022-07-12T23:31:31.116
```

当然，我们可以将`LocalDateTime`的内容传给`LocalDate`和`LocalTime`，也可以反过来，根据`LocalDate`和`LocalTime`构建一个`LocalDateTime`  
不仅如此，还可以用`of`方法传入年月日时分秒的数值、或`parse()`方法传入`ISO 8601`标准的字符串来构建`LocalDateTime`

```java
        //LocalDateTime转为LocalDate和LocalTime
        LocalDateTime localDateTime = LocalDateTime.now();
        LocalDate localDate = localDateTime.toLocalDate();
        LocalTime localTime = localDateTime.toLocalTime();
        //LocalDate和LocalTime转为LocalDateTime
        LocalDate localDateNew = LocalDate.of(2022, 7, 12);
        LocalTime localTimeNew = LocalTime.of(22, 25, 30);
        LocalDateTime localDateTimeNew = LocalDateTime.of(localDate, localTime);
        //字符串传入LocalDateTime
        LocalDateTime localDateTimeFromNum = LocalDateTime.of(2022, 7, 12, 15, 16, 17);
        LocalDateTime localDateTimeFromString = LocalDateTime.parse("2022-07-12T15:16:17");
```

当然，`LocalDate`和`LocalTime`也有`of`和`parse`方法，用法也类似。  
注意字符串一定要满足`ISO 8601`标准，因此月份或日期一定要两位数，所以要补 0，7 月用`07`表示。

#### 日期的加减和修改

`LocalDateTime`可以通过链式操作进行日期和时间的加减，比如`plusDays(3)`就是加三天，`minusHours(5)`就是减少 5 个小时。  
当然还可以直接修改内容，比如`withHour(15)`可以直接将小时改为 15  
`LocalDateTime`会自动调整操作后的新时间，比如`23时30分`加两个小时会变成后一天的`01时30分`，比如`10月31日`减一个月会变成`9月30日`，因为 9 月没有 31 日。

```java
//2022-07-12 15:16:17
LocalDateTime localDateTime = LocalDateTime.of(2022, 7, 12, 15, 16, 17);
LocalDateTime localDateTimeNew = localDateTime.plusDays(3).minusHours(5);        //2022-07-15 10:16:17
LocalDateTime localDateTimeWith = localDateTime.withYear(2002);         //2002-07-15 10:16:17
```

此外，`LocalDateTime`有一个通用的`with()`方法可以实现更复杂的计算  
因此，对于类似计算某个月第一个周日是几号这样的问题，就可以很方便的实现。

#### 判断日期先后

判断两个`LocalDateTime`的先后，可以使用`isBefore()`、`isAfter()`方法。`LocalDate`和`LocalTime`也有这个方法。

```java
LocalDateTime localDateTime = LocalDateTime.now();     //2022-07-12
LocalDateTime localDateTimeOld = LocalDateTime.of(2022, 6, 6, 12, 13, 14);  //2022-06-06
System.out.println(localDateTime.isAfter(localDateTimeOld));        //输出：true
System.out.println(localDateTime.isBefore(localDateTimeOld));       //输出：false
```

### DateTimeFormatter

`DateTimeFormatter`的初衷是用以取代`SimpleDateFormat`，可以自定义输出格式，或者将时间字符串解析成`ISO 8601`格式。

```java
        //自定义格式
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.now();
        System.out.println(formatter.format(localDateTime));    //输出：2022/07/12 22:14:15
        //解析成ISO 8601
        LocalDateTime localDateTimeNew = LocalDateTime.parse("2022/07/12 13:14:15", formatter);
        System.out.println(localDateTimeNew);   //输出：2022-07-12T13:14:15
```

### Duration 和 Period

`Duration`表示两个时刻之间的时间间隔，而`Period`表示两个日期之间的天数。

```java
LocalDateTime localDateTime = LocalDateTime.of(2022, 7, 12, 15, 16, 17);  //2022-07-12 15:16:17
LocalDateTime localDateTimeOld = LocalDateTime.of(2022, 6, 6, 12, 13, 14);  //2022-06-06 12:13:14
Duration duration = Duration.between(localDateTimeOld, localDateTime);
System.out.println(duration);   //输出：PT867H3M3S

LocalDate localDate = localDateTime.toLocalDate();
LocalDate localDateOld = localDateTimeOld.toLocalDate();
Period period = localDateOld.until(localDate);
System.out.println(period);     //输出：P1M6D
```

`Duration`输出的`PT867H3M3S`表示两者相差了`867小时3分3秒`，`Period`输出的`P1M6D`表示两者相差了`1个月6天`  
这也是`ISO 8601`规定的时间格式，`P...T...`用于表示时间间隔，`P`的后面是日期间隔，`T`的后面是时间间隔。如果只有时间间隔，那就要用`PT...`表示

对于`Period`，如果想直接获取相隔的天数/月数/年数，可以直接调用其`getDays()`，`getgetMonths()`，`getYears()`等方法

#### ChronoUnit

在计算两个日期相差天数的时候，`Period`可以给出相差的年月日，但是无法给出统一单位后的结果。  
就比如上面的例子中，相差的日子是`P1M6D`，即`1个月6天` 。这时候调用`getgetMonths()`和`getDays()`方法。会分别返回`1`和`6`  
但是我们无法确定总共相差了多少天，我们不能确定相差的月份有多少天。因此，这里就要用到`ChronoUnit`  
通过指定我们想要的单位，我们就可以快速地获取两个日子的差值，还是取上面的例子：

```java
        LocalDate localDate = LocalDate.of(2022, 7, 12);	//2022-7-12
        LocalDate localDateOld = LocalDate.of(2022, 6,6);	//2022-6-6
        long months = ChronoUnit.MONTHS.between(localDateOld, localDate);   //输出：1
        long days = ChronoUnit.DAYS.between(localDateOld, localDate);   //输出：36
```

如果老的日期在后面，新的日期在前面，输出的结果则为负数  
事实上，根据关键字的不同，`ChronoUnit`还可以计算星期、时分秒、毫秒等的差值。但是要注意的是，`LocalDate`只有日期没有时间，所以不支持时分秒的计算；同理`LocalTime`只有时间没有日期，不支持年月日的计算。当然`LocalDateTime`是全都支持的。

### ZonedDateTime

`LocalDateTime`用于表示本地的日期和时间，如果需要带上时区，就要用到`ZonedDateTime`。可以将其理解为：时区+`LocalDateTime`  
`now()`方法可以得到系统时区的当前时间，当然也可以通过`ID`指定时区；  
`LocalDateTime`的`atZone()`方法可以为其设置时区属性，并返回一个`ZonedDateTime`对象

```java
        ZonedDateTime zonedDateTime = ZonedDateTime.now();  //系统默认时区
        System.out.println(zonedDateTime);  //输出：2022-07-14T16:58:40.941+08:00[Asia/Shanghai]

        ZonedDateTime zonedDateTimeWithId = ZonedDateTime.now(ZoneId.of("America/New_York"));   //指定美国纽约时区
        System.out.println(zonedDateTimeWithId);    //输出：2022-07-14T04:58:40.943-04:00[America/New_York]

        LocalDateTime localDateTime = LocalDateTime.now();	//为LocalDateTime设置时区并转为ZonedDateTime
        ZonedDateTime zonedDateTime1WithLDT = localDateTime.atZone(ZoneId.of("America/New_York"));
        System.out.println(zonedDateTime1WithLDT);	//输出：2022-07-14T16:59:58.183-04:00[America/New_York]
```

可以看到两个`ZonedDateTime`对象表示的是同一时刻不同时区的时间，并且其自带时区的属性。（毫秒差是执行语句的时间差）  
要注意为`LocalDateTime`设置时区后，其时间是不会变化的，仅仅改变了时区。  
同样，也可以轻易地将`ZonedDateTime`变为一个`LocalDateTime`对象

```java
        ZonedDateTime zonedDateTime = ZonedDateTime.now();  //系统默认时区：2022-07-14T17:39:22.156+08:00[Asia/Shanghai]
        LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
        System.out.println(localDateTime);	//输出：2022-07-14T17:42:33.617
```

如果要对某一时间进行时区的转换，可以用`withZoneSameInstant()`方法，方法名中的`SameInstant`就表示同一时刻

```java
        ZonedDateTime zonedDateTime = ZonedDateTime.now();  //系统默认时区
        System.out.println(zonedDateTime);  //输出：2022-07-14T17:39:22.156+08:00[Asia/Shanghai]

        ZonedDateTime zonedDateTimeNewYork = zonedDateTime.withZoneSameInstant(ZoneId.of("America/New_York"));
        System.out.println(zonedDateTimeNewYork);   //输出：2022-07-14T05:39:22.156-04:00[America/New_York]
```

### DateTimeFormatter

由于`SimpleDateFormat`存在线程不安全等缺点，因此特意设计了`DateTimeFormatter`来进行时间的格式化显示  
使用方法类似，还是使用字符串来规定我们想要的格式，比如`"yyyy-MM-dd HH:mm"`

```java
        ZonedDateTime zonedDateTime = ZonedDateTime.now();   //2022-07-14T17:48:49.184+08:00[Asia/Shanghai]
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm ZZZZ"); //Z表示时区
        System.out.println(dateTimeFormatter.format(zonedDateTime));    //输出：2022-07-14T17:48 GMT+08:00
```

在格式化的字符串中，`Z`表示时区，而单引号的内容会被保留。  
此外，在规定格式的字符串中，可以指定`Locale`来改变时间的输出形式，让其变得更加本地化

```java
        ZonedDateTime zonedDateTime = ZonedDateTime.now();   //2022-07-14T17:48:49.184+08:00[Asia/Shanghai]
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy MMM dd EE HH:mm", Locale.CHINA);
        System.out.println(dateTimeFormatter.format(zonedDateTime));    //输出：2022 七月 14 星期四 17:48

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("E, MMMM/dd/yyyy HH:mm", Locale.US);
        System.out.println(dateTimeFormatter.format(zonedDateTime));    //输出：Thu, July/14/2022 17:48
```

### Instant

`Instant`用于表达某一时刻，其`now()`方法返回一个时间戳，和`System.currentTimeMillis()`方法类似

```java
        Instant instant = Instant.now();
        System.out.println(instant.getEpochSecond());   //精确到秒：1657879596
        System.out.println(instant.toEpochMilli());     //精确到毫秒：1657879596486
```

事实上，`Instant`拥有更高的精确度，因为它多了更高精度的纳秒（nanos）的属性  
时间戳通过转换就可以表示一个时间，因此加上时区也可以将其转化为`ZonedDateTime`

```java
        Instant instant = Instant.ofEpochSecond(1657879596);    //手动传入时间戳
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());   //系统默认时区，这里自然是Asia/Shanghai
        System.out.println(zonedDateTime);          //输出：2022-07-15T18:06:36+08:00[Asia/Shanghai]
```

如果我们想获取`LocalDateTime`或`ZonedDateTime`的时间戳形式，可以调用`toEpochSecond()`方法（返回的是`long`类型），当然这个单位是秒，获取毫秒则需要手动乘 1000

```java
        ZonedDateTime zonedDateTime = ZonedDateTime.now();  //2022-07-15T18:30:14.462+08:00[Asia/Shanghai]
        long timeStampSec = zonedDateTime.toEpochSecond();	//秒为单位
        long timeStampMilliSec = zonedDateTime.toEpochSecond() * 1000;	//毫秒为单位

        Instant instantFromSec = Instant.ofEpochSecond(timeStampSec);
        Instant instantFromMilliSec = Instant.ofEpochMilli(timeStampMilliSec);
		//两个Instant输出都是：2022-07-15T10:30:14Z
```

注意一点，根据时间戳（Epoch Time）的定义，其表示的是 0 时区的格林尼治时间，因此和上面的`ZonedDateTime`相差了 8 个小时（我们是东八区）  
需要在后续操作中自己设定时区

## 两个 API 的转换

既然旧的`java.util API`和新的`java.time API`都可以表示日期和时间，难免会涉及两种 API 的转换

### 旧 API 转为新 API

如果要把旧的`Date`或`Calendar`转换为新 API 对象，可以通过`toInstant()`方法转换为`Instant`对象，再继续转换为`ZonedDateTime`  
当然`Date`需要手动添加`ZoneId`，而`Calendar`本身带有`TimeZone`时区属性，因此可以通过`toZoneId()`方法转换为`ZoneId`属性

```java
//Date -> Instant
Date date = new Date();
Instant instantFromDate = date.toInstant();
//Calendar -> Instant -> ZonedDateTime
Calendar calendar = Calendar.getInstance();
Instant instantFromCalendar = calendar.toInstant();
ZonedDateTime zonedDateTime = instantFromDate.atZone(calendar.getTimeZone().toZoneId());
```

### 新 API 转为旧 API

新 API 并不能直接转为旧 API，毕竟提出新的 API 就是为了取代旧的 API，因此只能将时间转为时间戳，再转为旧 API  
由于时间戳多为`long`类型，因此注释中用`long`来表示时间戳

```java
//ZonedDateTime -> long
ZonedDateTime zonedDateTime = ZonedDateTime.now();
long timeStamp = zonedDateTime.toEpochSecond() * 1000;
//long -> Date
Date date = new Date(timeStamp);
//long -> Calendar
Calendar calendar = Calendar.getInstance();
calendar.clear();
String myZone = zonedDateTime.getZone().getId();    //得到String的时区标识：Asia/Shanghai
calendar.setTimeZone(TimeZone.getTimeZone(myZone)); //设置ZoneId
calendar.setTimeInMillis(timeStamp);    //设置时间
```

对于时区的表示，旧 API 采用`TimeZone`，而新 API 采用`ZoneId`，因此需要`ZoneId.getId()`方法获得字符串，再让`TimeZone`根据字符串设定时区。

## 参考

1. [Java 日期表示](https://blackdn.github.io/2019/10/17/Java-Date-Expression-2019/)
2. [廖雪峰：日期与时间](https://www.liaoxuefeng.com/wiki/1252599548343744/1255943660631584)
3. [java 日期时间](https://blog.csdn.net/qq_37746118/article/details/106601198?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0-106601198-blog-118820816.pc_relevant_multi_platform_whitelistv1&spm=1001.2101.3001.4242.1&utm_relevant_index=3)
4. [JDK 官方文档：SimpleDateFormat](https://docs.oracle.com/en/java/javase/12/docs/api/java.base/java/text/SimpleDateFormat.html)
5. [Joda.org](https://www.joda.org/)
