---
layout:       post  
title:        Web：异步方法 & 网络请求  
subtitle:     JS的异步和网络请求（Promise，Fetch，XMLHttpRequest）  
date:         2022-09-11  
auther:       BlackDn  
header-img:   img/19mon7_16.jpg  
catalog:      true  
tags:  
    - Web  
    - JavaScript  
---

> "偶尔傻傻孤单，偶尔傻傻浪漫。"

# Web：异步方法和网络请求

## 前言

祝大家昨天中秋快乐嗷  
这是一些JS中的异步方法和网络请求方法  
恭喜离全栈又更近了一步=。=

本文用到了[REQRES](https://reqres.in/)提供的接口。这个网站提供假的接口以便我们测试前端的连接。  
简单来说就是我们访问他的API，然后通过返回值判断连接是否成功（他会告诉你请求内容是什么，他返回给你的东西是什么）。挺好用的，感兴趣的话可以去看看。

## 异步

大家都知道，我们从上往下写代码，不出意外的话，这些代码也是从上往下按顺序执行的。也就是说，下面的代码要等待上面的代码执行结束再开始执行，这就是**同步（Sync）**。  
但是在某些情况下，当上面的代码开始运行后，不过它有没有执行结束，我们都想让下面的代码先开始运行，尤其是一些耗时操作（查询数据库，定时任务等）。  
对于这部分运行后放一边让它们自己跑，不影响下面代码执行的代码，我们就称之为**异步（Async）**。

常见异步场景：

1. 定时任务：setTimeout，setInterval
2. 网络请求：前端向后端请求API，图片加载等
3. 事件监听

### 回调

有些时候，我们将一些耗时的代码称为**生产者代码（producing code）**，这些代码通常**异步执行**。而往往有另外一部分代码需要使用生产者代码的产物，我们将这些代码称为**消费者代码（consuming code）**。  
既然消费者代码要用到生产者代码的结果产物，那么就要等到生产者结束后再执行。而生产者代码是异步的，我们不知道异步代码的执行时间，所以不可能显式设置消费者代码的等待时间。**回调（Callback）**则是处理这种情况的方法之一。

我们先举个栗子🌰，用`setTimeout()`表示异步的耗时操作。这是为了举例而举例，没有什么业务逻辑所以看着会比较牵强。

```js
let temp = 0;
function asyncMethod(answer) {
    setTimeout(() => temp = answer, 1000);	//延迟1000毫秒
}
function tempShouldBeOne() {
    if (temp === 1) {
        console.log("yeah, temp = 1");
    } else {
        console.log("no, temp != 1");
    }
}

asyncMethod(1);	//L1 生产者代码
console.log("temp is : " + temp);	//L2	
tempShouldBeOne();	//L3 消费者代码
//输出结果：
//temp is : 0
//no, temp != 1
```

这个例子就比较经典，说白了就说执行`L3`的时候`L1`还没执行完，所以`temp`仍然为0，消费者代码就没有按我们想法顺利执行。



```js
let temp = 0;
function asyncMethod(answer, callbackMethod) {
    setTimeout(() => {
        temp = answer;
        callbackMethod();
    }, 1000);
}
function tempShouldBeOne() {
    if (temp === 1) {
        console.log("yeah, temp = 1");
    } else {
        console.log("no, temp != 1");
    }
}

asyncMethod(1, tempShouldBeOne);	//L1
console.log("temp is : " + temp);	//L2
//输出结果：
//temp is : 0
//yeah, temp = 1
```

可以看到，我们将生产者代码作为回调函数传给消费者代码，并在对`temp`操作结束后调用生产者代码。  
这里要注意一点，代码的异步指的是它和其他代码的关系，但是其内部仍然是同步。举个栗子🌰，数据库的操作和其他代码是异步的，因为进行数据库操作的时候（比如登录注册的时候）其他代码仍正常运行（比如一些动画效果、轮播图照常滚动等）。但是数据库操作的内部仍是同步执行的，比如先搜索数据库（发现没有这个用户），再更新数据库（新建这个用户）。这也是为什么我们只用简单地把`callbackMethod()`放在`temp = answer`下面就可以同步执行了。  
再额外提一点，由于`L1`是异步代码，需要耗时。因此先执行完的是`L2`，所以输出也是先输出`L2`的结果，再输出`L1`的结果。

如果我们老板提出一个非人的要求，想先让`temp=1`，再让`temp=-1`，那该怎么办？  
没事，我们可以进行回调的嵌套，从而以同步的方式实现这个坑爹的需求  
这里我们去掉了`tempShouldBeOne()`，而改用箭头函数：

```js
let temp = 0;
function asyncMethod(answer, callbackMethod) {
    setTimeout(() => {
        temp = answer;
        callbackMethod();
    }, 1000);
}

asyncMethod(1, () => {
    if (temp === 1) {	//第一次，让temp = 1
        console.log("yeah, temp = 1");
    } else {
        console.log("no, temp != 1");
    }
    asyncMethod(-1, () => {	//第二次，让temp = -1
        if (temp === -1) {
            console.log("yeah again, temp = -1");
        } else {
            console.log("no again, temp != -1");
        }
    }); 
});
console.log("temp is : " + temp);
//输出结果：
//temp is : 0
//yeah, temp = 1
//yeah again, temp = -1
```

回调的嵌套看起来功能强大，事实上确是一种负担。相信很多小朋友看这一块代码得看好久，这也是回调的缺点之一，我们阅读代码的时候需要在各个方法间跳来跳去，非常不利于阅读和理解代码。  
别说你们看了，我写的时候都绕晕了。

### Promise

人们厌倦了无止尽的回调和嵌套，于是诞生了**Promise**，它就像是个中间商，像个订阅系统。我们在其中执行生产者代码，并在操作结束后发出通知，进而让消费者代码执行（有Android基础的同学可以将其类比成Handler）。    
其基本结果如下：

```js
let promise = new Promise(function(resolve, reject) {
  // executor（生产者代码，耗时异步操作）
  if (finished) {	//如果工作完成，调用resolve()，通知外界任务完成
    resolve("job done.");	
  } else {	//如果工作出错，调用reject()，通知外界执行失败
    reject(new Error("something wrong!"));
  }
});
```

我们将**Promise**看作一个容器，其作为参数的这个函数称为**Executor**，**Executor**的两个参数`resolve`和`reject`是`Promise`自身提供的回调，不需要我们自己写。  
我们要做的就是直接在Executor中编写我们的耗时异步操作，并在操作结束的时候调用`resolve()`或在出错的时候调用`reject()`（可以不用`if-else`，上面我就是举个栗子把他俩放一起）。  
**Promise**对象有两个属性，即`state`和`result`。当一个Promise被new出来后，这两个属性分别为`state : "pending"`，`result : "undefined"`，通过调用不同的方法，会有不同的变化：

- 调用`resolve(value)`：`state : "fulfilled"`，`result : value`
- 调用`reject(error)`：`state : "rejected"`，`result : error`

这也是为啥我在`resolve()`中可以直接传字符串，而在`reject()`中却要new一个Error。（顺便提一句，为了和`"pending"`对应，`"fulfilled"`和`"rejected"`统称为`"settled"`）

#### then和catch

上面我们只是用Promise执行异步代码并通知了外界，那么要怎样继续执行消费者代码呢？  
于是就有了`.then`，它紧跟在Promise对象后面，并接受两个函数作为参数，分别对应`resolve`和`reject`之后执行的消费者代码。

```js
promise.then(
  function(result) { /* promise执行成功后（resolve） */ },
  function(error) { /* promise执行失败后（reject） */ }
);
```

照样来举个栗子🌰：

```js
let temp = 0;
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        temp = 1;
        if(temp === 1) {
            resolve("temp is 1");
        } else {
            reject(new Error("temp is not 1"));
        }
    }, 1000);
});

promise.then(
    result => console.log(result),	//执行这个
    error => console.log(error)		//不执行这个
    );
//输出：temp is 1
```

当然，如果我们只对成功的结果感兴趣，失败了什么都不用做的话，也可以只为`then`提供一个函数参数。

```js
let temp = 0;
let promise = new Promise((resolve) => {
    setTimeout(() => {
        temp = 1;
        resolve("temp is 1");
    }, 1000);
});

promise.then(
    result => console.log(result)
    );
//输出：temp is 1
```

同理，如果我们只想出错的时候进行操作，成功啥也不做的话，可以用`then(null, error => {})`的形式。而这还有种简写的形式：`catch(error => {})` 

```js
let temp = 0;
let promise = new Promise((resolve, reject) => {    
    setTimeout(() => {
        temp = 2;   //出错啦
        if(temp === 1) {
            resolve("temp is 1"); //这个和参数中的resolve也可以删掉
        } else {
            reject(new Error("temp is not 1"));
        }

    }, 1000);
});

promise.then(
    null,
    error => console.log(error)
    );
//等同于
promise.catch((error) => {
    console.log(error);
});
//输出：Error: temp is not 1
```

说白了，Promise就是`resolve`和`reject`二选一执行一条，并在`then`中根据这两种方法到底执行了哪一种进行进一步操作。

#### finally

就像常规 `try {} catch {} finally {}` 一样，promise 中也有 `finally`。  
其逻辑类似于 `then(f, f)`（不管`resolve`还是`reject`都会执行），不过更多是写在`then`之后，进行一些清理、重置、资源释放等操作。

```js
let temp = 0;
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        temp = 1;
        if(temp === 1) {
            resolve("temp is 1");
        } else {
            reject(new Error("temp is not 1"));
        }
    }, 1000);
});

promise.then(
    result => console.log(result),
    error => console.log(error)	
    ).finally(()=>{
        temp = 0;
        console.log("reset temp: " + temp)
    });
//输出：
//temp is 1
//reset temp: 0
```

不过奇妙的是`finally`甚至可以写在`then`之前。由于它不接受`resolve`或`reject`的结果，所以会将其保留，并向下传递。（用的比较少就是了）

```js
let temp = 0;
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        temp = 1;
        if(temp === 1) {
            resolve("temp is 1");
        } else {
            reject(new Error("temp is not 1"));
        }
    }, 1000);
});

promise.finally(() => {
    console.log("I am finally");
}).then((result) => {
    console.log(result);
}, (error) => {
    console.log(error);
})
//输出：
//I am finally
//temp is 1
```

要记住，我们执行`finally`的时候，**promise**中的内容已经结束了，也就是说`resolve`和`reject`已经执行了，只不过其结果被`finally`保留并向下传递。  
因此，如果我们在`finally`中改变条件，并不会影响到`resolve`和`reject`的调用。  

```js
promise.finally(() => {
    console.log("I am finally");
    tmep = 2;	//改变了temp，但执行的仍是resolve
}).then((result) => {
    console.log(result);
}, (error) => {
    console.log(error);
})
//输出不变：
//I am finally
//temp is 1
```

#### 链式调用

理论上，我们可以通过多个`then`来进行链式的调用，每个`then`的返回值都是下一个`then`的`value`值。

```js
let temp = 0;
let promise = new Promise((resolve) => {
    setTimeout(() => {
        temp = 1;
        if(temp === 1) {
            resolve("temp is 1");
        }
    }, 1000);
});

promise.then((result) => {
    console.log(result);
    return result + "; in first then";
}).then((result) => {
    console.log(result);
    return result + "; in second then";
}).then((result) => {
    console.log(result);
    return result + " in third then";
}).finally(() => {
    console.log("finally end");
});
//输出：
//temp is 1
//temp is 1; in first then
//temp is 1; in first then; in second then
//finally end
```

### async / await

`async/await` 的出现让我们更加舒适地使用**Promise** ，它也非常易于理解和使用。 

#### async

`async`关键字用于函数之前，它表示这个函数总是返回一个**Promise**，并将函数本身的返回值用**Promise**的`resolve`包裹。

```js
async function countRabbit() {
    return '1 rabbit';
};
//等效于：
function countRabbit() {
    return new Promise((resolve) => {
        resolve('1 rabbit');
    });
};
//都可以通过如下方式调用：
countRabbit().then((result) => {
    console.log(result);
})
//输出：1 rabbit
```

#### await

`await`关键字用在被`async`声明的代码块之中，`await`修饰的代码会等待**Promise**完成（变成`settled`状态）后再执行。

```js
async function countRabbit() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('counting rabbits...')
            resolve(5);
        }, 1000);
    });
    let result = await promise; //在这里阻塞，直到promise执行完	
    console.log('we have ' + result + ' rabbits');
};

countRabbit();
//输出：
//counting rabbits...
//we have 5 rabbits
```

`await` 实际上会暂停函数的执行，直到 `promise` 状态变为 `settled`。但是得益于JS引擎（可以同时处理其他任务），这并不会耗费任何 CPU 资源。  
`await`的出现允许我们以更优雅的方式获取**Promise**的结果并进行后续操作，避免了所有**Promise**之后都要跟上`then`的硬伤。  

#### Error处理

之前提到，我们的`async`是用`resolve`将函数的结果包裹，但是如果出现错误，我们可以在`async`函数后面添加`catch`

```js
async function countRabbit() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('counting rabbits...')
            reject(new Error('I forget the number'));
        }, 1000);
    });
    let result = await promise; //并不会执行因为promise中抛出了错误
    console.log('we have ' + result + ' rabbits');
};

countRabbit().catch((err) => {
    console.log(err);
});
//输出：
//Error: I forget the number
```

当然，如果我们考虑地更全面，想在函数中处理错误，可以直接在函数中用`try-catch`语句块：

```js
async function countRabbit() {
    try {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('counting rabbits...')
                reject(new Error('I forget the number'));
            }, 1000);
        });
        let result = await promise; //并不会执行因为promise中抛出了错误
        console.log('we have ' + result + ' rabbits');
    } catch (err) {
        console.log(err);
    }
};

countRabbit();
//输出：
//Error: I forget the number
```

## 网络请求

### URL

其实很多情况下，我们请求的URL都可以用字符串表示，但是**URL**对象还是提供了很多有用的方法的。

#### URL对象

```js
new URL(url, [base])
```

参数url就是我们请求的URL，不过当我们规定了可选参数base之后，可以只在url传入路径，URL对象会根据base和路径自动生成url去请求。

```js
//访问：https://blackdn.github.io/
let url1 = new URL('https://blackdn.github.io/');
//访问：https://blackdn.github.io/about
let url2 = new URL('/about', 'https://blackdn.github.io/');
```

此外，**URL**会自动帮我们解析url，因此我们可以直接访问其某个部分：

```js
let url = new URL('https://blackdn.github.io/about');
alert(url.protocol); // https:
alert(url.host);     // blackdn.github.io
alert(url.pathname); // /about
```

#### 编码

[RFC3986标准](https://tools.ietf.org/html/rfc3986) 定义了 URL 中允许或不允许的字符，而那些不被允许的字符必须被编码（非拉丁字母和空格，比如中文）。  
将其变为 UTF-8 代码，前缀为 `%`，例如 `%20`（由于历史原因，空格可以用 `+` 编码，但这是一个例外）  
不过**URL**会自动帮我们编码，我们不需要自己手动编码再传入

```js
let url = new URL('https://blackdn.github.io/你好');
console.log(url.href);
//输出：https://blackdn.github.io/%E4%BD%A0%E5%A5%BD
```

### XMLHttpRequest

`XMLHttpRequest`一开始只是微软浏览器提供的一个接口，后来各浏览器纷纷效仿提供了这个接口，于是W3C对它进行了标准化，提出了[XMLHttpRequest标准](https://www.w3.org/TR/XMLHttpRequest/)。  
简单来说它是一个浏览器对象，允许**使用 JavaScript 发送 HTTP 请求**，并从返回结果中获取信息。  
不过，如今有更为现代的方法 `fetch`，它的出现使得 `XMLHttpRequest` 在某种程度上被弃用。  
不过不少情况下，我们仍在使用`XMLHttpRequest`，包括但不限于：

1. 历史原因：之前的代码使用了 `XMLHttpRequest` 的脚本
2. 兼容旧浏览器
3. 实现 `fetch` 目前无法做到的事情，如跟踪上传进度

**XMLHttpRequest** 有两种执行模式：**同步（synchronous）**和**异步（asynchronous）**

#### 异步请求

异步操作可以分为三步：创建对象，初始化，发送请求。  
创建`XMLHttpRequest`对象非常简单：

```js
let xhr = new XMLHttpRequest();	//创建对象
```

此时`XMLHttpRequest`的构造器没有参数，所以我们要用`open()`方法对其进行初始化  

```js
xhr.open(method, URL, [async, user, password]);	//初始化操作
```

其参数如下（`[]`表示参数可选）：

- `method`：表示请求所采用的方法（GET、POST之类的）
- `URL`：请求的URL，可以为字符串，也可以为URL对象
- `async`：可以为`true`或`false`。默认为`true`，表示为异步请求
- `user`、`password`：身份验证所需的账户和密码

注意`open()`仅配置请求信息，不会建立连接，不要被它的名字误导了  最后我们通过`send()`来发送请求

```js
xhr.send([body]);	//发送请求
```

调用了`send()`之后，会建立连接并发送请求到服务器，而参数`body`则表示请求的`request body`。

这之后我们可以监听改对象以获取响应，存在三种状态：

- `load`：表示请求完成，且响应结果已成功下载
- `error`：表示无法发出请求或无效URL等错误
- `progress`：表示正在下载响应的结果

```js
xhr.onload = function() {	//当接收到响应后，将调用此函数
  console.log(`Loaded: ${xhr.status} ${xhr.response}`);
};

xhr.onerror = function() { // 仅在根本无法发出请求时触发
  console.log(`Network Error`);
};

xhr.onprogress = function(event) { // 定期触发
  // event.loaded —— 已经下载了多少字节
  // event.lengthComputable = true，则表示服务器发送了 Content-Length header
  // event.total —— 总字节数（如果 lengthComputable 为 true）
  console.log(`Received ${event.loaded} of ${event.total}`);
};
```

可以看到，我们的响应结果也会交给`XMLHttpRequest`对象，其中包含很多属性，比如`xhr.status`表示响应的状态码，`xhr.statusText`表示状态码对应的消息（`200` 对应 `OK`，`404`对应`Not Found`），`xhr.response`则表示服务器的`response body`    
此外，我们还可以指定超时时间`timeout`，当超出这个时间请求仍没有成功执行，则会取消请求并触发`timeout`事件

```js
xhr.timeout = 10000; // timeout 单位是 ms，所以此处为 10 秒
```

#### 同步请求

上面提到了，在 `open` 方法中将参数 `async` 设为 `false`，那么发送同步请求。

```js
let xhr = new XMLHttpRequest();
xhr.open('GET', '/article/xmlhttprequest/hello.txt', false);

try {
  xhr.send();
  if (xhr.status != 200) {
    alert(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    alert(xhr.response);
  }
} catch(err) { // 代替 onerror
  alert("Request failed");
}
```

虽然同步的操作看起来更简单，但是还是应该尽量少用同步请求，他们会阻塞页面内的其他JS操作，直到请求结束。如果请求时间过长，甚至会导致页面无法滚动、页面未响应等错误。

#### 其他

##### HTTP-header

`XMLHttpRequest` 允许发送自定义的 `header`，并且可以从响应中读取 `header`。

可以通过`setRequestHeader(name, value)`设置给定的`name`和`value`

```js
xhr.setRequestHeader('Content-Type', 'application/json');
```

##### 响应格式和状态码

通过设置`xhr.responseType`可以决定响应格式：

| 可用参数         | 对应格式                    |
| ---------------- | --------------------------- |
| `""`（默认参数） | 字符串                      |
| `"text"`         | 字符串                      |
| `"arraybuffer"`  | 二进制数据格式`ArrayBuffer` |
| `"blob"`         | 二进制数据格式`Blob`        |
| `"document"`     | XML document                |
| `"json"`         | JSON（自动解析）            |

##### readyState

`XMLHttpRequest` 的状态（state）会随着处理进度的变化而变化，我们可以通过`xhr.readyState` 来了解当前状态。所有的状态及其对应值如下：

```js
UNSENT = 0; // 初始状态
OPENED = 1; // open 被调用
HEADERS_RECEIVED = 2; // 接收到 response header
LOADING = 3; // 响应正在被加载（接收到一个数据包）
DONE = 4; // 请求完成
```

`XMLHttpRequest` 对象以 `0` → `1` → `2` → `3` → … → `3` → `4` 的顺序在它们之间转变。每当通过网络接收到一个数据包，就会重复一次状态 `3`。  
因此可以用`readystatechange`来进行监听跟踪：

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // 加载中
  }
  if (xhr.readyState == 4) {
    // 请求完成
  }
};
```

以前还没有`load/error/progress`等事件处理机制，因此人们会用`readystatechange`，不过如今它已经被前者取代了。

##### 构建Post的FormData

如果我们使用的是**POST**请求，我们可以用`FormData`对象来保存相关的信息  然后我们可以在`send()`方法中将`FormData`发送到服务器

```js
let formData = new FormData([form]); // 创建一个FormData对象
formData.append(name, value); // 附加一个字段
//···
xhr.open('POST', ...); //使用 POST 方法。
xhr.send(formData); //发送请求
```

举个例子，发送请求时，我们可以先用页面的`<form>`元素填充`FormData`对象，如果和还有啥缺的，可以再用`append()`方法填充

```html
<form name="person">
    <input name="first-name" value="John">
    <input name="last-name" value="Smith">
</form>

<script>
    let formData = new FormData(document.forms.person);	  // 从表单预填充 FormData
    formData.append("middle", "Lee");	  // 附加一个字段
    let xhr = new XMLHttpRequest();	  // 将其发送出去
    xhr.open("POST", "/article/xmlhttprequest/post/user");
    xhr.send(formData);
    xhr.onload = () => alert(xhr.response);
</script>
```

上面的例子是用`multipart/form-data`编码，如果我们想要用JSON，也可以先用`JSON.stringify()`构建JSON对象，然后直接作为send方法的参数发送。不过要在`header` 里声明以下式JSON类型

```js
let xhr = new XMLHttpRequest();
let json = JSON.stringify({
    name: "John",
    surname: "Smith"
});

xhr.open("POST", '/submit')
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
xhr.send(json);
```

##### 追踪上传进度

之前提到，在下载阶段的状态是`progress`。但是于POST来说，`XMLHttpRequest`会先上传数据（request body），然后再下载响应。  
因此，`xhr.onprogress`就不能跟踪上传进度，我们要转而使用`xhr.upload`。它也存在许多状态供我们监听：

- `loadstart` —— 上传开始。
- `progress` —— 上传期间定期触发。
- `abort` —— 上传中止。
- `error` —— 非 HTTP 错误。
- `load` —— 上传成功完成。
- `timeout` —— 上传超时（如果设置了 `timeout` 属性）。
- `loadend` —— 上传完成，可能成功也可能是 `error`。

举几个监听的例子：

```js
xhr.upload.onprogress = function(event) {
  alert(`Uploaded ${event.loaded} of ${event.total} bytes`);
};
xhr.upload.onload = function() {
  alert(`Upload finished successfully.`);
};
xhr.upload.onerror = function() {
  alert(`Error during the upload: ${xhr.status}`);
};
```



### Fetch API

**Fetch API**提供了一系列接口用于网络请求并获取资源（包括跨域请求），其内部是基于**Promise**实现的。之前也提到，比起**XMLHttpRequest**，人们更喜欢用**Fetch**。  
它提供了一个全局方法`fetch()` ，这个异步方法简单好用，接受一个必须参数——资源的路径`url`和一个可选参数`options`，其包括很多可选内容，如`method`、`header`等，具体可见：[Fetch API](https://zh.javascript.info/fetch-api)。  

```js
let promise = fetch(url, [options])
```

当然，如果不加`options`，那它就是一个简单的**GET**请求。  
无论请求成功与否，`fetch()`都返回一个**Promise**对象`resolve`对应的`Response`；不过遇到网络错误，则会被`reject`，并返回`TypeError`

**Fetch**发送请求后，通常分为**两个阶段**来获取响应（Response）。  
第一个阶段，我们接受服务器发送来的**响应头（response header）**，这时还没有**响应体（response body）**。但是我们可以通过检查响应头，来检查 HTTP 状态以确定请求是否成功。  
**Response**的`status`属性代表HTTP状态码，如200成功连接，404 Not Found；`ok`属性是个布尔值，如果`status`状态码在`200～299`则为`true`

```js
async function tryFetch() {
  //访问我本地的服务器
  let response = await fetch("http://localhost:1234/");
  if (response.ok) { // 如果 HTTP 状态码为 200-299
    console.log('ok')
  } else {
    console.log("HTTP-Error: " + response.status);
  }
};

tryFetch();
//输出：ok
```

第二阶段，自然是获取**response body**。不过**Response** 提供了多种基于 promise 的方法，来以不同的格式访问response body，这就需要我们自己选择调用了。

- **`response.text()`**：读取 response，并以文本形式返回 response
- **`response.json()`**：将 response 解析为 JSON 格式，
- **`response.formData()`**：以 `FormData` 的形式返回 response，
- **`response.blob()`**：以 Blob形式（具有类型的二进制数据）返回 response，
- **`response.arrayBuffer()`**：以 ArrayBuffer形式（低级别的二进制数据）返回 response，
- 另外，`response.body` 是 [ReadableStream](https://streams.spec.whatwg.org/#rs-class) 对象，它允许你逐块读取 body，我们稍后会用一个例子解释它。

比如在上面的栗子中，我如果输出`response.text()`，那么返回的就是整个html文档的内容：

```js
async function tryFetch() {
  //访问我本地的服务器
  let response = await fetch("http://localhost:1234/");
  if (response.ok) { // 如果 HTTP 状态码为 200-299
    let text = await response.text();
    console.log(text);
  } else {
    console.log("HTTP-Error: " + response.status);
  }
};

tryFetch();
//输出：
//<!DOCTYPE html>
//<html lang="en">
//  <head>
//    <meta charset="UTF-8">
//·······
```

由于**Fetch**内部是基于**Promise**的，所以也可以直接用`then-catch`的语句来进行进一步的操作，比如：

```js
async function myFetch(url) {
  let response = await fetch(url);
  return response.json();
};
//等效于
function myFetch(url) {
  return fetch(url).then((response) => response.json());
};
```

#### 响应头 Response header

众所周知，根据HTTP协议的报文格式，响应头中有包含了很多信息。他们就保存在Response的 `response.headers` 中，是一个类似于 `Map` 的 **header** 对象。  
它不是真正的 Map，但是它具有类似的方法，因此我们可以迭代全部的header或者只获取其中一个。

```javascript
async function tryFetch() {
  let response = await fetch("http://localhost:1234/");

  // 迭代所有 header
  for (let [key, value] of response.headers) {
    console.log(`${key} = ${value}`);
  }
  //获取一个header
  console.log(response.headers.get('Content-Type'));
};

tryFetch();
//迭代输出：
//accept-ranges = bytes
//access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept, Content-Type
//access-control-allow-methods = GET, HEAD, PUT, PATCH, POST, DELETE
//access-control-allow-origin = *
//content-disposition = inline; filename="index.html"
//content-length = 417
//content-type = text/html; charset=utf-8
//date = Wed, 07 Sep 2022 12:57:57 GMT
//last-modified = Wed, 07 Sep 2022 11:52:11 GMT
//输出一个：
//text/html; charset=utf-8
```

#### 请求头 Request header

众所周知，根据HTTP协议的报文格式，请求头中有包含了很多信息...  
总之请求头中的一些信息我们是可以自定义的：

```js
let response = fetch("http://localhost:1234/", {
  headers: {
    Authentication: 'secret'
  }
});
```

但是还有一些header是由浏览器控制，而我们无法修改的，这也是为了保证HTTP的正确性和安全性，如`Content-Length`、`Cookie/Cookie2`、`Date`等。详见： [forbidden HTTP headers](https://fetch.spec.whatwg.org/#forbidden-header-name)

#### POST请求

之前我们的fetch()方法中只有一个url参数，在缺省情况下这就是简单的GET请求。而要创建一个 `POST` 请求（或其他方法的请求），我们需要添加额外的参数：

- **`method`**：HTTP 方法，例如 `POST`，
- `body`：request body。可为字符串（例如 JSON 编码），`FormData` （以 `multipart/form-data` 形式发送数据），`Blob`/`BufferSource` （发送二进制数据），`URLSearchParams`（以 `x-www-form-urlencoded` 编码形式发送数据，很少使用）

那还是JSON比较常用嗷

```js
async function postFetch() {
  let user = {
    name: "morpheus",
    job: "leader"
  };
  let response = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  });

  let result = await response.json();
  console.log(result);
}

postFetch();
//输出返回值：
//{
//    "name": "morpheus",
//    "job": "zion resident",
//    "updatedAt": "2022-09-08T14:40:39.455Z"
//}
```

这里请求的是[REQRES](https://reqres.in/)的接口，返回值也符合预期。

这里要注意的是，如果请求的 `body` 是字符串，则 `Content-Type` 默认为`text/plain;charset=UTF-8`（这和我们调用`response.text`返回的内容一致）  
但是当我们发送 JSON 时，我们需要将其修改为 `application/json`，这样才表示我们的`body`格式是 JSON。

#### FormData

之前在**XMLHttpRequest**中我们也使用了`FormData`快速构建数据，这在**Fetch**中也是可以用的。  
我们可以通过`let formData = new FormData([form])`来获得一个`FormData`对象

```html
<form id="myForm">
  <input type="text" name="name" value="morpheus">
  <input type="text" name="job" value="leader">
  <input type="submit">
</form>

<script>
  myForm.onsubmit = async (e) => {
    e.preventDefault();
    let myFormData = new FormData(myForm);//使用formdata
    for (const [key, value] of myFormData) {
      console.log(`key: ${key}, value: ${value}`)
    }
    //输出：
    //key: name, value: morpheus
		//key: job, value: leader

    let response = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      body: myFormData,
    });

    let result = await response.json();
    console.log(result);
    //输出：{id: '17', createdAt: '2022-09-08T15:24:15.502Z'}
  };
</script>
```

这里最后的输出有点不一样是因为实际上这并不是我们期望返回的响应内容。因为**REQRES**接收的请求要是JSON，但是我们这里传的是**FormData**。我们知道用JSON请求时，`Content-Type`应该是 `application/json`。但是FormData自带 `multipart/form-data`的`Content-Type`。所以我们不是JSON，所以返回值有所不同。  
似乎**FormData**自己没有直接转为JSON对象的方法，所以需要我们自己写。我才不写呢。

我们可以使用以下方法修改 `FormData` 中的字段：

- `formData.append(name, value)`：添加具有给定 `name` 和 `value` 的表单字段，当`name`重复时继续创建。
- `formData.append(name, blob, fileName)`：添加一个字段（来发送文件），等效于 `<input type="file">`；第三个参数 `fileName` 则用来设置文件名。当`name`重复时继续创建。
- `formData.set(name, value)`：添加具有给定 `name` 和 `value` 的表单字段，当`name`重复时删除其他字段，保留自己。
- `formData.set(name, blob, fileName)`：添加一个字段（来发送文件），当`name`重复时删除其他字段，保留自己。
- `formData.delete(name)`：移除带有给定 `name` 的字段
- `formData.get(name)`：获取带有给定 `name` 的字段值
- `formData.has(name)`：如果存在带有给定 `name` 的字段，则返回 `true`，否则返回 `false`

我们也可以使用 `for-of` 循环来迭代遍历`formData`字段：

```js
let formData = new FormData();
formData.append('name', 'blackdn');
formData.append('sex', 'male');

for(let [key, value] of formData) {
  console.log(`${key} = ${value}`);
}
//输出：
//name = blackdn
//sex = male
```

#### 用AbortController中止请求

因为很多异步方法都没有中止的指令，包括**Promise**，更别说基于Promise的**Fetch**了。所以我们就用**AbortController**来完成中止的任务。

`let controller = new AbortController()`

**AbortController对象**（以下简称**Controller**）有一个`abort()`方法和`signal`属性。我们需要在`signal`上设置监听器，当`abort()`方法被调用之后，会停止异步方法并调用`signal`的监听方法，最后将`signal.aborted`属性设为`true`。

```js
let controller = new AbortController();
//第一个参数的'abort'表示controller的abort()触发后调用该方法
controller.signal.addEventListener('abort', () => {
  console.log('it aborted!');
});
controller.abort();
console.log('aborted: ' + controller.signal.aborted);
//输出：
//it aborted!
//aborted: true
```

如果想用**Controller**取消**Fetch**，需要讲signal作为参数传递给`fetch()`。**Fetch**会自己监听`signal`，所以我们只要在需要的地方调用`controller.abort()`即可

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
```

当然，**Fetch**被中止后，它的**Promise**会被`reject`并返回一个`AbortError`，我们可以用`try-catch`进行处理

```js
let controller = new AbortController();
controller.signal.addEventListener('abort', () => {
  console.log('it aborted!')
});

myForm.onsubmit = async (e) => {
  e.preventDefault();
  let myFormData = new FormData(myForm);
  controller.abort();//中止
  try {
    let response = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      body: myFormData,
      signal: controller.signal //绑定signal
    });      
  } catch (err) {
    console.log(err.name);
  }
  let result = await response.json();
  console.log(result);
};
//输出：
//it aborted!（监听器输出）
//AbortError（catch输出）
```

## 一些示例

### XMLHttpRequest的异步GET请求

我们用[REQRES](https://reqres.in/)的接口进行一个异步的`GET`请求。  
这里用了**回调**的方法来进行请求成功或失败的后续操作：

```js
function successCallback(xhr) {
    console.log('request success: ' + xhr.responseText);
}
function errorCallback(error) {
    console.log('error: ' + error.message);
}

function requestByXHR(url, successCallback, errorCallback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        successCallback(xhr);
    }
    xhr.onerror = () => {
        errorCallback(new Error(xhr.statusText));
    }
    xhr.open('get', url, true);
    xhr.send();
}

const URL = 'https://reqres.in/api/users/2';
requestByXHR(URL, successCallback, errorCallback);
```

返回内容也符合预期：

```json
{
    "data": {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
    },
    "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
    }
}
```

### Promise的异步GET请求

和**XMLHttpRequest**用的是同一个`GET`请求接口  
因为Promise只是用来提供异步方法，其本身并没有进行网络连接的方法，因此在其内部我们还是用到了**XMLHttpRequest**   
不过好处在于我们不再需要使用回调进行后续操作，而可以使用**Promise**自己的`resolve`和`reject`了。

```js
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.responseText);
        };
        xhr.onerror = () => {
            reject(new Error(xhr.statusText));
        };
        xhr.open('GET', url, true);
        xhr.send();
    });
}
```

返回内容也一样：

```json
{
    "data": {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
    },
    "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
    }
}
```

### Fetch的异步GET请求

**Fetch**感觉上就是升级版的**Promise**，可以进行网络请求，语法什么的都差不多

```js
function requestByFetch(url) {
    return fetch(url).then((response) => response.json());
}

const URL = 'https://reqres.in/api/users/2';
requestByFetch(URL).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});
```

因为访问的接口都是一样的，所以返回值也一样，这里就不写了。  
最后我们不用`then-catch`，而用`async-await`来实现：

```js
async function requestByFetch(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const URL = 'https://reqres.in/api/users/2';
requestByFetch(URL);
```

结果是一样的嗷

## 参考

1. [Asynchronous Vs Synchronous Programming](https://www.youtube.com/watch?v=Kpn2ajSa92c&t=63s)
2. [Promise](https://zh.javascript.info/promise-basics)，[MDN：Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
3. [MDN：FetchAPI](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)，[Fetch](https://zh.javascript.info/fetch)，[Fetch API](https://zh.javascript.info/fetch-api)
4. [forbidden HTTP headers](https://fetch.spec.whatwg.org/#forbidden-header-name)，[Referrer Policy 规范](https://w3c.github.io/webappsec-referrer-policy/)
5. [URL对象](https://zh.javascript.info/url)，[RFC3986标准](https://tools.ietf.org/html/rfc3986) 
6. [XMLHttpRequest](https://zh.javascript.info/xmlhttprequest)
7. [Sending JavaScript Http Requests with XMLHttpRequest](https://www.youtube.com/watch?v=4K33w-0-p2c&t=407s)
8. [Axios中文文档](https://www.axios-http.cn/)，[Sending JavaScript Http Requests with Axios](https://www.youtube.com/watch?v=qM4G1Ai2ZpE)
9. [REQRES](https://reqres.in/)

