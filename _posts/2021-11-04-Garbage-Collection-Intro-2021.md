---
    layout:       post  
    title:        JVM内存模型与 GC 回收机制  
    subtitle:     JVM内存到GC的算法、回收器等，附带Java四种引用  
    date:         2021-11-04  
    auther:       BlackDn  
    header-img:   img/19mon5_24.jpg   
    catalog:      true  
    tags:  
       - Java  
       - Android  
---

> "行至朝雾里，坠入暮云间。"

## 前言

这篇真的拖了挺久...懒是一方面吧，还有就是挺忙的（开始找借口）  
这篇写的时候有点无从下手的感觉，特别是四种引用那里不知道怎么用代码表达出来  
然后之前忙着入党啊面试啊啥的，一结束就松了口气想要放松一下。    
于是去看了《沙丘》，还真挺好看，有时间去找小说看。  
好吧我就是懒。本来想着作为十月最后一篇博客的，然后拖到十一月了=。=

# JVM内存模型与 GC 回收机制

**垃圾回收机制（Garbage Collection）**，简称GC，是JVM所采用的，对内存空间进行回收的机制。众所周知，安卓对于内存的需求是十分迫切的，多一分内存就是多一分优化。利用GC机制，JVM得以自动检测内存中无用的对象进行回收，从而释放内存。  
而对于**GC回收机制**，我们可以简单理解为，**JVM进行垃圾回收时采用的算法**。当然存在不止一种算法，几个很常见的会在下面进行介绍。

## JVM内存模型

JVM的内存模型实际上就是其内部的**运行时数据区**，可以分为以下五个：

1. 程序计数器（Program Counter Register）
2. 栈（Stack）
3. 堆（Heap）
4. 方法区（Method Area）
5. 本地方法栈（Native Method Stack）

![JVM内存](https://z3.ax1x.com/2021/11/04/ImDP7F.jpg)  

### 程序计数器（PC）

在通用的计算机体系中，程序计数器（PC）用来记录当前正在执行的指令，在JVM中也是如此。  
每个线程启动的时候，都会创建一个PC，保存当前线程**正在执行的JVM指令的地址**，即**正在执行的字节码地址和行号**，用于保存现场信息。  
PC是线程私有的，即每一个线程都有它自己的PC寄存器。如果执行的是Native方法（非java代码），则PC的值为空。同时这也是JVM规范中唯一没有规定OOM（`OutOfMemoryError`）的区域

### Java栈（Stack）

当一个线程启动时，JVM会为其分配一个栈，Java栈也称JVM栈。  
当一个方法被调用时，会创建一个**栈帧**，用于存储局部变量和操作数（对象引用）等数据。其随着方法的结束而销毁  
Java栈只对栈帧进行**存储、压栈、出栈的操作**。栈帧中又包含以下五个部分：**局部变量表（Local Variables）**、**操作数栈（Operand Stack）**、**指向类的运行时常量池的引用（Reference to Runtime Constant Pool）**、**方法返回地址（Return Address）**和**附加信息**。要注意栈中只保存基础数据类型的对象和自定义对象的引用（对象本身保存在堆中）  
当一个线程执行一个方法时，会随之创建一个栈帧，将其压栈；方法执行完毕后将其出栈。    
由于栈的生命周期和线程同步，随线程创建而创建，随线程结束而释放，因此**对栈而言不存在垃圾回收**。

当栈内存是**固定值**时，我们请求深度大于栈的深度，比如数组下标越界，会导致`StackOverflowError`错误；  
当栈内存是**动态增长**时，申请的内存大小超过剩下的可用内存，会导致`OutOfMemoryError`错误。  

### 堆（Heap）

堆用来存放对象和数组（特殊的对象）本身，由**所有线程共享**。  
堆内存随着JVM启动而创建，因此需要一个**回收机制**来对其中的对象进行回收，进而释放内存。如果堆的剩余内存不满足对象的创建，JVM会抛出`OutOfMemoryError`错误  
堆的好处在于**运行时动态分配内存**，不必告诉编译器其生存期；但也因此其性能受限于自动回收所采用的算法。由于要先分配内存再进行访问，因此存取速度较慢。

### 方法区（Method Area）

方法区和堆相似，被所有线程共享，其中存储了JVM加载类所需的信息（类名称、方法信息、字段信息），静态变量、常量，编译器编译后的代码等。  
在Class文件中除了类的字段、方法、接口等描述信息外，还有一个常量池，用来存储编译期间生成的字面量和符号引用。  
而在方法区中则包含一个**运行时常量池**，在类和接口被加载到JVM后，对应的运行时常量池会被创建。运行期间也可以将新的常量放入运行时常量池。

#### 元空间（Metaspace）

或许我们都听过，“jdk1.8以后方法区被元空间取代”，但实际上这种说法是错误的。所谓方法区，实际上是**JVM的规范**，而元空间则是这种规范的一种实现。  
我们都知道Java采用JVM虚拟机的形式运行程序，而JVM实际上不止一个，其中应用最广的JVM就是**HotSpot**，他将方法区实现为**永久代（Permanent Generation）**，而其他类型的JVM，如JRockit（Oracle），J9（IBM）是没有永久代的，而是用其他方式实现方法区。因此，正确的说法是，**“永久代被元空间取代”**。

永久代和元空间最大的区别在于，永久代使用的是**JVM内存**，而元空间改为使用**本地内存**，很大程度上避免了`OOM: PermGen space`的异常。以往，程序中的字符串会存在永久代中，这容易出现性能问题和内存溢出，而元空间取消字符串常量池，将其移动到了**堆**中。此外，给永久代指定大小时，太小容易导致永久代溢出，太大容易导致老年代溢出。而分离出元空间后，可以简化GC，并对并发隔离等方面进行优化。

### 本地方法栈（Native Method Stack）

所谓**本地方法（Native Method）**，即该方法的实现由非Java实现，也就是在Java程序中调用非Java代码的接口。  
在Java中，`native`关键字可以和除`abstract`外所有其他的标识符连用，毕竟是在Java代码中调用非Java代码，那么一定是得到实现了的方法。总不能重写一个新的方法后要我用其他语言来实现他吧=。=  

## GC回收机制

由于程序计数器、JVM栈、方法栈随线程而生，随线程而灭，因此GC主要集中于Java堆和方法区中，这部分内存的分配和使用是**动态**的。  
GC需要进行回收的对象就是**不存活的对象**，通常通过以下两个方法判断一个对象是否存活：

1. 引用计数：每个对象有一个**引用计数属性**，新增一个引用时+1，引用释放时-1，计数为0则进行回收。但是无法解决对象相互循环引用的问题。
2. 可达性分析（Reachability Analysis）：从**GC Roots**（虚拟机栈引用的对象，方法区常量、类静态属性实体引用的对象，本地方法栈中JNI引用的对象）向下搜索，走过的路径成为**引用链**。当一个对象不存在于任何一条引用链中时，说明其是不可达的，可进行回收。

只要满足一个，则认为这个对象是不存活的，可以进行回收。

要注意的是，GC进行回收的时机并非由用户或代码掌控，而是由系统自身决定。当程序调用`System.gc()`时，系统会建议执行GC回收，但不是必然执行。  
GC就好比负责小区收垃圾的环卫工人，当垃圾多了的时候，可以建议他早点来；当没什么垃圾的时候，可以迟点来；当垃圾满了，就得尽快来；反正是不能随叫随到的。  
因此，对于GC回收的算法，主要是**对对象进行标记或分类，从而在下次GC回收的时候能快速判断当前对象是否要被清理**。

### 常用算法

#### 标记-清除算法

该方法为每个对象存储一个标记位，记录对象是否存活，主要分为两个阶段。在**标记阶段**，会为每个对象更新标记，检查其是否存活；在**清除阶段**，GC会对死亡对象进行清除。  
**优点**：对于一个引用，只要找到其一个 存活对象，就可以判断该引用为活。且不用移动对象位置。  
**缺点**：效率较低，标记和清除阶段要遍历所有存活对象；复杂度较高，容易产生无法利用的碎片空间。

#### 标记-整理算法（标记-压缩算法）

是**标记-清除算法**的改进版，也是分为两个阶段。**标记阶段**相同，对所有对象进行标记；在**整理阶段**，先将存活对象移动到另一处空间，再清除剩下的死亡对象。  
**优点**：不会产生碎片空间  
**缺点**：若存活对象过多，整理阶段将会执行多次操作，算法效率较低。

#### 复制算法

将内存分成两份，每次只使用其中一份。当其满了后，将其中存活对象复制到另一部分，然后清空之前的内存，之后使用存活对象所在的内存部分，如此循环。  
**优点**：实现简单，不产生碎片空间  
**缺点**：总有一部分内存是空着的，内存利用率较低

### 进阶：分代收集算法

为了进一步优化GC的回收过程，提出了**分代收集的策略（Generational Garbage Collection）**，这种算法基于堆结构的优化。

#### HotSpot结构优化

在HotSpot虚拟机中，将**堆结构**分为**新生代（Young Generation）**和**老年代（Old Generation）**，以及作为**方法区**实现的**永久代（Permanent Generation）**  

<img src="https://z3.ax1x.com/2021/11/04/ImDC0U.png" alt="struc" style="zoom:80%;" />  

**新生代**：新生代细分为**Eden区**，**Survivor区**，Survivor区又细分为**S0区**和**S1区**（或称**from区**和**to区**）。所有新的对象都存在新生代，当新生代满了后，会触发**Minor GC**，即**仅针对新生代的垃圾回收**。而存活的对象会不断==变老==，达到一定程度后会被移至老年代。  
官方称Minor GC为**“Stop the World”**事件，即进行Minor GC时，所有线程都进入阻塞状态，直到Minor GC结束。

**老年代**：老年代的区域又称**Tenured**，用来存放一些长时间存活的对象。通常会有一个**门槛**被设立给在新生代新建的对象，类似于一个`“age属性”`，每次进行Minor GC，这个属性都会+1，直到达到设立的门槛，然后这个对象就会从新生代移动到老年代。  
当老年代满了后，会触发一次**Major GC**，**仅对老年代进行垃圾回收**，因为涉及到所有存活对象，所以执行速度会比Minor GC慢一些。  
MajorGC也是**“Stop the World”**事件。

**永久代**：永久代存放一些描述类或方法的数据，用于JVM加载类，因为是**方法区**的实现所以和上面方法区的介绍相似。在jdk8后被元空间代替。  
当触发**Full GC**时，永久代也会被清理。



#### 各种GC  
这里我们涉及到了Minor GC，Major GC，Full GC。为了避免概念的混淆，这里梳理一下他们的区别。  
实际上，HotSpot存在一种垃圾回收策略，G1（Garbage First）算法，他允许对整个新生代和部分老年代进行回收。因此，从大类上分我们可以将GC的回收分为**全部回收**和**部分回收**  
**全部回收**指的是**Full GC**，他对整个新生代、老年代、永久代进行回收。  
**部分回收（Partial GC）** 则包括**Young GC（仅对新生代GC）**、**Old GC（仅对年老代GC）**、**Mixed GC（对部分的GC，如G1算法）**  
而我们所说的**Minor GC**和**Major GC**只不过是个俗称，官方文档并没有对其做出明确定义。由于HotSpot的发展和各种GC算法策略的提出，业界对其的解读并没有统一，所以**Major GC**在这里可能指**Full GC**，在那里可能就指的是**Old GC**。  
所以通常现在直接说Minor GC和Major GC会容易造成歧义，通常在比较浅显易懂的文档里使用。在常见的GC算法（GC收集器）中，如Serial GC、Parallel GC、CMS、G1等，会明确Young GC和Old GC，所以是不影响大家深入学习的。

#### 分代收集的过程

之前提到了所有对象都在新生代分配空间，现在我们进一步细化。实际上，所有新建的对象都是先存在新生代的**Eden区**中，此时**from区**和**to区**是空的。  
当**Eden区**满了后，触发了**Minor GC**。存活的对象（存在引用的对象）被移动到from区，而死亡的对象（没有引用的对象）就被清理回收了。以此清理出**Eden区**。  
直到下一次Eden区满了，再次触发**Minor GC**。这次会把**Eden区**和**from区**的死亡对象回收（**to区**为空），将其中的存活对象移动到**to区**，这样**Eden区**和**from区**就再次空出来了。  
下一次的Minor GC则会清理**Eden区**和**to区**的对象，将存活对象移到**from区**。如此循环， 对象在**from区**和**to区**之间反复横跳，每进行一次Minor GC，对象的`“age”属性`就+1，当达到一个门槛后（比如9），就被移动到**老年代（Tenured）**  
**老年代**满了后，触发**Major GC**，于是老年代被清理并整理，腾出新的空间。

<img src="https://z3.ax1x.com/2021/11/04/ImD9mT.png" alt="process" style="zoom:80%;" />

## 垃圾收集器（Garbage Collectors）

之前介绍了垃圾回收的算法，不过并不是所有算法都会被用到。什么时候回收，对哪里进行回收，采用什么算法回收，实际上是由垃圾收集器来决定的。当然存在许多不同的收集器，这里我们认识一下。深入学习就靠自己啦~

### 串行收集器（Serial GC）

是Java SE 5，SE 6中默认的收集器。特点是用一个虚拟CPU（一个线程），进行Minor GC和Major GC。此外，他采用**标记整理算法**，每次清理完后把剩余空间放在堆尾部，减少碎片空间。  
许多对暂停时间要求不高的、且是客户端类型的程序都选择串行收集器。此外，他还适用于一个机器多个JVM（即JVM数量多于处理器）的情况。这种情况下，只用一个处理器来进行垃圾回收能减少对其他JVM的干扰。  

### 并行收集器（Parallel GC）

并行收集器也称吞吐量收集器（Throughput Collector）。相对于Serial GC，Parallel GC使用多线程来进行垃圾回收，当然这要求机器本身是多核的。如果只有一个处理器，即使要求使用Parallel GC，机器仍会采用Serial GC。在多核的情况下，Parallel GC能有效减少垃圾回收时的停顿时间。  
他适用于需要完成大量工作并且可以接受长时间的停顿的场景，如打印工作（批处理任务）或执行大量数据库查询等操作。

### 并发标记清除收集器（CMS Collector）

并发标记清除收集器（Concurrent Mark Sweep，CMS）又称并发短暂停收集器（Concurrent Low Pause）。它尝试通过与应用程序线程并发执行大部分垃圾收集工作来最大程度地减少垃圾回收造成的暂停。通常并发低暂停收集器不会复制或压缩对象，即不移动活动对象完成垃圾回收，因此会造成碎片空间的问题。  
CMS适用于要求低暂停时间并且可以与垃圾收集器共享资源的应用程序，比如桌面UI应用程序、响应请求的网络服务器或响应查询的数据库等。  

### G1收集器（Garbage First GC）

G1是最新推出的收集器，在Java7后可用，指望他能代替CMS。他是个并行、并发、增量压缩的短暂停收集器。  
首先为了解决CMS碎片空间的问题，G1采用标记整理算法来解决。同时G1实现可预测停顿，指让使用者明确指定在一个长度为N毫秒的时间片段内，消耗在垃圾收集上的事件不得超过N毫秒。  
此外G1引入了Mixed GC，它将堆划分为若干大小相等的独立区域（Region），虽然保留新生代和老年代的感念，但他们可以是一段不连续的区域集合，以此实现回收时进行部分区域的回收。

## 四种引用

其实关于GC的东西已经讲的差不多了，不过回头看好像东西还挺少，于是再来讲讲四种引用的机制，毕竟这一部分在面试的时候也被问到挺多的。算是加餐吧。  
从Java SE 2开始提供了四种引用并一直沿用至今，主要是为了让开发者通过代码一定程度上决定对象的生命周期，其次也便于JVM进行垃圾回收。

实际中很少使用弱引用与虚引用，更多会用软引用。因为软引用可以减少OOM等错误，又不会胡乱回收对象导致重新加载资源等问题。

### 强引用（Strong Reference）

强引用是最常见的引用，当一个对象具有强引用，那么程序会认为这个对象**“必不可少”**。当内存空间不足时，JVM宁愿终止程序，抛出OOM错误，也不会回收该对象。  
当我们用`new`进行声明时，所产生的对象都属于强引用。如果想中断强引用和某个对象的关联，可以显示地将**引用**赋值为`null`。    
举个例子，当我们强引用太多导致内存满了后，即使会有GC，但并不会回收我们的强引用对象，最终导致OOM错误。

```java
    public static void main(String[] args) {
        Object[] objects = new Object[Integer.MAX_VALUE];
    }
```

运行结果是抛出了OOM的错误，因为长度超出了限制：

```
Exception in thread "main" java.lang.OutOfMemoryError: Requested array size exceeds VM limit
	at OtherTest.main(OtherTest.java:12)
```

下面这个图来自[GeeksforGeeks文章](https://www.geeksforgeeks.org/types-references-java/)中的例子，当我们用`Gfg g = new Gfg()`创建一个对象的时候，在内存中会开辟空间给这个`Gfg`的对象，我们可以看成`g`这个变量引用了这个对象。当我们显式调用`g = null`的时候，虽然`g`好像为空了，但是`Gfg`这个对象的空间仍然存在。在没有其他变量引用`Gfg`的时候，我们判断Gfg这个对象是没用的，所以通过GC来将这处空间进行回收释放。

![strongRef](https://z3.ax1x.com/2021/11/04/ImDSXV.png)  

### 软引用（Soft Reference）

软引用来描述一些有**用但不是必须**的对象，用`java.lang.ref.SoftReference`表示。在内存充足的情况下，即使一个软引用能够被回收，GC也不会将其回收，只有当**内存不足**的时候JVM才会回收该对象，因此多用软引用来解决OOM问题，如网页缓存、图片缓存等资源可以和软引用关联。  
我们用代码关联一个String对象和软引用：

```java
    public static void main(String[] args) {
        Object object = new Object();
        SoftReference<Object> softReference = new SoftReference<>(object);	//关联软引用
        obj = null; //解除强引用关联
        System.gc();	//通知JVM进行垃圾回收	
        System.out.println(softReference.get());		//尝试获取引用
		byte[] bytes = new byte[memorySize];	       	//模拟因为内存满了而触发GC
        System.gc();	//通知JVM进行垃圾回收	
        System.out.println(softReference.get());	//尝试获取引用
    }
```

运行结果如下：

```
java.lang.Object@74a14482
null
```

上面的例子中我修改了JVM的内存大小为`memorySize`，然后进行GC。由于内存满了后GC会回收软引用，因此再次获取引用对象就失败了，只能得到`null`。  
不过建议还是不用乱改内存，一不小心就改不回去了······看看就好。

### 弱引用（Weak Reference）

弱引用合软引用类似，来描述**非必须的对象**。不同的是，当JVM进行垃圾回收时，无论内存是否充足，都会回收弱引用对象。而软引用的对象仅在内存不足时进行的垃圾回收中被回收。因此弱引用的生命周期往往比软引用更短。  
也就是说，软引用的对象被回收有两个条件，即内存不足+GC；而弱引用的对象被回收只有一个条件，即GC。  
由此可见，并不是所有GC都会回收软引用对象，但是所有GC都会回收弱引用对象。

弱引用用`java.lang.ref.WeakReference`表示，

举个例子，将一个`String匿名对象`关联弱引用，然后调用 `System.gc()`进行垃圾回收。之所以用匿名对象主要是为了保证其只被引用一次，这样在GC时确保其被回收。

```java
    public static void main(String[] args) {
        WeakReference<String> weakReference  =new WeakReference<>(new String("I am a String Object"));	//弱引用关联对象
        System.out.println("before gc: " + weakReference.get());	//尝试获取引用对象
        System.gc();	//通知JVM进行垃圾回收
        System.out.println("after gc: " + weakReference.get());		//尝试获取引用对象
    }		
```

结果如下：  
一开始我们可以拿到String的弱引用，但是进行垃圾回收之后，该弱引用象就被回收了。

```
before gc: I am a String Object
after gc: null
```

当一个对象有自己的生命周期，且我们不想介入他的生命周期，或者一个对象只有偶尔使用且能随时获取到，那么我们可以考虑使用弱引用。比如和数据库的连接（DBConnection），这可以保证即使我们没有手动释放连接，在程序关闭时也可以对其进行回收释放。

### 虚引用（Phantom Reference）

用`java.lang.ref.PhantomReference`来表示弱引用。持有虚引用的对象相当于没有引用，可以随时被垃圾回收，主要用来跟踪对象被垃圾回收的过程。虚引用还必须和**引用队列（Reference Queue）** 一起使用，在从内存上被回收之前，JVM会对它们调用`finalize()`方法，并将他们放到引用队列中。通常一个对象调用`finalize()`后会被释放，但是一个**虚可达（Phantom Reachable）** 对象仍不会释放。（虚可达对象：该对象与GC Roots之间仅存在虚引用）   
当JVM对一个持有虚引用的对象进行回收时，会先销毁对象，并将虚引用加入引用队列中。在这个对象所关联的虚引用出队前，不会彻底销毁该对象。所以可以通过判断这个虚引用是否在引用队列中，程序可以确定持有这个引用的对象是否应该被回收。  
因此，虚引用最主要的用处，就在于

```java
    public static void main(String[] args) {
        String str = new String("string obj");	//实际上是个强引用
        ReferenceQueue<String> queue = new ReferenceQueue<>();	//引用队列
        PhantomReference<String> phantomReference = new PhantomReference<>(str, queue);		//虚引用
        str = null; //解除强引用关联
        System.out.println(phantomReference.get());		//尝试获取引用对象
    }
```

结果如下：

```
null
```

事实上，不管JVM有没有进行垃回收，我们永远无法从虚引用中获取对象，因为在源码中，`PhantomReference类`的`get()`方法永远返回`null`

```java
	/** -in PhantomReference.java-
     * Returns this reference object's referent.  Because the referent of a
     * phantom reference is always inaccessible, this method always returns
     * <code>null</code>.
     * @return  <code>null</code>
     */
    public T get() {
        return null;
    }
```

## 后记

这篇虽然不长，但是花了挺多时间的，你看下面的参考就知道了...  
主要是国内的大部分博客都挺千篇一律的，很多过程也不是很明白  
所以去看了许多英文的博客啥的，结合各个内容花了点时间  
不过也算是终于填上了这个坑吧=。=

## 参考

1. [jvm内存空间](https://www.cnblogs.com/jiezao/p/13334043.html)
2. [Java JVM 中 堆，栈，方法区 详解](https://blog.csdn.net/zhangqilugrubby/article/details/59110906)
3. [Java的native方法](https://blog.csdn.net/wike163/article/details/6635321)
4. [Java8内存模型—永久代(PermGen)和元空间(Metaspace)](https://www.cnblogs.com/paddix/p/5309550.html)
5. [通过图文给你讲明白java GC的垃圾回收机制](https://blog.csdn.net/future234/article/details/80677140)  
6. [Java GC机制详解](https://www.cnblogs.com/jobbible/p/9800222.html)
7. [Oracle官方文档](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html)
8. [Plumbr：minor gc/major gc/full gc](https://plumbr.io/handbook/garbage-collection-in-java/minor-gc-major-gc-full-gc)
9. [知乎：Major GC和Full GC的区别是什么？](https://www.zhihu.com/question/41922036)
10. [Java：强引用，软引用，弱引用和虚引用](https://blog.csdn.net/qq_39192827/article/details/85611873)
11. [你不可不知的Java引用类型之——虚引用](https://www.cnblogs.com/mfrank/p/9837070.html)
12. [GeeksforGeeks：Types of References in Java](https://www.geeksforgeeks.org/types-references-java/)
13. [Do You Really Know the 4 Reference Types in Java?](https://www.tutorialdocs.com/article/java-4-referance-types.html)

