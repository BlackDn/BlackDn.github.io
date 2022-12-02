---
layout:       post  
title:        Android 焦点Focus和软键盘Keyboard  
subtitle:     焦点相关操作和键盘调出/隐藏  
date:         2022-12-02  
auther:       BlackDn  
header-img:   img/19mon7_34.jpg  
catalog:      true  
tags:    
    - Android  
---

> 盛夏白瓷梅子汤，碎冰碰壁响叮啷。

# Android 焦点Focus和软键盘Keyboard

## 前言

其实是在项目中遇到的一些小bug，通过Google很快就解决啦  
但感觉还是一知半解的，下次遇到类似问题肯定还得Google  
所以还是总结一下吧，哎，好久没写Android相关的文章了。。

## 焦点
我们先从属性入手，最常见的和焦点相关的属性就是`focusable`和`focusableInTouchMode`（它们都定义在View类中）

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
我们知道在远古时期，那时候还没触摸屏，手机用的还是按键，通过键盘的上下左右来选择我们要点击的对象。在这时，判断一个对象是否可以被选中的属性，就是这个`android:focusable="true"`，这时候还是比较好理解的，为`true`表示可以被选中，`false`则不能被选中。

但是后来，设备和人的交互媒介变得多种多样，有触摸球（trackball），电容笔等，到如今清一色的触摸屏。  
由于一个设备可能支持多个交互媒介，为了区分不同的媒介，于是安卓控件的响应就有了不同的模式：**Trackball Mode**、**Navigation Mode**、**Keyboard Navigation**、**Touch Mode**等。其中，**Touch Mode**对应的就是我们通过触摸屏进行交互的模式。  

此外， 我们知道控件还有着不同的状态，比如**selection（选中）**，**focus（获得焦点）**，**press（点击）** 等。  
举个栗子🌰，在RecyclerView中我们选中（长按）一个 Item ，它会被选中，进入 `selected` 状态。但是如果我们不松手，而是进行滑动，那么就进入了**Touch Mode**，Item会退出 `selected` 状态  
正如[Googleblog](https://android-developers.googleblog.com/2008/12/touch-mode.html)所说，当进入**Touch Mode**的时候，所有在`focused`和`seleced`状态的控件都会退出这种状态。

> In touch mode, there is no focus and no selection. Any selected item in a list of in a grid becomes unselected as soon as the user enters touch mode. Similarly, any focused widgets become unfocused when the user enters touch mode.

这也是为了在一定程度上降低复杂性，减少一些意料之外的错误。我们知道在Item划出屏幕外后会被回收，假设在进入**Touch Mode**的时候我们仍选中着之前的 Item ，当这个Item滑动到屏幕之外且被回收，我们松开手指却又触发了这个Item的点击事件，那还不得报错？

#### Touch Mode中的focus：focusableInTouchMode
凡事都有例外嘛，在某些情况下，即使进入Touch Mode，我们也希望控件保持`focused`的状态，于是就有了`focusableInTouchMode`这个属性，允许我们在Touch Mode中进行焦点的获取。  
比较典型的就是`EditText`，我们选中`EditText`之后，即使进行滑动，焦点仍锁定在上面。此外当ListView的`focusableInTouchMode = false`时，它的所有item都无法获得焦点，偶尔也会需要这些特殊用法。  

不过，由于我们并不能准确地知道用户在使用的时候会在何时进入Touch Mode，因此官方推荐我们谨慎使用`focusableInTouchMode`这个属性。毕竟修改之后可能会在一些看不到的地方产生不一样的交互效果（比如焦点乱跳之类的），影响使用体验。

> We really encourage you to think very hard before using it. If used incorrectly, it can make your application behave differently from the rest of the system and simply throw off the user's habits.

### 两个属性的实际效果
知道了这两个属性的来龙去脉，似乎事情变得明了了起来。简单来说，`focusableInTouchMode = true`表示控件在**Touch Mode**下能取得焦点；`focusable = true`表示在其他情况下（比如通过键盘）能取得焦点。两者最终的结果相同都是让控件获得焦点，只不过获得焦点的方式不同。    

对于一些需要响应点击事件的控件来说，它们默认`focusableInTouchMode = false`，因为我们希望点击控件后马上发生点击事件，比如Button。如果我们将其设置`focusableInTouchMode = true`，那么第一次点击会让Button获得焦点，第二次点击才会产生点击事件，这就和用户的使用习惯大相径庭。  
反之，像EditText这样的控件，我们需要通过点击来让他获得焦点，好让系统知道“我点了EditText，因为我想要输入一些东西”，从而方便以后续的操作，比如出现光标、弹起键盘等。因此它默认`focusableInTouchMode = true`

或许有小伙伴会好奇这两个属性排列组合的效果，所以：  
以EditText为例，如果`focusable = false`，那么即使`focusableInTouchMode = true`，它也无法获取焦点。虽然EditText会在点击的一瞬间得到焦点，但是点击完后我们退出**Touch Mode**，却因为`focusable = false`，焦点无法保持在EditText上。  
反过来，当`focusable = true`，但是`focusableInTouchMode = false`的情况下，`EditText`则不能通过点击获取焦点。但是，如果使用的是虚拟机，或通过投屏软件，我们能够用物理键盘进行操作的时候，我们仍可以通过键盘切换焦点（`Tab`键），以此选中EditText，从而实现绕过**Touch Mode**来让EditText获取焦点。

|                     | focusableInTouchMode = true  | focusableInTouchMode = false |
| ------------------- | ---------------------------- | ---------------------------- |
| `focusable = true`  | Touch Mode内外都可以获取焦点 | Touch Mode外，可以获取焦点（通过键盘）   |
| `focusable = false` | 点击瞬间获取焦点，但无法保持 | 无法获取焦点                 |


### 取消 EditText 的自动 focus
然后来到了我遇到的bug：  
在某些情况下，进入页面，会自动`focus`到`EditText`，甚至还会弹出键盘，影响体验。  
不过我怀疑是Android版本问题，我的Android 7.0和8.0的测试机进入页面会自动focus到Edittext，但是Android 11的测试机和Android 13的虚拟机就不会。这些高版本设备进入页面不会发生自动focus的行为。不过也没检测过很多设备，不敢太笃定。

总之，要是真的不小心万一出现了这种自动focus的情况，我们先来尝试推断一下自动focus的机制：
- 进入页面，自动focus到EditText（暂时不理会键盘是否弹起）
- 如果有两个EditText，会focus第一个EditText
- 将第一个EditText设为`focusableInTouchMode = false`，自动focus到第二个EditText
- 在EditText之前添加TextView，并设为`focusableInTouchMode = true`，自动focus到TextView

再结合EditText的两个属性默认为`true`，TextView默认为`false`的条件，我们主观有余且客观不足地推断：当进入页面自动focus发生时，会focus到当前页面第一个`focusableInTouchMode = true`的控件。  
以这个特性为基础，我们来取消 EditText 的自动 focus（不出意外的话调用`editText.clearFocus()`仍不能取消focus，原因后面会提到），比较普遍的方法就是“曲线救国”——把焦点给到别的控件。

比如我们可以给EditText之前的TextView设置为可focus的：  

```java
android:focusable="true"  
android:focusableInTouchMode="true"
```

但是这样做的缺点也比较明显，我们总不能对每个页面的控件渲染都了如指掌，在**LinearLayout**里还好说，如果是**RelativeLayout**，**ConstraintLayout**，那控件的渲染顺序可就千奇百怪了。  
此外，其他的控件难免有一些需求功能我们难免一下子就考虑到，比如这个TextView是能够被选中复制之类的。而且许多控件被选中之后还会有不一样的效果，比如出现光标（EditText等），比如背景色改变（TextView，Button等）。所以最好还是不要修改对其他控件的`focusableInTouchMode`属性。  

我们能不能找到一个控件，用户基本看不到，而且没有什么特殊的功能需求呢？于是乎，我们把目光移向了EditText的父控件（父布局）。这些**LinearLayout**、**RelativeLayout**啥的反正用户也看不到，而且它们进入focus状态也不会有啥效果，所以我们可以直接在父布局中设置：

```java
android:focusable="true"  
android:focusableInTouchMode="true"
```

因为父布局总能先于EditText渲染，所以进入页面的时候会先一步抢夺焦点，这样就不会focus到EditText啦。  
当然，大部分情况下，我们可以直接两眼一闭，把**根布局**设置为可focus的，从而不用关心EditText的位置，保证该页面不会自动focus到EditText。  
还有小伙伴喜欢额外设置一个宽高为0的view来瞧瞧获取焦点，当然也可以，不过注意要放在EditText前面嗷。

#### 奇怪的坑点
上面我们提到，可以在EditText的父布局（假设是个LinearLayout）中，把两个focus属性设为`true`，从而抢夺EditText的焦点。不过实际上，我们只用设置一个`focusableInTouchMode="true"`就可以让它的两个focus属性都变为`true`，Android为了维护两个focus属性的统一，会自动将`focusable`也变为`true`。  
这在使用代码的时候也是一样：一句`linearLayout.setFocusableInTouchMode(true)`即可。  
不过还是鼓励大家显式地设置两个属性呢，减少意料之外的错误，增强可读性，证明“我可没有忘记这个属性哦”。

但是，TextView可就不同了。如果我们仅在XML中设置了`focusable = "true"`或`focusableInTouchMode="true"`，那么是不会生效的，这个TextView的两个focus属性仍都为`false`（使用代码`textView.setFocusableInTouchMode(true)`可以将两个属性设为`true`，原也是为了两个属性的统一）。  
这是由于TextView为了避免开发者出现“我忘了原来还有这个属性”而导致的一些错误，在我们只显式设置一个属性的情况下，会重新设置一次`focusable`：

```java
//In TextView.java
// Some apps were relying on the undefined behavior of focusable winning over  
// focusableInTouchMode != focusable in TextViews if both were specified in XML (usually  
// when starting with EditText and setting only focusable=false). To keep those apps from  
// breaking, re-apply the focusable attribute here.  
if (focusable != getFocusable()) {  
    setFocusable(focusable);  
}
```

不过这种情况似乎只出现在出现“自动focus”情况的设备中，在一些高Android版本的设备中（比如我的Android 13虚拟机），TextView的`focusable`和`focusableInTouchMode`其中一个为`true`，另一个也会被自动设置为`true`  
有没有一种可能，就是官方在升级的时候改了代码悄悄修复了这个bug？

更进一步，TextView还有一个`selectable`属性，决定我们能否选择文本，长按复制啥的。而这个属性决定了TextView能否获得焦点（默认不行，两个focus属性为`false`，`selectable`默认也为false）  
在TextView的代码中，仅在`setTextIsSelectable()`方法中对`focusableInTouchMode`进行了设置，通过`setFocusableInTouchMode(selectable)`使其和`selectable`保持一致  

```java
//In TextView.java
public void setTextIsSelectable(boolean selectable) {  
    if (!selectable && mEditor == null) return; // false is default value with no edit data  
	//...
    setFocusableInTouchMode(selectable);  
	//...
}
```

因此，仅将TextView设置为`textIsSelectable="true"`，就表示其是可选中的，那么它会隐式地将两个focus属性也设置为`true`  
可以理解为：`selectable = true -> focusableInTouchMode = true -> 两个focus统一 -> focusable = true` 

```java
//只写了这一句：
android:textIsSelectable="true"
//但是能隐式修改⬇
android:focusable="true"  
android:focusableInTouchMode="true"
```

### 焦点相关的方法
在进行焦点相关操作时可能会用到的方法

| 方法                                                 | 作用                                        |
| ---------------------------------------------------- | ------------------------------------------- |
| view.requestFocus()                                  | 请求持有焦点                                |
| view.clearFocus()                                    | 清除view的焦点                              |
| view.isFocusable()                                   | 判断focusable属性是否为true                 |
| view.isFocusableInTouchMode()                        | 判断focusableInTouchMode是否为true          |
| view.hasFocusable()                                  | 判断自己及内部View的focusable属性是否为true |
| view.setFocusable(true)                              | 将focusable属性设置为true                   |
| view.setFocusableInTouchMode(true)                   | 将focusableInTouchMode属性设置为true        |
| view.isFocused()                                     | 判断view是否已获取焦点                      |
| view.hasFocus()                                      | 判断view和其子view是否已获取焦点            |
| view.findFocus()                                     | 查找自己内部所持有焦点的View                |
| viewGroup.getFocusedChild()                          | 返回mFocused所存储的成员                    |
| view.addFocusables(ArrayList\<View\> views, int dir) | 将自己（内部）能获得焦点的对象加入到views中 |

#### is 和 has 的两组方法

我们可以通过`isFocusable()`来判断当前view的`focusable`属性是否为true，同理`isFocusableInTouchMode()`判断`focusableInTouchMode`。  
如果是ViewGroup，我们可以用`hasFocusable()`方法判断其内部View是否能够获得焦点，就像Linux中`grep`和`grep -r`的区别。当然只要有一个View的`focusable = true`，该方法就会返回`true`。可惜没有`hasFocusableInTouchMode()`方法。  
不过这几个方法都是针对可见View而言的，`Invisible`，`gone`，`disabled`的View都会被认为不可获得焦点，即使显示设置两个focus属性为`true`也一样。

```java
public boolean isFocusable(); //只判断自身
public boolean isFocusableInTouchMode(); //只判断自身
public boolean hasFocusable();   //除了判断自身外还判断子视图
```


同理，`isFocused()`判断焦点是不是自己本身持有，`hasFocus()`判断焦点是不是被自己或自己的子View所持有。

```java
public boolean isFocused()  //是否当前View持有焦点
public boolean hasFocus()  //当前View或子View是否是焦点视图
```

#### mFocused 属性

在ViewGroup中，有一个`mFocused`的View对象，它保存了当前ViewGroup中持有焦点的View。当然如果持有焦点的View在另一个ViewGroup，那么`mFocused`则是这个ViewGroup（毕竟ViewGroup继承View，会自动转型嘛）；如果没焦点那就是null。  
举个例子，ViewGroup对象`vg1` 包含另一个 ViewGroup对象`vg2`，`vg2`中有个View控件`view`持有焦点。那么`vg1.mFocused = vg2`，`vg2.mFocused = view`。    
也就是只保存自己下面一级的焦点对象。

```java
//in ViewGroup.java
// The view contained within this ViewGroup that has or contains focus.  
private View mFocused;
```

我们可以用`getFocusedChild()`方法来得到`mFocused`对象，相当于它的`getter`了。  
许多Focus相关的方法都涉及到了这个`mFocused`，比如`clearFocus()`方法调用的时候，会触发`onFocusChanged()`方法，从而在视图树中从下到上调用`clearChildFocus()`，将所有ViewGroup的`mFocused = null`。最后则会从上到下再次遍历视图树，重新将焦点交给第一个`focusableInTouchMode = true`的View。  
比如我们在EditText后面加一个Button（`focusableInTouchMode = true`），它的点击事件是给自己`clearFocus()`，那么点击完之后会焦点会重新回到EditText上（就像重新进入这个页面）  
也是因为这个原因，我们在之前提到的bug中不能单纯调用`editText.clearFocus()`，毕竟清除焦点后又回到了它身上。  

```java
//in ViewGroup.java
    @Override
    public void clearChildFocus(View child) {
        mFocused = null;
        if (mParent != null) {
            mParent.clearChildFocus(this);
        }
    }
```

我们可以用`findFocus()` 来查找持有焦点的视图，如果是View对象调用该方法，自己持有焦点则会返回自己，不是自己就返回`null`。  
如果是ViewGroup调用该方法（没错，ViewGroup重写了它），如果自己持有焦点，则返回自己；如果不是自己，就调用`mFocused.findFocus()`方法。我们知道`mFocused`可以为View，也可以为ViewGroup...于是就开始套娃。反正到最后，如果焦点在自己内部就返回这个View或ViewGroup，自己内部没焦点就返回`null`

```java
//in View.java
public View findFocus() {  
    return (mPrivateFlags & PFLAG_FOCUSED) != 0 ? this : null;  
}
//in ViewGroup.java
@Override  
public View findFocus() {  
    if (isFocused()) {  
        return this;  
    }  
    if (mFocused != null) {  
        return mFocused.findFocus();  
    }  
    return null;  
}
```

#### Focusables列表
有一个`addFocusables()`方法，它接受三个参数：

```java
public void addFocusables(ArrayList<View> views, int direction, int focusableMode) {  
    if (views == null) {  
        return;  
    }  
    if (!canTakeFocus()) {  
        return;  
    }  
    if ((focusableMode & FOCUSABLES_TOUCH_MODE) == FOCUSABLES_TOUCH_MODE  
            && !isFocusableInTouchMode()) {  
        return;  
    }  
    views.add(this);  
}
```

简单来说它的作用就是判断当前View是否可以获取焦点，可以的话就把这个View加到`views`这个列表中，当然这是我们自己定义的一个**外部View列表**。  
当然，ViewGroup也重写了这个方法，它会将自己所有可获取焦点的childView加到`views`中。  
更多时候，我们会省略`focusableMode`参数，这玩意它自己会判断，反正它也只有`FOCUSABLES_TOUCH_MODE`和`FOCUSABLES_ALL`两个值（Touch Mode和其他Mode）：

```java
public void addFocusables(ArrayList<View> views, int direction) {  
    addFocusables(views, direction, isInTouchMode() ? FOCUSABLES_TOUCH_MODE : FOCUSABLES_ALL);  
}
```

如果我们不想要在外部自己定义Views列表，就可以用`getFocusables()`，虽然它本质也是用了`addFocusables()`。返回的就是自己内部能够获取焦点的Views列表。

```java
//in View.java
public ArrayList<View> getFocusables(int direction) {
	ArrayList<View> result = new ArrayList<View>(24);
	addFocusables(result, direction);
	return result;
}
```

至于这些方法中的`int direction`参数，我们可以看到它其实在代码的执行中并没有被用到，不过也确实没用到，它用于表示焦点之后要如何移动——跳到上一个 / 下一个item？或者单纯往上往下之类的。用的时候就这样用`view.getFocusables(View.FOCUS_FORWARD)`   
在源码中的写法是这样的：

```java
//in View.java
@IntDef(prefix = { "FOCUS_" }, value = {
		FOCUS_BACKWARD,  //Move focus to the previous selectable item.
		FOCUS_FORWARD,  //Move focus to the next selectable item.
		FOCUS_LEFT,  //Move focus to the left.
		FOCUS_UP,  //Move focus up.
		FOCUS_RIGHT,  //Move focus to the right.
		FOCUS_DOWN  //Move focus down.
})
@Retention(RetentionPolicy.SOURCE)
public @interface FocusDirection {}
```

这种写法其实**等价于**声明了`FocusDirection`这种枚举，`@IntDef`表示枚举里面的值都是`int`类型。因为直接用枚举消耗的内存比定义变量多（毕竟是全局的嘛），不利于内存性能优化，所以就用了这种带注解的写法。  
`@Retention(RetentionPolicy.SOURCE)`表示只会在java文件中存在，编译器不会将其编译到class文件中。`@Retention`具体的取值有以下三个：
1.  RetentionPolicy.SOURCE：只会在java文件中存在，class文件中就不可见了。可以被编译器使用
2.  RetentionPolicy.CLASS：会在class中可见，不需要被虚拟机加载。编译时可见
3.  RetentionPolicy.RUNTIME：在class中可见，会被虚拟机加载。编译时可见，运行时可见

说了半天，总之我们用`addFocusables()`和`getFocusables()`的时候比较少考虑这玩意，挑个喜欢的用吧，真要有影响就再说吧=。=

还有一个平时用的比较少的功能，就是我们可以自定义当前View的下一个焦点View，通过下面这些方法：

```java
view.setNextFocusForwardId(R.id.another_view_id);  
view.setNextFocusUpId(R.id.another_view_id);  
view.setNextFocusDownId(R.id.another_view_id);  
view.setNextFocusLeftId(R.id.another_view_id);  
view.setNextFocusRightId(R.id.another_view_id);
```

调用了这些方法后，当我们使用键盘Tab键（Forward）或者方向键（Up，Down，Left，Right）来转移焦点，焦点就会从当前View跳到我们指定的View，而非按原来的顺序进行分配。

#### 焦点获取及其策略

请求焦点用到的就是我们熟悉的 `requestFocus()` 方法  
如果是View调用这个方法，当它不可见（`invisible` / `gone`）、`focusable = false`或它的父视图不允许其获取焦点，就会返回`false`，获取焦点失败；其他正常情况下不出意外的话，就会调用`onFocusChanged()`方法清除其他View的焦点，自己获取到焦点，并返回`true`。  
如果是ViewGroup调用这个方法，则会根据`setDescendantFocusability()`中设置的焦点获取策略按照顺序分配焦点  

`setDescendantFocusability(int focusability)`可以接收以下三个值：
- `FOCUS_AFTER_DESCENDANTS`： 默认值。当ViewGroup调用`requestFocus()`时先让子视图成为焦点，若没有子视图能获取焦点，则自己获取焦点。
- `FOCUS_BEFORE_DESCENDANTS`： 当ViewGroup调用`requestFocus()`时先让自己成为焦点视图，自己`focus = false`的话再让子视图获得焦点。
-  `FOCUS_BLOCK_DESCENDANTS`： 阻止子视图成为焦点视图，即使子视图调用了`requestFocus()`也不会获取焦点

最后提一点，当窗口第一次渲染视图的时候，会调用ViewRoot的`focusableViewAvailable()`方法（这个方法重写自接口ViewParent）。这个方法中会调用`requestFocus()`来决定进入页面时，焦点应该交给哪个View

```java
//in ViewRootImpl.java
@Override
public void focusableViewAvailable(View v) {
	checkThread();
	if (mView != null) {
		if (!mView.hasFocus()) {
			if (sAlwaysAssignFocus || !mAttachInfo.mInTouchMode) {
				v.requestFocus();
			}
		} else {
			View focused = mView.findFocus();
			if (focused instanceof ViewGroup) {
				ViewGroup group = (ViewGroup) focused;
				if (group.getDescendantFocusability() == ViewGroup.FOCUS_AFTER_DESCENDANTS
						&& isViewDescendantOf(v, focused)) {
					v.requestFocus();
				}
			}
		}
	}
}
```

代码的逻辑也比较明朗，如果焦点不在`mView`（我们可以简单理解为**根布局**）上，那么就调用`requestFocus()`去请求焦点；  
如果焦点已经在`mView`中了，那么就判断是否为ViewGroup。如果是且焦点策略为先给子View（`FOCUS_AFTER_DESCENDANTS`），那么仍是通过`requestFocus()`请求焦点。如果不是ViewGroup...那就说明焦点已经在View上了，不需要再请求焦点啦。

这就引出了我们解决“自动focus”的另一个解决方案：通过`setDescendantFocusability()`和`requestFocus()`来解决EditText自动获取焦点。我们将EditText的父视图（或祖父视图）设为可获取焦点（`focusable = true`），然后设置其焦点策略为`FOCUS_BEFORE_DESCENDANTS`。这样每次从根布局向下分配焦点的时候，其父视图总能先EditText一步获取到焦点，即使EditText调用`clearFocus()`或者对祖先视图调用`reqeustFoucs()`也总能让父视图获得焦点。这也是为啥我们一开始遇到这个bug单纯使用`clearFocus()`没有效果的原因，那会我们还没da搭配焦点策略呢。    
用户视角是看不到父布局获取到了焦点，他们只能发现EditText不再自动获取焦点，bug成功解决啦。

## 键盘
然后来到了键盘，因为手机中的键盘是虚拟的，所以又称软盘、软键盘。  
一开始接触这个是因为有需求要求：“进入页面焦点给到EditText，但是键盘不能弹出来，因为屏幕太小了，键盘弹出来看不清其他内容，用户还得把键盘关了。”  
之前大部分情况键盘和EditText焦点是绑定的，当其获取焦点后会自动弹出，现在不一样了，它们俩得分家了。

### windowSoftInputMode 属性
首先，我们往大了说，在`AndroidManifest.xml`中，我们可以给当前页面（Activity）配置键盘行为，这个行为就是`windowSoftInputMode`属性。它有10个可选值，分为6个**键盘可见状态**和4个**键盘与布局关系**，当然可以组合使用。  

6个可见状态的属性如下：

| 可见状态属性       | 意义                                                               |
| ------------------ | ------------------------------------------------------------------ |
| stateUnspecified   | 默认值。系统根据不同场景自己决定键盘可见性                         |
| stateUnchanged     | 从该页面跳转到其他页面时保持键盘样式。跳转前显示键盘则跳转后也显示 | 
| stateHidden        | 第一次进入该页面键盘隐藏（从其他页面返回则可能展示）               |
| stateAlwaysHidden  | 任何时候进入该页面，键盘隐藏                                       |
| stateVisible       | 第一次进入该页面键盘显示（从其他页面返回则可能隐藏）               |
| stateAlwaysVisible | 任何时候进入该页面，键盘显示                                       |

4个键盘与布局的关系如下：

| 布局相关属性      | 意义                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| adjustResize      | 键盘抬起后会将中间布局向上顶起，但顶部标题栏不动。但不是所有布局都生效。      |
| adjustPan         | 键盘弹起到焦点下方，顶部标题栏会被顶起看不到，焦点下方内容被键盘覆盖          |
| adjustUnspecified | 默认值。系统根据布局自己选择，有滚动布局采用adjustResize，没有则采用adjustPan |
| adjustNothing     | 布局不发生变化，键盘覆盖在布局上方                                            |

通常我们将两者进行组合使用，用`｜`连接两种属性。  
比如设置MainActivity中的键盘第一次进入隐藏，且键盘弹起时不影响布局，直接覆盖在布局上方：

```xml
<activity  
  android:windowSoftInputMode="stateHidden|adjustNothing"  
  android:name=".MainActivity">  
</activity>
```

#### 需求举例
在之前的一个项目中，有一个场景需要连续两次的签名。具体逻辑是填表后，弹出一个AlertFragment，签完名后进行回到表格页面进行后续操作；操作完再签一次名，然后退出。流程如下：  
`TableActivity -> AlertFragment -> TableActivity -> AlertFragment`

问题在于从AlertFragment回到TableAcivity的时候，会自动focus到EditText并弹出键盘。因为需要后续操作，所以需求是键盘不需要弹起，但是要保持焦点在EditText上。  
所以解决方法就是通过修改Manifest中的这个属性，来让键盘不弹出就好了。

```xml
<!-- 改之前 -->
<activity  
  android:windowSoftInputMode="adjustNothing|stateHidden"  
  android:name=".XXXActivity">  
</activity>
<!-- 改之后 -->
<activity  
  android:windowSoftInputMode="adjustNothing|stateAlwaysHidden"  
  android:name=".XXXActivity">  
</activity>
```

其实就是因为`stateHidden`只对第一次进入页面的时候有效，而我们从AlertFragment进来已经不是第一次了，所以不会生效。所以把它改成`stateAlwaysHidden`，不管哪次进入页面键盘都不展示就好啦。

### Input Method Framework
在Android的**输入法架构（Input Method Framework，IMF）** 中，**InputMethodManager类** 用于程序和输入法之间的交互，也是比较核心的一个结构。  
InputMethodManager继承自Object类，是一个`final class`。

在IMF中，主要有三个结构（具体可见[developers: InputMethodManager](https://developer.android.com/reference/android/view/inputmethod/InputMethodManager)）：
1. **Input Method Manager**：IMF核心，管理其他部分的交互，作为用户端API（client-side API）且在所有Context中可供调用。
2. **Input Method（IME）**：即用于生成字符的输入法。系统会绑定当前的输入法，将其调起运行、作进行交互，而同一时间只能有一个IME正在运行。
3. **Client Application**：不同的应用能获得系统焦点，并接收IME的输入字符，而这由**Input Method Manager**进行协调管理。

### 判断键盘是否弹起

我们用**InputMethodManager**来控制键盘，可以通过`Context.getSystemService(Context.INPUT_METHOD_SERVICE)`来获取。像其他的什么`text service（TEXT_SERVICES_MANAGER_SERVICE）`、`app widget（APPWIDGET_SERVICE）`等也是通过同样方法获取。

```java
InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
boolean isKeyboardShowed = imm.isActive();
```

### 代码调出/藏起键盘

除了在manifeat中声明整个页面中键盘的属性，我们在代码中也可以通过**InputMethodManager类**来调出或隐藏键盘  
举个栗子🌰，我们通过点击按钮来实现键盘的弹起和隐藏：

```java
//弹起键盘
  public void onClick(View buttonView) {  
	InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);  
	imm.showSoftInput(buttonView,InputMethodManager.SHOW_FORCED); 
  }
//隐藏键盘
  public void onClick(View buttonView) {  
	InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);   
	imm.hideSoftInputFromWindow(buttonView.getWindowToken(), 0); 
  }
```

上面的例子中我们调用`showSoftInput()`来召唤键盘，如果召唤成功就返回`true`，否则返回`false`（在键盘已经弹起的情况下再次召唤键盘会返回`true`）  
第一个参数是持有焦点的View，通常也用于接收键盘输入内容；此外，在`adjustPan`等键盘布局模式中也会以此来决定键盘升起的位置。  
第二个参数是标志位`flag`，表示键盘弹起/隐藏的限制，主要是在隐藏键盘时生效，有以下的可选值：
- `0`：没啥限制，基本都可以弹起
- `SHOW_IMPLICIT`：表示隐式尝试弹起键盘，不一定每次都会生效，它表示“用户可能在这里会需要键盘，所以最好能弹起，但是不弹起那就算了”。
- `SHOW_FORCED`：强制弹起键盘，在此之前的一些隐藏键盘的操作都会失效，在某些情况下可能会导致布局的错误啥的，但是你就说键盘弹没弹起吧。

同理，`hideSoftInputFromWindow()`用于隐藏键盘，根据成功与否返回`true`或`false`（在键盘已经隐藏的情况下再次隐藏会返回`false`）  
第一个参数`windowToken`用于指定需要隐藏键盘的窗口，通常通过 `View.getWindowToken()`得到。  
第二个参数是一个标志位`flag`，它和`showSoftInput()`方法中的`flag`相对应：
- `0`：没啥限制，二话不说给你隐藏键盘
- `HIDE_IMPLICIT_ONLY`：仅可以隐藏由`SHOW_IMPLICIT`所弹起的键盘
- `HIDE_NOT_ALWAYS`：若键盘由`SHOW_FORCED`弹起，则不隐藏

| 隐藏标志\\弹起标志 | 0        | SHOW_IMPLICIT | SHOW_FORCED |
| ------------------ | -------- | ------------- | ----------- |
| 0                  | 可以隐藏 | 可以隐藏      | 可以隐藏    |
| HIDE_IMPLICIT_ONLY | 不能隐藏 | 可以隐藏      | 不能隐藏    |
| HIDE_NOT_ALWAYS    | 可以隐藏 | 可以隐藏      | 不能隐藏    |

最后，除了单纯调出或隐藏键盘，我们还可以用`toggleSoftInput()`方法实现键盘在两种状态之间进行切换，即如果弹出就隐藏、如果隐藏就弹出。  
它接受两个参数，分别是弹起的`flag`和隐藏的`flag`，效果和上面提到的一个样，所以要注意如果是不能隐藏的组合就会导致状态切换失效。  
同时是个`void`方法，没有了之前的`true`和`false`

```java
InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);  
imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);
```

## 参考
 1. [Googleblog：Touch Mode](https://android-developers.googleblog.com/2008/12/touch-mode.html)
 2. [Android Focusable in Touch Mode 介绍](https://cloud.tencent.com/developer/article/1014353)
 3. [Android focus概念](https://tedaliez.github.io/2020/02/14/Android-focus%E6%A6%82%E5%BF%B5/)
 4. [Android中的视图焦点Focus的详细介绍](https://www.jianshu.com/p/5fff395b9e2f)
 5. [闲话元注解@Retention](https://cloud.tencent.com/developer/article/1574131)
 6. [使用@IntDef和@StringDef代替Java枚举](https://www.jianshu.com/p/f95490397e13)
 7. [秒懂Android开发之 android:windowSoftInputMode 属性详解](https://blog.csdn.net/ShuSheng0007/article/details/104232176)
 8. [developers: InputMethodManager](https://developer.android.com/reference/android/view/inputmethod/InputMethodManager)