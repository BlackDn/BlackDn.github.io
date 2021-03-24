---
layout:       post  
title:        Android三个常用布局  
subtitle:     主要是ConstraintLayout，顺手对比一下LinearLayout和RelativeLayout  
date:         2021-03-24  
auther:       BlackDn  
header-img:   img/acg.ggy_04.jpg  
catalog:      true  
tags:  
    - Android
---

> "活在这珍贵的人间，太阳强烈，水波温柔。"  

# 前言
好，年更上线。  
主要是自己学习或者带别人学习的时候都是LinearLayout起步，然后就懒得学其他布局了  
然后不小心尝试了下ConstantLayout...真香！  
所以还是稍稍整理一下，希望能让更多人喜欢ConstantLayout（  

## LinearLayout（线性布局）
这应该是最大众的布局，比较有特点的属性大概有这些  

```
android:orientation    //布局方向，vertical=竖直排列，horizontal=水平排列
android:layout_gravity    //当前控件在父容器的对齐方式，值有很多自己去试
                                 我用得比较多的是center_horizontal（水平居中），center_vertical（垂直居中）等
android:gravity="center"    //当前控件的子控件的对齐方式，值有很多自己去试，包括center（居中），bottom（底部）等
android:layout_weight="1"

```

需要注意的是，最好在每个LinearLayout的属性中都规定orientation的值（就算有默认值也要写噢，养成好习惯）  
### 小试身手
来个简单的登录页面试试（当然，布局方式不唯一）  
![LinearLayout](https://z3.ax1x.com/2021/03/24/6bRQRP.jpg)  


```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <LinearLayout
        android:gravity="bottom"
        android:layout_weight="1"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="center_horizontal"
        android:orientation="horizontal">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="登录: "
            android:textSize="10pt"/>

        <EditText
            android:layout_width="200dp"
            android:layout_height="wrap_content"
            android:layout_marginLeft="20dp"/>

    </LinearLayout>

    <LinearLayout
        android:gravity="center"
        android:layout_weight="1"
        android:layout_marginTop="20dp"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="center_horizontal"
        android:orientation="horizontal">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="注册: "
            android:textSize="10pt"/>

        <EditText
            android:layout_width="200dp"
            android:layout_height="wrap_content"
            android:layout_marginLeft="20dp"/>

    </LinearLayout>

    <LinearLayout
        android:layout_weight="1"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="center_horizontal"
        android:layout_marginTop="20dp"
        android:orientation="horizontal">

        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="登录"/>

        <Button
            android:layout_marginLeft="60dp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="注册"/>

    </LinearLayout>

</LinearLayout>
```

## RelativeLayout（相对布局）
RelativeLayout利用控件和控件之间，或控件和父容器之间的关系来确定各个控件的位置  
甚至比较复杂的布局也能用一层RelativeLayout来搞定，有效解决了LinearLayout多层嵌套的问题  
当然缺点是没有weight等利用比例来控制控件位置的属性，因此对不同尺寸屏幕的适配没有那么理想  

### 简单用法
#### 1. 根据父容器定位
这类属性的值都是true/false  

```
android：layout_centerHrizontal     //水平居中
android：layout_centerVertical     //垂直居中
android：layout_centerInparent     //相对于父容器完全居中
android：layout_alignParentBottom     //贴紧父容器的下边
android：layout_alignParentLeft     //贴紧父容器的左边
android：layout_alignParentRight     //贴紧父容器的右边
android：layout_alignParentTop     //贴紧父容器的上边
```

#### 2. 根据兄弟组件定位
这类属性的值都是其他兄弟控件的id  

```
android：layout_below     //在某控件下方
android：layout_above     //在某控件上方
android：layout_toLeftOf     //在某控件的左边
android：layout_toRightOf     //在某控件的右边
android：layout_alignTop     //本控件的上边和某控件的上边对齐
android：layout_alignLeft     //本控件的左边缘和某控件的左边对齐
android：layout_alignBottom     //本控件的下边和某控件的下边对齐
android：layout_alignRight     //本控件的右边和某控件的有边对齐
```

由于对齐后默认是紧贴的，所以想要有空隙就需要margin和padding来进行调整  

### 小试身手
还是个简单的登录界面  

![RelativeLayout](https://z3.ax1x.com/2021/03/24/6bRKPI.jpg)  

```
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/account_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_alignParentTop="true"
        android:layout_marginLeft="60dp"
        android:layout_marginTop="170dp"
        android:text="登录: "
        android:textSize="10pt" />

    <EditText
        android:id="@+id/account_edit"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        android:layout_toRightOf="@id/account_text"
        android:layout_alignBottom="@id/account_text"/>

    <TextView
        android:id="@+id/password_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="密码: "
        android:textSize="10pt"
        android:layout_below="@id/account_text"
        android:layout_alignLeft="@id/account_text"
        android:layout_marginTop="80dp"/>

    <EditText
        android:id="@+id/password_edit"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        android:layout_alignBottom="@id/password_text"
        android:layout_toRightOf="@id/password_text"
        />

    <Button
        android:id="@+id/login_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="登录"
        android:layout_below="@id/password_text"
        android:layout_alignParentLeft="true"
        android:layout_marginTop="100dp"
        android:layout_marginLeft="80dp"/>

    <Button
        android:id="@+id/register_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="注册"
        android:layout_toRightOf="@id/login_btn"
        android:layout_alignBottom="@id/login_btn"
        android:layout_marginLeft="70dp"
</RelativeLayout>
```

## ConstrainLayout（约束布局）
ConstrainLayout作为一种比较新的布局方式，在Android Studio 2.2中新增，同时谷歌也在2016年的I/O大会上进行宣传。  
在使用LinearLayout（线性布局）和RelativeLayout（相对布局）的时候，我们的布局常常通过xml代码实现，旁边的Design可视化界面似乎可有可无，偶尔看上一眼预览效果。而ConstrainLayout则相反，他更倾向于直接在可视化界面上对控件拖拽进行操作，因此得到许多初学者的青睐和官方的推荐。  
如果LinearLayout用的比较多，肯定会常常进行布局的嵌套，一个LinearLayout套着另一个LinearLayout，写着写着一不留神就找不到自己的控件在哪了。而ConstrainLayout则类似RelativeLayout，利用控件之间的约束来决定控件的位置，因此能有效避免布局的嵌套。当然他比RelativeLayout更加强大。  

### 来看用法
#### 1. 相对位置的约束
既然是约束，那就是上下左右的约束，分别用以下方式约束：  

```
        app:layout_constraintBottom_toBottomOf="A"  //当前控件的下沿和A控件下沿相同
        app:layout_constraintBottom_toTopOf="A"    //当前控件的下沿和A控件上沿相同
        app:layout_constraintLeft_toLeftOf="B"    //当前控件的左沿和B控件左沿相同
        app:layout_constraintLeft_toRightOf="B"    //当前控件的左沿和B控件右沿相同
        app:layout_constraintRight_toRightOf="C"    //当前控件的右沿和C控件右沿相同
        app:layout_constraintRight_toLeftOf="C"    //当前控件的右沿和C控件左沿相同
        app:layout_constraintTop_toTopOf="D"     //当前控件的上沿和D控件上沿相同
        app:layout_constraintTop_toBottomOf="D"    //当前控件的上沿和D控件下沿相同
        layout_constraintBaseline_toBaselineOf="E"    //当前控件的基准线和E控件的基准线相同
```
上下左右和基准线就像下图所示，left和start，right和end是可以替换哒，他们是同一个意思。  
（图片来源于developers）  
![0](https://z3.ax1x.com/2021/03/24/6bRErD.jpg)  
  
相信你已经找到规律了，虽然这些命令很长不想看，但却死板地有些可爱。  
总的来说，命令的格式就是  

```
    app:layout_constraint方向1_to方向2Of="目标控件"
```

方向1=当前控件的某条边，方向2=目标控件的某条边，然后把他们~~贴贴~~对齐就好了  
  
比如把一个button放到textview的右下角，这样就好啦  
![1](https://z3.ax1x.com/2021/03/24/6bReVH.jpg)  
  
当然，像之前所说，ConstrainLayout更加支持我们在可视化界面中进行拖拽来布局，只要我们选中一个控件，就可以把它的某个方向的边边拖到另一个控件的边边上，这样就能成功进行约束，当然代码也会自动生成啦。（下面因为只有上下约束没有左右约束所以控件报错了，好孩子不要学噢）  
![2](https://z3.ax1x.com/2021/03/24/6bRVqe.jpg)  
  
#### 2. 间隔
因为对齐默认是紧贴的，所以控件之间的间隔通常就用**margin**来实现了  
margin还是老样子，不用多说，left和start，right和end同样可以互换  

```
android:layout_marginLeft=""
android:layout_marginTop=""
android:layout_marginRight=""
android:layout_marginBottom=""
```
#### 3. bias比例
当我们同时施加左右约束，当前控件会相对于目标控件居中，因此在整个布局中居中可以这样：  
![3](https://z3.ax1x.com/2021/03/24/6bRnIA.jpg)  

事实上，控件进行约束后他的位置可以由bias来控制，分为水平和竖直两个方向  

```
layout_constraintHorizontal_bias="0.5"
layout_constraintVertical_bias="0.5"
```

bias决定了控件在约束范围内的位置，通常情况下值是0~1之间，表示控件所在的位置  
比如0.3就表示这个控件**左边/上面的空白 : 右边/下面的空白=3 : 7**，0.4就表示**左边/上面的空白 : 右边/下面的空白=4 : 6**  
而这个属性默认是0.5，因此什么都不写的话就会居中了。  
水平的bias=0.7就是这个样子  

![4](https://z3.ax1x.com/2021/03/24/6bRmad.jpg)  

用比例而不是具体数值调整位置，永远的一个优点就是能更好适配不同尺寸的屏幕  
#### 4. 圆形的相对位置
之前的相对位置调整的是上下左右，但是如果给出角度和半径，也可以实现类似圆形的布局方法  

```
layout_constraintCircle="A"    //A是原点控件
layout_constraintCircleRadius="100dp"    //圆形半径
layout_constraintCircleAngle="45"    //（0-360）的角度，从十二点方向逆时针计算
```
效果大概就是这样  
![5](https://z3.ax1x.com/2021/03/24/6bRlxf.jpg)  
#### 5. 还有其他功能...
我挑了些比较~~好写~~常用的功能做个简单的介绍，想要深入学习可以去developers中看看  
ConstrainLayout还有许多其他功能，比如给控件设置隐藏、目标控件隐藏了当前控件怎么办之类的  
还提供了一个**Chain链**的东西，挺好用的，乍一看像是前端的flex，在下面的布局中我也用到了  

### 小试身手
来做个简单的登录界面吧！  
![6](https://z3.ax1x.com/2021/03/24/6bRMGt.jpg)  

```
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/account_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="账号: "
        android:textSize="10pt"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintVertical_bias="0.2"
        app:layout_constraintHorizontal_bias="0.2"/>

    <EditText
        android:id="@+id/account_edit"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        app:layout_constraintBaseline_toBaselineOf="@id/account_text"
        app:layout_constraintLeft_toRightOf="@id/account_text"
        android:layout_marginLeft="20dp"/>

    <TextView
        android:id="@+id/password_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="密码: "
        android:textSize="10pt"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintVertical_bias="0.4"
        app:layout_constraintHorizontal_bias="0.2"/>

    <EditText
        android:id="@+id/password_edit"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        app:layout_constraintBaseline_toBaselineOf="@id/password_text"
        app:layout_constraintLeft_toRightOf="@id/password_text"
        android:layout_marginLeft="20dp"
        android:inputType="textPassword"/>

    <Button
        android:id="@+id/login_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="登录"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toStartOf="@id/register_btn"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintVertical_bias="0.6"
        app:layout_constraintVertical_chainStyle="spread_inside"/>

    <Button
        android:id="@+id/register_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="注册"
        app:layout_constraintStart_toEndOf="@+id/login_btn"
        app:layout_constraintBottom_toBottomOf="@id/login_btn"
        app:layout_constraintEnd_toEndOf="parent"/>

</androidx.constraintlayout.widget.ConstraintLayout>
```

## 最后的话
总的来说，妹有最好的布局，只有最合适的布局。  
选用什么样的布局，要根据当前需求来，如果只会一个布局一股脑地使用，是会吃亏的哦。  
还要注意，并不是选择了一个布局，就只能使用这个布局。我们还可以用不同布局进行嵌套，比如在RelativeLayout中嵌套LinearLayout，这样既能减少LinearLayout带来的嵌套，又能使用LinearLayout中的weight属性来给不同尺寸的屏幕带来更好的适配  


## 参考
1. [2.2.1 LinearLayout(线性布局)](https://www.runoob.com/w3cnote/android-tutorial-linearlayout.html)  
2. [2.2.2 RelativeLayout(相对布局)](https://www.runoob.com/w3cnote/android-tutorial-relativelayout.html)  
3. [developers中的ConstraintLayout](https://developer.android.google.cn/reference/androidx/constraintlayout/widget/ConstraintLayout)  
4. [Android新特性介绍，ConstraintLayout完全解析by郭霖](https://blog.csdn.net/guolin_blog/article/details/53122387)  
5. [Android ConstraintLayout 使用详解](https://www.jianshu.com/p/b884b8c46584)：这篇可以和developers配合来看，基本上是中文翻译过来的方法
