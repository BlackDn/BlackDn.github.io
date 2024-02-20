---
layout: post
title: 从0开始的Swift（下）
subtitle: 主要和面向对象相关吧，类、结构体、协议等
date: 2022-11-18
author: BlackDn
header-img: img/19mon7_19.jpg
catalog: true
tags:
  - Swift
---

> "把秘密告诉风，让风吹过整片森林。"

# 从 0 开始的 Swift（下）

## 前言

上一篇在这：[从 0 开始的 Swift（上）](../2022-11-17-Swift-Introduce-Part1-2022)  
这篇主要是关于类、结构体、协议之类的东西，似乎是以面向对象为主。  
稍微比上一篇少一丢丢

## 结构体和类

分别用关键字`struct`和`class`定义结构体和类

```swift
struct SomeStructure {
    // 在这里定义结构体
}
class SomeClass {
    // 在这里定义类
}
```

类的属性可以在定义的时候初始化，当然类的成员也可以是一个结构体或类

```swift
struct Resolution {
    var width = 0
    var height = 0
}
class VideoMode {
    var resolution = Resolution()
    var interlaced = false
    var frameRate = 0.0
    var name: String?
}
```

### 值类型和引用类型

值类型相当于 Java 的基本类型，引用类型相当于 Java 的引用类型。  
当**值类型**被赋值给一个变量、常量或作为参数传递的时候，其值会被拷贝，后续的操作对最初的值类型对象是没有影响的。**结构体**和**枚举**就是值类型，Swift 中所有**基本类型**（整数、浮点数、布尔值、字符串、数组、字典）都是值类型，其底层也是使用结构体实现的。  
下面栗子中，结构体`hd`赋值给`myScreen`，后续对`myScreen`操作并不会影响到`hd`

```swift
var hd = Resolution(width: 1920, height: 1080)
var myScreen = hd
myScreen.width = 640
myScreen.height = 480
print("width x height = \(hd.width) x \(hd.height)")
//width x height = 1920 x 1080
```

相对的，**引用类型**则没有拷贝，而使用已存在实例的引用（相当于传地址嘛）。  
类就是一种引用类型。下面的栗子中，我们将`myVideo`赋值给`upgradeVideo`，并对`upgradeVideo`进行操作，而`myVideo`也随之改变。

```swift
var myVideo = VideoMode()
print("upgrade myVideo: interlaced = \(myVideo.interlaced), frameRate = \(myVideo.frameRate)")
//upgrade myVideo: interlaced = false, frameRate = 0.0
var upgradeVideo = myVideo
upgradeVideo.interlaced = true
upgradeVideo.frameRate = 30
print("upgrade myVideo: interlaced = \(myVideo.interlaced), frameRate = \(myVideo.frameRate)")
//upgrade myVideo: interlaced = true, frameRate = 30.0
```

为了判断多个对象是否使用相同的引用，Swift 提供了两个恒等运算符：相同（`===`）和不相同（`!==`）

```swift
print(myVideo === upgradeVideo) //true
```

只有使用引用类型的变量能使用这两个运算符。

### 属性

总的来说，Swift 中属性可以分为**存储属性**，**计算属性**和**类型属性**。

#### 存储属性

**存储属性**就是我们定义的变量或常量，且定义的时候，如果没设置默认值，则要明确数据类型。需要注意的是，如果一个结构体是常量，那么即使它其中有变量的属性也不允许修改。这是因为结构体是值类型，当它被声明为常量的时候，它的所有存储属性都会变成常量。  
（结构体默认会有一个**全参构造方法**）

```swift
struct User {
	let fullName: String
	var nickName: String
}
var blackdn = User(fullName: "black", nickName: "bbd")
blackdn.nickName = "bbdawn" //不报错
blackdn.fullName = "white"  //报错，不允许修改

let mike = User(fullName: "mike", nickName: "mk")
blackdn.nickName = "miky"    //报错，不允许修改
blackdn.fullName = "michel"  //报错，不允许修改
```

#### 计算属性

**计算属性**不直接存储值，而是提供一个`getter`和可选的`setter`，用于间接获取和设置其他属性或变量的值。  
注意计算属性必须要用`var`来声明变量。

```swift
struct Size {
	var width = 0.0
	var height = 0.0
}
struct Rect {
	var size = Size()
	var perimeter: Double {
		get {
			return (size.width + size.height) * 2
		}
		set (newPerimeter) {
			size.width = newPerimeter / 4
			size.height = newPerimeter / 4
		}
	}
}
var rectangle = Rect(size: Size(width: 2, height: 5))
print(rectangle.perimeter)  //14.0
rectangle.perimeter = 10
print(rectangle.size)   //Size(width: 2.5, height: 2.5)
```

上面的栗子中，我们定义了一个表示矩形的结构体，它的周长`perimeter`是一个**计算属性**，并不保存值，而是在用到的时候进行计算得出（读`perimeter`的时候调用`get`，写的时候调用`set`）  
因为周长是可以通过`size`的长和宽计算得出，我们把计算逻辑放在`get`中，每次读的时候就调用这个`get`求值并返回。  
而如果我们想给这个矩形设置一个新的周长，我们会根据这个周长将这个矩形变成正方形，并将它的长宽改为对应的值，这部分逻辑在`set`中实现。  
因此，我们将`perimeter = 10`之后，其长宽就都变成`2.5`了

对于`getter`来说，如果其单一表达式，则会隐式地返回这个表达式结果（可以省略`return`）：

```swift
		get {
			(size.width + size.height) * 2
		}
```

对于`setter`来说，如果定义表示新值的参数名，则可以使用默认名称 `newValue`：

```swift
		set {
			size.width = newPerimeter / 4  //报错
			size.height = newPerimeter / 4  //报错
		}
		//不报错：
		set {
			size.width = newValue / 4
			size.height = newValue / 4
		}
```

只有 `getter` 没有 `setter` 的计算属性叫**只读计算属性**。只读计算属性总是返回一个值，可以通过点运算符访问，但不能设置新的值。

#### 类型属性

**类型属性**可以和 Java 中的**类变量（静态变量）** 进行类比，类型属性由类（结构体）持有，而非对象，因此对于其所有对象来说，它们共享一个静态变量。
类型属性用关键字 `static` 来定义，且对象无法进行修改。即使没有任何对象，也可以获取类型属性的值。

```swift
struct Rect {
	static var angles = 4
}
print("Rect has \(Rect.angles) angles") //Rect has 4 angles
var myRect = Rect()
myRect.angles = 3 //报错：Static member 'angles' cannot be used on instance of type 'Rect'
```

#### 属性观察器

**属性观察器**会监控和响应属性值的变化，每次属性被设置值的时候都会调用属性观察器。  
我们可以为**自定义的存储属性** ，**继承的存储属性**和**继承的计算属性**添加属性观察器
属性观察期分为两种：

- `willSet` 在新的值被设置之前调用，将新的属性值作为常量参数传入。如果没有指定参数名，则默认为`newValue`
- `didSet` 在新的值被设置之后调用，将旧的属性值作为参数传入。如果没有指定参数名，则默认为`oldValue`

```swift
struct Rect {
	var size = Size() {
		willSet (newSize) {	print("change size to \(newSize)") }
		didSet (oldSize) {
			print("width differ: \(size.width - oldSize.width), height differ: \(size.height - oldSize.height)")
		}
	}
}
var myRect = Rect()
myRect.size = Size(width: 2.0, height: 3.0)
//change size to Size(width: 2.0, height: 3.0)
//width differ: 2.0, height differ: 3.0
```

#### 属性包装器

**属性包装器**在管理属性如何存储和定义属性的代码之间添加了一个分隔层。  
比如我们想为每个属性检查线程安全或存储数据库，那么每个属性都会有的逻辑代码。而属性包装器允许我们在定义的时候编写一次管理代码，然后复用到多个属性上。  
属性包装器可以是**结构体**、**枚举**或**类**，需要用`@propertyWrapper`声明，并且一定要有`wrappedValue`属性。  
这里我们定义个包装器来保证其中`Size()`类型的属性长宽不超过 10：

```swift
@propertyWrapper
struct LessThanTen {
	private var size = Size()
	var wrappedValue: Size {
		get { return size }
		set {
			var newSize = newValue
			if newSize.height > 10 {
				newSize.height = 10
			}
			if newSize.width > 10 {
				newSize.width = 10
			}
			self.size = newSize
		}
	}
}
```

可以看到，`wrappedValue`有着自己的`getter`和`setter`，`getter`照常返回其原值，而`setter`中，如果新值超过了 10，则将其设回为 10。这里没有为新值设置变量名，因此默认为`newValue`

```swift
struct Rect {
	@LessThanTen var size {
		willSet (newSize) { print("change size to \(newSize)") }
		didSet (oldSize) {
			print("width differ: \(size.width - oldSize.width), height differ: \(size.height - oldSize.height)")
		}
	}
}

var myRect = Rect()
myRect.size = Size(width: 2.0, height: 3.0)
//change size to Size(width: 2.0, height: 3.0)
//width differ: 2.0, height differ: 3.0
myRect.size = Size(width: 15, height: 15)
//change size to Size(width: 15.0, height: 15.0)
//width differ: 8.0, height differ: 7.0
```

在使用包装器的时候，在变量名前进行声明即可。这里为我们的`size`属性添加了`@LessThanTen`声明，表示用这个包装器进行包装。  
因为包装器中已经设置了默认值（`private var size = Size()`），因此`size`就不需要初始化默认值了。

### 方法

方法从大方向上分可以分为**实例方法**和**类型方法**，顾名思义，实例方法是每个实例出来的对象都各自拥有的，而类型方法则是由类持有、所有实例对象共用的方法（和类型属性一致）。  
类、结构体、枚举都可以定义实例方法和类型方法。

#### 实例方法

实例方法的语法与函数完全一致，能够隐式访问它所属类型的所有的其他实例方法和属性

```swift
class Counter {
    var count = 0
    func increment() {
        count += 1
    }
    func increment(by amount: Int) {
        count += amount
    }
    func reset() {
        count = 0
    }
}
let counter = Counter() // count = 0
counter.increment() // count = 1
counter.increment(by: 5) // count = 6
counter.reset() // count = 0
```

类型的每一个实例都有一个隐含属性叫做 `self`，代表该实例本身，如同 Java 中的`this`，比如上面`Counter`的方法中，所有`count`都可以用`self.count`代替。当然因为我们只有一个属性`count`，因此省略`self`也不会出现歧义。  
在某些情况下，使用`self`可以使得代码可读性更高，更加人性化：

```swift
    func increment(count: Int) {
        self.count += count
    }
```

我们现在知道，结构体和枚举是**值类型**，而默认情况下，值类型的属性不能在它的实例方法中被修改：

```swift
struct Point {
	var x = 0.0, y = 0.0
	func greet() {
		print("I am in (\(x), \(y))")
	}
	//下面这个方法会报错
	func moveBy(x deltaX: Double, y deltaY: Double) {
		x += deltaX
		y += deltaY
	}
}
```

因此，我们需要用关键字 `mutating`声明这个方法是**可变**的，能够修改自己的值类型：

```swift
struct Point {
	var x = 0.0, y = 0.0
	func greet() {
		print("I am in (\(x), \(y))")
	}
	mutating func moveBy(x deltaX: Double, y deltaY: Double) {
		x += deltaX
		y += deltaY
	}
}
var myPoint = Point(x: 2, y: 3)
myPoint.greet()
```

此外，在可变方法中，我们可以给 `self` 一个全新的实例：

```swift
	mutating func moveBy(x deltaX: Double, y deltaY: Double) {
		self = Point(x: x + deltaX, y: y + deltaY)
	}
```

注意一下这里，参数列表里的`x`和`y`是`deltaX`和`deltaY`的**参数标签**，`Point(x: x + deltaX, y: y + deltaY)`里的`x`和`y`是结构体 Point 的属性。

#### 类型方法

之前提到，**类型方法**则由类型本身调用的方法（和类型属性相似），用关键字 `static`定义。  
在类中，还可以用关键字 `class` 来表示允许被子类重写的类型方法。

```swift
struct Point {
	var x = 0.0, y = 0.0
	static func getOriginPoint() -> Point {
		return Point(x: 0, y: 0)
	}
}
print(Point.getOriginPoint()) //Point(x: 0.0, y: 0.0)
```

### 继承

子类和父类啥的继承关系就不多说了，大家都是面向对象编程，差差不多。  
Swift 中用冒号表示继承关系：

```swift
class FourLegsAnimal {
	var legs = 4
	var greetings: String {
		return "I have \(legs) legs"
	}
	func speak() {
		//do nothing
	}
}
class Cat: FourLegsAnimal {
	var favorite = "fish"
	override var greetings: String {
		return "I have \(legs) legs and like \(favorite)"
	}
	override func speak() {
		print("Meow")
	}
}
var myCat = Cat()
myCat.speak()   //Meow
print(myCat.greetings)  //I have 4 legs and like fish
```

我们定义了一个基类（父类）`FourLegsAnimal`，它有一个存储属性`legs`，一个计算属性`greetings`和一个不做任何事的方法`speak()`  
然后定义了一个子类`Cat`，并让`Cat`继承`FourLegsAnimal`。子类会自动继承父类的所有可继承特性，包括上述属性和方法。  
然后，我们通过`override`关键字，在子类重写了父类的`greetings`属性和`speak()`

此外，即使一些属性或方法被子类重写了，我们也可以用关键字`super`来访问父类的这些属性或方法：

```swift
class Cat: FourLegsAnimal {
	//......
	override var greetings: String {
		return super.greetings + ", and like \(favorite)"
	}
}

var myCat = Cat()
print(myCat.greetings)  //I have 4 legs, and like fish
```

要注意的是，子类继承属性的时候，需要写明名字和类型。但是我们不能在子类直接修改这些属性，只能修改它的`getter`和`setter`，而且不允许重写为只读属性（不能只有`getter`）  
注意在重写的时候，我们直接通过 `super.property` 来表示继承来的原值，而不是`self.propert`。使用后者将会导致**无限递归（infinite recursion）**

```swift
//报错：Cannot override with a stored property
class Cat: FourLegsAnimal {
	override var legs: Int = 3
}
//报错：Cannot override mutable property with read-only property
class Cat: FourLegsAnimal {
	override var legs: Int {
		get { return 3 }
	}
}
//不报错
class Cat: FourLegsAnimal {
	override var legs: Int {
		get { return super.legs }
		set {
			print("change \(legs) legs to \(newValue)")
			super.legs = newValue
		}
	}
}
myCat.legs = 3  //change 4 legs to 3
```

如果不想某个属性或方法被重写，则可以用`final`关键字来修饰，表示这个属性或方法无法被继承。当然还可以直接用`final`修饰整个`class`，那么整个类都无法被继承。

### 构造

在一个类被实例化的时候，所有存储属性都会被赋一个初始值。我们可以像之前的例子一样，在定义属性的时候就设置初始值，也可以通过**构造器（构造方法）** 来初始化属性。如果一个属性既没有默认值，也没有在构造器中初始化，则会报错。  
Swift 用关键字`init()`表示一个构造器。如果结构体或类为所有属性提供了默认值，又没有任何自定义的构造器，那么 Swift 会隐式地给这些其提供一个**默认构造器**，简单地创建一个属性全是默认值的实例。

```swift
class Student {
	var name = "Xiao Ming"
	var age = 18
	var score = 60.0

	func introduce() {
		print("name - age - score: \(name) - \(age) - \(score)")
	}
}
var myStudent = Student()
myStudent.introduce() //name - age - score: Xiao Ming - 18 - 60.0
```

不同于 Java，在自定义的构造器中，即使参数类型相同，参数名不同的构造器仍会被认为是不同的两个构造器：

```swift
class Student {
	var name = "Xiao Ming"
	var age = 18
	var score: Double

	func introduce() {
		print("name - age - score: \(name) - \(age) - \(score)")
	}

	init(scoreOfHundred: Double) {
		self.score = scoreOfHundred
	}
	init(scoreOfTen: Double) {
		self.score = scoreOfTen / 10
	}
}
var myStudent = Student(scoreOfTen: 65)
myStudent.introduce() //name - age - score: Xiao Ming - 18 - 6.5
```

不过，在这种情况下，不予许所有构造器的参数都使用`下划线(_)`，否则编译器会报错，毕竟下划线表示不使用参数标签，这样掉用的时候编译器就不知道该掉用哪个构造器了。

```swift
	//报错：
	init(_ scoreOfHundred: Double) {
		self.score = scoreOfHundred
	}
	init(_ scoreOfTen: Double) {
		self.score = scoreOfTen / 10
	}
```

在某些情况下，某些属性是不需要初始化、允许为空的。那么可以将其声明为 `可选类型`，它们将被动初始化为 `nil`。

```swift
class Student {
	var name = "Xiao Ming"
	var age = 18
	var score: Double
	var classRoom: String?
}
```

常量也可以通过构造器赋值，不过赋值之后就不可更改。

#### 指定构造器和便利构造器

**指定构造器**是比较主要和常见的构造器，我们上面用到的就属于这种。它会初始化类中所有属性，并通过继承链调用合适的父亲构造器，以便初始化继承自父类的属性。  
指定构造器越少越好，通常情况下一个类只拥有一个指定构造器，而一个类至少也要有一个指定构造器。  
**便利构造器**是类中比较次要的、辅助型构造器。便利构造器最终都要调用同一个类中的指定构造器，并进行一些初始化操作，通常用来为部分形参提供默认值。

```swift
class Student {
	var name = "Xiao Ming"
	var age = 18
	var score: Double

	func introduce() {
		print("name - age - score: \(name) - \(age) - \(score)")
	}

	init(scoreOfHundred: Double) {
		self.score = scoreOfHundred
	}

	convenience init(name: String, score: Double) {
		self.init(scoreOfHundred: score)
		self.name = name
		self.age = 20
	}
}
var myStudent = Student(name: "BlackDn", score: 99)
myStudent.introduce() //name - age - score: BlackDn - 20 - 99.0
```

#### 构造器的继承

跟 Objective-C 或 Java 不同，Swift 中的子类默认情况下**不会继承父类的构造器**。这可以防止父类的简单构造器被一个更精细的子类继承，从而导致在创建实例时没有完全被初始化或错误初始化。  
如果想要继承父类的指定构造器，那么需要用`override`修饰，即使是重写父类隐式的默认构造器也一样。但是由于子类无法显式继承父类的便利构造器，所以不管父类有没有定义便利构造器，子类都可以直接定义便利构造器而不用添加`override`。

```swift
class Vehicle {
	var wheels = 0
	var descreption: String {
		return "I have \(wheels) wheels."
	}
}

class Bicycle: Vehicle {
	var price = 100.0
	override init() {
		super.init()
		wheels = 2
	}
}
```

子类 `Bicycle` 定义了一个自定义指定构造器 `init()`。这个指定构造器和父类默认的指定构造器相匹配，所以实际上是对其的一个重写，因此需要`override` 修饰。  
重写的 `init()` 需要通过 `super.init()` 调用父类的默认构造器，以确保在进一步操作前，继承的属性都已被初始化（反正没有也会报错）。

虽然我们一开始提到，子类默认情况下不会继承父类的构造器，但是存在特殊情况子类会**自动继承**父类的构造器。  
如果我们的子类所有的新属性都有默认值（而不是通过构造器初始化），那么：

1. 如果子类没有任何指定构造器，那么会自动继承父类所有的**指定构造器**
2. 如果子类实现（重写）了父类全部的指定构造器（包括情况 1），那么它将自动继承父类所有的便利构造器。

```swift
class SeniorStudent: Student {
	var isWorking: Bool = false
	override func introduce() {
		super.introduce()
		print("Am I working? \(isWorking)")
	}
}
var myStudent = SeniorStudent(name: "BlackDn", score: 99)
myStudent.introduce()
//name - age - score: BlackDn - 20 - 99.0
//Am I working? false
var anotherStudent = SeniorStudent(scoreOfHundred: 59)
anotherStudent.introduce()
//name - age - score: Xiao Ming - 18 - 59.0
//Am I working? false
```

可以看到，我们的子类`SeniorStudent`本身没有任何构造器，它仍可以通过继承来的父类的指定构造器和便利构造器成功初始化。

#### 可失败的构造器

在实例化的某些情况下，如传入无效的参数、缺少某些资源等，我们并不想成功地实例化一个对象，那么我们可以用`init?`来表示一个**可失败的构造器**  
可失败构造器会创建一个类型为自身类型的**可选类型对象**，我们用`return nil` 语句来表明失败的情况。  
不过要注意，可失败构造器的参数名和参数类型，不能与其它非可失败构造器相同。

```swift
class Student {
	var name = "Xiao Ming"
	var age = 18
	var score = 60

	func introduce() {
		print("name - age - score: \(name) - \(age) - \(score)")
	}
	init? (age: Int) {
		if age <= 0 {
			return nil
		}
		self.age = age
	}
}
var myStudent = Student(age: 0)
if let checkInStudent = myStudent {
	checkInStudent.introduce()
} else {
	print("illegal age")
}
//illegal age
```

在重写的时候，我们可以重写父类的可失败构造器，也可以将父类的可失败构造器重写为非可失败构造器，但是不能将非可失败构造器重写为可失败构造器。

```swift
init? -> init?  //可以
init? -> init  //可以
init -> init?  //不行
```

#### 必要构造器

该类所有子类都要实现（重写）的构造器称为**必要构造器**，用`required`声明

```swift
class Student {
	var name = "Xiao Ming"
	var age = 18
	var score = 60.0
	init () {}
	required init(name: String) {
		self.name = name
	}
}
//报错：required initializer must be provided
class SeniorStudent: Student {
	var isWorking: Bool = false
	override init() {
		super.init()
		isWorking = true
	}
}
//不报错：
class SeniorStudent: Student {
	var isWorking: Bool = false
	override init() {
		super.init()
		isWorking = true
	}
	required init(name: String) {
		super.init(name: name)
		print("My name is \(name)")
	}
}
//不报错：
class SeniorStudent: Student {
	var isWorking: Bool = false
}
```

在上面的例子中，我们在子类`SeniorStudent`只重写一个非必要构造器，编译器报错并要求我们重写必要构造器。当然，我们也可以用**自动继承**来让子类自己继承所有父类构造器，这其中包括必要构造器，所以也不会报错。

### 类型检查和类型转换

#### is 和 as

关键字 `is` 用于**类型检查**，它检查一个实例是否属于特定子类型，是的话返回`true`，不是返回`false`，类似 Java 中的`instanceof`

```swift
class Animal {
	var name: String
	init(name: String) {
		self.name = name
	}
}
class Dog: Animal {
	var speak: String
	init(name: String, speak:String) {
		self.speak = speak
		super.init(name: name)
	}
	func shout() { print("I can \(speak)") }
}
class Cat: Animal {
	var favorite: String
	init(name: String, favorite: String) {
		self.favorite = favorite
		super.init(name: name)
	}
	func favor() { print("I like \(favorite)") }
}

let petStore = [Dog(name: "white", speak: "woof"), Cat(name: "cow", favorite: "meow"), Dog(name: "black", speak: "bark")]
for pet in petStore {
	if pet is Cat { numberOfCat += 1 }
	if pet is Dog {	numberOfDog += 1 }
}
print("dog: \(numberOfDog), cat: \(numberOfCat)") //dog: 2, cat: 1
```

在上面的例子中，`petStore`通过类型推断后，得到的是存储`Animal`类型的数组，毕竟 Swift 保证数组类型的统一。

类型转换的关键字是`as`、`as?`和`as!`，它们本质上都是一种**赋值操作**。  
我们把继承关系看成一棵树，基类（父类）是其根节点，并向下指向自己的子类，子类向上继承父类。  
将子类转换成父类称为**向上转型（upcasts）**，因为向上转型是一定会成功的（Java 中都可以自动转型呢），所以不需要进一步操作。  
将父类转换成子类称为**向下转型（downcasts）**，由于向下转型可能会失败，因此分为`as?`和`as!`。  
`as?`返回一个可选值，当失败的时候返回`nil`，而`as!`则是强制类型转换，返回的是非可选值，如果转换失败则会抛出 `runtime` 错误，因此我确定转换一定成功的时候才使用。

```swift
var myPet: Animal = Dog(name: "black", speak: "woof")
if let pet = myPet as? Dog {
	pet.shout()
} else if let pet = myPet as? Cat {
	pet.doFavor()
}
//输出：I can woof
```

在上面的例子中，`myPet`本身是个`Animal`的对象，因此他不会`shout()`或`doFavor()`方法，想使用这些方法的话，我们就得先进行类型转换。如果我不清楚`myPet`是如何被初始化的，那么我就需要用`as?`来进行可选绑定，从而调用对应类的方法。  
但是如果我很清楚`myPet`是如何来的，并且确定其类型转换会成功，那么就可以使用`as!`来进行向下转型。

```swift
//I am sure my pet is dog
var myPet: Animal = Dog(name: "black", speak: "woof")
(myPet as! Dog).shout()  //I can woof
```

#### Any 和 AnyObject

Swift 为不确定的类型或对象提供了`Any`和`AnyObject`两种别名，官方文档翻译来是这样的：

- `Any`：表示任何类型的实例，包括函数。
- `AnyObject`：表示任何类的实。

笑死，还是看不懂。  
于是我们往下深挖一点，先来看`AnyObject`，实际上`AnyObject`是一个**协议**。协议在下一节就介绍了，在这里先提及一下，方便理解`Any`和`AnyObject`。  
凡是被`class`定义的类型，那么它就会隐式遵循`AnyObject`这个协议。（当然这个协议里没有啥属性或方法需要实现） ，可以说`AnyObject`代表了所有由`class`定义的类。到那时，除此之外其他的类型怎么办？我们还有基本类型，结构体，枚举啥的呢。  
于是这就有了`Any`，它代表一个**空协议集合**，表示没有实现任何协议，想象一下“空集是所有集合的子集”，`Any`就类似这里的空集。因此它可以是任何类型，包括类实例与结构体实例。我们知道基本类型的底层是由结构体实现的，因此`Any`也能表示基本类型。  
我们可以理解为`AnyObject`也遵循了`Any`，可以说`AnyObject`是`Any`的子集

```swift
var anyItem: AnyObject = 1  //报错：'Int' expected to be instance of class
var anyObj: AnyObject = Animal(name: "black")
print(anyObj is AnyObject)  //true
print(anyObj is Any)  //true

var arr: [Any] = [1, 0.5, "hello", Animal(name: "black")]
var arrObj: [AnyObject] = [1 as AnyObject, 0.5 as AnyObject, "hi" as AnyObject, Animal(name: "white")]
```

总的来说，`class`表示的类都可以用`AnyObject`代替（当然也可以用`Any`），而其他的基本类型、结构体、函数啥的都可以用`Any`表示。

## 协议

可以把**协议**理解成 Java 的接口，它规定了用来实现某一特定任务或者功能的方法、属性。  
类、结构体或枚举都可以**遵循协议**，就好比在 Java 中实现借口。  
用关键字`protocol`定义一个协议，在结构体或类后面加`冒号`来遵循一个协议。若有多个协议则用逗号分隔。

```swift
protocol MyProtocol {
	// 定义协议
}
class MyClass: MyProtocol, AnotherProtocol {
	// 定义类
}
```

### 协议的属性和方法

对于**属性**来说，协议总是用 `var` 关键字来声明变量属性，在类型声明后加上 `{ set get }` 来表示属性是`可读可写`的；若是一个只读的属性，则用 `{ get }` 表示。可以用`static`表示一个需要实现的类型属性。  
协议不指定存储属性还是计算属性，它只指定属性的名称和类型。

协议中的**方法**不需要大括号和方法体，即不需要具体实现，只需要规定参数和返回类型即可。注意不允许在协议中为方法参数提供默认值。  
可以用`static`或`class`表示类方法，如果用`class`，则表示这个类方法可以被继承。  
之前我们还提到了，想要修改一些值类型的时候用到了`mutating` 定义的可变方法，这也可以在协议中规定。但是结构体和枚举在实现可变方法的时候需要写明 `mutating` 关键字，而类则不需要。

一旦遵循某个协议，就要实现协议中的所有属性和方法，否则就会报错。当然还可以有协议之外的属性和方法。

```swift
protocol AnimalProtocol {
    var speak: String {get}
    var legs: Int {get set}
    static var isAlive: Bool {get set}

    func introduce() -> Void
}

class Pet: AnimalProtocol {
	var speak: String
	var legs: Int
	var favorate: String
	static var isAlive: Bool = true

	init(speak: String, legs: Int, favorate: String) {
		self.speak = speak
		self.legs = legs
		self.favorate = favorate
	}

	func introduce() {
		print("I have \(legs) legs and I can \(speak)")
	}
}
```

### 协议中的构造器

在协议中我们也可以加入构造器，让遵循该协议的类型实现该构造器。不过在类中实现构造器的时候都需要加上`required`，除非是个`final`类。当然协议中的构造器也只用写参数列表，不需要花括号和具体实现。  
比如我们魔改一下上面的例子：

```swift
protocol AnimalProtocol {
    var speak: String {get}
    var legs: Int {get set}
    static var isAlive: Bool {get set}

    init(speak: String, legs: Int)
    func introduce() -> Void
}

class Pet: AnimalProtocol {
	var speak: String
	var legs: Int
	var favorate: String
	static var isAlive: Bool = true
	//实现协议要求的构造器
	required init(speak: String, legs: Int) {
		self.speak = speak
		self.legs = legs
		self.favorate = "nothing"
	}
	init(speak: String, legs: Int, favorate: String) {
		self.speak = speak
		self.legs = legs
		self.favorate = favorate
	}
	func introduce() {
		print("I have \(legs) legs and I can \(speak)")
	}
}
//改成便利构造器：
class Pet: AnimalProtocol {
	//...
	required convenience init(speak: String, legs: Int) {
		self.init(speak: speak, legs: legs, favorate: "nothing")
	}
	//...
}
```

### 把协议看成一个类型

就像 Java 中的接口，协议可以作为一种独立的类型来使用，尽管其本身并未实现任何功能，有时我们称协议为**存在类型**。因此，协议也可以做到这些事：

1. 为函数、方法或构造器中的参数类型或返回值类型
2. 作为常量、变量或属性的类型
3. 作为数组、字典或其他容器中的元素类型

此外，既然协议是一个独立的类型，那么它自然可以被继承。协议能够继承一个或多个其他协议，在实现其他协议的要求后增加自己新的要求。

```swift
protocol ChildProtocol: SomeProtocol, AnotherProtocol {
	//...
}
```

比如我们新增一个 DogProtocol，它继承 AnimalProtocol 并新增了一个 color 属性：

```swift
protocol AnimalProtocol {
    var speak: String {get}
    var legs: Int {get set}
    static var isAlive: Bool {get set}
    func introduce() -> Void
}
protocol DogProtocal: AnimalProtocol {
    var color: String {get set}
}
class Pet: DogProtocal {
    var speak: String
    var legs: Int
    var color: String
    static var isAlive = true

    init(speak: String, legs: Int, color: String) {
        self.speak = speak
        self.legs = legs
        self.color = color
    }
    func introduce() {
        print("I have \(legs) legs, I can \(speak)")
    }
}
```

此外，将`AnyObject` 关键字到协议的继承列表，就可以限制协议只能被类遵循（而非结构体或枚举），即**类专属协议**：

```swift
protocol ClassOnlyProtocol: AnyObject, FatherProtocol {
    //...
}

//DogProtocal只能被类遵循
protocol DogProtocal: AnyObject, AnimalProtocol {
    var color: String {get set}
}
```

### 协议合成

当一个类型同时遵循多个协议的时候，可以使用**协议合成**来复合多个协议。  
用 `A & B`表明合成 A 和 B 两个协议，当然可以继续合成任意数量的协议：

```swift
protocol Named {
    var name: String { get }
}
protocol Aged {
    var age: Int { get }
}
func wishHappyBirthday(to celebrator: Named & Aged) {
    print("Happy birthday, \(celebrator.name), you're \(celebrator.age)!")
}

struct Person: Named, Aged {
    var name: String
    var age: Int
}
let birthdayPerson = Person(name: "BlackDn", age: 18)
wishHappyBirthday(to: birthdayPerson)
//“Happy birthday BlackDn - you're 18!”
```

上述例子中，方法`wishHappyBirthday`的参数为`Named`和`Aged`两个协议的合成，因此，该方法不关心参数是谁，只要是遵循了这两个协议的对象都可以作为参数传入。

## 扩展

**扩展**可以给一个现有的类，结构体，枚举，还有协议添加新的功能（但是不能重写已有的功能）

```swift
extension SomeType {
  //添加新功能（属性、方法等）
}
```

要注意的是，扩展可以添加新的计算属性，但是它们不能添加存储属性，或向现有的属性添加属性观察器。  
此外，扩展可以扩充一个现有的类型，给它添加一个或多个协议。通过扩展令已有类型遵循并符合协议时，该类型的所有实例也会随之获得协议中定义的各项功能。

```swift
extension SomeType: SomeProtocol, AnotherProtocol {
  // 实现所遵循的协议
}
```

乍一看扩展有些鸡肋，但是有些时候我们无法修改源码（比如一些第三方类），却可以通过扩展来为这些类提供新方法。

## 错误处理

**错误处理（error handling）**，类似于 Java 的`Exception`机制，当遇到错误的时候，抛出错误并进行处理

首先，我们可以通过`Error`的枚举类型来定义自己的错误协议；  
然后，在声明函数名的后面添加`throws`关键字来表示其可能抛出错误，并且在执行的时候可以用`do-try-catch`语句来进行错误的捕获和处理，注意`try`写在调用函数的前面。  
如果在`catch`中我们没有给抛出的 Error 命名，则会默认命名为 `error`

```swift
enum SandwichError: Error {
	case outOfCleanDishes
	case missingIngredients
	// ...
}

func makeASandwich() throws {
    // ...
}

do {
    try makeASandwich()
    eatASandwich()
} catch let noDishedError as SandwichError.outOfCleanDishes {
	print("Printer error: \(noDishedError).")
    washDishes()
} catch SandwichError.missingIngredients(let ingredients) {
    buyGroceries(ingredients)
} catch {
	print(error)
}
```

出了`try-catch`的方式处理错误，还可以用`try?` 将结果作为一个可选类型。如果函数抛出错误，该错误会**被抛弃**并将结果赋为`nil`。否则，结果会是一个包含函数返回值的可选值。

```swift
let result = try? makeASandwich()
```

`result`将被编译为一个可选类型，如果`makeASandwich()`执行成功，则 result 的值就是它的返回值；如果失败，`result`的值就为`nil`。  
这种方式处理错误的方法就是：不处理错误。直接将错误抛弃，不进行后续处理。

此外，我们可以用`defer`代码块来表示在函数返回前，函数中最后执行的代码，就像 Java 中的`finally`，不论是否抛出错误，都会执行其中的代码。

```swift
func makeASandwich() throws {
    // ...
    defer {
	    print("I will be executed anyway.")
    }
}
```

## 后话

也先放一个上一篇的传送门：[从 0 开始的 Swift（上）](../2022-11-17-Swift-Introduce-Part1-2022)  
写完一看，两篇加起来文字超过 1 万 8，总字符超过 5 万 6  
笑死，下次就出书

## 参考

1. [Swift GG: Swift 初见](https://swiftgg.gitbook.io/swift/huan-ying-shi-yong-swift/03_a_swift_tour)
2. [菜鸟：Swift 。程](https://www.runoob.com/swift/swift-tutorial.html)
3. [swift 之 guard 关键字](https://www.jianshu.com/p/621dda084c2a)
4. [Swift 便利构造器---convenience](https://www.jianshu.com/p/f3f9e2d531ef)
5. [Swift - as、as!、as?三种类型转换操作符使用详解（附样例）](https://www.hangge.com/blog/cache/detail_1089.html)
6. [Swift - Any、AnyObject、AnyClass 详细区别](https://blog.csdn.net/shihuboke/article/details/86488031)
7. [Any vs. AnyObject in Swift 3.0](https://medium.com/@mimicatcodes/any-vs-anyobject-in-swift-3-b1a8d3a02e00)
