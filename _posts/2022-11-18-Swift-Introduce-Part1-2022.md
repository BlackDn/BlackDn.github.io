---
layout:       post  
title:        Swift入门  
subtitle:     这是副标题  
date:         2022-11-18  
auther:       BlackDn  
header-img:   img/19mon6_43.jpg  
catalog:      true  
tags:    
    - Writings  
---

> "你顺手挽住烟火，散作大雪星罗。"


# Swift

## 前言
准备看看IOS开发，所以先来做做热身  
公司给的带有M1 Pro的MacBook Pro总不能浪费了吧（  
但是没想到是竟然会写这么长。。。  
早知道就分两篇文章了，可恶

## Swift基础
Swift 是一种支持多编程范式和编译式的开源编程语言，苹果于2014年WWDC（苹果开发者大会）发布，用于开发 iOS，OS X 和 watchOS 应用程序。2015年6月8日，苹果于WWDC 2015上宣布将Swift开源。  
Swift 结合了 C 和 Objective-C 的优点，且不受 C 兼容性的限制。Swift 在 Mac OS 和 iOS 平台可以和 Object-C 使用相同的运行环境。

### 输出：print()
Swift语句末尾的分号是可选的，加不加都行。但是如果在一行中包含多条执行语句，那么需要用分号将其分开。  
通常我们使用全局函数`print()`进行输出，一行代码就可以是一个完整的程序，我们不需要为了导入一个额外的库。全局作用域中的代码会被自动当做程序的入口点，因此我们也不需要 `main()` 函数。
```swift
let price = 7; print(price)
//输出：7
```

`print()`的完全体是`print(_:separator:terminator:)`，表示它接受三个参数，第一个是我们输入的值，第二个`separator`表示，第三个参数`terminator`表示在输出行后添加的结束符，默认为换行符。

### 类型和变量
#### 基本类型
按照惯例，我们从基本类型和变量入手。**Swift**和C语言和Objective-C有许多类似，所以其基本类型也都是老朋友了：
| 基本类型       | 类型              |
| -------------- | ----------------- |
| Int / UInt     | 整型 / 无符号整型 |
| Double / Float | 浮点              |
| Bool           | 布尔              |
| String         | 文本              |
| Character      | 单个字符          |

在整型中，我们可以使用8、16、32和64位的有符号和无符号整数类型。如8位无符号整数类型是 `UInt8`，32位有符号整数类型是 `Int32`  
```swift
let minValue = UInt8.min // minValue 为 0，是 UInt8 类型
let maxValue = UInt8.max // maxValue 为 255，是 UInt8 类型
```
如果我们偷懒仅仅使用`Int`类型，那么其长度与当前系统的原生字长相同：在32位平台上，Int32 长度相同。在64位平台上，Int64 长度相同。UInt类型也同理，根据系统其长度等价于UInt32或UInt64  

通过`typealias`可以为类型设置别名，虽然这个功能用的比较少。  
比如我们处理一些特定的数据的时候：
```swift
typealias EmployeeID = UInt16
var maxEmployeeIDNum = EmployeeID.min
// EmployeeID.min 本质上就是 UInt16.min
// maxEmployeeIDNum 现在是 0
```

在Swift中，空值会用`nil`来表示，和Objective-C的nill或java中的null类似（但不同，后两者是个指向不存在对象的指针，但Swift中的nil则是一个确定的值，用来表示值缺失）。  
如果我们声明一个变量但未赋值，它默认为nil。


#### 变量
Swift用`let`声明**常量**，用`var`来声明**变量**（不要和JS弄混了）  
通常情况下，编译器会自动推断我们的变量类型，所以我们不必显式声明其类型，这是Swift自带的**类型推断（type inference）**。  
不过我们想声明也行，特别是在一些精度问题或没有初始值的时候，可以用**冒号(:)分割**，后面跟上数据类型，我们称之为**类型注解（type annotation）**。  
要注意的是，Swift是一个**类型安全（type safe）** 的语言，它不存在自动转型的功能，如果类型不对，会直接报错。

变量名**不能包含**数学符号（加减乘除之类的），箭头，保留或非法的Unicode码位，连线与制表符。可以有数字但是不能以数字开头

```swift
let constant = 1  //常量
var variable = 42 //变量
let π = 3.14159
let 你好 = "你好世界"
let 🐶🐮 = "dogcow"

let price = 69.9  //这是Double
let discountPrice: Double = 70  //没有类型注解就是Int了
```

在Swift中，值永远**不会被隐式转换**为其他类型，所以需要我们进行显式转换

```swift
let label = "The Price is "
let price: Double = 70;
let priceTag = label + String(price);
```

上面的例子中，如果我们不显式地用`String(price)`将`price`转为`String`，那么则会报错，提示我们不能对Double和String进行`+`运算  

在给变量赋值的时候，我们可以用前缀来规定该数的进制：
- 默认为十进制，不需要前缀
- 二进制：`0b`
- 八进制：`0o`
- 十六进制：`0x`
此外还有科学计数法，指数用`e`标识（16进制的指数用`p`标识，大小写都不限）：  
`1.25e2` 表示 `1.25 × 10^2`，等于 `125.0`；`1.25e-2` 表示 `1.25 × 10^-2`，等于 `0.0125`。  
`0xFp2` 表示 `15 × 2^2`，等于 `60.0`；`0xFp-2` 表示 `15 × 2^-2`，等于 `3.75`。  

数值类字面量可以包括额外的格式来增强可读性。整数和浮点数都可以添加额外的零并且包含下划线，并不会影响字面量  
也就是说，我们可以用`1_000_000`来标识我们常见的`1,000,000`格式，同时他还是个Int而非String，其值也不会变化。
```swift
let paddedDouble = 000123.456
let oneMillion = 1_000_000
let justOverOneMillion = 1_000_000.000_000_1
```

#### 字符串
Swift允许我们用`\(variable)`来快速将变量转为String，这则是**字符串插值**  
还可以用`三个双引号（"""）`来包括多行字符串  
如果想在视觉上换行，但不想在字符串中实际换行的话，可以用在行尾写一个反斜杠（`\`）作为续行符，这和Shell脚本类似。  
此外，Swift的字符串是支持Unicode的，格式为`\u{unicode}`，具体懒得写了，感兴趣自己去看捏。

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

使用 `startIndex` 属性可以获取一个 `String` 的第一个 `Character` 的索引。使用 `endIndex` 属性可以获取最后一个 `Character` 的**后一个位置**的索引。（对于空串来说，`startIndex` 和 `endIndex` 是相等的。  ）  
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
| 方法 / 属性                     | 作用                                                 |
| ------------------------------- | ---------------------------------------------------- |
| myString.startIndex             | 获取myString 的第一个Character索引                   |
| myString.endIndex               | 获取myString 最后一个Character的**后一个位置**的索引 |
| myString.index(before:)         | 获取对应索引的前一个索引                             |
| myString.index(after:)          | 获取对应索引的后一个索引                             |
| myString.index(\_:offsetBy:)    | 获取对应索引的后offsetBy个索引（负数则往前）         |
| myString.indices                | 获取全部索引构成的Range                              |
| myString.count                  | myString的长度                                       |
| myString.isEmpty()              | 判断是否为空                                         |
| myString.append(s)              | 将s拼接到myString后面                                |
| myString.hasPrefix("black")     | 判断myString是否有前缀black                          |
| myString.hasSuffix("dawn")      | 判断myString是否有后缀black                          |
| myString.insert("!", at:)       | 在myString指定位置插入"!"                            |
| myString.insert(contentsOf:at:) | 在myString指定位置插入字符串                         |
| myString.remove(at:)            | 删除myString指定位置的一个字符                       |
| removeSubrange(\_:)             | 删除myString指定位置的字符串                         |

值得注意的是，`startIndex` 和 `endIndex` 属性； `index(before:)` 、`index(after:)` 和 `index(_:offsetBy:)` 方法；`insert(_:at:)`、`insert(contentsOf:at:)`、`remove(at:)` 和 `removeSubrange(_:)` 方法在遵循 `Collection` 协议的类型里面都支持的，如`Array`、`Dictionary` 和 `Set`等

#### 元组
Swift的**元组（tuples）** 和Python的元组类似，把多个值组合成一个复合值。元组内的值可以是任意类型，其中的元素数量也是任意的。  
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
比如我们在进行显式类型转换的时候`Int("123")`能正确被转换，但是`Int("Hello")`就不能被转换，因此在编译`let convert = Int(myString)`的时候，变量convert会被类型推断为`Int?`  
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
但是转念一想，我们每次`if`判断一下再进行取值，那多麻烦，这不是和Java用`if`判空一样嘛。为了避免这种麻烦，我们可以**隐式解析可选类型（implicitly unwrapped optionals）**，即在可选变量**声明赋值**的时候将问号改为感叹号。  
因为在第一次被赋值之后，这个可选变量肯定有值，这样我们就不必每次都用`if`判断其是否有值了，也因此我们可以直接取值而无需添加感叹号取值

```swift
let possibleString: String? = "An optional string."
let forcedString: String = possibleString! // 需要感叹号来获取值

let assumedString: String! = "An implicitly unwrapped optional string."
let implicitString: String = assumedString // 不需要感叹号
```

要注意的是，如果一个变量在程序执行的过程中有可能变成`nil`或被赋值成`nil`，那么还是别用隐式解析可选类型，用普通的可选类型比较好。

### 集合类型

除了基本类型，Swift还提供了三个**集合类型**，他们同属于Swift的基本类型：

| 集合类型   | 类型 |
| ---------- | ---- |
| Array      | 数组 |
| Set        | 集合 |
| Dictionary | 字典 |

#### Array 数组
数组是**有序**数据的集。集合是**无序无重复**数据的集。字典是无序**键值对**的集。  
不同于Python或JS，Swift要求这些集合类型都有明确且唯一的数据类型，毕竟它还是个**强类型语言**。

数组的完整写法是 `Array<Element>`，其中 `Element` 表示其数据类型。不过更推荐 `[Element]` 的简单写法。当然还可以通过构造方法`Array(repeating: 2, count: 3)`来创建重复元素的数组。  
数组可以直接用`+`或`+=`拼接，不过操作符两边的数组需要是相同类型的，否则会报错。  
数组的下标从0开始，还可以通过闭区间操作符表示多个范围的元素，比如`[1...3]`表示下标1～3的元素所组成的子数组。  
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

| 函数 / 属性                 | 作用                                  |
| --------------------------- | ------------------------------------- |
| intArray.count              | 数组的长度                            |
| intArray.append(3)          | 在数组末尾加上值为3的元素             |
| intArray.isEmpty            | 判断数组`count`是否为0                |
| intArray.insert(9, at: 0)   | 把元素9插入下标0处                    |
| intArray.remove(at: 0)      | 从数组中移除下标0的元素，并返回该元素 |
| intArray.removeFirst/Last() | 移除数组的第一个/最后一个元素并返回   |
| intArray.removeAll()        | 清空数组                              | 
| intArray.enumerated()       | 返回所有下标和元素组成的元组          |

#### Set 集合
集合是无序的，因此无法通过下标获取其内容（甚至每次`print`出来的顺序都不一样）。由于集合保证其每一个元都是单一的，因此集合类型**可哈希化的**，即该类型存在一个方法来计算**哈希值**。一个哈希值是 `Int` 类型的，若 `a.hashValue == b.hashValue`，则 `a == b`。  
不过好在Swift的所有基本类型默认都是可哈希化的，因此我们无需再额外创建（如果自定义类就要啦）。  
我们用`Set<Element>`来表示一个集合，但是在初始化的时候，如果数据源是一个数组，那么可以省略数据类型。毕竟数组的数据类型是确定的，Swift可以进行类型推断自己判断类型。  
集合同样可以用for-in遍历，但是由于它是无序的，因此每次遍历的顺序都不尽相同。最好的办法是通过`sorted()`方法将其变为有序数组再进行遍历。

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

| 函数 / 属性               | 作用                                                         |
| ------------------------- | ------------------------------------------------------------ |
| intSet.count              | 集合的元素数量                                               |
| intSet.insert(2)          | 将元素2插入集合（已存在则无变化）                            |
| intSet.remove(2)          | 若集合存在2，则删除并返回该元素；若没有，集合无变化，返回nil |
| intSet.removeAll()        | 清空集合                                                     |
| intSet.isEmpty            | 判断集合是否为空                                             |
| intSet.contains(2)        | 判断集合是否含有元素2                                        |
| intSet.sorted()           | 将集合转变为有序数组                                         |
| a.uniton(b)               | 合并集合a与集合b并返回新集合                                 |
| a.intersection(b)         | 取集合a与集合b的交集并返回                                   |
| a.subtracting(b)          | 在集合a中除去集合b的元素并返回                               |
| a.symmetricDifference(b)  | 除去集合a与集合b的交集并返回                                 |
| a.isSubset(of: b)         | a是否是b的子集（相等返回true）                               |
| a.isSuperset(of: b)       | a是否是b的父集（相等返回true）                               |
| a.isStrictSubset(of: b)   | a是否是b的子集（相等返回false）                              |
| a.isStrictSuperset(of: b) | a是否是b的父集（相等返回false）                              |
| a.isDisjoint(with: b)     | a是否和b没有交集                                             |

#### Dictonary 字典
字典用来保存键值对，`[Int: String]`分别表示`[键 : 值]`，空的键值对用`[:]`表示。  
我们可以用键来获取对应的值，不过由于可能不存在这个键值对，所以Swift会将其类型推断为**可选类型**。如果真的没有键值对，就会返回nil。（注意下面例子中不是下标，是`Int`类型的键）  
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

| 函数 / 属性                        | 作用                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| dic.count                          | 键值对的数量                                                      |
| dic.removeValue(2)                 | 删除键为2的键值对（没有则无变化）                                 |
| dic.removeAll()                    | 删除全部键值对                                                    |
| dic.updateValue("twooo", forKey:2) | 将键为2的键值对的值变为"twooo"，并返回修改前的值（没有则返回nil） |
| dic.keys                           | 返回键组成的数组                                                  |
| dic.values                         | 返回值组成的数组                                                  |

### 循环语句
#### for-in 循环
for循环在`Swift 3中被弃用`，可以用其他循环代替，我们直接来看`for-in`循环。  
for-in循环在之前的例子中用过，能够很方便地遍历一些集合类型，这里看一下一些比较少见的用法。  
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
while循环也就那样  
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
其次，由于Swift不会自己类型转换，因此，判断条件的时候必须要用布尔类型（`true / false`）。有时候我们在其他语言偷懒吧0看成`false`，把1（非0）看成`true`的操作在这里可是会报错的。  

在Java中我们会在循环或者判断中进行赋值操作（比如查完数据库循环读取Cursor啥的），在Swift中称之为**可选绑定（optional binding）**。

```swift
var convertValue = "123"
if let result = Int(convertValue) {
	print("convert success \(result)")
} else {
	print("convet failed.")
}
```

在上面的例子中，`Int(convertValue)`转换成功，result成功赋值为Int类型的`123`，因此输出`"convert success 123"`；如果`convertValue = "hello world"`，则会导致转换失败，`result`不会得到任何值，从而输出`"convet failed."`

此外，在`if`的条件语句中可以包含多个可选绑定或条件判断，只要使用逗号分开就行。只要有任意一个可选绑定的值为 `nil`（类型转换失败），或者任意一个条件判断为 `false`，则整个 `if` 条件判断为 `false`。（和`逻辑与&&`效果一样）

#### Swich语句
switch语句还是我们遵循的`switch-case`的样子：
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

不过区别还是有的，比如在Swift中，执行完一个case语句后会自动退出当前的switch，因此我们不需要在每个case后添加`break`（当然加了也没事），可以理解成每个case后都会有一个隐式的`break`   
因为每个case后都有一个`break`，所以Swift不允许空的case语句块。在Java或C语言的switch中，如果遇到空的case，程序会继续进入下一个case执行，而这在Swift中则会报错。想要合并多个case，需要在一个case中用逗号分隔多个值：

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

要注意的是，Swift中，`switch`必须包含全部的情况，或者一定要有`default`部分，否则就会报错：
```swift
//会报错：
switch inputCharacter {
case "a", "A":
    print("The letter A")
}
```

此外，case的条件可以用区间运算来表示一个范围：
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

当需要判断的条件是元组时，case的元组中的元素可以是值，也可以是区间，还可以使用下划线（\_）来匹配所有可能的值。
举个栗子🌰，假设我们有个坐标系，且有个以原点为中心，边长为4的box，然后我们判断一个点的位置：

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

此外，在使用下划线（\_）匹配任意值的时候，如果想获取这个任意值，可以直接用变量的声明来代替下划线（\_），这称之为值绑定（value binding）：
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

还可以用`where`来为case添加额外的判断条件：
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
-   `continue`
-   `break`
-   `fallthrough`
-   `return`
-   `throw`

`continue`是老朋友了，它在循环中使用，表示停止本次循环，重新开始下次循环，并不离开整个循环体。`break`与其相对，用于结束整个控制流（循环或`switch`）的执行。这两个我们都比较熟悉了。  其中，`return`用于函数返回，`throw`用于抛出错误，这里就不进一步介绍了。  
还记得在`switch`中，每个case都有个隐式的`break`，因此无法掉入下一个case中。但是如果我们偏要让其进入下一个case，则在最后用`fallthrugh`来表示，它相当于取消了最后隐式的`break`：
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

只有当guard后的条件为true时，程序才能继续正常执行，否则执行`else`中的代码  
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
在Swift的函数中，函数参数默认是常量，在函数内尝试修改参数值将会导致编译错误。同时，我们知道参数的作用域通常在函数体内，函数调用结束后参数会随之销毁，以释放内存。  
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

举个栗子🌰，我们为数组的`sorted()`方法自定义一个排序方法，让`[String]`数组根据字符串长度排序，分别用函数和闭包表达式的方式实现。  
利用闭包表达式，我们可以直接在`sorted()`的参数部分构造闭包，这种闭包称为**內联闭包**（Lambda都是这么用的啦）
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

不过我们知道，Swift的**类型推断**机制很好用，在闭包里也不例外。  
由于`strArr`是`[String]`的类型，那么其中的元素类型必为`String`，我们能这样断言了，Swift当然也可以，所以`sorted()`中的闭包参数的类型就可以省略；  
不仅如此，`sorted()`本身定义了它其中的排序函数返回值为`Bool`，所以Swift也能进行推断，返回类型也可以省略：
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
看起来挺晕的，我们先举个栗子🌰：  
```swift
var intArr = [1, 2, 3, 4, 5]
let removeFirstNum = {intArr.removeFirst()} //这里不执行
print(intArr)   //[1, 2, 3, 4, 5]
removeFirstNum()    //这里执行
print(intArr)   //[2, 3, 4, 5]
```

所以说简单来讲，自动闭包就是将我们的表达式自动包裹成一个函数，此时该表达式属于函数的定义，并不会被执行；然后在我们需要的时候掉用该函数，从而实现延迟执行。

## 枚举
和Java的枚举一样（虽然Java在JDK 1.5的时候才引入枚举），**枚举**为一组相关的值定义了一个共同的类型，从而在代码中以类型安全的方式来使用这些值。  
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

在switch中用到枚举的话，我们可以直接用**点语法**，不过要注意switch需要覆盖所有情况的，实在不行还是用个`default`吧
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
值类型相当于Java的基本类型，引用类型相当于Java的引用类型。  
当**值类型**被赋值给一个变量、常量或作为参数传递的时候，其值会被拷贝，后续的操作对最初的值类型对象是没有影响的。**结构体**和**枚举**就是值类型，Swift中所有**基本类型**（整数、浮点数、布尔值、字符串、数组、字典）都是值类型，其底层也是使用结构体实现的。  
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

为了判断多个对象是否使用相同的引用，Swift提供了两个恒等运算符：
- 相同：`===`
- 不相同：`!==`

```swift
print(myVideo === upgradeVideo) //true
```
只有使用引用类型的变量能使用这两个运算符。

### 属性
总的来说，Swift中属性可以分为**存储属性**，**计算属性**和**类型属性**。  

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
**类型属性**可以和Java中的**类变量（静态变量）** 进行类比，类型属性由类（结构体）持有，而非对象，因此对于其所有对象来说，它们共享一个静态变量。
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
-   `willSet` 在新的值被设置之前调用，将新的属性值作为常量参数传入。如果没有指定参数名，则默认为`newValue`
-   `didSet` 在新的值被设置之后调用，将旧的属性值作为参数传入。如果没有指定参数名，则默认为`oldValue`

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
这里我们定义个包装器来保证其中`Size()`类型的属性长宽不超过10：
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

可以看到，`wrappedValue`有着自己的`getter`和`setter`，`getter`照常返回其原值，而`setter`中，如果新值超过了10，则将其设回为10。这里没有为新值设置变量名，因此默认为`newValue`

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

类型的每一个实例都有一个隐含属性叫做 `self`，代表该实例本身，如同Java中的`this`，比如上面`Counter`的方法中，所有`count`都可以用`self.count`代替。当然因为我们只有一个属性`count`，因此省略`self`也不会出现歧义。  
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
注意一下这里，参数列表里的`x`和`y`是`deltaX`和`deltaY`的**参数标签**，`Point(x: x + deltaX, y: y + deltaY)`里的`x`和`y`是结构体Point的属性。

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
Swift中用冒号表示继承关系：
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
Swift用关键字`init()`表示一个构造器。如果结构体或类为所有属性提供了默认值，又没有任何自定义的构造器，那么 Swift 会隐式地给这些其提供一个**默认构造器**，简单地创建一个属性全是默认值的实例。
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

不同于Java，在自定义的构造器中，即使参数类型相同，参数名不同的构造器仍会被认为是不同的两个构造器：
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
2. 如果子类实现（重写）了父类全部的指定构造器（包括情况1），那么它将自动继承父类所有的便利构造器。

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
关键字 `is` 用于**类型检查**，它检查一个实例是否属于特定子类型，是的话返回`true`，不是返回`false`，类似Java中的`instanceof`
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

在上面的例子中，`petStore`通过类型推断后，得到的是存储`Animal`类型的数组，毕竟Swift保证数组类型的统一。

类型转换的关键字是`as`、`as?`和`as!`，它们本质上都是一种**赋值操作**。  
我们把继承关系看成一棵树，基类（父类）是其根节点，并向下指向自己的子类，子类向上继承父类。  
将子类转换成父类称为**向上转型（upcasts）**，因为向上转型是一定会成功的（Java中都可以自动转型呢），所以不需要进一步操作。  
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
Swift为不确定的类型或对象提供了`Any`和`AnyObject`两种别名，官方文档翻译来是这样的：
- `Any`：表示任何类型的实例，包括函数。
- `AnyObject`：表示任何类的实。
笑死，还是看不懂。  
于是我们往下深挖一点，先来看`AnyObject`，实际上`AnyObject`是一个**协议**。协议在下一节就介绍了，在这里先提及一下，方便理解`Any`和`AnyObject`。  
凡是被`class`定义的类型，那么它就会隐式遵循`AnyObject`这个协议。（当然这个协议里没有啥属性或方法需要实现）  ，可以说`AnyObject`代表了所有由`class`定义的类。到那时，除此之外其他的类型怎么办？我们还有基本类型，结构体，枚举啥的呢。  
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
可以把**协议**理解成Java的接口，它规定了用来实现某一特定任务或者功能的方法、属性。  
类、结构体或枚举都可以**遵循协议**，就好比在Java中实现借口。  
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

#### 协议的可选要求
我们可以用`optional` 关键字来为协议定义可选要求（属性或方法），是否实现这些要求交由遵循的类型决定。

```swift
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
就像Java中的接口，协议可以作为一种独立的类型来使用，尽管其本身并未实现任何功能，有时我们称协议为**存在类型**。因此，协议也可以做到这些事：
1. 为函数、方法或构造器中的参数类型或返回值类型
2. 作为常量、变量或属性的类型
3. 作为数组、字典或其他容器中的元素类型

此外，既然协议是一个独立的类型，那么它自然可以被继承。协议能够继承一个或多个其他协议，在实现其他协议的要求后增加自己新的要求。

```swift
protocol ChildProtocol: SomeProtocol, AnotherProtocol {
	//...
}
```

比如我们新增一个DogProtocol，它继承AnimalProtocol并新增了一个color属性：
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
用 `A & B`表明合成A和B两个协议，当然可以继续合成任意数量的协议：

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
**错误处理（error handling）**，类似于Java的`Exception`机制，当遇到错误的时候，抛出错误并进行处理

首先，我们可以通过`Error`的枚举类型来定义自己的错误协议；  
然后，在声明函数名的后面添加`throws`关键字来表示其可能抛出错误，并且在执行的时候可以用`do-try-catch`语句来进行错误的捕获和处理，注意`try`写在调用函数的前面。  
如果在`catch`中我们没有给抛出的Error命名，则会默认命名为 `error`

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

`result`将被编译为一个可选类型，如果`makeASandwich()`执行成功，则result的值就是它的返回值；如果失败，`result`的值就为`nil`。  
这种方式处理错误的方法就是：不处理错误。直接将错误抛弃，不进行后续处理。  

此外，我们可以用`defer`代码块来表示在函数返回前，函数中最后执行的代码，就像Java中的`finally`，不论是否抛出错误，都会执行其中的代码。

```swift
func makeASandwich() throws {
    // ...
    defer {
	    print("I will be executed anyway.")
    }
}
```

## 后话
先试试看放一篇里好不好用，不好用就分两篇。

## 参考
1. [Swift GG: Swift 初见](https://swiftgg.gitbook.io/swift/huan-ying-shi-yong-swift/03_a_swift_tour)
2. [菜鸟：Swift 教程](https://www.runoob.com/swift/swift-tutorial.html)
3. [swift之guard关键字](https://www.jianshu.com/p/621dda084c2a)
4. [Swift便利构造器---convenience](https://www.jianshu.com/p/f3f9e2d531ef)
5. [Swift - as、as!、as?三种类型转换操作符使用详解（附样例）](https://www.hangge.com/blog/cache/detail_1089.html)
6. [Swift - Any、AnyObject、AnyClass详细区别](https://blog.csdn.net/shihuboke/article/details/86488031)
7. [Any vs. AnyObject in Swift 3.0](https://medium.com/@mimicatcodes/any-vs-anyobject-in-swift-3-b1a8d3a02e00)
