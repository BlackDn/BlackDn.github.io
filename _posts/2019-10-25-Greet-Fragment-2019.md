---
layout:       post
title:        初认识碎片（Fragment）
subtitle:     认识Fragment并实现静态动态加载
date:         2019-10-25
auther:       BlackDn
header-img:   img/X148_023.jpg
catalog:      true
tags:
    - Android
---

>"来裙摆上采一片棉花糖，尝一尝云雾的甜味，在发梢里找一朵小花，闻一闻林间的生气"

# 前言
培训用博客，结果拖了好久www  
看在我上计组全程打博客的份上不要打我QAQ  
好好看《第一行代码》效果一样哒！
# 初识Fragment
### 什么是Fragment
第一行代码：  
```
是一种可以嵌入在活动当中的UI片段，让程序更加合理和充分地利用大屏幕空间
```
官方文档：  

```
You can think of a fragment as a modular section of an activity, which has its own lifecycle, 
receives its own input events, and which you can add or remove while the activity is running
——————————————
你可以将Fragment视为一个模块化的活动，它拥有自己的生命周期，可以接受输入事件，同是可以在正在运行的Activity中添加/移除Fragment。

You can combine multiple fragments in a single activity to build a multi-pane UI and 
reuse a fragment in multiple activities.
——————————————
可以将多个Frament组合在一个 Activity 中来构建多窗格 UI，以及在多个 Activity 中重复使用某个片段。
```

1. 是一个组件，像一个小型activity  
2. 独立的（模块化），有着自己的生命周期和布局  
3. 依附于activity，在activity中添加或移除fragment  
4. 一个fragment可以被多个activity使用，一个activity可以使用多个fragment

好比Activity是一张纸，而Fragment是被撕开的纸  
### 尝试使用Fragment
以下流程跟着《第一行代码》来哦（可能步骤顺序会有些不一样）  
新建FragmentTest项目，我们打算先尝试在一个Activity中添加两个Fragment，让这两个Fragment平分这个Activity  
新建两个Java文件，分别叫LeftFragment和RightFragment，作为平分MainActivity的两个Fragment  
#### 先写布局
Fragment就像一个小Activity，有自己的布局，因此我们还需要给他一个layout文件作为他的布局，新建left_fragment.xml，就先放一个按钮吧  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/button"
        android:text="Button"
        android:layout_gravity="center_horizontal"
        />
</LinearLayout>
```

同样，新建右边Fragment的布局，新建right_fragment.xml，这里放一个TextView，同时记得添加**background标签**修改一下背景颜色以区分两个Fragment  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:background="#ff99cc"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:text="This is right fragment"
        android:textSize="20dp"
        />
</LinearLayout>
```
#### 回到Fragment
写好布局，我们回到Fragment的java文件，来给他们绑定各自的布局  
因为两个Fragment的步骤基本一样，我就以LeftFragment为例子  
来到LeftFragment.java，我们先让他继承Fragment类。可能会有两个Fragment，选择support包的Fragment（还有一个是app包的，已经被划掉了）  
我们重写**onCreateView**方法，表示这个组件（现在是Fragment）创建的时候运行的代码，就像Activity的**onCreat**一样。我们在Activity的**onCreat**运行**setContentView**来绑定布局，同理，我们在**onCreateView**中进行布局的绑定，不过我们需要LayoutInflater的帮忙  
```
public class LeftFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.left_fragment, container, false);
        return view;
    }
}
```
RightFragment.java同理，注意绑定的布局是不一样的  
#### 在Activity中添加Fragment
现在我们有了两个已经绑定布局的Fragment，一个绑定了布局，想把Fragment添加进去的的Activity  
但两个Fragment和我们的MainActivity还没啥关系。想在MainActivity中使用，我们要在MainActivity的布局中进行布置。  
来到activity_main.xml，我们在布局中设置两个fragment  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <fragment
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"
        android:name="com.example.blackdn.fragmenttest.LeftFragment"
        android:id="@+id/left_fragment"
        />
    
    <fragment
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"
        android:name="com.example.blackdn.fragmenttest.RightFragment"
        android:id="@+id/right_fragment"
        />
</LinearLayout>
```
我们在布局中添加**fragment标签**，其中用**name属性**定位到相应的Fragment，就不需要在Activity中再写代码来加入Fragment了  
现在运行程序，成功运行后你的界面一分为二，恭喜你已经会用Fragment了！
### 动态添加Fragment
当然别高兴得太早，Fragment用法很多，我们才刚会最最基础得那个  
我们在Activity的布局中加入fragment，这种方法属于静态添加。你会发现这种方法不够灵活，因此实际用到的并没那么多。  
我们接下来看看如何动态添加Fragment，这种方法更加常用  
#### 先写布局
我们把之前写的两个fragment放到一边，重新写一个右边碎片  
步骤类似，新建AnotherRightFragment.java，another_right_fragment.xml  
先搞定布局，也和之前的类似  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:textSize="20dp"
        android:text="This is another right fragment"
        />
</LinearLayout>
```
然后在AnotherRightFragment.java中用inflater载入布局
最后我们来到activity_main.xml，将右边的fragment修改成一个**FrameLayout**，接下来我们要做的是把新的Fragment载入到FrameLayout  
实现的功能是，一开始显示RightFragment，点击按钮后显示AnotherRightFragment  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <fragment
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"
        android:name="com.example.blackdn.fragmenttest.LeftFragment"
        android:id="@+id/left_fragment"
        />

    <FrameLayout
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"
        android:id="@+id/right_layout"
        ></FrameLayout>
</LinearLayout>
```
#### 动态将Fragment载入FrameLayout
我们想把Fragment载入FrameLayout，而FrameLayout在Acivity的布局中，猜猜我们要在哪里写代码载入Fragment？  
来到MainActivity.java，我们先实现一个点击的接口，来实现点击左边Fragment按钮切换右边Fragment的点击方法。具体代码如下：  

```
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button button = findViewById(R.id.button);
        button.setOnClickListener(this);    //给按钮一个点击事件的方法
        replaceFragment(new RightFragment());   //初始先用原来的RightFragment替换到容器（FrameLayout）中
    }

    @Override
    public void onClick(View view) {        //按钮点击方法的具体内容
        switch (view.getId()) {
            case R.id.button:
                replaceFragment(new AnotherRightFragment());    //产生新的AnotherRightFragment对象，并替换到当前right_layout的位置
                break;
            default:
                break;
        }
    }

    private void replaceFragment(Fragment fragment) {
        FragmentManager manager = getSupportFragmentManager();  //碎片管理器，如果有很多碎片，都给他管理
        FragmentTransaction transaction = manager.beginTransaction();   //事务，让管理器把一个碎片给事务，然后事务开启这个碎片
        transaction.replace(R.id.right_layout, fragment);   //将新的AnotherRightFragment替换到容器（FrameLayout）中
        transaction.commit();   //提交事务
    }
}
```
我们可以看出，动态添加碎片主要分为5步：

1. 创建碎片实例（new Fragment）
2. 获取碎片管理器（Fragment Manager），在活动中可以直接通过**getSupportFragmentManager（）方法**得到
3. 产生一个事务（Transaction）并开启事务（beginTransaction）
4. 常用**replace()方法**将碎片替换到容器（我们刚才的容器是FrameLayout），容器用id定位，碎片直接传入对象。
5. 提交事务（commit()）

有些人会问，那动态不是和静态差不多嘛，都是把这个布局载入进来。  
实际上，动态加载允许我们加载许多不同的fragment，而静态的永远只是那一个fragment。假设我有很多fragment，有很多按钮，我只能通过动态加载的方式实现“点一个按钮切换一个fragment”这个功能。最简单的“切换Fragment”功能也只能通过动态实现。

运行程序，因为我们的**replaceFragment(new RightFragment());**在Activity的**onCreate()**中，因此刚运行程序看到的是原来的RightFragment。点击按钮，右边的布局发生变化，恭喜你，你已经实现了动态加载Fragment。
#### 返回上一个碎片
我们进行一下最后的完善。  
我们点击按钮后，碎片成功切换了，但是点后退（Back），会退出整个程序。能不能返回到上一个碎片呢？  
说到这个功能，我们想到了栈的应用，栈顶元素弹出后显示的是下一个元素，而不是退出整个栈  
那么就用事务（FragmentTransaction）提供的**addToBackStack()方法**，参数表示一个描述返回栈状态的名字，一般用null就可  
我们先将这个事务放到栈中，再进行提交（commit），所以只用在xxx里添加一句即可  

```
    private void replaceFragment(Fragment fragment) {
        FragmentManager manager = getSupportFragmentManager();  //碎片管理器，如果有很多碎片，都给他管理
        FragmentTransaction transaction = manager.beginTransaction();   //事务，让管理器把一个碎片给事务，然后事务开启这个碎片
        transaction.replace(R.id.right_layout, fragment);   //将新的AnotherRightFragment替换到容器（FrameLayout）中
        transaction.addToBackStack(null);       //入栈
        transaction.commit();   //提交事务
    }
```
重新运行程序，根据我们的代码，一开始**onCreate**中将RightFragment入栈，然后点击按钮，AnotherRightFragment入栈。  
我们点击后退，先AnotherRightFragment出栈，我们看到RightFragment；再按一下，RightFragment出栈，此时栈为空，露出底下的FrameLayout。
### 课后练习
根据《第一行代码》P160（可能因为书的版本问题有偏差）  
完成**4.5 碎片的最佳实践——一个简易版的新闻应用**  
~~其实就是看书敲代码~~  
然后截图或视频给经理看！（其实给不给看无所谓啦只是想让你们真的去做，实际动手操作一遍，我怕没有这句话你们就不去码了）  
最后：自己去看书了解Fragment和Activity间数据的传递和生命周期哦~
#### 参考与拓展
[《Android Fragment 非常详细的一篇》](https://www.jianshu.com/p/11c8ced79193)  
[Fragment是什么，怎么用？](https://blog.csdn.net/sun976649289/article/details/79467577)  
[Fragment 生命周期和使用](https://www.jianshu.com/p/70d7bfae18f3)  
