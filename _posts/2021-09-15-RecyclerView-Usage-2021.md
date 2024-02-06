---
    layout:       post  
    title:        初识RecyclerView：基本使用  
    subtitle:     如何使用RecyclerView以及实现瀑布流布局  
    date:         2021-09-15  
    author:       BlackDn  
    header-img:   img/19mon5_04.jpg   
    catalog:      true  
    tags:  
       - Android
---

> "啵唧一声，泡泡破了。鱼儿的呐喊，海洋的呼吸，须臾间流落到空中。"

## 前言

本来还想再摸几天的，结果一直被小朋友催更=。=  
所以 RecyclerView 终于是做出来了，这篇是基础用法  
然后还打算上一篇关于 RecyclerView 的缓存复用机制，这几天应该就能出，不急  
又然后前两天出去打桌球，还挺好玩。  
回来路上买了杯杨枝甘露，好喝。茶百道我单吹杨枝甘露。

# RecyclerView 的基本使用

## 初识 RecyclerView

**RecyclerView**是在 Android 5.0 加入的一个组件，当时还在`support-v7`包中，现已加入`AndroidX`了。  
之所以要推出 RecyclerView，主要是为了代替 ListView，毕竟他打出的旗号就是“ListView 更高级、灵活的版本”。比如在使用 ListView 的时候，为了对其进行优化，在设置 Adapter 的时候需要我们自定义 ViewHolder。而 RecyclerView 则吸取教训，直接将 ViewHolder 变成自己的一个内部类。  
单单这样讲或许有点空洞，我们来看看 RecyclerView 的组成，从而明白这玩意到底高级在哪。

### RecyclerView 的组成

RecyclerView 和 ListView 相似，他们本身都是一个 View，不过这个 View 可以包含其他的 View（Item），从而实现列表的效果。  
RecyclerView 由一些比较常用的内部类组成，我们来看看。

| 内部类                      | 作用                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| RecyclerView.ViewHolder     | 存放子 View（Item）的容器，通常在自定义 Adapter 中以内部类形式实现 |
| RecyclerView.Adapter        | 为子 View（Item）创建视图、绑定数据，需要被自定义 Adapter 继承     |
| RecyclerView.LayoutManager  | 管理 RecyclerView 的布局（Item 的分布）                            |
| RecyclerView.ItemDecoration | 给每一个 Item 添加新的 View，比如分割线、间隔空白等                |
| RecyclerView.ItemAnimator   | 处理 Item 的动画效果                                               |
| RecyclerView.Recycler       | 处理 View 的缓存                                                   |

看起来很多吗？别怕，就是给你看看，了解一下，并不会一一讲解。  
对于现在的我们来说，只需要注重 RecyclerView 的三点：**Adapter、ViewHolder，以及 LayoutManager**。这三部分是让一个 RecyclerView 正常使用最基本的前提。

## RecyclerView 的简单使用

### 布局

在开始介绍 RecyclerView 的使用方法时，我们先把布局的工作搞定。  
首先要一个 Activity 作为主界面，我新建了`RecyclerViewActivity.java`，在他的布局`activity_recycler_view.xml`中，放入一个`RecyclerView`

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

然后，就像 ListView 一样，我们需要每个 Item 的布局，新建`item_recycler_view.xml`，其中就放入一个 TextView。  
这里要注意一点，如果 Item 布局的最外层高度为`match_parent`的话，则会产生一个页面只有一个 Item 的效果。

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

布局搞定，和 ListView 一样，我们接下来写 Adapter

### Adapter

我新建了`RecyclerViewAdapter.java`作为自定义 Adapter，记得继承**RecyclerView 内部类的 Adapter**，后面要跟一个**ViewHolder**的泛型（此时这个泛型是我们自定义的 ViewHolder 内部类），一开始代码是这样：

```java
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolderOne> {}
```

第一步就是在 Adapter 里写一个 ViewHolder 的内部类，为了和`RecyclerView.ViewHolder`区分，就叫他`ViewHolderOne`  
实际上还是我们熟悉的 ViewHolder，我们把一个 Item 的布局中，用到的控件都放进去就行了。这里只有一个 TextView，比较简单。

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

在 ViewHolder 的构造方法里，我们绑定了`TextView`，设置了一个监听事件，最后写了一个 getter 方法，用于之后绑定数据的时候拿到这个`TextView`。  
ViewHolder 告一段落，噢，差点忘了我们要一个 Adapter 的构造方法来传入数据源（外面有个全局变量的`String[] localDataSet`）

```java
//初始化数据
public RecyclerViewAdapter(String[] dataSet) {
    localDataSet = dataSet;
}
```

我们接下来要实现`RecyclerView.Adapter`的抽象方法了，这里主要有三个方法要实现

| 方法                 | 功能                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| onCreateViewHolder() | 看名字就知道这个方法用于创建一个 ViewHolder。当 Adapter 发现没 ViewHolder 的时候会调用这个方法 |
| onBindViewHolder()   | 如果已经有 ViewHolder，则调用此方法                                                            |
| getItemCount()       | 这个方法返回数据源的长度，其实就是 Item 个数                                                   |

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

`onCreateViewHolder()`因为要创建一个 ViewHolder，所以我们先用 LayoutInflater 给一个 View 绑定布局，然后让这个 View 作为我们的 ViewHolder  
`onBindViewHolder()`则需要对我们的控件绑定数据。这个方法的`holder`参数就为我们从缓存中拿到的、当前 Item 的`ViewHolder`。因为只有一个`TextView`，所以简单传入数据即可  
`getItemCount()`则直接返回数据源长度即可，他告诉 RecyclerView 有多少个 Item 需要渲染

总的 Adapter 代码就是这样

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

最后到 Activity 里使用我们的**RecyclerView**就好了。细心的朋友发现，我们一开始说实现 RecyclerView 需要三个部分（Adapter、ViewHolder、LayoutManager），而我们写完 Adapter 后只搞定了 Adapter 和 ViewHolder，还差个**LayoutManager**，这个就需要我们在 Activity 里给**RecyclerView**设置了。  
和 ListView 类似，绑定完`RecyclerView`后，我们还要实例化自定义的`Adapter`，给 Adapter 传入数据源，让 RecyclerView 绑定 Adapter。此外， 就是要给 RecyclerView 设定`LayoutManager`了

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
当然还有**GridLayoutManager**，实现类似 GridView 的布局（所以说 RecyclerView 高级吧，还能代替 GridView），只需要修改设置 LayoutManager 处的代码如下即可。后面的数字就表示这个网格布局是几列的。

```java
    //set layout manager
    GridLayoutManager layoutManager = new GridLayoutManager(this, 3);
    recyclerView.setLayoutManager(layoutManager);
```

![Grid](https://z3.ax1x.com/2021/09/12/4pyiKf.png)

## RecyclerView 支持多种 Item

对，你没看错，RecyclerView 另一个高级的地方就在于他支持多种 Item 显示。这种事 ListView 他做得到吗？做得到吗？  
在之前的例子，以及我们使用 ListView 的时候，都给 Item 写了一个布局，因为我们的想法中就只有一个 Item。那么现在我们再写一个布局，作为第二个 Item，然后让两个 Item 在 RecyclerView 中一起显示。

### Item2 的布局

新建`item_recycler_view2.xml`作为 Item2 的布局，这里放入一个加粗居中的`TextView`，和 Item1 进行区分

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

### Adapter 根据 viewType 载入 Item

具体要怎么实现呢？我们来到`RecyclerViewAdapter`，这时候，我们从头开始看看，对于**实现两个 Item**，Adapter 要产生哪些变化。  
首先我们可以发现，在上面`onCreateViewHolder()`方法中，有个参数`viewType`没有用到，其实这个参数就是`RecyclerView`用来标识不同 Item 的。因此，不同的 Item 都应该有不同的`viewType`，基本上**有种个 Item 就有几个`viewType`**  
此外，既然 Item 的布局，那么我们的 ViewHolder 也应该不同，毕竟不同 Item 中的布局/控件都是不同的。因此**有几种 Item 就得有几个 ViewHolder**。那么这又有一个新的问题，在之前自定义 Adapter 的时候，我们所继承`RecyclerView.Adapter`中的**泛型**是我们自己写的 ViewHolderOne，因为那时候只有一个 Item，只有一个 ViewHolder，所以没有问题。但是现在有两个 Item，有两个 ViewHolder，所以这个泛型就不能是自己的 ViewHolder，而是他们的父类，`RecyclerView.ViewHolder`，所以可以找找下面两行代码的区别：

```java
//只有一个Item：泛型为自己写的ViewHolderOne
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolderOne>{}
//有多个Item：泛型为父类，即RecyclerView.ViewHolder
public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder>{}
```

好了，修改了**泛型**，我们接着往下。我们现在有两个 Item，所以需要有两个 viewType 来标识两种 Item。因此，设置两个全局的常量，`VIEW_TYPE_ONE`表示 Item1，`VIEW_TYPE_TWO`表示 Item2

```java
    private final int VIEW_TYPE_ONE = 1;
    private final int VIEW_TYPE_TWO = 2;
```

然后是两个**ViewHoler**，我们已经有了个`ViewHolderOne`代表 Item1，所以直接添加一个`ViewHolderTwo`。因为两个 Item 都是一个`TextView`，结构一样，所以代码也差不多。

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

然后我们来到`onCreateViewHolder()`方法，这个方法自带`viewType`参数，我们根据这个参数来选择创建不同的 ViewHolder。由于不能确定我们返回的 ViewHolder 是哪个，所以这个方法的返回值也要进行修改。只有一个 Item 时，他的返回值是我们自定义的`ViewHolder`；现在又两个 Item，可能返回`ViewHolderOne`或`ViewHolderTwo`，因此返回值应该为他们的父类，即`RecyclerView.ViewHolder`

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

既然要根据不同的`viewType`创建不同的 ViewHolder，而不同的 ViewHolder 所绑定的数据自然也不一样，因此在`onBindViewHolder()`方法也应该根据`viewType`来绑定不同 Item 的数据。可是仔细一看`onBindViewHolder()`没有`viewType`参数，这可怎么办？不怕，这个方法有一个`holder`参数，他的`holder.getItemViewType()`方法可以返回当前 Item 的`viewType`，用这个方法就可以实现根据`viewType`来绑定不同 Item 的数据。  
不过因为之前我们只有一个 Item，一个 ViewHolder，所以我可以保证拿到的`ViewHolder`就是我自定义的`ViewHolderOne`，因此参数中的`holder`就是`ViewHolderOne`。而现在我们有两个 Item，两个 ViewHolder，我们不能确定拿到的 ViewHolder 是哪个（可能是`ViewHolderOne`，也可能是`ViewHolderTwo`），因此，这个方法里的 ViewHolder 应该是他们的父类`RecyclerView.ViewHolder`，然后根据`viewType`转型成对应的 ViewHolder。

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

这里我们假定两个 Item 的数据在同一个数据源`localDataSet[]`中，因为两个 Item 都只有一个`TextView`，我们设置个文本就好。

对于最后一个方法`getItemCount()`，因为我们的数据源仍只有一个没有变，所以方法也不用变。  
不过还差最后一步，现在`onCreateViewHolder()`已经知道不同`viewType`要载入不同 Item，那么当他拿到一个 ViewHolder，又怎么知道现在用的是哪个`viewType`呢？所以我们还得重写一个方法`getItemViewType()`，这个方法根据`position`来返回不同的`viewType`。因为 RecyclerView 能知道现在的`position`是多少，所以我们要做的就是设定`position`和载入 Item 之间的关系。比如我想要**头两个 Item 是 Item2，剩下的都载入 Item1**：

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

总的 Adapter 代码如下：

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

实际上 Activity 中的代码不需要变，不过为了方便展示，这里修改了一下 Activity 中数据源的数据。因为在 Adapter 中，两个 Item 用的是同一个数据源，我们规定前两个是 Item2，剩下的还是 Item1。因此我们写数据源的时候也要遵守这个规定：前两个数据源是 Item2 的，后面的是 Item1 的。

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

## RecyclerView 实现瀑布流布局

所谓**瀑布流布局（WaterFall Layout）**，就是类似网格布局，几列 Item 向下排列。但通常几列 Item 之间宽度固定，高度不同，从而实现错落有致的美感。最常见的应该是某宝和某红书的界面了。

这个瀑布流吧，你说他难，其实用 RecyclerView 里的`StaggeredGridLayoutManager`就能搞定了。你说他不难吧，还容易出一堆问题，比如滑动卡顿、条目闪动等问题。所以外面的关于瀑布流的优化比瀑布流本身的介绍要多得多。  
不过这里呢就最基础地实现一下。其实上面我们用过了`LinearLayoutManager`和`GridLayoutManager`，现在只用换成`StaggeredGridLayoutManager`就差不多实现瀑布流了。但是这样高贵的您肯定不会满意，所以我们尝试另一种**载入数据**的方式：为 Item 创建对应的类，即**ItemBean**。

### ItemBean

之前我们传递数据的时候，因为 Item 里只有一个 TextView，所以我们直接用 String 数组传递数据给 Adapter。那如果多个图片呢？我们似乎可以给 Adapter 传递两个数组。但是当 Item 中的控件越来越多，需要绑定的数据也变多时，这种方式显然是不可取的。于是，我们可以根据 Item 的内容，为 Item 创建一个对象，这样在传递数据的时候，只用把这个 Item 对象的数组传给 Adapter 就好了，不管 Item 里有多少控件，我始终只用给 Adapte 一个数组。

新建`ItemBean.java`作为我们的 Item 对象。这里的 Item 包含一个`ImageView`和一个`TextView`，所以我们的结构如下：

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

ItemBean 的属性就是这个 Item 所包含的，需要传入数据的控件内容。他可以没有 setter 方法，因为我们可以利用构造方法为其设定数据；但是一定要有 getter 方法，因为在 Adapter 中，我们需要得到其属性值，将其传给 ViewHolder。时刻记住**这个 ItemBean 是保存 Item 数据的容器，而非 Item 本身**。（ViewHolder 才是）

### 布局

新建`WaterFallActivity.java`作为主页，布局比较简单（`activity_water_fall.xml`）就是一个`RecyclerView`，就不放代码了。  
Item 的布局（`item_water_fall.xml`）就是一个`ImageView`+`TextView`，如下，这里加了个背景色方便区分 Item。

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

新建`WaterFallAdapter.java`作为瀑布流布局的 Adapter，咱现在把他写出来相信难度不大。  
自定义 MyViewHolder，代表 Item，含有 ImageView 和 TextView。因为只有一个 Item 所以泛型直接用我们自定义的 MyViewHolder  
要注意的一点就是我们的数据源存在一个泛型为`ItemBean`的列表里：`List<ItemBean> items`。所以在`onBindViewHolder()`中获取数据的时候要先从中拿到一个 ItemBean，再取出 ItemBean 的数据给`ViewHolder`。

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

因为我们的数据源采用`List<ItemBean> items`的形式，所以一开始我们得构建一些数据，让后把他们扔到这个 List 里面，此外为了凸显瀑布流的效果，我们还得让 Item 的`TextView`长短不一，于是有了下面这两个方法。

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

我们用 ItemBean 的构造方法创建一个 ItemBean 对象，然后把他们加入到 List 中。图片大家随便找找试一下就行。图片下的文字用`getRandomLengthText`方法重复多遍，变得长一些。

然后我们就该安排 RecyclerView 了，主要是他的 LayoutManager 和 Adapter。我们选用`StaggeredGridLayoutManager`，后面跟的参数表示 3 列，竖直排列。  
Adapter 就传入我们的 items 作为参数即可。

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

### 添加 Item 之间的间隔

我们发现，瀑布流的效果是基本实现了，但是因为 Item 之间没有间隔，所以显得意外的丑。于是我们接着给 Item 们加上间隔  
这就要请出我们的**RecyclerView.ItemDecoration**了，他可以简单且灵活地为 Item 添加间隔。**ItemDecoration**本身为 RecyclerView 里的一个抽象类，因此我们要先实现他。  
新建`MyItemDecoration.java`（当然嫌麻烦也可以在 Activity 里用内部类的方式实现），重写其`getItemOffsets()`方法

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

在`getItemOffsets()`方法中，参数的`view`代表当前 View`parent`代表 View 所在的 RecyclerView。第一个参数`outRect`就是偏移量，相当**padding**或**margin**，默认值是 0。  
所以我们在其中给所有 Item 添加左右两个间隔，然后给第一行以外的 Item 一个上方的间隔。

然后就可以回到`WaterFallActivity`中，给我们的 RecyclerView 加上 ItemDecoration。在`setRecyclerView()`中加入以下两行：

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
2. [RecyclerView 的使用](https://blog.csdn.net/weixin_40625864/article/details/105207826)
3. [StackOverflow：RecyclerView onCreateViewHolder Return Type Incompatibility With Multiple Custom ViewHolders](https://stackoverflow.com/questions/32040798/recyclerview-oncreateviewholder-return-type-incompatibility-with-multiple-custom)
4. [RecyclerView Realizes Waterfall Flow Layout](https://programmer.help/blogs/recyclerview-realizes-waterfall-flow-layout.html)
