# Level 1
## 前言
最近写项目的时候xxx
发现xx被弃用了
结果要用
折腾了一番有了这篇文章

起因是看到以前的代码中，`startActivityForResult()`和`onActivityResult()`被弃用了（但是`startActivity()`没有被弃用），然后点进去一看，发现他们在androidx的`activity:1.2.0-alpha02`和`fragment:1.3.0-alpha02`中被弃用（在appcompat库中则是1.3.0被弃用）。并且官方推荐了**Activity Result API**作为替代方法。  
那么在探究为什么弃用之前，我们先来回顾一下他们的使用方法吧。

## Level 2  Old API

### 基本用法
`startActivityForResult()`和`startActivity()`的功能一样， 都是通过启动**Intent**来进行页面跳转，不同点在于它的第二个参数接收了一个**Request Code**，用来表示启动的这个Intent。  
`onActivityResult()`则可以通过**Request Code**和**Result Code**（通常在新的Activity中，在`finish()`前通过`setResult()`设置）来对某次跳转或某种结果进行特定的后续操作。
```java
//第一个Activity中，启动intent进行页面跳转
startActivityForResult(intent, RequestCode); 
//回到初始页面处理结果
onActivityResult(RequestCode, ResultCode, intent) {  
  if (resultCode == OK) {  //通过resultCode判断是否进行后续操作
    switch (requestCode) {  //通过requestCode针对跳转不同进行不同的后续操作
      case 1:    
		······
      case 2:  
		······
    }  
  }  
}
```
这么看多少有点复杂，主要还是因为我们一个页面可以跳转到许多不同的页面，而一个页面也可以从许多其他的页面跳转而来。于是乎我们就得对页面的跳转（Intent）进行标识，毕竟一个Intent并不会记录它从何而来，又要到哪去。  
接下来用一个小Demo来熟悉一下这几个方法的用法吧。

## 记录路径的小Demo
众所周知，基础的页面（Activity）跳转是通过`startActivity(Intent)`来实现的，但仅仅如此显然不能满足咱们的需求。  
很多时候页面跳转完之后要回到原来的页面，还要根据我们跳转去的页面来进行一些后续操作。这类需求常见于一些数据展示的页面，这里就用一个**记录并展示用户浏览路径**的小Demo来举个小栗子🌰吧

（一个gif）

### startActivityForResult() 和 onActivityResult()
在这种情况下，我们就需要区分我们是从哪个页面回来的，所以`startActivity()`就不能满足我们的需求，需要使用`startActivityForResult()`和`onActivityResult()`。为此，我们先定义了两个`Request Code`分别表示从Main到两个不同的页面
``` java
private final int REQUEST_FROM_MAIN_TO_SECOND = 100;  
private final int REQUEST_FROM_MAIN_TO_THIRD = 200;
```

然后**MainActivity**中的两个按钮点击事件就很简单了。
```java
//toSecondBtn
public void onClick(View view) {  
	Intent intent = new Intent(MainActivity.this, SecondActivity.class);  
	startActivityForResult(intent, REQUEST_FROM_MAIN_TO_SECOND);  
}  
//toThirdBtn
public void onClick(View view) {  
	Intent intent = new Intent(MainActivity.this, ThirdActivity.class);  
	startActivityForResult(intent, REQUEST_FROM_MAIN_TO_THIRD);  
}  
```

为了~~偷懒~~方便起见，在**SecondActivity**或者**ThirdActivity**中我们啥也不做，假装我们完成了一系列操作，最后点击按钮回到**MainActivity**。  
具体操作就是通过`setResult()`设置完**Result Code**后，调用`finish()`返回MainActivity（SecondActivity和ThirdActivity都一样，点击按钮返回嘛）
```java
//backToMainBtn in SecondActivity/ThirdActivity
public void onClick(View view) {  
  setResult(RESULT_OK);  
  finish();  
}  
```

然后我们回到了MainActivity，因为从不同的Activity回来我们所要做的处理是不同的（加的字符串不同嘛）。由于返回的Result Code是一样的，我们只能从Request Code中进行区分：
```java
//in MainActivity
@Override  
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {  
  super.onActivityResult(requestCode, resultCode, data);  
  if (resultCode == Activity.RESULT_OK) {  
    switch (requestCode) {  
      case REQUEST_FROM_MAIN_TO_SECOND:    
        stringBuilder.append("Second -> Main\n");  
        break;  
      case REQUEST_FROM_MAIN_TO_THIRD:  
        stringBuilder.append("Third -> Main\n");  
        break;  
    }  
    showPathHistory();  
  }  
}
```

### 同一个Request Code，不同的Result Code
上述的栗子🌰中我们的**Result Code**是一样的（`Activity.RESULT_OK`），根据不同的**Request Code**来判断路径来自哪里。这时候就会有小伙伴好奇了，我能不能规定从MainActivity出来的**Request Code**相同，而给不同的请求目标设置不同的**Result Code**呢？  
当然是可以的。在MainActivity中统一**Request Code**
```java
//in MainActivity
//toSecondBtn
public void onClick(View view) {  
	Intent intent = new Intent(MainActivity.this, SecondActivity.class);  
	startActivityForResult(intent, REQUEST_FROM_MAIN);  //统一Request Code
}  
//toThirdBtn
public void onClick(View view) {  
	Intent intent = new Intent(MainActivity.this, ThirdActivity.class);  
	startActivityForResult(intent, REQUEST_FROM_MAIN);  //统一Request Code
}  

@Override  
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {  
  super.onActivityResult(requestCode, resultCode, data);  
  if (requestCode == REQUEST_FROM_MAIN) {  //先判断requestCode从哪发出
    switch (resultCode) {  //再判断结果从哪来
      case RESULT_OK_FROM_SECOND:    
	    stringBuilder.append("Main -> Second\n");  
        stringBuilder.append("Second -> Main\n");  
        break;  
      case RESULT_OK_FROM_THIRD:  
        stringBuilder.append("Main -> Third\n");  
        stringBuilder.append("Third -> Main\n");  
        break;  
    }  
    showPathHistory();  
  }  
}
```

而SecondActivity和ThridActivity中则要区分**Result Code**
```java
//in SecondActivity
public void onClick(View view) {  
  setResult(RESULT_OK_FROM_SECOND);  //区分Result Code
  finish();  
}  
//in ThridActivity
public void onClick(View view) {  
  setResult(RESULT_OK_FROM_THIRD);  //区分Result Code
  finish();  
}  
```

但是要注意，这种方法**可行**，但是**不提倡**。如果我们把MainActivity看成是客户端，另外两个Activity看成服务端，那么我们的路径就类似是一个**交互请求**。  
在普遍的前后端交互中，往往后端的返回值是规定好的（不然怎么会有状态码这种东西呢），我们先获取并后端的返回值进行判断，是抛出错误信息呢还是进一步操作。  
所以在使用`Request/Result Code`的时候，也是推荐保持**Result Code**一致，设定不同的**Request Code**。

但但是，既然可行，那就会有人用，毕竟不严格地说这仅仅是代码风格上的差异。因此在现实中，尤其是在多人开发或迭代运维的情况下，经常会遇到两种风格混杂使用，这当然会导致代码可读性的降低和重构的困难，因此这也是这种API带来的缺点之一。（又多了一个弃用的理由啦）

### 传递数据
```java
//in MainActivity
//toSecondBtn
public void onClick(View view) {  
	Intent intent = new Intent(MainActivity.this, SecondActivity.class);  
	intent.putExtra(SOURCE_KEY, "Main");  
	startActivityForResult(intent, REQUEST_FROM_MAIN_TO_SECOND);  
}
//toThirdBtn类似所以省略
```

```java
//in SecondActivity/ThirdActivity
//backToMainBtn in SecondActivity
public void onClick(View view) {  
	String source = getIntent().getStringExtra(SOURCE_KEY);  //得到来源页面的名字
	Intent backIntent = new Intent(SecondActivity.this, MainActivity.class);  
	backIntent.putExtra(LOG_KEY, source + " -> Second");  //构造一条‘来源->自己’的log
	backIntent.putExtra(SOURCE_KEY, "Second");  //放入自己的名字
	setResult(RESULT_OK, backIntent);  
	finish();
}  
//backToMainBtn in ThirdActivity类似所以省略
```

```java
//in MainActivity
@Override  
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {  
  super.onActivityResult(requestCode, resultCode, data);  
  if (resultCode == Activity.RESULT_OK) {  
    switch (requestCode) {  
      case REQUEST_FROM_MAIN_TO_SECOND:  
        appendLogItemFromIntent(data);  //1
        break;  
      case REQUEST_FROM_MAIN_TO_THIRD:  
        appendLogItemFromIntent(data);  //2
        break;  
    }  
    showPathHistory();  
  }  
}

private void appendLogItemFromIntent(Intent data) {  
  String logItem = data.getStringExtra(LOG_KEY);  
  String source = data.getStringExtra(SOURCE_KEY);  
  stringBuilder.append(logItem + '\n');  
  stringBuilder.append(source + " -> Main\n");  
}
```

可以看到，数据传递的好处之一就是可以通过传递来的数据用同一个方法进行处理，从而减少代码的重复，比如上面的1行和2行都是一样的，可以直接变为：
```java
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {  
  super.onActivityResult(requestCode, resultCode, data);  
  if (resultCode == Activity.RESULT_OK) {  
	appendLogItemFromIntent(data);
    showPathHistory();  
  }  
}
```

## 参考
1. [获取 activity 的结果](https://developer.android.com/training/basics/intents/result?hl=zh-cn)
2. [AndroidX 使用 Activity Result API 替代 startActivityForResult()](https://code-question.com/developer-blog/androidx-activity-result-api-startactivityforresult)
3. [再见！onActivityResult！你好，Activity Results API！](https://segmentfault.com/a/1190000037601888)
4. [学穿：Activity Results API](https://www.361shipin.com/blog/1536400678463733760)
5. [Android 超详细深刨Activity Result API的使用_Android](https://www.ab62.cn/article/11468.html)
6. [谈谈Fragment中的onActivityResult](https://www.cnblogs.com/tangZH/p/5930491.html)
7. [registerForActivityResult（上）](https://www.jianshu.com/p/fcad06c8c9a5)
8. [深入理解Activity Result API：ActivityResultContract的实现原理](https://juejin.cn/post/6922866182190022663#heading-4)
9. [搞懂 Activity Result API （一）](https://juejin.cn/post/7061993155759095845#heading-3)
