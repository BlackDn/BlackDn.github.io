---
layout:       post  
title:        Web：JavaScript基础  
subtitle:     数据类型、变量、语法等  
date:         2022-08-20  
auther:       BlackDn  
header-img:   img/19mon7_02.jpg  
catalog:      true  
tags:  
    - Web  
    - JavaScript  
---

> "三更梦醒，瞧檐上落下的月，满地银光。"

# Web：JavaScript基础

## 前言

最后轮到JS了，这篇文章并不能帮你熟练使用JS，但是能帮你理解个大概  
这篇都是一些基础啊语法啥的，之后再整一篇JS结合HTML的文章吧   
这里有个好玩的闯关式学习教程：[free code camp](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

## 一些基础

在前端三剑客HTML，CSS，JavaScript中，JS是唯一的编程语言，因此它更为复杂，但各种功能的背后都离不开它。  

最初，JavaScript在1995年由Netscape公司的Brendan Eich设计实现，由于那时该公司正和Sun公司合作，希望它外观看起来像Java，因此取名为JavaScript。  
遗憾的是如今我们知道两者相差甚远，Java是典型的**强类型语言**，而JS则是**弱类型语言**，定义变量的时候不需要规定其数据类型；毕竟Java是**静态语言**，需要先编译成class文件再执行，而JS则是**动态语言**，数据类型可以在运行时确定。  
当然静态语言的优势在于其严格的代码规范，因此IDE有很强的代码感知能力，一些小错误会即时报错，所以很适合大型或复杂的系统；反之动态语言的代码量更少更简洁，能让开发者更注重业务逻辑。  
JavaScript的文件后缀为`.js`，所以它也简称为JS。  
而著名的**ES6（ECMAScript 6）**则是2015年6月发布的JS语言标准，正式名为**ECMAScript 2015（ES2015）**。在ES6中，引入了很多新的语法功能、方法和特性，如今已得到广泛的应用。

和css类似，可以在`<head>`中添加一个`<script>`元素来绑定一个HTML和JS文件：  
`<script type="text/javascript" src="./test.js"></script>` 

当然，我们也可以在`<body>`添加：  
`<script type="module" src="index.js"></script>`

### 数据类型

和大部分语言类似，JS的数据类型大体可分为两种：**基本类型（Value Type / Primitive Types）**和**引用类型（Reference Types）**   
区别也基本没差，**基本类型**通过`值`传值，而**引用类型**通过`引用（地址）`传值  
具体类型如下：

| 数据类型  | 意义               | 类型     |
| --------- | ------------------ | -------- |
| Number    | 数值               | 基本类型 |
| BigInt    | 大整数             | 基本类型 |
| String    | 字符串             | 基本类型 |
| Boolean   | 布尔类型           | 基本类型 |
| Symbol    | 唯一标识对象的属性 | 基本类型 |
| undefined | 未赋值变量的默认值 | 基本类型 |
| null      | 空对象引用         | 基本类型 |
| Object    | 对象               | 引用类型 |
| Function  | 函数               | 引用类型 |
| Array     | 数组               | 引用类型 |

然后下面对一些数据的细节进行说明  
由于JS没有区分整数和浮点数，所以不管是整数还是小数，最终都是`Number`类型  
而对于那些不存在的数字（比如`0/0`），其值为`NaN`  

至于`Symbol`，它是ES6引入的一个新的基本类型，用于解决对象属性名冲突的问题。在ES6之前，所有属性名都是字符串，这就容易造成属性名的冲突，特别是想给别人提供的对象添加新的属性或方法的时候（毕竟你不知道它本来有哪些属性或方法）  
可以通过`Symbol()`创建，也可以传入字符串参数作为对该变量的说明

```js
let sym = Symbol();	//创建一个Symbol
let symWithPara = Symbol('name');	//带说明的Symbol
//作为对象的唯一属性
let obj = {
  [symWithPara]: 'BlackDn'
};
console.log(obj[symWithPara]);	//输出'Blackdn'
```

如果不加参数，比如`sym`，在控制台输出的就是`Symbol()`；如果加了参数，比如`symWithPara`，输出的就是`Symbol('name')`  
此外，`Symbol()`参数只是表示对当前 `Symbol` 值的描述，因此即便参数相同的两个`Symbol`其值也是不相等的。  
不过要注意作为属性名的时候需要用**方括号**包裹`Symbol`，否则就只是`symWithPara`的字符串而非这个`Symbol`变量。同样，`obj['symWithPara']`和`obj.symWithPara`得到的都**不是**这个`Symbol`。

### 引号的使用

JS支持三种引号，即单引号`''`，双引号`""`，反引号` `` `   
通常情况下，都是在用字符串的情况下使用引号，单引号`''`和双引号`""`都可以表示字符串

```js
const s1 = "hello";
const s2 = 'hello';
console.log(s1 === s2);	//输出：true
```

不过如果想字符串中包含引号，就需要用`\`转义。  
所以很多时候为了简洁起见，可以混合使用单双引号，这样就不用转义了

```js
const s1 = "hello \"world\"";
const s2 = 'hello \'world\'';

const s3 = 'hello "world"';
const s4 = "hello 'world'";

console.log(s1 === s3);	//输出：true
console.log(s2 === s4);	//输出：true
```

至于反引号` `` ` 是比较新的，在ES6引入  
很多时候我们需要用变量来构造字符串，这样就要用`+`来进行字符串的运算，非常麻烦：

```js
const user = 'blackdn';
const s = "hello " + user + " to this world.";
console.log(s);		//输出：hello blackdn to this world.
```

于是引入了反引号` `` `，支持在字符串中直接解析变量：

```js
const user = 'blackdn';
const str = `hello ${user} to this world.`;
console.log(str);	//输出：hello blackdn to this world.
```

当然，反引号的字符串里要用反引号也需要转义。

```js
const str = `hello \`world\`.`;
console.log(str);	//输出：hello `world`.
```

### 声明变量

三种方式声明变量：`let`，`var`和`const`

```js
let name = 'black';
var handsome = 'yes';
const age = 18;
```

之前，JS只能通过`var`声明变量，不过ES6引入了`let`。相对于`var`，`let`所声明的变量作用域更小，只在其所在的代码块内有效**（block-scoped）**；  
而`var`的作用域则更大，在整个函数域内都存在**（function-scoped）**  
所以原则上是能用`let`就用`let`。避免一些意料之外的误写、冲突等错误

```js
for (let i = 0; i < 5; i++) {
    console.log(i);	//输出1-4
}
console.log(i);	//报错ReferenceError: i is not defined

for (var i = 0; i < 5; i++) {}
console.log(i);	//输出5
```

此外，`var`存在**变量提升（Hoisting）**现象，即变量可以在声明之前使用，值为`undefined`。  
不过显然，在声明前使用变量是不合逻辑的，因此`let`纠正了这种现象，在声明前使用`let`的对象会报错：

```js
console.log(foo); // 输出undefined
var foo = 2;

console.log(bar); // 报错ReferenceError
let bar = 2;
```

`const`是声明一个常量不多做解释了，要注意的是，当这个常量是一个**引用类型**时，比如一个对象或数组，我们仍可对其内容进行修改。  
因为我们修改后改变的是值而非地址，而引用类型的保存的是地址，其并没有发生变化，因此这对JS来说是合法的：

```js
const person = {
     name: 'Blackdn' 
    };
person.name = 'White';
console.log(person.name)	//输出'White'
```

### 逻辑运算

什么`if-else`的判断语句就不展开讲了，简单来说`if`，`if-else`，`if-else if`等语句都可以用的  
还有`switch`语句也和`java`没差，都是`switch-case-break`的形式，就略过啦  
这里就简单说一下逻辑运算嗷。

#### 或运算：||

或运算还是老样子，只要有一个为`true`，则全部为`true`，就不举例了。  
不过在JS中，或运算还有特殊的作用，就是用来**寻找第一个真值**：

```js
result = value1 || value2 || value3;
```

在上面的式子中，会从左到右进行操作计算，处理每一个操作数时，都将其转化为布尔值。如果结果是 `true`，就停止计算，返回这个操作数的初始值  
如果所有的操作数都被计算过（也就是，转换结果都是 `false`），则返回最后一个操作数。  
不论如何，返回的值是操作数的初始形式，不会做布尔转换。  
利用这个特性，我们可以用来做一些意料之外的事情，比如**获取变量列表或者表达式中的第一个真值**：

```js
let firstName = "";
let lastName = "";
let nickName = "BlackDn";
console.log( firstName || lastName || nickName || "allEmpty"); //输出：BlackDn
```

另一个用处就是进行**短路求值（Short-circuit evaluation）**  
当进行到达到第一个真值后，会立即返回该值，而无需处理其他参数。  
这个特性常用来执行左侧的条件为假时才执行命令。（虽然但是用`if`他不香吗）

```js
true|| console.log("1");	//没有输出
false || alert("alert me when all of others fail");		//输出："alert me when all of others fail"
```

#### 与运算：&&

与运算也不用多讲，全为`true`才返回`true`  
和或运算类似，与运算用来**寻找第一个假值**

```js
result = value1 && value2 && value3;
```

同样从左到右进行计算，先转为布尔值，遇到`false`就停止，返回操作数的初始值。要是全为`true`就返回最后一个操作数的初始值  

注意，与运算 `&&` 的优先级比或运算 `||` 要高  
 `a && b || c && d` 等同于`(a && b) || (c && d)`（写的时候都给我加上括号，老师教的代码可读性可别忘了！）

#### 非运算：!

......不会指望我讲这个吧？ 
好吧还是简单说一下，非运算用来取反，没了。

值得一提的是，我们可以用两个非运算`!!`来将某个值转化为布尔类型：

```js
console.log( !!"non-empty string" ); // true
console.log( !!null ); // false
```

原理就是第一个非运算将该值转化为布尔类型并取反，第二个非运算再次取反，就得到了其布尔类型，而非初始数据类型。  
当然可以用`Boolean`函数创建一个布尔对象，从而得到同样的效果：

```js
console.log(Boolean("non-empty string")); // true
console.log(Boolean(null)); // false
```

#### == 和 ===

简单来说，`==`是普通比较，`===`是严格比较。  
`==`在比较的时候，如果双方的数据类型不相等，则会进行一个转换，比如`1 == true（数字和Boolean比较）`，双方类型不同，会将`true`转换成`1`，因此等式成立。同理，`"1" == true`，`0 == false`都是成立的。  
`===`就比较直白了，先比较数据类型，如果不同就不成立；如果类型相同了，再比较值，值不同也不成立。只有当类型和值都相等的情况下才会成立。

```js
1 == 1; 	//true
'1' == 1;	//true
0 == false;	//true
0 == null;	//false
0 == undefined;		//false
null == undefined;	//true
NaN == NaN;		//false NaN和任何数都不相等

3 === 3;	//true
3 === '3';	//false
null === undefined;	//false
```

同理，`!=`和`!==`也是同样的效果，前者会先进行类型转换，后者的比较内容包括类型。

#### 空值合并运算：??

空值合并运算符（nullish coalescing operator）是ES6引入的，当左侧参数为`null`或`undefined`的时候，则返回右侧参数：

```js
let result = value1 ?? value2;
```

如果`value1`为为`null`或`undefined`则`result`的值为`value2`。用三元操作符`?:`表示的话就是：

```js
result = (value1 !== null && value1 !== undefined) ? value1 : value2;
```

该运算通常用来提供默认值。

和或运算类似， `??` 可以从一系列的值中选择出第一个 `非null/undefined` 的值。（因为或运算会将`null/undefined`视为`false`）

```js
let firstName = "";
let lastName = "";
let nickName = "BlackDn";
console.log(firstName ?? lastName ?? nickName ?? "allEmpty"); //输出：BlackDn
```

### 循环语句

循环其实也没差啦，`while`循环、`for`循环、`do-while`都和java一样所以就不说啦  
要说唯一的差别那就是for循环中定义变量的时候要用`let`而不是`int`吧=。=

这里说一下比较特别的`for-in`和`for-of`循环，他们和java中的`for-each`比较像  
不过`for-in`循环的内容是下标（数组）或属性（对象）而另一个`for-of`循环则直接输出元素  
因此对于数组推荐使用`for-of`，对于对象则推荐使用`for-of`（对象不能使用`for-of`）

对象只能用`for-in`

```js
const person = {
  name:"Blackdn", age:22
}; 

for (let prop in person) {
    console.log(prop + " " + person[prop]);
}
//输出：
//name Blackdn
//age 22
```

数组则两个都可以用：

```js
const arr = ['a', 'b'];

  for (let index in arr) {
      console.log(index + " " + arr[index]);
  }
//输出：
//0 a
//1 b
  for (let val of arr) {
    console.log(val);
  }
//输出：
//a
//b
```

### 常用函数

| 函数          | 作用                                                         |
| ------------- | ------------------------------------------------------------ |
| Math.random() | 生成随机数（`[0,1)`）                                        |
| Math.floor()  | 去掉小数部分，保留整数                                       |
| parseInt()    | 将字符串转为整数类型（`parseInt("11", 2)`返回`3`，第二个可选参数表示进制） |

## 数组Array

数组大体上没什么好说的，同样是通过下标（index）索引，下标同样是从0开始  
不过，既然是动态编译的弱类型语言，JS允许数组的各个元素是**不同的数据类型**  

可以用`push`方法直接在数组后面添加元素

```js
const array = [1, 2, 3];
array.push(4, 5);	//变成[1, 2, 3, 4, 5]
```

此外，Array的`filter`可以对数组元素进行筛选，从而得到新的数组

```js
const numbers = [1, 2, 3, 4, 5];
const filtered = numbers.filter((n) => n % 2 === 0);	//结果为[2, 4]
```

而`map`能对所有元素进行操作

```js
const numbers = [1, 2, 3, 4, 5];
const mapped = numbers.map((n) => n += 1);	//结果为[2, 3, 4, 5, 6]
```

还有`reduce`，通常进行求和等操作。因为它最终是吧一串元素变成一个值，所以称之为`reduce（减少）`

```js
const numbers = [1, 2, 3, 4, 5];
const reduced = numbers.reduce((accumulator, current) => accumulator + current);
//reduced结果为：15
```

然后下面是一些常用函数，更多可以看菜鸟：[JavaScript Array 对象](https://www.runoob.com/jsref/jsref-obj-array.html)

| 函数         | 作用                                                         |
| ------------ | ------------------------------------------------------------ |
| `slice()`    | 选取数组的一部分，并返回一个新数组，`slice(4,7)`返回原数组下标`4-6`元素组成的新数组，包含头位置，不包含尾位置 |
| `join()`     | 连接数组元素为字符串，传入参数为连接符，默认为逗号`,`，`['hello', 'world'].join('->')结果为'hello->world'` |
| `find()`     | 返回第一个符合要求的元素，都不符合时返回`undefind`。需要传入函数作为参数，以此判断是否符合要求。 |
| `unshift()`  | 在数组头部增加元素                                           |
| `push()`     | 在数组尾部增加元素                                           |
| `pop()`      | 删除并返回数组的最后一个元素                                 |
| `shift()`    | 删除并返回数组的第一个元素                                   |
| `splice()`   | 从数组中添加或删除元素，会修改原数组。`splice(index, quantity, item1...n)`，参数分别表示`删除/添加位置`，`删除多少元素`，`添加的新元素` |
| `includes()` | 判断一个数组是否包含一个指定的值。                           |
| `indexOf()`  | 搜索数组中的元素，并返回它所在的位置。没找到则返回`-1`       |
| `forEach()`  | 对每个元素执行某函数（参数为函数）                           |

##  字符串String

字符串也没啥好说的，这里列出一些我遇到过的函数  
JS就是这点不好，你不知道他都有啥函数，除非看到别人用或者自己去查手册。不像Java那样能到源码里看=。=  
也可以看看菜鸟，里面的方法还挺全的：[JavaScript String 对象](https://www.runoob.com/jsref/jsref-obj-string.html)

| 函数            | 作用                                                         |
| --------------- | ------------------------------------------------------------ |
| `slice()`       | 提取字符串的片断，`'coconuts'.slice(4,7)结果为'nut'`，包含头位置，不包含尾位置 |
| `indexOf()`     | 返回子串开头的出现位置：`'coconuts'.indexOf('ut')结果为5`    |
| `trim()`        | 去除字符串两边的空白                                         |
| `split()`       | 把字符串分割为字符串数组，参数为分隔符（为空时不分割，为空字符串`''`时分割每个字符） |
| `toLowerCase()` | 全变为大写                                                   |
| `toUpperCase()` | 全变为小写                                                   |
| `concat()`      | 连接多个字符串                                               |
| `startsWith()`  | 判断字符串是否以某子串开头                                   |
| `endsWith()`    | 判断字符串是否以某子串结尾                                   |

## 对象Object 和 类Class

### 定义对象

在JS中创建对象比较简单，只需要用括号包括，再用键值对`属性名: 值`的方式创建属性即可  
下面两种声明和获取属性的方式是一样的：

```js
let person = {
  name: 'Blackdn'  
};
console.log(person.name);	//输出'Blackdn'  
//等同于
let person = {
    ['name']: 'Blackdn'  
  };
console.log(person['name']);	//输出'Blackdn'  
```

还要注意一点，如果属性名由**变量**存储，那么只能通过方括号的方式来获取变量内的属性名  
且方括号中的变量名**不能**加上引号：

```js
let propertyName = 'name';
console.log(person.propertyName);   //输出'undefined'
console.log(person[propertyName]);   //输出'Blackdn'
console.log(person['propertyName']);   //输出'undefined'
```

### 定义类

和传统一样，JS用关键字`class`标识一个类，不过不同的是我们不需要为其声明属性  
类中的属性直接在**构造函数**中标识，用`constructor`标识构造函数  
当然类也可以有自己的函数，不过定义的时候不需要`function`关键字

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    introduce() {
        return `My name is ${this.name}. I am ${this.age} years old.`;
    }
}
```

### 继承类

继承同样用的是`extend`关键字：

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    introduce() {
        return `My name is ${this.name}. I am ${this.age} years old.`;
    }
}

class Student extends Person{
    constructor(name, age, klass) {
        super(name, age);
        this.klass = klass;
    }
    introduce() {
      return `${super.introduce()} I am a Student. I am at Class ${this.klass}.`;
    }
}
```

继承的时候，子类中用`super`指代父类，可以用`super()`调用父类的构造方法，也可以用来调用父类的函数  
比如`Student`的`introduce`方法实际上等同于  
`My name is ${this.name}. I am ${this.age} years old. I am a Student. I am at Class ${this.klass}.`

### 常用函数

用到的时候再加吧=。=

| 函数               | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| `hasOwnProperty()` | 判断某对象是否含有某属性。`person.hasOwnProperty('name')`等同于`'name' in person`，都返回`true` |
| `Object.keys()`    | 将对象的所有属性名返回为一个数组。`Object.keys(person)`返回`['name']` |

## 模块化 Model

就像之前的Sass能够用`@import`导入文件实现模块化，JS肯定不甘落后  
很多时候我们将一个类进行模块化，然后在子类中导入并继承。我们把上面的`Person`类放在`person.js`文件中  
不同于Sass，我们不能直接在其他文件导入`person.js`，而是在导入前需要进行导出  
我们可以在定义类的时候用`export`声明导出：

```js
// person.js
export class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    introduce() {
        return `My name is ${this.name}. I am ${this.age} years old.`;
    }
}
```

当然也可以在代码最后声明导出：  
我比较喜欢这种方式啦，方便查找修改。

```js
// person.js
class Person {
	//···
}
export Person;
```

既然有了`person.js`，那么我们再搞一个`student.js`用来写子类`Student`  
我们的父类`Person`已经道出了，那么在`student.js`中就要将其导入：

```js
// student.js
import {Person} from "./person";

class Student extends Person{
    constructor(name, age, klass) {
        super(name, age);
        this.klass = klass;
    }
    introduce() {
      return `${super.introduce()} I am a Student. I am at Class ${this.klass}.`;
    }
}
```

可以看到导入的格式为`import {name} from "file";`  
和Sass一样， 文件名不需要加`.js`后缀

上面的方法称为**命名导出（Named Export）**，还有一种**默认导出（Default Export）**  
就是多加个`default`关键字：

```js
// person.js
class Person {
	//···
}
export default Person;
```

使用默认导出后，在导入的时候就不需要加中括号了：

```js
// student.js
import Person from "./person";

class Student extends Person{
    //···
}
```

当然也可以结合使用：

```js
// person.js
class Person {
	//···
}
export function funToExport() {
    console.log("hello");
}
export default Person;
```

这样`student.js`中的导入语句就可以结合两者，`Person`是默认导入的所以不用中括号，函数`funToExport()`是命名导入所以就要有中括号

```js
// student.js
import Person, {funToExport} from "./person";

class Student extends Person{
    //···
}
```
## 参考

1. [JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)
2. [阮一峰：ES6 入门教程](https://wangdoc.com/es6/)
3. [【YouTube百万粉丝大神 Mosh】JavaScript系列完整教程（中英文字幕）](https://www.bilibili.com/video/BV11B4y1U7aH?p=2&vd_source=e0304398288bd0595d726c9759188da1)
4. [JS 单引号、双引号与反引号的区别](https://blog.csdn.net/k346k346/article/details/112540252)
5. [逻辑运算符](https://zh.javascript.info/logical-operators)
6. [JavaScript String 对象](https://www.runoob.com/jsref/jsref-obj-string.html)
7. [JavaScript Array 对象](https://www.runoob.com/jsref/jsref-obj-array.html)