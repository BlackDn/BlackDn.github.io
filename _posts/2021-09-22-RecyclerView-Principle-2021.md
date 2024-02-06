---
    layout:       post  
    title:        又见RecyclerView：缓存原理  
    subtitle:     RecyclerView缓存和复用的原理  
    date:         2021-09-22  
    author:       BlackDn  
    header-img:   img/19mon5_36.jpg   
    catalog:      true  
    tags:  
       - Android
---

> "翠竹清流，婆娑鹤鸣。我喜欢的不止那如洗碧空，斑驳宁静。"

## 前言

这篇拖了好久其实，本来早一周前就可以发了  
不过这篇本身比较费时费力是一回事，前几天还感冒了  
于是一直处于`流鼻涕-吃药-睡觉-吃饭-吃药睡觉`的状态，中间还偷懒玩游戏。  
一起玩哈利波特的小伙伴可以找我一起，嘻嘻  
哦对了， 为了不让文档加载太慢，我把文中的图片都压缩了，如果想要原图可以联系我。

# 又见 RecyclerView：缓存原理

之前写了下 RecyclerView 的基本用法，传送门：[初识 RecyclerView：基本使用](https://blackdn.github.io/2021/09/15/RecyclerView-Usage-2021/)  
这里打算顺便学习下 RecyclerView**缓存**和**复用**的原理，你也就顺便看看。  
下面内容应该会涉及到源码，因为篇幅问题不会给的很全，最好还是自己动手，对着源码翻翻看看。  
对于缓存和复用，我们关心的无非就是**存到哪、存什么、什么时候存**的问题，搞懂这三个问题其实就差不多了。

## 四级缓存

先来解决**存到哪**的问题，RecyclerView 内部进行了四种缓存的分级，了解四种缓存是学习 RecyclerView 缓存复用机制的基础。

| 缓存                                                  | 作用                                                                                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 一级缓存：屏幕内缓存（mAttachedScrap、mChangedScrap） | mAttachedScrap 缓存未与 RecyclerView 分离的 ViewHolder<br />mChangedScrap 缓存发生改变的 ViewHolder，需调用`onBindViewHolder()`重新绑定数据。 |
| 二级缓存：屏幕外缓存（mCachedViews）                  | 缓存滑倒屏幕外的 ViewHolder，默认容量为 2。若容量已满，会把旧 ViewHolder 移入缓存池 RecycledViewPool。（队列结构，先进先出）                  |
| 三级缓存：自定义缓存（ViewCacheExtension）            | 用户自定义的扩展缓存，需要用户自己管理 View 的创建和缓存。                                                                                    |
| 四级缓存：缓存池（RecycledViewPool）                  | 根据 ViewType 缓存 ViewHolder，每个 ViewType 默认最多缓存 5 个。用 SparseArray 实现。                                                         |

一级缓存为什么要有`mAttachedScrap`和`mChangedScrap`两种缓存呢？看这两种缓存的名字就知道我们要先理解“Attached”和“Changed”两种状态的区别。  
所谓“Attached”状态，指的是 ViewHolder 和 RecyclerView 存在联系的状态，说明这个 ViewHolder 明确要被显示到 RecyclerView 上。  
那“Changed”状态则相反，指这个 ViewHolder 可能不需要被显示。比如我这个 Item 可能要被删掉，那么其对应的 ViewHolder 就不应该被显示；比如这个 Item 的数据需要更新，那么 ViewHolder 就应该先更新数据，再进行显示。  
因此，每当 Item 中有数据更新时，重新绘制列表前，会先清除所有 Item。然后把没有变化的 Item 放入**mAttachedScrap**中，需要被更新的 Item 放入**mChangedScrap**中。  
似乎看起来有些麻烦，为什么不直接修改 Item 反而要清除所有 Item 再绘制呢？其实这是一种**责任分离机制**。在绘制布局的时候，发挥作用的是**LayoutManager**，而进行缓存的存取操作是由**Recycler**控制的。采用这种方式控制 View，**LayoutManager**能够把所有 View 全交给**Recycler**，让**Recycler**判断 View 是否更新，需要被放进哪个缓存中，实现**缓存都归 Recycler 管**的目的。有得必有失嘛。

不过有时候 RecycerView 的缓存机制又被称为**三级缓存**。这种叫法将**mCachedViews**作为一级缓存，认为两个 Scrap 只是临时保存数据的容器而不是缓存。两种叫法都可以，挑你喜欢的记。因为喜欢四级缓存的概念所以下面都用四级缓存。

现在我们对四种缓存有了概念，就可以跟着源码学习了。我们把 RecyclerView 的缓存机制分为两部分。**缓存**就是把 Item 存入缓存的过程，**复用**就是把 Item 从缓存取出的过程。

## 缓存机制

我们从 RecyclerView 的布局载入入手，毕竟这个时候是一个**从无到有**的过程。因此这时候缓存区里的东西都是空的，讲道理应该**只能进行缓存不能复用**，再加上从逻辑上讲也得现有缓存才能复用，所以我们就先看看 RecyclerView 缓存是怎么实现的。

### 1. LayoutManager 起手：获取 View

因为 RecyclerView 的布局是由**LayoutManager**实现的，所以在`RecyclerView.LayoutManager`里，我们找到了一个`detachAndScrapAttachedViews()`方法，这个方法循环调用 `scrapOrRecycleView()`方法，将当前 LayoutManager 下所有的 View 依次取出，判断 View 应该“scrap”or“recycle”

```java
//in RecyclerView.LayoutManager
private void scrapOrRecycleView(Recycler recycler, int index, View view) {
    final ViewHolder viewHolder = getChildViewHolderInt(view);
	······//Log信息
    if (viewHolder.isInvalid() && !viewHolder.isRemoved()	//如果ViewHolder失效了但没有被删除（屏幕外）
            && !mRecyclerView.mAdapter.hasStableIds()) {
        removeViewAt(index);
        recycler.recycleViewHolderInternal(viewHolder);	//recycle view 加入其他缓存
    } else {	//如果ViewHolder没有失效
        detachViewAt(index);
        recycler.scrapView(view);	//scrap view 加入一级缓存
        mRecyclerView.mViewInfoStore.onViewDetached(viewHolder);
    }
}
```

每次调用`scrapOrRecycleView()`方法时，Recycler 都对 ViewHolder 进行一个判断，如果这个 ViewHolder 失效了但没有被删除（比如滑到屏幕外），则调用`recycleViewHolderInternal()`方法；反之，则调用`scrapView()`。我们简单理解为没有显示在屏幕上的 ViewHolder 被扔进`recycleViewHolderInternal()`，而即将显示在屏幕上的则被扔进`scrapView()`。由于此时传入一个**Recycler**作为参数，所以这时开始由**Recycler**接手，判断 ViewHolder 应该去哪个缓存。

### 2. 将 View 加入一级缓存：scrapView()

`recycleViewHolderInternal()`和`scrapView()`都是**RecyclerView.Recycler**中的方法，这时候开始由**Recycler**控制缓存。因为刚开始载入布局还没有滑动操作、不需要进行更新操作，大部分都不会失效，所以基本上此时的 View 都进入`scrapView()`操作，我们来看看这个方法做了什么

```java
//in RecyclerView.Recycler
void scrapView(View view) {
    final ViewHolder holder = getChildViewHolderInt(view);
    if (holder.hasAnyOfTheFlags(ViewHolder.FLAG_REMOVED | ViewHolder.FLAG_INVALID)
            || !holder.isUpdated() || canReuseUpdatedViewHolder(holder)) {	//没被删除、没更新等
		// ~ 报错信息
        holder.setScrapContainer(this, false);
        mAttachedScrap.add(holder);		//加入mAttachedScrap
    } else {
        if (mChangedScrap == null) {
            mChangedScrap = new ArrayList<ViewHolder>();
        }
        holder.setScrapContainer(this, true);
        mChangedScrap.add(holder);		//加入mChangedScrap
    }
}
```

很显然这里将 ViewHolder 进行了一个判断，如果 ViewHolder 没被删除、没更新等操作，则这个 ViewHolder 通过`mAttachedScrap.add()`被加入**mAttachedScrap 缓存**中；反之，则通过`mChangedScrap.add()`加入**mChangedScrap 缓存**中。他们都是一级缓存，因此`scrapView()`负责将 View 放入一级缓存中。

### 3. 将 View 加入二级/四级缓存：recycleViewHolderInternal()

在**LayoutManager**的`scrapOrRecycleView()`中，我们用`scrapView()`把 ViewHolder 加入一级缓存，现在剩下的 ViewHolder 就要加入其他的缓存了，用的方法就是`recycleViewHolderInternal()`  
因为这个方法代码略长，这里节选了关键代码

```java
//RecyclerView.Recycler.recycleViewHolderInternal()
······
if (mViewCacheMax > 0	//如果mCachedViews默认大小大于0并且ViewHolder没啥问题（被移除、更新等）
        && !holder.hasAnyOfTheFlags(ViewHolder.FLAG_INVALID
        | ViewHolder.FLAG_REMOVED
        | ViewHolder.FLAG_UPDATE
        | ViewHolder.FLAG_ADAPTER_POSITION_UNKNOWN)) {
    // Retire oldest cached view
    //这里判断mCachedViews是否满了，满了调用recycleCachedViewAt(0)，移出一个View，腾出空间
    int cachedViewSize = mCachedViews.size();
    if (cachedViewSize >= mViewCacheMax && cachedViewSize > 0) {
        recycleCachedViewAt(0);	//mCachedViews满了，移出一个View，腾出空间
        cachedViewSize--;
    }

    int targetCacheIndex = cachedViewSize;
	······ // when adding the view, skip past most recently prefetched views
    mCachedViews.add(targetCacheIndex, holder);
    cached = true;
}
if (!cached) {
    addViewHolderToRecycledViewPool(holder, true);
    recycled = true;
}
······
```

关键代码一开始进行一个判断，判断里的`mViewCacheMax`是**Recycler**的一个属性，表示缓存大小。通常`mViewCacheMax = DEFAULT_CACHE_SIZE`，而默认`DEFAULT_CACHE_SIZE = 2`，他表示**二级缓存 mCachedViews**的默认大小，默认缓存两个 ViewHolder。  
总之就是，一开始判断**mCachedViews**的默认大小是否为 0，ViewHolder 是否有被移除、更新等问题。不过一般情况下**mCachedViews**的默认大小为 2，送来的 ViewHolder 也没啥问题，因此这个判断通常都是`true`  
然后再判断，**mCachedViews**有没有满。如果满了，就调用`recycleCachedViewAt(0)`，从中移出一个 View，腾出空间。如果没满，则调用`mCachedViews.add`直接加入**mCachedViews**。  
如果没有设置二级缓存**mCachedViews**，或者缓存过程中出现意外，导致没有成功执行到最后的`cached = true`（`!cached`），那么就用`addViewHolderToRecycledViewPool()`直接扔到缓存池里。

### 4. mCachedViews 已满：recycleCachedViewAt()

Recycler 执行`recycleViewHolderInternal()`的时候，先尝试将 ViewHolder 放入**二级缓存 mCachedViews**，如果他满了，则会执行`recycleCachedViewAt(0)`，尝试将 ViewHodler 到**四级缓存，缓存池 RecycledViewPool**中

```java
//RecyclerView.Recycler
void recycleCachedViewAt(int cachedViewIndex) {
	······//一些Log信息
    ViewHolder viewHolder = mCachedViews.get(cachedViewIndex);
    addViewHolderToRecycledViewPool(viewHolder, true);	//将ViewHolder放入RecycledViewPool
    mCachedViews.remove(cachedViewIndex);	//将ViewHolder从mCachedViews中删除
}
```

在这个方法中，我们将获取到的 viewHolder 利用`addViewHolderToRecycledViewPool()`方法移动到**四级缓存 RecycledViewPool**中。

然后利用`remove()`方法将**mCachedViews**中`cachedViewIndex`位置的 ViewHolder 删除。在`recycleViewHolderInternal()`中调用`recycleCachedViewAt()`的时候传入的一定是`index=0`，那为什么一定是`index=0`的 ViewHolder 呢？  
因为**mCachedViews**采用的是**队列**的逻辑结构，也就是**先进先出（FIFO）策略**，因为 RecyclerView 默认缓存中**新的 ViewHolder 比旧的更容易被复用**。就好比我们向下滑动屏幕，头两个 Item（Item1 和 Item2）被滑到屏幕外了，于是按照顺序，Item1 和 Item2 依次被缓存入**mCachedViews**。如果我们这时候重新往上滑，则先进入屏幕的是 Item2，也就是 Item2 需要从缓存中取出被复用。  
再加上**mCachedViews**是一个`ArrayList`的结构，其`remove()`操作会将被删除数据后面的数据左移。因此就能保证**mCachedViews**中`index=0`的位置是最先进入缓存的 ViewHolder。

### 5. 将 View 加入四级缓存 RecycledViewPool：putRecycledView()

**Recycler**的`addViewHolderToRecycledViewPool()`方法用来把 ViewHolder 放入**四级缓存 RecycledViewPool**，关键代码其实就一行：

```java
//addViewHolderToRecycledViewPool()
getRecycledViewPool().putRecycledView(holder);
```

`getRecycledViewPool()`得到一个**RecycledViewPool**对象，然后把 ViewHolder 加到里面去。

#### 缓存池 RecycledViewPool 的结构

在继续探究之前，我们先来了解一下**缓存池 RecycledViewPool**的结构。  
**RecycledViewPool**是 RecyclerView 的一个内部类，代表我们的四级缓存。其拥有一个属性`DEFAULT_MAX_SCRAP = 5`表示其默认缓存大小。  
事实上，**RecycledViewPool**中真正存储 View 的结构是`SparseArray<ScrapData> mScrap`，泛型为**ScrapData**的**SparseArray**类型。  
**ScrapData**是**RecycledViewPool**的一个内部类，他的主要结构是`ArrayList<ViewHolder> mScrapHeap`，这个`mScrapHeap`就是缓存池中保存我们 ViewHolder 的容器了。

简单介绍下**SparseArray**，他是 Android 独有的结构。和 HashMap 类似，采用键值对的形式进行存储，不同的是他的键（Key）为 int 类型。从而在存储时不用对 Key 进行自动装箱的操作，实现性能的提升。由于 SparseArray 采用二分搜索，因此其始终都保持有序。  
HashMap 采用数组+链表的结构，而 SparseArray 则是纯数组结构。其包含两个数组，分别表示 key 和 values，两组数据对应。

因为**ScrapData**的主体是**mScrapHeap**，**RecycledViewPool**的主体是**mScrap**，我们可以简单地认为**ScrapData 就是 mScrapHeap**，简单地认为四级缓存的**RecycledViewPool**是一个**mScrap**（**SparseArray**结构）  
而这个**SparseArray**的**Key**就是我们所说的`viewType`。是不是听起来很眼熟，在使用 RecyclerView 的时候，如果我们需要使用多种 Item，则要对每个 Item 进行标识，这个标识就是`viewType`。这个**SparseArray**的**Value**则是一个装 ViewHolder 的数组（mScrapHeap）。结构示意图如下（我用 PS 画了好久。。）

![PoolStruc](https://z3.ax1x.com/2021/09/22/4akd6e.png)

### 6. RecycledViewPool 的存储细节

这下事情似乎变得明朗了，基于 SparseArray 的结构，**RecycledViewPool**拿到一个 ViewHolder，把他存到其对应`viewType`后的**mScrapHeap**中  
讲道理，**RecycledViewPool**的大小应该由 Item 的种类决定。因为有几种 Item 就有几个`viewType`，`viewType`作为**Key**，决定了**RecycledViewPool**这个数组的大小。那我们之前说的默认缓存大小`DEFAULT_MAX_SCRAP = 5`又是什么呢？自然是每个 viewType 之后，作为**Value**的**mScrapHeap**的大小，即对于一个 viewType，能装其五个对应的 ViewHolder。

这下看`putRecycledView()`中的代码就清晰了，这个方法将 ViewHolder 放入缓存池**RecycledViewPool**。

```java
//RecyclerView.RecycledViewPoor
public void putRecycledView(ViewHolder scrap) {
    final int viewType = scrap.getItemViewType();
    final ArrayList<ViewHolder> scrapHeap = getScrapDataForType(viewType).mScrapHeap;
    if (mScrap.get(viewType).mMaxScrap <= scrapHeap.size()) {
        return;
    }
	// ~ 报错信息
    scrap.resetInternal();	// ~ 清空绑定的数据
    scrapHeap.add(scrap);	// ~ 加入缓存池
}
```

我们先`getScrapDataForType(viewType)`根据`viewType`得到对应的`scrapData（mScrapHeap）`，其中就是缓存池中的 ViewHolder 了，也就是说此时我们已经拿到了缓存的**ViewHolder**了。  
我们现在是要把传进来的**ViewHolder**（`scrap`）尝试放入**RecycledViewPool**嘛，所要先进行一个大小判断，如果缓存中的**ViewHolder**数量（`scrapHeap.size()`）大于设定的最大数量（`mMaxScrap`），就说明缓存满了，那就不用放了，直接 return，丢弃这个 ViewHolder。  
如果没满，那我们先调用`resetInternal()`将这个**ViewHolder**进行重置，然后 add 进**RecycledViewPool**缓存。所谓重置，是指将这个 ViewHolder 的一些标识初始化，比如消除`ItemId`、`Position`等设置，我们可以理解为抹除这个 ViewHolder 所绑定的数据，只留下一个空的框架。

这就解释了为什么当**mCachedView**满了的时候，我们要宁愿要把其中旧的 ViewHolder 移动到**RecycledViewPool**，也要把新的 ViewHolder 放入**mCachedView**。但是当**RecycledViewPool**满了，我们直接把手上的 ViewHolder 丢弃。  
**mCachedView**中的 ViewHolder 是带有其数据的，因此其进行复用的时候能更高效。而**RecycledViewPool**中的 ViewHolder 是没有数据空有框架的，因此每次复用的时候，还要调用`onBindViewHolder()`为 ViewHolder 绑定数据。  
或许有人要问，既然**RecycledViewPool**是空的框架，里面所有的 ViewHolder 都是一样的，我为什么不存一个而是存五个呢？实际上这五个默认值是官方为了适应大多数场景而设计的。比如我们的 RecyclerView 有 3 列，那么每次滑入滑出就有 3 个 ViewHolder 受到影响，这种情况下如果只有一个缓存显然是不够的。  
如果缓存太多，则会占用太多内存，如果缓存太少，则会频繁调用`onCreateViewHolder()`创建新的 ViewHolder，造成更多的耗时。达到一个平衡点才是我们追求的优化关键。

### 总结

注意这里的入口是布局开始的时候，不过实际上缓存进行的过程不止这个地方。包括滑动列表啦之类的都会导致缓存复用的操作，这里只是举个例子而已。

RecyclerView.LayoutManager -> `detachAndScrapAttachedViews()` -> `scrapOrRecycleView()` -> RecyclerView.Recycler 接手 -> `recycleViewHolderInternal()` / `scrapView()`

`recycleViewHolderInternal()`：  
没有 **mCachedViews** -> `addViewHolderToRecycledViewPool()`。  
**mCachedViews**没有满 -> `mCachedViews.add()`  
**mCachedViews**满了 -> `recycleCachedViewAt(0)` -> `addViewHolderToRecycledViewPool()` (`getRecycledViewPool().putRecycledView()` -> `scrap.resetIntrenal()` -> `scrapHeap.add()`) -> `mCachedViews.remove()`

`scrapView()` -> 没问题的 ViewHolder 加入**mAttachedScrap**（`mAttachedScrap.add()`），反之加入**mChangedScrap**（`mChangedScrap.add()`）

![Cache](https://z3.ax1x.com/2021/09/22/4aAv28.png)

## 复用机制

### 1. ReyclerView：滑动产生复用

复用指的是从缓存中取出 ViewHolder 的过程，因此我们从滑动屏幕的操作入手，找找复用的入口。  
于是来到**RecyclerView**中的`onTouchEvent()`方法，在`ACTION_MOVE`操作下发现`scrollByInternal()`方法，其中的`scrollStep()`对滑动操作进行了处理：

```java
void scrollStep(int dx, int dy, @Nullable int[] consumed) {
	······
    int consumedX = 0;
    int consumedY = 0;
    if (dx != 0) {
        consumedX = mLayout.scrollHorizontallyBy(dx, mRecycler, mState);
    }
    if (dy != 0) {
        consumedY = mLayout.scrollVerticallyBy(dy, mRecycler, mState);
    }
	······
}
```

这里的`scrollHorizontallyBy()`和`scrollVerticallyBy()`分别标识**横向滑动**和**纵向滑动**，他们都由**LayoutManager**实现。

### 2. 从 LayoutManager 到 Recycler

于是我们跳转到**LinearLayoutManager**查看此方法。

```java
//LinearLayoutManager
@Override
public int scrollHorizontallyBy(int dx, RecyclerView.Recycler recycler,
        RecyclerView.State state) {
    if (mOrientation == VERTICAL) {
        return 0;
    }
    return scrollBy(dx, recycler, state);
}
```

显然重要的是`scrollBy()`方法，这个方法比较长，之后七弯八拐地有点绕，这里简单指个路。  
`scrollBy() -> fill() -> layoutChunk() -> next()`。 之后来到**Recycler**的工作区，开始调用**Recycler**的方法。`next() -> getViewForPosition() -> tryGetViewHolderForPositionByDeadline()`，这个名字很长的方法的返回值终于是我们的**ViewHolder**了。  
但是这个名字很长的方法真的很长，所以这里简单介绍下。

```java
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                                                 boolean dryRun, long deadlineNs) {
	······// ~ 报错信息
    ViewHolder holder = null;
    // ~ 先从mChangedScrap里拿ViewHolder
    // 0) If there is a changed scrap, try to find from there
    if (mState.isPreLayout()) {
        holder = getChangedScrapViewForPosition(position);
        fromScrapOrHiddenOrCache = holder != null;
    }
    // ~ 没拿到ViewHolder则holder仍为null，所以从mAttachedScrap和mCachedViews拿（根据Position）
    // 1) Find by position from scrap/hidden list/cache
    if (holder == null) {
        holder = getScrapOrHiddenOrCachedHolderForPosition(position, dryRun);
		······
    }
    // ~ 还还还没拿到
    if (holder == null) {
		·····
        // ~ 尝试从mAttachedScrap和mCachedViews里根据id拿到ViewHolder
        // 2) Find from scrap/cache via stable ids, if exists
        if (mAdapter.hasStableIds()) {
            holder = getScrapOrCachedViewForId(mAdapter.getItemId(offsetPosition),
                                               type, dryRun);
            if (holder != null) {
                // update position
                holder.mPosition = offsetPosition;
                fromScrapOrHiddenOrCache = true;
            }
        }
        // ~ 从三级缓存mViewCacheExtension中拿ViewHolder
        if (holder == null && mViewCacheExtension != null) {
            // We are NOT sending the offsetPosition because LayoutManager does not
            // know it.
            final View view = mViewCacheExtension
                .getViewForPositionAndType(this, position, type);
            if (view != null) {
                holder = getChildViewHolder(view);
				······// ~ 报错信息
            }
        }
        // ~ 还是没拿到，从四级缓存RecycledViewPool中拿
        if (holder == null) { // fallback to pool
			······// ~ 报错信息
            holder = getRecycledViewPool().getRecycledView(type);
            ······
        }
        // ~ 四级缓存里都没有，只能创建
        if (holder == null) {
            long start = getNanoTime();
			······
            holder = mAdapter.createViewHolder(RecyclerView.this, type);
			······
    }
    // This is very ugly but the only place we can grab this information
    // before the View is rebound and returned to the LayoutManager for post layout ops.
    // We don't need this in pre-layout since the VH is not updated by the LM.
	······// ~ 收集信息

    boolean bound = false;
    if (mState.isPreLayout() && holder.isBound()) {
        // do not update unless we absolutely have to.
        holder.mPreLayoutPosition = position;
    } else if (!holder.isBound() || holder.needsUpdate() || holder.isInvalid()) {
		······// ~ 报错信息
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        bound = tryBindViewHolderByDeadline(holder, offsetPosition, position, deadlineNs);
    }
	······// ~ 设置布局信息LayoutParams
    return holder;
}
```

因为`mChangedScrap`中装的是修改过，等着被显示的 Item，所以**Recycler**会先判断其中是否有 ViewHolder（`isPreLayout()`）。如果有就调用`getChangedScrapViewForPosition()`去其中获取**ViewHolder**。  
如果没有，则此时仍然`holder=null`，所以再从`mAttachedScrap`和`mCachedViews`查找 ViewHolder（根据 Position），就尝试根据 id 去拿**ViewHolder**，即`getScrapOrCachedViewForId()`  
如果又没有，那么就从**三级缓存**`mViewCacheExtension`中寻找，即`getViewForPositionAndType()`不过因为~~偷懒~~这个缓存是自定义的，所以就不过多讲解了。  
如果还是没有，只能去**四级缓存**`RecycledViewPool`中寻找了。先用`getRecycledViewPool()`得到当前的 RecycledViewPool 对象，再调用`getRecycledView()`去获取 ViewHolder  
如果~~叕（zhuó）~~真的没有，那就说明缓存里是真的没了，老老实实调用`createViewHolder()`创建 ViewHolder 吧。  
最后还会调用`tryBindViewHolderByDeadline()`为 VIewHolder 绑定数据。不过由于之前寻找 ViewHolder 的时候，返回这个 ViewHolder 之前都会为其打上标记，所以在绑定数据前会进行一个判定。只有来自**四级缓存**`RecycledViewPool`和新建的 ViewHolder 才会去绑定。而其他缓存里的 ViewHolder 在存的时候是带数据一起存的，所以不需要再额外绑定了。  
接下来就一步步看看**Recycler**是怎么找 ViewHolder 的吧。

#### 2.1. 从 mChangedScrap 获取 ViewHolder：getChangedScrapViewForPosition()

`mChangedScrap`中装的是修改过，等着被显示的 Item，所以**Recycler**首先从他里面获取 ViewHolder，称其为**预布局 PreLayout**。于是进入`getChangedScrapViewForPosition()`方法。  
方法中先判断`mChangedScrap`是否存在以及其中是否有 ViewHolder。如果不存在或者没有 ViewHolder 则无法从中取出东西，所以直接`return`  
反之，如果有 ViewHolder，那么我们就可以直接从中拿出，然后打上一个来自一级缓存的标签。这里实际上分了两步走，分别根据 Position 和 Id 来寻找 ViewHolder。当然如果都找不到就返回 null 了，我们需要进一步努力。

```java
ViewHolder getChangedScrapViewForPosition(int position) {
    // If pre-layout, check the changed scrap for an exact match.
    final int changedScrapSize;
    if (mChangedScrap == null || (changedScrapSize = mChangedScrap.size()) == 0) {
        return null;	//判断mChangedScrap是否存在以及其中是否有ViewHolder
    }
    // find by position
    for (int i = 0; i < changedScrapSize; i++) {
        final ViewHolder holder = mChangedScrap.get(i);
        // ~ 打上标签，，标识其来自一级缓存
        if (!holder.wasReturnedFromScrap() && holder.getLayoutPosition() == position) {
            holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
            return holder;
        }
    }
    // find by id
    if (mAdapter.hasStableIds()) {
        ······
        // ~ 打上标签，，标识其来自一级缓存
        if (!holder.wasReturnedFromScrap() && holder.getItemId() == id) {
            holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
            return holder;
        }
    }
    return null;
}
```

#### 2.2. 从 mAttachedScrap 和 mCachedViews 获取 ViewHolder：getScrapOrHiddenOrCachedHolderForPosition()

我们想从`mChangedScrap`中获取 ViewHolder 失败了，于是转眼来到`getScrapOrHiddenOrCachedHolderForPosition()`，开始针对同是一级缓存的`mAttachedScrap`和**二级缓存**`mCachedViews`  
虽然方法名字很长，但整体还是比较简单的。  
先从`mAttachedScrap`获取**ViewHolder**，当这个 ViewHolder 有效且可见，位置还对的上的时候就返回。  
如果没有拿到就从从`mCachedViews`获取**ViewHolder**。当然如果都没拿到就返回`null`  
返回前都打上`Flag`标记

```java
ViewHolder getScrapOrHiddenOrCachedHolderForPosition(int position, boolean dryRun) {
    final int scrapCount = mAttachedScrap.size();
	// ~ 先从mAttachedScrap获取ViewHolder
    // Try first for an exact, non-invalid match from scrap.
    for (int i = 0; i < scrapCount; i++) {
        final ViewHolder holder = mAttachedScrap.get(i);
        if (!holder.wasReturnedFromScrap() && holder.getLayoutPosition() == position
                && !holder.isInvalid() && (mState.mInPreLayout || !holder.isRemoved())) {
            holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
            return holder;
        }
    }
	······
    // ~ 然后从mCachedViews获取ViewHolder（源码注释称其为一级（first-level）缓存）
    // Search in our first-level recycled view cache.
    final int cacheSize = mCachedViews.size();
    for (int i = 0; i < cacheSize; i++) {
        final ViewHolder holder = mCachedViews.get(i);
        // invalid view holders may be in cache if adapter has stable ids as they can be
        // retrieved via getScrapOrCachedViewForId
        if (!holder.isInvalid() && holder.getLayoutPosition() == position
                && !holder.isAttachedToTransitionOverlay()) {
			······
            return holder;
        }
    }
    return null;
}
```

#### 2.3. 根据 Id 获取 View：getScrapOrCachedViewForId()

能来到这里，说明我们从`mChangedScrap`中没拿到 View，而且根据`position`并不能从`mAttachedScrap`和`mCachedViews`中拿到 View。于是尝试根据 Id 拿到 View，当然还是`mAttachedScrap`和`mCachedViews`这两个缓存中。

```java
ViewHolder getScrapOrCachedViewForId(long id, int type, boolean dryRun) {
    // ~ 先从mAttachedScrap中拿
    // Look in our attached views first
    final int count = mAttachedScrap.size();
    for (int i = count - 1; i >= 0; i--) {
        final ViewHolder holder = mAttachedScrap.get(i);
        if (holder.getItemId() == id && !holder.wasReturnedFromScrap()) {
            if (type == holder.getItemViewType()) {
                holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
				······
                return holder;	 // ~ 拿到了就返回
            }
            ······
        }
    }
    // ~ 再从mCachedViews中拿
    // Search the first-level cache
    final int cacheSize = mCachedViews.size();
    for (int i = cacheSize - 1; i >= 0; i--) {
        final ViewHolder holder = mCachedViews.get(i);
        if (holder.getItemId() == id && !holder.isAttachedToTransitionOverlay()) {
            if (type == holder.getItemViewType()) {
                ······
                return holder;	// ~ 拿到了就返回
            }
            ······
        }
    }
    return null;	// ~ 没拿到返回空
}
```

简单来说，和上面根据`Position`拿 View 的方法差不多，都是在`mAttachedScrap`和`mCachedViews`这两个缓存中找 View，找到就返回，找不到就返回`null`，唯一的区别就在于这里找 View 的依据是根据`getItemId()`所得到得 View 的 Id 来判断。

#### 2.4 从 RecycledViewPool 获取 View：getRecycledView()

我们跳过中间的`getViewForPositionAndType()`，即从**三级缓存**`mViewCacheExtension`中寻找 View。因为三级缓存是我们自己定义的，什么时候缓存什么时候复用都是自己定义的，而且现实中用到的比较少。 ，
所以往下看，我们从`mChangedScrap`、`mAttachedScrap`和`mCachedViews`中都拿不到 View，于是到**四级缓存**`RecycledViewPool`中查找，调用方法`getRecycledView()`。

```java
public ViewHolder getRecycledView(int viewType) {
    final ScrapData scrapData = mScrap.get(viewType);
    if (scrapData != null && !scrapData.mScrapHeap.isEmpty()) {
        final ArrayList<ViewHolder> scrapHeap = scrapData.mScrapHeap;
        for (int i = scrapHeap.size() - 1; i >= 0; i--) {
            if (!scrapHeap.get(i).isAttachedToTransitionOverlay()) {
                return scrapHeap.remove(i);
            }
        }
    }
    return null;
}
```

这里的过程就比较简单了，我们之前已经知道了`scrapHeap`就是存放 ViewHolder 的列表，其中 i 给你如果有 ViewHolder，就取出一个；如果没有，就返回`null`。

### 3. （创建 View）绑定数据：

当然，如果还是没有 ViewHolder，即仍然`holder==null`，那么就会调用我们熟悉的`mAdapter.createViewHolder()`方法，即我们自定义的创建 ViewHolder 的方法。

之后就是尝试绑定数据，在`tryBindViewHolderByDeadline()`中会调用`mAdapter.bindViewHolder()`，这个方法中就调用了我们熟悉的`onBindViewHolder()`。当然，这时候就进入绑定数据的功能了，所以工作者从**Recycler**转移到了**Adapter**。

### 总结

同理，这里的入口是滑动产生的复用情况。实际上很多其他时候都会有复用的情况，比如刷新后的初始布局等操作。

`onTouchEvent()` -> `scrollByInternal()` -> `scrollStep()` -> **(LayoutManager)** `scrollHorizontallyBy() / scrollVerticallyBy()` -> `scrollBy()` -> `fill()` -> layoutChunk() -> `next()` -> **(Recycler)** `getViewForPosition()` -> `tryGetViewHolderForPositionByDeadline()` （该方法返回 ViewHolder，其内部流程如下）  
`getChangedScrapViewForPosition()` 从**mChangedScrap**获取，没拿到就去`getScrapOrHiddenOrCachedHolderForPosition()` 和`getScrapOrCachedViewForId()`从**mAttachedScrap**和**mCachedViews**获取，没拿到就去`getViewForPositionAndType()`从自定义**mViewCacheExtension**中获取，没拿到就去`getRecycledView()`从**RecycledViewPool**中获取，没拿到就创建`createViewHolder()`创建一个新的。最后调用`tryBindViewHolderByDeadline() -> bindViewHolder() -> onBindViewHolder()`绑定数据。

![reuse](https://z3.ax1x.com/2021/09/22/4akwOH.png)

## 后记

这是真的写了我好久时间，花费的精力也好多。不过也有可能是我边玩边写的原因=。=  
不过为了这篇我还特地去画流程图，去 PS 做图。所以还是得夸夸自己  
真是麻雀啄牛屁股——雀食牛 x  
也不知道什么时候才能真正做到周更=。=

## 参考

1. [RecyclerView 缓存机制](https://www.jianshu.com/p/f9e21269da26)
2. [RecyclerView 缓存复用机制](https://www.bilibili.com/video/BV1hX4y1P7ji)
3. [RecyclerView 原理深入理解](https://blog.csdn.net/qq_33275597/article/details/93849695)
