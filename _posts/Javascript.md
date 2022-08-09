# JS

## 前言



## 基本语法

Dynamic

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

### 数组Array

数组大体上没什么好说的，同样是通过下标（index）索引，下标同样是从0开始  
不过，既然是动态编译的弱类型语言，JS允许数组的各个元素是**不同的数据类型**

#### filter



#### map

#### reduce

### 逻辑运算

#### == 和 ===

      1 == 1,
      '1' == 1,
      1 == '1',
      0 == false,
      0 == null,
      objectLeft == objectRight,
      0 == undefined,
      null == undefined,
      
            true,
          true,
          true,
          true,
          false,
          false,
          false,
          true
          
                3 === 3,
          3 === '3',
          objectLeft === objectRight,
          null === undefined,
    
          true,
          false,
          false,
          false

###  字符串String

| 函数               | 作用 |
| ------------------ | ---- |
| string.slice(4, 7) |      |
| indexOf('ut')      |      |
| trim()             |      |
| split(' ')         |      |
| join('->')         |      |





## 参考

1. [阮一峰：ES6 入门教程](https://wangdoc.com/es6/)
2. [【YouTube百万粉丝大神 Mosh】JavaScript系列完整教程（中英文字幕）](https://www.bilibili.com/video/BV11B4y1U7aH?p=2&vd_source=e0304398288bd0595d726c9759188da1)
3. 