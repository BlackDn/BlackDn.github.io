# Java的Stream API

## 前言

## Stream 流式API

在引入**Lambda表达式**之后，Java在函数式编程上更进一步，推出了包`java.util.stream`，即一系列**Stream API**  
这里的`Stream`不同于`java.io`中的输入输出流，而是类似于`List`的一种序列。  
和**List**这类容器相比，**Stream**最大的特点就在于，它可以不将内容实际存储，而是在我们需要的时候**通过计算**得出。  
所以简单来说，**Stream**能够不存储实际内容，而是**存储一种方法、一种规则**，当需要用到内容的时候，再通过这些方法计算得出。

### Stream的创建

#### Stream的创建（根据已有内容）

首先，**Stream**本身提供了静态方法`Stream.of()`来创建一个**Stream**对象，能够接受任意个参数

```java
Stream<String> stream = Stream.of("learn", "to", "use", "Stream");
```

如果我们进入这个方法看看，就会发现，这个方法实际上是调用了**Arrays**的`steam()`方法：

```java
public static<T> Stream<T> of(T... values) {
    return Arrays.stream(values);
}
```

其实不止**Arrays**，所有**Collections**都有`steam()`方法来创建一个**Stream**对象。  
而非**Collections**的类用的`Stream.of()`不过是先将这些对象放进**Arrays**中，再通过**Arrays**的`steam()`创建出**Stream**对象。

```java
//Create by none-Collections
String[] strings = new String[] {"learn", "to", "use", "Stream"};
Stream<String> stream1 = Stream.of(strings);
//Create by Collections
List<String> stringList = Arrays.asList("learn", "to", "use", "Stream");
Stream<String> stream2 = stringList.stream();
```

还可以用创建空的Stream对象：

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

在上面的例子中，我们在`Stream.generate()`中使用了`Math.random()`的方法引用，创建了含有随机数的**Stream**；  
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
我们可以用`skip()`来跳过前面特定数量的元素，然后用fingFirst()来定位当前元素，并用get()来获取

```java
Stream<Integer> iterateStream = Stream.iterate(1, n -> n + 1);
System.out.println(iterateStream.skip(100).findFirst().get());
//输出：
//101
```

#### 限制和遍历：limit()，forEach()

Stream实际上自带了方法`forEach()`能帮助我们遍历其内容  
但是由于`forEach()`是对**Stream**全部的内容进行遍历， 如果我们的**Stream**有无限个元素（比如之前的`iterateStream`），就会导致死循环，所以可以用`limit()`来限制输出的个数。  

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

#### filter()方法过滤元素

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

### 对Stream元素进行映射：map()和flatMap()

如果我们的Stream想要进一步操作，要怎么处理呢？  
比如现在我们`iterateStream`的内容是`1，2，3...`，而我们最终想要的是这些数的平方，`1，4，9...`  
如果把里面的内容一个个取出来变成一个List或者数组，自己平方，再转换成Stream，多少有点繁琐。所以**Stream**提供了`map()`方法，让我们直接对**Stream**的内容进行进一步的操作。

```java
Stream<Integer> iterateStream = Stream.iterate(1, n -> n + 1);
iterateStream = iterateStream.map(n -> n * n);
iterateStream.limit(10).forEach(n -> System.out.print(n + " "));
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
比如之前的字符串`"I have a cat"`，我们想分解出其中所有的字母。如果直接用`getLetters("I have a cat")`，会把空格也算进去。当然我们也可以先对字符串进行预处理，比如把空格替换掉。可以是可以，稍稍有点曲线救国了。  
不过，我们之前已经获得了不含空格的`Stream words` ，它的元素是`“I”，“have”，“a”，“cat”`，我们能不能在此基础上进行操作呢？  
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
words.sorted().forEach(n -> System.out.print(n + " "));
//输出：
//I a cat have

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

### Optional类

`Optional<T>`类是java.util包下的一个包装器，且允许内容为空。即要么里面包装了个`<T>`类型的对象，要么啥也没包装。  
因此这个类也被认为是更加安全的引用，可以很大程度上减少空指针所带来的错误。

简单来说，我们将想要的值直接赋给`Optional<T>`对象，而不是`<T>`对象。而`Optional<T>`本身提供的方法则是允许我们在其为空或非空的时候进行额外的操作。  
也因此，Stream的许多最终操作返回的都是`Optional<T>`对象，比如返回最大值和最小值的`max()`和`min()`方法，比如之前用过的`findFirst()`和`findAny()`方法。因为不能确定在加了这些约束后找到的流的内容一定存在，也可能全部都不匹配所以返回为空。

还记得之前我们构造了一个内容为`“I have a cat”`的名为`words`的Stream嘛，我们之前用`filter()`获取了其中长度大于等于4的元素。如果我们再使用`findFirst()`，就能拿到第一个长度大于等于4的元素，并且是一个`Optional<T>`对象。

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

#### 使用Optional类

之所以说Optional类安全，其一就是因为当其为空的时候我们可以选择进行其他操作，而不用特意进行判空操作  
比如`orElse()`方法允许我们设定一个默认值，当Optional为空时，则采用默认值：

```java
Optional<String> optional = Optional.of("Optional String");
String s = optional.orElse("Default");
//s的内容为："Optional String"
Optional<String> optional = Optional.empty();
String s = optional.orElse("Default");
//s的内容为："Default"
```

当然，还有许多其他方法：

```java
//ofNullable()：若传入内容为空，则生成空的Optional对象；若不为空，则生成对应Optional对象
String string = "not null";
Optional<String> optional = Optional.ofNullable(string);
//optional的内容为String类型的"not null"

//orElseGet(): Optional为空时，调用某一方法
Optional<String> optional = Optional.empty();
String s = optional.orElseGet(() -> System.getProperty("os.name"))
//s的内容为：Windows 10（因为我的操作系统是Win 10）
    
//orElseThrow(): Optional为空时，抛出某一异常
String s = optional.orElseThrow(IllegalArgumentException::new);
```

既然有“为空时”的操作，那当然也有“不为空时”的操作：`ifPresent()`方法

```java
Optional<String> optional = Optional.of("Optional String");
optional.ifPresent(n -> System.out.println(n + " is present"));
//输出: Optional String is present
```

不过这里要注意`ifPresent()`方法的返回值是`void`，如果还想对数据进行进一步处理，需要用`map()`方法

```java
optional = optional.map(n -> n.toUpperCase());
//optional的内容为: OPTIONAL STRING
```

## 参考

1. [使用Stream](https://www.liaoxuefeng.com/wiki/1252599548343744/1322402873081889)
2. [《Java核心技术 - 机械工业出版社》](https://book.douban.com/subject/34898994/)
2. [java8 Optional静态类简介，以及用法](https://blog.csdn.net/qq_28410283/article/details/80952768)