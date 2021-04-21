---
layout:       post  
title:        Adapter：ArrayAdapter和SimpleAdapter适配ListView
subtitle:     一脚跨进Adapter的大门  
date:         2021-04-09  
auther:       BlackDn  
header-img:   img/acg.ggy_35.jpg 
catalog:      true  
tags:  
    - Android
---

> "各人下雪，各有各的隐晦与皎洁。"  

# 前言
本来想折腾自定义Adapter的，结果发现自己连系统自带的Adapter都不会用... 
  
在Android入门的时候，Adapter是一个比较大的坎  
从这里开始Android变得抽象而又有些复杂，于是打算试试能不能把Adapter这块给整理一下  
今天就邀请ListView作为嘉宾，用一用ArrayAdapter和SimpleAdapter  
不过他们都是官方定义好的Adapter，用法已经固定  
能理顺的话我加把劲整理一下搞定自定义Adapter   
## Adapter：ArrayAdapter和SimpleAdapter适配ListView
先简单介绍下Adapter的概念和ListView
#### Adapter
Adapter其实就是一个桥梁，他连接了数据和布局，让数据能够显示在特定布局上  
为什么需要连接数据和布局呢？  
因为如ListView，GridView等AdapterView，他们含有很多个小的item项，每个item项的内容都不相同，而我们难以直接在布局文件中直接对其进行设置。  
于是就有了Adapter，在程序运行时将数据绑定到每个item中，从而让每个item显示自己的值。  

|        适配器        |                                               简介                                                |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| BaseAdapter         | 基础适配器，是一个抽象类，大多自定义适配器的时候也是继承他                                   |
| ArrayAdapter        | 比较简单，只能显示一行文本，不过可以使用泛型结构（\<String\>泛型）                                     |
| SimpleAdapter       | 简单适配器（名字简单用起来不简单），相比ArrayAdapter，可以通过Map映射多个不同类型数据，实现比较复杂的布局 |
| SimpleCursorAdapter | Cursor是Android的一个接口，接受来自数据库的数据并进行操作。因此如果数据源来自数据库则常用这个Adapter     |

#### ListView
ListView作为贯穿全场的龙套，这里介绍下  
相比RecyclerView，ListView更加简单，但功能也比较受限。  
ListView能简单地实现纵向列表，而RecyclerView能相对简单地实现横向列表、瀑布流等布局  
ListView常用属性有下（其实也不怎么常用）：
  
|          属性          |          作用           |
| ---------------------- | ---------------------- |
| android:divider        | 两个item之间的分割线颜色 |
| android:dividerHeight  | 分割线的高度（粗细）     |
| android:entries        | 直接给item设置的静态数据 |
| android:scrollbars     | 是否有滚动条            |
| android:fadeScrollbars | 不滚动时滚动条是否隐藏   |

事实上，ViewGroup有一个子类叫AdapterView，他的子类通常都需要Adapter来实现  
比如AdapterView的一个子类是AbsListView，而ListView，GridView等都是AbsListView的子类  

## ArrayAdapter适配ListView  
#### 布局有个ListView
在xml布局文件中咱创一个ListView

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

    <ListView
        android:id="@+id/main_list_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```
#### 在Activity中创建Adapter并适配
我们实例化ListView并让他和布局的ListView绑定  

```
public class MainActivity extends AppCompatActivity {
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = findViewById(R.id.main_list_view);
    }
}
```
  
我们来创建一个String数组来作为ListView每个item的显示内容，随便写点啥  

```
    String[] data = {"我是1", "我是2", "我是3","我是4", "我是5"};
```
  
然后创建ArrayAdapter  
他本身有很多构造方法，常用的是传入三个参数，分别为：**上下文context，item的布局文件，每个item对应的数据（String数组）**  
这里为了偷懒所以用了系统自带的布局**R.layout.simple_list_item_1**  

```
    String[] data = {"我是1", "我是2", "我是3","我是4", "我是5"};
    ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, data);
```
  
最后调用listView的**setAdapter()**方法将ListView和ArrayAdapter相关联  

```
    listView.setAdapter(adapter);
```

###### 完整的代码是这样

```
public class MainActivity extends AppCompatActivity {
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //绑定
        listView = findViewById(R.id.main_list_view);
        //数据源
        String[] data = {"我是1", "我是2", "我是3","我是4", "我是5"};
        //适配器
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, data);
        //关联
        listView.setAdapter(adapter);
    }
}
```

这时候有同学就要问啦  
既然ArrayAdapter传入的是一个数组的数据（上面是String数组），那我能不能传入其他类型的数据（比如图片）呢？  
看起来很有道理但其实是不行的，因为在我们所使用的ArrayAdapter构造方法中，规定了是一个**String的数组对象（第三条）**  
即便是其他的构造方法，也都规定了**\<String\>的泛型**  
所以很遗憾不能传入图片了QAQ， 不过虽然ArrayAdapter不行，还有其他Adapter可以呢  

![1](https://z3.ax1x.com/2021/04/09/cUmWXq.jpg)  

最后的效果是这样，每个item只有一行文字  

![2](https://z3.ax1x.com/2021/04/09/cU0HeK.png)  

#### 小结
用ArrayAdapter适配ListView可以分为以下几个步骤：  

1. 布局里有ListView（废话）
2. 编写item布局（或者偷懒用已有的布局）
3. 在Activity中实例化并绑定ListView
4. 创建（或接收）数据源（String文本）
5. 创建适配器（ArrayAdapter）
6. 关联适配器和ListView

## SimpleAdapter适配ListView
#### 布局有个ListView
在activity_main.xml主布局文件中咱创一个ListView  

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

    <ListView
        android:id="@+id/main_list_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```
  
#### 还有item的布局
新建一个item的布局，我叫他item.xml  
注意一下因为偷懒所以采用了系统自带的图片=v=  
  
在最外层的LinearLayout中有个**android:descendantFocusability="blocksDescendants"**属性  
因为item中如果含有按钮的话，按钮会抢夺焦点，导致点击按钮之外的地方没有反应（有反应的话整行是会变色的）  
而这个属性则可以解决这个bug  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:descendantFocusability="blocksDescendants"
    tools:context=".MainActivity">

    <ImageView
        android:id="@+id/item_logo"
        android:layout_width="70dp"
        android:layout_height="70dp"
        android:src="@drawable/ic_launcher_foreground"/>


    <LinearLayout
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:layout_marginLeft="5dp"
        android:orientation="vertical">

        <TextView
            android:id="@+id/item_name"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Android"
            android:textSize="16sp"
            android:textStyle="bold"
            android:layout_marginTop="2dp"/>

        <TextView
            android:id="@+id/item_sex"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="sex: unknown"
            android:textSize="12sp"/>

        <TextView
            android:id="@+id/item_age"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="age:8"
            android:textSize="12sp"/>

    </LinearLayout>

    <Button
        android:id="@+id/item_btn"
        android:layout_width="wrap_content"
        android:layout_height="50dp"
        android:text="添加好友"
        android:layout_marginRight="10dp"
        android:layout_marginTop="5dp"/>

</LinearLayout>
```

#### 在Activity中创建Adapter并适配
先实例化ListView然后绑定，这里不变，略过  
  
然后是搞个数据源  
这里利用Map存储所需数据的键值对，一个item的多个数据作为一个map，然后把这些map全部放进List中  

```
        //数据源
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_foreground);
        map.put("name", "android");
        map.put("sex", "sex: unknown");
        map.put("age", "age:unknown");
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_background);
        map.put("name", "Young");
        map.put("sex", "sex: male");
        map.put("age", "age:18");
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_foreground);
        map.put("name", "BlackDn");
        map.put("sex", "sex: male");
        map.put("age", "age:21");
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_background);
        map.put("name", "Lily");
        map.put("sex", "sex: female");
        map.put("age", "age:16");
        list.add(map);
```

之后是创建适配器SimpleAdapter  
参数分别为：**context上下文，数据源（Map的集合），item布局，绑定的数据（键值对的key组成的String数组），布局的id（int数组）**  
  
注意这里的String数组存放的是之前map中键值对的关键字（key），而int数组则是item布局中所对应的控件id  
关键字（key）和控件id要一一对应，这样才会将数据正确显示在布局上  
键值对保存数据时采用**“关键字——值”**的形式，而在simpleAdapter中绑定时采用**“关键字——布局”**的形式  
系统在运行时会根据关键字，找到对应的值，放到绑定的布局中  

```
        //适配器
        String[] from = new String[] {"logo", "name", "sex", "age"};
        int[] to = new int[] {R.id.item_logo, R.id.item_name, R.id.item_sex, R.id.item_age};
        SimpleAdapter simpleAdapter = new SimpleAdapter(this, list, R.layout.item, from, to);
        // 简便写法
        // SimpleAdapter simpleAdapter = new SimpleAdapter(this, list, R.layout.item, new String[] {"logo", "name", "sex", "age"}, new int[] {R.id.item_logo});
```
  
有些同学在这容易头晕，为什么绑定的数据要叫from，布局的id要叫to呢？（提示是这样叫的，可不是我随便命名的噢）  
可以这样理解，adapter要将数据显示在布局上，所以是**数据->布局**，所以是**from数据，to布局**  
  
还有一点令人奇怪的是，我们这个Activity绑定的布局是activity_main.xml，但为什么int数组中可以写item.xml中的id呢？  
这是因为在simpleAdapter中我们已经传入了item的布局（第三个参数），因此后面的id他会在item的布局中查找，这就不会和我们的主布局搞混了  
  
最后关联一下即可，这里略过  
###### 完整的代码是这样
```
public class MainActivity extends AppCompatActivity {
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //绑定
        listView = findViewById(R.id.main_list_view);
        //数据源
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_foreground);
        map.put("name", "android");
        map.put("sex", "sex: unknown");
        map.put("age", "age:unknown");
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_background);
        map.put("name", "Young");
        map.put("sex", "sex: male");
        map.put("age", "age:18");
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_foreground);
        map.put("name", "BlackDn");
        map.put("sex", "sex: male");
        map.put("age", "age:21");
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("logo", R.drawable.ic_launcher_background);
        map.put("name", "Lily");
        map.put("sex", "sex: female");
        map.put("age", "age:16");
        list.add(map);
        //适配器
        String[] from = new String[] {"logo", "name", "sex", "age"};
        int[] to = new int[] {R.id.item_logo, R.id.item_name, R.id.item_sex, R.id.item_age};
        SimpleAdapter simpleAdapter = new SimpleAdapter(this, list, R.layout.item, from, to);
        // 简便写法
        // SimpleAdapter simpleAdapter = new SimpleAdapter(this, list, R.layout.item, new String[] {"logo", "name", "sex", "age"}, new int[] {R.id.item_logo});
        //关联
        listView.setAdapter(simpleAdapter);
    }
}
```

最后的效果是这样  
![3](https://z3.ax1x.com/2021/04/09/cU0bdO.png)    


#### 小结
1. 布局里有ListView（还是废话）
2. 编写item布局
3. 在Activity中实例化并绑定ListView
4. 创建（或接收）数据源（List\<map\>）
5. 创建适配器（SimpleAdapter）
6. 关联适配器和ListView

## 参考
1. [Android中各种Adapter的介绍及使用](http://www.360doc.com/content/12/1115/10/8189294_247953861.shtml)  
2. [developers：AdapterView](https://developer.android.com/reference/android/widget/AdapterView)  
3. [developers：ListView](https://developer.android.com/reference/android/widget/ListView)  
4. [孙老师课堂-ListView1](https://www.bilibili.com/video/BV1Fx411L7xE/?spm_id_from=333.788.recommend_more_video.-1)  
5. [android中Adapter适配器的讲解](https://www.cnblogs.com/Jeely/p/11059336.html)  
