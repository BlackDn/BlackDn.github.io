---
   layout:       post  
   title:        Fragment的使用及其过渡动画  
   subtitle:     小小Fragment，大大用处  
   date:         2021-06-02  
   auther:       BlackDn  
   header-img:   img/moriya_150_021.jpg    
   catalog:      true  
   tags:  

       - Android
---

   > "见惯了量产的温柔 ，对笨拙的真诚才会格外动心。"

   # 前言

   怎么说呢，其实本来是像把 Fragment 和 底部导航栏一起写的

   但是一开始写 Fragment 就有点守不住了，好多啊这东西  

   所以写着写着又变成一篇教程了......

   至于底部导航栏，就预定一下篇吧，反正也有很多实现方式，不缺内容的。

   # Fragment 

   Fragment 相信大家都不陌生，是一种可以嵌入在活动中的UI片段，出现的初衷是为了适应大屏幕的平板电脑，从而充分利用屏幕控件。

   不过到后来即便是屏幕较小的手机也逐渐开始使用，因为 Fragment 可以灵活实现页面的跳转，能依靠 Activity 进行方便地管理和操作。

   如今 Fragment 已经加入 AndroidX 包了，可以很方便地将其应用到项目中。

   ## Fragment 的基本使用

   Fragment不能独立存在，必须依赖于 Activity 或另一个 Fragment 。[官方手册](https://developer.android.com/guide/fragments)中说，Fragment 的视图层次结构会成为宿主的视图层次结构的一部分，或附加到宿主的视图层次结构。

   不过我觉得看起来有些深奥，不好理解。其实我们可以把 Fragment 理解成 Activity 的一个布局控件。  
   只不过这个控件比较高级，有着自己的布局、数据、生命周期等。

   ### 使用 Fragment 的前期准备

   接下来我们着手学习如何使用Fragment，先把布局之类的一些准备工作做好。

   ####  1. Fragment 的布局

   首先当然是 Fragment 的布局，我们随便写个简单的布局，命名为fragment_example.xml  
   中间放个按钮就好了：

   ```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- in fragment_example.xml -->
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/example_fragment_btn"
        android:text="example fragment"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:onClick="clickExampleBtn"
        />
</RelativeLayout>
   ```

   onClick的点击事件我们先放着，之后再用

   ####  2. Fragment 类

   有了布局就得有类，我们新建一个 class 叫 **ExampleFragment**， 我们在其中进行布局的绑定。  
   很多博客在这一块的代码是像下面这样的：

   ```java
//in ExampleFragment.java
public class ExampleFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_example, container, false);
        return view;
    }
}
   ```

   这个比较好理解，其实就是重写 **Fragment** 的 **onCreateView方法**， 其中用 **inflater** 将布局载入到这个Fragment中。

   不过，在[官方手册](https://developer.android.com/guide/fragments)中，我们发现代码是这样的：

   ```java
//in ExampleFragment.java
public class ExampleFragment extends Fragment {
    public ExampleFragment() {
        super(R.layout.fragment_example);
    }
}
   ```

   虽然有些许不同，不过实际上两个都可以。我们到 Fragment 类的构造方法中看看这个 **super()** 到底做了什么

   ```java
//in Fragmnet.java
    public Fragment(@LayoutRes int contentLayoutId) {
        this();
        mContentLayoutId = contentLayoutId;
    }
···
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        if (mContentLayoutId != 0) {
            return inflater.inflate(mContentLayoutId, container, false);
        }
        return null;
    }
   ```

   我们看到，我们 **super()** 调用的构造方法所传入的就是我们的布局id，而下面的 **onCreateView方法** 则调用这个布局id，而之后的两个参数都没有变化。由于**onCreateView方法** 在 Fragment 载入的时候回自动调用，所以我们重不重写结果都一样。总的来说，上面关于 Fragment 的两种写法**都是对的** ，挑一个自己喜欢的就行。

   #### 3. 容器Activity

   最初提到，Fragment 不能单独存在，需要依赖于现有的 Activity 或 Fragment。 所以为了让我们上面写的Fragment能显示出来，我们还需要一个容器Activity（Containing Activity）。

   我这里的容器 Activity 就是 MainActivity（别忘了还有他的布局activity_main.xml）

   ### 将 Fragment 加到 Activity 中

   在摸索如何把 Fragment 加到 Activity 中之前，我们得先有个基本概念，就是我们将 Fragment 加到 Activity 中的时候，在 Activity 的布局中肯定有个 Fragment 的控件。只要能把控件和之前写的 ExampleFragment 绑定，那自然就能在 Activity 中展现这个 Fragment 了。

   事实也确实如此。有了解过的同学一定知道，大家都很喜欢用 \<FrameLayout/\> 或者 \<fragment/\> 控件来展示 Fragment。不过随着AndroidX的发布和完善，Fragment 也加入其中。在2019年发布的**androidx.fragment库**中，存在 **FragmentContainerView** 这个控件，它继承自FramLayout，同时也是官方推荐的作为 Fragment 容器的控件，因为比起 \<FrameLayout/\> 或者 \<fragment/\> ， **FragmentContainerView** 具有针对 Fragment 更好的处理方法。

   为了跟上时代的步伐，我们也用这个控件，在**模块级gradle（build.gradle: app）**文件下添加以下依赖：

   ```java
dependencies {
   	···
    def fragment_version = "1.3.4"
    implementation "androidx.fragment:fragment:$fragment_version"
}
   ```

   sync后就Ok啦，我们可以使用 **FragmentContainerView** 这个控件了。

   #### 1. 通过xml文件：静态声明

   最方便的方法就是在**容器 Activity** 的布局文件中进行静态声明，来到 **activity_main.xml** 文件下：

   ```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- in activity_main.xml -->
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
  
    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/fragment_container_view"
        android:name="com.example.fragmenttest.ExampleFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
   ```

   用过 Fragment 的话对 **android:name** 这个标签并不陌生，它指定了初始化时载入的 Fragment，所以我们需要输入 Fragment 所在的包的位置，注意要写上**全部的包名**。  
   假设我的 ExampleFragment 在我新建的一个名为 fragmnet 的包下，那么name的值就应该为： **com.example.fragmenttest.fragment.ExampleFragment**

   此外还可以设置一个 **android:tag** 标签，它是我们自定义的唯一字符串，可以用 findFragmentByTag 方法来查找相应的 fragment。这里就不写了。

   #### 2. 通过xml文件：动态加载

   静态声明的优点就是简单，但缺点也显而易见，不能随心所欲切换 Fragment，不便于操作。

   有静态就有动态，我们去掉 **FragmentContainerView** 的 **android:name** 字段，然后来到 MainActivity 看看怎么动态加载

   动态加载需要用到 **FragmentManager** 和 **FragmentTransaction** 两个类，分别代表 Fragment 的**管理**和**事务**。  
   **Manager管理**用于创建并调用**Transaction事务**；**Transaction事务**可以调用 add，replace，remove 等方法对一个或多个 Fragment 进行增删替换等操作 。  
   通常情况下一个 Activity 只有一个 Manager，不过可以启动多个 Transaction来完成不同的逻辑操作。

   来到 MainActivity：

   ```java
//in MainActivity.java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction().setReorderingAllowed(true)
                    .add(R.id.fragment_container_view, ExampleFragment.class, null)
                    .commit();
        }
    }
}
   ```

   注意这个时候我们的 activity_main.xml 里， **FragmentContainerView** 已经没有 **android:name** 字段了，所以布局里是不会载入 Fragment 的。

   因此我们在 Activity 中创建了一个 **FragmentManager**，并让他启动一个  **FragmentTransaction** 。要注意的是 **getSupportFragmentManager()** 返回的是一个 **FragmentManager**, **beginTransaction()**返回的是一个 **FragmentTransaction**。

   在这个 **FragmentTransaction** 中，我们用 **add方法** 依次传入“容器控件的id”，“Fragment类”，“数据”。我们先不传数据，所以给了个null。最后执行 **commit()**。

   其中 **setReorderingAllowed()** 官方建议传入 **true** ，可以优化事务中涉及的 Fragment 状态变化，使动画和过渡正常运行。

   因为是在**onCreate()**中，所以程序一启动就会执行，我们显示的界面就是Fragment的界面。其实为了方便理解应该把这些代码放到按钮的点击事件中，然后点击添加 Fragment，不过这样代码会边长就算了吧~

   小小总结一下，我们动态加载 Fragment ，主要分为以下三步：

      1. 获得当前容器（可以是 Activity 或 Fragment）的 **FragmentManager**
      2. 通过  **FragmentManager** 获得 **FragmentTransaction**
      3. 通过 **FragmentTransaction** 对 Fragment 进行add，remove，replace等操作（最后别忘了用  **FragmentTransaction** 提交）

   ### 更多操作：replace() 替换和数据传递

   学会启动 Fragment 当然不够啦，我们还要多会点操作，这里就演示替换 Fragment 的同时传递数据好了

   #### 新的 Fragment

   实现替换至少要两个 Fragment 吧，所以我们得新建一个Fragment

   先写个布局，新建 fragment_another.xml，中间放一个Text：

   ```xml
<!-- fragment_another.xml -->
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
        
    <TextView
        android:id="@+id/another_fragment_textview"
        android:text="default text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        />
</RelativeLayout>
   ```

   

   接着新建 AnotherFragment.java

   ```java
public class AnotherFragment extends Fragment {
    public AnotherFragment() {
        super(R.layout.fragment_another);
    }
}
   ```

   现在我们有两个Fragment了，开始着手于替换的工作吧

   #### 在Fragment中进行替换

   我们在 ExampleFragment 中放了一个按钮，我们的想法是，点击这个按钮，跳到 AnotherFragment，并传递一个字符串，让 AnotherFragment 的TextView 显示为我们传过去的字符串。那么要怎么实现呢？

   因为我们的按钮实在 ExampleFragment 的布局中，我们自然而然地想要在 ExampleFragment 中进行逻辑处理，但其实要绕一个小弯。因为我们需要在按钮的点击事件里处理逻辑，那么就要通过 **findViewById** 绑定**控件对象**和**布局** 。不过，正如 Adapter 里要先拿到 View 才能 **findViewById** ，在 Fragment 里也一样，不同于 Activity，他们本身都不能直接调用这个方法。

   不难发现，在 **onCreateView() 方法** 里就是需要我们自己创建 View 对象并绑定布局然后返回，那么在这里绑定一个 Button 的 id 也就是举手之劳嘛~

   ```java
//in ExampleFragment.java
public class ExampleFragment extends Fragment {
    private Button button;
   
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_example, container, false);
        button = view.findViewById(R.id.example_fragment_btn);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Bundle bundle = new Bundle();
                bundle.putString("content", "From Example to Another");
                
                getActivity().getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container_view, AnotherFragment.class, bundle).commit();
            }
        });
        return view;
    }
}
   ```

   代码还是比较简单，老方法新建 view 并用 inflater 绑定布局。因为 button 不能直接 findViewById，要通过 view 调用。  
   然后设置监听器，当点击的时候，我们给一个Bundle保存数据，同时进行跳转，这里用到 **replace()方法**，分别传入 布局id，载入的 Fragment，传递的数据。数据就是我们的Bundle。  
   **replace()方法**本质是 **remove()** 当前 Fragment，并 **add()** 新的Fragment，所以用法其实和 **add()** 差不多...

   

   到这，我们已经成功实现跳转和数据传递了，但是，有些人总有着自己骄傲。之前不是说官方文档用的是构造方法嘛，那我现在也还想用构造方法啊！

   别急当然有办法。如果我们仍然用构造方法来绑定 Fragment 和布局，那么 Fragment 加载出来的时候 View 已经，这个时候就需要一个能返回已经创建了 View 的方法，当然不用自己写，叫 **onViewCreated()**

   ```java
//in ExampleFragment.java
public class ExampleFragment extends Fragment {
    private Button button;
    public ExampleFragment() {
        super(R.layout.fragment_example);
    }
    
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        button = view.findViewById(R.id.example_fragment_btn);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Bundle bundle = new Bundle();
                bundle.putString("content", "From Example to Another");

                getActivity().getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container_view, AnotherFragment.class, bundle)
                        .commit();
            }
        });
    }
}
   ```

   可以发现 **onViewCreated()** 这个方法参数里就有一个 View 对象，就是我们 Fragment 的 View ，直接拿过来用就好，传递的 Bundle 数据也不变。

   #### 在 Activity 中进行替换

   在上面，我们是在 ExampleFragment 中编写按钮的点击事件，我们先拿到当前的 View 对象才能绑定 Button 对象和视图里的 Button控件，然后设置监听器。

   事实上 Activity 中可以直接 **findViewById** ，因此可以直接编写按钮的点击事件。之前提到过，Fragment 就像 Activity 的一个控件，因此我们可以直接在Activity 调用按钮的点击事件

   还记得我们 ExampleFragment 的按钮，有个 **“clickExampleBtn”**的点击事件，在 ExampleFragment 中是无法调用这个方法的，但是在 Activity 中可以直接调用，因为这个按钮作为一个控件存在于 ExampleFragment 的布局中，而 ExampleFragment 的布局作为控件存在于 MainActivity 的布局中。所以我们来到 MainActivity 进行编写：

   ```java
//in MainActivity.java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction().setReorderingAllowed(true)
                    .add(R.id.fragment_container_view, ExampleFragment.class, null).commit();
        }
    }

    public void clickExampleBtn(View view) {
        Bundle bundle = new Bundle();
        bundle.putString("content", "From Example to Another");

        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_container_view, AnotherFragment.class, bundle)
                .commit();
    }
}
   ```

   在 MainActivity 中我们直接调用布局里指定的按钮的点击事件，注意这个时候 ExampleFragment 里啥也没有，像下面这样：

   ```java
//in ExampleFragment.java
public class ExampleFragment extends Fragment {
    public ExampleFragment() {
        super(R.layout.fragment_example);
    }
}
   ```

   

   #### 接收数据

   注意，不管是上面的在 Fragment 中替换还是在 Activity 中替换都是可以的，只用选一个就好了。不过建议是把代码**放在 Fragment 中**，本着 **Fragment 的逻辑 Fragment 自己来处理**的原则。在 Activity 中虽然方便，但如果一个 Activity 管理很多个Fragment，代码就会显得很杂乱冗长，不利于理解。

   既然已经成功跳转到新的 Fragment 并传递的数据，接下来我们就要接收数据了，来到 AnotherFragment

   ```java
   //in AnotherFragment.java
	public class AnotherFragment extends Fragment {
    private TextView textView;

    public AnotherFragment() {
        super(R.layout.fragment_another);
    }
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        Bundle bundle = getArguments();
        textView = view.findViewById(R.id.another_fragment_textview);
        textView.setText(bundle.getString("content"));
    }
}
   ```

   因为我们传数据的时候用的是 Bundle，所以接收数据也用 Bundle 接收，然后根据键值对拿到数据就好了。

   ## Fragment Lifecycle 生命周期

   类似 Activity， Fragment 也有生命周期 ，这也使得 Fragment 的使用非常灵活。

   Fragment 的生命周期分别包括 **INITIALIZED（初始化）**，**CREATED（创建）**，**STARTED（启动）**，**RESUMED（返回）**，**DESTROYED（销毁）**（翻译我自己加的），当然也对应一系列方法，这里就不罗列了，[官方文档](https://developer.android.com/guide/fragments/lifecycle)的这张图很好地体现了大家的关系。

   ![123](https://z3.ax1x.com/2021/06/02/2lGx3Q.png)  

   有点扯远了...所以我想说的是，**replace()** 和 直接 **add()** 不同的地方在于，**replace()** 会先调用**onDestroy()**销毁当前 Fragment，再创建新的 Fragment。而 **add()** 则不销毁，而是调用**onPause()**，再创建新的 Fragment，类似 Activity 入栈的方式，此时如果点击回退按钮，则会返回上一个 Fragment。

   不过 **replace()** 倒是可以添加 **.addToBackStack(null)** 来模拟返回栈。

   ##  Fragment过渡动画

   Fragment 的动画实现是通过 **FragmentTransaction** 对象调用 **setCustomAnimations()方法** 来实现的  
   这个方法接收四个参数，简单来说是：**enter、exit、popEnter、popExit**  

   ![223](https://z3.ax1x.com/2021/06/02/2lGX4S.jpg)  

   乍一看不知道他们是啥，我们来仔细捋捋。从当前 Fragment（或Activity）跳转到新的 Fragment，可以分为两个步骤：

      1. 新的Fragment进入屏幕
      2. 当前 Fragment/Activity 退出屏幕

   上面 1 这个过程的动画就是 **enter**， 2 这个过程的动画就是 **exit**

   同理，当我们退出当前 Fragment，回到之前的 Fragment/Activity 的时候，也可以分为两个步骤：之前的 Fragment/Activity 进入屏幕（**popEnter**），当前 Fragment 退出屏幕（**popExit**）

   为什么退出当前 Fragment 要加个 pop 呢？我猜是因为 Fragment 的操作本身就类似栈操作，比如 add 是将新的 Fragment 压入栈顶，remove 是将当前 Fragment 出栈，所以就沿用了栈操作的 pop 语句。

   总结！

      1. enter：跳转到新的 Fragment 时，新的 Fragment 进入屏幕的动画
      2. exit：跳转到新的 Fragment 时，当前 Fragment 
      3. popEnter：回到之前的 Fragment 时，
      4. popExit：回到之前的 Fragment 时，

   ### 动画文件

   要实现动画效果，当然首先要写动画资源文件啦。

   在res资源包下新建一个资源文件夹anim，用来存放我们的动画资源。然后分别新建四个资源文件，分别命名为 **slide_in.xml、fade_out.xml、fade_in.xml、slide_out.xml**，对应 **enter、exit、popEnter、popExit**

   我们都采用**补间动画**来实现动画效果。总的来说，我们要实现的动画效果是，跳转到新 Fragment 时，当前片段淡出，而下一个片段从右侧滑入；回到上一个 Fragment 时，当前片段向右滑出屏幕，而前一个片段淡入。

   #### slide_in.xml

   **slide_in** 代表新 Fragment 进入屏幕时的动画，采取 **从右侧滑入屏幕** 的方式

   ```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- in slide_in.xml -->
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="@android:integer/config_shortAnimTime"
    android:interpolator="@android:anim/decelerate_interpolator"
    android:fromXDelta="100%"
    android:toXDelta="0%">
</translate>
   ```

   duration 是动画的持续时间（毫秒），这里用系统自带的 **config_shortAnimTime** ，它的值是200毫秒，觉得效果不明显的可以自己修改

   interpolator 是动画的进行的速度模式，这里用 **decelerate_interpolator** ，表示减速动画，动画是先快后慢

   **fromXDelta** 和 **toXDelta** 就是动画的起始位置和结束位置的X坐标，从最右边移动到最左边，实现滑动进入。

   #### fade_out.xml

   **fade_out** 表示当前 Fragment 淡出的效果

   ```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- in fade_out.xml -->
<alpha xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="@android:integer/config_shortAnimTime"
    android:interpolator="@android:anim/decelerate_interpolator"
    android:fromAlpha="1"
    android:toAlpha="0">
</alpha>
   ```

   **fromAlpha** 和 **toAlpha** 表示起始和结束的透明度，从1到0，即从完全可见到透明，实现淡出效果

   #### fade_in.xml

   **fade_in** 表示回到之前的 Fragment 时，之前的 Fragment 淡入的效果

   ```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- in fade_in.xml -->
<alpha xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="@android:integer/config_shortAnimTime"
    android:interpolator="@android:anim/decelerate_interpolator"
    android:fromAlpha="0"
    android:toAlpha="1">
</alpha>
   ```

   其实就是 **fade_out** 反过来

   #### slide_out.xml

   **slide_out** 表示回到之前的 Fragment 时，当前 Fragment  **向右侧滑动出屏幕** 的效果

   ```xml
<!-- in slide_out.xml -->
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="@android:integer/config_shortAnimTime"
    android:interpolator="@android:anim/decelerate_interpolator"
    android:fromXDelta="0%"
    android:toXDelta="100%">
</translate>
   ```

   其实就是 **slide_in** 反过来

   ### 使用动画

   使用动画可就老简单了，一句话调用 **setCustomAnimations()** 就好。因为我们打算是从 ExampleFragment 到 AnotherFragment 的时候显示动画，所以来到 ExampleFragment。

   ```java
//in ExampleFragment.java
public class ExampleFragment extends Fragment {
    private Button button;
    public ExampleFragment() {
        super(R.layout.fragment_example);
    }
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        button = view.findViewById(R.id.example_fragment_btn);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Bundle bundle = new Bundle();
                bundle.putString("content", "From Example to Another");

                getActivity().getSupportFragmentManager().beginTransaction()
                        .setCustomAnimations(R.anim.slide_in, R.anim.fade_out, R.anim.fade_in, R.anim.slide_out)
                        .replace(R.id.fragment_container_view, AnotherFragment.class, bundle)
                        .addToBackStack(null).commit();
            }
        });
    }
}
   ```

   其实啥也没变，就是加了句 **setCustomAnimations()**，把我们的动画文件按照 **enter、exit、popEnter、popExit** 的顺序传进去就好了。

   同时我们还加了句 **addToBackStack(null)** ，是为了让 Fragment 以回退栈的方式载入，模拟一个入栈出栈的过程。这样我们跳转到 AnotherFragment 后，点击回退键还可以回到 ExmapleFragment，这样才能看到 **popEnter** 和 **popExit** 的动画效果。

   如果动画效果不明显，可以延长 duration 动画时间，给 Fragment 添加有色背景等。

  

   ## 参考

      1. [菜鸟教程](https://www.runoob.com/w3cnote/android-tutorial-fragment-base.html)  
      2. [developers：Fragment](https://developer.android.com/guide/fragments)
      3. [developers：Fragment Lifecycle](https://developer.android.com/guide/fragments/lifecycle)
      4. [Android Fragments新功能](https://blog.csdn.net/jklwan/article/details/102810238)
      5. [Android Interpolator属性 设置动画速度](https://www.cnblogs.com/onone/articles/6588335.html)
