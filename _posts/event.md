## 浏览器事件

在浏览器中，页面/服务端应当对用户的一些行为产生响应或反馈，而这些行为就称之为事件（event）  
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

## 参考

1. [浏览器事件简介](https://zh.javascript.info/introduction-browser-events)