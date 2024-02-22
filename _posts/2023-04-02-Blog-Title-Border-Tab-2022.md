---
layout: post
title: 博客优化：文章标题描边 & 动态修改Tab Title
subtitle: text-shadow属性 和 页面可见性API 的使用
date: 2023-04-02
author: BlackDn
header-img: img/18mon2_05.jpg
catalog: true
tags:
  - Blog
  - Tutorial
---

> "明月玲珑晓我心事，湖海茫茫听你心声。"

# 博客优化：文章标题描边 & 动态修改 Tab Title

## 前言

大家好，时隔两个月我复活了  
其实写了挺多文章的，但是要么写一半，要么刚开始，还没去深挖知识点，什么深度。  
一方面是在学前端 react 方面的内容  
另一方面是最近重燃了打电动的热情，入手了**仁王**、**幽灵线东京**，逃票了**莱莎 3**，还买了**宝可梦阿尔宙斯**的卡带，有些许沉迷。  
哦，还买了**生化 4 重制版**，但是没空间下载了，等把仁王或幽灵线一周目过了先

## 理论基础

本期要实现的两个需求分别是**为标题添加描边**和**根据浏览器 Tab 页状态动态修改 Title**  
虽然我是先有完善这两个点的想法，再去搜索相关功能/属性的；不过在这里还是先从这些属性入手，再去尝试完善博客吧。从理论到实践嘛，有点先学完知识，然后做练习巩固的感觉。

### text-shadow 属性

`text-shadow`是 CSS 的一个属性，可以为文字与其`decoration`（text-decoration，指定下划线、上划线、删除线、闪烁等）添加阴影。  
这个属性会根据后面跟的参数类型和数量来调整其所代表的含义，不过用到比较多的就是`x轴偏移（offset-x）`、`y轴偏移（offset-y）`、`颜色（color）`、`边缘模糊（blur-radius）`等几个参数

当只有两个参数时，其表示**x 轴和 y 轴的偏移**，**颜色**和**模糊**用的是默认值，我们自己不改全局默认的话基本上就是**字体颜色**和**没有模糊**  
当然 x 轴的偏移正数表示向左，负数表示向右；同理 y 轴正数表示向下，负数表示向上。毕竟自古以来都有以左上角为原点的习惯嘛  
坏消息是一条语句同时只能表示一个方向，所以如果想要同时设定上下左右四个方向的阴影，就要写四条语句。好消息是我们可以在一个`text-shadow`中一次性写四条语句，中间用逗号隔开就行。

```css
/* text-shadow: offset-x offset-y */
/* 右下角的阴影 */
text-shadow: 5px 10px;
/* 四周都有阴影：分别是右边、左边、下面、上面 */
text-shadow: 5px 0, -5px 0, 0 5px, 0 -5px;
```

当有三个参数的时候，多出来的那个参数就是颜色，放 x 轴 y 轴的前面和后面都行：

```css
/* text-shadow: offset-x offset-y color / color offset-x offset-y */
/* 右下角的黑色阴影 */
text-shadow: 5px 5px #000;
/* 左右两边的白色阴影 */
text-shadow: white 5px 0, white -5px 0;
```

当有四个参数的时候，多出来的就是边界模糊，实际上是一个渐隐淡化的效果，给他的值就是这个淡化的半径，因此能很好地实现一个类光晕的效果。  
其值越大，光晕的范围越远，但是效果会越淡。因此会出现“我只给文字的一边设置了阴影，但是文字周围都显示了阴影”的效果。

```css
/* text-shadow: offset-x offset-y blur-radius color */
/* 右下角有个黑色的阴影，并有2px的淡化（光晕） */
text-shadow: 5px 5px 2px black;
/* text-shadow: color offset-x offset-y blur-radius */
/* 只设置了一边，不过文字四周都有黑色的阴影（光晕） */
text-shadow: #000 1px 0 10px;
```

此外还有一个`box-shadow`属性，用法和`text-shadow`一毛一样，不过加的阴影是盒模型的阴影，就是在`border`的外面加一圈阴影。

这时候可能会有小伙伴要问，“`text-shadow: 5px 0, 0 5px;`和`text-shadow: 5px 5px;`看起来好像都是加个右下角的阴影，两者有啥区别吗？”。
实际上是有的，区别还挺大。前者是分别向右和向下加个阴影，所以右下角会有一个没阴影缺口，类似像素风的效果（可以用`box-shadow`试一下，效果更明显），更多的是像描边的效果；而后者则是纯纯右下角的一个阴影投影，仿佛左上角有一个光源一样。

![two-ways-shadow](https://s1.ax1x.com/2023/04/03/pphPukj.png)

### 彩蛋：z-index 属性

`z-index`表示一个元素在**z 轴**上的位置。既然 x 和 y 分别表示水平和竖直，那么我们有个 z 轴来表示离用户的远近，合理。  
简单来说就是`z-index`越大，元素离用户越近，其所在的层级越高，能覆盖别的元素。默认情况下`z-index: auto`，后写的元素层级高于先写的元素。

之所以谈到这个属性，是因为在玩`box-shadow`的时候发现这个元素周围的阴影被其他元素遮蔽了。为了解决这个问题最后把`box-shadow`所属的元素`z-index`调高一点就好了。同理，我们哈可以使用负值降低元素的堆叠优先级。  
简单来说，这一段告诉我们`元素除了x、y还有一个z轴属性`，并且`元素的阴影（包括text-shadow和box-shadow）会受到z轴影响从而覆盖其他元素/被其他元素覆盖`。  
不过这个属性在下面的实践过程中并不会用到，算是一个小彩蛋吧。

### Page Visibility：页面可见性 API

#### visibilityState 属性

现在的浏览器基本上都采用了选项卡式浏览，每一个窗口（Tab）都代表了一个不同的页面因此任何一个页面都有可能在后台对用户不可见。于是**页面可见性 API**提供了一系列事件和属性，来判断当前页面处于哪种状态。用官方的话说就是：

> 页面可见性 API 对于节省资源和提高性能特别有用，它避免了页面在不可见时执行不必要的任务。

当用户最小化窗口（浏览器）或切换到另一个 Tab 页时，都会在触发当前页的`visibilitychange`事件，我们也可以通过这个事件来监听页面的可见性及后续操作，实现如仅在页面可见时播放轮播图、让播放的视频在页面不可见的情况下暂停等功能。

每个页面存在一个`visibilityState`属性，我们在`JS`的`DOM`中可以通过`document.visibilityState`来得到它。其可能值如下：

1. `visible`：页面可见，即浏览器位于当前 Tab 页，且没有最小化
2. `hidden`：页面不可见，即 Tab 页位于浏览器后台或最小化窗口（还有一些特殊情况，如操作系统待机锁屏）
3. `prerender`：  某些浏览器在页面内容正在被预渲染时，会将该属性初始化为`prerender`，表示页面正在载入，对用户不可见。如 `Chrome` 就有预渲染功能，支持在用户不可见时预先把页面渲染出来，等到用户要浏览的时候直接展示。
4. `unloaded`：某些浏览器在关闭 Tab 的时候会将该属性变为`unloaded`，表示页面正在从内存中卸载，现在大部分浏览器都不用这个状态了。

#### document.hidden 属性

不出意外的话，每个页面的 DOM 都会维护一个`hidden`属性，如果该页面对用户不可见，那么就会返回`true`，否则返回`false`。  
其实是 DOM 提供的一个简化地判断页面是否可见的方法，避免了开发者用`visibilityState`进行判断。毕竟很多时候我只想知道用户是否能看到这个页面，而不关心`visibilityState`到底是什么值（毕竟`visibilityState`有很多可能值呢）  
同时，用该属性进行可见性判断，一定程度上也提高了页面对各个浏览器的兼容性

#### visibilitychange 监听事件

即然可见性有很多值可选，那么就会有个监听事件来告诉页面什么时候这个属性发生了变化，它就是`visibilitychange`。我们可以通过添加这个事件的监听，以便在页面可见性发生变化后执行我们想要的操作。

```javascript
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // ......
  }
});
```

总之最后实现的效果是这样：
![change-tab-title](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGEyNzY4OWNmNDVhZjVkMzA3OWQzYTFkODQ5Yzg3Y2I5MTFkOGUyYiZjdD1n/OcWPcDzdkvcySOZiR8/giphy.gif)

## 改善 Github Page 博客

### 为标题添加描边（阴影）

起因是我喜欢给博客加一些~~骚里骚气~~花里胡哨的背景图，然后很多时候背景的白色或高亮部分会和标题融为一体。为了从根源解决这个问题，而不是含泪放弃那些喜欢的背景图，这才有了这个需求。

最开始我们很自然地想要添加`border`属性来增加描边，但这当然不行，根据盒模型原理，`border`是盒子的边界，是文本周围四方方的描边，失策了。  
网上一顿冲浪后，考虑到各个浏览器的兼容性，最后选择了曲线救国——通过阴影来实现描边效果，我们的`text-shadow`来拯救世界了。

那接下来就很简单了，我们找到文章中对应**Title**和**Subtitle**的`id`或`class`，然后在 css 中一顿猛改（其实只用加一行`text-shadow`就行了）。当然如果不熟悉`id`或`class`的话也可以现在页面上利用`Inspect`来看看`id`或`class`。
我们这里找到 hux-blog.css 文件中的`.intro-header .post-heading h1 {}`和`.intro-header .post-heading .subheading, .intro-header .post-heading .meta {}`，添加`text-shadow`属性。  
我这里选择为标题周围添加一个虚化光晕的效果，代码如下：

```css
/* hux-blog.css */
.intro-header .post-heading h1 {
  /* ... */
  text-shadow: -3px 0 5px grey, 0 3px 5px grey, 3px 0 5px grey, 0 -3px 5px grey;
}
.intro-header .post-heading .subheading,
.intro-header .post-heading .meta {
  /* ... */
  text-shadow: -2px 0 3px grey, 0 2px 3px grey, 2px 0 3px grey, 0 -2px 3px grey;
}
```

![title-border](https://s1.ax1x.com/2023/04/04/pp4fZ8I.png)

或者也可以为上下左右分别添加阴影，以此实现一些像素风的效果：

```css
/* hux-blog.css */
.intro-header .post-heading h1 {
  /* ... */
  text-shadow: -3px 0 grey, 0 3px grey, 3px 0 grey, 0 -3px grey;
}
.intro-header .post-heading .subheading,
.intro-header .post-heading .meta {
  /* ... */
  text-shadow: -1px 0 grey, 0 1px grey, 1px 0 grey, 0 -1px grey;
}
```

![title-result](https://s1.ax1x.com/2023/04/03/pphPKts.png)

两种都可以，还可以改变颜色等，做一个自己喜欢的描边。  

### 使用插件生成 .min.css 文件

这里要注意一点，咱们项目中的`css`文件有两个，包括普通的`.css`和`.min.css`，但是实际上咱们的**Github Page**识别的只是`.min.css`；有空格和换行的`.css`是给我们人类看的。于是问题来了，你说我只修改 `.min.css`吧，看代码要看半天；你说我修改`.css`吧他又识别不了修改。  
在之前的文章中我同时修改两个文件来让其保持一致，但是这样也挺麻烦的，于是今天我找了个插件来实现这个转换，在**VSCode**中安装**Minify**插件，然后在写完`.css`后打开内置命令行（Command Palette，默认快捷键`Ctrl/Cmd + Shift + P`），运行`Minify`命令，那么在同目录下就会生成对应的`.min.css`文件（暂时还没找到自动将`.css`变为`.min.css`的插件）。  
所以以后只用修改`.css`，然后生成一下`.min.css`就好啦。

### 动态修改 Github Page 的 Tab Title

有了理论基础，这一块代码实现页面就很简单了，添加`visibilitychange`监听并利用`document.hidden`判断页面是否可见，如果不可见就改个`title`就好。   
为了让代码结构更好看，我们新建文件`js/tab-title-change.js`，代码如下：

```javascript
// tab-title-change.js
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.title = "(づ￣ ³￣)づ人家在这等你哦";
  } else {
    document.title = "WelcomeQwQ";
  }
});
```

代码就这么点，剩下的就是放哪里的问题。   
我们看到`_layout`目录下有一个`default.html`，它规定了每个页面的框架：

```html
<!DOCTYPE html>
<html lang="en">
  {% raw %}{% include head.html %}{% endraw %}
  <body ontouchstart="">
    {% raw %}{% include nav.html %}{% endraw %}
    {% raw %}{% include search.html %}{% endraw %}
    {% raw %}{{ content }}{% endraw %}
    {% raw %}{% include footer.html %}{% endraw %}
  </body>
</html>
```

看了下，决定放在`head.html`中，毕竟像其他 `nav.html`、`footer.html` 等文件都是模块化的页面部分，放一个页面无关的方法进去有些奇怪。而 `head.html` 基本都是页面无关的链接啊，script脚本啥的，就扔这儿了。   
我们在 `head.html` 末尾加上一句话来引用这个脚本：

```html
<!-- _includes/head.html -->
<head>
  <!-- ······ -->
  <script src="{{ site.baseurl }}/js/tab-title-change.js"></script>
</head>
```

前面这个 `{{ site.baseurl }}` 是 **Jekyll** 定义的项目根地址，比如我的这个网站就是 `https://blackdn.github.io` ，使用它来正确加载我们的脚本。

这个时候，虽然我们的脚本能正常运行，会在我们切换到其他页面的时候变换标题，但还是有些bug的——不管在哪个页面都会生效，且不管原来的页面标题是什么，最后都会变成`WelcomeQwQ`。  
在我的这个网站中，只有首页的标题是`WelcomeQwQ`，其他页面就不一样了，比如**Tab页面**  是`Tab - WelcomeQwQ`，在文章页面则是文章的标题。因此在这些页面我们需要保留原来的标题，好让我们知道自己打开的是什么页面。   
这所以有这个问题，其实也好理解，毕竟脚本里的标题是写死了的，所以我们需要进一步限定这个脚本生效的地方：

```html
<!-- _includes/head.html -->
<head>
  <!-- ······ -->  
  {% raw %}{% if page.title == "WelcomeQwQ" %}{% endraw %}
  <script src="{{ site.baseurl }}/js/tab-title-change.js"></script>
  {% raw %}{% endif %}{% endraw %}
</head>
```

这是**Liquid语言**的语法，我们通关当前页面的标题判断是否载入这个脚本。只有当页面标题为`WelcomeQwQ`的时候才启用这个动态改变标题的脚本，也就是只有在主页的时候，标题才会动态改变。  
这样这个根据页面可见性动态修改标题的功能就算实现啦～

## 参考

1. [MDN：text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow)
2. [MDN：z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)
3. [MDN：页面可见性 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API)
4. [Page Visibility API 教程](https://www.ruanyifeng.com/blog/2018/10/page_visibility_api.html)
