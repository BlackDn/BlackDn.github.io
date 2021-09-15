---
    layout:       post  
    title:        初识RecyclerView：基本使用  
    subtitle:     如何使用RecyclerView以及实现瀑布流布局  
    date:         2021-09-15  
    auther:       BlackDn  
    header-img:   img/19mon5_04.jpg   
    catalog:      true  
    tags:  
       - Android
---

> "啵唧一声，泡泡破了。鱼儿的呐喊，海洋的呼吸，须臾间流落到空中。"


## 前言

本来还想再摸几天的，结果一直被小朋友催更=。=  
所以RecyclerView终于是做出来了，这篇是基础用法   
然后还打算上一篇关于RecyclerView的缓存复用机制，这几天应该就能出，不急  
又然后前两天出去打桌球，还挺好玩。  
回来路上买了杯杨枝甘露，好喝。茶百道我单吹杨枝甘露。

# RecyclerView的基本使用

## 初识RecyclerView

**RecyclerView**是在Android 5.0加入的一个组件，当时还在`support-v7`包中，现已加入`AndroidX`了。  
之所以要推出RecyclerView，主要是为了代替ListView，毕竟他打出的旗号就是“ListView更高级、灵活的版本”。比如在使用ListView的时候，为了对其进行优化，在设置Adapter的时候需要我们自定义ViewHolder。而RecyclerView则吸取教训，直接将ViewHolder变成自己的一个内部类。  
单单这样讲或许有点空洞，我们来看看RecyclerView的组成，从而明白这玩意到底高级在哪。

### RecyclerView的组成

RecyclerView和ListView相似，他们本身都是一个View，不过这个View可以包含其他的View（Item），从而实现列表的效果。  
RecyclerView由一些比较常用的内部类组成，我们来看看。

| 内部类                      | 作用                                                         |
| --------------------------- | ------------------------------------------------------------ |
| RecyclerView.ViewHolder     | 存放子View（Item）的容器，通常在自定义Adapter中以内部类形式实现 |
| RecyclerView.Adapter        | 为子View（Item）创建视图、绑定数据，需要被自定义Adapter继承  |
| RecyclerView.LayoutManager  | 管理RecyclerView的布局（Item的分布）                         |
| RecyclerView.ItemDecoration | 给每一个Item添加新的View，比如分割线、间隔空白等             |
| RecyclerView.ItemAnimator   | 处理Item的动画效果                                           |
| RecyclerView.Recycler       | 处理View的缓存                                               |

看起来很多吗？别怕，就是给你看看，了解一下，并不会一一讲解。  
对于现在的我们来说，只需要注重RecyclerView的三点：**Adapter、ViewHolder，以及LayoutManager**。这三部分是让一个RecyclerView正常使用最基本的前提。

## RecyclerView的简单使用

### 布局

在开始介绍RecyclerView的使用方法时，我们先把布局的工作搞定。  
首先要一个Activity作为主界面，我新建了`RecyclerViewActivity.java`，在他的布局`activity_recycler_view.xml`中，放入一个`RecyclerView`

```xml
<!--activity_recycler_view.xml-->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".RecyclerViewActivity">
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recycler_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</androidx.constraintlayout.widget.ConstraintLayout>
```

然后，就像ListView一样，我们需要每个Item的布局，新建`item_recycler_view.xml`，其中就放入一个TextView。  
这里要注意一点，如果Item布局的最外层高度为`match_parent`的话，则会产生一个页面只有一个Item的效果。

```xml
<!--item_recycler_view.xml-->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    <TextView
        android:id="@+id/recycler_item_textview"
        android:background="#D5EAFF"
        android:text="test"
        android:layout_marginTop="20dp"
        android:textSize="20sp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
</LinearLayout>
```

布局搞定，和ListView一样，我们接下来写Adapter

### Adapter

我新建了`RecyclerViewAdapter.java`作为自定义Adapter，记得继承**RecyclerView内部类的Adapter**，后面要跟一个**ViewHolder**的泛型（此时这个泛型是我们自定义的ViewHolder内部类），一开始代码是这样：

```java
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolderOne> {}
```

第一步就是在Adapter里写一个ViewHolder的内部类，为了和`RecyclerView.ViewHolder`区分，就叫他`ViewHolderOne`  
实际上还是我们熟悉的ViewHolder，我们把一个Item的布局中，用到的控件都放进去就行了。这里只有一个TextView，比较简单。

```java
    //ViewHolder用于保存View对象的引用
    public static class ViewHolderOne extends RecyclerView.ViewHolder {
        private final TextView textView;
		//constructor
        public ViewHolderOne(View view) {
            super(view);
            textView = view.findViewById(R.id.recycler_item_textview);
            //这里可以设置点击事件的监听器
            textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Toast.makeText(view.getContext(), "click " + textView.getText(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        public TextView getTextView() {
            return textView;
        }
    }
```

在ViewHolder的构造方法里，我们绑定了`TextView`，设置了一个监听事件，最后写了一个getter方法，用于之后绑定数据的时候拿到这个`TextView`。  
ViewHolder告一段落，噢，差点忘了我们要一个Adapter的构造方法来传入数据源（外面有个全局变量的`String[] localDataSet`）

```java
//初始化数据
public RecyclerViewAdapter(String[] dataSet) {
    localDataSet = dataSet;
}
```

我们接下来要实现`RecyclerView.Adapter`的抽象方法了，这里主要有三个方法要实现

| 方法                 | 功能                                                         |
| -------------------- | ------------------------------------------------------------ |
| onCreateViewHolder() | 看名字就知道这个方法用于创建一个ViewHolder。当Adapter发现没ViewHolder的时候会调用这个方法 |
| onBindViewHolder()   | 如果已经有ViewHolder，则调用此方法                           |
| getItemCount()       | 这个方法返回数据源的长度，其实就是Item个数                   |

接下来我们来实现这三个方法

```java
    //创建新的View(由LayoutManager实现)
    @Override
    public ViewHolderOne onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycler_view, parent, false);
        return new ViewHolderOne(view);
    }
    //已经有View了，进行其中数据的替换(由LayoutManager实现)
    @Override
    public void onBindViewHolder(@NonNull @NotNull RecyclerViewAdapter.ViewHolderOne holder, int position) {
        holder.getTextView().setText(localDataSet[position]);
    }
    //返回数据源的长度(由LayoutManager实现)
    @Override
    public int getItemCount() {
        return localDataSet.length;
    }
```

`onCreateViewHolder()`因为要创建一个ViewHolder，所以我们先用LayoutInflater给一个View绑定布局，然后让这个View作为我们的ViewHolder  
`onBindViewHolder()`则需要对我们的控件绑定数据。这个方法的`holder`参数就为我们从缓存中拿到的、当前Item的`ViewHolder`。因为只有一个`TextView`，所以简单传入数据即可  
`getItemCount()`则直接返回数据源长度即可，他告诉RecyclerView有多少个Item需要渲染

总的Adapter代码就是这样

```java
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolderOne> {
    private String[] localDataSet;
    //ViewHolder用于保存View对象的引用
    public static class ViewHolderOne extends RecyclerView.ViewHolder {
        private final TextView textView;
        public ViewHolderOne(View view) {
            super(view);
            textView = view.findViewById(R.id.recycler_item_textview);
            //这里可以设置点击事件的监听器
            textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Toast.makeText(view.getContext(), "click" + textView.getText(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        public TextView getTextView() {
            return textView;
        }
    }
    //初始化数据
    public RecyclerViewAdapter(String[] dataSet) {
        localDataSet = dataSet;
    }

    //创建新的View(由LayoutManager实现)
    @Override
    public ViewHolderOne onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycler_view, parent, false);
        return new ViewHolderOne(view);
    }
    //已经有View了，进行其中数据的替换(由LayoutManager实现)
    @Override
    public void onBindViewHolder(@NonNull @NotNull RecyclerViewAdapter.ViewHolderOne holder, int position) {
        holder.getTextView().setText(localDataSet[position]);
    }
    //返回数据源的长度(由LayoutManager实现)
    @Override
    public int getItemCount() {
        return localDataSet.length;
    }
}
```

### Activity

最后到Activity里使用我们的**RecyclerView**就好了。细心的朋友发现，我们一开始说实现RecyclerView需要三个部分（Adapter、ViewHolder、LayoutManager），而我们写完Adapter后只搞定了Adapter和ViewHolder，还差个**LayoutManager**，这个就需要我们在Activity里给**RecyclerView**设置了。  
和ListView类似，绑定完`RecyclerView`后，我们还要实例化自定义的`Adapter`，给Adapter传入数据源，让RecyclerView绑定Adapter。此外， 就是要给RecyclerView设定`LayoutManager`了

```java
public class RecyclerViewActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private RecyclerViewAdapter adapter;
    private String[] dataSet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recycler_view);
        init();
    }
    public void init() {
        dataSet = new String[]{"test1", "test2", "test3", "test4", "test5", "test6"};
        recyclerView = findViewById(R.id.recycler_view);
        //set layout manager
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        //set adapter
        adapter = new RecyclerViewAdapter(dataSet);
        recyclerView.setAdapter(adapter);
    }
}
```

系统给我们定义了许多**LayoutManager**，这里用的是**LinearLayoutManager**，默认竖直布局，效果如下。

![Linear](https://z3.ax1x.com/2021/09/12/4pyFr8.png)

当然还可以通过`layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL)`来修改为水平布局。  
当然还有**GridLayoutManager**，实现类似GridView的布局（所以说RecyclerView高级吧，还能代替GridView），只需要修改设置LayoutManager处的代码如下即可。后面的数字就表示这个网格布局是几列的。

```java
    //set layout manager
    GridLayoutManager layoutManager = new GridLayoutManager(this, 3);
    recyclerView.setLayoutManager(layoutManager);
```

![Grid](https://z3.ax1x.com/2021/09/12/4pyiKf.png)

## RecyclerView支持多种Item

对，你没看错，RecyclerView另一个高级的地方就在于他支持多种Item显示。这种事ListView他做得到吗？做得到吗？  
在之前的例子，以及我们使用ListView的时候，都给Item写了一个布局，因为我们的想法中就只有一个Item。那么现在我们再写一个布局，作为第二个Item，然后让两个Item在RecyclerView中一起显示。  

### Item2的布局

新建`item_recycler_view2.xml`作为Item2的布局，这里放入一个加粗居中的`TextView`，和Item1进行区分

```xml
<!--item_recycler_view2.xml-->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    <TextView
        android:id="@+id/recycler_item2_textview"
        android:text="Item 2"
        android:textSize="30dp"
        android:textStyle="bold"
        android:layout_gravity="center_horizontal"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
</LinearLayout>
```

### Adapter根据viewType载入Item

具体要怎么实现呢？我们来到`RecyclerViewAdapter`，这时候，我们从头开始看看，对于**实现两个Item**，Adapter要产生哪些变化。  
首先我们可以发现，在上面`onCreateViewHolder()`方法中，有个参数`viewType`没有用到，其实这个参数就是`RecyclerView`用来标识不同Item的。因此，不同的Item都应该有不同的`viewType`，基本上**有种个Item就有几个`viewType`**  
此外，既然Item的布局，那么我们的ViewHolder也应该不同，毕竟不同Item中的布局/控件都是不同的。因此**有几种Item就得有几个ViewHolder**。那么这又有一个新的问题，在之前自定义Adapter的时候，我们所继承`RecyclerView.Adapter`中的**泛型**是我们自己写的ViewHolderOne，因为那时候只有一个Item，只有一个ViewHolder，所以没有问题。但是现在有两个Item，有两个ViewHolder，所以这个泛型就不能是自己的ViewHolder，而是他们的父类，`RecyclerView.ViewHolder`，所以可以找找下面两行代码的区别：

```java
//只有一个Item：泛型为自己写的ViewHolderOne
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolderOne>{}
//有多个Item：泛型为父类，即RecyclerView.ViewHolder
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder>{}
```

好了，修改了**泛型**，我们接着往下。我们现在有两个Item，所以需要有两个viewType来标识两种Item。因此，设置两个全局的常量，`VIEW_TYPE_ONE`表示Item1，`VIEW_TYPE_TWO`表示Item2

```java
    private final int VIEW_TYPE_ONE = 1;
    private final int VIEW_TYPE_TWO = 2;
```

然后是两个**ViewHoler**，我们已经有了个`ViewHolderOne`代表Item1，所以直接添加一个`ViewHolderTwo。因为两个Item都是一个`TextView`，结构一样，所以代码也差不多。

```java
public static class ViewHolderTwo extends RecyclerView.ViewHolder {
    private final TextView textView;
    public ViewHolderTwo(View view) {
        super(view);
        textView = view.findViewById(R.id.recycler_item2_textview);
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(view.getContext(), "item2: ", Toast.LENGTH_SHORT).show();
            }
        });
    }
    public TextView getTextView() {
        return textView;
    }
}
```

然后我们来到`onCreateViewHolder()`方法，这个方法自带`viewType`参数，我们根据这个参数来选择创建不同的ViewHolder。由于不能确定我们返回的ViewHolder是哪个，所以这个方法的返回值也要进行修改。只有一个Item时，他的返回值是我们自定义的`ViewHolder`；现在又两个Item，可能返回`ViewHolderOne`或`ViewHolderTwo`，因此返回值应该为他们的父类，即`RecyclerView.ViewHolder`

```java
//只有一个Item：返回自定义的ViewHolder
public ViewHolderOne onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {}
//两个Item：返回父类，RecyclerView.ViewHolder
@Override
public RecyclerView.ViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
    View view = null;
    RecyclerView.ViewHolder viewHolder = null;
    switch (viewType) {
        case VIEW_TYPE_ONE:
            view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycler_view, parent, false);
            viewHolder = new ViewHolderOne(view);
            break;
        case VIEW_TYPE_TWO:
            view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycler_view2, parent, false);
            viewHolder = new ViewHolderTwo(view);
            break;
    }
    return  viewHolder;
}
```

既然要根据不同的`viewType`创建不同的ViewHolder，而不同的ViewHolder所绑定的数据自然也不一样，因此在`onBindViewHolder()`方法也应该根据`viewType`来绑定不同Item的数据。可是仔细一看`onBindViewHolder()`没有`viewType`参数，这可怎么办？不怕，这个方法有一个`holder`参数，他的`holder.getItemViewType()`方法可以返回当前Item的`viewType`，用这个方法就可以实现根据`viewType`来绑定不同Item的数据。  
不过因为之前我们只有一个Item，一个ViewHolder，所以我可以保证拿到的`ViewHolder`就是我自定义的`ViewHolderOne`，因此参数中的`holder`就是`ViewHolderOne`。而现在我们有两个Item，两个ViewHolder，我们不能去顶拿到的ViewHolder是哪个（可能是`ViewHolderOne`，也可能是`ViewHolderTwo`），因此，这个方法里的ViewHolder应该是他们的父类`RecyclerView.ViewHolder`，然后根据`viewType`转型成对应的ViewHolder。

```java
//一个Item：参数的holder就是自定义的ViewHolder
public void onBindViewHolder(@NonNull @NotNull RecyclerViewAdapter.ViewHolderOne holder, int position) {}
//两个Item：参数的holder是父类RecyclerView.ViewHolder
@Override
public void onBindViewHolder(@NonNull @NotNull RecyclerView.ViewHolder holder, int position) {
    int viewType = holder.getItemViewType();
    switch (viewType) {
        case VIEW_TYPE_ONE:
            ViewHolder viewHolderOne = (ViewHolder) holder;
            viewHolderOne.getTextView().setText(localDataSet[position]);
            break;
        case VIEW_TYPE_TWO:
            ViewHolderTwo viewHolderTwo = (ViewHolderTwo) holder;
            viewHolderTwo.getTextView().setText(localDataSet[position]);
            break;
    }
}
```

这里我们假定两个Item的数据在同一个数据源`localDataSet[]`中，因为两个Item都只有一个`TextView`，我们设置个文本就好。

对于最后一个方法`getItemCount()`，因为我们的数据源仍只有一个没有变，所以方法也不用变。  
不过还差最后一步，现在`onCreateViewHolder()`已经知道不同`viewType`要载入不同Item，那么当他拿到一个ViewHolder，又怎么知道现在用的是哪个`viewType`呢？所以我们还得重写一个方法`getItemViewType()`，这个方法根据`position`来返回不同的`viewType`。因为RecyclerView能知道现在的`position`是多少，所以我们要做的就是设定`position`和载入Item之间的关系。比如我想要**头两个Item是Item2，剩下的都载入Item1**：

```java
//根据position返回viewType
@Override
public int getItemViewType(int position) {
    if (position == 0 || position == 1) {
        return VIEW_TYPE_TWO;
    } else {
        return VIEW_TYPE_ONE;
    }
}
```

总的Adapter代码如下：

```java
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private String[] localDataSet;
    private static final int VIEW_TYPE_ONE = 1;
    private static final int VIEW_TYPE_TWO = 2;
    //ViewHolder用于保存View对象的引用
    public static class ViewHolderOne extends RecyclerView.ViewHolder {
        private final TextView textView;
        public ViewHolderOne(View view) {
            super(view);
            textView = view.findViewById(R.id.recycler_item_textview);
            //这里可以设置点击事件的监听器
            textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Toast.makeText(view.getContext(), "click" + textView.getText(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        public TextView getTextView() {
            return textView;
        }
    }
    public static class ViewHolderTwo extends RecyclerView.ViewHolder {
        private final TextView textView;
        public ViewHolderTwo(View view) {
            super(view);
            textView = view.findViewById(R.id.recycler_item2_textview);
            textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Toast.makeText(view.getContext(), "item2: ", Toast.LENGTH_SHORT).show();
                }
            });
        }
        public TextView getTextView() {
            return textView;
        }
    }
    //初始化数据
    public RecyclerViewAdapter(String[] dataSet) {
        localDataSet = dataSet;
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        View view = null;
        RecyclerView.ViewHolder viewHolder = null;
        switch (viewType) {
            case VIEW_TYPE_ONE:
                view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycler_view, parent, false);
                viewHolder = new ViewHolderOne(view);
                break;
            case VIEW_TYPE_TWO:
                view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycler_view2, parent, false);
                viewHolder = new ViewHolderTwo(view);
                break;
        }
        return  viewHolder;
    }
    @Override
    public void onBindViewHolder(@NonNull @NotNull RecyclerView.ViewHolder holder, int position) {
        int viewType = holder.getItemViewType();
        switch (viewType) {
            case VIEW_TYPE_ONE:
                ViewHolderOne viewHolderOne = (ViewHolderOne) holder;
                viewHolderOne.getTextView().setText(localDataSet[position]);
                break;
            case VIEW_TYPE_TWO:
                ViewHolderTwo viewHolderTwo = (ViewHolderTwo) holder;
                viewHolderTwo.getTextView().setText(localDataSet[position]);
                break;
        }
    }
    @Override
    public int getItemCount() {
        return localDataSet.length;
    }
    @Override
    public int getItemViewType(int position) {
        if (position == 0 || position == 1) {
            return VIEW_TYPE_TWO;
        } else {
            return VIEW_TYPE_ONE;
        }
    }
}
```

### Activity

实际上Activity中的代码不需要变，不过为了方便展示，这里修改了一下Activity中数据源的数据。因为在Adapter中，两个Item用的是同一个数据源，我们规定前两个是Item2，剩下的还是Item1。因此我们写数据源的时候也要遵守这个规定：前两个数据源是Item2的，后面的是Item1的。

```java
public class RecyclerViewActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private RecyclerViewAdapter adapter;
    private String[] dataSet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recycler_view);
        init();
    }
    public void init() {
        dataSet = new String[]{"item2:test1", "item2:test2", "test1", "test2", "test3", "test4"};
        recyclerView = findViewById(R.id.recycler_view);
        //set layout manager
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        //set adapter
        adapter = new RecyclerViewAdapter(dataSet);
        recyclerView.setAdapter(adapter);
    }
}
```

![DoubleItem](https://z3.ax1x.com/2021/09/13/4CkY38.png)



## RecyclerView实现瀑布流布局

所谓**瀑布流布局（WaterFall Layout）**，就是类似网格布局，几列Item向下排列。但通常几列Item之间宽度固定，高度不同，从而实现错落有致的美感。最常见的应该是某宝和某红书的界面了。

这个瀑布流吧，你说他难，其实用RecyclerView里的`StaggeredGridLayoutManager`就能搞定了。你说他不难吧，还容易出一堆问题，比如滑动卡顿、条目闪动等问题。所以外面的关于瀑布流的优化比瀑布流本身的介绍要多得多。  
不过这里呢就最基础地实现一下。其实上面我们用过了`LinearLayoutManager`和`GridLayoutManager`，现在只用换成`StaggeredGridLayoutManager`就差不多实现瀑布流了。但是这样高贵的您肯定不会满意，所以我们尝试另一种**载入数据**的方式：为Item创建对应的类，即**ItemBean**。

### ItemBean

之前我们传递数据的时候，因为Item里只有一个TextView，所以我们直接用String数组传递数据给Adapter。那如果多个图片呢？我们似乎可以给Adapter传递两个数组。但是当Item中的控件越来越多，需要绑定的数据也变多时，这种方式显然是不可取的。于是，我们可以根据Item的内容，为Item创建一个对象，这样在传递数据的时候，只用把这个Item对象的数组传给Adapter就好了，不管Item里有多少控件，我始终只用给Adapte一个数组。

新建`ItemBean.java`作为我们的Item对象。这里的Item包含一个`ImageView`和一个`TextView`，所以我们的结构如下：

```java
public class ItemBean {
    private int imageId;
    private String text;
	//constructor
    public ItemBean(int imageId, String text) {
        this.imageId = imageId;
        this.text = text;
    }
	//getter
    public int getImageId() {
        return imageId;
    }
    public String getText() {
        return text;
    }
}
```

ItemBean的属性就是这个Item所包含的，需要传入数据的控件内容。他可以没有setter方法，因为我们可以利用构造方法为其设定数据；但是一定要有getter方法，因为在Adapter中，我们需要得到其属性值，将其传给ViewHolder。时刻记住**这个ItemBean是保存Item数据的容器，而非Item本身**。（ViewHolder才是）

### 布局

新建`WaterFallActivity.java`作为主页，布局比较简单（`activity_water_fall.xml`）就是一个`RecyclerView`，就不放代码了。  
Item的布局（`item_water_fall.xml`）就是一个`ImageView`+`TextView`，如下，这里加了个背景色方便区分Item。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:background="#9AB7D5"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    <ImageView
        android:id="@+id/water_fall_image"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:src="@mipmap/meme"/>
    <TextView
        android:id="@+id/water_fall_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="water fall text"
        android:textSize="20dp"
        android:layout_gravity="center_horizontal"/>
</LinearLayout>
```

### Adapter

新建`WaterFallAdapter.java`作为瀑布流布局的Adapter，咱现在把他写出来相信难度不大。    
自定义MyViewHolder，代表Item，含有ImageView和TextView。因为只有一个Item所以泛型直接用我们自定义的MyViewHolder  
要注意的一点就是我们的数据源存在一个泛型为`ItemBean`的列表里：`List<ItemBean> items`。所以在`onBindViewHolder()`中获取数据的时候要先从中拿到一个ItemBean，再取出ItemBean的数据给`ViewHolder`。

```java
public class WaterFallAdapter extends RecyclerView.Adapter<WaterFallAdapter.MyViewHolder> {
    private List<ItemBean> items;	//数据源
	//自定义ViewHolder
    static class MyViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;
        TextView textView;
        public MyViewHolder(View view) {
            super(view);
            imageView = view.findViewById(R.id.water_fall_image);
            textView = view.findViewById(R.id.water_fall_text);
        }
    }
    public WaterFallAdapter(List<ItemBean> items) {
        this.items = items;
    }

    @Override
    public MyViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_water_fall, parent, false);
        return new MyViewHolder(view);
    }
    @Override
    public void onBindViewHolder(@NonNull @NotNull WaterFallAdapter.MyViewHolder holder, int position) {
        ItemBean itemBean = items.get(position);	//得到ItemBean
        holder.imageView.setImageResource(itemBean.getImageId());	//将ItemBean数据传给ViewHolder
        holder.textView.setText(itemBean.getText());
    }
    @Override
    public int getItemCount() {
        return items.size();
    }
}
```

### Activity

因为我们的数据源采用`List<ItemBean> items`的形式，所以一开始我们得构建一些数据，让后把他们扔到这个List里面，此外为了凸显瀑布流的效果，我们还得让Item的`TextView`长短不一，于是有了下面这两个方法。

```java
private final List<ItemBean> items = new ArrayList<>();
//构建Item列表
private void init() {
    for (int i = 0; i < 2; i++) {
        ItemBean item1 = new ItemBean(R.mipmap.meme, getRandomLengthText("item1"));
        items.add(item1);
        ItemBean item2 = new ItemBean(R.drawable.ic_launcher_foreground, getRandomLengthText("item2"));
        items.add(item2);
        ItemBean item3 = new ItemBean(R.mipmap.ic_launcher_round, getRandomLengthText("item3"));
        items.add(item3);
        ItemBean item4 = new ItemBean(R.mipmap.meme, getRandomLengthText("item4"));
        items.add(item4);
        ItemBean item5 = new ItemBean(R.mipmap.meme, getRandomLengthText("item5"));
        items.add(item5);
    }
}
//重复随机次数的name
public String getRandomLengthText(String name) {
    Random random = new Random();
    int length = random.nextInt(10) + 1;
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < length; i++) {
        builder.append(name);
    }
    return builder.toString();
}
```

我们用ItemBean的构造方法创建一个ItemBean对象，然后把他们加入到List中。图片大家随便找找试一下就行。图片下的文字用`getRandomLengthText`方法重复多遍，变得长一些。

然后我们就该安排RecyclerView了，主要是他的LayoutManager和Adapter。我们选用`StaggeredGridLayoutManager`，后面跟的参数表示3列，竖直排列。  
Adapter就传入我们的items作为参数即可。

```java
    private void setRecyclerView(){
        RecyclerView recyclerView = findViewById(R.id.water_fall_recycler_view);
        //set LayoutManager
        StaggeredGridLayoutManager layoutManager = new StaggeredGridLayoutManager(3, StaggeredGridLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(layoutManager);
        //set Adapter
        WaterFallAdapter adapter = new WaterFallAdapter(items);
        recyclerView.setAdapter(adapter);
    }
```

最后在`OnCreate()`方法中调用`init()`和`setRecyclerView()`即可，全部代码如下：

```java
public class WaterFallActivity extends AppCompatActivity 
    
    private final List<ItemBean> items = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_water_fall);
        init();
        setRecyclerView();
    }
    private void setRecyclerView(){
        RecyclerView recyclerView = findViewById(R.id.water_fall_recycler_view);
        //set LayoutManager
        StaggeredGridLayoutManager layoutManager = new StaggeredGridLayoutManager(3, StaggeredGridLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(layoutManager);
        //set Adapter
        WaterFallAdapter adapter = new WaterFallAdapter(items);
        recyclerView.setAdapter(adapter);
    }
	//构建Item列表
    private void init() {
        for (int i = 0; i < 2; i++) {
            ItemBean item1 = new ItemBean(R.mipmap.meme, getRandomLengthText("item1"));
            items.add(item1);
            ItemBean item2 = new ItemBean(R.drawable.ic_launcher_foreground, getRandomLengthText("item2"));
            items.add(item2);
            ItemBean item3 = new ItemBean(R.mipmap.ic_launcher_round, getRandomLengthText("item3"));
            items.add(item3);
            ItemBean item4 = new ItemBean(R.mipmap.meme, getRandomLengthText("item4"));
            items.add(item4);
            ItemBean item5 = new ItemBean(R.mipmap.meme, getRandomLengthText("item5"));
            items.add(item5);
        }
    }
    //重复随机次数的name
    public String getRandomLengthText(String name) {
        Random random = new Random();
        int length = random.nextInt(10) + 1;
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            builder.append(name);
        }
        return builder.toString();
    }
}
```

![waterfall](https://z3.ax1x.com/2021/09/15/4eKO9x.png)

### 添加Item之间的间隔

我们发现，瀑布流的效果是基本实现了，但是因为Item之间没有间隔，所以显得意外的丑。于是我们接着给Item们加上间隔  
这就要请出我们的**RecyclerView.ItemDecoration**了，他可以简单且灵活地为Item添加间隔。**ItemDecoration**本身为RecyclerView里的一个抽象类，因此我们要先实现他。  
新建`MyItemDecoration.java`（当然嫌麻烦也可以在Activity里用内部类的方式实现），重写其`getItemOffsets()`方法

```java
public class MyItemDecoration extends RecyclerView.ItemDecoration {
    private int space;
    public MyItemDecoration(int space) {
        this.space = space;
    }
    @Override
    public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
        outRect.left = space;
        outRect.right = space;
        if (parent.getChildLayoutPosition(view) >= 3) { //从第二行的Item开始有top的间隔
            outRect.top = space;
        }
    }
}
```

在`getItemOffsets()`方法中，参数的`view`代表当前View`parent`代表View所在的RecyclerView。第一个参数`outRect`就是偏移量，相当**padding**或**margin**，默认值是0。  
所以我们在其中给所有Item添加左右两个间隔，然后给第一行以外的Item一个上方的间隔。

然后就可以回到`WaterFallActivity`中，给我们的RecyclerView加上ItemDecoration。在`setRecyclerView()`中加入以下两行：

```java
private void setRecyclerView(){
    //set LayoutManager
	······
    //set ItemDecoration
    int space = getResources().getDimensionPixelSize(R.dimen.default_dimen);
    recyclerView.addItemDecoration(new MyItemDecoration(space));
    //set Adapter
	·······
}
```

![ItemDecoration](https://z3.ax1x.com/2021/09/15/4eKX36.png)

## 后记

这瀑布流勉强能看了，就到这吧。虽然实际上瀑布流还会遇到许多问题，不过我也懒得写，也不给大家添堵了。  
玩游戏去咯。

## 参考

1. [developers: Create dynamic lists with RecyclerView ](https://developer.android.com/guide/topics/ui/layout/recyclerview)
2. [RecyclerView的使用](https://blog.csdn.net/weixin_40625864/article/details/105207826)
3. [StackOverflow：RecyclerView onCreateViewHolder Return Type Incompatibility With Multiple Custom ViewHolders](https://stackoverflow.com/questions/32040798/recyclerview-oncreateviewholder-return-type-incompatibility-with-multiple-custom)
5. [RecyclerView Realizes Waterfall Flow Layout](https://programmer.help/blogs/recyclerview-realizes-waterfall-flow-layout.html)



