## 浏览器事件

在浏览器中，页面/服务端应当对用户的一些行为产生响应或反馈，而这些行为就称之为**事件（event）**  
比如鼠标点击、键盘响应、提交表单等都属于事件  
DOM的所有节点都可以产生事件，而JS则就可以探测到这些事件，进行进一步操作  

### 常见事件

这里列出一些常见事件，当然不是全部

**鼠标事件：**

- `click` —— 当鼠标点击一个元素时（触摸屏设备会在点击时生成）。
- `contextmenu` —— 当鼠标右键点击一个元素时。
- `mouseover` / `mouseout` —— 当鼠标指针移入/离开一个元素时。
- `mousedown` / `mouseup` —— 当在元素上按下/释放鼠标按钮时。
- `mousemove` —— 当鼠标移动时。

**键盘事件**：

- `keydown` 和 `keyup` —— 当按下和松开一个按键时。

**表单（form）元素事件**：

- `submit` —— 当访问者提交了一个 `<form>` 时。
- `focus` —— 当访问者聚焦于一个元素时，例如聚焦于一个 `<input>`。

**Document 事件**：

- `DOMContentLoaded` —— 当 HTML 的加载和处理均完成，DOM 被完全构建完成时。

**CSS 事件**：

- `transitionend` —— 当一个 CSS 动画完成时。

## 事件的处理和绑定

对于页面产生的这些事件，我们通常需要进行处理，以便相应这些事件。比如点了按钮后总要发生点什么。  
通常我们编写**事件处理程序（handler）**来对事件进行处理。  
说白了就是要写一个函数，来和某个元素（节点）的某个事件进行绑定，从而实现该元素执行该事件时，运行这个函数。   
最简单的绑定程序就是在HTML中进行绑定。比如`<input>`或`<button>`可以用`onclick`属性进行绑定：

```html
<input value="Click me" onclick="alert('Click!')" type="button">
```

`onclick`属性表示`click`事件的处理程序，这里表示点击后执行`alert`弹窗。  
更多时候事件的处理程序是放在`JavaScript`代码中的。因为三剑客（HTML，CSS，JS）分别表示框架，样式，逻辑，处理程序自然属于一种业务逻辑。  

```html
<script>
  function countRabbits() {
		console.log("3")
  }
</script>
<input type="button" onclick="countRabbits()" value="Count rabbits!">
```

对于**DOM**来说，其规定了某个事件的处理程序可以表示为`on<event>`，这样就不需要在**HTML**中规定`onclick`等属性，避免了我们在**JS代码**和**HTML文件**中来回切换。  
比如下面这样，实现的效果和上面的`countRabbits()`一毛一样

```html
<input type="button" id="button" value="Count rabbits!">
<script>
  const btn = document.querySelector("#button");
  btn.onclick = function() {
    console.log("3")
  };
  //在已经定义countRabbits()的情况下也可以：
  //btn.onclick = countRabbits;
</script>
```

在尝试上面两种写法的时候，有几点需要注意：

- HTML的属性名是**大小写不敏感**的，因此`<input>`中`onclick`，`ONCLICK`，`onClick`的效果都是一样的；而DOM是**大小写敏感**的，只能用`onclick`的形式（全部小写）
- 在HTML用属性名进行绑定的时候，需要加括号：`onclick="countRabbits()"`，HTML中有括号就表示这是个函数；而在JS中用DOM绑定的时候则不能有括号：`btn.onclick = countRabbits;`，在JS中，有括号的函数表示执行该函数。
- 虽然onclick是一个属性，但是不能通过`setAttribute()`进行绑定，比如：`btn.setAttribute('onclick', function() { console.log("3") });`是无效的。

### 事件监听器 eventListener

虽然上面的方法很简单，但是也有很致命的缺点，就是对于一个元素的一个事件，只能绑定一个处理函数。后绑定的会覆盖之前绑定的。  
为了解决这个问题，便有了**事件监听器eventListener**。它允许我们使用 `addEventListener` 和 `removeEventListener` 来为一个元素的某个事件绑定/删除其处理程序。当然，这种情况下允许我们多次调用`addEventListener` 从而为一个事件绑定多个处理程序。

```js
element.addEventListener(event, handler[, options]);
```

- `event`：事件名，如`"click"`
- `handler`：处理程序
- `options`：可选参数。  
  `{once: true/false}`表示该监听器是否只执行一次，如果为 `true`，那么会在触发后自动删除  
  `{capture: true/false}`表示处理程序合适执行，如果为 `true`，则在**捕获阶段**执行；`false`（默认）则在**冒泡阶段**执行。**捕获**和**冒泡**是事件传递的机制，后面会讲到的（应该吧=。=）。
  `{passive: true/false}`，如果为 `false`，那么处理程序将会调用 `preventDefault()`，拒绝执行浏览器的默认操作（点击链接跳转、按下并拖动鼠标选中文本等）

而对于移除事件监听器`removeEventListener`来说，只有传入的处理程序（函数）和添加的时候一样才会成功删除。鉴于函数是一种引用对象，保存地址，因此匿名函数是无法被删除的，毕竟匿名函数没办法再次拿到其地址。

```js
//这样并不能成功移除
btn.addEventListener( "click" , () => console.log("3 Rabbits!"));
btn.removeEventListener( "click", () => console.log("stop counting!"));
//这样才可以成功移除
btn.addEventListener( "click" , countRabbits);
btn.removeEventListener( "click", countRabbits);
```

对于某些事件来说，他们无法通过 DOM 属性进行处理程序的绑定，只能通过`addEventListener`来绑定，这也导致其更加通用。  
比如`DOMContentLoaded` 事件，其在文档加载完成并且 DOM 构建完成时触发，因此无法通过DOM本身的方法绑定。（毕竟人家还没构建完呢）

```js
// 绑定失败
document.onDOMContentLoaded = countRabbits;
// 绑定成功
document.addEventListener("DOMContentLoaded", countRabbits);
```

### 是对象而非函数的处理程序？

我们可以在对象中编写处理程序，只要将其命名为`handleEvent`，就能被`addEventListener`所识别并绑定

```js
  let obj = {
    handleEvent(event) {
      console.log("3 rabbits!");
    }
  };
  btn.addEventListener('click', obj);
```

这么做的好处之一就是能够让多个元素接受一个对象作为事件处理程序（当然接受已有的函数也有这个好处）  
另外一个好处就是能利用类和对象的特性，我们可以将处理程序编写成一个类，在需要的时候实例化出这个对象再传入。这样能进一步进行封装，落实面向对象编程（OOP）

此外，我们可以用点小聪明，来实现一个对象处理不同的事件：

```js
  class MousePressEventHandler {
    handleEvent(event) {
      let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
      this[method](event);
    }
    onMousedown() {
      console.log("mouse pressed");
    }
    onMouseup() {
      console.log("...and released");
    }
  }
  let handler = new MousePressEventHandler();
  btn.addEventListener('mousedown', handler);
  btn.addEventListener('mouseup', handler);
```

可以看到，我们为鼠标的按下和抬起分别写了两种不同的处理程序，并利用`event.type`中`mousedown`和`mouseup`两个事件类型的字符串构建出其方法名（`onMousedown`和`onMouseup`），从而选择要执行哪个方法。

### 事件对象 event

之前的栗子中，我们的事件处理程序仅仅是输出一些东西，并没有进一步操作。但是如果我想获取到我们事件的一些信息呢，比如获取元素对象从而改变其状态、获取鼠标位置信息、获取Checkbox是否选中等状态之类的。  
这些东西实际上都存储在时间对象`event`中。当一个事件发生的时候，浏览器会创建一个`event`对象，这个对象包含很多属性，比如`event.type`表示事件类型（上面的栗子就是`click`），`event.clientX / event.clientY`表示鼠标指针相对窗口的坐标。  
事实上不同的事件类型又着自己不同的属性，比如**键盘事件**和**鼠标点击事件**的属性就有所不同。

这个世界上存在很多的事件种类，除了鼠标事件、键盘事件外，还包括更改元素的`change`事件，输入内容更改的`input`事件，剪切事件`cut`、复制事件`copy`、粘贴事件`paste`等  
不过我就调鼠标和键盘两个相对~~简单~~常见的介绍一下好了

#### 鼠标事件

具体可见[鼠标事件](https://zh.javascript.info/mouse-events-basics)，这里列出一些常见的属性：

| 事件属性                  | 意义                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `event.type`              | 点击类型                                                     |
| `event.button`            | 规定了点击的鼠标按键                                         |
| `event.clientX / clientY` | 鼠标相对窗口的坐标（可理解为相对坐标，左上角为`(0, 0)`）     |
| `event.pageX / pageY`     | 鼠标相对文档的坐标（可理解为绝对坐标，左上角为`(0, 0)`）     |
| `event.oncopy`            | 为`false`时表示文本不允许复制（当然可以通过查看页面源码或开发者工具来复制） |

而对于点击事件的类型来说，又分为很多种（不会有人觉得只有click吧，不会吧不会吧）

| 事件类型（event.type） | 意义                                         |
| ---------------------- | -------------------------------------------- |
| `mousedown/mouseup`    | 点击/释放鼠标                                |
| `mouseover/mouseout`   | 从一个元素上移入/移出                        |
| `mousemove`            | 在元素上移动鼠标                             |
| `click`                | 左键点击鼠标（仍会触发`mousedown/mouseup`）  |
| `dblclick`             | 双击某元素（一定程度上弃用了）               |
| `contextmenu`          | 打开菜单的事件，由鼠标右键或其他键盘按键触发 |

由于鼠标存在左键、右键、中键（滚轮），有的甚至还有侧边的前进和后退键（通常为电竞鼠标，可以自定义按键宏的那种，我的雷蛇就有），这些都会触发`mousedown/mouseup`事件，因此我们可以用`event.button`来进行区分（以前是用`event.which`，但是现在弃用了）。  

| 鼠标按键       | event.button值 |
| -------------- | -------------- |
| 左键           | 0              |
| 中键           | 1              |
| 右键           | 2              |
| X1键（后退键） | 3              |
| X2键（前进键） | 4              |

如果鼠标和某些功能性按键一起按下的话，`event`还有额外的属性表示。这些属性的值为`true`或`false`，表示鼠标点击的时候这些键是否按下。

| 事件属性   | 意义                          |
| ---------- | ----------------------------- |
| `shiftKey` | `shift`是否按下               |
| `altKey`   | `alt`是否按下（Mac中是`opt`） |
| `ctrlKey`  | `ctrl`是否按下                |
| `metaKey`  | Mac的`command`是否按下        |

#### 键盘事件

~~为了偷懒~~按照惯例，这里还是给出一些常见的事件属性，详情可见：[键盘：keydown 和 keyup](https://zh.javascript.info/keyboard-events)

| 事件属性                       | 意义                   |
| ------------------------------ | ---------------------- |
| `event.type = keydown / keyup` | 按键被按下 / 弹起      |
| `event.key`                    | 按键按下后产生的字符   |
| `event.code`                   | 按下的按键的统一代码   |
| `event.repeat`                 | 该事件是否自动重复触发 |

所谓**自动重复**，指的是当我们按下一个键不放，会产生持续的输入。如果一个键盘发生了自动重复，那么该事件的`event.repeat=true`

再来解释一下`event.key`和`event.code`  
`event.key`是输入键盘后获取的字符，在不同情况下可能会有所不同，比如大小写的时候获取的字符就不一样。如果输入法的语言不同，获取到的字符也是不一样的。   
`event.code`则是每个键盘特有的唯一编码，不管输入法的语言，不管大小写，只要你按了键盘上这个位置的键，那么其`event.code`就是相同的。

| 键盘按键              | event.key   | event.code             |
| --------------------- | ----------- | ---------------------- |
| Z                     | `z`（小写） | `KeyZ`                 |
| Shift + Z             | `Z`（大写） | `KeyZ`                 |
| 0                     | `0`         | `Digit0`               |
| 1                     | `1`         | `Digit1`               |
| =                     | `=`         | `Equal`                |
| Shitf + = （输出`+`） | `+`         | `Equal`                |
| -                     | `-`         | `Minus`                |
| F1                    | `F1`        | `F1`                   |
| Backspace             | `Backspace` | `Backspace`            |
| Shift                 | `Shift`     | `ShiftRight/ShiftLeft` |

所以在设计系统的时候，如果我们希望一个按键即使在切换了语言后，仍能正常使用，那么就应该监听 `event.code` 的值。  
不过，有些时候我们不得不使用`event.key`。比如美式键盘中，我们的`Z`在左下角，而在德式键盘中，左下角的按键是`Y`。但是由于`event.code`的值是由键盘的物理位置所决定的，因此当德式键盘按下左下角的按键后，`event.key='y'`，但是`event.code='KeyZ'`。因此，在未知键盘是美式还是德式的情况下，我们想知道被按下的键是Y还是Z，就只能使用`event.key`了。

## 事件传递机制：冒泡和捕获

### 冒泡 Bubbling

为了~~偷懒~~减少篇幅切方便大家复制自己玩，这里纯纯用HTML写个栗子：

```html
<form style="border: 1px black solid" onclick="console.log('form')">FORM
  <div style="border: 1px black solid" onclick="console.log('div')">DIV
    <p style="border: 1px black solid" onclick="console.log('p')">P</p>
  </div>
</form>
```

这里我们给三个嵌套的元素都添加了点击事件的处理方法（在控制台进行输出）。  
如果我们点击最外面的`<form>`，那么就会输出`"form"`，这没啥问题。  
但是如果我们点击`<div>`，那么就会先输出`"div"`，再输出`"form"`。同理，点击`<p>`后会依次输出`"p"`，`"div"`，`"form"`

这就是**冒泡 Bubbling**的事件传递机制：**事件会从发生的元素开始，依次向上传递给父元素。**  
因为事件从子元素传递到父元素，这个自下而上的过程就像泡泡从水底冒上来，所以叫冒泡（事件就是泡泡）

比较高级的一点是，父元素可以通过`event.target`来获取事件发生的元素。我们简单修改一下上面的栗子🌰：

```HTML
    <form><div><p>...</p></div></form>		//简单省略一下。。记得删掉onclick
    <script>
      document.querySelector("form").onclick = function(event) {
        console.log('this is handler form: ' + this.tagName + ', you clicked: ' + event.target.tagName);
      };
    </script>
```

为`<form>`绑定了上面这个处理程序后，当我们点击最里面的`<p>`，就会输出：`this is handler form: FORM, you clicked: P`；点击`<form>`，就会输出：`this is handler form: FORM, you clicked: FORM`

#### 停止冒泡

冒泡事件从目标元素开始向上冒泡，一直上升到 `<html>`，到 `document` 对象。冒泡很好用但是某些情况下会让事件的处理变得很麻烦，因此我们可以在任何一个元素的处理程序中调用`event.stopPropagation()`来停止冒泡，如同把泡泡戳破一样，事件将不再传递。  
比如在上面的`<script>`中，我们为`<p>`添加一个新的处理函数，并令其停止冒泡。

```js
      document.querySelector("form").onclick = function(event) {
        console.log('this is handler form: ' + this.tagName + ', you clicked: ' + event.target.tagName);
      };
      document.querySelector("p").onclick = function(event) {
        console.log('you clicked <p>');
          event.stopPropagation();
      }
```

这样以来，我们点击`<p>`的时候，仅会显示`"you clicked <p>"`，`<form>`的`onclick`方法将不再被调用，因此事件并没有传递到它这来。不过点击`<div>`还是能正常显示`"this is handler form: FORM, you clicked: DIV"`

要注意的是，在实践中，尽量少用`event.stopPropagation()`，而是用自定义事件或其他代替手段，因为这样不利于代码的维护和功能的扩展。比如一旦后续决定要在父元素中获取冒泡，需要去找到每一个停止冒泡的子元素并修改代码，贼拉麻烦。

### 捕获 Capturing

虽然我们先介绍的**冒泡**，但是根据[DOM标准](http://www.w3.org/TR/DOM-Level-3-Events/)，最先发生的实际上是**捕获**：

1. 捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。
2. 目标阶段（Target phase）—— 事件到达目标元素。
3. 冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。

也就是说，当我们点击一个元素的时候，点击事件先从Window窗口（document对象）开始，向下传递（捕获阶段），然后到达目标元素（目标阶段），最后上升回到Window窗口（冒泡阶段），并在途中调用处理程序。  
之所以不先提及捕获，是因为它不常用，而它之所以不常用，原因也很简单——**默认情况下它对处理程序不可见**。

还记得我们刚提到`addEventListener()`的时候，它的可选参数中有个`{capture: true/false}`。当其为`true`的时候就表示该函数（处理程序）在**捕获**阶段被调用。

我们简单写一个脚本来为栗子中的每个元素添加处理程序：

```HTML
    <script>
      for(let element of document.querySelectorAll('*')) {
        element.addEventListener("click", e => console.log(`Capturing: ${elem.tagName}`), true);
        element.addEventListener("click", e => console.log(`Bubbling: ${elem.tagName}`)); //默认为false
      }
    </script>
```

如此一来，我们点击`<form>`和`<p>`，就会有以下输出：

```
//点击<p>：
Capturing: FORM
Bubbling: FORM
//点击<p>：
Capturing: FORM
Capturing: DIV
Capturing: P
Bubbling: P
Bubbling: DIV
Bubbling: FORM
```

最后提一点，如果我们添加了一个捕获阶段的处理程序： `addEventListener(..., true)`，那么在删除它的时候应该也要加上`true`参数： `removeEventListener(..., true)`。

## 事件委托



## 参考

1. [浏览器事件简介](https://zh.javascript.info/introduction-browser-events)
1. [鼠标事件](https://zh.javascript.info/mouse-events-basics)
1. [键盘：keydown 和 keyup](https://zh.javascript.info/keyboard-events)
1. [冒泡和捕获](https://zh.javascript.info/bubbling-and-capturing)
1. [UI Events：W3C Working Draft, 04 August 2016](http://www.w3.org/TR/DOM-Level-3-Events/)
1. [事件委托](https://zh.javascript.info/event-delegation)