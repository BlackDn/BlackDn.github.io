---
    layout:       post  
    title:        Android动画  
    subtitle:     逐帧动画 + 补间动画 + 属性动画！一篇全搞定！  
    date:         2021-08-03  
    auther:       BlackDn  
    header-img:   img/moriya_150_033.jpg    
    catalog:      true  
    tags:  
       - Android
---

> "喜欢那一瞬的心动，如蓝天下的一朵白云，清潭里的一抹游鱼，她发梢的晚风徐徐。"

# 安卓动画
## 前言

其实动画相关的东西在之前的Fragment的内容里也有涉及到  
之前对动画一知半解的，处于只是听过，偶尔用过的状态  
于是找了个时间把动画的东西总结了一下发出来  
好家伙，写之前我是真没想到有这么多。。。

## 前期准备

在实现动画之前我们做一下准备工作。  
搞一个新的页面，然后一个图片一个按钮，点击按钮后启动图片的动画效果。  
新建一个类作为我们展示动画的页面，我这里新建了 **AnimActivity**，其对应的布局为 **activity_anim.xml**，布局放了个ImageView作为展示动画的载体，以及一个Button用来启动动画。布局代码如下，注意`ImageView`还没有设置src图片 

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".AnimActivity">

    <ImageView
        android:id="@+id/anim_image_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"/>

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="播放动画"
        android:layout_alignParentBottom="true"
        android:onClick="btnClick"/>
</RelativeLayout>
```

然后是AnimActivity中的代码，绑定好ImageView后实现按钮的点击事件

```java
public class AnimActivity extends AppCompatActivity {
    private ImageView imageView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_anim);

        imageView = findViewById(R.id.anim_image_view);
    }
    public void btnClick(View view) {
    }
}
```

## 逐帧动画（FrameAnimation）

逐帧动画可以说是最原始的动画效果，我们提供每一帧的画面，最后让所有帧都连起来，就形成了一个动画  
像我们游戏中的FPS指的就是每秒的帧数（Frame Per Second）；注意和FPS游戏区分开，它指的是 First-Person Shooting...  

扯远了，逐帧动画需要我们准备一组图像，然后按顺序播放，就像快速翻动本子形成的动画。虽然有些繁琐，到那时中间步骤没有涉及计算算法，在某种意义上来说也很简单。  
可以用XML文件或直接用代码实现，对于逐帧动画来说，代码实现比较多。XML文件的实现步骤如下：

1. 导入每一帧的图片
2. 在drawable目录下建立animation.xml动画资源文件
3. 在animation.xml描述每一帧
4. 代码中用``加载动画文件
5. 代码中用``启动动画

### XML文件实现

导入的图片大家随便找吧，导入完后我们需要一个资源文件来说明每一帧对应的是哪个图片  
新建`drawable -> frame_anim.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="false">
    <item android:drawable="@drawable/img_1" android:duration="80"/>
    <item android:drawable="@drawable/img_2" android:duration="80"/>
    <item android:drawable="@drawable/img_3" android:duration="80"/>
    <item android:drawable="@drawable/img_4" android:duration="80"/>
    <item android:drawable="@drawable/img_5" android:duration="80"/>
</animation-list>
```

这里用到`animation-list`，其中每个`item`都代表一帧。`android:oneshot`表示图片是否只播放一次，我们选择`false`表示播放完一次后重新播放，即循环播放。最后接个图片的持续时间`duration`（ms）  

然后来到Activity里，修改点击事件，载入动画并启动。

```java
    public void btnClick(View view) {
        imageView.setBackgroundResource(R.drawable.frame_anim);
        AnimationDrawable animationDrawable = (AnimationDrawable) imageView.getBackground();
        animationDrawable.start();
    }
```

我们用 `setBackgroundResource` 载入动画资源，因为逐帧动画靠的是改变ImageView的背景，所以这里的ImageView不能设置src，否则src的图片会覆盖背景，导致资源文件里的图片无法显示，会一直傻呆呆的显示src的图片。（除非你简单粗暴地在XML里设置了ImageView的background属性）  
然后用 `AnimationDrawable` 对象获取到背景，他是`Drawable`的后代类，表示这类可以逐帧播放的图片。因为背景载入的是 `frame_anim.xml`，里面有很多图片，所以相当于拿到每一帧的图片，最后用 `start()` 方法开始将每一帧的图片载入到背景，即实现播放效果。

这里注意一点，讲道理 `setBackgroundResource` 载入动画资源的步骤应该放到初始化里，比如在`findViewById`后面，否则ImageView会一直是空白的（因为没有src和背景）。像我这样得点击按钮他才会载入图片并开始播放逐帧动画，在我点按钮前都是空白。  
主要是我想~~偷懒~~少贴点代码。放在初始化里的话，载入的是第一张图片，即`@drawable/img_1`，然后等点击按钮才会开始动。

### 代码实现

代码实现就不需要我们建XML文件了，但是相对的，需要更多的代码量来描述XML文件的内容  
直接修改按钮的点击事件

```java
    public void btnClick(View view) {
        AnimationDrawable animationDrawable = new AnimationDrawable();
        imageView.setBackground(animationDrawable);
        //利用反射获得帧图片的文件
        String packageName = this.getApplicationContext().getPackageName();
        for (int i = 1; i <= 5; i++) {
            int imgId = this.getResources().getIdentifier("img_" + i, "drawable", packageName);	//构建Id
            Drawable frame = this.getResources().getDrawable(imgId);  //根据Id找到Drawable图片文件
            animationDrawable.addFrame(frame, 80);
        }
        animationDrawable.setOneShot(false);    //循环播放
        animationDrawable.start();  //播放动画
    }
```

有许多新东西我们一一来看看  
首先，同样我们需要一个 `AnimationDrawable` 对象来存储所有的帧图片，然后用 `setBackground` 来设置ImageView的背景（这个方法的前身是`setBackgroundDrawable`，不过他被弃用了）  
然后利用反射，把所有的帧图片加到 `AnimationDrawable`里，不然的话5张图片要5行，10张图片就要写10行了，还不利于封装=。=我们这里先拿到了包名，然后用`getIdentifier()`构建每个图片Id，参数分别是`图片文件名`、`所在资源文件夹`、`包名`，最后得到的东西就和 `R.drawable.img_1` 一样，是图片的Id，毕竟 `getResources()`方法就是获取Id的。  
接着根据Id找到Drawable图片文件，把图片一个个加入`AnimationDrawable`，`addFrame()` 的参数分别是`Drawable图片`和`图片持续时间(ms)`  
最后设置是否循环播放，再用`start()`启动动画即可。

代码实现很突出的一个优点就是可以对其进行**封装**  
我们可以提出上下文（context），前缀（prefix），起始/结束后缀（start/end），持续时间（duration），是否循环播放（isOneShot）等变量，将上述播放动画的代码封装成一个方法。

```java
public void startFrameAnim(Context context, String prefix, int start, int end, int duration, boolean isOneShot) {
    AnimationDrawable animationDrawable = new AnimationDrawable();
    imageView.setBackground(animationDrawable);
    //利用反射获得帧图片的文件
    String packageName = context.getApplicationContext().getPackageName();
    for (int i = start; i <= end; i++) {
        int imgId = context.getResources().getIdentifier(prefix + i, "drawable", packageName); //构建Id
        Drawable frame = context.getResources().getDrawable(imgId); //根据Id找到Drawable图片文件
        animationDrawable.addFrame(frame, duration);
    }
    animationDrawable.setOneShot(isOneShot);    //循环播放
    animationDrawable.start();  //播放动画
}
```

这样，在点击按钮中，我们只用调用这个方法，传入对应的参数就行了

```java
public void btnClick(View view) {
	startFrameAnim(this, "img_", 1, 5, 80, false);
}
```

也就是说，只要我规定了帧图片的命名规则，那么我就可以**在其他地方（其他Activity）调用这个动画的加载方法**。甚至还可以专门写一个进行动画播放的工具类供Activity使用，实现**降低耦合**，优化代码框架。

## 补间动画（TweenAnimation）

认识Flash的宝们可能会比较熟徐补间动画，补间动画就是由我们提供**关键帧（Key Frame）**，然后电脑根据两个关键帧的图像位置，进行差值运算，自动生成关键帧之间的帧。所以叫补间动画，自动补充中间的部分嘛。像我以前玩过MMD，用的都是补间动画。    
不过补间动画的本质也是逐帧动画，区别在于中间的帧是自动生成的，而非我们提供的。

实现比较简单，因为我们只用规定其初始和结束两个状态就行了，用XML文件实现动画的大致步骤如下。  
注意这里要给ImageView设置**src属性**了，不然都没个图片，动画效果都看不到=。=

1. 资源目录下建立文件夹，通常为res -> anim
2. 建立动画资源文件，如animation.xml
3. 在文件中描述动画属性
4. 调用 `AnimationUtils.loadAnimation` 载入动画文件
5. 使用View的 `startAnimation`启动动画

当然还可以用代码实现，优缺点也很明显，XML文件可以复用很方便，而直接用代码实现易读性比较高，方便维护。

### 渐变动画（AlphaAnimation）

渐变动画改变的是控件的透明度（alpha），偶尔我们会使用ARGB的颜色系统，第一个A就代表alpha透明度。比如 `#00000000` ，前两个0就表示透明度为100%，这是个透明的颜色。    

#### XML文件实现

先说使用XML文件来进行动画的实现，新建动画资源文件 res -> anim -> alpha_anim.xml，代码如下

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <alpha
        android:fromAlpha="0.1"
        android:toAlpha="1"
        android:duration="2000"
        android:repeatCount="2"/>
</set>
```

其中，`fromAlpha`和`toalpha`分别表示起始透明度和结束透明度，`duration` 表示持续时间（ms），`repeatCount` 表示重复次数（第一次不算，所以一共会进行3次动画）  
之所以是补间动画，因为我们只规定了起始和结束透明度，而在这2秒的时间内，系统会自动帮我们补充动画的过渡效果。  
最后修改按钮的点击事件

```java
    public void btnClick(View view) {        imageView.clearAnimation(); //清除动画        Animation animation = AnimationUtils.loadAnimation(this, R.anim.alpha_anim);        imageView.startAnimation(animation);    }
```

一开始先用`clearAnimation()`清除一下ImageView正在进行的动画。如果用户点击太快，我们的动画还没执行完，会导致动画的一个叠加，往往效果会在我们的意料之外，所以每次点击时最好都清除一下动画效果。  
我们利用 `AnimationUtils.loadAnimation` 载入我们的动画，参数分别是**上下文Context**和我们的**动画资源文件**，然后产生一个 `Animation` 对象  
最后我们可以直接让ImageView启用这个`Animation`对象来实现动画。

#### 代码实现

代码实现其实也很简单，就是不需要创建XML动画资源文件了，我们可以直接修改按钮点击事件

```java
    public void btnClick(View view) {        imageView.clearAnimation(); //清除动画        Animation animation = new AlphaAnimation(0.1f, 1.0f);        animation.setDuration(2000);        animation.setRepeatCount(2);        imageView.startAnimation(animation);    }
```

同样是启用 `Animation` 对象，不过这次我们不再调用工具类载入动画资源，而是实例化一个新的 `AlphaAnimation` 对象，参数分别是**起始透明度**和结束透明度，注意要是float类型  
然后再设置一下动画的持续时间和重复次数，效果和XML里的属性一样一样的。

这里用到的 `AlphaAnimation` 是 `Animation` 的一个子类，包括之后用到的`ScaleAnimation` 等也都是，分别对应不同的动画类型。

### 缩放动画（ScaleAnimation）

缩放动画针对的是控件的宽高和原来的一个倍数变化，比如变为原来的2倍或0.5倍之类的

#### XML文件实现

新建 res -> anim -> scale_anim.xml

```xml
<?xml version="1.0" encoding="utf-8"?><set xmlns:android="http://schemas.android.com/apk/res/android">    <scale        android:fromXScale="0"        android:fromYScale="0"        android:toXScale="2.0"        android:toYScale="2.0"        android:pivotX="50%"        android:pivotY="50%"        android:duration="2000"/></set>
```

`fromX/YScale` 是初始状态的宽高大小，这里设置为0表示一开始的宽高是0，就是从一个点开始放大。  
`toX/YScale` 是结束状态的宽高大小，这里2.0表示结束的时候宽高为原图片的两倍。  
`pivotX/Y` 表示伸缩的参考点，这里是50%，表示宽和高分别以中间位置为参考点，向两边/上下放大，即初始状态、原图片、最终状态的宽高中间位置是对齐的。如果`pivotX` 设置为0，则以最左边为参考点，向右边拉伸放大，即初始状态、原图片、最终状态的宽最左位置是对其的。  
这里设置了持续时间是2秒，没有设置重复次数所以只会执行一次动画。

#### 代码实现

同样，不需要XML，我们只用修改点击事件里的代码

```java
    public void btnClick(View view) {        imageView.clearAnimation(); //清除动画                Animation animation = new ScaleAnimation(0.0f, 2.0f, 0.0f, 2.0f,                Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);        animation.setDuration(2000);        animation.setRepeatCount(2);        imageView.startAnimation(animation);    }
```

这里用的子类是 `ScaleAnimation` ，他的前四个参数分别表示 `fromXScale`，`toXScale`，`fromYScale`，`toYScale` ，都是float类型  
之后的两个参数表示`android:pivotX="50%"`，其中 `Animation.RELATIVE_TO_SELF` 表示以自身为参照，后面的 `0.5f` 就表示50%，合起来就是**以自身宽度的50%为放缩参照点**。这里稍微麻烦了点，因为前面这个参数还可以以Parent为参照...  
同理，最后的两个参数就表示`android:pivotY="50%"`

###  平移动画（TranslateAnimation）

平移动画实际上就是设定X轴/Y轴方向上的移动情况

#### XML文件实现

新建 res -> anim -> trans_anim.xml

```xml
<?xml version="1.0" encoding="utf-8"?><set xmlns:android="http://schemas.android.com/apk/res/android">    <translate        android:fromXDelta="100%"        android:fromYDelta="0"        android:toXDelta="0"        android:toYDelta="0"        android:duration="2000"/></set>
```

平移动画里，X/Y的起始位置和结束位置的参数比较讲究，对于一个控件来说，X/Y坐标原点就是其**左下角**。  
上面X轴起始位置使用的是 `100%` ，这个百分比是相对于控件本身来说的，实际上转化为数值就是这个控件自身的宽度。也就是动画开始后，图片的起始位置实际上是原本图片的最右侧位置，即动画开始后，图片从右侧开始往左移动，这个距离为自身宽度（`100%` ）  
同理，如果是`50%`或者`200%`，就表示右侧距离一半或者两倍的自身宽度。  
这里还可以使用具体的像素数值，比如`1080`，表示从右侧1080像素位置开始移动，可以实现从屏幕外进入屏幕的效果。  
由于原点位于原本图片的左下角，所以正数的参数代表右侧，我们也可以输入负数参数表示左侧，比如 `-1080` 就表示从左侧距离`1080`像素的位置开始移动

然后在点击事件中修改传入的资源文件

```java
    public void btnClick(View view) {        imageView.clearAnimation(); //清除动画        Animation animation = AnimationUtils.loadAnimation(this, R.anim.trans_anim);        imageView.startAnimation(animation);    }
```

#### 代码实现

```java
public void btnClick(View view) {    imageView.clearAnimation(); //清除动画    Animation animation = new TranslateAnimation(1080, 0,0,0);    animation.setDuration(2000);    animation.setRepeatCount(2);    imageView.startAnimation(animation);}
```

子类`TranslateAnimation` 的构造方法中，四个参数分别代表 `fromXDelta`，`toXDelta`，`fromYDelta`，`toYDelta` 

### 旋转动画（RotateAnimation）

旋转动画就是旋转，我们可以给定初始和结束位置的角度、旋转的定点，就可以实现旋转效果  
像某些音乐app里，播放歌曲的页面往往会有唱片旋转的效果，就是这样实现的

#### XML文件实现

新建 res -> anim -> rotate_anim.xml

```xml
<?xml version="1.0" encoding="utf-8"?><set xmlns:android="http://schemas.android.com/apk/res/android">    <rotate        android:fromDegrees="0"        android:toDegrees="360"        android:pivotX="50%"        android:pivotY="50%"        android:duration="2000"/></set>
```

这几个属性都比较好理解，`fromDegrees`和`toDegrees`分别代表起始和结束位置的角度，一般是0~360，表示转一圈。  
`pivotX` 和 `pivotY` 就是旋转的定点，都是50%，就是绕着中心点转。

修改按钮点击事件，换个资源文件

```java
    public void btnClick(View view) {        imageView.clearAnimation(); //清除动画        Animation animation = AnimationUtils.loadAnimation(this, R.anim.rotate_anim);        imageView.startAnimation(animation);    }
```

#### 代码实现

```java
public void btnClick(View view) {    imageView.clearAnimation(); //清除动画    Animation animation = new RotateAnimation(0f, 360f,     		Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);    animation.setDuration(2000);    animation.setRepeatCount(2);    imageView.startAnimation(animation);}
```

同理，用的是`RotateAnimation`，参数分别表示`fromDegrees`，`toDegrees`，`pivotX`，`pivotY`

### 设置Intent切换Activity的动画

接下来我们来实际替换一下Activity切换的时候的动画。这里补充一句，我用虚拟机的时候会出问题，动画效果没有显示出来，用真机调试就没有问题，所以如果动画没有显示的话可以换真机试试。

#### XML动画资源文件

对于动画资源文件，我们需要定义两个，分别代表**新Activity进入的动画**和**旧Activity退出的动画**  
这里就简单做一个移动过渡的动画  
先设置**进入动画**效果，新建 res -> anim -> trans_in.xml

```xml
<?xml version="1.0" encoding="utf-8"?><set xmlns:android="http://schemas.android.com/apk/res/android"    android:interpolator="@android:anim/accelerate_interpolator">    <translate        android:fromXDelta="100%"        android:fromYDelta="0"        android:toXDelta="0"        android:toYDelta="0"        android:duration="2000"/></set>
```

因为这里动画的作用对象是Activity，所以用`100%` 正好是整个屏幕的宽度  
效果就是新Activity从右往左进入。为了更明显体现动画效果这里时间设置长一点，为2秒。

接下来是**退出动画**，新建 res -> anim -> trans_out.xml  
注意退出动画的对象是旧的Activity，我们要让他往左移动直到整体移出屏幕，所以终点X坐标设置为`-100%`

```xml
<?xml version="1.0" encoding="utf-8"?><set xmlns:android="http://schemas.android.com/apk/res/android"    android:interpolator="@android:anim/accelerate_interpolator">    <translate        android:fromXDelta="0"        android:fromYDelta="0"        android:toXDelta="-100%"        android:toYDelta="0"        android:duration="2000"/></set>
```

上面都用到了 `android:interpolator` 这个属性，即插值器，用来控制动画的执行速率。买一送一，在下面会介绍一下这玩意。

#### 调用动画

说是调用，实际上是一个覆盖，毕竟系统本来就有默认的动画效果。要使用我们自己的动画效果也十分简单，在`startActivity`用一句`overridePendingTransition`就可以实现了。  
我们还是修改按钮的点击事件，反正用`Intent`搞个跳转Activity，能看到动画就行了

```java
    public void btnClick(View view) {        Intent intent = new Intent(this, MainActivity.class);        startActivity(intent);        overridePendingTransition(R.anim.trans_in, R.anim.trans_out);    }
```

注意`overridePendingTransition`一定要在`startActivity`之后调用，不然是没有效果的。

### 插值器 Interpolator

插值器本质上是一个数学函数，用于控制动画的执行速率。比如控制动画匀速播放、加速/减速播放、先加速后减速播放等，都是由插值器实现的。  
在上面的动画资源文件中，我们用到了`android:interpolator`属性，它就是对插值器的设置。 

实际上每个系统提供的插值器都有一个类来表示，所以像之前我们不写XML文件而纯用代码实现的话，设置插值器就可以用如下方式：（以越来越快为例）

```java
animation.setInterpolator(new AccelerateInterpolator());
```

系统提供的插值器有以下几种，都可以分别用XML属性或用代码设置。如果不设置，默认使用`AccelerateDecelerateInterpolator`（先快后慢）的插值器

| 效果                       | 代码                               | XML属性                                          |
| -------------------------- | ---------------------------------- | ------------------------------------------------ |
| 先快后慢（默认）           | AccelerateDecelerateInterpolator() | @android:anim/accelerate_decelerate_interpolator |
| 越来越快                   | AccelerateInterpolator()           | @android:anim/decelerate_interpolator            |
| 越来越慢                   | DecelerateInterpolator()           | @android:anim/accelerate_decelerate_interpolator |
| 匀速                       | LinearInterpolator()               | @android:anim/linear_interpolator                |
| 先后退再向前加速           | AnticipateInterpolator()           | @android:anim/anticipate_interpolator            |
| 快速超出终点一段再回到终点 | OvershootInterpolator()            | @android:anim/overshoot_interpolator             |
| 超出终点一段再回到终点     | AnticipateOvershootInterpolator()  | @android:anim/anticipate_overshoot_interpolator  |
| 弹几下回到终点             | BounceInterpolator()               | @android:anim/bounce_interpolator                |

基本上系统提供的插值器就能满足平时需求，当然我们也可以自定义插值器，这里就不深入探讨了，具体可以看看参考的博客。

## 属性动画（Property Animation）

属性动画是Android 3.0 提供的动画模式，是补间动画的扩展，甚至可以代替补间动画。  
补间动画存在许多缺陷，比如“只能对View进行操作”，“只有渐变、缩放、平移、旋转四个动画”，“只改变View的显示缺不改变属性”等。比如移动一个按钮，虽然看起来按钮移动了，但是还是要点击按钮的原本位置才能触发点击事件。即看起来位置变了，实际上没有。

属性动画之所以叫属性动画，就是他实现了属性的改变。我们设定动画时长、类型、初始值、结束值即可。属性动画根据内容不断改变值，并将值赋给属性，从而实现有动画效果的同时还修改了属性。

### 基础使用：ObjectAnimator

好的，因为属性动画的实现依靠的是全新的类，所以我们得把之前几个动画的代码推翻重做...  
属性动画的核心类是 `ValueAnimator`，比如下面的代码实现了将一个值从0到3到1的平滑改变：

```java
        ValueAnimator animator = ValueAnimator.ofFloat(0f, 3f, 1f);        animator.start();
```

实际上`ofFloat`后面可以传入任意多个参数，这个值会按顺序进行平滑变化，比如`ofFloat(0f, 3f, 1f, 2f, 5f...)`  
但是呢，显然我们很少用到一个值的改变，说好的动画呢？更多时候我们需要修改一个对象的某个属性值，所以用到最多的还是 `ObjectAnimator` 类  
不过由于`ObjectAnimator`继承了`ValueAnimator`，所以我们还是认为`ValueAnimator`是属性动画的核心类。  
那么如何用`ObjectAnimator`来修改对象的属性值呢？还记得上面我们有个ImageView吧，我们来修改他的透明度吧

```java
    public void btnClick(View view) {        		ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(imageView, "alpha", 1f, 0f, 1f);        objectAnimator.setDuration(2000);        objectAnimator.start();    }
```

虽然是`ObjectAnimator`，不过还是`ofFloat`方法，传入的参数分别**对象、属性、变化值（任意多个）**。然后我们设置了动画的持续时间（`ValueAnimator`也可以设置事件），并启动动画。这里就体现了属性动画和之前的动画不同的地方：我们在补间动画中实现淡入淡出效果的时候是修改其颜色（RGBA），在这里则是直接修改透明度（alpha）  
所以只要我们修改属性内容，就可以实现许多动画效果  
比如旋转：`ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(imageView, "rotation", 0f, 360f);`    
比如纵向放大：`ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(imageView, "scaleY", 1f, 3f, 1f);`  

看起来很神奇，仔细一想，`ObjectAnimator`是怎么根据传入的属性值来确定要修改哪个属性呢？又有哪些属性值可以用来传入呢？  
实际上，我们用 `alpha` 调整透明度，但是`ImageView`本身是没有这个属性的，不过作为他的父类，`View` ，有这个属性（这一点和郭霖的博客有所出入，查了下应该是Android 3.0新加入的）。此外，`View` 还有该属性的getter和setter方法，即 `public float getAlpha()` 和 `public void setAlpha(float value)`，而这则是属性动画找到对应属性的依据  
同理，也是因为`View`有`getRotation()` 和 `setRotation()`方法，我们才能实现旋转效果；有`getScaleX()`、`setScaleX` 和 `getScaleY()`、`setScaleY()`才能......等等

#### 组合使用：AnimatorSet

上面展现了属性动画的简单使用，不过仅实现了单个动画效果，如果要两个动画效果一起实现要怎么做呢？  
这里就需要用到`AnimatorSet`这个类，他的`play()`方法返回一个`AnimatorSet.Builder`实例，他有四个方法来帮助我们决定两个动画要如何实现

| 方法                  | 作用                               |
| --------------------- | ---------------------------------- |
| after(Animator anim)  | 将现有动画插入到传入的动画之后执行 |
| after(long delay)     | 将现有动画延迟指定毫秒后执行       |
| before(Animator anim) | 将现有动画插入到传入的动画之前执行 |
| with(Animator anim)   | 将现有动画和传入的动画同时执行     |

比如我们让我们的`ImageView`边淡入淡出边旋转

```java
    public void btnClick(View view) {                ObjectAnimator fadeInOutAnim = ObjectAnimator.ofFloat(imageView, "alpha", 1f, 0f, 1f);        ObjectAnimator rotateAnim = ObjectAnimator.ofFloat(imageView, "rotation", 0f, 360f);        AnimatorSet animatorSet = new AnimatorSet();        animatorSet.play(rotateAnim).with(fadeInOutAnim);        animatorSet.setDuration(2000);        animatorSet.start();    }
```

#### XML文件事件使用

和补间动画类似，属性动画也可以通过XML文件实现。虽然代码量变多了，但是更易于重用。我们在res目录下面新建animator文件夹用于存放属性动画的资源。  
我们尝试用XML文件实现上面组合实现的动画效果：边淡入淡出边旋转  
新建`res -> animator -> anim_property.xml`

```xml
<?xml version="1.0" encoding="utf-8"?><set xmlns:android="http://schemas.android.com/apk/res/android"    android:ordering="together">    <objectAnimator        android:duration="2000"        android:propertyName="rotation"        android:valueFrom="0"        android:valueTo="360"        android:valueType="floatType"/>    <set android:ordering="sequentially">        <objectAnimator            android:duration="1000"            android:propertyName="alpha"            android:valueFrom="1"            android:valueTo="0"            android:valueType="floatType"/>        <objectAnimator            android:duration="1000"            android:propertyName="alpha"            android:valueFrom="0"            android:valueTo="1"            android:valueType="floatType"/>    </set></set>
```

可以看到，XML中的标签实际上就对应了各个类，`<objectAnimator>`对应了`ObjectAnimator`，`<set>`对应了`AnimatorSet`（还有`<animator>`对应了`ValueAnimator`，不过用的比较少）  
不过要注意我们要把透明度从0 -> 1和从 1 -> 0的过程分开来写成两个`<objectAnimator>`  
最后在代码中载入这个XML文件，修改点击事件：

```java
    public void btnClick(View view) {                Animator animator = AnimatorInflater.loadAnimator(this, R.animator.anim_property);        animator.setTarget(imageView);        animator.start();    }
```

这里就比较简单了，用`AnimatorInflater`传入上下文Context和XML文件，设置目标对象，最后启用动画。

### 应用于非控件对象

属性动画的一大特点就是可以对非控件对象（非View对象）使用。我们仿照[郭霖的博客](https://blog.csdn.net/guolin_blog/article/details/43816093)里，对一个Point类进行属性的变换。  
首先我们写一个Point类，有x和y两个变量用于记录坐标的位置

```java
public class Point {    private float x;    private float y;	//constructor    public Point(float x, float y) {        this.x = x;        this.y = y;    }	//getter     public float getX() {        return x;        public float getY() {        return y;    }}
```

#### 动画过程：TypeEvaluator

在此之前，我们先看看属性动画是如何控制动画的执行过程的。在之前的动画中我们知道，属性动画默认是一个平滑过度，即匀速执行动画。那他是怎么实现的呢？这就要用到`TypeEvaluator`  
之前，我们使用的是`ofFloat()`方法，他会自动调用系统的`FloatEvaluator`，我们来看看源码

```java
public class FloatEvaluator implements TypeEvaluator<Number> {    public Float evaluate(float fraction, Number startValue, Number endValue) {        float startFloat = startValue.floatValue();        return startFloat + fraction * (endValue.floatValue() - startFloat);    }}
```

实际上`FloatEvaluator`实现了`TypeEvaluator`接口，重写`evaluate()`方法，传入三个参数，分别是表示动画的完成度的`fraction`，初始值，结束值。  
`FloatEvaluator`用结束值减初始值得到差值，然后乘以`fraction`这个系数，再加上初始值，那么就得到当前动画的值了。  

`ValueAnimator`的`ofFloat()`和`ofInt()`方法分别用于浮点型和整型的数据进行动画操作，此外他还有一个`ofObject()`方法，用于对任意对象进行动画操作的。但如果调用这方法，系统会不知道如何计算动画的过度过程，因此就要我们自己实现`TypeEvaluator`。  
于是乎我们定义`PointEvaluator`来对Point类进行动画过程的计算。

```java
public class PointEvaluator implements TypeEvaluator {    @Override    public Object evaluate(float fraction, Object startValue, Object endValue) {        Point startPoint = (Point) startValue;        Point endPoint = (Point) endValue;        float x = startPoint.getX() + fraction * (endPoint.getX() - startPoint.getX());        float y = startPoint.getY() + fraction * (endPoint.getY() - startPoint.getY());        Point point = new Point(x, y);        return point;    }}
```

逻辑大同小异，我们用更改后新的Point替换旧的Point，实现这个Point对象x，y坐标的修改。  
在代码中新建两个Point作为起始值和结束值，调用`ofObject()`方法即可实现Point对象的属性动画效果。不过这个方法要把我们之前定义的`PointEvaluator`对象作为参数传入。

```java
    public void btnClick(View view) {        Point startPoint = new Point(0,0);        Point endPoint = new Point(300, 300);        ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), startPoint,endPoint);        anim.setDuration(2000);        anim.start();    }
```

#### 将Point应用于自定义View：ValueAnimator的高级用法

此处内容来源于[郭霖的博客](https://blog.csdn.net/guolin_blog/article/details/43816093)，实现一个平移的动画效果。  
我们新建一个自定义View`MyAnimView`，其中根据一个Point对象，来画出一个圆，并使这个圆从左上角移动到右下角。  
（在布局中应用这个自定义View即可，这里就不放代码了，具体可见原博客）

```java
public class MyAnimView extends View {    public static final float RADIUS = 50f;    private Point currentPoint;    private Paint mPaint;    public MyAnimView(Context context, @Nullable AttributeSet attrs) {        super(context, attrs);        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);        mPaint.setColor(Color.BLUE);    }    @Override    protected void onDraw(Canvas canvas) {        if (currentPoint == null) {            currentPoint = new Point(RADIUS, RADIUS);            drawCircle(canvas);            startAnimation();        } else {            drawCircle(canvas);        }    }    public void drawCircle(Canvas canvas) {        float x = currentPoint.getX();        float y = currentPoint.getY();        canvas.drawCircle(x, y ,RADIUS, mPaint);    }    public void startAnimation() {        Point startPoint = new Point(RADIUS, RADIUS);        Point endPoint = new Point(getWidth() - RADIUS, getHeight() - RADIUS);        ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), startPoint,endPoint);        anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {            @Override            public void onAnimationUpdate(ValueAnimator animation) {                currentPoint = (Point) animation.getAnimatedValue();                invalidate();            }        });        anim.setDuration(2000);        anim.start();    }}		
```

我们用一个Point作为圆心（currentPoint），用一个Paint画笔来画圆。  
一开始载入View，我们的`currentPoint`为空，我们在初始位置画出一个圆，进入`startAnimation()`方法，其中采用属性动画方式，修改Point的坐标值。同时这里用`addUpdateListener()`方法设置了一个监听器，每次修改`currentPoint`的属性值（x和y）后调用`invalidate()`方法重新用`onDraw()`绘制View。  
重新绘制View时，`currentPoint`不为空，因此直接根据当前`currentPoint`的x，y来绘制新的圆，重复过程知道动画结束。  
这样就实现了这个圆移动的动画效果。区别于其他动画，我们仅修改了圆心的坐标，而非对整个圆添加动画效果。同时这也是**ValueAnimator的高级用法**。

#### 动态改变颜色：ObjectAnimator的高级用法

我们继续实现一些补间动画无法实现的功能，比如上面这个移动的圆，我们能不能在他运动的过程中改变他的颜色呢？  
之前我们用过`ObjectAnimator`，他可以根据传参来达到修改属性的目的，前提是这个属性有getter和setter。  
于是我们在`MyAnimView`中定义一个Color属性，这里用字符串形式来表达RGB颜色。注意setter里，改变颜色后用`invalidate()`重新绘制。

```java
public class MyAnimView extends View {	······    private String color;    public String getColor() {        return color;    }    public void setColor(String color) {        this.color = color;        mPaint.setColor(Color.parseColor(color));        invalidate();    }    ······}
```

然后我们想用`ObjectAnimator`来修改color这个属性，但是别忘了，我们需要编写一个`TypeEvaluator`来说明两种颜色是如何变化的。  
新建`ColorEvaluator`，他的代码虽然很多，但是还是比较好理解的，别怕别怕，不想看可以不看的，不影响咱理解属性动画。

```java
public class ColorEvaluator implements TypeEvaluator {    private int mCurrentRed = -1;    private int mCurrentGreen = -1;    private int mCurrentBlue = -1;    @Override    public Object evaluate(float fraction, Object startValue, Object endValue) {        //颜色初值和终值        String startColor = (String) startValue;        String endColor = (String) endValue;        int startRed = Integer.parseInt(startColor.substring(1, 3), 16);        int startGreen = Integer.parseInt(startColor.substring(3, 5), 16);        int startBlue = Integer.parseInt(startColor.substring(5, 7), 16);        int endRed = Integer.parseInt(endColor.substring(1, 3), 16);        int endGreen = Integer.parseInt(endColor.substring(3, 5), 16);        int endBlue = Integer.parseInt(endColor.substring(5, 7), 16);        // 初始化颜色的值        if (mCurrentRed == -1) {            mCurrentRed = startRed;        }        if (mCurrentGreen == -1) {            mCurrentGreen = startGreen;        }        if (mCurrentBlue == -1) {            mCurrentBlue = startBlue;        }        // 计算初始颜色和结束颜色之间的差值        int redDiff = Math.abs(startRed - endRed);        int greenDiff = Math.abs(startGreen - endGreen);        int blueDiff = Math.abs(startBlue - endBlue);        int colorDiff = redDiff + greenDiff + blueDiff;        if (mCurrentRed != endRed) {            mCurrentRed = getCurrentColor(startRed, endRed, colorDiff, 0,                    fraction);        } else if (mCurrentGreen != endGreen) {            mCurrentGreen = getCurrentColor(startGreen, endGreen, colorDiff,                    redDiff, fraction);        } else if (mCurrentBlue != endBlue) {            mCurrentBlue = getCurrentColor(startBlue, endBlue, colorDiff,                    redDiff + greenDiff, fraction);        }        // 将计算出的当前颜色的值组装返回        String currentColor = "#" + getHexString(mCurrentRed)                + getHexString(mCurrentGreen) + getHexString(mCurrentBlue);        return currentColor;    }    /**     * 根据fraction值来计算当前的颜色。     */    private int getCurrentColor(int startColor, int endColor, int colorDiff,                                int offset, float fraction) {        int currentColor;        if (startColor > endColor) {            currentColor = (int) (startColor - (fraction * colorDiff - offset));            if (currentColor < endColor) {                currentColor = endColor;            }        } else {            currentColor = (int) (startColor + (fraction * colorDiff - offset));            if (currentColor > endColor) {                currentColor = endColor;            }        }        return currentColor;    }    /**     * 将10进制颜色值转换成16进制。     */    private String getHexString(int value) {        String hexString = Integer.toHexString(value);        if (hexString.length() == 1) {            hexString = "0" + hexString;        }        return hexString;    }}
```

首先在我们得到颜色的初始值和结束值，对其进行字符串截取将颜色分为RGB三个部分，并转换成十进制，即每个颜色的取值范围是0-255。  
然后计算颜色初始值和结束值之间的差值（colorDiff），他决定颜色变化的快慢，如果差值小，说明颜色接近，颜色变化就会比较缓慢，反之则变化快。 这具体由`getCurrentColor()`实现，他根据`fraction`计算目前应过度到什么颜色，并根据差值来控制变化速度。  
最后，用`getHexString()`方法把我们的十进制颜色变为十六进制，再将RGB三种颜色拼装，作为最终的结果返回。  
最后调用就用之前`ObjectAnimator`的`ofObject()`方法，记得根据Id绑定控件`myAnimView`，传入属性参数“color”，传入`ColorEvaluator`对象，起始颜色（蓝色#0000FF）和结束颜色（红色#FF0000）

```java
        ObjectAnimator anim = ObjectAnimator.ofObject(myAnimView, "color", new ColorEvaluator(), "#0000FF", "#FF0000");        anim.setDuration(2000);        anim.start();
```

好像有哪里不对······  
咦，这样我的颜色虽然会变，但是之前的平移动画怎么办？  
因为他们是两个动画，所以需要进行一个动画的组合，有请我们的好伙伴`AnimatorSet`  
来到`MyAnimView`的`startAnimation()`方法

```java
public void startAnimation() {    //改变Point坐标动画（ValueAnimator）    Point startPoint = new Point(RADIUS, RADIUS);    Point endPoint = new Point(getWidth() - RADIUS, getHeight() - RADIUS);    ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), startPoint,endPoint);    anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {        @Override        public void onAnimationUpdate(ValueAnimator animation) {            currentPoint = (Point) animation.getAnimatedValue();            invalidate();        }    });    //改变颜色动画（ObjectAnimator）    ObjectAnimator colorAnim = ObjectAnimator.ofObject(this, "color", new ColorEvaluator(), "#0000FF", "#FF0000");	//组合动画（AnimatorSet）    AnimatorSet animatorSet = new AnimatorSet();    animatorSet.play(anim).with(colorAnim);    animatorSet.setDuration(2000);    animatorSet.start();}
```

现在我们有两个动画，分别是改变Point坐标的`anim`和改变颜色的`colorAnim`，然后用`AnimatorSet`让两个动画一起进行

### Interpolator 差值器

这东西听起来是不是很眼熟，他本质上和补间动画的差值器是一样的，控制动画的变化速率，这里就来看看在属性动画中如何设置这玩意。  
因为属性动画是3.0新增的，在这之前就有了`Interpolator`接口，为了兼容，3.0同时新增了`TimeInterpolator`接口，他有很多实现类我们可以直接拿来使用。比如`AccelerateInterpolator`就是加速，`DecelerateInterpolator`就是减速，同样默认是先加速后减速的`AccelerateDecelerateInterpolator`，这也和补间动画相同。

我们修改之前的代码，换一个`Interpolator`，模拟小球竖直落下然后弹起的效果。

```java
public void startAnimation() {    //改变Point坐标动画（ValueAnimator）    Point startPoint = new Point(getWidth() / 2, RADIUS);    Point endPoint = new Point(getWidth() / 2, getHeight() - RADIUS);    ······	//两个动画设置不变    //在start()方法前，修改Interpolator    anim.setInterpolator(new BounceInterpolator());	    ······}
```

如果想继续学习`Interpolator`，然后自定义`Interpolator`，可以看[郭霖的博客](https://blog.csdn.net/guolin_blog/article/details/44171115)，这里就不深入了。

### ViewPropertyAnimator

这个东西是Android 3.1新增的一个小玩意，主要是用于简化属性动画的代码使用。  
3.0推出属性动画后，属性动画越来越得到大家的青睐，但是好像又觉得， `ObjectAnimator animator = ObjectAnimator.ofFloat(image, "alpha", 1f, 0f...);` 这样的代码用起来挺麻烦的，要将对象、属性、变化值，都传入方法当中，似乎有悖于面向对象的思维。

于是推出了`ViewPropertyAnimator`，在[官方文档](https://developer.android.com/guide/topics/graphics/prop-animation#view-prop-animator)中，这样说道：

> “`ViewPropertyAnimator` 有助于使用单个底层 `Animator` 对象轻松为 `View` 的多个属性并行添加动画效果。它的行为方式与 `ObjectAnimator` 非常相似，因为它会修改视图属性的实际值，但在同时为多个属性添加动画效果时，它更为高效。此外，使用 `ViewPropertyAnimator` 的代码更加简洁，也更易读。”

怎么轻松高效，简洁易读呢？我们来试试，回到之前的`ImageView`页面，我想让他透明度变为0，可以使用如下的一句代码：

```java
    public void btnClick(View view) {       imageView.animate().alpha(0f).setDuration(2000).setInterpolator(new AccelerateInterpolator()).start();     }
```

很显然，`ViewPropertyAnimator`使用了连缀语法来进行代码上的简化，每个方法的返回值都是它自身的实例，也是典型的**建造者模式**。  
`animate()`方法会创建并返回一个`ViewPropertyAnimator`的实例，之后进行方法调用，属性设置都是通过这个实例完成。  
事实上，使用`ViewPropertyAnimator`的时候，就算最后没有显示调用`start()`，动画也会自动启动。不过如果我们不断地连缀新的方法，那么动画就不会立刻执行，而是等到所有在`ViewPropertyAnimator`上设置的方法都执行完毕后，再启动动画。

## 后话

好家伙，写属性动画的时间比逐帧动画和补间动画加起来都多  
还好有郭霖的博客，不然就跟无头苍蝇一样乱  
不过官方文档里也有关于属性动画的介绍，还有专门一篇博客介绍，有兴趣可以去看看  

## 参考

1. [孙老师课堂](https://www.bilibili.com/video/BV1Px411j7cq?p=4)
2. [安卓动画插值器 Interpolator](https://blog.csdn.net/hy19901026/article/details/64923278)
3. [Android动画中Interpolator 详解和演示](https://www.cnblogs.com/ldq2016/p/6879566.html)
4. [郭霖：Android属性动画完全解析](https://blog.csdn.net/guolin_blog/article/details/43536355)
5. [Android属性动画](https://www.jianshu.com/p/6dd6c89220d9)
6. [develepors：属性动画概览](https://developer.android.com/guide/topics/graphics/prop-animation)
7. [Introducing ViewPropertyAnimator](https://android-developers.googleblog.com/2011/05/introducing-viewpropertyanimator.html)

