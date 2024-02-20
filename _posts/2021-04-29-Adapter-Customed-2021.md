---
layout: post
title: Adapter：开始自定义Adapter
subtitle: 不会自定义的Adapter不是好Adapter（
date: 2021-04-29
author: BlackDn
header-img: img/moriya_150_011.jpg
catalog: true
tags:
  - Android
---

> "后来烟雨落盛京，一人撑伞两人行。"

## 前言

这篇本来是接着之前那个 Adapter 的，结果太懒了写一半一直放着...  
最近忙是挺忙，但困也是真的困...  
姐姐饿饿饭饭呜呜

## 自定义 Adapter：以适配 ListView 为例

之前用 ArrayAdapter 和 SimpleAdapter 适配了 ListView，对 ListView 比较熟悉，那么这次就还以适配 ListView 为前提  
和 SimpleAdapter 适配 ListView 的时候类似，每个 item 都是图文结合的  
因此数据源和最后的效果相差不大，可以看看上一篇 Adapter 的博客，这里就不上图了  
之前的传送门在这呢：[Adapter：ArrayAdapter 和 SimpleAdapter 适配 ListView](../2021-04-09-Adapter-ArrayAdapter-SimpleAdapter-2021)

### 构造自定义 Adapter

首先我们得有自定义的 Adapter 类，等定义好了再去 Activity 里实例化这个 Adapter，绑定数据和视图

#### 继承 BaseAdapter

自己新建一个空的 Activity，命名为 MyAdapter，继承 BaseAdapter  
因为 BaseAdapter 是一个抽象类，因此还要进一步实现抽象方法  
刚新建完是这样，有四个需要重写的方法

```java
public class MyAdapter extends BaseAdapter {

    @Override
    public int getCount() {
        return 0;
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        return null;
    }
}
```

#### 初始化和构造方法

因为 Adapter 是将数据和布局控件连接，所以我们同时需要**数据集**和**控件对象（View 对象）**  
因为每个 item 是图文结合的，所以我们用 Map 来存储一个 item 的图文。  
有很多个 item 就意味着有很多个 Map，那就用 List 来存很多个 Map

除此之外，我们会发现，我们需要有 View 对象，这个 View 对象是我们要绑定的 item，那么肯定需要绑定 item 的布局。  
但是上面重写的四个方法好像都没有引用到布局，那怎么办呢？  
为了解决这个问题，我们还需要用到**LayoutInflater**，有的人叫它**布局反射器**，有的人叫它**布局服务**，我们就叫 Inflater 吧。  
这里就先实例化一个 Inflater，具体用法后面再说。

```java
    //存放数据的变量
    List<Map<String, Object>> list;
    //Inflater
    LayoutInflater inflater;
```

既然有了数据集，那么外面的数据总要导入到 Adapter 对象的 List 中吧，因此要给一个 List 的 Setter 方法

```java
    //setter
    public void setList(List<Map<String, Object>> list) {
        this.list = list;
    }
```

然后是**构造方法**，构造方法里是对**Inflater 对象**的初始化。  
因为之后需要拿到 item 的布局文件，这些资源文件需要通过**上下文 Context**拿到，所以做一个含参的构造方法

```java
    //构造方法
    public MyAdapter(Context context) {
        this.inflater = LayoutInflater.from(context);
    }
```

#### 四个方法的重写

现在来看看四个重写的方法

首先是 **getCount()**，顾名思义，它返回一个数量，应该就是这个 Adapter 中 item 的数量  
要怎么表示 item 的数量呢？我们把一个 item 的所有数据作为一个 Map，把所有 Map 放在 List 中  
所以 List 中有多少 Map，就有多少个 item。所以返回**List 的 size**  
虽然这个方法我们自己不怎么用到，但是系统会去自动调用

```java
    @Override
    public int getCount() {
        return list.size();
    }
```

方法**getItem()** 也比较好理解，就像是一个 getter 方法。这里的 i 表示第 i 个 item（以前是 position），所以直接拿到第 i 个 list 返回出来就行了  
不过这个方法用到得比较少

```java
    @Override
    public Object getItem(int i) {
        return list.get(i);
    }
```

方法**getItemId()** 似乎更简单，ItemId 就表示这是第几个 item，所以把 i 返回出去就行了  
这个用的也少，奇怪简单的方法都不怎么用的

```java
    @Override
    public long getItemId(int i) {
        return i;
    }
```

方法**getView()** 则是 Adapter 中的灵魂，也是比较复杂，但十分重要的方法  
这个方法接受三个参数，返回一个 View，其实就是对应我们数据投放的**View 对象**  
程序加载 item 实际上是一个一个来的（只不过太快了我们没这感觉），这个方法的本质就是构造一个**View 对象**，也就是一个 item  
先不管后面两个参数，第一个参数 i 和上面的一样，表示第 i 个 item，比如他加载第一个 item 的时候，传入的 i=0。

这里我们先用**最笨的**方式来编写这个方法，就是自己 new 一个 View 出来，最后把这个 View 返回  
因为我们的 View 需要和 item 布局绑定，这个时候就需要 Inflater 来载入布局了  
这里第一个参数就是我们的 item 布局，第二参数 ViewGroup 用不到，所以填个 null

```java
View my_view = inflater.inflate(R.layout.item, null);
```

接下来实例化布局中的各个控件并绑定，注意这里需要在**findViewById()** 前面加 View 对象。如果有好奇宝宝问为什么可以听我多说两句，如果没什么问题可以**直接略过**看下面代码

和在 Activity 中不同，这里绑定布局的时候需要使用**my_view.findViewById()** 。好奇宝宝可能会问为什么前面要加**my_view**而 Activity 中不用，但实际原因也很简单，因为 Adapter 中没有提供这个方法。  
不论是 Activity 类还是 View 类，他们都有**findViewById()** 这个 public method，这个方法返回的是一个 View 类  
我们所实例化的 TextView 也好，ImageView 也好，当他们调用这个方法，根据 id 找到布局文件中对应的控件时，我们才真正能说“我的这个 TextView 对象就是布局里的那个 TextView”  
不管是 TextView 还是 ImageView，这些控件对象都是 View 的子类，所以调用**findViewById()** 后返回的 View 对象会自动转型成对应类型，因此在 Activity 中我们可以肆无忌惮地将实例化的对象用这个方法进行绑定  
而此时此刻，我们在 MyAdapter 这个类中，他继承 BaseAdapter，他们都没有**findViewById()** 这个方法，所以这里直接调用是不行的。Adapter 没有，但是 View 有呀，这就是为什么我们要在前面加个 view 对象， 声明这是 View 类中**findViewById()** 的方法

```java
    ImageView logo = my_view.findViewById(R.id.item_logo);
    TextView name = my_view.findViewById(R.id.item_name);
    TextView sex = my_view.findViewById(R.id.item_sex);
    TextView age = my_view.findViewById(R.id.item_age);
```

拿到控件对象后就是往里塞数据了，数据哪来呢，数据是从外面传来的，以键值对放在我们的 Map 中。  
但是每个 Map 存放的数据是不同的，我们要先拿到当前 Map，当前 Map 当然是 List 中的第 i 个 Map  
所以是这样（外部 Map 数据和之前 SimpleAdapter 的一样，就不重复了，完整代码会在最后，可以对着看）  
最后把我们这个 View 对象也给返回出来，MyAdapter 就算完工了

```java
    Map map = list.get(i);

    logo.setImageResource((Integer) map.get("logo"));
    name.setText((String) map.get("name"));
    sex.setText((String) map.get("sex"));
    age.setText((String) map.get("age"));
    return my_view;
```

#### MyAdapter 完整代码

```java
public class MyAdapter extends BaseAdapter {
    //存放数据的变量
    List<Map<String, Object>> list;
    LayoutInflater inflater;

    //setter
    public void setList(List<Map<String, Object>> list) {
        this.list = list;
    }

    //构造方法
    public MyAdapter(Context context) {
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return list.size();
    }

    @Override
    public Object getItem(int i) {
        return list.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View my_view = inflater.inflate(R.layout.item, null);

        ImageView logo = my_view.findViewById(R.id.item_logo);
        TextView name = my_view.findViewById(R.id.item_name);
        TextView sex = my_view.findViewById(R.id.item_sex);
        TextView age = my_view.findViewById(R.id.item_age);

        Map map = list.get(i);

        logo.setImageResource((Integer) map.get("logo"));
        name.setText((String) map.get("name"));
        sex.setText((String) map.get("sex"));
        age.setText((String) map.get("age"));

        return my_view;
    }
}
```

### 使用自定义 Adapter

已经定义好了我们的 Adapter，我们可以在 MainActivity 中实例化它了  
在 MainActivity 中代码相对简单，Map 中的数据可以看后面的完整代码，这里省略  
我们先实例化一个 MyAdapter 对象，然后把含有数据的 List 给放进来

```java
    MyAdapter myAdapter = new MyAdapter(this);
    myAdapter.setList(list);
    //关联
    listView.setAdapter(myAdapter);
```

#### MainActivity 代码

```java
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

        MyAdapter myAdapter = new MyAdapter(this);
        myAdapter.setList(list);

        //关联
        listView.setAdapter(myAdapter);
    }
}
```

### 小结

到这自定义 Adapter 就算构建好并投入使用了  
由于这篇文章紧接上篇的 **ArrayAdapter** 和 **SimpleAdapter** 介绍，为了避免篇幅过长， item 和主界面的布局代码都没有改动，这里就不展示了  
最终结果实际上也和 SimpleAdapter 的一样

简单来说自定义 Adapter 要经过三个步骤：

1. 继承 BaseAdapter，初始化及构造方法
2. 实现四个重写方法（**getView()**是重点）
3. 在 Activity 中进行实例化、导入数据和关联

## 自定义 Adapter 的优化

还记得我们刚才的这个方法是最笨的吗  
因为在**getView 方法**中我们直接从头 new 了一个 View 对象出来，其中主要是**inflate()** 和 **findViewById()** 方法，都是比较耗时的  
更难受的是我们加载每个 item 都要重新做一遍，这就导致耗时的加重，因此有很大的优化空间  
别忘了，**getView 方法**中有三个参数，我们现在才用了一个呢

### ConvertView 循环利用 View

先来解决**inflate()** 的问题  
我们每次 new 一个 View 对象出来，为了和布局绑定，它都要**inflate()** 一次 item 布局，那有什么方法能不自己 new 这个 View 对象呢？  
这时候有聪明宝宝就问了，“晓黑晓黑，这个 getView()方法的第二个参数就是 View 啊，我返回它不就行了吗干嘛还自己 new 啊？”

确实，这第二个参数，就是解决这个问题的关键  
虽然第二个参数就叫 view，但在以前是叫**convertView**，它利用了**Recycler 循环回收机制**，从而可以循环使用我们的 View，不用每次都 new 了  
怎么个循环法呢？  
当我们用 ListView 的时候，虽然我们有很多个 item，但是屏幕就是这么大，能显示的 item 数量是固定的。那么系统只需要在这个 item 在屏幕上的时候进行渲染就行了，不用一出来渲染所有 item。渲染完你要是不看，那我不是亏了？

简单来说，当我们打开一个 ListView 然后往下划，下面的 item 划到屏幕上，此时才开始对其实例化进行渲染。转念一想，上面的 item 被划出屏幕外就没用了，就这样丢了有点可惜，能不能把他用起来呢？  
convertView 就是基于这样的思想。我们可以将 convertView 这个对象看成一个**缓存池**，当上面的 item 被划出屏幕外不用的时候，将这个 view 对象放到 convertView 中，当下面有新的 item 要到屏幕上来的时候，我们不重新 new 一个 view，而是将 convertView 中存起来的 view 给这个 item 用，这样就成功地循环利用了 view，不用一直 new 了。  
当然了，刚开始 convertView 里是空的，那我们还是得老老实实 new，但是整体次数大幅度缩减。  
若一个屏幕能显示 N 个 item，那么不管有多少个 item，最多只用 new 出 N+1 个（貌似就是前 N+1 个 view 对象）。因为一开始往下划地时候第一个 item 还没完全划走，没有被回收，但下一个 item 已经划上来了，需要被渲染，所以此时 convertView 还是空的，这个 item 还是需要 new 出来。

讲了一大堆理论，不如动手改改代码，我们来到 MyAdapter 中的 getView()方法

#### ConvertView 代码实现

ConvertView 实际上就是**getView 方法的第二个参数**，在以前的 AS 版本中默认是叫 convertView，但新版本就默认叫 View 了  
代码只用在 getView 方法中进行修改，我们不需要自己 new 一个新的 View 了，而是先用 if 判断 ConvertView 里是否有回收来的 view 对象  
如果没有，那么只能老老实实给 ConvertView 整一个新的 view 对象（用 inflate 方法），如果有那么系统会自动调用，我们就不用 new 了  
当然，这里绑定布局我们还是用 findViewById，这部分我们在后面进一步进行优化

```java
    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {

        if (view == null) {
            view = inflater.inflate(R.layout.item,null);
        }
        ImageView logo = view.findViewById(R.id.item_logo);
        TextView name = view.findViewById(R.id.item_name);
        TextView sex = view.findViewById(R.id.item_sex);
        TextView age = view.findViewById(R.id.item_age);

        Map map = list.get(i);
        logo.setImageResource((Integer) map.get("logo"));
        name.setText((String) map.get("name"));
        sex.setText((String) map.get("sex"));
        age.setText((String) map.get("age"));

        return view;
    }
```

### ViewHolder

ViewHolder 其实是我们自己定义的一个类，他的使用思路其实和 ConvertView 有些类似  
我们用 ConvertView 是为了把 item 的布局给保存下来，在之后循环使用，避免多次调用**inflate 方法**  
而 ViewHolder 和 ConvertView 的不同之处就在于，他保存的是控件对象，而不是布局

在上一步中，我们在 getView 方法中使用了 ConvertView，只要他不为空，逻辑上讲我们每次都可以得到一个已经绑定布局的 View 对象（item.xml），但是我们仍要对四个控件的对象进行实例化并绑定，因此实际上**findViewById()** 方法耗时的问题还是没有解决，为此才有 ViewHolder 来**保存控件对象**

如何实现呢？  
简单的 ViewHolder 是我们自定义的一个类，里面甚至不需要任何方法，只用几个属性分别代表保存的控件对象即可  
当然如果对某些控件需要实现一些点击、长按等逻辑也可以在这里实现

```java
    public class ViewHolder{
        ImageView logo;
        TextView name;
        TextView sex;
        TextView age;
    }
```

随后便是将 ViewHolder 和 ConvertView 一起使用。我们的目的是让 ViewHolder 和 ConvertView 保持一致，也就是**没有就老实新建，有则循环利用**的原则  
我们在用 ConvertView 的时候，先判断他是不是为空，空的话说明还没有保存 View 对象，只能用老老实实用 inflate 加载布局。同理，在这种情况下，View 的 item 布局是刚加载进来的，那么控件肯定也是没有绑定的（控件包含在 item 布局中，没有布局怎么可能找到控件，对吧），所以这时候也要 new 一个 ViewHolder 出来。ViewHolder 里的成员变量其实就是控件对象，这时只能用**findViewById()**来绑定控件对象和布局控件。最后用一个**setTag()**来绑定这个 View 对象和 ViewHolder  
如果 ConvertView 不为空，说明里面已经存了一个 View 对象可以用，而且这个 View 对象已经绑定了 item 布局，以及一个 ViewHolder。所以我们让当前的 ViewHolder 等于这个 View 所绑定的 ViewHolder 就好了。  
代码就像这样：

```java
    if (view == null) {
        view = inflater.inflate(R.layout.item,null);
        holder = new ViewHolder();
        holder.logo = view.findViewById(R.id.item_logo);
        holder.name = view.findViewById(R.id.item_name);
        holder.sex = view.findViewById(R.id.item_sex);
        holder.age = view.findViewById(R.id.item_age);
        view.setTag(holder);
    } else {
        holder = (ViewHolder) view.getTag();
    }
```

经过上面的操作，不管一开始 ConvertView 里有没有东西，现在我们都有了一个绑定好布局和 ViewHolder 的 View 对象，所以接下来的操作就是让 ViewHolder 中的控件对象获取数据了

```java
    Map map = list.get(i);
    holder.logo.setImageResource((Integer) map.get("logo"));
    holder.name.setText((String) map.get("name"));
    holder.sex.setText((String) map.get("sex"));
    holder.age.setText((String) map.get("age"));
```

这里提一句，view 的**setTag()**和**getTag()**方法是一个让 view 携带数据的比较通用的方法，有点类似 Intent 里用 Bundle 传递数据  
我们这里让 view 携带了 ViewHolder，从而实现让 ViewHolder 一同随着 ConvertView 循环保存

#### 完整代码

```java
    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        ViewHolder holder = null;

        if (view == null) {
            view = inflater.inflate(R.layout.item,null);
            holder = new ViewHolder();
            holder.logo = view.findViewById(R.id.item_logo);
            holder.name = view.findViewById(R.id.item_name);
            holder.sex = view.findViewById(R.id.item_sex);
            holder.age = view.findViewById(R.id.item_age);
            view.setTag(holder);
        } else {
            holder = (ViewHolder) view.getTag();
        }

        Map map = list.get(i);
        holder.logo.setImageResource((Integer) map.get("logo"));
        holder.name.setText((String) map.get("name"));
        holder.sex.setText((String) map.get("sex"));
        holder.age.setText((String) map.get("age"));

        return view;
    }

    public class ViewHolder{
        ImageView logo;
        TextView name;
        TextView sex;
        TextView age;
    }
```

有些人可能会有疑问，如果 ConvertView 不为空，为什么还要把 view 的 ViewHolder 给取出来（**getTag()**）再还给 holder 呢？我从 ConvertView 拿到的 view 已经有 ViewHolder 以及里面的数据了呀？  
这里就要区分**当前的 ViewHolder**和**ConvertView 中 view 的 ViewHolder**了。  
ViewHolder 保存的都是控件对象，他们两个有什么不同呢？相同点是他们绑定的布局是一样的，不同的是载入的数据是不同的。  
我们需要的是绑定好的布局，因为我们不想重新 findViewById 去绑定嘛；至于数据，我们直接用新的数据覆盖就好了

要知道，渲染每个 item 的时候，这个**getView()方法**都会执行一次，这个方法在一开始是让 ViewHolder 为空，还没有实例化对象  
ConvertView 里没有 view，那 ok，我重新给 view 绑定布局，给 ViewHolder 绑定控件布局；ConvertView 里有 view，我拿出旧的 view，并让当前 ViewHolder 等于旧的 ViewHolder。  
到此，当前 ViewHolder 里已经有了**绑定好的控件布局**和**旧的 view 的数据**，所以之后再根据 item 的位置 i （**list.get(i)**）获取新的数据并覆盖更新，当前 view 就渲染完成了

### 小结

虽说是自定义 Adapter 的两种优化，但本质上优化的内容都是一样的，不管是**inflate()** 还是 **findViewById()**，都是对象和布局的一个绑定过程  
**inflate()**绑定 View 对象和 item 的布局，因为我们 getView 中返回的 View 对象就代表了一个 item；**findViewById()**则是对控件对象和布局中控件的绑定  
所以我们的两种优化，实际上都是对绑定布局的优化，减少了绑定布局所需的时间（减少了绑定布局的次数）

## 后记

Adapter 这一块内容比较多，因为除了 ListView，还有 GridView、RecyclerView 等控件都会需要用到 Adapter，内容虽然不尽相同，但却大同小异  
因此关于 Adapter 这一块，理解比记忆更加重要（到时候看别人的代码也能更能快理解嘛）  
最后放上一个通用 Adapter 的博客（[参考 6：Android 通用的 Adapter，或许你用我这一个就够了](https://www.jianshu.com/p/548f556c63f5)），若有兴趣可以继续学习嗷

## 参考

1. [我的博客：ArrayAdapter 和 SimpleAdapter 适配 ListView](../2021-04-09-Adapter-ArrayAdapter-SimpleAdapter-2021)
2. [developers：Activity](https://developer.android.com/reference/android/app/Activity)
3. [developers：View](https://developer.android.com/reference/android/view/View)
4. [孙老师课堂-ListView2](https://www.bilibili.com/video/BV1Mx411L7DV)
5. [使用 convertView 优化 ListView](https://blog.csdn.net/wuyouagd/article/details/50214587)
6. [Android 通用的 Adapter，或许你用我这一个就够了](https://www.jianshu.com/p/548f556c63f5)
