---
layout: post
title: Python爬虫入门：爬取自己的博客文本
subtitle: request和BeautifulSoup库的使用及案例
date: 2023-04-23
author: BlackDn
header-img: img/18mon2_35.jpg
catalog: true
tags:
  - Python
  - Crawler
---

> "细雨下落花点碎，微风里水音飘流。"

# Python 爬虫入门：爬取自己的博客文本

## 前言

虽然更新频率有点低。。。但是我还是要纠正一下：  
逃票的不是**莱莎 3**是**莱莎 1**，**幽灵线东京**有点晕 3D 所以没怎么玩  
主要精力放在**仁王**上，一周目结束，游戏时间突破 100 小时  
魂类游戏真好玩，谢谢你，宫崎英高  
我宣布我现在是**光荣特库摩**单推人！

## 爬虫及其原理

懒得去百科上找爬虫的定义了，自己随便说说  
本质上，爬虫是一个获取网页内容，然后对其进行数据清洗/格式化的过程。由于我们的目标网站有很多的次级链接，次级链接中也有很多的次级次级链接...（比如`小说网站->很多书->一本书->目录页->章节页`），这些链接之间的相互关系如同一张大网（互联网嘛，得互联），而我们就像只小虫子在网上顺着这些链接爬行，所以就叫爬虫。  
比如我们想爬取一篇小说到本地，肯定需要访问每个章节页，当然可以手动去一页页访问复制粘贴下来了，但效率低下，费时费力，因此我们需要代码来帮助我们完成这些工作。而在众多语言中，**Python**凭借其语法简单、编写快速、多方开源等特性脱颖而出，在爬虫界独占一片天地。

## 常用的第三方库

### requests

**requests**是 Python 非常流行的网络请求库，允许我们轻松地构造请求头、请求体，对请求/返回体进行编码/解码  
由于其功能很强大，这里就简单介绍一下 get 请求、post 请求等一些基本用法，更进阶具体的操作还得是根据文档来。  
这里举的例子 🌰 采用[REQRES](https://reqres.in/)提供的接口，url、请求体格式、返回体等均由其定义

```python
import requests
# get请求

getUserRes = requests.get('https://reqres.in/api/users/2')
# 带请求体的get请求

payload = {'page': 2}
getUserWithPara = requests.get('https://reqres.in/api/users', params=payload)
# 带请求体的post请求

payload = {'name': 'blackdn', 'job': 'sleeper'}
postCreateUser = requests.post('https://reqres.in/api/users', data=payload)
# 其他请求

deleteUser = requests.delete('https://reqres.in/api/users/2')
```

发送请求后，如果请求成功，返回体是`requests`的`Response`对象，其主要属性如下：

| 属性/方法          | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| url                | 请求的 url                                                   |
| status_code        | 返回的状态码                                                 |
| ok                 | 布尔值，`status_code < 400`为`true`，否则为`false`           |
| reason             | 状态码对应的原因（比如`200->OK`）                            |
| headers            | 返回体的头部信息                                             |
| request            | 返回请求体                                                   |
| content            | 请求的返回体（字节码 byte 形式）                             |
| text               | 请求的返回体（unicode 形式）                                 |
| encoding           | text 的编码方式                                              |
| cookies            | 返回一个 cookie 数组（没有就是一个空数组）                   |
| json()             | 返回一个返回体的 JSON 对象（如果返回体不是 JSON 格式则报错） |
| raise_for_status() | 当请求错误时，改方法返回`HTTPError`对象（没出错返回`None`）  |

要注意的是，**get 请求**的返回体的`url`属性会自动帮我们拼接`url`和`params`  
`text`和`content`内容虽然差不多，但是前者是 unicode 形式（就是字符串），我们获取页面文本或者链接，后者是字节形式（print 结果前面会加个`b`标识）

```python
print(deleteUser.status_code)
# 204

print(deleteUser.ok)
# True


print(getUserWithPara.status_code)
# 200

print(getUserWithPara.url)
# https://reqres.in/api/users?page=2


print(getUserWithPara.text)
# {"page":2,"per_page":6,"total":12,"total_pages":2,"data":[...

print(getUserWithPara.encoding)
# utf-8

print(getUserWithPara.content)
# b'{"page":2,"per_page":6,"total":12,"total_pages":2,"data":[...
```

### BeautifulSoup

**BeautifulSoup（bs）** 是一个 Python 开源库，用于从 HTML 和 XML 文档中抓取数据或进行格式化，因此通常和 requests 共同使用（requests 返回的结果是带标签的，然后用 bs 把标签去掉）  
bs 目前用分为版本 3 和版本 4，分别对应 Python2 和 Python3，不过随着 Python2 使用的减少，bs3 已经停止维护了。因此官方推荐使用 bs4，它兼容 Python2 和 Python3。

这个库通过 PyPi 发布，因此可以通过  `easy_install`  或  `pip`  来安装  
（注意 PyPi 中有`BeautifulSoup`  和`beautifulsoup4`两个包，分别代表 bs3 和 bs4）

```shell
$ pip install beautifulsoup4
```

bs 的用法就非常简单了，这里引用一下用官方文档的例子，假设我们有一个文档页面（这内容通常由`requests`获取）

```
html_doc = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
"""
```

bs 的核心方法是`BeautifulSoup()`，可以直接接收文档页面。它接收一二三四...很多个参数，包括解析器、编码啥的，但通常我们使用只用传两个就行了：

```python
from bs4 import BeautifulSoup # 为了和bs3（包名BeautifulSoup）区分，bs4的包名直接叫bs4了

doc_soup = BeautifulSoup(html_doc, features='html.parser')
```

第一个参数当然是我们的文档，而第二个参数`features`是告诉 bs 我们处理的是什么文档（xml、html、html5 等），可选值为`lxml`、`lxml-xml`、`html.parser`、`html5lib`。  
当然`features`其实也可以省略，不过 bs 会报一个警告来告诉你没传`features`，并告诉你我用`html.parser`作为默认值  
其他的参数用的比较少，不过在源码中都有注释的，可以自己导个包去看看

当我们 soup 完一个文档后，就可以对其进行后续的处理和操作了，比如：

```python
doc_soup.prettify() # 输出好看点的文档（就是加了缩进和换行）

doc_soup.text # 去掉所有标签之后的内容


doc_soup.find('p') # 输出第一个<p>标签内容（包括标签本身）

# <p class="title"><b>The Dormouse's story</b></p>


doc_soup.find('p').get('class') # 获取某个属性值的内容（因为一个元素可能有多个class所以返回数组）

doc_soup.find(id='link2') # 输出第一个id='link2'的标签内容（包括标签本身）

# <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>


doc_soup.find(name='p', class_='story')
# 输出第一个class为'story'的<p>标签内容（class是python关键字不能用，所以变量名该用class_）

# 输出有点长就不复制了，就是包含三个<a>的那个<p>


doc_soup.find_all('a') # 返回所有标签<a>内容所组成的数组（包括标签本身）

# [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,

# <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,

# <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
```

要注意`find()`和`find_all()`方法都是严格取出开闭标签中间的内容，因此我们看到`doc_soup.find_all('a')`返回结果中不存在原文档第二个`<a>`后面的`and`  
此外，还有简略的方式来获取某个标签的内容（但是用的比较少，看着看着容易晕）：

```python
doc_soup.p # 简化写法，相当于doc_soup.find('p')

# <p class="title"><b>The Dormouse's story</b></p>


doc_soup.title.name # 返回标签的名字

# title

doc_soup.title.string # 返回标签之间的文字

# The Dormouse's story


doc_soup.title.parent.name # 返回标签的上级标签的名字

# head


doc_soup.p['class'] # 相当于doc_soup.find('p').get('class')

# ['title']
```

其他还有很多，但都不用记，反正都是一些对文本处理的操作，要用到的时候再回来对着找就好了。  
比较常见的逻辑是通过`find_all`拿到所有`<a>`标签，再把里面的链接取出来，等待后续访问，从而实现层层递进的操作（这也爬虫名字的由来嘛，顺着链接这条丝一直往里爬）

```python
linkPool = []
for link in doc_soup.find_all('a'):
	linkPool.append(link.get('href'))
print(linkPool)
# ['http://example.com/elsie',

# 'http://example.com/lacie',

# 'http://example.com/tillie']
```

`get_text()`可以去掉标签，返回之间的文字  
它比`doc_soup.title.string`要好用是因为当我们标签中间混着文字和子标签的时候，`get_text()`会帮我们去掉子标签，剩下文字；而`.string`直接找不到，给你返回个`None`

```python
doc_soup.find('p').get_text()
# The Dormouse's story


doc_soup.find('p', class_='story').get_text()
# Once upon a time there were three little sisters; and their names were

#        Elsie,

#        Lacie and

#        Tillie;

#        and they lived at the bottom of a well.

doc_soup.find('p', class_='story').string
# None
```

这里列举一些常用的属性/方法：  
我们将一个开标签和闭标签所包含的内容（包括标签）定义为一个**节点**，比如`find()`成功找到后返回的结果就是一个节点。

| 属性/方法                             | 说明                                                               |
| ------------------------------------- | ------------------------------------------------------------------ |
| contents                              | 返回包含节点的全部子节点的列表                                     |
| descendants                           | 和`contents`，不过其将节点标签包含的字符也看作是一个节点           |
| string                                | 如果节点仅包含一个字节点，输出其文本内容；否则返回`None`           |
| strings                               | 获取全部字节点内容的列表                                           |
| stripped_strings                      | 获取全部字节点内容的列表，忽略空行，去除段首和段末的空格           |
| find()                                | 获取符合条件（tag 名、id、class 等）的第一个节点                   |
| find_all()                            | 获取符合条件（tag 名、id、class 等）的所有节点，返回数组           |
| find_parent()                         | 和`find()`类似，不过查找的是当前节点的第一个父节点                 |
| find_parents()                        | 和`find_all()`类似，不过查找的是当前节点的所有父节点，返回数组     |
| find_next_sibling()                   | 和`find()`类似，查找对象为之后的第一个兄弟（同级）节点             |
| find_next_siblings()                  | 和`find_all()`类似，查找对象为之后的全部兄弟（同级）节点，返回数组 |
| find_previous_sibling()               | 类似，对象为之前的第一个兄弟（同级）节点                           |
| find_previous_siblings()              | 类似，对象为之前的全部兄弟（同级）节点                             |
| find_next() / find_all_next()         | 类似，对象为之后的第一个/全部节点（不分父节点或兄弟节点）          |
| find_previous() / find_all_previous() | 类似，对象为之前的第一个/全部节点（不分父节点或兄弟节点）          |
| clear()                               | 清除节点的文本内容，保留标签                                       |
| extract()                             | 将当前节点移除，并作为方法结果返回                                 |
| get_text()                            | 去掉标签，获取节点文本内容的字符串（包括子标签）                   |
| prettify()                            | 格式化后并以字符串输出（Unicode 编码），每个标签独占一行           |

因为`find_all()`使用的比较多，所以最后来看一下它的参数：`find_all( name , attrs , recursive , string , **kwargs )`。  
其实这几个`find`开头的方法参数基本上都是一样的：

1. `name`：查找标签名为  `name`  的节点
2. `keyword` 参数：查找标签属性满足条件的节点。`find_all(id='link2')`返回所有含有`id='link2'`的节点；`find_all(id=True)`返回所有包含`id`属性的节点
3. `string`： 查找内容包含`string`的节点，如果仅传入该参数，返回值仅为内容，不含标签。可以和上面两个参数组合，实现过滤节点。
4. `limit`：限制返回数量，`find_all(limit=1)`等价于`find()`

## Python 知识点补充

其实我也没系统地学习过 python，自己也是边做边学。但是比起 Java，Python 会更容易上手，因为是弱类型语言，没有那么多条条框框的规则限制。  
不过为了避免用一次查一次的繁琐，在这里就把爬虫编写的过程中，会涉及到的点介绍一下（用的是**Python3**嗷）

### 格式化字符串 f-string

`f-string`是在**PEP 498**提出的新特性，其实就是类似**Javascript**中的反引号，允许我们在字符串中引用变量、进行运算，从而避免一个个字符串加起来的情况。  
虽然没有去考究，但个人感觉`f`代表的就是`format`。用法就是用`f''`声明这是一个格式化字符串，如果要用到变量啥的就用花括号括起来：

```python
name = 'world?'
f_string = f'hello {name}'
# hello world?


name = 'world?'
f_string = f'hello {name.replace("?", "!")}'
# hello world!
```

当然也可以进行数学运算和逻辑判断，用到的时候再自己查吧，多用两遍就会了。~~主要是我没怎么用过所以我也不会~~  
要注意的是，我们知道单引号里识别不了单引号，这在`f-string`同样适用。所以如果需要在其中用到引号，需要改成双引号或进行转义。  
当然，不论是单引号、双引号还是三引号，都可以在前面加个`f`表示这是格式化字符串

### Python 文件读写：open

对于 python 来说，文件的读写可能会比其他语言都来的方便，`open()`方法打开文件，然后用`read()`和`write()`进行读写等操作就好了。  
先来看看`open()`方法，它能够打开并返回对应的文件对象（file object），所需参数和默认值是这样的：`open(file, mode='r', buffering=- 1, encoding=None, errors=None, newline=None, closefd=True, opener=None)` ，虽然有点多，但常用的也没几个，不用太担心。

1. `file`：路径（绝对路径或者相对当前目录的路径）或文件描述符
2. `mode`：文件的读写模式，默认为`r`表示只读。之后会介绍一下常用的模式
3. `buffering`：缓冲策略， 0 表示关闭，1 表示开启，若大于 1 则表示缓冲区大小（字节），用到的不多。
4. `encoding`：读写文件时使用的编码（比如`utf-8`啥的）
5. `errors`：指定如何处理编码和解码错误，用到的不多。
6. `newline`：规定如何换行，可以为`None`、`''`、`'\n'`、 `'\r'`或者  `'\r\n'`
7. `closefd`：一言难尽，不理他。如果`file`参数用的不是路径而是**文件描述符**再去看看这个参数有什么影响。

当我们读写文件的时候，都是直接对内存进行操作，这都是对系统资源的占用。因此当读写操作结束之后，我们都需要调用`close()`来释放我们的文件资源  
但是由于文件读写时可能产生`IOError`（比如`r`模式下文件不存在或`x`模式下文件已存在），这会导致后面的`close()`方法得不到调用，造成内存泄漏。所以为了避免这种情况，我们需要用`try-catch-finally`来实现：

```python
try:
    f = open('test.txt', 'r')
    print(f.read())
finally:
    if f:
        f.close()
```

然而，每次都这么写十分繁琐，因此**Python**引入了`with`语句来帮助我们自动调用`close()`方法，使用`with`后就不需要我们显式调用`close()`了。  
上面的`try-finally`例子用`with`就变成这样：

```python
with open('test.txt', 'r') as f:
    print(f.read())
```

#### 文件对象的读写方法

| 方法         | 描述                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| f.read()     | 当参数为空或为负数时返回全部内容，否则返回指定大小的内容（单位为字符/字节）；若达到文件末尾则返回`''`    |
| f.readline() | 读取单行内容，返回结果末尾保留换行符（`\n`）                                                             |
| f.write()    | 把内容写入文件，并返回写入的字符数。需要自己加换行符且算一个字符数。                                     |
| f.tell()     | 返回一个整数，表示当前文件指针的位置（到文件头的字节数)                                                  |
| f.seek()     | 移动指针位置，第一个参数偏移量可正可负；第二个可选参数表示参考位置，0=文件头（默认）;1=当前位置;2=文件尾 |
| f.close()    | 关闭文件，释放资源                                                                                       |

#### 常用文件的读写模式

| 模式 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| t    | 文本格式（以文本进行读写），**默认格式**                     |
| b    | 二进制格式（以二进制进行读写）                               |
| r    | 以只读方式打开文件，若不存在则报错，**默认读写模式**         |
| x    | 写模式，新建文件，若已存在则报错                             |
| w    | 以只写方式打开文件，若存在则原有内容会被删除，若不存在则创建 |
| a    | 以追加方式打开文件，若存在则在末尾追加，若不存在则创建       |
| +    | 开一个文件进行更新(可读可写)                                 |

读写模式是可以组合使用的，比如`rt`表示打开文件用于读取文本（和`'r'`相同）  
`'+'`模式不能独自使用，`r+`或者`w+`都对文件具有读写权限，区别在于当文件存在时，`r+`会在文件头插入内容，`w+`会删除原有内容；当文件不存在时，`r+`会报错，`w+`会新建文件。

## 小试身手

接下来就是我们手把手来编写爬虫脚本的过程了，实战案例的话...我想想，就先来获取这篇博客的内容好了：[博客优化：文章标题描边 & 动态修改 Tab Title](https://blackdn.github.io/2023/04/02/Blog-Title-Border-Tab-2022.md/)

项目上传到 github 仓库了：[PythonCrawlerForStudy](https://github.com/BlackDn/PythonCrawlerForStudy)，所以在文章里就不展示全部的代码了，可以跟着一步步来实现，或者直接去仓库看整体的代码。

### 获取单个页面内容并保存到本地

热身环节，获取单个页面十分简单，我们通过`requests`获取整个页. ，再用`BeautifulSoup`去掉标签，这不就好了嘛

```python
import requests
from bs4 import BeautifulSoup

if __name__ == '__main__':
    single_chapter_url = 'https://blackdn.github.io/2023/04/02/Blog-Title-Border-Tab-2022.md/'
    response = requests.get(url=single_chapter_url)
    html_content_bs = BeautifulSoup(response.text, features='html.parser')
    text_content = html_content_bs.text
```

这个时候`htmlContentBs`里就是我们带标签的页面内容；而`textContent`就是去掉标签之后，页面所有的文本内容（因为图片是包含在`<img/>`里的，所以会被过滤掉）。不过，如果我们将`textContent`打印一下就会发现，其包含了**用于 Jekyll 解析的文章头配置**、**Tag 和友链**、**底部 copyright**等无意义的内容，那么就尝试把他们去掉。为了减少工作量，我们吧**参考内容**也看作是不需要的东西。  
于是，就开始了对结果的过滤生涯，咱们可以在页面通过浏览器的**Inspect**查看页面结构，也可以通过`prettify()`方法在 IDE 中通过`print`查看。

首先，我们发现文章的正文部分都包括在`<article>`的标签中，而该标签整个页面都只有一个，于是先将其取出：

```python
article_content = htmlContentBs.find(name='article')
```

但是其中还包含了**Tag**、**友链**、**翻页**等不要的内容，需要我们继续过滤。  
好巧不巧，我们又发现这些剩下的不需要的内容都是在**参考**之后的，参考本身也是不需要的，所以我们可以用`extract()`把他们都删掉。  
具体做法是，我们先拿到**参考**的节点，然后通过`find_all_next()`拿到其之后的全部节点（因为他们都是同级的节点），循环调用`extract()`删除；最后让**参考**把自己删了：

```python
reference_node = articleContent.find(id="参考")
for node in reference_node.find_all_next():
	node.extract()
reference_node.extract()
text_content = article_content.text.strip()
```

现在我们的`textContent`打印出来就是我们想要的文章内容了，最后用`strip()`把首尾的空格删了就好。  
最后把文件保存到本地就好啦

```python
with open('./singleChapter.txt', 'w') as file:
	file.write(textContent)
```

运行成功后，在根目录下就会多出一个`singleChapter.txt`文件，里面的内容就是这篇文章的全部内容。  
或者更进一步，我们可以把文章的标题作为文件名。观察页面结构发现第一个`h1`标签包含的就是文章标题，所以：

```python
# ···
articleTitle = articleContent.find(name='h1').string
textContent = articleContent.text.strip()

with open(f'{articleTitle}.txt', 'w') as file:
    file.write(textContent)
```

这样我们就成功获取了一篇文章的有效内容，并成功保存到本地了。

### 获取多个页面内容并保存到本地

当然，如果没有特殊需求，基本不会有人用爬虫只爬取一个页面的内容——有这功夫直接浏览器打开不好嘛。所以我们进一步提高我们的需求，这次打算爬取博客[第一页](https://blackdn.github.io/)的全部文章，每个文章保存一个文件。  
因为我们已经有了爬取并保存一篇文章的代码了，改改就能用，我们先重构一下代码，将其抽成一个方法，将`url`作为参数传入：

```python
if __name__ == '__main__':

    def get_single_chapter_and_save(url):
        single_chapter_url = url
        response = requests.get(url=single_chapter_url)
        html_content_bs = BeautifulSoup(response.text, features='html.parser')

        article_content = html_content_bs.find(name='article')
        reference_node = article_content.find(id="参考")

        for node in reference_node.find_all_next():
            node.extract()
        reference_node.extract()

        article_title = article_content.find(name='h1').string
        text_content = article_content.text.strip()

        with open(f'{article_title}.txt', 'w') as file:
            file.write(text_content)
```

然后回头去观察页面结构，发现`<div class="postlist-container">`里包含了我们想要的文章链接，每个文章都包在`<div class="post-preview">`里。  
所以我们先用`find()`找到`postlist-container`的节点，然后用`find_all()`获取所有文章节点的数组：

```python
if __name__ == '__main__':
	# def get_single_chapter_and_save(url) 省略

	base_url = 'https://blackdn.github.io'
    get_page_response = requests.get(url=base_url)
    page_content_bs = BeautifulSoup(get_page_response.text, features='html.parser')

    chapter_list = page_content_bs.find(class_='postlist-container').find_all(class_='post-preview')
```

进一步观察，我们发现每个`post-preview`中都有一个`<a>`，其中就有我们想要的文章链接，那么最后我们只要循环获取每一个`<a>`中的 url，并执行`get_single_chapter_and_save(url)`就好了。  
不过要注意的是`<a>`中的 url 是相对位置的 url，我们还需要在前面加上`base_url`才能正确访问：

```python
for chapter_node in chapter_list:
    current_url = chapter_node.a['href']
    get_single_chapter_and_save(f'{base_url}{current_url}')
```

### bug 修复

#### 报错： FileNotFoundError: \[Errno 2\] No such file or directory

一看报错信息，感觉有些疑惑，咱们用的是`w`模式，只会写入文件，当文件不存在的时候应该会创建新文件，怎么会报`NotFound`呢？  
实际上，这是因为我们的文件名里存在斜杠，比如这篇文章：[Git 配置多用户 & reset / revert & 合并 Commit](https://blackdn.github.io/2022/10/04/Git-Advance-2022/)  
这个斜杠在我们看来是文件名，而在 python 看来则是文件路径，所以 python 会在根目录寻找名为`Git配置多用户 & reset` 的文件夹，然后寻找名为`revert & 合并Commit`的文件（没有则创建）。  
但是我们当然没有这样的文件夹，python 也不会为我们创建，因此报了`NotFound`的错误。  
解决方法也非常简单，把我们的文件名中的斜杠给替换掉就好了。我这里直接把斜杠去掉了，如果实在想保留斜杠，可以将其换成全角的（中文版）斜杠

```python
with open(f'{article_title.replace("/","")}', 'w') as file:
    file.write(text_content)
```

#### 参考内容可能不存在

其实在最后循环运行的时候报了错，结果发现在爬取单个文章的时候，我们为了获取有效的内容，删去了“参考”及其之后的部分。但是有几篇文章没有参考内容，这就导致我们尝试通过`reference_node = article_content.find(id="参考")`来获取节点的时候报错。  
因此，我们就要换一种方式来删去“参考”（如有）及其之后的内容——至少我们获取的节点是每篇文章都保证存在的。因此，我们选择**下一页/下一页按钮**所在的节点：`<ul class="pager">`

于是，我们可以先把`<ul class="pager">`及其之后的节点删掉，然后额外来判断一下有没有“参考”的内容，有的话就删了，没有的话就啥也不用做。  
最终修改后的`get_single_chapter_and_save()`结果：

```python
def get_single_chapter_and_save(url):
    single_chapter_url = url
    response = requests.get(url=single_chapter_url)
    html_content_bs = BeautifulSoup(response.text, features='html.parser')

    article_content = html_content_bs.find(name='article')

    # remove <ul class="pager"> and following node

    pager_node = article_content.find(class_='pager')
    for node in pager_node.find_all_next():
        node.extract()
    pager_node.extract()

    # remove reference node if exist

    reference_node = article_content.find(name='h2', id='参考')
    if reference_node is not None:
        for node in reference_node.find_all_next():
            node.extract()
        reference_node.extract()

    article_title = article_content.find(name='h1').string
    text_content = article_content.text.strip()

	with open(f'{article_title.replace("/","")}', 'w') as file:
	    file.write(text_content)
```

`main`函数里的内容不用变，再运行一次就不会报错啦，本地根目录下也会多出很多以文章标题命名的`txt`文件，每个文件都是一篇文章。

## 后话

暂时就先到这吧，本来想再写一个案例表示用来获取**每篇文章的参考列表**或者**开头的一句骚话**的，但是想想用到的东西都是重复的，就懒得写了。  
第一次把文章的案例代码放到仓库，所以花了点时间让代码变得好看一点

爬虫本质上就是一个脚本，获取页面然后进行数据清洗/格式化，没什么高深的。其重难点主要就在于我们获取页面内容后的后续操作，是要获取某一块内容呢，还是要统计词频呢，还是要做什么其他的事呢？目的不同就会导致爬虫代码的千变万化，说它大吧也就是`request`加`bs`的组合，说它小吧我们会碰到很多琐碎的细节问题需要处理。

更难受的一点是现在的网站基本上都有反爬虫策略了，有的要求我们使用规定格式的请求头啥的，还有的会对统一 ip 地址的访问次数进行限制，如果短时间内大量访问就会把你的 ip 地址给禁了。  
高级点的方法是使用**ip 池**来进行 ip 的切换，不过可靠的 ip 池服务当然需要充钱了；或者用穷人的方法：用`sleep`来延迟自己的访问。

以后应该会再写个获取图片的爬虫吧。

## 参考

1. [Requests: HTTP for Humans](https://requests.readthedocs.io/en/latest/)
2. [Python requests.Response Object](https://www.w3schools.com/python/ref_requests_response.asp)
3. [Beautiful Soup Documentation](https://beautiful-soup-4.readthedocs.io/en/latest/) / [Beautiful Soup 4.4.0 文档](https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/)
4. [PEP 498 – Literal String Interpolation](https://peps.python.org/pep-0498/)
5. [内置函数：open()](https://docs.python.org/zh-cn/3/library/functions.html?highlight=open#open) / [Methods of File Objects](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects)
6. [python 文件读写,以后就用 with open 语句](https://www.cnblogs.com/ymjyqsx/p/6554817.html)
