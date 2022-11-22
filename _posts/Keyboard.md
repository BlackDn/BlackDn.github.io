# Keyboard & Focus

## 前言

## 获取焦点问题

### focusable 和 focusableInTouchMode
在View的属性中，我们有以下两个属性：
```java
//in xml:
android:focusable="true"
android:focusableInTouchMode="true"
//in code:
editText.setFocusable(true);  
editText.setFocusableInTouchMode(true);
```

（因为这是定义在`View类`中的属性，所以讲道理所有控件都能设置这两个属性，但有没有用就是另外一回事了）  
基本上就是这两个属性决定了我们的控件能否被选中，于是我们就先来看看他们是怎么来的。

### Touch Mode的引入
我们知道在远古时期，那时候还没触摸屏，我们的手机用的还是按键，通过键盘的上下左右来选择我们要点击的对象。在这时，判断一个对象是否可以被选中的属性，就是这个`android:focusable="true"`，这时候还是比较好理解的，为`true`表示可以被选中，`false`则不能被选中。

但是后来，设备和人的交互媒介变得多种多样，有触摸球（trackball），电容笔等，到如今清一色的触摸屏。  
由于一个设备可能支持多个交互媒介，为了区分不同的媒介，于是安卓控件的响应就有了不同的模式：**Trackball Mode**、**Navigation Mode**、**Keyboard Navigation**、**Touch Mode**等。其中，**Touch Mode**对应的就是我们通过触摸屏进行交互的模式。  

此外， 我们知道控件还有着不同的状态，比如**selection（选中）**，**focus（获得焦点）**，**press（点击）** 等。  
举个栗子🌰，在RecyclerView中我们选中（长按）一个 Item ，它会被选中，进入 `selected` 状态。但是如果我们不松手，而是进行滑动，那么Item会退出 `selected` 状态，而进入了**Touch Mode**  
正如[文档](https://android-developers.googleblog.com/2008/12/touch-mode.html)所说，当进入**Touch Mode**的时候，所有在`focused`和`seleced`状态的控件都会退出这种状态。

> In touch mode, there is no focus and no selection. Any selected item in a list of in a grid becomes unselected as soon as the user enters touch mode. Similarly, any focused widgets become unfocused when the user enters touch mode.

这也是为了在一定程度上降低复杂性，减少一些意料之外的错误。我们知道在Item划出屏幕外后会被回收，假设在进入**Touch Mode**的时候我们仍选中着之前的 Item ，当这个Item滑动到屏幕之外且被回收，我们松开手指却又出发了这个Item的点击事件，这种情况处理起来就很头疼了。

### Touch Mode中的focus：focusableInTouchMode
凡事都有例外嘛，在某些情况下，即使进入Touch Mode，我们也希望控件保持`focused`的状态，于是就有了`focusableInTouchMode`这个属性。比较典型的就是`EditText`，我们选中`EditText`之后，即使进行滑动，焦点仍锁定在上面。此外当ListView的`focusableInTouchMode = false`时，它的所有item都无法获得焦点，偶尔也会有这种需求。  

不过，由于我们并不能准确地知道用户在使用的时候会在何时进入Touch Mode，因此官方推荐我们谨慎使用`focusableInTouchMode`这个属性。毕竟修改之后可能会在一些看不到的地方产生不一样的交互效果（比如焦点乱跳之类的），影响使用体验。

> We really encourage you to think very hard before using it. If used incorrectly, it can make your application behave differently from the rest of the system and simply throw off the user's habits.

### 两个属性的实际效果
知道了这两个属性的来龙去脉，似乎事情变得明了了起来。简单来说，`focusableInTouchMode = true`表示控件在**Touch Mode**下能取得焦点；`focusable = true`表示在其他情况下能取得焦点。    
在默认情况下，`TextView`的两个属性都为`false`，而`EditText`的两个属性都为`true`。  

首先我们知道，如果`focusable = false`，那么即使`focusableInTouchMode = true`，也无法获取焦点。以`EditText`为例，我们获取其焦点是为了输入点什么，而我们在进行输入的时候肯定没有滑动操作，也就是说此时已经退出**Touch Mode**，所以得靠`focusable = true`来保证输入的时候`EditText`处于获取焦点的状态。  

另一种情况，就是`focusable = true`，但是`focusableInTouchMode = false`。在如今大部分设备使用触摸屏作为唯一交互媒介的情况下，我们的`EditText`仍不能获取焦点，因为我们点击它的操作属于**Touch Mode**，而它却不能从中获得焦点。  
但是！我们的虚拟机可没有触摸屏，且可以用键盘进行操作。因此在这种情况下，我们虽然不能通过点击让`EditText`获取焦点，但是可以通过键盘，通过点击`Tab`键切换焦点，直到选中`EditText`，从而实现绕过**Touch Mode**来让`EditText`获取焦点。当然，通过一些投屏软件可以实现这种操作。

|                     | focusableInTouchMode = true | focusableInTouchMode = false |
| ------------------- | --------------------------- | ---------------------------- |
| `focusable = true`  | Touch Mode内外都可以获取焦点  | Touch Mode外，可以获取焦点 |
| `focusable = false` | 无法获取焦点                | 无法获取焦点                 |


### 取消 EditText 的自动 focus
在某些情况下，我们进入页面，会自动`focus`到`EditText`，甚至还会弹出键盘，影响体验。（我怀疑是Android版本问题，在默认情况下，我的Android 7.0和8.0的测试机进入页面会自动focus到Edittext，但是Android 11的测试机和Android 13的虚拟机就不会。懂的小伙伴可以指教指教） 

总之，要是真的不小心万一出现了这种自动focus的情况，


我们又不想他focus，免不了上网进行一顿搜

## 获取和取消控件焦点

## 键盘


## 参考
 1. [Touch Mode](https://android-developers.googleblog.com/2008/12/touch-mode.html)
 2. [Android Focusable in Touch Mode 介绍](https://cloud.tencent.com/developer/article/1014353)
 3. 