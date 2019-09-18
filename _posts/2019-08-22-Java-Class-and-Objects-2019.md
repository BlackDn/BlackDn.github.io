---
layout:       post
title:        Java对象和类的介绍
subtitle:     Quanta安卓课程-第一节课
date:         2019-08-22
auther:       BlackDn
header-img:   img/acg.gy_25.jpg
catalog:      true
tags:
    - Java
    - Quanta
---

>"万物皆有裂痕，那是光进来的地方。"

# 前言
摸了一个假期，终于开始再po文章上来了  
考虑到个人博客加载问题，同时也po到CSDN好了  
还有一篇关于多态的会迟一点发，这篇也要再进行修改呢
# Java对象和类的介绍
## 面向对象编程
**面向对象程序设计(Object Oriented Programming - OOP)**是区别于**面向过程（Procedure Oriented）**的一种编程架构，本质是将问题抽象成一个模型（类），将抽象的模型实例化（对象），以此解决问题。  
面向对象最大的三个特点：
1. 封装
2. 多态
3. 继承

面向过程是围绕功能进行的，为每一个功能写一个函数，需要考虑其中的每一个细节，以步骤划分；  
而面向对象则是在解决问题前，先分析对象的属性、行为，由此出发解决问题  
再具体举一个常用的例子：用这两种方法分别实现“把大象放进冰箱”。  
面向过程：肢解大象-打开冰箱-放入大象-关闭冰箱  
面向对象：大象（肢解功能、移动功能）、冰箱（打开功能、装载功能、关闭功能）。  

```
//面向过程
肢解大象;
打开冰箱;
放入大象;
关闭冰箱;

//面向对象
大象->被肢解;
冰箱->打开;
大象->移动到冰箱;
冰箱->关闭;
```
**注意：只有在面向对象编程的思想下才有类和对象的概念**  
## 类和对象
类与对象时整个面向对象中最基础的组成单元。  
先说说**对象（Object）**，~~对象就是你的男女朋友~~对象实际上可以是一切客观存在的事物，你所能感觉到的具体事物都可以是对象，比如猫狗、飞机汽车、同学老师等  
将对象抽象化，就是**类（Class）**，它并非是具体事物，而是一个概念；  
比如猫狗，我将他们抽象成**动物类**；飞机汽车抽象成**交通工具类**；同学老师抽象成**人类**  
对一个类来说，它有着自己特定的**特点**和**行为**，我们称之为**属性**和**方法**

```
动物类:
    属性：物种（是猫是狗？）、体重...
    方法：叫、跑、跳...
交通工具类：
    属性：重量、最高时速、价格...
    方法：启动、停止...
人类：
    属性：姓名、身高、体重...
    方法：走路、跑步、说话...
```
在编程设计中，我们需要定义一个类，再给对应的类定义具体对象。
### 类与对象的定义和使用
#### 类
```
class 类名称{
      属性；
      行为；
}

//定义Person类
class Person{
      //属性
      String name;    //名字
      int height;    //身高
      int age;    //年龄
      //方法
      public void walk(){      //走路
             System.out.print(name+"会走路");
      }
      public void tell(){        //说话
             System.out.print("名字:"+name+";"年龄:"+age);
      }
}
```
#### 对象
类定义完成之后，无法直接使用。如果要使用，必须依靠对象  
也就是说，我们要将类实例化，从而产生对象。利用关键字new实现实例化  

```
//声明并实例化对象
类名称 对象名称 = new 类名(); //格式
Person person = new Person();//Person实例
```
实例化完成后，你就有一个看得见摸得着的具体对象了，但是你会发现他的各个属性都是空的，我们要为其添加属性的具体的值  

```
//属性的调用
对象名.属性名 = 具体值；
person.name = "Mike"
person.age = 18;
```
然后我们可以试着调用方法，比如，让这个Mike讲话  
由于类中tell()方法没有参数，所以我们也不必传入参数  

```
//方法的调用
对象名.方法名(参数);
person.tell();
```
让我们完整的实现一下  

```
package test;	//test是包名，不要照抄

//定义类
class Person {
	String name;
	int age;
	
	public void tell() {
		System.out.println("My name is " + name + ", and I am " + age + " years old.");
	}
}

public class Test {		
	public static void main(String args[]) {
		Person man = new Person();	//实例化
		man.name = "Mike";	//给属性赋值
		man.age = 18;
		man.tell();		//调用方法
	}
}
```
运行结果：

```
My name is Mike, and I am 18 years old.
```
## 面向对象的封装性
在定义类时，在class或者属性变量之前加上修饰词public（公有）、protected（保护）、default（默认）、private（私有），表示它的被访问权限（能否被引用）  

|   修饰符   | 类内部 | 同个包 | 子类 | 任何地方（如其他java文件） |
| :-------: | :---: | :---: | :-: | :----------------------: |
|  public   |   √   |   √   |  √   |            √             |
| protected |   √   |   √   |  √   |            X             |
|  default  |   √    |    √   |  X   |            X             |
|  private  |   √    |   X    |  X   |            X             |

比如上面的代码中，属性name和age是没有修饰符的，也就是default（默认），我们可以在同一个包中调用  
### 加上private
现在我们加上private（私有）试试  

```
package test;	//test是包名，不要照抄

//定义类
class Person {
	private String name;    //仅这两行加了private
	private int age;
	
	public void tell() {
		System.out.println("My name is " + name + ", and I am " + age + " years old.");
	}
}

public class Test {		
	public static void main(String args[]) {
		Person man = new Person();	//实例化
		man.name = "Mike";	//给属性赋值
		man.age = 18;
		man.tell();		//调用方法
	}
}
```
运行结果如下：

```
Exception in thread "main" java.lang.Error: Unresolved compilation problems: 
	The field Person.name is not visible
	The field Person.age is not visible

	at test.Test.main(Test.java:16)
```
因为被private修饰，我们不能在同一个包下、类外部调用了（类被实例化成对象后，通过对象调用也属于外部调用）  
### getter和setter
现实中我们肯定要通过实例化的对象改变其属性，那么要如何访问private变量呢？  
方法是在类中编写方法**获取（get）**和**设置（set）**这些属性，然后通过对象调用这些方法  
由于方法是public的，所以可以在外部调用；而方法是在类内部的，所以可以修改private的变量  

```
package test;	//test是包名，不要照抄

//定义类
class Person {
	private String name;
	private int age;
	
	public void tell() {
		System.out.println("My name is " + name + ", and I am " + age + " years old.");
	}
	
	//增加name和age的get和set方法
	public void setName(String myName) {
		name = myName;
	}
	
	public String getName() {
		return name;
	}
	
	public void setAge(int myAge) {
		age = myAge;
	}
	
	public int getAge() {
		return age;
	}
}

public class Test {		
	public static void main(String args[]) {
		Person man = new Person();	
		//man.name = "Mike";	这两个属性不能直接调用了
		//man.age = 18;
		man.setName("Mike");	//利用方法设置这两个属性
		man.setAge(18);
		String name = man.getName();	//利用方法获取属性并赋值
		int age = man.getAge();
		System.out.println("name:" + name);    //打印看看有没有成功获取属性
		System.out.println("age:" + age);
		man.tell();		
	}
}
```
运行结果：

```
name:Mike
age:18
My name is Mike, and I am 18 years old.
```
## 构造方法
我们在实例化的时候有这样一句
```
Person man = new Person();
```
这其实是调用了构造方法  
我们会想到，我都没有编写构造方法，为什么我还能调用呢？  
实际上，通过构造方法我们才能将类实例化成对象（所以构造方法是必须的），在我们不定义他的时候，系统会默认给我们生成一个没有参数，没有返回值的构造方法，就像这样：  

```
	public Person() {
		
	}
```
当然，我们可以重写构造方法，让程序变得更简单，比如我们不输入name和age就让他去打印这两个信息会怎么样呢  

```
package test;	//test是包名，不要照抄

//定义类
class Person {
	private String name;
	private int age;
	
	//构造方法
	public Person() {
		
	}
	
	//以下没有变化所以省略
    ······
}

public class Test {		
	public static void main(String args[]) {
		Person man = new Person();	
		String name = man.getName();	//利用方法获取属性并赋值
		int age = man.getAge();
		System.out.println("name:" + name);
		System.out.println("age:" + age);
	}
}
```
结果是系统默认赋值（有些时候甚至会报错） 
```
name:null
age:0
```
其实我们可以在构造方法中实现这些赋值操作，也就是，设置属于我们自己的默认值  

```
package test;	//test是包名，不要照抄

//定义类
class Person {
	private String name;
	private int age;
	
	//构造方法
	public Person(String myName, int myAge) {
		name = myName;
		age = myAge;
		System.out.println("我是构造函数中的print");
	}
	
	public void tell() {
		System.out.println("My name is " + name + ", and I am " + age + " years old.");
	}
	
	//以下没有变化所以省略
    ······
}

public class Test {		
	public static void main(String args[]) {
		Person man = new Person("Mike", 18);	
		String name = man.getName();	//利用方法获取属性并赋值
		int age = man.getAge();
		System.out.println("name:" + name);
		System.out.println("age:" + age);
	}
}
```
运行结果：  
```
我是构造函数中的print
name:Mike
age:18
```
为什么说是默认值呢，因为我们之后执行代码是可以将我们在构造函数中的赋值给覆盖的  

```
//上面没变所以省略
······
public class Test {		
	public static void main(String args[]) {
		Person man = new Person("Mike", 18);	
		String name = man.getName();	//利用方法获取属性并赋值
		int age = man.getAge();
		System.out.println("name:" + name);
		System.out.println("age:" + age);
		//先赋值
		man.setName("John");
		man.setAge(20);
		//再打印看看
		name = man.getName();	//利用方法获取属性并赋值
		age = man.getAge();
		System.out.println("name:" + name);
		System.out.println("age:" + age);
	}
```
运行结果：  
```
我是构造函数中的print
name:Mike
age:18
name:John
age:20
```
所以，可以简单地认为，**构造方法就是在你实例化之后，执行自己写的代码前，程序自己执行的方法**
### 多个构造函数
有意思的是，我们可以构建多个构造函数，并且分别调用  

```
package test;	//test是包名，不要照抄

//定义类
class Person {
	private String name;
	private int age;
	
	//构造方法
	public Person() {
		System.out.println("我是没有参数的构造方法");
	}
	
	public Person(String myName) {
		name = myName;
		System.out.println("我是有一个参数的构造方法");
	}
	
	public Person(String myName, int myAge) {
		name = myName;
		age = myAge;
		System.out.println("我是有两个参数的构造方法");
	}

    public void tell() {
		System.out.println("My name is " + name + ", and I am " + age + " years old.");
	}
	
	//以下没有变化所以省略
    ·······

    public class Test {		
	public static void main(String args[]) {
		Person firstMan = new Person();
		firstMan.tell();
		
		Person secondMan = new Person("SecondMan");
		secondMan.tell();
		
		Person thirdMan = new Person("thirdman", 11);
		thirdMan.tell();
	}
}
```
运行结果：  
```
我是没有参数的构造方法
My name is null, and I am 0 years old.
我是有一个参数的构造方法
My name is SecondMan, and I am 0 years old.
我是有两个参数的构造方法
My name is thirdman, and I am 11 years old.
```
实际上，方法的参数不同，也会被认为是不同的方法（即使他们名字一样）  
因此，我们调用方法的时候，程序会根据我们传入的参数选择合适的构造方法  
## 类中的匿名对象
上面的例子中，我们实例化出对象的时候，对象都有名字，比如man、firstMan、secondMan、thirdMan  
其实我们可以不给他名字，直接传入参数并调用方法。这些没名字的对象就是匿名对象  

```
//上面没变所以省略
······

public class Test {		
	public static void main(String args[]) {
		new Person("Mike", 18).tell();
	}
```
## 课后实践
编写一个Book类，有以下要求：
1. 有私有属性：书名、作者、价格
2. 有方法bookInfo()：输出书名、作者、价格
3. 私有属性要有对应的getter和setter
4. 自定义一个带有全部参数的构造方法
5. main函数中至少实例化两个对象，其中一个用set方法设置属性并调用bookInfo()打印信息；另一个利用构造方法传入参数并调用bookInfo()打印信息
##### 参考
[Java 类与对象的介绍](https://blog.csdn.net/weixin_41276585/article/details/81504546)  
[类和对象](https://blog.csdn.net/yjj_xss/article/details/79788872)  
[Java 对象和类](https://www.runoob.com/java/java-object-classes.html)  
[3分钟带你理解类和对象](https://baijiahao.baidu.com/s?id=1597642060961639915&wfr=spider&for=pc)  
[对Java语言中包、修饰符、封装的一些总结 ](https://www.cnblogs.com/kelly-zkp/p/7502740.html)  
