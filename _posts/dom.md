## 前言

## DOM简介

其实之前在写关于XSS的文章的时候有个 [基于DOM的XSS（Dom-based XSS）](https://blackdn.github.io/2021/04/21/XSS-2021/#基于dom的xssdom-based-xss)里简单提到了DOM，这里就再说一下。  
**DOM(Document Object Model)**，文档对象模型，`HTML`和`XML`文档的编程接口，提供对文档的结构化描述。  
简单来说，DOM将文档解析成节点和对象，这些对象又有很多属性和方法，这就允许我们用代码（脚本语言或程序）对页面（`HTML`和`XML`）进行操作。  
不然如果我们想动态改变页面，只能傻乎乎地在HTML页面以字符串的形式加入代码，那岂不是显得很呆。  
比如我们可以通过DOM返回所有`<p>`元素列表：

```js
paragraphs = document.getElementsByTagName("P");
alert(paragraphs[0].nodeName);
```

### DOM对象

DOM主要有以下几个对象，用来表示HTML页面中的不同内容：

| 对象           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| `document`     | 代表整个页面，详见[MDN：Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) |
| `element`      | 代表一个节点（元素）                                         |
| `nodeList`     | 代表一个元素的数组，可以用`list.item(1)`或`list[1]`访问其条目 |
| `attribute`    | 代表一个属性                                                 |
| `namedNodeMap` | 代表通过`name`或`index`访问的键值对元素（`Map`的数据类型）   |

## 用DOM和JavaScript修改页面

之前提到了，DOM作为一个接口，常和一些脚本语言结合使用，而最常用的自然是**JavaScript**了（当然`python`等其他语言也可以）。  
HTML文档中的每一个元素，包括整个文档、文档头部（header）、表格等都属于DOM的一部分，因此JavaScript都可以对其进行访问和操作。  

### 给页面添加元素

假设有一个空网页，我们可以用以下代码创建一个`<div>`元素，并让其具有文本`"hello world"`：

```js
const body = document.body;		//获取body
const div = document.createElement("div");	//创建div
div.innerText = "hello world";		//为div设置文本
body.append(div);		//将div放入body中
```

不过除了`div.innerText`，`div.textContent`同样可以修改其文本。两者区别在于，`innerText`获取的是这个`div`内全部的文本，而`textContent`获取的则是可见的文本  
举个例子：

```HTML
<div>
  <span>hello</span>
  <span style="display: none;">world</span>
</div>
```

我们得到的`innerText`内容为`"hello"`和`"world"`，因为这两个文本都在`div`中；而`textContent`的内仅为`"hello"`。因为`"world"`的`display`为`none`，所以在页面中不显示。

### 获取元素

上面这个例子是给页面添加元素的，我们用`createElement()`创建了新的元素。但是如果元素是页面已有的，我们要怎么获取呢？  
第一个方法是用`querySelector()`进行获取。比如获取上面例子中的`<div>`：

```js
const div = document.querySelector("div");
```

`querySelector()`还可以返回`class`和`id`  
假设我们的`<div>`里的两个`<span>`分别有`id`和`class`：

```html
    <div>
        <span id="span-id">Span With Id</span>
        <span class="span-class">Span With Class</span>
    </div>
```

`querySelector()`获取`id`的时候前面要加个`#`，而获取`class`的时候就加个`.`

```js
const spanWithId = document.querySelector("#span-id");
const spanWithClass = document.querySelector(".span-class")
```



#### 获取元素*



### 从页面删除元素

拿到了元素后，我们可以将其删除。
一种方法是用元素本身的`remove()`方法删除

```js
const spanWithId = document.querySelector("#span-id")
spanWithId.remove();
//题外话：当然还可以用append()加回来
div.append(spanWithId);
```

另一种方法是用父元素的`removeChild()`删除元素

```js
const div = document.querySelector("div");
const spanWithId = document.querySelector("#span-id")
div.removeChild(spanWithId);
```

### 修改元素属性

假设我们的<span>元素又多了一些属性，比如title啥的

```html
    <div>
        <span title="span-title" id="span-id">Span With Id</span>
        <span class="span-class">Span With Class</span>
    </div>
```

我们可以通过`getAttribute()`方法获取对应属性的内容，同时可以用setAttribute来修改内容：

```js
spanWithId.getAttribute("title");		//内容为："span-title"
spanWithId.getAttribute("id");	//内容为："span-id"
spanWithId.setAttribute("title", "new-title");	//title的内容变为："new-title"
```

当然，还可以直接把整个属性删掉：

```js
spanWithId.removeAttribute("title");
```

此外，还可以用点结构来获取/修改属性：

```js
console.log(spanWithId.title);		//输出："span-title"
console.log(spanWithId.id);		//输出："span-id"
spanWithId.title = "new-title";		//title的内容变为："new-title"
```

对于那些已经明确的属性，两种方法都可以用，但是对于那些还不确定的、放在变量里的属性，那么就只能用参数的方式进行获取或修改了。

在实际运用中，我们会给元素设置一个`data`域，而元素的`dataset`属性则会以`键值对`的形式保存data域里的内容。  
比如我们给其中一个`<span>`一个`data-test`属性：

```html
<span class="span-class" data-test="I am data test">Span With Class</span>			
```

以下代码会在控制台输出一个`DOMStringMap`：

```js
const div = document.querySelector("div");
const spanWithClass = document.querySelector(".span-class")
console.log(spanWithClass.dataset);
//输出：
DOMStringMap {
  test: "i am data test"
}
```

同样，我们可以直接从`spanWithClass.dataset.test`获取`"i am data test"`，还可以用点结构来为其设置新的属性

```js
console.log(spanWithClass.dataset.test);
spanWithClass.dataset.newAttr = "I am new attr";
```

不仅如此，更多时候我们会想要修改元素的样式，而DOM便为此提供了style属性  
因此我们能够很轻易地修改元素的字体、颜色、背景等样式

```js
spanWithClass.style.backgroundColor = "red";
spanWithClass.style.color = "white";
```

这里就简单介绍一下，更多内容还是要去看文档嗷，看看有哪些属性哪些方法。

#### 修改ClassList

当元素有一个或多个`class`的时候，`classList`属性能够获取其所有`class`，方便我们添加、修改、删除`class`

```js
const spanWithClass = document.querySelector(".span-class")
spanWithClass.classList.add("new-class");
spanWithClass.classList.remove("span-class");
```

而`classList`还有一个`toogle()`方法，传入一个`class`名作为参数。如果`classList`中存在该`class`，则会将其删除，并返回`false`；如果不存在，则会将其加入，并返回`true`  
`toogle()`的第二个参数表示是否强制执行，为`false`表示一定返回`false`，即无论`class`是否存在都删除（不存在就不操作）；反之为`true`则一定返回`true`，表示无论class是否存在都加入（存在就不进行操作）

```js
spanWithClass.classList.toggle("new-class", true);	//强制给spanWithClass添加"new-class"
```

## DOM常用方法*

- document.getElementById(id)
- document.getElementsByTagName(name)
- document.createElement(name)
- parentNode.appendChild(node)
- element.innerHTML
- element.style.left
- element.setAttribute()
- element.getAttribute()
- element.addEventListener()
- window.content
- window.onload
- window.dump()
- window.scrollTo()

## 参考

1. [MDN：DOM 概述](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)
2. [Learn DOM Manipulation In 18 Minutes](https://www.youtube.com/watch?v=y17RuWkWdn8)
3. [HTML DOM Document 对象](https://www.runoob.com/jsref/dom-obj-document.html)
4. [搜索：getElement，querySelector](https://zh.javascript.info/searching-elements-dom)
