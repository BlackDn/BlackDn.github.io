# JS

## 前言



## 一些基础

在前端三剑客HTML，CSS，JavaScript中，JS是唯一的编程语言，因此它更为复杂，但各种功能的背后都离不开它。  

最初，JavaScript在1995年由Netscape公司的Brendan Eich设计实现，由于那时该公司正和Sun公司合作，希望它外观看起来像Java，因此取名为JavaScript。  
遗憾的是如今我们知道两者相差甚远，Java是典型的强类型语言，而JS则是弱类型语言，定义变量的时候不需要规定其数据类型；毕竟Java是静态语言，需要先编译成class文件再执行，而JS则是动态语言，数据类型可以在运行时确定。  
当然静态语言的优势在于其严格的代码规范，因此IDE有很强的代码感知能力，一些小错误会即时报错，所以很适合大型或复杂的系统；反之动态语言的代码量更少更简洁，让开发者更注重业务逻辑。

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

#### for - in遍历

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
| `unshift()`  | 在数组头部增加元素                                           |
| `push()`     | 在数组尾部增加元素                                           |
| `find()`     | 返回第一个符合要求的元素，都不符合时返回`undefind`。需要传入函数作为参数，以此判断是否符合要求。 |
| `pop()`      | 删除并返回数组的最后一个元素                                 |
| `shift()`    | 删除并返回数组的第一个元素                                   |
| `splice()`   | 从数组中添加或删除元素，会修改原数组。`splice(index, quantity, item1...n)`，参数分别表示`删除/添加位置`，`删除多少元素`，`添加的新元素` |
| `includes()` | 判断一个数组是否包含一个指定的值。                           |
| `indexOf()`  | 搜索数组中的元素，并返回它所在的位置。没找到则返回`-1`       |



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

## 对象 和 类 Class

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

| 函数               | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| `hasOwnProperty()` | 判断某对象是否含有某属性。`person.hasOwnProperty('name')`等同于`'name' in person`，都返回`true` |
| `Object.keys()`    | 将对象的所有属性名返回为一个数组。`Object.keys(person)`返回`['name']` |
|                    |                                                              |



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

```js
import Person from "./person";

class Student extends Person{
    constructor(name, age, klass) {
        super(name, age);
        this.klass = klass;
    }
    introduce() {
        return `I am a Student. I am at Class ${this.klass}.`;
    }
}

export default Student;
```



## 模块化 Model

## 参考

1. [JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)
2. [阮一峰：ES6 入门教程](https://wangdoc.com/es6/)
3. [【YouTube百万粉丝大神 Mosh】JavaScript系列完整教程（中英文字幕）](https://www.bilibili.com/video/BV11B4y1U7aH?p=2&vd_source=e0304398288bd0595d726c9759188da1)
4. [逻辑运算符](https://zh.javascript.info/logical-operators)
5. [JavaScript String 对象](https://www.runoob.com/jsref/jsref-obj-string.html)
6. [JavaScript Array 对象](https://www.runoob.com/jsref/jsref-obj-array.html)