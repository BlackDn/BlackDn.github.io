---
layout:   post
title:    LitePal操作数据库
subtitle:   跟着《第一行代码》学习
date:   2019-07-01
author:   BlackDn
header-img:   img/acg.gy_35.jpg
catalog:    true
tags:
      - Android
---
> "不管怎样，世间情动，不过是盛夏白瓷梅子汤，碎冰碰壁当啷响。"

# 前言
动人七月，没想到能发一篇。考试结束，学的东西好多好多，时间不够XD  
还要三下乡，放月中，我想回家啊  
然后长了智齿，痛的隐隐约约，这两天让小蝶带我去拔掉好了
# LitePal操作数据库
新建LitePalTest项目，学习比SQLiteDatabase更好用的方法  
LitePal是一个开源库，是数据库框架，采用对象关系映射（ORM）模式  
[LitePal的Github主页](https://github.com/LitePalFramework/LitePal)  
### 配置LitePal 
大多数开源项目将版本提交到jcenter上，我们在app/build.gradle中声明开源库引用即可  
在app/build.gradle的dependencies中加入  
```
    implementation 'org.litepal.android:java:3.0.0'
```
然后配置litepal.xml文件  
app/src/main->New->Directory，创建assets目录，再其中新建litepal.xml文件  
GitHub首页中有配置方法，建议跟着创建，下面的代码就是从中复制过来的  

```
<?xml version="1.0" encoding="utf-8"?>
<litepal>
    <!--
    	Define the database name of your application. 
    	By default each database name should be end with .db. 
    	If you didn't name your database end with .db, 
    	LitePal would plus the suffix automatically for you.
    	For example:    
    	<dbname value="demo" />
    -->
    <dbname value="demo" />

    <!--
    	Define the version of your database. Each time you want 
    	to upgrade your database, the version tag would helps.
    	Modify the models you defined in the mapping tag, and just 
    	make the version value plus one, the upgrade of database
    	will be processed automatically without concern.
			For example:    
    	<version value="1" />
    -->
    <version value="1" />

    <!--
    	Define your models in the list with mapping tag, LitePal will
    	create tables for each mapping class. The supported fields
    	defined in models will be mapped into columns.
    	For example:    
    	<list>
    		<mapping class="com.test.model.Reader" />
    		<mapping class="com.test.model.Magazine" />
    	</list>
    -->
    <list>
    </list>
    
    <!--
        Define where the .db file should be. "internal" means the .db file
        will be stored in the database folder of internal storage which no
        one can access. "external" means the .db file will be stored in the
        path to the directory on the primary external storage device where
        the application can place persistent files it owns which everyone
        can access. "internal" will act as default.
        For example:
        <storage value="external" />
    -->
    
</litepal>
```  
*dbname* 标签用于指定数据库名， *version* 标签用于指定版本号， *list* 标签用于指定所有映射模型  
最后配置一下LitePalApplication，修改AndroidManifest.xml  
```
<manifest>
    <application
        android:name="org.litepal.LitePalApplication"
        ...
    >
        ...
    </application>
</manifest>
```  
配置到此就完成了  
### 创建和升级数据库
#### 创建数据库
为了方便测试，将DatabaseTest的布局复制过来（四个按钮）  
对象关系映射（ORM）模式建立了面向对象和面向关系数据库的关系，允许我们用面向对象的思维操作数据库  
比如定义Book表，不用再想象它应该包含哪些列再编写建表语句，而是可以通过类实现。新建Java Class文件Book  

```
    public class Book{
        private  int id;
        private String author;
        private double price;
        private int pages;
        private String name;

        //id
        public int getId(){
            return id;
        }

        public void setId(int id){
            this.id=id;
        }

        //author
        public String getAuthor(){
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        //price
        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        //page
        public int getPages() {
            return pages;
        }

        public void setPages(int pages) {
            this.pages = pages;
        }

        //name
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
```
定义很多字段并生成相应getter，setter方法  
但还需要将其添加到映射模型中，修改litepal.xml  
```
    <list>
        <mapping class="com.example.blackdn.litepaltest.Book"></mapping>
    </list>
```  
*mapping* 标签声明我们要配置的映射模型类，一定要用完整的类名。所有需要映射的模型都在 *list* 标签下配置  
现在只要进行任意一次数据库操作，BookStore.db数据库就会自动创建。修改MainActivity代码  

```
public class MainActivity extends AppCompatActivity {

    Button createDatabase = findViewById(R.id.create_database);
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        createDatabase.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                LitePal.getDatabase();
            }
        });
    }
}
```
然后用adb查看建表语句，发现和数据库相比多了一条 *table_schema* ，是LitePal内部使用。
#### 升级数据库
SQLiteOpenHelper升级数据的时候，需要drop之前所有的表，这样会造成数据丢失，除非你通过复杂的逻辑控制。  
但LitePal中仅进行修改，并将版本号+1即可，LitePal会自动帮我们保留之前表中的数据  
比如我们想加一个 *press出版社 *字段，直接修改Book类  

```
public class Book{
    ···
    private String press;
    ···
    
    //press
    public String getPress() {
        return press;
    }

    public void setPress(String press) {
        this.press = press;
    }
}
```
此外，还想添加一张Category表，只需新建类即可  

```
public class Category {
    private int id;
    private String categoryName;
    private int categoryCode;

    public void setId(int id) {
        this.id = id;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setCategoryCode(int categoryCode) {
        this.categoryCode = categoryCode;
    }
}
```
改完后，将版本号+1即可。由于添加了新的模型（新的表），要在Litepal.xml添加新的一行  
```
    <list>
        <mapping class="com.example.blackdn.litepaltest.Book"></mapping>
        <mapping class="com.example.blackdn.litepaltest.Category"></mapping>
    </list>
```
#### 添加数据
之前的数据库是用ContentValue，将所有数据put到这个value中，最后insert到数据库表中  
而LitePal只需将模型类实例化，设置好数据最后save()即可，不过前提是要继承LitePalSupport类  
```
public class Book extends LitePalSupport {
        ···
}
```
然后在MainActivity中进行添加数据的操作  
```
        //findId
        addData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Book book=new Book();
                book.setName("The Da Vinci Code");
                book.setAuthor("Dan Brown");
                book.setPages(454);
                book.setPrice(16.96);
                book.setPress("Unknow");
                book.save();
            }
        });
```  
首先是我们熟悉的实例化类的对象，然后对这个对象进行一系列操作，都是类的方法，最后调用LitePalSupport类的save()  
#### 更新数据
更新数据稍微复杂，因为有很多API接口，这里只介绍几种常用的  
最简单的一种就是对已储存的对象重新复制最后save()  
对于LitePal，对象是否已储存通过model.isSaved()判断，true表示已储存，false表示未储存。只有两种情况下会返回true：  
1. 已经调用model.save()添加数据
2. model对象通过LitePal查询API查出来

查询API还没学到，因此尝试第一种方法。修改MainActivity  
```
//findId
        updataData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Book book = new Book();
                book.setName("The Lost Symbol");
                book.setAuthor("Dan Brown");
                book.setPages(510);
                book.setPrice(19.95);
                book.setPress("Unknow");
                book.save();
                book.setPrice(10.99);
                book.save();
            }
        });
```
添加数据save后再修改数据再save，由于LitePal发现当前Book对象存在，会更新当前数据而非新增一条数据  
但这种方法只能对已储存对象操作，但有更灵巧的更新方式  
修改MainActivity  
```
//findId
        updataData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Book book = new Book();
                book.setPrice(14.95);
                book.setPress("Anchor");
                book.updateAll("name = ? and author = ?","The Lost Symbol", "Dan Brown");
            }
        });
```  
我们先实例化对象，然后set数据，最后根据条件约束决定要更新的是哪一条数据。  
在java中任何数据类型的字段都有默认值，比如int是0，boolean是false。但不能通过以上方法将数据设置为默认值，但是LitePal提供了setToDefault()方法，传入相应列名即可  
```
Book book = new Book();
book.setToDefault("pages");
book.updateAll();
```
#### 删除数据
有两种删除数据方式，第一种较为简单，对于已存储的对象，都可以通过delete()删除。  
第二种通过调用deleteAll()，第一个参数指定删除的表，后面的参数指定约束条件。如果不指定约束条件，默认删除全部数据  
```
//findId
        deleteData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                LitePal.deleteAll(Book.class,"price < ?","15");
            }
        });
```
#### 查询数据
LitePal查询API的代码十分整洁简单，比如查找全部  
```
List<Book> books = LitePal.findAll(Book.class)
```
想查询Book表，不仅只用指定被查询的表，而且返回的已经是一个list，不用像之前的Cursor一样一行行取值  
```
//findId
        queryData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                List<Book> bookList = LitePal.findAll(Book.class);
                for(Book book : bookList){
                    Log.e("MainActivity","book name is "+ book.getName());
                    Log.e("MainActivity","book author is "+ book.getAuthor());
                    Log.e("MainActivity","book pages is "+ book.getPages());
                    Log.e("MainActivity","book price is "+ book.getPrice());
                    Log.e("MainActivity","book press is "+ book.getPress());
                }
            }
        });
```
当然还有其他的查询方法  

|  方法  |   findFirst   |     finLast     |      select      |    where    |      order       |      limit       |     offset      |
| ----- | ------------- | --------------- | ---------------- | ----------- | ---------------- | ---------------- | --------------- |
| 作用   | 得到第一条数据 | 得到最后一条数据 | 指定查询哪几列数据 | 指定约束条件 | 指定结果的排序方式 | 指定查询结果的数量 | 指定查询的偏移量 |
| 返回值 | 一条数据      | 一条数据        | 一个列表          | 一个列表     | 一个列表          | 一个列表          | 一个列表        |

```
    Book firstBook = LitePal.findFirst(Book.class);    //得到Book表第一条数据
    Book lastBook = LitePal.findLast(Book.class);        //得到Book表的最后一条数据
    List<Book> books = LitePal.select("name","author").find(Book.class);    //查询name和author列的数据
    List<Book> books1 = LitePal.where("pages > ?","400").find(Book.class);    //查询页数大于400的数据
    List<Book> books2 = LitePal.order("price desc").find(Book.class);        //查询结果按书价从高到低排序
    List<Book> books3 = LitePal.limit(3).find(Book.class);        //只查询前三条数据
    List<Book> books4 = LitePal.limit(3).offset(2).find(Book.class);        //查询表中的第3、4、5条数据（往后偏移2个数据开始查询）
```
当然也可以将各种方法组合，完成比较复杂的查询操作  
```
//查询Book表中第11~20条满足页数大于400的name，author，pages这三列数据，并将结果按页数升序排列
List<Book> books = LitePal.select("name","author","pages").where("pages > ?","400").order("pages").limit(10).offset(10).find(Book.class);
```
或者用原生的SQL语言，注意返回的还是一个Cursor对象，需要将数据一一取出  
```
Cursor cursor = LitePal.findBySQL("selece * from Book where pages > ? and price < ?","400","20");
```
