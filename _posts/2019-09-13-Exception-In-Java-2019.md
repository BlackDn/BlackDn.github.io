---
layout:       post
title:        Java的异常简介
subtitle:     顺带final关键字的介绍~
date:         2019-09-13
auther:       BlackDn
header-img:   img/acg.gy_23.jpg
catalog:      true
tags: 
    - Java
---

>"月光还是少年的月光，九州一色还是泛白的霜。"

# 前言
大二重新学Java  
发现了许多原来没有理解或者没有掌握的知识  
所以计划把一些原理性的知识补上    

# Java异常简介
所有的异常继承自Throwable类，这个类主要分为两个大类：Error类和Exception类  
## Error类
Error类的错误通常是硬伤，包括虚拟机错误（VirtualMachineError），线程死锁（ThreadDeath）等难以通过简单的调整避免的。通常出现的较少。
## Exeption类
主要是编码、环境、用户操作输入出现问题
#### 非检查异常——运行时异常（RuntimeException）
引用空对象、方法，或数组访问越界，错误类型转换等都会引起运行时异常
具体分类如下  
1. 空指针异常：NullPointerException
2. 数组下标越界异常：ArrayIndexOutOfBoundsException
3. 类型转换异常：ClassCastExceprion
4. 算数异常：ArithmeticException

运行时异常会由Java虚拟机自动抛出和捕获，通常由代码本身的问题导致
#### 检查异常
由文件不存在、连接错误等导致。需要自己手动添加捕获语句  
主要有：
1. 文件异常：IOException
2. SQL异常：SQLException
## 异常的捕获和处理
try-catch，try-catch-finally  
主要语法如下  

```
try{
    //可能抛出异常的方法
} catch (Exception e1) {
    //处理该异常的代码块
} catch (AnotherException e2) {
    //处理另一种异常的代码块
} finally {
    //最终执行的语句块（不管有没有异常都要执行）
}
```
实际上可以有很多个catch，处理多种不同的异常  
要注意的是，多重catch异常的时候需要按照从小到大、从子类到父类的顺序进行catch  
当try中抛出错误时，程序会停止执行，并进入对应异常的catch语句块中执行，最终，如果有finally语句块，则执行其中语句。  
如果在try或者catch中存在return语句，那么在return后、回到调用函数前，会执行finally语句  
如果在try、catch、finally都没有return语句，在三者外有return语句，那么会先执行finally，再return回到调用函数
## 异常抛出
关键字：throw和throws   
当一个方法存在throw和throws时，必须在try语句块中进行调用，并用catch捕获可能出现的异常
### throw
将异常抛出，通常在方法体中
### throws
通常放在函数声明中，声明将要抛出何种类型的异常  

```
public void 方法名 (参数列表) 
            throw 异常列表{
        //调用会抛出的异常方法或者一下语句
        throw new Exception();
}
```
## 自定义异常
```
class 自定义异常类 extends 异常类型 {
    //需要构造方法
}
```
比如我在名为MyPackage的包下新建一个自定义异常类  

```
package MyPackage;

public class MyException extends Exception {	//继承Exception类
	
	public MyException() {		//无参构造器
		
	}
	
	public MyException(String message) {	//含参构造器
		super(message);
	}
}
```
## 异常链
将捕获的异常包装成新的异常，在新的异常中添加原始异常的引用，并抛出新的异常  
我在上面自定义异常类的同一个包下新建一个类测试异常链  

```
package MyPackage;

public class ChainTest {

	public static void main(String[] args) {
		ChainTest test = new ChainTest();	//实例化对象
		try {
			test.sealOldException();	//调用方法，这个方法中调用了另一个会抛出异常的方法
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}
	
	public void oldException() throws MyException{	//编写可能抛出异常的方法
		throw new MyException("我有异常了！");
	}
	
	public void sealOldException() {	//调用oldException()并捕获出现的异常
		try {
			oldException();
		} catch (Exception e) {		//捕获异常后产生新异常并抛出
			// TODO: handle exception
			RuntimeException runException = new RuntimeException("我是个新的RuntimeException");	
			runException.initCause(e);
			throw runException;
		}
	}
}
```
运行结果如下：

```
java.lang.RuntimeException: 我是个新的RuntimeException
	at MyPackage.ChainTest.sealOldException(ChainTest.java:24)
	at MyPackage.ChainTest.main(ChainTest.java:8)
Caused by: MyPackage.MyException: 我有异常了！
	at MyPackage.ChainTest.oldException(ChainTest.java:16)
	at MyPackage.ChainTest.sealOldException(ChainTest.java:21)
	... 1 more

```
可见，一开始抛出的是RuntimeException，他由MyException引起  
因为RuntimeException是我们捕获MyException后产生的新异常，他先被抛出，然后找到他产生的原因，是产生了MyException。
事实上还有一种异常链写法，这里不多赘述，有兴趣的话可以自己额外学习  
