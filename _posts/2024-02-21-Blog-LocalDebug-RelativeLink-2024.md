---
layout: post
title: 博客优化：本地调试博客站点 & 文章间通过相对路径跳转
subtitle: 终于可以本地调试咯，而且用了相对路径，Obsidian的图也能派上用场啦
date: 2024-02-21
author: BlackDn
header-img: img/21mon1_55.jpg
catalog: true
tags:
  - Blog
  - Jekyll
  - Tutorial
---
> "待到明年又一春，桃花红，梨花白，菜花黄。"

# 博客优化：本地调试博客站点 & 文章间通过相对路径跳转

## 前言

兄弟萌，我愿称之为最有技术含量的一篇博客优化 TAT   
不论是**本地调试**还是**相对链接**都磕磕碰碰，Google都快被我翻烂了  
不过总算是小有成果，总感觉被迫半入门了 **Jekyll** 和 **Liquid** =。=

## 本地调试（on Mac）

说来奇怪，**本地调试**这么重要的东西，应该更早些想到的  
以往对博客的一些修改，我都是改完直接 `push` 到 **github** 上，不仅要等待 github 对站点进行编译后才能生效，要是有一些不易发觉的小错误，又得重新提交，比如写错个日期、标签啥的。   
更别提想测试一些功能或代码了，比如之前给文章标题添加描边、给网站添加搜索功能了，都不知道到底 `push` 又 `revert` 了多少次。   
所以这次干脆一不做二不休，直接实现本地调试，以后就不需要这么多幺蛾子咯。

### 添加本地的 Gemfile

首先，我们知道我们的 **GitHub Pages** 站点是通过 **Jekyll** 生成的，按照正常运行 **Jekyll** 项目的套路，我们只需要先运行 `bundle install` 安装依赖包，然后再 `bundle exec jekyll serve` 启动本地调试即可。  
遗憾的是，不出意外的话我们的 `bundle install` 会报错，提示当前目录没有 `Gemfile` 文件，这个文件就是包含项目所需的依赖，类似 `packages.json` 之于 `npm`。  
由于 **GitHub Pages** 在 GitHub 端编译生成网站，所以它那边自带 `Gemfile` ，不需要我们本地维护，因此我们的博客项目文件里是不包含 `Gemfile` 的。但是我们现在要本地调试，不得不需要这个 `Gemfile`，这就尬住了。  
不过没关系，有个好消息，**GitHub Pages** 的 `Gemfile` 是开源的：[pages-gem](https://github.com/github/pages-gem)！

简单来说，我们没有 `Gemfile` ，就新建一个 `Gemfile` ，然后为我们的 `Gemfile` 添加这一行：

```
gem 'github-pages', group: :jekyll_plugins
```

虽然我们的 `Gemfile` 只有一行，只包含了 `github-pages` 这个包，但是这个包中又有很多其他的依赖包，指定了 `jekyll`、`kramdown`、`liquid`等依赖及其版本，所以我们只用加这一行就行了。

### 安装不同版本的ruby

然后总可以 `bundle install` 了吧，但是不出意外，还是会报错，类似于没有权限啥的：

```
You don't have write permissions for the /Library/Ruby/Gems/2.3.0 directory.
```

原因是 **Mac** 有一个内置的系统**ruby**，为了安全性和稳定性考虑，通常情况下不会允许我们自己对其进行修改，包括为其添加依赖包。  
推荐的操作是安装一个和系统**ruby**不冲突的另一个版本的**ruby**，然后用这个**ruby**进行操作。  
为此我们需要安装这两个工具：`ruby-install` 和 `chruby` 。两者都可通过 `homebrew` 安装  

```
> brew install ruby-install chruby
> brew list | grep 'ruby'
chruby
ruby-install
```

`ruby-install` 用来安装指定版本的**ruby**， `chruby` 方便在各个版本的**ruby**中切换。  

安装成功后我们先运行： `ruby-install ruby`   
这个命令会帮我们安装最新版的**ruby**，我安装的是`3.3.0`。  
然后运行：`chruby` ，可以查看当前可用的**ruby**版本，指定版本就可以进行切换。如果要切换回系统的 **ruby**，运行 `chruby system` 即可。    

```
> chruby           
   ruby-3.3.0
> chruby 3.3.0
> chruby system
```

`chruby` 本质上是修改系统的**PATH**变量，修改指向的 **ruby** 位置。

### 进行本地调试

在调试之前，根据 GitHub 官方文档的：[使用 Jekyll 在本地测试 GitHub Pages 站点](https://docs.github.com/zh/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)，如果安装的 **ruby** 是 `3.0` 及以上，需要额外运行 `bundle add webrick`，在 `Gemfile` 中添加 `webrick` 这个依赖包。因为我是`3.3.0`嘛，所以就加一下。

之后 `bundle install` 和 `bundle exec jekyll serve` 应该就可以正常运行了（可能需要加个 `sudo`）  
不过要注意的是，`bundle install`会根据我们的 `Gemfile` 生成一个 `Gemfile.lock` 文件，我们最好不要上传 `Gemfile` 和 `Gemfile.lock`，因为 GitHub 那边有自己的 `Gemfile` ，免得发生一些不必要的冲突。  
此外，启动本地调试的时候会生成一个 `_site` 文件夹，里面是 **Jekyll** 根据我们`post`目录里的文章生成的文章页面，也不需要上传。  
因此在 `.gitignore` 文件中最好有以下内容：

```
...
# debug file
_site

# Ignore local Gemfile as GitHub Pages has its own Gemfile
Gemfile
Gemfile.*
```

现在运行`bundle install` 和 `bundle exec jekyll serve`：

```
> sudo bundle install    
Bundle complete! 2 Gemfile dependencies, 97 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.  

> sudo bundle exec jekyll serve
Configuration file: /xxx/BlackDn.github.io/_config.yml
            Source: /xxx/BlackDn.github.io
       Destination: /xxx/BlackDn.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
                    done in 2.303 seconds.
 Auto-regeneration: enabled for '/xxx/BlackDn.github.io'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

运行成功后，命令行会保持对站点的监听，在 `Auto-regeneration: enabled` 的前提下，我们的站点会保持**热更新**，对代码文件的修改会实时更新在页面上（可以手动刷新一下，毕竟 **Jekyll** 渲染的是静态页面）   
大功告成！访问 `http://127.0.0.1:4000/` 就可以看到自己的网站啦～  

### 纠正语法错误

我们运行 `bundle exec jekyll serve` 后，命令行可能会抛出一些警告，提示我们有编译错误，可以到对应的文件里看看，是不是有一些**Liquid**语法上的错误。  
比如在 `{% raw %}{% %}{% endraw %}` 中间的变量是不需要再用`{% raw %}{{}}{% endraw %}`包裹的，我的一个错误就是：

```
{% raw %}
{% if tag[1].size > {{site.featured-condition-size}} %}
{% endraw %}
报错，需要改成：
{% raw %}
{% if tag[1].size > site.featured-condition-size %}
{% endraw %}
```

## Markdown链接：文章间以相对路径跳转

这其实是个说大不大，说小不小的点。  
以往的文章中，比如我在文章A中有一个跳到文章B的链接，我都是以绝对路径进行跳转的， `Markdown` 源码是这样：

```
[Angular JS 入门指南](https://blackdn.github.io/2024/02/06/Angular-Intro-Component-2024/)
```

其中的`https://blackdn.github.io/`是 **Jekyll** 的 `baseurl`，后面的内容则是 **Jekyll** 通过解析文件名得到的。  
当然用绝对路径多少有点弊端，比如我以后修改了`baseurl`，或者我不用**GitHub Pages**，换了个平台，或者自己租服务器搭博客网站，那所有绝对路径的内容都得再改。  

另外还有一个想用相对路径的理由，就是我想用上 **Obsidian**（我用的 **Markdown** 编辑器）的 **Graph View** 功能，它会根据文章间的互相引用生成一个可视化的图，但是只有使用**相对路径**才能让**Obsidian** 的 **Graph View** 自动识别并生成图：

![Obsidian Graph](https://s11.ax1x.com/2024/02/21/pFtUbeU.png)

也就是说，我希望能够满足以下两点：
1. 使用相对路径实现文章间的跳转（可以被 **Obsidian** 识别并生成图）
2. **Jekyll** 可以正确渲染链接并在页面跳转

接下来是我从发现问题到解决问题的心路历程，有些绕，有些冗杂，因此也可以直接移步去看最后的[**总结**](#总结)。  

### 当前 Jekyll 解析相对路径带来的问题

有以下三种 **Markdown** 相对路径链接， **Obsidian** 都可以识别并跳转，也可以生成图：  

```markdown
[Jump to XXX](2024-02-06-xxx)
[Jump to XXX](./2024-02-06-xxx)
[Jump to XXX](../2024-02-06-xxx)
```

反观 **Jekyll**，源文件名为 `2024-02-06-xxx.md`的文章，我们将其看成 `{year}-{month}-{day}-{title}` 的格式 ，它会被 **Jekyll** 解析成：`https://blackdn.github.io/2024/02/06/xxx/`  
即 `{baseurl}/{year}/{month}/{day}/{title}` 的格式   

也就是说，目前的 **Jekyll** 会根据年月日依次创建出子目录。虽然子目录的形式看着更舒服，更易读，但同时也阻止我们直接套用上面的相对路径链接。 
举个🌰，我们正在浏览的某篇文章源文件名为 `2022-02-22-Example.md`  ，那么我们当前 `url` 为 `https://blackdn.github.io/2022/02/22/Example/`  ，这个时候点击上面的三行 **Markdown** 跳转后，`url` 分别会变成：

```
源文件：2022-02-22-Example.md
当前url：https://blackdn.github.io/2022/02/22/Example/

点击：[Jump to XXX](2024-02-06-xxx)
或   [Jump to XXX](./2024-02-06-xxx)
跳转到url：
https://blackdn.github.io/2022/02/22/Example-2022/2024-02-06-xxx

点击：[Jump to XXX](../2024-02-06-xxx)
跳转到url：
https://blackdn.github.io/2022/02/22/2024-02-06-xxx

而正确的url：https://blackdn.github.io/2024/02/06/xxx/
```

显然，上面跳转后的`url`都是错误的，都会跳到**404页面**。  
总而言之，相对路径在 **Markdown** 中是可行的，但是被 **Jekyll** 解析成 `url` 后出了错，主要存在着两个问题：
1. 年月日带来的子目录让我们的相对路径不能正确地找到位置，总不能写成 `[Jump to XXX](../../../../xxx)`吧，太抽象了=。=
2. 我们无法将源文件名中的年月日在 **Markdown** 的链接中解析成子目录（就是没法将年月日中间的`-`替换成`/`）

### 配置 Jekyll 的 Permalinks

定位到问题后，似乎就变得简单了些，我干脆就不要年月日的子目录了。   
如果 **Jekyll** 能将 `{year}-{month}-{day}-{title}` 的源文件解析成 `{baseurl}/{year}-{month}-{day}-{title}`，那所有问题就迎刃而解了。   

没有了子目录，所有文章的 `url` 都变成 `{baseurl}/{源文件名}`，那么只要在 **Markdown** 是 `../{其他文件名}` 的形式，就可以跳转到其他文章了：

```
源文件：2022-02-22-Example.md
当前url：https://blackdn.github.io/2022-02-22-Example/
点击：[Jump to XXX](../2024-02-06-xxx)
跳转到url：https://blackdn.github.io/2024-02-06-xxx/
```

合理！  
那么我们要如何修改 **Jekyll** 的解析方式呢？  
简单，来到项目根目录的 `_config.yml` 文件，定位到 `permalink` 属性：

```yml
# in ./_config.yml
...
# Build settings
permalink: pretty
paginate: 10
...
```

这个 `permalink` 规定了 **Jekyll** 要如何将源文件名解析成`url`      
（下面的 `paginate` 属性规定了每页有几篇文章，可以自己改着玩）

####  Permalinks简介

所谓 `permalink` ，其实就是每个文章页面的 `url` 格式，详见官方文档：[Permalinks](https://jekyllrb.com/docs/permalinks/)   
当一篇文章被 **Jekyll** 解析后，会生成以下变量：

| 变量          | 作用                                            | 开始支持的版本 |
| ------------- | ----------------------------------------------- | -------------- |
| `year`        | 源文件名中的年份，如`2024`                      |                |
| `short_year`  | 源文件名中的年份后两位，如`24`                  |                |
| `month`       | 源文件名中的月份，如`02`                        |                |
| `i_month`     | 源文件名中的月份，不含首位0，如`2`              |                |
| `short_month` | 源文件名中的月份简称，如`Jan`                   |                |
| `long_month`  | 源文件名中的月份全称，如`January`               | 4.0            |
| `day`         | 源文件名中的日期，如`03`                        |                |
| `i_day`       | 源文件名中的日期，不含首位0，如`3`              |                |
| `short_day`   | 源文件名中的日期简称，如`Sun`                   | 4.0            |
| `long_day`    | 源文件名中的日期全称，如`Sunday`                | 4.0            |
| `y_day`       | 源文件名中的日期在整年中的天数，范围从`001-366` |                |
| `week`        | 源文件名中的日期在整年中的周数，范围从`01-53`   | 4.0            |
| `w_day`       | 源文件名中的日期在整年中的周数，范围从`1-7`     | 4.0            |
| `hour`        | 文件头中`date`所定义的小时，范围从`00-23`       |                |
| `minute`      | 文件头中`date`所定义的分钟，范围从`00-59`       |                |
| `second`      | 文件头中`date`所定义的秒，范围从`00-59`         |                |
| `title`       | 源文件名中的标题                                                |                |
| `slug`        | 也是源文件名中的标题，和`title`不同的是，数字和字母外的字符会被取代为连字符`-`                                                |                |
| `categories`  | 文件头中定义的类型，如果有多个则依次创建目录，如`/category1/category2`                                                |                |
| `slugified_categories`              | 也是文件头中定义的类型，数字和字母外的字符会被取代为连字符`-`                                                | 4.1               |
| `output_ext`  | 源文件扩展名，如`.md`，不怎么用到               |                |

有了这些变量后，我们可以自由组合，来自定义文章的`url`。要注意的是，变量前面要加上冒号作为前缀，比如：

```
permalink: /:year_:month_:day_:title
源文件名：2022-02-22-Example.md
url：https://blackdn.github.io/2022_02_22_Example

permalink: /:short_year/:i_month/:i_day/:title:output_ext
源文件名：2022-02-03-Example.md
url：https://blackdn.github.io/22/2/3/Example.md
```

此外，**Jekyll** 提供了一些内置的模板

| 名称       | 模板内容                                                 | 开始支持的版本 |
| ---------- | -------------------------------------------------------- | -------------- |
| `date`     | `/:categories/:year/:month/:day/:title:output_ext`       |                |
| `pretty`   | `/:categories/:year/:month/:day/:title/`                 |                |
| `ordinal`  | `/:categories/:year/:y_day/:title:output_ext`            |                |
| `weekdate` | `/:categories/:year/W:week/:short_day/:title:output_ext` | 4.0               |
| `none`           | `/:categories/:title:output_ext`                                                         |                |

如果我们没有指定 `permalink`，那么 **Jekyll** 默认将使用`permalink: date`   
`weekdate`中的`W`是作为`:week`的前缀，没啥特殊意义。  

#### 配置Permalink

回到我们的 `_config.yml` 文件，看到我们当前是 `permalink: pretty`   
而我们现在需要得到 `{baseurl}/{year}-{month}-{day}-{title}` 的`url`，所以只需要修改成：

```
permalink: /:year-:month-:day-:title/
```

如果正在本地调试，修改了 `_config.yml` 配置文件，需要重启一下服务器，重新运行`bundle exec jekyll serve`

最后只用保证以后在写 **Markdown** 的时候，先返回上级目录，再跳转到对应文章的相对路径的形式即可：`[Jump to XXX](../2022-02-03-XXX)`  
这下子，我们的相对路径的文章链接，在 **Jekyll** 和 **Obsidian** 中都可以生效啦，而且**Obsidian** 中的图也可以正确生成咯～ 最终的结果就是上面那个图啦

#### 小注意

由于我们的 `permalink` 中没有加上 `output_ext`，因此解析后的 `url` 不会带有文件名后缀，所以在 **Markdown** 的链接中也不需要加上后缀。

在 **Obsidian** 中，我们也是可以通过点击 **Markdown** 的链接跳转到对应文章的，不过这要求我们的链接末尾不能有斜杠 `/`，否则 **Obsidian** 会认为这是一个文件夹而非文件，导致跳转失败。  
而 **Jekyll** 解析后的 `url` 末尾会补一个斜杠，这里需要注意，复制 `url` 之后记得要把斜杠删掉。

```
文件名：2022-02-03-XXX.md
Markdown链接：[Jump to XXX](../2022-02-03-XXX)
点击跳转后的URL：https://blackdn.github.io/2022-02-03-XXX/
```


### 通过文章锚点跳转

#### 锚点简介

在 `url` 中，井号 `#` 作为定位符，因此我们可以在 `url` 的尾部通过 `#xxx` 来快速定位到页面的某个位置，这种定位称之为**HTML锚点**。  
而 **Jekyll** 帮我们生成页面的时候，将 **Markdown** 的每个标题都作为锚点。当我们的鼠标放在标题上，旁边会出现一个链接符号，点击链接符号就会定位到这个标题的位置。  
同理，如果我们在其他页面点击带有锚点的链接，会直接定位到锚点位置，而不是文章开头。

![Anchor](https://s11.ax1x.com/2024/02/21/pFtowkQ.png)

#### url编码 和 尾部斜杠

或许对某些人来说，`url` 中出现中文是一件很难受的事情，因此实际上我们可以对锚点内容进行**url编码**，空格会自然而然被编码成`%20`，所以不用管他。  
但是如果懒得编码，我们也可以保留原本内容，如上图所示，但是要注意以下两点：

1. 英文字母全小写
2. 空格用连接符`-`代替

（可能某些冷门的或者版本较低的浏览器不支持中文，但我就不考虑这么多了，反正我试了 **Google** 和 **Safari** 都是可以的）

此外，虽然上面的 `url` 中，锚点与前面的内容之间有一个斜杠`/` （`...-xxx/#angular-js-简介`），但我们在 **Markdown** 中需要把这个斜杠去掉，原因和上面类似， **Obsidian** 会认为这是一个文件夹而非文件，导致跳转失败。  

不过要注意一点，如果**标题中间含有空格**，比如这个`...-xxx/#angular-js-简介`的标题 **Angular JS 简介**，它在网页上可以成功定位锚点，在 **Obsidian** 中则会失败。     
不过没事，锚点的失败不妨碍 **Obsidian** 跳转到对应文章以及图的生成，只能说咱的 **Obsidian** 还有待加强🐶

#### 标签页的锚点跳转

啥意思呢，就是我们的[标签页（https://blackdn.github.io/tags/）](https://blackdn.github.io/tags/)，里面可以点击对应标签进行跳转，实际上也是通过锚点实现的。  

![Tags Anchor](https://s11.ax1x.com/2024/02/21/pFtHrpd.png)

如果某些时候我们想从文章中跳转到这标签页的某个锚点，又不想在 **Obsidian** 的图中生成这个标签的点，可以像这样写 **Markdown** 的链接：

```
[Web]({% raw %}{{ site.baseurl }}{% endraw %}/tags#Web)
```

可以点击试一下：[跳转到Web标签]({{ site.baseurl }}/tags#Web)  

`{% raw %}{{ site.baseurl }}{% endraw %}` 是 **Jekyll** 提供的语法，`site.baseurl` 是其配置的变量，在这里是 `blackdn.github.io`。其他规则（编码啊啥的）都和上面一样  
总之，这样既可以跳转到对应标签位置，又不会让这个标签页的锚点出现在 **Obsidian** 的图中

### 总结

总的来说，为了实现 **Jekyll** 生成的 **GitHub Pages** 和 **Obsidian** 都可以通过相对路径实现文章间的跳转，需要经过以下几个步骤和约束：

1. 在 `_config.yml` 文件中，修改项目的配置：`permalink: /:year-:month-:day-:title/`
2. **Markdown** 链接中，先回到上级目录，采用` ../2022-02-03-XXX` 的形式（使得在网站中能够跳转）
3. **Markdown** 链接中，文件名尾部不需要斜杠（使得在 **Obsidian** 中能够跳转，能生成图）
4. 若使用锚点，**Markdown** 链接中的锚点与文件名之间不需要斜杠（使得在 **Obsidian** 中能够跳转）
5. 若使用锚点，**Markdown** 链接中的锚点内容用不用编码都可以。若不进行编码，则英文字母需要全小写，空格需要用连接符`-`代替
6. 如果想从文章中跳转到标签页，**Markdown** 链接中需要按照 `[Web]({% raw %}{{ site.baseurl }}{% endraw %}/tags#Web)` 的形式

## 参考

1. [GitHub文档：使用 Jekyll 在本地测试 GitHub Pages 站点](https://docs.github.com/zh/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)  
2. [GitHub：pages-gem](https://github.com/github/pages-gem)
3. [You don't have write permissions for the /Library/Ruby/Gems/2.3.0 directory. (mac user)](https://stackoverflow.com/questions/51126403/you-dont-have-write-permissions-for-the-library-ruby-gems-2-3-0-directory-ma)
4. [Jekyll官网：Permalinks](https://jekyllrb.com/docs/permalinks/)  
5. 感谢ChatGPT