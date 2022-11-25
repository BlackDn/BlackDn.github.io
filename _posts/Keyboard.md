# Keyboard & Focus

## 前言

## 获取焦点
说到焦点的获取和取消，我们最先想到的是`requestFocus()`和`clearFocus()`，遗憾的是他们不能解决“EditText自动focus”的问题，再加上用法比较简单，就不过多介绍了。

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
正如[Googleblog](https://android-developers.googleblog.com/2008/12/touch-mode.html)所说，当进入**Touch Mode**的时候，所有在`focused`和`seleced`状态的控件都会退出这种状态。

> In touch mode, there is no focus and no selection. Any selected item in a list of in a grid becomes unselected as soon as the user enters touch mode. Similarly, any focused widgets become unfocused when the user enters touch mode.

这也是为了在一定程度上降低复杂性，减少一些意料之外的错误。我们知道在Item划出屏幕外后会被回收，假设在进入**Touch Mode**的时候我们仍选中着之前的 Item ，当这个Item滑动到屏幕之外且被回收，我们松开手指却又出发了这个Item的点击事件，这种情况处理起来就很头疼了。

#### Touch Mode中的focus：focusableInTouchMode
凡事都有例外嘛，在某些情况下，即使进入Touch Mode，我们也希望控件保持`focused`的状态，于是就有了`focusableInTouchMode`这个属性。  
比较典型的就是`EditText`，我们选中`EditText`之后，即使进行滑动，焦点仍锁定在上面。此外当ListView的`focusableInTouchMode = false`时，它的所有item都无法获得焦点，偶尔也会有这种需求嘛。  

不过，由于我们并不能准确地知道用户在使用的时候会在何时进入Touch Mode，因此官方推荐我们谨慎使用`focusableInTouchMode`这个属性。毕竟修改之后可能会在一些看不到的地方产生不一样的交互效果（比如焦点乱跳之类的），影响使用体验。

> We really encourage you to think very hard before using it. If used incorrectly, it can make your application behave differently from the rest of the system and simply throw off the user's habits.

### 两个属性的实际效果
知道了这两个属性的来龙去脉，似乎事情变得明了了起来。简单来说，`focusableInTouchMode = true`表示控件在**Touch Mode**下能取得焦点；`focusable = true`表示在其他情况下（如通过键盘）能取得焦点。两者最终的结果相同都是让控件获得焦点，只不过获得焦点的方式不同。    

对于一些需要响应点击事件的控件来说，它们默认`focusableInTouchMode = false`，因为我们希望点击控件后马上发生点击事件。比如Button，我们将其设置`focusableInTouchMode = true`，那么第一次点击会让Button获得焦点，第二次点击才会产生点击事件。  
而如EditText这样的控件，我们需要通过点击来让他获得焦点，好让系统知道“我点了EditText，因为我想要输入一些东西”，从而方便以后续的操作，比如出现光标、弹起键盘等。

以EditText为例，如果`focusable = false`，那么即使`focusableInTouchMode = true`，它也无法获取焦点。虽然EditText会在点击的一瞬间得到焦点，但是点击完后我们退出**Touch Mode**，却因为`focusable = false`，焦点无法保持在EditText上。  
反过来，当`focusable = true`，但是`focusableInTouchMode = false`的情况下，`EditText`则不能通过点击获取焦点。但是，如果使用的是虚拟机，或通过投屏软件等方法，能够用物理键盘进行操作的时候，我们仍可以通过`Tab`键切换焦点，来选中EditText，从而实现绕过**Touch Mode**来让EditText获取焦点。

|                     | focusableInTouchMode = true  | focusableInTouchMode = false |
| ------------------- | ---------------------------- | ---------------------------- |
| `focusable = true`  | Touch Mode内外都可以获取焦点 | Touch Mode外，可以获取焦点（通过键盘）   |
| `focusable = false` | 点击瞬间获取焦点，但无法保持 | 无法获取焦点                 |


### 取消 EditText 的自动 focus
在某些情况下，进入页面，会自动`focus`到`EditText`，甚至还会弹出键盘，影响体验。（我怀疑是Android版本问题，我的Android 7.0和8.0的测试机进入页面会自动focus到Edittext，但是Android 11的测试机和Android 13的虚拟机就不会） 

总之，要是真的不小心万一出现了这种自动focus的情况，我先来尝试推断一下自动focus的机制：
- 进入页面，自动focus到EditText（暂时不理会键盘是否弹起）
- 如果有两个EditText，会focus第一个EditText
- 将第一个EditText设为`focusableInTouchMode = false`，自动focus到第二个EditText
- 在EditText之前添加TextView，并设为`focusableInTouchMode = true`，自动focus到TextView

再结合EditText的两个属性默认为`true`，TextView默认为`false`的条件，我主观有余且客观不足地推断：当进入页面自动focus发生时，会focus到当前页面第一个`focusableInTouchMode = true`的控件。  
以这个特性为基础，我们来取消 EditText 的自动 focus（我试过`clearFocus()`但是失败了），比较好用的就是“曲线救国”的方式——把焦点给到别的控件。

比如我们可以给EditText之前的TextView设置为可focus的：  
```java
android:focusable="true"  
android:focusableInTouchMode="true"
```

但是这样做的缺点也比较明显，我们总不能对每个页面的渲染都了如指掌，在**LinearLayout**里还好说，如果是**RelativeLayout**，**ConstraintLayout**，那控件的渲染顺序可就千奇百怪了。  
此外，其他的控件难免有一些需求功能我们难免一下子就考虑到，比如这个TextView是能够被选中复制之类的。而且许多控件被选中之后还会有不一样的效果，比如出现光标（EditText等），比如背景色改变（TextView，Button等）。所以最好还是不要对其他控件轻易修改。  

我们能不能找到一个控件，用户基本看不到，而且没有什么特殊的功能需求呢？于是乎，我们把目光移向了EditText的父控件（布局）。这些**LinearLayout**、**RelativeLayout**啥的反正用户也看不到，而且它们进入focus状态也不会有啥效果，所以我们可以直接在父布局中设置：

```java
android:focusable="true"  
android:focusableInTouchMode="true"
```

因为父布局总能先于EditText渲染，所以这样就不会focus到EditText啦。  
当然，大部分情况下，我们可以直接两眼一闭，把**根布局**设置为可focus的，从而不用关心EditText的位置，保证该页面不会自动focus到EditText。

#### 奇怪的坑点
上面我们提到，可以在EditText的父布局（假设是个LinearLayout）中，把两个focus属性设为`true`，从而抢夺EditText的焦点。不过实际上，我们只用设置一个`focusableInTouchMode="true"`就可以让它的两个focus属性都变为`true`，Android为了维护两个focus属性的统一，会自动将`focusable`也变为`true`。这在使用代码的时候也是一样：一句`linearLayout.setFocusableInTouchMode(true)`即可。  
不过还是鼓励大家显式地设置两个属性呢，减少意料之外的错误，增强可读性，证明“我可没有忘记这个属性哦”。

但是，TextView可就不同了。如果我们仅在XML中设置了`focusable = "true"`或`focusableInTouchMode="true"`，那么是不会生效的，这个TextView的两个focus属性仍都为`false`（使用代码`textView.setFocusableInTouchMode(true)`可以成功将两个属性设为`true`）。这是由于TextView为了避免开发者出现“我忘了原来还有这个属性”而导致的一些错误，在只显式设置一个属性的情况下，会重新设置一次`focusable`：

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
| 方法                               | 作用                                 |
| ---------------------------------- | ------------------------------------ |
| view.requestFocus()                | 请求持有焦点                         | 
| view.clearFocus()                  | 清除view的焦点                       |
| view.isFocusable()                 | 判断focusable属性是否为true          |
| view.setFocusable(true)            | 将focusable属性设置为true            |
| view.isFocusableInTouchMode()      | 判断focusableInTouchMode是否为true   |
| view.setFocusableInTouchMode(true) | 将focusableInTouchMode属性设置为true |
| view.isFocused()                   | 判断view是否已获取焦点               |
| view.hasFocus()                    | 判断view和其子view是否已获取焦点     |
| view.findFocus()                   | 查找自己内部所持有焦点的View         |
| viewGroup.getFocusedChild()        | 返回mFocused所存储的成员             |

在ViewGroup中，有一个`mFocused`的View对象，它保存了当前ViewGroup中持有焦点的View对象。当然如果持有焦点的View在另一个ViewGroup，那么`mFocused`则是这个ViewGroup。
```java
//in ViewGroup.java
// The view contained within this ViewGroup that has or contains focus.  
private View mFocused;
```

举个例子，ViewGroup对象`vg1`包含另一个ViewGroup对象`vg2`，`vg2`中有个View控件`view`持有焦点。那么`vg1.mFocused = vg2`，`vg2.mFocused = view`。    
而许多Focus相关的方法都涉及到了这个`mFocused`，比如`clearFocus()`方法调用的时候，会触发`onFocusChanged()`方法，从而在视图树中从下到上调用`clearChildFocus()`，将所有ViewGroup的`mFocused = null`。最后则会从上到下再次遍历视图树，重新将焦点交给第一个`focusableInTouchMode = true`的View。  
比如我们在EditText后面加一个Button（`focusableInTouchMode = true`），它的点击事件是给自己`clearFocus()`，那么点击完之后会焦点会重新回到EditText上（就像重新进入这个页面）
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

#### 获取焦点所在的View
通常我们可以用`findFocus()` 来查找持有焦点的视图，如果是持有焦点的View调用该方法，则会返回自己；如果是持有“持有焦点的View”的ViewGroup，则会一直向下查找，最终返回持有焦点的Vew。如果大家都没持有焦点，那就返回`null`   
而`getFocusedChild()`则没有那么复杂，它直接返回ViewGroup中`mFocused`所存储的View对象，因此它也只有ViewGroup有这个方法。

addFocusables()

getFocusables()

#### 控制子View的焦点获取


## 键盘


## 参考
 1. [Googleblog：Touch Mode](https://android-developers.googleblog.com/2008/12/touch-mode.html)
 2. [Android Focusable in Touch Mode 介绍](https://cloud.tencent.com/developer/article/1014353)
 3. [Android focus概念](https://tedaliez.github.io/2020/02/14/Android-focus%E6%A6%82%E5%BF%B5/)
 4. [Android中的视图焦点Focus的详细介绍](https://www.jianshu.com/p/5fff395b9e2f)