## API 和 JSON

### 什么是API

API，（Application Programming Interface，应用编程接口）,它的定义非常多，而且都太官方了让人很难懂，要看的自己去搜哈。我们呢就简单理解为它是一个**函数或方法**（或者**url**的形式），不出意外的话是用于前后端沟通（数据传递）的。  
在**前后端分离**的情况下，通常情况下前端是不需要知道API是如何实现的，只需要知道后端提供API要接受什么参数，返回什么内容，并对返回的内容进行处理就好。比如用户登录，前端得到用户输入的账号密码，并用后端提供的API将账号密码传给后端。而返回的结果可能是登录成功或者失败，而前端就需要根据结果进行进一步操作，比如成功跳转页面，失败弹出提示。  
而后端则是API的缔造者，他们决定自己的API接受什么参数，进行什么操作，返回什么内容。比如我接受账号和密码，需要和数据库中的账号密码进行比对，正确返回什么，错误返回什么之类的，是返回JSON还是字符串呢，什么时候要对数据库进行操作呢等等。

当然一个url也可以是一个API，我们在进行GET请求的时候就是通过url来传参的。而在很多情况下，我们往往要用到**第三方**提供的API，因为内部的原理和代码通常是不会告诉你的，所以我们会说API是**“暴露”**在外的，不知道其内部是怎样实现的。比如[百度翻译API](https://fanyi-api.baidu.com)就提供了多个翻译API，文档翻译、图片翻译、语音翻译等（有的要钱有的免费嗷），使用第三方API的时候记得看人家的文档，他会告诉你要传什么参数、返回什么内容。举个例子，百度翻译的[通用翻译的开发者文档](https://fanyi-api.baidu.com/doc/21)提到，我们的参数需要

1. 翻译内容`q=apple`

2. 原语言`from=en`

3. 目标语言`to=zh`

4. 注册获得的`appid=2015063000000001`；随机码`salt=1435660288`；密钥`key=12345678`

然后需要我们生成自己的签名`sign`，具体方法就是`appid+q+salt+key`得到字符串并进行MD5加密，详细过程可以去人家文档看看。总之最后就是构建url访问人家的API：

```
http://api.fanyi.baidu.com/api/trans/vip/translate?
q=apple&from=en&to=zh&appid=2015063000000001&
salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
```

我们请求成功后，实际上并不知道它内部发生了什么，只知道它返回了一个JSON给我们：

```json
{
    "from": "en",
    "to": "zh",
    "trans_result": [
        {
            "src": "apple",
            "dst": "苹果"
        }
    ]
}
```

接下来要做的事就是从JSON中提取我们想要的内容并展示在界面上了。

### 什么是JSON

JSON，JavaScript Object Notation，是一种轻量级的数据交换格式，功能和XML类似，都是用文本方式保存数据对象。所以他们并非变成语言，而是一种格式。  
在古早时期，人们喜欢用XML来存储对象，但其标签繁琐，格式复杂，偷懒的程序猿们很快就厌倦了这种格式。于是2001年4月，State Software公司的联合创始人Douglas Crockford 和 Chip Morningstar发出了第一条JSON格式的消息（发出消息的程序是JavaScript，也许这就是它叫JSON的原因）

举个例子，我构造一个关于文章对象的JSON：

```json
{
    "id": 1,
    "title": "Web：JavaScript基础",
    "author": {
        "firstName": "Black",
        "lastName": "Dawn"
    },
    "date": "2022-08-16",
    "tags": ["Web", "JavaScript"]
}
```

可以发现，这种形式和JS中的对象不能说十分相像，可以说是一毛一样，基本上就是`{ "attribute" : "value" }`的形式。这也是为啥Web开发中基本都用JSON，甚至都不用类型转换。  
菜鸟的JSON格式转换挺好用的：[JSON格式化工具](https://c.runoob.com/front-end/53/)，可以将JSON字符串以树的形式展现出来，可以拿上面的栗子🌰试试。  

好不容易出现了XML的平替，JSON自然大受欢迎，雅虎和谷歌开始广泛地使用JSON格式，Twitter也表示其对XML格式的支持到2013年结束。  
JSON的主流地位至今仍然延续，不过也不是说XML就不用了。比如Android中的 `manifest` 配置文件就是XML格式。

JSON作为数据传输的格式，有几个显著的优点：

- JSON只支持UTF-8编码，不存在编码问题；
- JSON只支持双引号，特殊字符用`\`转义，格式简单；
- 浏览器内置JSON支持，如果把数据用JSON发送给浏览器，可以直接用JavaScript处理。

当然，不止浏览器，Java也有很多库能直接提供方法进行JavaBean（对应JSON对象的Java对象）和JSON的转换，比如Google提供的`Gson`。若是在**Android Studio**中开发，`javax`包中还有`JSONObject`和`JSONArray`类可以直接用。

因为JSON格式简单，它仅支持以下几种数据类型：

- 键值对：`{"key": value}`
- 数组：`[1, 2, 3]`
- 字符串：`"abc"`
- 数值（整数和浮点数）：`12.34`
- 布尔值：`true`或`false`
- 空值：`null`

## 举个例子

## 参考

1. [MDN: API](https://developer.mozilla.org/zh-CN/docs/Glossary/API)
2. [JSON 的兴起与崛起](https://zhuanlan.zhihu.com/p/54824115)
3. [使用JSON](https://www.liaoxuefeng.com/wiki/1252599548343744/1320418650619938)
4. [JSON格式化工具](https://c.runoob.com/front-end/53/)
