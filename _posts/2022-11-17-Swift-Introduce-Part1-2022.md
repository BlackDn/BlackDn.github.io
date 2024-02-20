---
layout: post
title: 从0开始的Swift（上）
subtitle: 一些基础知识，变量、函数啥的
date: 2022-11-17
author: BlackDn
header-img: img/19mon6_43.jpg
catalog: true
tags:
  - Swift
---

> "你顺手挽住烟火，散作大雪星罗。"

# 从 0 开始的 Swift（上）

## 前言

准备看看 IOS 开发，所以先来做做热身  
公司给的带有 M1 Pro 的 MacBook Pro 总不能浪费了吧（  
每天写一点点，结果回头一看有这么多  
所以就分成两篇文章啦，下一篇：[从 0 开始的 Swift（下）](../2022-11-18-Swift-Introduce-Part2-2022)

## Swift 基础

**Swift** 是一种支持多编程范式和编译式的开源编程语言，苹果于 2014 年 WWDC（苹果开发者大会）发布，用于开发 iOS，OS X 和 watchOS 应用程序。2015 年 6 月 8 日，苹果于 WWDC 2015 上宣布将 Swift 开源。  
Swift 结合了 C 和 Objective-C 的优点，且不受 C 兼容性的限制。Swift 在 Mac OS 和 iOS 平台可以和 Object-C 使用相同的运行环境。

### 输出：print()

先说一下输出`print()`，毕竟用输出是最省时省力的调试方式（。
Swift 语句末尾的分号是可选的，加不加都行。但是如果在一行中包含多条执行语句，那么需要用分号将其分开。

```swift
let price = 7; print(price)
//输出：7
```

通常我们使用全局函数`print()`进行输出。这一行代码就可以是一个完整的程序，我们不需要为了导入一个额外的库。全局作用域中的代码会被自动当做程序的入口点，因此我们也不需要 `main()` 函数。

`print()`的完全体是`print(_:separator:terminator:)`，表示它接受三个参数，第一个是我们输入的值，第二个`separator`表示，第三个参数`terminator`表示在输出行后添加的结束符，默认为换行符。  
这里举个例子，里面用到的数组啊参数啊啥的在后面都会讲到，这里就看个乐吧：

```swift
var arr = [1, 2, 3]
for item in arr {
	print(item)  //结束符默认为换行符，所以每次输出会换行
}
//输出：
//1
//2
//3
for item in arr {
	print(item, terminator: " ") //结束符为一个空格
}
//输出：1 2 3
```

### 类型和变量

#### 基本类型

按照惯例，我们从基本类型和变量入手。**Swift**和 C 语言和 Objective-C 有许多类似，所以其基本类型也都是老朋友了：

| 基本类型       | 类型              |
| -------------- | ----------------- |
| Int / UInt     | 整型 / 无符号整型 |
| Double / Float | 浮点              |
| Bool           | 布尔              |
| String         | 文本              |
| Character      | 单个字符          |

在整型中，我们可以使用 8、16、32 和 64 位的有符号和无符号整数类型。如 8 位无符号整数类型是 `UInt8`，32 位有符号整数类型是 `Int32`

```swift
let minValue = UInt8.min // minValue 为 0，是 UInt8 类型
let maxValue = UInt8.max // maxValue 为 255，是 UInt8 类型
```

如果我们偷懒仅仅使用`Int`类型，那么其长度与当前系统的原生字长相同：在 32 位平台上，Int32 长度相同。在 64 位平台上，Int64 长度相同。UInt 类型也同理，根据系统其长度等价于 UInt32 或 UInt64

通过`typealias`可以为类型设置别名，虽然这个功能用的比较少。  
比如我们处理一些特定的数据的时候：

```swift
typealias EmployeeID = UInt16
var maxEmployeeIDNum = EmployeeID.min
// EmployeeID.min 本质上就是 UInt16.min
// maxEmployeeIDNum 现在是 0
```

在 Swift 中，空值会用`nil`来表示，和 Objective-C 的 nill 或 java 中的 null 类似（但不同，后两者是个指向不存在对象的指针，但 Swift 中的 nil 则是一个确定的值，用来表示值缺失）。  
如果我们声明一个变量但未赋值，它默认为 nil。

#### 变量

Swift 用`let`声明**常量**，用`var`来声明**变量**（不要和 JS 弄混了）  
通常情况下，编译器会自动推断我们的变量类型，所以我们不必显式声明其类型，这是 Swift 自带的**类型推断（type inference）**。  
不过我们想声明也行，特别是在一些精度问题或没有初始值的时候，可以用**冒号(:)分割**，后面跟上数据类型，我们称之为**类型注解（type annotation）**。  
要注意的是，Swift 是一个**类型安全（type safe）** 的语言，它不存在自动转型的功能，如果类型不对，会直接报错。

变量名**不能包含**数学符号（加减乘除之类的），箭头，保留或非法的 Unicode 码位，连线与制表符。可以有数字但是不能以数字开头

```swift
let constant = 1  //常量
var variable = 42 //变量
let π = 3.14159
let 你好 = "你好世界"
let 🐶🐮 = "dogcow"

let price = 69.9  //这是Double
let discountPrice: Double = 70  //没有类型注解就是Int了
```

在 Swift 中，值永远**不会被隐式转换**为其他类型，所以需要我们进行显式转换

```swift
let label = "The Price is "
let price: Double = 70;
let priceTag = label + String(price);
```

上面的例子中，如果我们不显式地用`String(price)`将`price`转为`String`，那么则会报错，提示我们不能对 Double 和 String 进行`+`运算

在给变量赋值的时候，我们可以用前缀来规定该数的进制：

- 默认为十进制，不需要前缀
- 二进制：`0b`
- 八进制：`0o`
- 十六进制：`0x`
  此外还有科学计数法，指数用`e`标识（16 进制的指数用`p`标识，大小写都不限）：  
  `1.25e2` 表示 `1.25 × 10^2`，等于 `125.0`；`1.25e-2` 表示 `1.25 × 10^-2`，等于 `0.0125`。  
  `0xFp2` 表示 `15 × 2^2`，等于 `60.0`；`0xFp-2` 表示 `15 × 2^-2`，等于 `3.75`。

数值类字面量可以包括额外的格式来增强可读性。整数和浮点数都可以添加额外的零并且包含下划线，并不会影响字面量  
也就是说，我们可以用`1_000_000`来标识我们常见的`1,000,000`格式，同时他还是个 Int 而非 String，其值也不会变化。

```swift
let paddedDouble = 000123.456
let oneMillion = 1_000_000
let justOverOneMillion = 1_000_000.000_000_1
```

#### 字符串

Swift 允许我们用`\(variable)`来快速将变量转为 String，这则是**字符串插值**  
还可以用`三个双引号（"""）`来包括多行字符串  
如果想在视觉上换行，但不想在字符串中实际换行的话，可以用在行尾写一个反斜杠（`\`）作为续行符，这和 Shell 脚本类似。  
此外，Swift 的字符串是支持 Unicode 的，格式为`\u{unicode}`，具体懒得写了，感兴趣自己去看捏。

```swift
let appleNum = 5
let applePrice = 3.0
//字符串插值
let quotation = """
I said "I have \(appleNum) apples."
And I said "I spent \(appleNum * Int(applePrice)) to buy them."
"""
//I said "I have 5 apples."
//And I said "I spent 15 to buy them."

let softWrappedQuotation = """
The White Rabbit put on his spectacles.
"Where shall I begin, \
please your Majesty?" he asked.
"""
//The White Rabbit put on his spectacles.
//"Where shall I begin, please your Majesty?" he asked.
```

字符串可以通过 `Character` 的数组来初始化：

```swift
let catCharacters: [Character] = ["C", "a", "t", "!", "🐱"]
let catString = String(catCharacters)
```

可通过 `for-in` 循环来遍历字符串，获取字符串中每一个字符的值  
或者通过`indices()`方法获得字符串中所有字符的索引，从而获取每一个字符：

```swift
for character in "Dog!🐶" {
    print(character, terminator: " ")
}
//输出：D o g ! 🐶

let myString = "Dog!🐶"
for index in myString.indices {
	print(myString[index], terminator: " ")
}
//输出：D o g ! 🐶
```

使用 `startIndex` 属性可以获取一个 `String` 的第一个 `Character` 的索引。使用 `endIndex` 属性可以获取最后一个 `Character` 的**后一个位置**的索引。（对于空串来说，`startIndex` 和 `endIndex` 是相等的。 ）  
因此，`endIndex` 不能作为一个字符串的有效下标，按理来说应该是`endIndex`的前一个位置，但是由于`startIndex`和`endIndex`属性的类型是`String.Index`，而非整型，所以`endIndex - 1`的表达会报错 。  
所以，我们需要调用 `String` 的 `index(before:)` 或 `index(after:)` 方法，来获取前面或后面的一个索引。  
此外， `index(_:offsetBy:)` 方法来获取对应偏移量的索引，以便避免多次调用 `index(before:)` 或 `index(after:)` 方法。

```swift
let greeting = "Guten Tag!"
greeting[greeting.startIndex]  // G
greeting[greeting.index(before: greeting.endIndex)]  // !
greeting[greeting.index(after: greeting.startIndex)] // u
let index = greeting.index(greeting.startIndex, offsetBy: 7)
greeting[index] // a
```

调用 `insert(_:at:)` 方法可以在指定索引插入字符，而 `insert(contentsOf:at:)` 方法则可以插入字符串。  
调用 `remove(at:)` 方法可以指定索引删除一个字符，而 `removeSubrange(_:)` 方法则可以删除字符串。

```swift
var welcome = "hello"
welcome.insert("!", at: welcome.endIndex)
// welcome = "hello!"
welcome.insert(contentsOf:" there", at: welcome.index(before: welcome.endIndex))
// welcome = "hello there!"

welcome.remove(at: welcome.index(before: welcome.endIndex))
// welcome 现在等于 "hello there"
let range = welcome.index(welcome.endIndex, offsetBy: -6)..<welcome.endIndex
welcome.removeSubrange(range)
// welcome 现在等于 "hello"
```

常用方法：

| 方法 / 属性                     | 作用                                                    |
| ------------------------------- | ------------------------------------------------------- |
| myString.startIndex             | 获取 myString 的第一个 Character 索引                   |
| myString.endIndex               | 获取 myString 最后一个 Character 的**后一个位置**的索引 |
| myString.index(before:)         | 获取对应索引的前一个索引                                |
| myString.index(after:)          | 获取对应索引的后一个索引                                |
| myString.index(\_:offsetBy:)    | 获取对应索引的后 offsetBy 个索引（负数则往前）          |
| myString.indices                | 获取全部索引构成的 Range                                |
| myString.count                  | myString 的长度                                         |
| myString.isEmpty()              | 判断是否为空                                            |
| myString.append(s)              | 将 s 拼接到 myString 后面                               |
| myString.hasPrefix("black")     | 判断 myString 是否有前缀 black                          |
| myString.hasSuffix("dawn")      | 判断 myString 是否有后缀 black                          |
| myString.insert("!", at:)       | 在 myString 指定位置插入"!"                             |
| myString.insert(contentsOf:at:) | 在 myString 指定位置插入字符串                          |
| myString.remove(at:)            | 删除 myString 指定位置的一个字符                        |
| removeSubrange(\_:)             | 删除 myString 指定位置的字符串                          |

值得注意的是，`startIndex` 和 `endIndex` 属性； `index(before:)` 、`index(after:)` 和 `index(_:offsetBy:)` 方法；`insert(_:at:)`、`insert(contentsOf:at:)`、`remove(at:)` 和 `removeSubrange(_:)` 方法在遵循 `Collection` 协议的类型里面都支持的，如`Array`、`Dictionary` 和 `Set`等

#### 元组

Swift 的**元组（tuples）** 和 Python 的元组类似，把多个值组合成一个复合值。元组内的值可以是任意类型，其中的元素数量也是任意的。  
我们也可以用对应位置的变量来获取元组内每个元素的值。如果在取值的时候，想要忽略某一部分，需要用`下划线(_)`占位。  
当然，还可以直接通过下标获取元素。

```swift
let http404Error = (404, "Not Found")
// 这是一个(Int, String)的元组，值是 (404, "Not Found")

let (statusCode, statusMessage) = http404Error
//statusCode = 404
//statusMessage = "Not Found"

print("The status code is \(http404Error.0)")
// 输出：“The status code is 404”
print("The status message is \(http404Error.1)")
// 输出：“The status message is Not Found”
```

再进一步，我们可以在定义元组的时候就给其元素命名，这样可以不用下标，而用其命名来取值

```swift
let http200Status = (statusCode: 200, description: "OK")
print("The status code is \(http200Status.statusCode)")
// 输出“The status code is 200”
print("The status message is \(http200Status.description)")
// 输出“The status message is OK”
```

#### 可选类型

在一个类型后加个问号就变成了对应的可选类型。所谓可选类型，表示这个类型的变量的值可能为空。  
比如我们在进行显式类型转换的时候`Int("123")`能正确被转换，但是`Int("Hello")`就不能被转换，因此在编译`let convert = Int(myString)`的时候，变量 convert 会被类型推断为`Int?`  
当然我们也可以自己声明一个可选类型

```swift
var myString: String? = "Hello, World"
var myAge: Int? = 18
```

对于一个可选类型来说，想要取到他的值，需要在其之后加上一个`感叹号(!)`，这种方法称为**强制解析（forced unwrapping）** 。

```swift
var convertValue: String? = "blackdn"
if convertValue != nil {
	print("convertValue has the value of \(convertValue).")
	print("convertValue has the value of \(convertValue!).")
}
//输出：
//convertValue has the value of Optional("blackdn").
//convertValue has the value of blackdn.
```

由于使用 `!` 来获取一个不存在的可选值会导致运行时错误，所以使用 `!` 来强制解析值之前，一定要确定其包含一个非 `nil` 的值。  
但是转念一想，我们每次`if`判断一下再进行取值，那多麻烦，这不是和 Java 用`if`判空一样嘛。为了避免这种麻烦，我们可以**隐式解析可选类型（implicitly unwrapped optionals）**，即在可选变量**声明赋值**的时候将问号改为感叹号。  
因为在第一次被赋值之后，这个可选变量肯定有值，这样我们就不必每次都用`if`判断其是否有值了，也因此我们可以直接取值而无需添加感叹号取值

```swift
let possibleString: String? = "An optional string."
let forcedString: String = possibleString! // 需要感叹号来获取值

let assumedString: String! = "An implicitly unwrapped optional string."
let implicitString: String = assumedString // 不需要感叹号
```

要注意的是，如果一个变量在程序执行的过程中有可能变成`nil`或被赋值成`nil`，那么还是别用隐式解析可选类型，用普通的可选类型比较好。

### 集合类型

除了基本类型，Swift 还提供了三个**集合类型**，他们同属于 Swift 的基本类型：

| 集合类型   | 类型 |
| ---------- | ---- |
| Array      | 数组 |
| Set        | 集合 |
| Dictionary | 字典 |

#### Array 数组

数组是**有序**数据的集。集合是**无序无重复**数据的集。字典是无序**键值对**的集。  
不同于 Python 或 JS，Swift 要求这些集合类型都有明确且唯一的数据类型，毕竟它还是个**强类型语言**。

数组的完整写法是 `Array<Element>`，其中 `Element` 表示其数据类型。不过更推荐 `[Element]` 的简单写法。当然还可以通过构造方法`Array(repeating: 2, count: 3)`来创建重复元素的数组。  
数组可以直接用`+`或`+=`拼接，不过操作符两边的数组需要是相同类型的，否则会报错。  
数组的下标从 0 开始，还可以通过闭区间操作符表示多个范围的元素，比如`[1...3]`表示下标 1 ～ 3 的元素所组成的子数组。  
`insert()`和`remove()`方法可以在指定位置添加或删除元素，要注意的是`remove()`会将移除的元素返回出来，或许它叫`pop`更符合常理=。=  
可以用`for-in`循环来遍历数组，也可以用`enumerated()`生成包含下标和值的元组，从而同时获取下标和元素的值。

```swift
var intArray: [Int] = []
print("intArray is of type [Int] with \(intArray.count) items.")
//intArray is of type [Int] with 0 items.
intArray.append(3)
var newIntArray = Array(repeating: 2, count: 3)
var combineArray = intArray + newIntArray
print(combineArray)
//[3, 2, 2, 2]

combineArray[1...3] = [5]   //combineArray = [3, 5]
combineArray.insert(9, at: 0)   //combineArray = [9, 3, 5]
let removedItem = combineArray.remove(at: 1)
//removedItem = 3, combineArray = [9, 5]

for (index, value) in combineArray.enumerated() {
	print("Item \(String(index + 1)): \(value)")
}
// Item 1: 9
// Item 2: 5
```

| 函数 / 属性                 | 作用                                    |
| --------------------------- | --------------------------------------- |
| intArray.count              | 数组的长度                              |
| intArray.append(3)          | 在数组末尾加上值为 3 的元素             |
| intArray.isEmpty            | 判断数组`count`是否为 0                 |
| intArray.insert(9, at: 0)   | 把元素 9 插入下标 0 处                  |
| intArray.remove(at: 0)      | 从数组中移除下标 0 的元素，并返回该元素 |
| intArray.removeFirst/Last() | 移除数组的第一个/最后一个元素并返回     |
| intArray.removeAll()        | 清空数组                                |
| intArray.enumerated()       | 返回所有下标和元素组成的元组            |

#### Set 集合

集合是无序的，因此无法通过下标获取其内容（甚至每次`print`出来的顺序都不一样）。由于集合保证其每一个元都是单一的，因此集合类型**可哈希化的**，即该类型存在一个方法来计算**哈希值**。一个哈希值是 `Int` 类型的，若 `a.hashValue == b.hashValue`，则 `a == b`。  
不过好在 Swift 的所有基本类型默认都是可哈希化的，因此我们无需再额外创建（如果自定义类就要啦）。  
我们用`Set<Element>`来表示一个集合，但是在初始化的时候，如果数据源是一个数组，那么可以省略数据类型。毕竟数组的数据类型是确定的，Swift 可以进行类型推断自己判断类型。  
集合同样可以用 for-in 遍历，但是由于它是无序的，因此每次遍历的顺序都不尽相同。最好的办法是通过`sorted()`方法将其变为有序数组再进行遍历。

```swift
var intSet: Set = [2, 4]
intSet.insert(6)  //intSet = [2, 4, 6]
intSet.insert(2)  //intSet = [2, 4, 6]

if intSet.contains(2) {
	var removedItem = intSet.remove(2)
}
//removedItem = 2, intSet = [4, 6]

for item in intSet.sorted() {
	print(item, terminator: " ")
}
//output: 2 4 6
```

此外，作为集合，当然要有集合的样子了，因此我们可以使用一系列方法来实现交集、并集等操作  
还可以用`isSubset(of:)`，`isSuperset(of:)`等方法判断是否为子集合等，就不一一举例了。

```swift
let oddDigits: Set = [1, 3, 5, 7, 9]
let evenDigits: Set = [0, 2, 4, 6, 8]
let primeNumbers: Set = [2, 3, 5, 7]

oddDigits.union(evenDigits).sorted()
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
oddDigits.intersection(evenDigits).sorted()
// []
oddDigits.subtracting(primeNumbers).sorted()
// [1, 9]
oddDigits.symmetricDifference(primeNumbers).sorted()
// [1, 2, 9]

let number: Set = [-2, -1, 0, 1, 2]
let minusNumber: Set = [-1, -2]
let naturalNumber: Set = [0, 1, 2, 3, 4]

minusNumber.isSubset(of: number)    //true
number.isSuperset(of: minusNumber)    //true
minusNumber.isDisjoint(with: naturalNumber)    //true
```

| 函数 / 属性               | 作用                                                           |
| ------------------------- | -------------------------------------------------------------- |
| intSet.count              | 集合的元素数量                                                 |
| intSet.insert(2)          | 将元素 2 插入集合（已存在则无变化）                            |
| intSet.remove(2)          | 若集合存在 2，则删除并返回该元素；若没有，集合无变化，返回 nil |
| intSet.removeAll()        | 清空集合                                                       |
| intSet.isEmpty            | 判断集合是否为空                                               |
| intSet.contains(2)        | 判断集合是否含有元素 2                                         |
| intSet.sorted()           | 将集合转变为有序数组                                           |
| a.uniton(b)               | 合并集合 a 与集合 b 并返回新集合                               |
| a.intersection(b)         | 取集合 a 与集合 b 的交集并返回                                 |
| a.subtracting(b)          | 在集合 a 中除去集合 b 的元素并返回                             |
| a.symmetricDifference(b)  | 除去集合 a 与集合 b 的交集并返回                               |
| a.isSubset(of: b)         | a 是否是 b 的子集（相等返回 true）                             |
| a.isSuperset(of: b)       | a 是否是 b 的父集（相等返回 true）                             |
| a.isStrictSubset(of: b)   | a 是否是 b 的子集（相等返回 false）                            |
| a.isStrictSuperset(of: b) | a 是否是 b 的父集（相等返回 false）                            |
| a.isDisjoint(with: b)     | a 是否和 b 没有交集                                            |

#### Dictonary 字典

字典用来保存键值对，`[Int: String]`分别表示`[键 : 值]`，空的键值对用`[:]`表示。  
我们可以用键来获取对应的值，不过由于可能不存在这个键值对，所以 Swift 会将其类型推断为**可选类型**。如果真的没有键值对，就会返回 nil。（注意下面例子中不是下标，是`Int`类型的键）  
如果想要删除一个键值对，可以把它的值设为`nil`；或者通过`removeValue(forKey:)`删除指定键的键值对。  
我们还可以通过`updateValue(_:forKey:)`来更新指定键的键值对，如果指定键的键值对不存在则返回`nil`，如果存在则进行更新，并返回更新前的原值  
同样，字典可以用`for-in`遍历，可以同时取到键值对的键和值。此外，字典还提供了`keys`和`values`的属性，将键或值直接转换为对应的数组

```swift
var namesOfIntegers: [Int: String] = [:]
namesOfIntegers = [2: "two", 4: "four", 10: "ten"]
print(namesOfIntegers.count)    //3
print(namesOfIntegers[4])   //Optional("four")
print(namesOfIntegers[4]!)  //four
print(namesOfIntegers[3])  //nil

namesOfIntegers[4] = nil
namesOfIntegers.removeValue(forKey: 10)
namesOfIntegers  //[2: "two"]

var oldPair = namesOfIntegers.updateValue("twooo", forKey: 2)
//oldPair = Optional("two"), namesOfIntegers = [2: "twooo"]

namesOfIntegers[3] = "three"
namesOfIntegers[5] = "five"
//[5: "five", 3: "three", 2: "twooo"]

for (number, name) in namesOfIntegers {
	print("\(name) means \(number)")
}
//five means 5
//...

for number in namesOfIntegers.keys {
	print("we get \(number) as key")
}
//we get 5 as key
//...
for name in namesOfIntegers.values {
	print("we get \(name) as value")
}
//we get five as value
//...
```

| 函数 / 属性                        | 作用                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| dic.count                          | 键值对的数量                                                         |
| dic.removeValue(2)                 | 删除键为 2 的键值对（没有则无变化）                                  |
| dic.removeAll()                    | 删除全部键值对                                                       |
| dic.updateValue("twooo", forKey:2) | 将键为 2 的键值对的值变为"twooo"，并返回修改前的值（没有则返回 nil） |
| dic.keys                           | 返回键组成的数组                                                     |
| dic.values                         | 返回值组成的数组                                                     |

### 循环语句

#### for-in 循环

for 循环在`Swift 3中被弃用`，可以用其他循环代替，我们直接来看`for-in`循环。  
for-in 循环在之前的例子中用过，能够很方便地遍历一些集合类型，这里看一下一些比较少见的用法。  
如果我们不需要循环中获遍历的每一个值，可以用下划线`_`代替。

```swift
//to calculate base^power
let base = 2
let power = 10
var answer = 1
for _ in 1...power {
	answer *= base
}
//answer = 1024
```

当然还可用区间运算来指定循环的范围

```swift
let seconds = 60
for tickMark in 0..<seconds {
	print(tickMark, terminator: " ")  //0 1 2...
}
```

或者用`stride()`方法来指定起点、终点和间隔，第二参数标签如果是`to`，则表示半开半闭区间`[front, to)`；如果是`through`，则表示闭区间`[from, through]`

```swift
let totalSecond = 10
let twoSecInterval = 2
for tickMark in stride(from: 0, to: totalSecond, by: twoSecInterval) {
	print(tickMark, terminator: " ")    //0 2 4 6 8
}

for tickMark in stride(from: 0, through: totalSecond, by: twoSecInterval) {
	print(tickMark, terminator: " ")    //0 2 4 6 8 10
}
```

#### While 和 Repeat-While

while 循环也就那样  
还有个`repeat-while`循环，就是传说中的`do-while`

```swift
//normal while
while condition {
	statements
}
//repeat-while
repeat {
	statements
} while condition
```

### 条件语句

#### if 语句和可选绑定

首先，判断条件或变量的小括号是可以省略的，这在之前的例子中也可以看到；此外，`if-else`，`if-else if-else`啥的都可以照样用。
其次，由于 Swift 不会自己类型转换，因此，判断条件的时候必须要用布尔类型（`true / false`）。有时候我们在其他语言偷懒吧 0 看成`false`，把 1（非 0）看成`true`的操作在这里可是会报错的。

在 Java 中我们会在循环或者判断中进行赋值操作（比如查完数据库循环读取 Cursor 啥的），在 Swift 中称之为**可选绑定（optional binding）**。

```swift
var convertValue = "123"
if let result = Int(convertValue) {
	print("convert success \(result)")
} else {
	print("convet failed.")
}
```

在上面的例子中，`Int(convertValue)`转换成功，result 成功赋值为 Int 类型的`123`，因此输出`"convert success 123"`；如果`convertValue = "hello world"`，则会导致转换失败，`result`不会得到任何值，从而输出`"convet failed."`

此外，在`if`的条件语句中可以包含多个可选绑定或条件判断，只要使用逗号分开就行。只要有任意一个可选绑定的值为 `nil`（类型转换失败），或者任意一个条件判断为 `false`，则整个 `if` 条件判断为 `false`。（和`逻辑与&&`效果一样）

#### Swich 语句

switch 语句还是我们遵循的`switch-case`的样子：

```swift
switch value {
case value1:
	//respond to value 1
	break;
case value 2,
	value 3:
	//respond to value 2 or 3
	break;
default:
	//otherwise, do something else
}
```

不过区别还是有的，比如在 Swift 中，执行完一个 case 语句后会自动退出当前的 switch，因此我们不需要在每个 case 后添加`break`（当然加了也没事），可以理解成每个 case 后都会有一个隐式的`break`  
因为每个 case 后都有一个`break`，所以 Swift 不允许空的 case 语句块。在 Java 或 C 语言的 switch 中，如果遇到空的 case，程序会继续进入下一个 case 执行，而这在 Swift 中则会报错。想要合并多个 case，需要在一个 case 中用逗号分隔多个值：

```swift
let inputCharacter: Character = "a"
//错误情况，会报错
switch inputCharacter {
case "a":
case "A":
	print("input the letter A")
default:
	print("Not A")
}
//正确情况
switch inputCharacter {
case "a", "A":
    print("The letter A")
default:
	print("Not A")
}
```

要注意的是，Swift 中，`switch`必须包含全部的情况，或者一定要有`default`部分，否则就会报错：

```swift
//会报错：
switch inputCharacter {
case "a", "A":
    print("The letter A")
}
```

此外，case 的条件可以用区间运算来表示一个范围：

```swift
let score = 5
switch score {
case 0:
	print("zero")
case -4..<0:
	print("negative score")
case 1..<5:
	print("positive score")
default:
    print(" out of scope")
}
```

当需要判断的条件是元组时，case 的元组中的元素可以是值，也可以是区间，还可以使用下划线（\_）来匹配所有可能的值。
举个栗子 🌰，假设我们有个坐标系，且有个以原点为中心，边长为 4 的 box，然后我们判断一个点的位置：

```swift
let somePoint = (1, 1)
switch somePoint {
case (0, 0):
    print("\(somePoint) is at the origin")
case (_, 0):
    print("\(somePoint) is on the x-axis")
case (0, _):
    print("\(somePoint) is on the y-axis")
case (-2...2, -2...2):
    print("\(somePoint) is inside the box")
default:
    print("\(somePoint) is outside of the box")
}
```

此外，在使用下划线（\_）匹配任意值的时候，如果想获取这个任意值，可以直接用变量的声明来代替下划线（\_），这称之为**值绑定（value binding）**：

```swift
let somePoint = (1, 0)
switch somePoint {
case (let x, 0):
	print("on the x-axis with an x value of \(x)")
case (0, let y):
    print("on the y-axis with a y value of \(y)")
case let (x, y):
    print("somewhere else at (\(x), \(y))")
}
//on the x-axis with an x value of 1
```

还可以用`where`来为 case 添加额外的判断条件：

```swift
let somePoint = (1, 1)
switch somePoint {
case (let x, 0) where x < 0:
	print("\(somePoint) is on the (-x)-axis")
case (let x, 0) where x > 0:
	print("\(somePoint) is on the (+x)-axis")
case (let x, 0):
	print("\(somePoint) is on the origin")
default:
	print("\(somePoint) is not on the x-axis")
}
//(1, 0) is on the (+x)-axis
```

### 控制转移语句

那些能够改变代码执行顺序的语句称为控制转移语句，包括`continue`，`break`等。Swift 有五种控制转移语句：

- `continue`
- `break`
- `fallthrough`
- `return`
- `throw`

`continue`是老朋友了，它在循环中使用，表示停止本次循环，重新开始下次循环，并不离开整个循环体。`break`与其相对，用于结束整个控制流（循环或`switch`）的执行。这两个我们都比较熟悉了。 其中，`return`用于函数返回，`throw`用于抛出错误，这里就不进一步介绍了。  
还记得在`switch`中，每个 case 都有个隐式的`break`，因此无法掉入下一个 case 中。但是如果我们偏要让其进入下一个 case，则在最后用`fallthrugh`来表示，它相当于取消了最后隐式的`break`：

```swift
let inputCharacter: Character = "A"
switch inputCharacter {
case "a":
	print("input the letter a")
case "A":
	print("input the letter A")
	fallthrough
default:
	print("input the upper case letter")
}
//input the letter A
//input the upper case letter
```

### guard：条件检验

`guard`关键字用于确保某个条件的成立，他之后必须跟着一个`else`。

```swift
guard condition else { }
```

只有当 guard 后的条件为 true 时，程序才能继续正常执行，否则执行`else`中的代码  
此外，`guard`的`else`语句块不允许`fall through`，也就是说如果进入了`else`，则之后的正常流程代码都不可以执行（编译器也会报错）。所以通常会在其中添加`break`或`return`

```swift
func greet(name: String) {
	guard name.count >= 2 else {
		print("your name is too short!")
		return
	}
	print("hello, \(name)")
}
greet(name: "blackdn")  //hello, blackdn
greet(name: "a")  //your name is too short!
```

虽然`guard`的功能完全可以用`if`实现，但按需使用 `guard` 语句会提升我们代码的可读性。  
它可以使正常执行的代码不被 `else` 包裹（因为我们用`else`包裹了错误情况）。相比与使用`if`，`guard`用于检查我们期望的条件，而不是通过一堆判空来检查不希望的条件，这样更加接近自然语言，更易理解。

## 函数和闭包

### 函数

**Swift**用`func`声明函数，用`->`指定返回类型。

```swift
func showPrice(product: String, price: Double) -> String {
	return "The price of \(product) is \(price)."
}
print(showPrice(product:"apple", price: 3.5))
//Output: The price of apple is 3.5.
```

在参数部分，`product: String`是`参数名: 参数类型`的格式，不过其实完整版的格式是`参数标签 参数名: 参数类型`，这个**参数标签**是在调用函数传参的时候用到的。  
不过在没有参数标签的情况下它默认等于参数名，但是如果有参数标签（不管是不是默认），那么在传参的时候就一定要写明参数标签，除非用`'_'`表示不实用参数标签

```swift
func showPrice(_ product: String, howMuch price: Double) -> String {
	return "The price of \(product) is \(price)."
}
print(showPrice("apple", howMuch: 3.5))
//Output: The price of apple is 3.5.
```

如果一个函数不需要返回值，那么不写后面的箭头和返回类型就行了。不过要注意，虽然看起来是没有返回值的函数，实际上仍会返回一个`Void`类型的特殊值，其为一个空元组。  
同样，使用元组我们可以实现一个函数有多个返回值，通过定义函数返回值的参数标签，从而获取返回的元组中的特定的值。

```swift
//get min & max number in array
func getMinAndMax(array: [Int]) -> (min: Int, max: Int) {
	var currentMin = array[0]
	var currentMax = array[0]
	for value in array[1..<array.count] {
		if value < currentMin {
			currentMin = value
		} else if value > currentMax {
			currentMax = value
		}
	}
	return (currentMin, currentMax)
}
print(getMinAndMax(array: [1, 2, 3, 4, 5]))  //(min: 1, max: 5)
```

#### 函数的隐式返回

如果一个函数内仅有单行表达式，那么可以省略`return`，让函数隐式返回这个表达式：

```swift
func greeting(name: String) -> String {
	"Hello, \(name)"
}
print(greeting(name: "blackdn"))    //Hello, blackdn
```

#### 可变参数

**可变参数（variadic parameter）** 可以接受零个或多个值，在参数变量类型后面添加（`...`）来定义一个可变参数。在函数中，可变参数会作为一个数组传入。

```swift
func sum(_ numbers: Int...) -> Int {
	var total = 0
	for number in numbers {
		total += number
	}
	return total
}
print(sum(1, 2, 3)) //6
```

#### 输入输出参数

在 Swift 的函数中，函数参数默认是常量，在函数内尝试修改参数值将会导致编译错误。同时，我们知道参数的作用域通常在函数体内，函数调用结束后参数会随之销毁，以释放内存。  
如果我们想要一个参数可以被修改，且在函数调用结束后这个修改仍然存在，可以通过`inout`关键字把这个参数定义为**输入输出参数（In-Out Parameters）**。  
当传入的参数为输入输出参数时，需要在参数名前加 `&` 符，表示这个值可以被函数修改。（这不就是传地址嘛）

```swift
func greeting(name: inout String) -> String {
	name = "white"
	return "Hello, \(name)"
}
var myName = "blackdn"
print(greeting(name: &myName))    //Hello, white
print(myName)   //white
```

#### 函数类型

就像每个变量有着自己的数据类型，函数也有它的函数类型。  
函数类型由函数的变量和返回值决定，比如有以下几个函数：

```swift
func sumInt(first: Int, second: Int) -> Int {
	return first + second
}
func timesInt(first: Int, second: Int) -> Int {
	return first * second
}
func greet() {
	return "hello, world"
}
```

前两个函数都接收两个`Int`，并返回一个`Int`，因此它们的函数类型都是`(Int, Int) -> Int`；第三个函数的类型则是`() -> Void`，正如之前提到过，没有返回值的函数实际上会返回`Void类型`的空元组  
由于函数可以赋值给一个变量，函数也可以作为参数和返回值，在这些时候就要注意，在定义和使用的时候函数类型是否统一，这里就不继续深入了。

#### 嵌套函数

定义在全局域的函数称为**全局函数（global functions）**，我们还可以在函数中定义函数，这些**子函数**称作**嵌套函数（nested functions）**。（我觉得叫内部函数更好理解）  
默认情况下，嵌套函数是对外界不可见的，但是可以被它们的**外围函数（enclosing function）** （也就是父函数）调用。一个外围函数也可以返回它的某一个嵌套函数，使得这个函数可以在其他域中被使用。

```swift
fun。 arriveZero(shouldPlus: Bool) -> (Int) -> Int {
	func plusOne(input: Int) -> Int {
		return input + 1
	}
	func minusOne(input: Int) -> Int {
		return input - 1
	}
	return shouldPlus ? plusOne : minusOne
}

var current = -3
let moveOneStep = arriveZero(shouldPlus: current < 0)
while current != 0 {
	print(current)
	current = moveOneStep(current)
}
//-3
//-2
//-1
```

稍微有点复杂，我们慢慢来看，先来看看嵌套函数的定义。  
`arriveZero()`的返回值是一个函数，根据情况返回`plusOne()`或者`minusOne()`。由于`plusOne()`和`minusOne()`都是`(Int) -> Int`类型的函数，所以`arriveZero()`的返回类型就是`(Int) -> Int`。  
然后我们定义`let moveOneStep = arriveZero(shouldPlus: current < 0)`，变量`moveOneStep()`的值是一个函数，它根据条件`current < 0`来判断自己是`plusOne()`还是`minusOne()`。  
最后，我们将`current`传给`moveOneStep()`，`current`将作为参数传给`plusOne()`或者`minusOne()`，从而进行进一步操作。  
可以看到，`moveOneStep()`究竟是`plusOne()`还是`minusOne()`我们是不关心的，因为这两个函数对外部是不可见的，这个判断操作完全交给`arriveZero()`函数实现。

### 闭包

简单来说，**闭包（Closure）** 是一个可以被传递和使用的代码块，之前提到的函数就是闭包的一种。  
闭包表达式语法有如下的一般形式，乍一看和一些语言的`Lambda`表达式挺像：

```swift
{ (parameters) -> returnType in
    statements
}
```

举个栗子 🌰，我们为数组的`sorted()`方法自定义一个排序方法，让`[String]`数组根据字符串长度排序，分别用函数和闭包表达式的方式实现。  
利用闭包表达式，我们可以直接在`sorted()`的参数部分构造闭包，这种闭包称为**內联闭包**（Lambda 都是这么用的啦）

```swift
let strArr = ["a", "abcd", "abc", "ab"]
func sortByLength(_ s1: String, _ s2: String) -> Bool {
	return s1.count < s2.count
}
let sortedArr = strArr.sorted(by: sortByLength)
//等价于：
let newSortedArr = strArr.sorted(by: {(s1: String, s2: String) -> Bool in
	return s1.count < s2.count
})
//sortedArr = ["a", "ab", "abc", "abcd"]
```

不过我们知道，Swift 的**类型推断**机制很好用，在闭包里也不例外。  
由于`strArr`是`[String]`的类型，那么其中的元素类型必为`String`，我们能这样断言了，Swift 当然也可以，所以`sorted()`中的闭包参数的类型就可以省略；  
不仅如此，`sorted()`本身定义了它其中的排序函数返回值为`Bool`，所以 Swift 也能进行推断，返回类型也可以省略：

```swift
let newSortedArr = strArr.sorted(by: {(s1, s2) in
	return s1.count < s2.count
})
```

再进一步，我们的**单表达式函数**可以隐式返回，那么闭包也可以，不就是省略个`return`嘛

```swift
let newSortedArr = strArr.sorted(by: {(s1, s2) in
	s1.count < s2.count
})
```

更离谱的是，内联闭包还有参数名称缩写功能，可以直接通过 `$0`，`$1`，`$2` 等来顺序调用闭包的参数：

```swift
let newSortedArr = strArr.sorted(by: {$0.count < $1.count})
```

#### 尾随闭包

如果作为最后一个函数参数的是一个很长的闭包表达式，我们可以将这个闭包替换成为**尾随闭包**。  
尾随闭包是写在函数参数列表圆括号之后的闭包表达式（上面的例子都是写在参数列表里的），函数将会把它作为最后一个参数调用。  
在使用尾随闭包时，我们不用写出它的参数标签。拿上面的栗子，`sorted()`中的参数标签`by`就被省略了。  
如果尾随闭包是函数的唯一参数，那么甚至可以把 `()` 省略掉：

```swift
//尾随闭包：
let sortedArr = strArr.sorted() {(s1: String, s2: String) -> Bool in
	return s1.count < s2.count
}
//省略括号：
let sortedArr = strArr.sorted {(s1: String, s2: String) -> Bool in
	return s1.count < s2.count
}
//最简形式：
let sortedArr = strArr.sorted { $0 > $1 }
```

#### 逃逸闭包

当一个闭包作为参数传到一个函数中，但是在函数结束之后才被执行，我们称该闭包从函数中**逃逸**，该闭包则为**逃逸闭包**。我们可以在参数名之前标注 `@escaping`来指明这个闭包是允许“逃逸”的。  
下面的例子中，如果没有 `@escaping`，编译器会报错捏。而用 `@escaping`将一个闭包标记为逃逸闭包后，在其中需要显示地引用`self`来使用变量。

```swift
var closureList: [() -> Void] = []
func functionWithEscapingClosure(escapeClosure: @escaping () -> Void) {
	closureList.append(escapeClosure)
}
func functionWithNoEscapingClosure(noEscapeClosure: () -> Void) {
	noEscapeClosure()
}

class MyClass {
	var x = 0
	func runBothEscapeAndNoEscape() {
		functionWithNoEscapingClosure { x = 10 }
		functionWithEscapingClosure { self.x = 20 }
	}
}

let myClassObj = MyClass()
print(myClassObj.x) //0

myClassObj.runBothEscapeAndNoEscape()
print(myClassObj.x) //10

if let escapeFunc = closureList.first { escapeFunc() }
print(myClassObj.x) //20
```

这个例子中，我们先声明了两个函数，`functionWithEscapingClosure()`接收一个逃逸闭包，将这个闭包放到`closureList`中；`functionWithNoEscapingClosure()`接收一个普通闭包并马上调用。  
于是当我们调用`myClassObj`的`runBothEscapeAndNoEscape()`方法后，上面两个函数均被调用。普通闭包`x = 10`立即执行，而逃逸闭包`self.x = 20`则没有。它需要我们从`closureList`中取出并在需要的时候手动调用。  
因此，`self.x = 20`是一个闭包参数，但调用它的函数`functionWithEscapingClosure()`

#### 自动闭包

先用官方的看不懂的抽象的语言说一遍，**自动闭包**是一种自动创建的闭包，它将作为函数参数的表达式包裹起来，变成一个闭包。这种闭包不接受任何参数，且可以实现延迟执行。  
看起来挺晕的，我们先举个栗子 🌰：

```swift
var intArr = [1, 2, 3, 4, 5]
let removeFirstNum = {intArr.removeFirst()} //这里不执行
print(intArr)   //[1, 2, 3, 4, 5]
removeFirstNum()    //这里执行
print(intArr)   //[2, 3, 4, 5]
```

所以说简单来讲，自动闭包就是将我们的表达式自动包裹成一个函数，此时该表达式属于函数的定义，并不会被执行；然后在我们需要的时候掉用该函数，从而实现延迟执行。

## 枚举

和 Java 的枚举一样（虽然 Java 在 JDK 1.5 的时候才引入枚举），**枚举**为一组相关的值定义了一个共同的类型，从而在代码中以类型安全的方式来使用这些值。  
用`enum`和`case`来定义枚举和其中的值：

```swift
enum PositionPoint {
    case north
    case south
    case east
    case west
}
//或者
enum CompassPoint {
    case north, south, east, west
}
```

枚举的使用也十分简单，注意枚举对象的数据类型就是我们所定义的枚举类型，因此，得益于类型推断，我们可以用**点语法**将一个对象设置为同一个枚举类型的另一个值：

```swift
var direction = PositionPoint.east
direction = .north
```

在 switch 中用到枚举的话，我们可以直接用**点语法**，不过要注意 switch 需要覆盖所有情况的，实在不行还是用个`default`吧

```swift
direction = .south
switch directionToHead {
case .north:
    print("Watch out for polar bears")
case .south:
    print("Watch out for penguins")
case .east:
    print("Where the sun rises")
case .west:
    print("Where the sun sets")
}
// 打印“Watch out for penguins”
```

#### 原始值

事实上，枚举类型里的每个成员都是可以被初始化设置一个值的，只要我们在定义枚举类型的时候声明这些值的类型。这些初始值就称为枚举类型的**原始值**。  
比如我们定义一个特殊字符的枚举类型：

```swift
enum ASCIIControlCharacter: Character {
    case tab = "\t"
    case lineFeed = "\n"
    case carriageReturn = "\r"
}
```

在上面的枚举类型中，每个成员都有一个`Character`类型的原始值，注意我们手动添加原始值的时候是不能重复的。  
在使用原始值类型为`Int`或`String`的枚举时，即使我们不添加原始值，它们也会被隐式赋值。  
当使用`Int`作为原始值时，隐式赋值的值依次递增 `1`。如果第一个枚举成员没有设置原始值，其原始值将为 `0`。

```swift
enum Planet: Int {
    case mercury , venus, earth, mars, jupiter, saturn, uranus, neptune
}
//mercury = 0， venus = 1, earth = 2...

enum Planet: Int {
    case mercury = 1, venus, earth, mars, jupiter, saturn, uranus, neptune
}
//mercury = 1, venus = 2, earth = 3...
```

当使用`String`作为枚举类型的原始值时，每个枚举成员的隐式原始值为该枚举成员的名称。

```swift
enum PositionPoint: String {
    case north, south, east, west
}
//north = "north", south = "south"...
```

在使用了原始值的情况下，我们可以用枚举类型自身的构造方法，并传入一个标签为 `rawValue` 的原始值参数，来生成一个对应枚举类型的成员对象。  
由于传入的原始值可能并不存在，因此返回的是一个可选类型， 值是枚举成员或 `nil`

```swift
enum PositionPoint: String {
	case north, south, east, west
}
if let myPositionPoint = PositionPoint(rawValue: "southEast") {
	switch myPositionPoint {
	case .south:
		print("you are in south")
	default:
		print("you are not in south")
	}
} else {
	print("cannot find your postion")
}
//cannot find your postion
```

在上面的例子中，由于`PositionPoint`中并不存在原始值为`southEast`的枚举成员，因此可选绑定的`if`条件不成立，进入下面的`else`语句块。

#### 关联值

**关联值**能够是把枚举类型的成员和其他类型的值相关联，每个枚举成员的关联值类型可以各不相同。  
举个栗子，我们有一个货架，上面的货物有的用字符串标识，有的用编码标识，我们可以用以下方式定义货物标识的枚举类型：

```swift
enum ProductMark {
	case stringMark(String)
	case codeMark(Int, Int, Int)
}
```

我们定义了一个`ProductMark`枚举类型，它的一个成员是`stringMark`，它有着类型为`(String)`的关联值；另一个成员是`codeMark`，它有着类型为`(Int, Int, Int)`的关联值。  
然后，我们可以通过`成员+关联值`来构造一个`ProductMark`对象：

```swift
enum ProductMark {
	case stringMark(String)
	case codeMark(Int, Int, Int)
}
let firstProductMark = ProductMark.stringMark("Pen")
let secondProductMark = ProductMark.codeMark(9, 5, 7)
```

当然，我们可以用`switch`语句来判断枚举对象属于哪一个成员，在`case`的条件中可以通过创建变量或常量来获取关联值：

```swift
switch firstProductMark {
case .stringMark(let productStr):
	print("Product mark is \(productStr)")
case .codeMark(let codeHead, let codeMiddle, let codeTail):
	print("Product code is \(codeHead)-\(codeMiddle)-\(codeTail)")
}
//Product mark is Pen

switch secondProductMark {
case .stringMark(let productStr):
	print("Product mark is \(productStr)")
case .codeMark(let codeHead, let codeMiddle, let codeTail):
	print("Product code is \(codeHead)-\(codeMiddle)-\(codeTail)")
}
//Product code is 9-5-7
```

如果一个成员中的每个关联值需要一个变量（或常量表示），我们可以在成员名称前声明变量（或常量）：

```swift
switch firstProductMark {
case let .stringMark(productStr):
	print("Product mark is \(productStr)")
case let .codeMark(codeHead, codeMiddle, codeTail):
	print("Product code is \(codeHead)-\(codeMiddle)-\(codeTail)")
}
```

#### 递归枚举

当一个枚举类型有一个或多个枚举成员使用其类型的实例作为关联值时，我们称其为递归枚举。  
在枚举成员前加上 `indirect` 关键字来表示该成员可递归，或者在枚举类型前加上这个关键字表示该类型的全部成员可递归：

```swift
enum mathExpression {
	case number(Int)
	indirect case addition(mathExpression, mathExpression)
	indirect case multiplication(mathExpression, mathExpression)
}
//等价于
indirect enum MathExpression {
	case number(Int)
	case addition(MathExpression, MathExpression)
	case multiplication(MathExpression, MathExpression)
}
```

举个栗子，我们可以用`MathExpression`来表示`(9 + 5) * 7`的表达式：

```swift
let nine = MathExpression.number(9)
let five = MathExpression.number(5)
let seven = MathExpression.number(7)
let addNineAndFive = MathExpression.addition(nine, five)
let finalExpression = MathExpression.multiplication(addNineAndFive, seven)
```

最后，我们可以定义一个递归函数，用来计算一个`MathExpression`：

```swift
func evalExpression(_ expression: MathExpression) -> Int {
	switch expression {
	case let .number(value):
		return value
	case let .addition(firstExpression, secondExpression):
		return evalExpression(firstExpression) + evalExpression(secondExpression)
	case let .multiplication(firstExpression, secondExpression):
		return evalExpression(firstExpression) * evalExpression(secondExpression)
	}
}

print(evalExpression(finalExpression))
//98
```

## 后话

下一篇的传送门：[从 0 开始的 Swift（下）](../2022-11-18-Swift-Introduce-Part2-2022)  
因为本来是一片文章的，所以参考不分上下了，两篇都一样

## 参考

1. [Swift GG: Swift 初见](https://swiftgg.gitbook.io/swift/huan-ying-shi-yong-swift/03_a_swift_tour)
2. [菜鸟：Swift 。程](https://www.runoob.com/swift/swift-tutorial.html)
3. [swift 之 guard 关键字](https://www.jianshu.com/p/621dda084c2a)
4. [Swift 便利构造器---convenience](https://www.jianshu.com/p/f3f9e2d531ef)
5. [Swift - as、as!、as?三种类型转换操作符使用详解（附样例）](https://www.hangge.com/blog/cache/detail_1089.html)
6. [Swift - Any、AnyObject、AnyClass 详细区别](https://blog.csdn.net/shihuboke/article/details/86488031)
7. [Any vs. AnyObject in Swift 3.0](https://medium.com/@mimicatcodes/any-vs-anyobject-in-swift-3-b1a8d3a02e00)
