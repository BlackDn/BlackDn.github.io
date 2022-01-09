---
layout:       post
title:        Java中多态（重载，重写）
subtitle:     Quanta安卓课程-第五节课
date:         2019-08-23
auther:       BlackDn
header-img:   img/acg.gy_10.jpg
catalog:      true
tags:
    - Quanta
    - Java
---

>"所有晦暗都留给过往，凛冬散尽，星河长明。"

# 前言
上一篇给滨哥看啦滨哥说没啥大问题，奈斯！
不过听从他的建议将一些更深度的知识作为扩展放在最后
加油！
# Java中多态（重载，重写）
面向对象编程的三大特性：封装、多态、继承  
多态存在的**三个必要条件**：
1. 继承
2. 重写
3. 父类引用指向子类对象

我们先来看一个实例对比：

```
package test;	

class Animal {
	public void cry() {
		System.out.println("我不知道要怎么叫");
	}
}

class Cat extends Animal {
	public void cry() {		//重写父类方法
		System.out.println("喵喵喵");
	}
}

class Dog extends Animal {
	public void cry() {		//重写父类方法
		System.out.println("汪汪汪");	
	}
}

public class Test {		
	public static void main(String args[]) {
		Cat cat = new Cat();
		cat.cry();
		Dog dog = new Dog();
		dog.cry();
		
		System.out.println("-----我是分割线-----");
		
		Animal an = new Cat();
		an.cry();
		an = new Dog();
		an.cry();
	}
}
```
输出结果是一样的：  
```
喵喵喵
汪汪汪
-----我是分割线-----
喵喵喵
汪汪汪
```
我们的an正是通过多态实现既输出“喵喵喵”又输出“汪汪汪”，尽管他实质上是Animal类，但他做到了对子类的引用
## 方法重载（Overload）
方法重载是让类以统一的方式处理不同类型数据的一种手段。是指在一个类里面，**方法名字相同，而参数必须不同，返回类型可以相同也可以不同**。  
每个重载的方法（或者构造函数）都必须有一个独一无二的参数类型列表。  
### 重载规则
1. 重载的方法必须修改参数列表（参数个数或类型不一样）
2. 重载的方法可以改变返回值类型
3. 重载的方法可以修改访问修饰符
4. 无法以返回值类型作为重载函数的区分标准，即仅返回类型不同的两个函数不属于重载（会报错）
5. 方法可以在本类或者一个子类被重载

### 在本类被重载
在本类重载方法最典型的要属构造函数了  
你可以编写多个构造函数，保证其参数列表不同。这样程序会把他看作多个不同的方法，并在调用时根据你传入的参数找到对应的方法  

```
package test;	

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
当然其他方法也可以被重载  

```
package test;	

//定义类
class Person {
	String name;
	int age;
	
	public void tell(String name) {
		System.out.println("My name is " + name);
	}
	
	public void tell(int age) {
		System.out.println("I am " + age);
	}
}

public class Test {		
	public static void main(String args[]) {
		Person man = new Person();
		
		man.name = "Mike";
		man.age = 18;
		man.tell(man.name);
		man.tell(man.age);
	}
}
```
运行结果：  
```
My name is Mike
I am 18
```
### 在子类被重载
以上述Person类为例，我们给他一个子类Student，新增属性job，并重写方法tell()  

```
package test;	

class Person {
	String name;
	
	public void tell(String name) {
		System.out.println("My name is " + name);
	}
	
}

class Student extends Person {
	String job;
	
	public void tell(String name, String job) {
		System.out.println("My name is " + name);
		System.out.println("I am a " + job);
	}
}

public class Test {		
	public static void main(String args[]) {
		Person p = new Person();
		Student s = new Student();
		
		p.tell("Mike");
		s.tell("John","student");
	}
}
```
运行结果：
```
My name is Mike
My name is John
I am a student
```
显然，我们调用s的tell方法，调用的时Student类中重载的tell方法
## 方法重写（Override）
子类中重新对父类中的方法的实现过程进行重新编写，**返回值和形参都不能改变**，又称覆盖、覆写等 
因此子类能够根据需要实现父类的方法  
正如一开始的例子，子类（Cat，Dog）中的cry()方法和父类（Animal）中的返回值（无）和形参列表（无）一样，是对父类的cry()方法的重载  
我们来简化一下一开始的例子  

```
package test;	

class Animal {
	public void cry() {
		System.out.println("我不知道要怎么叫");
	}
}

class Cat extends Animal {
	public void cry() {		//重载父类方法
		System.out.println("喵喵喵");
	}
}


public class Test {		
	public static void main(String args[]) {
		Animal a = new Animal();
		Animal b = new Cat();        //父类实现对子类的引用
		
		a.cry();
		b.cry();
	}
}
```
运行结果：
```
我不知道要怎么叫
喵喵喵
```
显然，尽管b属于Animal类型，但是它运行的是Cat类的cry方法  
原因是Cat中的cry方法对父类Animal中cry方法的重写  
### 重写规则
1. 重写的方法的名称与参数列表都与父类的方法（被重写方法）相同
2. 返回类型与被重写方法的返回类型可以不相同，但是必须是父类返回值的派生类（java5 及更早版本返回类型要一样，java7 及更高版本可以不同）
3. 访问权限不能比父类中被重写的方法的访问权限更低。  
例如：如果父类的一个方法被声明为 public，那么在子类中重写该方法就不能声明为 protected  
4. 构造方法不能被重写
5. final类，static类不能被重写，但是static类能再次被声明。
6. 构造方法不能被重写
7. 如果不能继承一个方法，则不能重写这个方法

### 没继承就重写
对应上述规则7，我们试试重写一个没有继承的方法  

```
package test;	

class Animal {
	public void cry() {
		System.out.println("我不知道要怎么叫");
	}
}

class Cat extends Animal {
	public void cry() {		//重写父类方法
		System.out.println("喵喵喵");
	}
	
	public void eat() {
		System.out.println("猫吃鱼");
	}
}


public class Test {		
	public static void main(String args[]) {
		Animal a = new Animal();
		Animal b = new Cat();
		
		b.eat();
	}
}
```
运行结果：

```
Exception in thread "main" java.lang.Error: Unresolved compilation problem: 
	The method eat() is undefined for the type Animal

	at test.Test.main(Test.java:26)
```
因为b本质上是Animal类，而Animal类中不存在eat方法，因此出现引用错误  
我们可以把eat方法放到父类中，看看能不能正常调用：

```
package test;	

class Animal {
	public void cry() {
		System.out.println("我不知道要怎么叫");
	}
	
	public void eat() {
		System.out.println("我不知道吃什么");
	}
}

class Cat extends Animal {
	public void cry() {		//重写父类方法
		System.out.println("喵喵喵");
	}
}


public class Test {		
	public static void main(String args[]) {
		Animal a = new Animal();
		Animal b = new Cat();
		
		b.eat();
	}
}
```
运行结果：
```
我不知道吃什么
```
成功运行。  
这说明我们的程序存在这样的机制：  
当父类引用子类后，也就是：  
```
Animal b = new Cat(); 
```
b调用方法时，程序会在b本身的类中查找方法，如果不存在方法，则抛出错误；如果存在方法，会向下查找，判断这个对象引用的子类中是否重写了这个方法。  
如果重写，则调用子类的方法；如果没有重写，就调用b本身类的方法
### super关键字
重写方法后，调用时不会调用父类的方法而调用子类的重写方法，如果需要父类的方法，需要用super关键字  

```
package test;	

class Animal {
	public void cry() {
		System.out.println("我不知道要怎么叫");
	}
}

class Cat extends Animal {
	public void cry() {		
		super.cry();	//意思是，调用父类（super）的cry方法
		System.out.println("喵喵喵");
	}
}


public class Test {		
	public static void main(String args[]) {
		Animal a = new Animal();
		Animal b = new Cat();
		
		b.cry();
	}
}
```
运行结果：
```
我不知道要怎么叫
喵喵喵
```
显然，在子类Cat的cry方法中我们实现了调用了父类的cry方法
## 编译时多态和运行时多态
如果在编译时能够确定执行多态方法中的哪一个，称为编译时多态，否则称为运行时多态。  
**方法重载**都是编译时多态。根据实际参数的数据类型、个数和次序，Java在编译时能够确定执行重载方法中的哪一个  
**方法覆盖**表现出两种多态性，当对象引用**本类实例**时，为编译时多态，否则为运行时多态  
### 编译时多态
在上述例子中，由于方法的重载，方法名相同的函数由于参数列表的不同构成了不同的函数，我们编写完方法后，进行编译的时候，编译器根据传入的参数调用特定的方法。这一步在编译时完成，称编译时多态  
比如之前的Person类的tell()方法  
### 运行时多态
运行时多态主要发生在父类引用子类对象，存在方法重写的时候  
由于方法的参数相同，因此编译时编译器检查父类的方法，此时并没有多态体现  
但是在程序运行的时候，由于子类实现的方法重写，程序会在子类中找到并调用这个方法，从而实现调用不同的方法，实现多态  
比如，一开始Animal、Cat、Dog类中的cry()方法就是这样实现的，因此an正是通过多态实现既输出“喵喵喵”又输出“汪汪汪”  
这也是多态的目的：**同一个行为具有多个不同表现形式或形态的能力**
## 课后实践
编写一个Father类，有以下要求：
1. 具有属性：工作（私有）、姓名（公有）、年龄（公有）、爱好（公有）
2. 具有方法：自我介绍（打印属性）、玩（传入爱好作为参数）
3. 实现自我介绍的方法重载：传入工作作为一个参数，传入姓名、工作作为两个参数

编写一个Son类，有以下要求：
1. 继承自Father类
2. 实现自我介绍的方法重载：传入姓名、年龄、爱好作为三个参数
3. 实现玩方法的重写（打印出不同的语句）

最后实现多态中重载和重写的体现
##### 参考
[重载和重写的不同，以及多态的简单介绍](https://blog.csdn.net/Catherinelnd/article/details/83214363)  
[Java 多态 ——一个案例 彻底搞懂它 ](https://www.cnblogs.com/1693977889zz/p/8296595.html)  
[Java 重写(Override)与重载(Overload)](https://www.runoob.com/java/java-override-overload.html)  
[Java 多态](https://www.runoob.com/java/java-polymorphism.html)  
[编译时多态、运行时多态](https://blog.csdn.net/qq_38962004/article/details/79690627)
# 拓展
如果你学有余力，不妨看看下面的内容  
多态的实现方式有以下三种：  
1. 重写和重载  
（我们刚学了不是吗）  
2. 接口  
[Java 接口](https://www.runoob.com/java/java-interfaces.html)
3. 抽象类和抽象方法  
[Java 抽象类](https://www.runoob.com/java/java-abstraction.html)
