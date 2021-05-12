---
layout:       post  
title:        Dialog各种对话框的实现  
subtitle:     包含AlertDialog、PopupWindow以及Activity实现对话框（真的好多！）  
date:         2021-05-07  
auther:       BlackDn  
header-img:   img/moriya_150_018.jpg    
catalog:      true  
tags:  
    - Android
---

>"我拥向宇宙吹来的风，与夏夜相逢，是六月盛装，清寂长生。"  

# 前言
本来想写一篇关于对话框工具的使用，结果发现有AlertDialog.Builder和PopupWindow两种比较常用  
还还还可用Activity配合内置的theme实现对话框  
这就导致这一篇内容很多很多...写之前没想到结果越写越多（  
于是就要纠结好久要不要放图片，用几级标题比较合适（叹气）  
毕竟图片太多影响加载，标题太多会导致目录冗长  
呜呜  
代码已经上传了，有兴趣的小伙伴可以自己看看敲敲：[GIthub：DialogLearningDemo](https://github.com/BlackDn/DialogLearningDemo)  

# 对话框
**AlertDialog.Builder** 和 **PopupWindow** 身为两大最常用的对话框，也是有点区别的  
AlertDialog.Builder是很强硬的对话框，会在屏幕中间弹出，**并且会阻断主线程、抢夺焦点**，我们平时看到的后面变灰的弹窗基本都是这种，只有处理完弹窗才能回到主界面。也是由于这个特性我们要慎用AlertDialog.Builder  
PopupWindow相对柔和些，他不会阻断主线程，一般会在按钮下面或者角落出现小框框，**不会阻断主线程，不会抢夺焦点**，你可以边看视频边点他  
(为了加快图片加载所以压缩了画质)  
![123](https://z3.ax1x.com/2021/05/07/g1c2RS.jpg)  

## 1. AlertDialog.Builder对话框
虽然我叫他**AlertDialog.Builder**，但大家要知道其实他本身是AlertDialog类。那Builder是干嘛的呢？  
AlertDialog.Builder是一种典型的**建造者模式**，在源码中，**AlertDialog所有的构造方法都是protected**，因此不能直接调用  
Builder是AlertDialog的一个**静态内部类**，我们以此来构造并创建AlertDialog对象  
原理是这样，说白了就是创建对话框都用AlertDialog.Builder就是了。来看看Builder的常用方法  
  
|          方法          |     功能      |
| ---------------------- | ------------- |
| setIcon()              | 设置图标      |
| setTitle()             | 设置标题      |
| setMessage()           | 设置消息内容   |
| setItems()             | 设置列表选项   |
| setSingleChoiceItems() | 设置单选列表   |
| setMultiChoiceItems()  | 设置多选列表   |
| setView()              | 设置自定义视图 |
| setPositiveButton()    | 设置“确认”按钮 |
| setNegativeButton()    | 设置“取消”按钮     |
  
### 1.1 AlertDialog实现各种对话框
根据Builder所使用的方法的不同，对话框可以有不同的类型  
常见的对话框类型包括：普通对话框、列表对话框、单选/多选对话框、自定义对话框等  
事实上对于对话框来说并没有严格的分类，不同人心中有着有不同的分类。  
大家本质上话框都一样，都是AlertDialog类，用Builder删删减减有不同功能而已，不用太在一这些类别  

#### 1.1.1 普通对话框（消息对话框/确认对话框）
这就是最基础的对话框了，给个标题、内容，带一两个按钮的都算这种对话框  
我们就从这种对话框入手，简单介绍一下AlertDialog.Builder的基础使用方法  
布局从简，我们放个按钮，点击方法里显示对话框就行。不会有人不会放按钮不会写点击事件吧，不会吧不会吧？  
  
```
    public void clickCommonBtn(View view) {
        new AlertDialog.Builder(this)
                .setIcon(R.drawable.ic_launcher_foreground)
                .setTitle("This is title")
                .setMessage("This is Message")
                .setNegativeButton("cancel", null)
                .setPositiveButton("make a toast", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Toast.makeText(DialogActivity.this, "toast", Toast.LENGTH_SHORT).show();
                    }
                }).create().show();
    }
```

首先我们new一个Builder来构建我们的对话框，传入的参数是上下文Context  
可以看到，我们用setIcon()设置了标题栏的图标（用的是系统自带的），然后设置标题、内容。之后用setNegativeButton()和setPositiveButton()分别设置否定按钮和确定按钮，参数都一样，分别为**按钮文字**和**点击方法**。除了这两个还有一个中性按钮setNeutralButton()，参数同上。  
之所以分三种按钮主要是处于人性化考虑，没有本质上的区别，你要是喜欢也可以在否定按钮（NegativeButton）里写个“OK”然后处理确定事件。  
不管哪种按钮，点击后都会自动关闭当前对话框。  
我们这里让确定按钮显示一个Toast，取消按钮啥也不用干，给个null  
  
最后调用**create()** 和 **show()**来使对话框展示，就像Toast最后也要一个show()。而**create()**是可以省略的，因为**show()**会自动进行create  
在官方文档中提到：  

```
Calling this method does not display the dialog. If no additional processing is needed, show() may be called instead to both create and display the dialog.
```
  
在用创建AlertDialog.Builder创建对话框的时候，我们采用了**匿名对象**的方法，直接用new关键词实例化，却没有新建这个类的变量进行赋值  
在调用new关键词时，系统在**堆内存开辟空间**，存放我们对象的成员变量、方法，在非匿名对象的情况下我们会新建变量，这个变量在栈内存中，存放之前堆内存的地址。而这里**匿名对象**没有新建变量，意味着**没有在栈内存中新建变量**，因此就没人能拿到他堆内存的地址了。  
因为没有变量，所以没有记录堆内存对象的地址，用完就找不到了。在调用结束后直接进行回收，节省资源。  
所以匿名对象的缺点就是只能用一次，用完就扔；优点就是节省资源。  
对于我们的对话框，我们只需要他弹出一次，点击按钮后关闭。因此用**匿名对象**无疑是十分合适的。  
  
除此之外，我们把所有方法进行连点，构造出这个对话框。这种方法常在**匿名对象**中使用，因为不能以**对象名.方法名**来调用方法。这本质上是一行代码。  
要注意的是，只有当方法的返回值为其本身时能使用方法的连点。比如我们看看setIcon()的源码：  

```
        public Builder setIcon(@DrawableRes int iconId) {
            P.mIconId = iconId;
            return this;
        }
```

设置了icon后返回自身（this），因此可以继续使用其他方法。  
  
我们这个对话框有消息内容，可以把他成为**消息对话框**，当然我们还可以不写**setMessage()** 方法，只给标题和按钮，构成**确认对话框**，比如可以写一个“你确定要退出吗”的确认对话框，点击确认退出程序（可以调用finish()等方法），点击取消啥也不做关闭对话框。  
接下来我们看看其他对话框  

#### 1.1.2 列表对话框
列表对话框的核心是**setItems()** 方法  
在创建对话框前我们需要创建一个数组常量（final），用来存放列表显示的文字  
然后用**setItems()** 方法处理每个项的点击事件  

```
    public void clickListBtn(View view) {
        final String[] list = {"第一项", "第二项", "第三项", "第四项"};
        new AlertDialog.Builder(this)
                .setIcon(R.drawable.ic_launcher_foreground)
                .setTitle("The List")
                .setItems(list, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        switch (i) {
                            case 0:
                                Toast.makeText(DialogActivity.this, "点击了：" + list[i], Toast.LENGTH_SHORT).show();
                                break;
                            default:
                                Toast.makeText(DialogActivity.this, "点击了：" + list[i], Toast.LENGTH_SHORT).show();
                                break;
                        }
                    }
                })
                .setNegativeButton("关闭", null)
                .show();
    }
```

**setItems()** 需要两个参数，第一个就是我们的数组，用于显示项的文字；第二个则是点击后的处理事件  
方法所带的int参数 i 就是我们点击的按钮下标，可以根据 i 来判断我们点击的是哪一个按钮，从而进行逻辑处理  

#### 1.1.3 单选对话框
单选对话框本质上也是个列表对话框，以评分为例，展现出来的都是一个列表，然后我们选择一个进行提交。主要的方法是**setSingleChoiceItems()**   
  
**setSingleChoiceItems()** 和 **setItems()** 是十分类似的，从上面的**setItems()** 我们可以看到，每次点击，其第二个处理点击事件的参数都会被调用。而我们进行评分的时候，不可能一下子就选中分数提交，而会有一个考虑的过程，甚至会在各个分数间点来点去，最后点确定再提交。因此显然不能把最终的提交逻辑放在这里，而要放在确定按钮上。  
所以，为了获取用户最终选择的分数，我们就需要设置一个变量来存储用户的选择，在每次点击后进行修改，最后在确定按钮中根据这个分数进行逻辑处理  
综上所述，代码是这样的：  

```
    int score = 0;
    public void clickSingleChoiceBtn(View view) {
        final String[] list = {"一星太差了", "两星不太行", "三星一般般", "四星还不错", "五星炒鸡棒"};
        new AlertDialog.Builder(this)
                .setIcon(R.drawable.ic_launcher_foreground)
                .setTitle("Single Choice List")
                .setSingleChoiceItems(list, 0, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        switch (i) {
                            case 0:
                                score = 1;
                                break;
                            case 1:
                                score = 2;
                                break;
                            case 2:
                                score = 3;
                                break;
                            case 3:
                                score = 4;
                                break;
                            case 4:
                                score = 5;
                                break;
                        }
                    }
                })
                .setNegativeButton("取消", null)
                .setPositiveButton("提交", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Toast.makeText(DialogActivity.this, "最终分数：" + score, Toast.LENGTH_SHORT).show();
                    }
                }).show();
    }
```

**setSingleChoiceItems()** 方法接收三个参数，一个数组用于显示；一个初始值用于默认选择（比如上面是0，则刚打开默认选择的是数组下标为0的选项）；一个点击后的处理事件  
同**setItems()** ，int变量 i 就是选择项的下标，运用switch-case语句进行逻辑的处理。此外，我们在外面设置了score变量存放最终选择的数据，列表项的点击时事件只对score进行修改，最后提交的时候显示我们最后提交的分数  

#### 1.1.4 多选对话框
多选对话框和单选大同小异，只不过逻辑稍微复杂了一点，用**true**和**false**判断某一列表项是否被选中。  
主要方法是**setMultiChoiceItems()**   
当然我们可以先进行选择，最后遍历列表查看所有项是被选中还是没被选中，但这样似乎有点耗时、显得冗杂。于是我们可以动态地操作数组，点击某一项地时候，如果该项被勾选（返回true），则add进数组；如果被取消勾选（返回false），则从数组中remove出去  

```
    ArrayList<Integer> choices = new ArrayList<Integer>();
    public void clickMultiChoicesBtn(View view) {
        final String[] list = {"选项1", "选项2", "选项3", "选项4", "选项5"};
        new AlertDialog.Builder(this)
                .setIcon(R.drawable.ic_launcher_foreground)
                .setTitle("Multiple Choice List")
                .setMultiChoiceItems(list, new boolean[]{false, false, false, false, false}, new DialogInterface.OnMultiChoiceClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i, boolean b) {
                        if (b == true) {
                            choices.add(i);
                        } else {
                            choices.remove(i);
                        }
                    }
                })
                .setNegativeButton("取消", null)
                .setPositiveButton("提交", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Toast.makeText(DialogActivity.this, "最终选择：" + choices.toString(), Toast.LENGTH_SHORT).show();
                        choices.clear();
                    }
                }).show();
    }
```

**setMultiChoiceItems()** 同样接收三个参数，一个数组用于显示列表；一个布尔类型数组用于初始化列表（上面全为false，表示刚打开对话框所有列表项都是不被选择的状态）；点击事件  
外面创建了一个ArrayList用于存放最终结果；在点击事件中我们判断当前项是被选中了还是被取消了，选中了就add进ArrayList，取消了就remove出ArrayList，最后在确定按钮显示最终选择  

#### 1.1.5 自定义对话框
自定义对话框就是用自己的布局放到对话框中，我们需要一个绑定了布局的View对象，再用**setView()** 方法传给Builder  
大致步骤如下：  

1. 定义xml布局
2. 利用LayoutInflater获取绑定布局的对象
3. 调用Builder的setView()设置View
4. 获取输入内容或编写监听事件

##### 自定义布局
先来个自定义布局，我命名为**layout_customized_dialog.xml**  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:background="#FFFFFF"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="#0e2348"
        android:orientation="horizontal"
        android:gravity="center">
        <TextView
            android:text="提示"
            android:textSize="20sp"
            android:textColor="#FFFFFF"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:padding="10dp"/>
    </LinearLayout>
    
    <LinearLayout
        android:orientation="vertical"
        android:gravity="center"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">
        <TextView
            android:text="这是个自定义框框"
            android:textSize="18sp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_margin="10dp" />
        <Button
            android:id="@+id/customized_dialog_btn"
            android:text="确定"
            android:layout_gravity="center"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>
    </LinearLayout>
</LinearLayout>
```

##### 构造自定义对话框
在DialogActivity的按钮点击事件中，我们进行对话框的构建  

```
    public void clickCustomizedCtn(View view) {
        //绑定布局的View
        View myView = LayoutInflater.from(this).inflate(R.layout.layout_customized_dialog, null);
        //构建对话框
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setView(myView);
        Dialog dialog = builder.create();
        dialog.show();
//        Dialog dialog = new AlertDialog.Builder(this).setView(myView).create();
//        dialog.show();
        //按钮的点击事件
        myView.findViewById(R.id.customized_dialog_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(DialogActivity.this, "自定义对话框被关掉了", Toast.LENGTH_SHORT).show();
                dialog.dismiss();
            }
        });
    }
```

首先，新建一个View来绑定我们的布局，等会把他传给builder来构建自定义对话框；  
然后，用Builder的**setView()** 方法将我们的布局导入，这样对话框显示的就是我们自己的布局了  
要注意的是，因为我们使用了自己的布局，没有设置对话框自带的按钮，因此点击我们的按钮是不会有任何反应的，甚至不会自己关闭对话框，需要自己编写点击事件。  
让对话框关闭的方法是**dismiss()** ，遗憾的是我们的Builder并没有这个方法，因此需要在构建对话框的时候将Builder对象给到Dialog对象，之后对Dialog对象进行操作，这样就可以在按钮里用DIalog的**dismiss()** 方法来关闭对话框了。  
Builder的**create()** 方法返回的是一个AlertDialog对象，因此我们在构建对话框的时候把create()的结果给到Dialog对象。Dialog实际上是AlertDialog的父类，所以可以用AlertDialog.Builder直接赋值。  
随后在按钮的点击事件里写个Toast，并用Dialog的**dismiss()** 方法关闭对话框  
  
细心的同学可能会问，“晓黑晓黑你之前不是说用**匿名对象**吗，这里怎么没用啊你是不是在坑我啊？”  
其实Builder的构建还是可以用**匿名对象**的，就像注释的两行代码。但是Dialog却不能用匿名对象，因为他不是一次性的，我们在按钮的点击事件中还需要Dialog对象来帮助我们关闭这个对话框  
不用匿名对象还不是为了提高代码的可读性嘛QwQ  

### 1.2 其他对话框
之所以把下面几个对话框单独列出来，是因为他们用的类不是AlertDialog，而是有**各自的类**  
日期选择对话框是**DatePickerDialog**，时间选择对话框是**TimePickerDialog**，进度对话框是**ProgressDialog**  
不过这三个类都是**AlertDialog的子类**，所以也不用分的那么细，用法也都大同小异  

#### 1.2.1 日期选择对话框
日期选择对话框用的是DatePickerDialog类，不过在使用前需要先实例化一个Calendar对象，用于获取当前时间，在设置默认值的时候用到  

```
    public void clickDatePickerDialogBtn(View view) {
        Calendar calendar = Calendar.getInstance();
        new DatePickerDialog(this,
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker datePicker, int year, int month, int dayOfMonth) {
                        String text = "选择了: " + year + "." + (month + 1) + "." + dayOfMonth;
                        Toast.makeText(DialogActivity.this, text, Toast.LENGTH_SHORT).show();
                    }
                },
                calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH)
        ).show();
    }
```

在使用DatePickerDialog的时候我们仍是使用了**匿名对象**  
他的构造方法接收五个参数，不过最后三个是第一次加载时的默认值，我们用Calendar对象的get方法来获取当前时间，并传入作为默认值，比较好理解  
第一个参数是上下文Context，第二个参数是确定按钮的点击事件  
  
和单选/多选对话框不同，日期选择对话框自带了**取消**和**确定**两个按钮，取消就是什么也不做直接关闭对话框，这个按钮不用我们自己写  
**确定的点击事件**有四个参数，第一个是DatePicker的对象，后面三个分别是年月日的值，虽然我们看不到，但他们实际上会动态更新，因此是我们最终选择的日期。  
要注意month的值是0~11，所以在显示的时候需要加一来显示  

#### 1.2.2 时间选择对话框
时间选择对话框和日期选择对话框十分类似，开局一个Calendar用于获取当前时间  

```
    public void clickTimePickerDialogBtn(View view) {
        Calendar calendar = Calendar.getInstance();
        new TimePickerDialog(this, new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker timePicker, int hourOfDay, int minute) {
                String text = "选择了: " + hourOfDay + "." + minute;
                Toast.makeText(DialogActivity.this, text, Toast.LENGTH_SHORT).show();
            }
        }, calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), true).show();
    }
```

同样是**匿名对象**的方式，接收五个参数：上下文Context；确定按钮的点击方法；默认的小时；默认的分钟；是否以24小时制显示  
默认的小时和分钟仍是以Calendar的get方法获得；最后一个参数如果是true则以24小时制显示，false则不以24小时制显示  

#### 1.2.3 进度对话框
进度对话框是十分常用的一种对话框了，特别是下载、加载的时候  
不过现在很多第三方库有很好看的进度对话框，所以系统给的用的越来越少了，不过我们还是来看看  
系统给我们了两种进度对话框，分别是**环形（转圈圈）** 和 **水平进度条型** 的，都来看看  

##### 前期小准备
因为是进度对话框，我们得模拟一个耗时操作，然后在结束的时候关闭对话框，以及在加载过程中显示进度  
所以会涉及到子线程；既然有子线程，那还得子线程和主线程沟通吧，所以又要Handler，涉及到挺多东西  
在写代码前先预告一下进度对话框编写的结构  
  
首先在外面写个**ProgressDialog**和**Handler**  
Handler是非常常用的工具类，特别是在子线程和主线程通信时，就像Adapter是数据和布局的桥梁，Handler可以理解为主线程和子线程的桥梁  
不过Handler本体还是运行在主线程的，我们通常在子线程运行时或运行结束的时候通知主线程的Handler，从而进一步处理事件  
我们这次就打算让子线程结束后，通知主线程关闭对话框  
  
大致结构如下：

```
    ProgressDialog progressDialog;    //声明ProgressDialog对象
    Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            ······    //Handler处理事件
        }
    };
    public void showSpinnerProgress() {
        ······    //进度对话框的构建方法
    }
    public void clickProgressSpinnerBtn(View view) {
        showSpinnerProgress()    //构建对话框
        //子线程模拟耗时操作
        new Thread() {
            @Override
            public void run() {
            ······
            }
        }.start();
    }
```
环形和水平的结构是一样的，上面的方法命名采用的是**环形进度对话框**，水平的就是吧**“Spinner”** 改成 **“Horizontal”**，具体可以往下看，这里就只用看个框架就行了  
  
首先在外面声明一个ProgressDialog，因为要在Handler中调用**dismiss()方法**所以不能在方法里声明  
然后是一个Handler对象，采用内部类的方式重写**handleMessage()方法**，这个方法用来对子线程传回的数据进行处理  
为了代码好看，我们把对话框的构建放到一个方法里，这里是**showSpinnerProgress()** ，然后在点击按钮的事件里同时构建对话框和运行子线程。实际上这里**showSpinnerProgress()** 和 **子线程**是同时执行的，不会从上到下按顺序执行（不然怎么叫子线程）  
  
有了框架，我们就可以往里面填写代码了  

##### 1.2.3(1) 环形进度对话框
先来看环形进度对话框，我们在**showSpinnerProgress()** 中构建对话框。因为ProgressDialog已经在外面声明了，这里直接实例化就好了  

```
    public void showSpinnerProgress() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("转圈圈加载");
        progressDialog.setMessage("请稍后...");
        progressDialog.setCancelable(true);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();
    }
```
  
很熟悉吧，我们分别用**setTitle()** 和 **setMessage()** 设置了标题和文字  
然后**setCancelable()** 设为**true**， 这意味着我们点击背景（没有对话框的地方），会直接关闭对话框  
**setProgressStyle()** 是区分环形和水平的方法，传入**ProgressDialog.STYLE_SPINNER**，就是环形啦  
最后调用**show()** 展示对话框  
  
这里一定会有人问，"晓黑——为什么这里不用连点的方法了呀？"  
其实我是想用来着，可惜真的用不了。因为ProgressDialog的setTitle，setMessage等方法返回值都是**void**，也就是返回值不是它对象本身，因此不满足**方法的返回值为其本身**这个条件  
  
构建完了后我们到点击事件里调用对话框的构建方法，再编写子线程，模拟耗时事件  

```
    public void clickProgressSpinnerBtn(View view) {
        showSpinnerProgress();    //构建对话框
        //子线程
        new Thread() {
            @Override
            public void run() {
                for (int i = 0; i < 3; i++) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                handler.sendEmptyMessage(0);
            }
        }.start();
    }
```

在子线程中我们用循环和**Thread.sleep()** 方法，循环3次，每次停1秒（1000毫秒）  
循环结束后调用Handler对象的**sendEmptyMessage()** 方法来向主线程的Handler传递信息，告诉他我的子线程结束啦。因为我们的Handler对象和ProgressDialog一样是在方法外面定义的，所以作用域比较大在子线程中也可以调用。  
**sendEmptyMessage()** 方法的参数就是一个数字标记，标志当前的消息Message来自哪个子线程。现在只有一个子线程看不出个所以然来，所以这点我们在水平进度对话框再作讲解  
  
对话框构建好了，点击按钮后会构建对话框并启动子线程，最后就是Handler对返回消息的处理了  
我们在子线程结束前给主线程的Handler发送了一个消息，希望主线程收到后关闭对话框，于是在Handler的**handleMessage()** 方法中调用ProgressDialog的**dismiss()** 方法即可  

```
    Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            progressDialog.dismiss();
        }
    };
```

最终的效果就是，点击按钮出现转圈圈的进度对话框，三秒后自动关闭  

###### 整体代码
总的代码应该是这样：  

```
    ProgressDialog progressDialog;
    Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            progressDialog.dismiss();
        }
    };
    public void showSpinnerProgress() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("转圈圈加载");
        progressDialog.setMessage("请稍后...");
        progressDialog.setCancelable(true);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.show();
    }
    public void clickProgressSpinnerBtn(View view) {
        showSpinnerProgress();
        //子线程
        new Thread() {
            @Override
            public void run() {
                for (int i = 0; i < 3; i++) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                handler.sendEmptyMessage(0);
            }
        }.start();
    }
```

##### 1.2.3(2) 水平进度对话框
水平进度对话框比起环形的还要多一点，就是对当前进度进行动态显示，要怎么做到呢？  
这里以十秒为例，每过一秒就增加十分之一的进度，总量是十。  
新写一个**showHorizontalProgress()** 方法作为水平进度对话框的构建方法  

```
    public void showHorizontalProgress() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("水平进度条加载");
        progressDialog.setMessage("请稍后...");
        progressDialog.setCancelable(true);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setMax(10);
        progressDialog.show();
    }
```

可以看到我们先把**setProgressStyle()** 的参数改为 **ProgressDialog.STYLE_HORIZONTAL** 了，表示使用水平进度对话框  
然后我们调用**setMax()** 方法设置最大值，默认是100。因为打算每过一秒就增加十分之一的进度，总量是十，也就是十秒后进度条满关闭对话框。所以这里传入10  
其他没怎么变，我们去看子线程要怎么模拟  
  
因为总量是10嘛，每过一秒就加一，所以改成十次循环就好。但是我们想要动态更新进度，每次循环结束后还要额外往主线程传值  

```
    public void clickProgressHorizontalBtn(View view){
        showHorizontalProgress();
        new Thread() {
            @Override
            public void run() {
                for (int i = 1; i <= 10; i++) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Message message = Message.obtain();
                    message.arg1 = i;
                    message.what = 1;
                    handler.sendMessage(message);
                }
            }
        }.start();
    }
```

可以看到，除了循环改成10次外，我们在每次循环结束后还加了个Message对象。他其实就是一个装数据的容器，所以很适合用来传递数据（我们主线程Handler的**handleMessage()** 方法就是接收一个Message对象作为参数）  
Message对象有许多属性，我们这里用一个**arg1**，传入**i** ，告诉主线程我们当前跑到哪了（一共是十）；然后把属性**what** 设置为1，其实只要不是上面环形对话框用的0就行了，我们的主线程以此来区别这个Message来自哪个线程。最后调用**sendMessage()** 将我们的message发送给主线程的Handler  
实际上，之前环形对话框里我们用的是**sendEmptyMessage()** ，顾名思义，是空的Message，就不用我们自己构建了嘛  
  
最后来到Handler的处理方法**handleMessage()** 中，我们根据传来的Message的what值判断消息来自哪个线程  

```
    Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case 0: //来自转圈加载
                    progressDialog.dismiss();
                    break;
                case 1: //来自水平加载
                    progressDialog.setProgress(msg.arg1);
                    break;
                default:
            }
        }
    };
```

如果是0，则是来自环形对话框，他启动三秒后Handler会收到消息，直接关闭对话框即可  
如果是1，则是来自水平对话框，他每次循环都会发来一个消息，我们需要在这里调用**setProgress()** 设置进度条的进度，从而达到每次循环后动态设置进度的效果。传入的值就是之间构建的Message的arg1属性，本质就是循环的次数 i 嘛。这里要注意水平对话框的进度满了后，也就是**arg1的值**和我们之前**setMax()** 设置的值相等后会自动关闭，不用调用**dismiss()** 手动关闭  
  
至此水平进度条搞定，效果就是点击按钮弹出水平进度条，进度动态加载，满了自动关闭  

###### 整体代码
注意水平进度条和环形进度条是共用ProgressDialog和Handler的，所以Handler里的代码是基于环形进度条进行修改的  
而**showHorizontalProgress()** 和 **clickProgressHorizontalBtn()** 则是重新写的  

```
    ProgressDialog progressDialog;

    Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case 0: //来自转圈加载
                    progressDialog.dismiss();
                    break;
                case 1: //来自水平加载
                    progressDialog.setProgress(msg.arg1);
                    break;
                default:
            }
        }
    };

    public void showHorizontalProgress() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("水平进度条加载");
        progressDialog.setMessage("请稍后...");
        progressDialog.setCancelable(true);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setMax(10);
        progressDialog.show();
    }

    public void clickProgressHorizontalBtn(View view){
        showHorizontalProgress();
        new Thread() {
            @Override
            public void run() {
                for (int i = 1; i <= 10; i++) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Message message = Message.obtain();
                    message.arg1 = i;
                    message.what = 1;
                    handler.sendMessage(message);
                }
            }
        }.start();
    }
```

## 2. PopupWindow对话框
差不多讲完了AlertDialog，我们来看看PopupWindow  
之前也提到过，相比于AlertDialog，PopupWindow更为柔和，不抢夺焦点，不阻断主线程  
大致方法如下，和自定义AlertDialog有些类似：

1. 定义xml布局
2. 利用LayoutInflater获取绑定布局的对象
3. 实例化PopupWindow对象
4. 调用showAsDropDown获showAsLocation方法显示窗口
  
由于PopupWindow没有默认的布局，所以在使用前需要有自定义的布局，这里我们就使用上面自定义对话框的布局**layout_customized_dialog.xml**  
有一点需要注意，就是如果再自定义的布局里，如果没有设置背景色，在PopupWindow弹出的对话框也是没有颜色，即透明的，很多情况会影响观感。我这里设置了底部LinearLayout的背景色为白色  

#### 2.1 下拉式对话框
AlertDialog的对话框都是显示在屏幕中间，非要你点完对话框才给你做其他事  
而PopupWindow的下拉式对话框则，是以我们点击的按钮为**锚点**，在按钮下面显示一个小窗口对话框，即使不点这个小窗口，我们也可以做其他事，比如继续观看视频、点击其他按钮等  

```
    public void clickPopupDownBtn(View view) {
        View myView = LayoutInflater.from(this).inflate(R.layout.layout_customized_dialog, null);
        PopupWindow popupWindow = new PopupWindow(myView, 600, 500);
        popupWindow.showAsDropDown(view);
        //按钮的点击事件
        myView.findViewById(R.id.customized_dialog_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(DialogActivity.this, "PopupWindow被关掉了", Toast.LENGTH_SHORT).show();
                popupWindow.dismiss();
            }
        });
    }
```

给View绑定布局的操作没有变，随后我们实例化一个PopupWindow的对象  
在他的构造方法里我们传入三个参数，分别是绑定布局的View、宽、高，单位是像素px  
随后调用**showAsDropDown()** 方法实现下拉式显示，传入的View对象就是我们这个点击事件的view参数，实际上就是我们的按钮控件，用于确定下拉显示的锚点  
因为PopupWindow自带**dismiss()** 方法，在对话框的按钮点击事件里我们可以直接调用来关闭对话框  

#### 2.2 定点式对话框
定点式就是可以自己选择位置，所以和下拉式做一个区分，实际上也就最后的显示方法不同  

```
    public void clickPopupLocationBtn(View view) {
        View myView = LayoutInflater.from(this).inflate(R.layout.layout_customized_dialog, null);
        PopupWindow popupWindow = new PopupWindow(myView, 600, 500);
        popupWindow.showAtLocation(view, Gravity.CENTER, 200, 200);
        //按钮的点击事件
        myView.findViewById(R.id.customized_dialog_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(DialogActivity.this, "PopupWindow被关掉了", Toast.LENGTH_SHORT).show();
                popupWindow.dismiss();
            }
        });
    }
```

定点式用的是**showAtLocation()** 方法，传入四个参数，分别是这个点击事件的view参数、布局方式、偏移量x和y  
view参数不多说；布局方式这里采用**Gravity.CENTER**，说明当前窗口的原点是x=1/2屏幕宽度，y=1/2屏幕高度；偏移量x和y就是在布局方式的基础上再加上此处的x和y的值，从而确定最终的显示位置  
当然布局方式有很多值可以选用，比如“Gravity.NO.GRAVITY”就是屏幕左上角（x=0，y=0）；“Gravity.TOP | Gravity.RIGHT”就是屏幕右上角（x=屏幕宽度，y=0）等  

## 3. Activity作为对话框
新建一个Activity，我们等会让他以对话框的形式弹出  
我新建了**DialogWindowActivity.java**，代码如下：  

```
public class DialogWindowActivity extends Activity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.layout_customized_dialog);

        findViewById(R.id.customized_dialog_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(DialogWindowActivity.this, "Activity的对话框", Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }
}
```

布局我们还是使用之前的**layout_customized_dialog.xml**，注意这里使用了**Window.FEATURE_NO_TITLE**去掉titleBar，不然我们的弹窗就会显得很丑  
下面是弹窗按钮的点击事件，我们用**finish()** 来关闭这个弹窗。实际上是个Activity，所以用到**finish()**  
  
别忘了在**Manifest**中注册这个Activity，同时在其中改变他的theme属性，改为系统自带的Dialog  

```
        <activity android:name=".DialogWindowActivity"
            android:theme="@android:style/Theme.Dialog"/>
```
  
回到DialogActivity，也就是我们的主界面，在按钮的点击事件中我们启动这个对话框  
因为是Activity，所以用到Intent进行跳转  

```
    public void clickActivityAsDialogBtn(View view) {
        Intent intent = new Intent(this, DialogWindowActivity.class);
        startActivity(intent);
    }
```
  
这里Activity弹窗的效果和AlertDialog类似，夺取了焦点，阻断了线程  
不过Activity弹窗的好处就在于他是Activity，我们可以根据Activity的**生命周期**灵活地调用各种方法  


## 后记
累死了累死了累死了呜呜呜  
真的好多内容啊写了好久，整整三天应该有吧（早上在睡觉起不来，所以就下午+晚上吧）  
虽然大体内容都是对话框这个工具的应用，没有什么框架也没什么源码解析  
不过还是有提到一些小知识的，比如建造者模式、匿名对象之类的  
以后用空不偷懒的话...Zzz...  

## 参考
1. [孙老师课堂：对话框](https://www.bilibili.com/video/BV1Px411j7cq?p=2)  
2. [developer：AlertDialog](https://developer.android.com/reference/android/app/AlertDialog)  
3. [Android 对话框AlertDialog和AlertDialog.Builder两者的区别](https://blog.csdn.net/canot/article/details/50526409)  
4. [android 8种对话框（Dialog）使用方法汇总](https://www.cnblogs.com/gzdaijie/p/5222191.html)  
5. [developer：Dialog](https://developer.android.com/reference/android/app/Dialog)  
6. [developer：PopupWindow](https://developer.android.com/reference/android/widget/PopupWindow)  
7. [Android上传项目到Github](https://www.jianshu.com/p/5e48299c1781)  
