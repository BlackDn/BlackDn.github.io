---
layout:       post  
title:        Activity Result API 前世今生  
subtitle:     startActivityForResult()和onActivityResult()的上位替代  
date:         2023-01-06  
auther:       BlackDn  
header-img:   img/21mon8_20.jpg  
catalog:      true  
tags:    
    - Android  
---

> “小云朵像棉花糖，长颈鹿嫌自己脖子不够长。”

# Activity Result API 前世今生

## 前言

起因是看到以前的代码中，**ComponentActivity**中的`startActivityForResult()`和`onActivityResult()`被弃用了（但是`startActivity()`没有被弃用），然后点进去一看，发现他们在`androidx`的`activity:1.2.0-alpha02`和`fragment:1.3.0-alpha02`中被弃用（在appcompat库中则是1.3.0被弃用）。并且官方推荐了**Activity Result API**作为替代方法。    
正好看到社团的小朋友也写了一篇，就顺便拿别人的砖抛自己的砖啦～

## Old API：startActivityForResult() 和 onActivityResult()
在探究为什么弃用之前，我们先来回顾一下他们的使用方法吧。  
因为弃用的两个方法名字有点长，所以我们统称`Old API`好了

### 基本用法
`startActivityForResult()`和`startActivity()`的功能一样， 都是通过启动**Intent**来进行页面跳转，不同点在于它的第二个参数接收了一个**Request Code**，用来表示启动的这个Intent。  
`onActivityResult()`则可以通过**Request Code**和**Result Code**（通常在新的Activity中，在`finish()`前通过`setResult()`设置）来对某次跳转或某种结果进行特定的后续操作。

```java
//in MainActivity
//第一个Activity中，启动intent进行页面跳转
startActivityForResult(intent, RequestCode); 

//回到初始页面处理结果
onActivityResult(requestCode, resultCode, intent) {  
  if (resultCode == RESULT_OK) {  //通过resultCode判断是否进行后续操作
    switch (requestCode) {  //通过requestCode针对跳转不同进行不同的后续操作
      case 1:    
		······
      case 2:  
		······
    }  
  }  
}
```

当`startActivityForResult()`调用的时候，我们会跳到第二个Activity，在其中操作结束后，利用`setResult()`设置要传回的`Result Code`和数据（包裹在`Intent`里），最后`finish()`结束第二个Activity并回到第一个Activity：

```java
//in SecondActivity
//第二个Activity中，点击按钮表示结束，传回Result Code和数据
public void onClick(View view) {
	Intent goBackIntent = new Intent(SecondActivity.this, MainActivity.class);
	setResult(RESULT_OK, goBackIntent);
	finish();
}
```

回到第一个Activity后，就会自动调用`onActivityResult()`方法，以此对回传的数据进行处理，并进行后续操作。（这里的`RESULT_OK`是Android自带的）  

可以看出**Old API**实际上是想模仿一个前后端的交互的，`Request Code`用来区分请求来源，而`Result Code`就好比后端返回的状态码。  

### 小坑点

项目中偶遇一个Fragment和关联它的Activity都是实现了`onActivityResult()`，而当我们在Fragment中调用`startActivityForResult()`之后，理所应当地想要在Fragment中的`onActivityResult()`处理回传结果。但是很遗憾，Fragment中的`onActivityResult()`没能接收到结果，反而是给到了Activity的`onActivityResult()`。  

在Fragment和Activity同时实现了`onActivityResult()`的情况下，如果想要从Fragment的`startActivityForResult()`出发的请求回到Fragment的`onActivityResult()`，需要满足以下条件：
1. Fragment应直接调用`startActivityForResult()`，而不是调用`getActivity().startActivityForResult()`
2. 如果Activity有自己的`onActivityResult()`，那么其中要加上`super.onActivityResult()`（可以在方法最开始，也可以在最后）。

### 缺点
和大部分被弃用的方法不同，Old API的方法并没有功能上的问题，它并不是因为有线程安全、内存泄漏等隐患而被弃用的，更多的是因为——随着应用的扩展，`onActivityResult()`**会陷入各种嵌套，耦合严重且难以维护**。    
也就是说，Old API可以用，但是用起来很难受（除非程序的体量比较小，功能比较简洁）。

一个很直观的表现就是我们需要维护越来越多的**常量标识**，除了`Intent`本身`putExtra`和`getExtra`所用到的标识外，不同的Activity还要有不同的`Request Code`；目标Activity则需要根据处理结果的不同，返回不同的`Result Code`。在某些场景下，一个Activiy不同的功能还得持有不同的`Request Code`。  
而大量的常量标识，尤其是`Request Code`，使得`onActivityResult()`不得不使用更多的`if-else`或者`switch`来进行区分，让其越来越臃肿，更别说那些还得针对不同`Result Code`进行处理的情况了。  
于是，**Activity Result API**出现了。

## Activity Result API

### 基本用法

Activity Result API主要在包`androidx.activity.result`中  
它提供了一个启动类**ActivityResultLauncher**，我们可以通过调用`registerForActivityResult()`来获得一个**Launcher**，这个方法接收三个参数：
1. `ActivityResultContract<I, O> contract`：Contract，称为**协议**或**约束**，用于规定输入类型（I）和输出类型（O），其内部通过构造Intent实现页面之间的跳转。
2. `ActivityResultRegistry registry`：Registry，协议注册器，通常在Activity / Fragment以外的地方接收回传的`Result`时使用。
3. `ActivityResultCallback<O> callback`：回调方法，收到`Result`后进行后续操作，相当于Old API中的`onActivityResult()`方法

我们先看比较简单的情况，大部分情况下我们是在Activity / Fragment之间进行交互时使用Activity Result API，因此不需要传入Registry（`registerForActivityResult()`有一个只用传入`Contract`和`回调方法`的重载）；而Android本身已经有了一些预定义的协议，所以简单的调用如下：

```java
//in MainActivity
private ActivityResultLauncher<Intent> toSecondActivityLauncher = registerForActivityResult(
  new StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
	@Override
	public void onActivityResult(ActivityResult result) {
	  if (result.getResultCode() == RESULT_OK) {
		Intent resultIntent = result.getData();
		//todo things...
	  }
	}
  });
//......
//点击事件触发跳转
public void onClick(View view) {
	Intent intent = new Intent(MainActivity.this, SecondActivity.class);
	toSecondActivityLauncher.launch(intent);
}
```

我们通过`Launcher.launch()`来启动Intent并实现跳转，当我们跳转到SecondActivity后，其中不需要任何改动——仍是通过`setResult(resultCode, intent)`和`finish()`回到FirstActivity（MainActivity）。

这里我们使用了**StartActivityForResult**这个预定义的约束，它规定我们的输入类型是**Intent**，输出类型是**ActivityResult**。因此我们调用`Launcher.launch()`的时候传入的就是`Intent`；而回调接口的范型和回调方法的参数则是`ActivityResult`，表示输出回来的结果，拿到这个结果后我们就可以在回调方法中进一步处理。  
当然，这里作为输出类型的**ActivityResult**也是Android提供给我们的，主要就是通过`result.getResultCode()`来获取`resultCode`，通过`result.getData()`来获取`setResult(resultCode, intent)`中的Intent。（它只有这两个属性）

回调函数用的是也自带的**ActivityResultCallback**，其通过`onActivityResult()`进行结果的处理（虽然这个方法和Old API的方法重名，实际上是不同的方法）。  
更多时候，我们喜欢用`lambda`来实现回调方法：

```java
//in MainActivity
  private ActivityResultLauncher<Intent> toSecondActivityLauncher = registerForActivityResult(
      new StartActivityForResult(), result -> {
        if (result.getResultCode() == RESULT_OK) {
          Intent resultIntent = result.getData();
          //todo things...
        }
      });
```

因为参数和范型有点多，所以这里小小总结一下：起决定作用的还是约束`ActivityResultContract<I, O>`，我们用其中的`<I, O>`分别表示`输入类型`和`输出类型`：  
- `输入类型I`：决定了`ActivityResultLauncher<I>`的范型，以及`Launcher.launch(I)`的参数类型；
- `输出类型O`：决定了`ActivityResultCallback<O>`的范型，以及回调函数`onActivityResult(O)`的参数

### Contract约束

#### 预定义的Contract
之前提到，**StartActivityForResult**是一个预定义的Contract，当然除了它之外，还有许多其他给定的Contract供我们使用，这里列一些比较常见的：

| Contract                                                     | 功能                                  |
| ------------------------------------------------------------ | ------------------------------------- |
| `StartActivityForResult<Intent, ActivityResult>`             | 多用于App內Activity的跳转             |
| `RequestPermission<String, Boolean>`                         | 用于请求单个权限                      |
| `RequestMultiplePermissions<String[], Map<String, Boolean>>` | 用于请求一组权限                      |
| `TakePicturePreview<Void, Bitmap>`                           | 拍照，返回Bitmap图片                  |
| `TakePicture<Uri, Boolean>`                                  | 拍照，保存至Uri处，保存成功返回true   |
| `TakeVideo<Uri, Boolean>`                                    | 拍摄视频，保存至Uri处，返回一张缩略图 |
| `PickContact<Void, Uri>`                                     | 从通讯录获取联系人                    |
| `GetContent<String, Uri>`                                    | 选择内容，返回其Uri地址               |
| `CreateDocument<String, Uri>`                                | 创建一个文档，返回其Uri               |
| `OpenDocument<String[], Uri>`                                | 选择一个文档，返回其Uri               |
| `OpenMultipleDocuments<String[], List<Uri>>`                 | 选择多个文档，返回它们Uri的List       |
| `OpenDocumentTree<Uri, Uri>`                                 | 选择一个目录，返回其Uri               |

当看到 `OpenDocument<String[], Uri>`的时候我还有些疑问，为啥打开一个文件要传入`String数组`。事实上，当启动这个Contract之后，会打开类似文件管理器的页面，然后让我们选择文件：

```java
//In MainActivity
private ActivityResultLauncher<String[]> openDocumentLauncher = registerForActivityResult(new OpenMultipleDocuments(), result -> {  
	Log.d("TAG", "uri: " + result.getPath());  
	//选择一张图片后输出：/document/image:15649
});

openDocumentLauncher.launch(new String[]{"image/*", "video/*"});
```

可以看到，如果String数组中有`"image/*"`，则会打开图片的目录，可以选择其中的图片文件；如果带上`"video/*"`，则会打开视频的目录等。当然还有可以传入`“*/*”`，表示打开所有的目录。因此，上传头像等功能就能用它来帮助实现啦。  
`GetContent`、`OpenMultipleDocuments`、`OpenDocumentTree`等也是相似的操作流程。

由于运行时请求权限用到的比较多比较，所以来看看相关的Contract：  
因为返回结果代表着权限申请的成功与否，因此我们可以根据结果来判断是继续申请/退出，还是进一步执行操作。

```java
private ActivityResultLauncher<String> requestPermissionLauncher = registerForActivityResult(new RequestPermission(), result -> {  
  String resultMessage = result ? "Permission grated." : "Permission denied.";  
  Log.d("Callback:", resultMessage);  
});  
  
private ActivityResultLauncher<String[]> requestMultiPermissionsLauncher = registerForActivityResult(new RequestMultiplePermissions(), result -> {  
  for (Map.Entry<String, Boolean> entry : result.entrySet()) {  
    Log.d("Callback:", "Request Permission of " + entry.getKey() + " " + entry.getValue());  
  }  
});
//申请权限：
requestPermissionLauncher.launch(permission.ACCESS_FINE_LOCATION); 
//输出：true

requestMultiPermissionsLauncher.launch(new String[] {  
    permission.ACCESS_FINE_LOCATION,  
    permission.BLUETOOTH,  
    permission.NFC});
//输出：
//Request Permission of android.permission.ACCESS_FINE_LOCATION true
//Request Permission of android.permission.BLUETOOTH true
//Request Permission of android.permission.NFC true
```

其实用到最多的还是`StartActivityForResult`和几个`请求权限`相关的Contract，而其他的Contract都是在和其他App（系统App）交互的时候才用到，使用场景比较受限（打开相机、通讯录、文件管理器啥的）。  
如果没有额外的需求，这些预定义的Contract完全够我们使用的，而其中的实现构成对我们来说是透明的，不需要关心，因此，整个操作流程就变的更加方便和简洁。


#### Contract的内部操作
Contract既然规定了输入类型和输出类型，那么它内部应该是进行了一系列操作来进行转换的。我们就更进一步，看看其内部进行了哪些操作。（Result API中的Contract其实都是Kotlin实现的，其概念也是在Kotlin中引入的，我这里Decompile成Java展示）

以`StartActivityForResult`为例，我们看看其内部是如何实现的：

```java
public static final class StartActivityForResult extends ActivityResultContract<Intent, ActivityResult> {
    @Override
    public Intent createIntent(Context context, Intent input) {
        return input;
    }
    @Override
    public ActivityResult parseResult(int resultCode, Intent intent) {
        return new ActivityResult(resultCode, intent);
    }
}
```

可以看到，`StartActivityForResult`是抽象类`ActivityResultContract`的一个终类（final class）。事实上，所有预定义的Contract都是它的终类，区别就是输入类型和输出类型的范型不同。我们先瞟一眼`ActivityResultContract`这个抽象类：

```java
public abstract class ActivityResultContract<I, O> {
	public abstract Intent createIntent(Context context, I input);
	public abstract O parseResult(int resultCode, Intent intent);
	//...
}
```

可以看到，要的方法就是接收输入的`createIntent()`和返回输出的`parseResult()`两个方法。  
再回来看`StartActivityForResult`，当我们调用`launch()`的时候，`createIntent()`会被执行，其生成的**Intent**会被启动从而实现页面的跳转。  
当页面返回，则会调用`parseResult()`接收来自第二个Activity回传的数据（`setResult(resultCode, intent)`），并将其转变为输出类型O，在这里就是`ActivityResult`。最后我们把这个结果传给回调函数进行最终的处理。

也就是说，从作为`launch()`的参数开始算起，我们的数据流向大致是这样的：
`[FirstActivity]: launch() -> createIntent() -> [SecondActivity] -> setResult() -> parseResut -> [FirstActivity]: callback()`

#### 自定义的Contract

既然有ActivityResultContract这个抽象类，那当然只要继承它，我们就可以自定义Contract，创造我们自己的**Custom Contract**了——只要实现`createIntent()`和`parseResult()`就好了嘛。

```java
class CustomContract extends ActivityResultContract<String, String> {  
  @Override  public Intent createIntent(@NonNull Context context, String s) {  
    Intent intent = new Intent(context, SecondActivity.class);  
    intent.putExtra("createIntentStringKey", s);  
    return intent;  
  }  
  @Override  
  public String parseResult(int i, @Nullable Intent intent) {  
    String parseResultStringKey = intent.getStringExtra("parseResultStringKey");  
    if (parseResultStringKey != null) {  
      return parseResultStringKey;  
    } else {  
      return "no string in result";  
    }  
  }  
}
```

这里我们定义了输入和输出都是String的Contract。它将携带输入的String内容，并跳转到**SecondActivity**。而当我们从SecondActivity返回的时候，则会将返回Intent中的String提取出来。  
接下来我们就可以在**MainActivity**中利用它来进行跳转了：

```java
//in MainActivity
private ActivityResultLauncher<String> mLauncher = registerForActivityResult(new CustomContract(), result -> {  
  Log.d("Callback", result);  
});
//点击启动
public void onClick(View view) {  
  mLauncher.launch("hello");
}
```

而在SecondActivity中，我们可以通过之前设定的Key（`"createIntentStringKey"`）来获取Intent中的String内容；同时给返回的Intent带上相应Key（`"parseResultStringKey"`）的String，便于Contract获取到我们返回的内容：

```java
//in SecondActivity
	String message = getIntent().getStringExtra("createIntentStringKey");  
	Log.e("SecondActivity: ", message);
//点击返回MainActivity
public void onClick(View view) {  
	Intent goBackIntent = new Intent();  
	goBackIntent.putExtra("parseResultStringKey", "world");  
	setResult(RESULT_OK, goBackIntent);  
	finish();  
}
```

我们从**MainActivity**跳转到**SecondActivity**，获取到`launch()`传来的`"hello"`，Log输出；然后回到**MainActivity**，触发回调，Log输出`setResult()`传来的`"world"`（其实传来的是Intent，不过我们的Contract“从中作梗”，已经将其加工成String给我们了）：

```
D/SecondActivity: hello
D/Callback: world
```

### 注册器 ActivityResultRegistry

我们发现，在之前的使用过程中，我们并没有真正了解过注册器**ActivityResultRegistry**，那么它到底是怎么工作的呢？  
我们第一次提到Registry，是说它作为`registerForActivityResult()`的一个参数，那么我们就从这个方法入手：

```java
//in ComponentActivity.java
//两个参数的重载
public final <I, O> ActivityResultLauncher<I> registerForActivityResult(  
        @NonNull ActivityResultContract<I, O> contract,  
        @NonNull ActivityResultCallback<O> callback) {  
    return registerForActivityResult(contract, mActivityResultRegistry, callback);  
}

//真正的调用
public final <I, O> ActivityResultLauncher<I> registerForActivityResult(  
        @NonNull final ActivityResultContract<I, O> contract,  
        @NonNull final ActivityResultRegistry registry,  
        @NonNull final ActivityResultCallback<O> callback) {  
    return registry.register(  
            "activity_rq#" + mNextLocalRequestCode.getAndIncrement(), this, contract, callback);  
}  
```

我们看到，我们最常使用的两个参数的重载，其实是因为Activity中自带了一个`mActivityResultRegistry`，实际上最终还是通过Registry的`register()`来获取的Launcher。  
`mActivityResultRegistry`是**ActivityResultRegistry**的一个实例对象，仅实现了其`onLaunch()`的抽象方法。而在**ActivityResultRegistry**中，比较重要的方法有以下几个`onLaunch()`，`register()`，`dispatchResult()`

- `onLaunch()`是一个抽象方法，而`mActivityResultRegistry`就实现了它，内部进行了一些权限获取，最终通过`ActivityCompat.startActivityForResult()`来启动Intent。（代码有点长就不贴了）  

```java
//in ActivityResultRegistry.java
public abstract <I, O> void onLaunch(  
	int requestCode,  
	ActivityResultContract<I, O> contract,  
	I input,  
	ActivityOptionsCompat options);
```

- `register()`是一个final方法，它主要进行了Lifecycle的一系列操作，利用LifecycleContainer存储一些数据变量啥的，最后返回一个**ActivityResultLauncher**。它本身也是一个抽象类，这里在return的时候顺便实现了它的一些抽象方法

```java
//in ActivityResultRegistry.java
public final <I, O> ActivityResultLauncher<I> register(  
	final String key,  
	final LifecycleOwner lifecycleOwner,  
	final ActivityResultContract<I, O> contract,  
	final ActivityResultCallback<O> callback) {  
  
	Lifecycle lifecycle = lifecycleOwner.getLifecycle();  
	//...
	return new ActivityResultLauncher<I>() {  
		@Override  
		public void launch(I input, ActivityOptionsCompat options) {  
			Integer innerCode = mKeyToRc.get(key);  
			if (innerCode == null) {  
			//throw Exception
			mLaunchedKeys.add(key);  
			try {  
				onLaunch(innerCode, contract, input, options);  //1
			} catch (Exception e) {  
				//throw Exception
			}  
		}  
		@Override
		public void unregister() {  
			ActivityResultRegistry.this.unregister(key);  //2
		}  
		@Override
		public ActivityResultContract<I, ?> getContract() {  
			return contract;  
		}  
	};  
}
```

可以看到，这里为**ActivityResultLauncher**实现的`launch()`最终调用的是**ActivityResultRegistry**自己的抽象方法`onlaunch()`（注释1），而`onlaunch()`的实现则是由**ComponentActivity**中的`mActivityResultRegistry`实现（默认情况下）；而`unregister()`实际上也是**ActivityResultRegistry**自己的`unregister()`（注释2）。  
也就是说，对于一个**ActivityResultLauncher**来说，它的`unregister()`是在**ActivityResultRegistry**中实现的，而他的`launch()`则是由**Activity**实现的。  
感觉回调了好多层，我已经开始有些头晕了=x=  

至于`dispatchResult()`，他们的代码有点长，我删删减减了一些：

```java
//in ActivityResultRegistry.java
public final boolean dispatchResult(int requestCode, int resultCode, Intent data) {  
    String key = mRcToKey.get(requestCode);  
    if (key == null) { return false; }  
    doDispatch(key, resultCode, data, mKeyToCallback.get(key));  
    return true;  
}

public final <O> boolean dispatchResult(int requestCode, O result) {  
    String key = mRcToKey.get(requestCode);  
    if (key == null) { return false; }  
	//...
	ActivityResultCallback<O> callback =  
			(ActivityResultCallback<O>) callbackAndContract.mCallback;  
	if (mLaunchedKeys.remove(key)) {  
		callback.onActivityResult(result);  
	}  
    return true;  
}  
  
private <O> void doDispatch(String key, int resultCode, Intent data, CallbackAndContract<O> callbackAndContract) {  
	//...
	ActivityResultCallback<O> callback = callbackAndContract.mCallback;  
	ActivityResultContract<?, O> contract = callbackAndContract.mContract;  
	callback.onActivityResult(contract.parseResult(resultCode, data));  
	mLaunchedKeys.remove(key);  
    //...
}
```

总的来说，最后都是通过`callback.onActivityResult()`来将结果通过回调接口传给外部，这里的回调接口（`CallbackAndContract.mCallback`）就是我们的`ActivityResultCallback`。因此外部（包括非Activity/Fragment）就可以通过`dispatchResult()`来获取回传的结果。

实际上，在弃用的`ComponentActivity.onActivityResult()`中就有`dispatchResult()`，用于拦截返回结果，将结果分发给**ActivityResultRegistry**进行处理。如果拦截失败则交给`onActivityResult()`继续传递。

```java
//in ComponentActivity
@Deprecated  
@CallSuper  
protected void onActivityResult(int requestCode, int resultCode, Intent data) {  
  if (!this.mActivityResultRegistry.dispatchResult(requestCode, resultCode, data)) {  
    super.onActivityResult(requestCode, resultCode, data);  
  }  
}
```

不过在大多数情况下我们是不用自己实现`Registry`的，自带的`mActivityResultRegistry`能满足基本需求哒。

### 用生命周期组件Lifecycle进行包装

大部分情况下我们都只在**Activity**和**Fragment**中会用到`Result API`，我们可以通过`registerForActivityResult()`直接生成一个**Launcher**，因为`ConponentActivity`和`Fragment`都实现了`ActivityResultCaller`接口，重写了这个方法。  
而在一些特殊情况中，我们需要在**非Activity/Fragment**的位置接收Activity回传的数据，这时候就要用到注册器**ActivityResultRegistry**了  

我们可以新建一个生命周期组件，实现**DefaultLifecycleObserver**，它分别持有注册器**ActivityResultRegistry**和启动器**ActivityResultLauncher**，利用注册器来生成启动器。  
其实也可以直接声明一个**ActivityResultRegistry**实例，但是我们更习惯将其用**LifecycleObserver**进行一个包装。原因是当我们成功注册一个Launcher后，为了保证资源释放，需要在最后调用`launcher.unregister()`来将其释放。  
不过由于Activity和Fragment都有自己的生命周期，其**LifecycleOwner**会在`onDestroy()`中自动释放Launcher，不用我们操心。但是我们使用注册器的前提是“可能在**非Activity/Fragment**的位置调用Launcher”，这些位置不一定有自己的Lifecycle，因此，为了避免每次手动调用`unregister()`，我们用生命周期组件将其包装，以实现Launcher的自动释放。

> When using the `ActivityResultRegistry` APIs, it's strongly recommended to use the APIs that take a `LifecycleOwner`, as the `LifecycleOwner` automatically removes your registered launcher when the `Lifecycle` is destroyed. However, in cases where a `LifecycleOwner` is not available, each `ActivityResultLauncher` class allows you to manually call `unregister()` as an alternative.

具体的实现如下：

```java
class MyLifecycleObserver implements DefaultLifecycleObserver {  
  private final ActivityResultRegistry mRegistry;  
  private ActivityResultLauncher<String> mLauncher;  
  
  MyLifecycleObserver(ActivityResultRegistry registry) {  
    mRegistry = registry;  
  }  
  
  public void onCreate(LifecycleOwner owner) {  
    mLauncher = mRegistry.register("key", owner, new CustomContract(), result -> {  
      Log.d("callback", "Lifecycle onCreate: " + result);  
    });  
  }  
  
  public void startLauncher(String inputString) {  
    mLauncher.launch(inputString);  
  }  
}
```

其中用到的Contract是我们自己自定义的**CustomContract**，接收一个String作为`launch()`参数，返回一个String作为回调接收的内容。  
接下来我们就可以在**MainActivity**中实例化这个**MyLifecycleObserver**，进而使用其中的Launcher了，以此来代替之前通过`registerForActivityResult()`获取Launcher的方式。

```java
//In Other Class
private MyLifecycleObserver mObserver;
//onCreate中实例化Observer并绑定
@Override  
protected void onCreate(Bundle savedInstanceState) {  
	//...
	mObserver = new MyLifecycleObserver(getActivityResultRegistry());  
	getLifecycle().addObserver(mObserver);  
}
//通过mObserver来启动Launcher
mObserver.startLauncher("hello");
```

当我们用生命周期组件Lifecycle进行包装后，即使在其他的一些类中，我们也能轻松启动Launcher，而不用关心自己应该在什么时候将其释放。

## 小结 - 两者对比
有一个很直观的一点就是，使用Result API之后，我们不再需要**Request Code**了。  
在Old API中，我们需要RequestCode来告诉`onActivityResult()`我们的请求是来自哪里的；而在Result API中，我们采用了`Launcher-Contract-Callback`来进行请求和结果处理。每个Launcher都有自己的Callback，相当于每个请求都有属于自己的`onActivityResult()`，不再需要统一处理。  
我们看到Registry的代码中有很多key的出现，这个key就是用来生成每个Launcher的唯一识别码的（因此我们能用同一个Registry生成多个Launcher）。相当于**Request Code**被偷偷藏在内部，对外部透明了，我们就不需要考虑它啦。

这也是Result API最为直观的优点，取消了**Request Code**，则就没有了越来越多的常量Flag；没有了`onActivityResult()`，则就没有了越来越多的耦合和嵌套。  （不过我们会有越来越多的Launcher和Callback，所以代码总量还是基本不变的）

此外，相比于Old API，Result API有着更加广泛的功能——至少我们能用它来进行运行时的权限请求了，而这也得益于Contract的引入。  
不仅如此，支持自定义的Contract也让我们有了更好的扩展性，可以针对自己的需求来自创Contract，让请求的发送和结果的处理更加流畅。

话虽如此，Result API也有着一定的学习成本，毕竟它有着**Launcher**、**Contract**、**Registry**等组件，是以往不曾接触的。但是简单的使用还是比较简单的，而且掌握后其带来的多功能、高扩展也挺让人受益的

## 参考
1. [developers：Getting a result from an activity](https://developer.android.com/training/basics/intents/result#java)
2. [ActivityResultContract](https://developer.android.com/reference/androidx/activity/result/contract/ActivityResultContract)
3. [谈谈Fragment中的onActivityResult](https://www.cnblogs.com/tangZH/p/5930491.html)
4. [再见！onActivityResult！你好，Activity Results API！](https://segmentfault.com/a/1190000037601888)
5. [搞懂 Activity Result API （一）](https://juejin.cn/post/7061993155759095845)
6. [Activity Result API详解，是时候放弃startActivityForResult了](https://blog.csdn.net/guolin_blog/article/details/121063078)
7. [startActivityForResult() 被弃用，来试试Activity Result API](https://loismeng-qh.github.io/2022/08/29/Android-Activity-Result-API/)
