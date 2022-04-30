---
layout:       post  
title:        Java的Lambda表达式和Stream流  
subtitle:     函数式编程：Stream、Optional等用法一览  
date:         2022-04-30  
auther:       BlackDn  
header-img:   img/19mon6_30.jpg  
catalog:      true  
tags:    
    - Java    
---

# Java的Lambda表达式和Stream流

> "书里长安满街灯火，花灯璀璨；窗外小巷阴雨连绵，青藤霉湿。"

## 前言

赶在4月的尾巴发一篇文章  
基本上整个4月都在赶论文了，本来以为自己会在过年的时候就开始准备毕设，结果还是太小看自己的拖延症了  
这篇文章虽然没什么大道理，乍一看都是一些用法示例，不过对于大家理解Lambda和函数式编程也许有点帮助  
因为文章是在毕设过程中一点点写出来的，虽然写的时候没感觉，最后一看还有点长

## Lambda表达式

在Java 8中，提除了函数式编程（Functional Programming）的概念，和面向对象编程不同，函数式编程是一种抽象程度很高的编程范式，它的一个特点就是，允许把函数本身作为参数传入另一个函数，还允许返回一个函数。简单来说就是允许我们将函数（方法）作为参数进行传递。

由于函数式编程最初是由数学家阿隆佐·邱奇（Alonzo Church）研究的一套函数变换逻辑，他受到《数学原理》的启发，用小写的罗马字符lambda（λ）来表示，这也是Lambda表达式的名称由来。

### Lambda的用法

Lambda表达式则是函数式编程的核心，它的使用格式如下：

```java
( parameter-list ) -> { expression-or-statements }
```

前面的括号表示变量，即使没有变量也要加上括号；后面中括号表示函数（方法），如果只有一条语句有时也会省略括号。中间的箭头`->`可以看成是Lambda表达式的标志。

那什么时候可以用Lambda呢？比如注解`@FunctionalInterface`所标志的接口可以通过Lambda表达式创建实例，包括`Callable`、`Comparator`、`Runnable`等接口。

```java
@FunctionalInterface
public interface Runnable
{
   public abstract void run();
}
```

因此，我们可以用Lambda来创建一个Runnable对象：

```java
new Thread(() -> System.out.println("我是一个Runnable对象")).start();
```

显然，比起new一个**Thread**对象然后重写`run()`方法，使用Lambda表达式就显得简单许多，而且更易于理解。

### 方法引用

除了使用`() -> {}`的格式之外，Lambda还提供了另一种方式：**方法引用**

这里我们以**Optional**为例，第一次接触**Optional**这个了类也没关系，后面会介绍这个类的用法。这里可以看看**方法引用**的形式是怎样的：

```java
String name = "blackdn";
Optional.of(name).ifPresent(System.out::println);
```

`ifPresent()`方法可以接收Lambda作为参数，当Optional对象不为空时，会执行Lambda表达式，这里执行了输出操作。  
其中，`System.out`对应着类，而`println`则是类中的方法，中间的`::`则是方法引用的标志。  

如果不用方法引用，可以用如下代码表示，其中，变量的部分就代表了Optional对象的内容。

```java
String name = "blackdn";
Optional.of(name).ifPresent((n) -> {
    System.out.println(n);
});
```

关于Lambda的使用就不再举例了，在后面的Stream、Optional等类中均会涉及到Lambda的使用，可以在学习这些类的过程中进一步体会Lambda的使用。

## Stream 流式API

在引入**Lambda表达式**之后，Java在函数式编程上更进一步，推出了包`java.util.stream`，即一系列**Stream API**  
这里的`Stream`不同于`java.io`中的输入输出流，而是类似于`List`的一种序列。  
和**List**这类容器相比，**Stream**最大的特点就在于，它可以不将内容实际存储，而是在我们需要的时候**通过计算**得出。  
所以简单来说，**Stream**能够不存储实际内容，而是**存储一种方法、一种规则**，当需要用到内容的时候，再通过这些方法计算得出。

### Stream的创建

#### Stream的创建（根据固定内容）

首先，**Stream**本身提供了静态方法`Stream.of()`来创建一个**Stream**对象，能够接受任意个参数

```java
Stream<String> stream = Stream.of("learn", "to", "use", "Stream");
```

如果我们进入这个方法看看，就会发现，这个方法实际上是调用了`Arrays.steam()`方法：

```java
public static<T> Stream<T> of(T... values) {
    return Arrays.stream(values);
}
```

其实不止**Arrays**，所有**Collections**都有`steam()`方法来创建一个**Stream**对象，因为**Collections**实现了这个接口方法。  
而`Stream.of()`不过是先将这些非**Collections**类的对象放进**Arrays**中，再通过**Arrays**的`steam()`创建出**Stream**对象。

```java
//Create by none-Collections
String[] strings = new String[] {"learn", "to", "use", "Stream"};
Stream<String> stream1 = Stream.of(strings);
//Create by Collections
List<String> stringList = Arrays.asList("learn", "to", "use", "Stream");
Stream<String> stream2 = stringList.stream();
```

还可以创建空的Stream对象：

```java
Stream<String> emptyStream = Stream.empty();
```

不过这些**Stream**的元素都是固定的，在这种情况下，其实**Stream**和**List**差差不多，保存的都是实际内容。

#### Stream的创建（根据方法）

既然是根据方法创建Stream，为了将方法作为参数传入，Lambda在这里就大显身手了。  
常用的有两个方法，`Stream.generate()`和`Stream.iterate()`

```java
//生成一个含有无限元素的Stream，每个元素都为一个随机数
Stream<Double> randomStream = Stream.generate(Math::random);
//生成含有无限元素的Stream（内容为0，1，2，3...）
Stream<Integer> iterateStream = Stream.iterate(0, n -> n + 1);
```

在上面的例子中，我们在`Stream.generate()`中使用了`Math.random()`的方法引用，创建了含有无限个随机数的**Stream**；  
在`Stream.iterate()`中利用`seed = 0`和一个每次加一的Lambda来创建一个含有无限序列的**Stream**。  
因为是无限的，所以是不可能将元素实际存储在内存中的。**Stream**只存储了我们这个Lambda方法，在需要取出元素的时候，根据这个Lambda来计算出结果并返回给我们。

不过呢，由于Stream内存储的是引用类型，不能存储基本类型，所以当我们使用的时候会产生**频繁装箱和拆箱操作**，为此，Java还提供了**IntStream**、**LongStream**和**DoubleStream**三种类型的**Stream**。

```java
IntStream intStream = Arrays.stream(new int[] {1, 2, 3});
```

#### 其他类的创建方式

不仅如此，许多其他的类也提供了将自己转换成Stream的方式  
比如**Files**类的`lines()`方法可以将文件内容按行转换成Stream

```java
try {
    Stream<String> lines = Files.lines(Paths.get("/path/file.txt"));
} catch (IOException e) {
    e.printStackTrace();
}
```

比如**Pattern**类的`splitAsStream()`方法可以将匹配内容分割后转换成Stream  
相当于先`split()`之后把剩下的内容装进**Stream**中。

```java
Pattern pattern = Pattern.compile(" ");
Stream<String> stream = pattern.splitAsStream("I have a cat");
words.forEach(System.out::println);
//等效于
String[] strings = new String[] {"I", "have", "a", "cat"};
Stream<String> stream = Stream.of(strings);
```

### 获取Stream内容

#### 跳过和获取：skip()，get()

上面我们都是创建，但是没有获取其内容。  
我们可以用`skip()`来跳过前面特定数量的元素，然后用`fingFirst()`来定位当前元素，并用`get()`来获取

```java
Stream<Integer> iterateStream = Stream.iterate(1, n -> n + 1);
System.out.println(iterateStream.skip(100).findFirst().get());
//输出：
//101
```

#### 限制和遍历：limit()，forEach()

Stream实际上自带了方法`forEach()`能帮助我们遍历其内容  
但是由于`forEach()`是对**Stream**全部的内容进行遍历， 如果我们的**Stream**有无限个元素，就会导致死循环，所以可以用`limit()`来限制输出的个数。  

```java
Pattern pattern = Pattern.compile(" ");
Stream<String> words = pattern.splitAsStream("I have a cat");
words.forEach(n -> System.out.print(n + " "));
//输出：
//I have a cat

Stream<Integer> iterateStream = Stream.iterate(1, n -> n + 1);
iterateStream.limit(10).forEach(n -> System.out.print(n + " "));
//输出：1 2 3 4 5 6 7 8 9 10
```

#### 过滤元素：filter()

当然只是遍历是满足不了我们的需求的，而`filter()`方法帮助我们对元素进行筛选，就像在输出前加了个判断一样。  
比如我们只要words中长度`>=3`的元素：

```java
Pattern pattern = Pattern.compile(" ");
Stream<String> words = pattern.splitAsStream("I have a cat");
words.filter(n -> n.length() >= 3).forEach(System.out::println);
//输出：
//have
//cat
```

#### 对Stream元素进行映射：map()和flatMap()

如果我们的Stream想要进一步操作，要怎么处理呢？  
比如现在我们`iterateStream`的内容是`1，2，3...`，而我们最终想要的是这些数的平方，`1，4，9...`  
如果把里面的内容一个个取出来变成一个List或者数组，自己平方，再转换成Stream，多少有点繁琐。所以**Stream**提供了`map()`方法，让我们直接对**Stream**的内容进行进一步的操作。

```java
Stream<Integer> iterateStream = Stream.iterate(1, n -> n + 1);
iterateStream = iterateStream.map(n -> n * n);
iterateStream.limit(5).forEach(n -> System.out.print(n + " "));
//输出：
//1 4 9 16 25
```

比如一些大小写转换，去空格等操作，都可以通过`map()`完成。

假设现在我们有个方法，可以将一个单词（字符串）里的字母一一取出，并转换成一个Stream  

```java
public static Stream<String> getLetters(String string) {
    List<String> result = new ArrayList<>();
    for (int i = 0; i < string.length(); i++) {
        result.add(string.charAt(i) + "");
    }
    return result.stream();
}
```

那么我们可以直接调用这个方法来获取一个Stream，比如将字符串`“cat”`转为包含`“c”，“a”，“t”`的Stream：

```java
String string = "cat";
Stream<String> stream = getLetters(string);
stream.forEach(System.out::println);
//输出：
//c
//a
//t
```

但是当我们想对一句话进行分解的时候，问题就出现了。  
比如之前的字符串`"I have a cat"`，我们想分解出其中所有的字母。如果直接用`getLetters("I have a cat")`，会把空格也算进去。当然我们也可以先对字符串进行预处理，比如把空格替换掉。但似乎有点曲线救国，不是很满意，能不能一步到位呢？  
我们之前已经获得了不含空格的Stream：`words` ，它的元素是`“I”，“have”，“a”，“cat”`，能不能在此基础上进行操作呢？  
如果我们直接用`map()`对里面的元素进行`getLetters()`操作，由于`getLetters()`会将String变为Stream，这会导致我们的words变成一个包含Stream的Stream

```java
Stream<Stream<String>> result = words.map(n -> getLetters(n));
//数据结构为：
//result = [ ["I"], ["h","a","v","e"], ["a"], ["c","a","t"] ]
```

为了避免这种情况的出现，Stream提供了`flatMap()`方法，将嵌套的Stream“平摊”为单纯的Stream

```java
Stream<String> flatResult = words.flatMap(n -> getLetters(n));
//数据结构为：
//flatResult = ["I", "h","a","v","e", "a", "c","a","t"]
```

其实可以把Stream流想象成一个流水线，然后map()里的方法就相当于

### 其他常用操作

#### 去除重复元素：distinct()

比如Stream的`distinct()`方法能帮助我们去除重复的元素，达到类似Set结构的效果

```java
Stream<String> pets = Stream.of("cat" ,"cat", "dog");
pets.distinct().forEach(System.out::println);
//输出：
//cat
//dog
```

#### 排序：sorted()

Stream当然不能输给List，因此也可以进行排序。当然我们也可以自己进行Comparator的设置  
比如对`“words = ["I", "have", "a", "cat"]”`按照字符串长度进行排序：

```java
words.sorted(Comparator.comparing(String::length)).forEach(n -> System.out.print(n + " "));
//输出：
//have cat I a
```

#### 获取元素时调用：peek()

`peek()`方法允许我们在获取元素的时候进行方法的调用  
和`map()`不同的是，`peek()`只能传入返回值为`void`的方法，常用来进行输出等调试工作；  
和`forEach()`不同的是，`forEach()`的返回值为空，因此只能放在末尾；而`peek()`的返回值仍为Stream，因此我们可以在Stream的操作过程中穿插`peek()`，进行调试等操作。

```java
Stream<Integer> iterateStream = Stream.iterate(1, n -> n + 1);
iterateStream.limit(4).peek(n -> System.out.println("peek 1: " + n))
    .map(n -> n * n).peek(n -> System.out.println("peek 2: " + n)).toArray();
//输出：
//peek 1: 1
//peek 2: 1
//peek 1: 2
//peek 2: 4
//peek 1: 3
//peek 2: 9
```

#### 流的拼接：concat()

流的拼接比较简单，`concat()`方法可以将两个Stream的内容合起来

```java
Stream<Character> helloStream = Stream.of('H', 'e', 'l', 'l', 'o');
Stream<Character> worldStream = Stream.of('W', 'o', 'r', 'l', 'd');
Stream<Character> concatStream = Stream.concat(helloStream, worldStream);
concatStream.forEach(n -> System.out.print(n + " "));
//输出：
//H e l l o W o r l d 
```

#### 流的转换：collect()

在创建流的时候，我们可以通过Collection的`steam()`方法来将其转为Stream，也可以用Steam的`collect()`将Stream转为Collection  
比如将Collection转为ArrayList，需要在`collect()`中传入一个Collector对象，表明最后的返回值是一个ArrayList对象。

```java
Stream<String> stream = Stream.of("name", "name2", "name3");
ArrayList<String> arrayList = stream.collect(Collectors.toCollection(ArrayList::new));
```

不过，`collect()`方法还有一种重载方法，即并非接收一个**Collector**作为参数，而是一个**Supplier**和两个**BiConsumer**：

```java
<R> R collect(Supplier<R> supplier,
                  BiConsumer<R, ? super T> accumulator,
                  BiConsumer<R, R> combiner);
```

不去深究他的原理，我们可以简单理解为**Supplier**提供了一个容器，而后面的两个**BiConsumer**是对这个容器进行的操作。其中，**accumulato**处理Supplier提供的容器和stream中的元素，而combiner将所有accumulator处理后的结果进行处理（比如多线程下合并所有结果）    

所以上面的Stream转为ArrayList还可以表示为：

```java
Stream<String> stream = Stream.of("name", "name2", "name3");
stream.collect(ArrayList::new, ArrayList::add, ArrayList::addAll)
```

首先`ArrayList::new`提供一个ArrayList作为容器，`ArrayList::add`表示将stream的元素加入到ArrayList中。当然这样的结果是产生三个ArrayList，每个ArrayList都只有一个元素。因此最后用`ArrayList::addAll`将所有结果合并，形成一个包含三个元素的ArrayList。  
乍一看有点头大，不过我们可以不采用方法引用，而是详细写出各个Lambda的执行过程来明确整个`collect`的流程

```java
Stream<String> stream = Stream.of("name", "name2", "name3");
ArrayList<String> arrayList = stream.collect(
    ArrayList::new,
    (list, streamItem) -> {
        list.add(streamItem);
    },
    (resultList, list) -> {
        resultList.addAll(list);
    }
);
```

这样来看，`collect`的流程会明确许多。  
首先，在`supplier`中我们定义了一个ArrayList，这个ArrayList就是之后`accumulator`中的list。而`accumulator`所做的事情就是将stream的元素加入到这个list中去。  
由于我们是单线程，在执行完`accumulator`的内容后，所有stream的元素已经加入到ArrayList中去了，因此`combiner`的内容并不会执行。如果是在多线程的情况下，我们还需要在其中把所有的list整合为最终的ArrayList。

### 小结

总的来说，Stream的方法可以分为两类：**中间操作**和**终端操作**
中间操作可以有很多个，每次返回一个新的流，可以进行链式操作（就像建造者模式一样）；  
终端操作只能有一个，执行后不返回（通常返回`void`），无法进行后续操作，只能放在最后；

Stream的常用方法如下：

| 方法               | 中间操作/终端操作 | 返回值      | 作用                                                    |
| ------------------ | ----------------- | ----------- | ------------------------------------------------------- |
| Stream.of()        | 中间操作          | Stream<T>   | 创建含值的Stream                                        |
| Stream.empty()     | 中间操作          | Stream<T>   | 创建空的Stream                                          |
| Stream.generate()  | 中间操作          | Stream<T>   | 根据函数生成无限个元素的Stream                          |
| Stream.iterate()   | 中间操作          | Stream<T>   | 根据函数生成无限个元素的Stream                          |
| stream.skip()      | 中间操作          | Stream<T>   | 跳过若干个元素                                          |
| stream.findFirst() | 终端操作          | Optional<T> | 以Optional对象返回Stream的第一个元素                    |
| stream.limit()     | 中间操作          | Stream<T>   | 返回前若干个元素组成的Stream                            |
| stream.filter()    | 中间操作          | Stream<T>   | 过滤满足函数的元素，生成新的Stream                      |
| stream.map()       | 中间操作          | Stream<R>   | 对Stream内所有元素执行某一函数（可能产生Stream嵌套）    |
| stream.flatMap()   | 中间操作          | Stream<R>   | 对Stream内所有元素执行某一函数，将结果展位一个Stream<R> |
| stream.forEach()   | 终端操作          | void        | 对当前Stream的全部元素执行某函数                        |
| stream.distinct()  | 中间操作          | Stream<T>   | 去除当前Stream的重复元素                                |
| stream.sorted()    | 中间操作          | Stream<T>   | 返回排序后的Stream                                      |
| stream.peek()      | 中间操作          | Stream<T>   | 对元素执行返回值为void的方法                            |
| Stream.concat()    | 中间操作          | Stream<T>   | 拼接两个Stream                                          |
| stream.collect()   | 终端操作          | R           | 将Stream转为Collection（返回类型由collect()的参数决定） |

## Optional类

`Optional<T>`类是java.util包下的一个包装器，且允许内容为空。即要么里面包装了个`<T>`类型的对象，要么啥也没包装。  
因此这个类也被认为是更加安全的引用，可以很大程度上减少空指针（NPE）所带来的错误，减少了我们无脑的判空操作。

简单来说，我们将想要的值直接赋给`Optional<T>`对象，而不是直接实例化`<T>`对象。而`Optional<T>`本身提供的方法则是允许我们在其为空或非空的时候进行额外的操作。  
也因此，Stream的许多终端操作返回的都是`Optional<T>`对象，比如返回最大值和最小值的`max()`和`min()`方法，比如之前用过的`findFirst()`和`findAny()`方法。毕竟Stream不能确定在加了这些约束后一定能找到内容。

### 创建Optional类

还记得之前我们构造了一个内容为`“I have a cat”`的名为`words`的Stream嘛，我们之前用`filter()`获取了其中长度大于等于4的元素。  
又记得Stream的`findFirst()`方法能够返回第一个元素的Optional对象，所以：

```java
Pattern pattern = Pattern.compile(" ");
Stream<String> words = pattern.splitAsStream("I have a cat");
Optional<String> stringOptional = words.filter(n -> n.length() >= 3).findFirst();
//stringOptional的内容为: "have"
```

当然我们也可以手动创建Optional类：

```java
Optional<String> optional = Optional.of("Optional String");  //Optional.of()创建含值的Optional对象
Optional<Double> emptyOptional = Optional.empty();	//Optional.empty()创建空的Optional对象
```

注意`Optional.of(null)`是会抛出NPE错误的噢。  
此外，当我们不知道当前变量是否为空，可以使用`Optional.ofNullable()`。如果内容为空，则会生成一个空的Optional，反之则会正常生成这个Optional对象。

```java
String name = null;
Optional<Double> emptyOptional = Optional.ofNullable(name);
//相当于Optional.empty()
String name = "name";
Optional<Double> emptyOptional = Optional.ofNullable(name);
//相当于Optional.of(name)
```

### 判断是否存在：isPresent() / isEmpty()

`isPresent()`用于判断Optional对象是否有值（其实就是Optional自己的`obj != null`判断）。有值返回`true`，否则返回`false`

```java
System.out.println(Optional.empty().isPresent());	//输出：false
System.out.println(Optional.of("name").isPresent());	//输出：true
```

在Java 11中引入了`isEmpty()`方法，和`isPresent()`相反，为空返回`true`，否则返回`false`。

### 取值并设置默认值：orElse() / orElseGet()

Optional本身有一个`get()`方法，用于获取其中的内容。

```java
String name = "my name";
Optional<String> stringOptional = Optional.of(name);
System.out.println(stringOptional);
//输出：my name
```

但是由于该方法在Optional为空时，会抛出`NoSuchElementException`错误，虽然不是NPE，但也和我们引入Optional的初衷相悖——那还不是要我先判断是否为空嘛！  
所以比起`get()`，更推荐使用下面两个方法来获取内容：`orElse()`和`orElseGet()`。

之所以说Optional类安全，其一就是因为当其为空的时候我们可以选择进行其他操作，而不用特意进行判空操作  
`orElse()`方法允许我们设定一个默认值，当Optional为空时，则采用默认值。因此要求其中的值和Optional的泛型一致：

```java
Optional<String> optional = Optional.of("Optional String");
String s = optional.orElse("Default");
//s的内容为："Optional String"
Optional<String> optional = Optional.empty();
String s = optional.orElse("Default");
//s的内容为："Default"
```

而`orElseGet()`则是以函数（Lambda）为参数：

```java
String nullName = null;
String name = Optional.of(nullName).orElseGet(() -> "Empty!");
//name的内容为："Empty!"
```

还有个`orElseThrow()`用到的比较少，它用来抛出一个异常：

```java
String nullName = null;
String name = Optional.of(nullName).orElseThrow(IllegalArgumentException::new);
//抛出IllegalArgumentException异常
```

### 非空表达式：ifPresent()

我们拿到Optional对象后，想对其进行进一步操作。总不能一直用`if`语句判断`isPresent()`是否为`true`吧，这和我们引入Optional前变量进行判空的操作相差无几，违背了引入Optional的初衷。  
于是就有了`ifPresent()`，它将判断和操作融为一体。它接收函数（Lambda）作为参数，如果Optional存在值，则会执行该函数。可以看成是`orElseGet()`相反的方法。

```java
String name = "my name";
Optional.of(name).ifPresent(System.out::println);
//输出：my name
```

### 过滤值：filter()

我们可以将一些判断语句传入`filter()` 方法。如果Optional的值满足这些要求，则会正常保留；如果不满足，则会返回一个空的Optinal。  
比如我们想过滤长度大于5的字符串：

```java
Optional<String> stringOptional = Optional.of("my name");
stringOptional = stringOptional.filter(s -> s.length() > 5);
System.out.println(stringOptional.orElse("less than 5"));
//输出：my name
Optional<String> stringOptional = Optional.of("name");
stringOptional = stringOptional.filter(s -> s.length() > 5);
System.out.println(stringOptional.orElse("less than 5"));
//输出：less than 5
```

实际上，`filter()` 的参数是**Predicate**（Java 8 新增的一个返回`boolean`值得函数式接口），由于这个接口被注解了`@FunctionalInterface`，因此可以使用Lambda实现。因此我们可以构造多个**Predicate**对象，以多个条件进行筛选。  
比如过滤长度大于5，小于10的字符串：

```java
Predicate<String> moreThen5 = s -> s.length() > 5;
Predicate<String> lessThen10 = s -> s.length() < 10;

Optional<String> stringOptional = Optional.of("1234567");
stringOptional = stringOptional.filter(moreThen5.and(lessThen10));
System.out.println(stringOptional.orElse("less than 5 or more then 10"));
//输出：1234567
```

### 转换值：map()

`map()`方法能够将当前Optional根据一定“规则”转换为新的Optional对象，而原有的对象不会改变，即生成一个新的Optional对象。  
这里所说的“规则”就是作为参数传入的函数。

比如将字符变为大写：

```java
Optional<String> stringOptional = Optional.of("name");
Optional<String> newOptional =  stringOptional.map(String::toUpperCase);
System.out.println(newOptional.orElse("nothing"));
//输出：NAME
```

比如获取字符的长度：

```java
Optional<String> stringOptional = Optional.of("name");
Optional<Integer> newOptional =  stringOptional.map(String::length);
System.out.println(newOptional.orElse(0));
//输出：4
```

### 小结

前面Stream罗列了常用方法，Optional也就列一下吧：

| 方法                   | 作用                                                         |
| ---------------------- | ------------------------------------------------------------ |
| Optional.of()          | 创建含值的Optional对象                                       |
| Optional.empty()       | 创建空的Optional对象                                         |
| Optional.ofNullable()  | 创建含值的Optional对象；若传入的值为空，则创建空的Optional对象 |
| optional.isPresent()   | 判断Optional内的值是否存在                                   |
| optional.orElse()      | 获取Optional的值，若为空，返回orElse()内的值                 |
| optional.orElseGet()   | 获取Optional的值，若为空，执行orElseGet()内的方法            |
| optional.orElseThrow() | 获取Optional的值，若为空，抛出orElseThrow()内的异常          |
| optional.ifPresent()   | 若Optional的值不为空，则执行ifPresent()内的方法              |
| optional.filter()      | 若Optional的值满足filter()内的条件则保留，否则边为空         |
| optional.map()         | 将Optional内的值经过map()内的方法处理后生成新的Optional      |

## 其他常用Lambda的类

### Consumer

**Consumer**就像是个工作流程，他定义了一系列操作，并允许对某一对象进行操作，而这一对象则用泛型来表示。

```java
Optional<String> optional = Optional.of("hello world");
ArrayList<String> list = new ArrayList<>();
Consumer<Optional<String>> optionalConsumer = (n) -> {
    n.ifPresent(x -> list.add(x.toUpperCase()));
};
optionalConsumer.accept(optional);
```

上面这个**Consumer**的泛型就是`Optional<String>`，其内部的操作则是将这个`Optional<String>`的值变为大写并加入到ArrayList中。  
我们可以用`accept()`方法传入一个Optional来执行**Consumer**中定义的操作，其中，Lambda的`(n)`表示的就是这个`Optional<String>`对象。

在面向对象编程中，我们编写类作为抽象模板，实例化类的对象来进行操作。  
而在函数式编程中，我们像这样编写方法的模板，然后接收参数来执行方法。就像上面这个**Consumer**一样，我们定义完这个**Consumer**后，不需要关心传入的**Optional**的值是什么，他有什么属性有什么方法，直接用`accept()`将**Optional**对象传入即可。

### Function

我们可以简单地将**Function**理解为高级的**Consumer**，它允许我们的Lambda有返回值。  
**Function**的两个泛型分别代表了操作的参数以及返回值的类型。

```java
Optional<String> optional = Optional.of("hello world");
ArrayList<String> list = new ArrayList<>();
Function<Optional<String>, Boolean> function = (s) -> {
    if (s.isPresent()) {
        list.add(s.orElse("default").toUpperCase());
        return Boolean.TRUE;
    } else {
        return Boolean.FALSE;
    }
};
Boolean result = function.apply(optional);
```

上面的**Function**对一个`Optional<String>`进行操作，若存在值，则将其加入ArrayList中，并返回`true`；若不存在值，则返回`false`

## 后话

也许在**Stream**和**Optional**中表示地不明显，但是从**Consumer**和**Function**中我们可以感觉到，**函数式编程**和**面向对象编程**很明显的区别。  

面向对象编程着重于对象的构建，需要我们明确对象的属性、方法，并以此进行修改、调用。  
而函数式编程似乎不关心对象是怎样的，而只关心方法本身，就如同我们编写Lambda表达式一样。在`()->{}`中，我们不关心`()`里是怎样的对象，有什么方法，更多是关心在`{}`中要执行哪些操作。  
函数式编程更像是一条加工流水线，我们为流水线上添加功能，以此对产品进行操作、改造，至于产品是怎样的、有多少产品，是无需考虑的。

作为Java 8的新特性之一，函数式编程有其特有的优点，而Lambda表达式的引入，很大程度上就是为了让函数式编程变得更加流畅，减少其代码量。但也不易滥用，代码的简化必然带来可读性的降低。  
我们也不必在一篇文章内马上掌握函数式编程和Lambda的全部内容，先浅浅接触一下，以后如果遇到了可以再花点时间看看学学。

## 参考

1. [深入浅出 Java 8 Lambda表达式](https://tobebetterjavaer.com/java8/Lambda.html)
1. [廖雪峰：函数式编程](https://www.liaoxuefeng.com/wiki/1252599548343744/1255943847278976)
1. [Java 8 Stream流详细用法](https://tobebetterjavaer.com/java8/stream.html)
1. [使用Stream](https://www.liaoxuefeng.com/wiki/1252599548343744/1322402873081889)
1. [java8中stream().collect(Supplier＜R＞ supplier, BiConsumer＜R, ? super T＞ accumulator)说明](https://blog.csdn.net/LeoHan163/article/details/116716871)
2. [《Java核心技术 - 机械工业出版社》](https://book.douban.com/subject/34898994/)
2. [java8 Optional静态类简介，以及用法](https://blog.csdn.net/qq_28410283/article/details/80952768)
2. [Java 8 Optional最佳指南](https://tobebetterjavaer.com/java8/optional.html)