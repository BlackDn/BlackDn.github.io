---
layout: post
title: 博客优化：添加 Gitalk 评论
subtitle: 以及通过 Github Actions 实现 Gitalk 自动初始化
date: 2025-09-05
author: BlackDn
header-img: img/21mon1_06.jpg
catalog: true
tags:
  - Blog
  - Jekyll
  - Tutorial
  - Gitalk
---
> "雨霖霖，声漫漫，柳依依，荷圆圆。
> 山青青，路迢迢，念去去，思悠悠。"

# 博客优化：添加 Gitalk 评论
## 前言

很多东西想写但是都没动笔，不想学习想玩游戏。   
最后还是先搞了这个 Gitalk 评论   
比起学习还是做博客的优化更有动力。   
好想回家玩丝之歌啊～  

## Gitalk简介

**Gitalk** 是一款基于 **GitHub Issues** 的轻量级评论系统，广泛应用于静态博客（如 Jekyll、Hexo、Hugo 等）。它通过 GitHub 登录，利用仓库的 Issue 来存储评论内容，无需独立服务器或数据库。   

**Gitalk** 的插件化集成基本能让他做到即开即用，非常方便，而且评论可使用 Markdown 格式、纯前端渲染，与 GitHub 账号绑定还能有效减少垃圾评论。最最重要的是他完全免费，超级香=v=

## 配置并启用 Gitalk

### 新建 Gitalk Container 仓库

既然 **Gitalk** 的原理是把仓库中的 **Issue** 当作评论的数据库，那么我们就需要新建一个仓库作为 **Gitalk Container**   
当然，这个仓库不需要任何代码，不过记得仓库是 `public` 的

然后就没事了，咱们记下这个仓库名，配置的时候会用到。

### 申请 OAuth Application

登陆Github，在 `Settings -> Developer Settings -> OAuth Apps` 中注册一个新的 Application，其中 `Homepage URL` 填写主页域名，`Authorization callback URL` 填写使用 **Gitalk** 插件页面的域名。   
以我这个网站为例，主页是 `https://blackdn.github.io/`，由于我想在所有文章页面使用 Gitalk（所有文章都是主页的子域名），因此我的`Homepage URL` 和 `Authorization callback URL` 都是`https://blackdn.github.io/`。

![RegisterOAuthApplication](https://s21.ax1x.com/2025/09/02/pVgmQCn.png)



接下来我们就需要修改我们的 **Jekyll** 代码，进行一些配置，启用 Gitalk 插件。
### 配置 Gitalk 参数

由于除了文章页面外，我们在其他地方也可能用到评论（比如 `about` 页面），所以我选择在 `_config.yml` 配置一些全局变量，方便之后调用   
在 `_config.yml` 中：

```yml
# Gitalk
gitalk:
  enable: true #是否开启Gitalk评论
  clientID: xxx #生成的clientID
  clientSecret: xxx #生成的clientSecret
  repo: Gitalk-for-Blog #刚新建的仓库名称
  owner: BlackDn #仓库的 github owner
  admin: [BlackDn] #仓库所有者和合作者
  distractionFreeMode: false #是否启用类似 Facebook 的阴影遮罩
```

这里配置的参数是比较常见的，稍微解释一下：

- `enable`：emm，标识是否开启 `Gitalk`
- `clientID`：就是我们上面申请 **OAuth Application** 之后得到的 `Client ID`
- `clientSecret`：就是我们上面申请 **OAuth Application** 之后，生成的 `Client Secret`，相当于密码，别泄露给别人了
- `repo`：之前申请的 **Gitalk Container** 的仓库名，我的是 `Gitalk-for-Blog`
- `owner`：**Gitalk Container** 仓库所有者的 **GitHub** 账号，我这是我自己
- `admin`：**Gitalk Container** 仓库管理员的 **GitHub** 账号，其实就是仓库所有者和合作者（**collaborator**），有修改仓库 **Issue** 的权限，是一个列表
- `distractionFreeMode`：是否启用类似 Facebook 的阴影遮罩，就是输入的时候会给输入框以外的地方加遮罩，要注意 `false` 才是开启

#### Gitalk 可配置属性一览

这里放出所有可配置的属性

| 属性                    | 作用                                                              | 默认值                                              |     |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------ | --- |
| `enable`              | 是否启用 **Gitalk**                                                 | （必填）                                             |     |
| `clientID`            | **OAuth Application** 的 `Client ID`                             | （必填）                                             |     |
| `clientSecret`        | **OAuth Application** 的 `Client Secret`                         | （必填）                                             |     |
| `repo`                | **Gitalk Container** 的仓库名                                       | （必填）                                             |     |
| `owner`               | **Gitalk Container** 的仓库所有者                                     | （必填）                                             |     |
| `admin`               | **Gitalk Container** 的仓库管理员                                     | （必填）                                             |     |
| `id`                  | 页面的唯一标识符（长度小于50）                                                | `location.href`                                  |     |
| `number`              | 页面的 issue ID 标识，若未定义则会使用`id`定位                                  | -1                                               |     |
| `labels`              | GitHub issue 的标签                                                | `['Gitalk']`                                     |     |
| `title`               | GitHub issue 的标题                                                | `document.title`                                 |     |
| `body`                | GitHub issue 的内容                                                | `location.href + header.meta[description]`       |     |
| `language`            | 设置语言，支持 `[en, zh-CN, zh-TW, es-ES, fr, ru, de, pl, ko, fa, ja]` | `navigator.language \|\| navigator.userLanguage` |     |
| `perPage`             | 每次加载的数据大小，最多 100                                                | 10                                               |     |
| `distractionFreeMode` | 类似Facebook评论框的全屏遮罩效果                                            | `false`                                          |     |
| `pagerDirection`      | 评论排序方式， `last`为按评论创建时间倒叙，`first`为按创建时间正序                        | `last`                                           |     |
| `createIssueManually` | 如果当前页面没有相应的 isssue 且登录的用户属于 admin，则会自动创建 issue                  | `false`                                          |     |
| `proxy`               | GitHub oauth 请求到反向代理，为了支持 CORS                                  | 太长了不想贴                                           |     |
| `flipMoveOptions`     | 评论列表的动画                                                         | 太长了不想贴                                           |     |
| `enableHotKey`        | 启用快捷键`(cmd\|ctrl + enter)` 提交评论                                 | `true`                                           |     |


### 嵌入 JS 代码启用 Gitalk

#### 在文章中启用 Gitalk

我们的每一个文章页面都是通过 `post` 模板来实现的，因此只用在模板中添加 `gitalk` 的模板，页面会在渲染的时候一起生成 `gitalk` 的内容。  
在 `post.html` 中：

```html
	{% if site.gitalk.enable %}
	<!-- 引入Gitalk评论插件  -->
	<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css" />
	<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
	<div id="gitalk-container"></div>
	<!-- 引入一个生成md5的js，用于对id值进行处理，防止其过长 -->
	<script src="{{ site.baseurl }}/js/md5.min.js"></script>
	<script type="text/javascript">
	  var gitalk = new Gitalk({
		clientID: "{{site.gitalk.clientID}}",
		clientSecret: "{{site.gitalk.clientSecret}}",
		repo: "{{site.gitalk.repo}}",
		owner: "{{site.gitalk.owner}}",
		admin: ["{{site.gitalk.admin}}"],
		distractionFreeMode: "{{site.gitalk.distractionFreeMode}}",
		id: md5(location.pathname),
	  });
	  gitalk.render("gitalk-container");
	</script>
	{% endif %}
```

#### 在 About 页面启用 Gitalk

`about` 页面是单独的一个静态页面，所以我们这里额外给他配置一下。在 `about.html` 中：

```html
{% if site.gitalk.enable %}
<!-- Gitalk link  -->
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css" />
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>

<div id="gitalk-container"></div>
<script type="text/javascript">
  var gitalk = new Gitalk({
    clientID: "{{site.gitalk.clientID}}",
    clientSecret: "{{site.gitalk.clientSecret}}",
    repo: "{{site.gitalk.repo}}",
    owner: "{{site.gitalk.owner}}",
    admin: "{{site.gitalk.admin}}",
    distractionFreeMode: "{{site.gitalk.distractionFreeMode}}",
    id: "about",
  });
  gitalk.render("gitalk-container");
</script>
{% endif %}
```

### Gitalk 实现流程及效果

**Gitalk** 本质上是将评论内容存在Issue中，当我们进入页面时读取并展示。  
因此如果想要看见评论，就需要有网络连接；如果想要进行评论，则需要登陆 GitHub 账号（因为本质是在 Issue 中进行内容发布）。

在上面的配置中，我们将每篇文章的文件名经过 `md5` 加密后作为 **Gitalk** 的 `id` （`id: md5(location.pathname)`），这个 `id` 在 **Issue** 中会通过 `label` 的形势展示。同时实现文章和 **Issue** 的一对一映射。      
之所以使用 `md5` 加密，主要是为了防止文件名太长导致 `id` 超长，**Gitalk** 要求 `id` 最长不超过50个字符。通过 `md5` 进行转换后，再长的文件名都会被转化成32位。

![FileNameToID](https://s21.ax1x.com/2025/09/02/pVgmuNj.png)



最终的效果就会像是这样，每次进入页面时，**Gitalk** 会拉取对应 **Issue** 中的内容来渲染生成评论界面

![CommentsAndIssue](https://s21.ax1x.com/2025/09/02/pVgmK4s.png)

### 手动初始化的缺陷

要说 **Gitalk** 一个比较明显的缺陷，就是每次发布完新文章，需要 admin 手动进入文章页面，以此触发 **Gitalk** 创建对应的 **Issue**，完成评论的初始化。   
如果 admin 不进行初始化，那么其他用户是无法进行评论的。

![NoInit](https://s21.ax1x.com/2025/09/02/pVgmnEQ.png)


## 通过 GitHub Actions 实现自动初始化

为了解决每次都需要自己手动初始化的缺陷，我决定利用 **GitHub Actions** 实现自动初始化。  
每次我们 `push` 时，如果是一篇新增的文章，那么我们就新建一个对应的 **Issue**。

### 生成 Access Token

因为之前我们配置 **Gitalk** 的时候，创建了一个新的仓库用于生成 **Issue**。于是我们需要每次 `push` 新文章之后，在这个新的仓库生成文章对应的 **Issue**，这就需要对应的读写权限。  

进入 `GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token` ，下面的权限配置 `Permissions` 要勾选 `Issues → Read and write`；至于 **Token** 的过期时间我设置了永不过期，偷个懒。

![AccessToken](https://s21.ax1x.com/2025/09/02/pVgmh8I.png)

生成后，复制 **Token** 的值，我们进行下一步配置。

### 添加 Token 至博客仓库 Secrets

进入博客仓库（注意不是 Issue 仓库），进入 `Settings → Secrets and variables → Actions → New repository secret`  
给这个 **Secret** 起一个名字，后面会用到，以我为例我起名 `GITALK_TOKEN`；`Value` 部分就把上面生成的 **Token** 值粘上。


![AddSecret](https://s21.ax1x.com/2025/09/02/pVgm5xP.png)


### 配置 GitHub Actions YMAL

**GitHub Actions** 是 GitHub 自己的持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和跑pipeline，这里就不过多介绍了。  
在项目仓库的代码中，**GitHub Actions** 使用 **YAML** 语法来定义工作流，每个工作流都作为单独的 **YAML** 文件存储在 `.github/workflows` 目录中。
所以我们新建文件：`.github/workflows/gitalk-issue.yml`：

```yaml
name: Auto Create Gitalk Issues

on: 
  push:
    paths:
      - "_posts/**"

jobs:
  create-issues:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Get new posts
        run: |
          git fetch origin ${{ github.event.before }}
          NEW_FILES=$(git diff --name-status ${{ github.event.before }} ${{ github.sha }} \
          | grep "^A" \
          | awk '{print $2}' \
          | grep "^_posts/" || true)
          echo "new_files=$NEW_FILES" >> $GITHUB_ENV
      
      - name: Create Issues
        if: env.new_files != ''
        run: | 
          for file in $new_files
          do
            filename=$(basename "$file" .md)
            path="/$filename/"
            id=$(echo -n "$path" | md5sum | awk '{print $1}')
            title="$filename"
            body="Comments for [$title]($path)"

            curl -X POST \
		        -H "Authorization: token ${{ secrets.GITALK_TOKEN }}" \
		        -H "Accept: application/vnd.github.v3+json" \
	            https://api.github.com/repos/BlackDn/Gitalk-for-Blog/issues \
	            -d "{\"title\":\"$title\",\"body\":\"$body\",\"labels\":[\"gitalk\",\"$id\"]}"
	      done
```

### YAML 文件内容解析

#### name: Auto Create Gitalk Issues

这里就是自定义的 **Actions** 名字，没啥大作用

#### on: 触发时机

``` yaml
on: 
  push:
    paths:
      - "_posts/**"
```

`on` 部分内容用来决定该工作流什么时候被触发，我们这里表示 `_posts` 目录下有文件被 `push` 的时候触发

#### jobs: 执行的任务

`jobs` 规定了工作流被触发时要执行的任务，这里我们规定了三个任务

##### - name: Checkout code

第一个任务 `- name: Checkout code` 十分常见，算是公式任务了，他的作用是将当前触发 **GitHub Actions** 的仓库代码检出到虚拟机（runner）上，方便后续任务访问文件。  
##### - name: Get new posts

第二个任务 `- name: Get new posts` 用来筛选出新增的文章。

通过 `git fetch origin ${{ github.event.before }}` 拉取上一个 **git** 提交记录，以便后续 `git diff` 能成功执行。  

``` bash
NEW_FILES=$(git diff --name-status ${{ github.event.before }} ${{ github.sha }} \
  | grep "^A" \
  | awk '{print $2}' \
  | grep "^_posts/" || true)
```

这里先通过 `git diff` 比较上一次提交（`github.event.before`）和当前提交（`github.sha`）的变化，类似输出的结果如下：

```mathematica
A    _posts/2025-09-04-Test.md
A    _img/icon.jpg
M    _posts/2025-09-03-Old.md
D    _posts/2025-09-02-Delete.md
```

前面的字母表示操作类型，比如 **A** 表示`add`，新增文；，**M** 表示 `modified`，修改文件；**D** 表示 `delete`，删除文件等。     
我们需要判断是否有新增的文章，即 `_posts` 目录下是否有新增的文件，就有了后续的一系列操作，然后把结果（新增的文章文件名）保存到 `NEW_FILES` 变量中。  
最后通过 `echo "new_files=$NEW_FILES" >> $GITHUB_ENV` 把结果保存到 **GitHub Actions** 的环境变量中，方便后续任务调用。

##### - name: Create Issues

这个任务主要就是为新增的文章创建对应的 **Issue** 了。  
因为上面我们把结果存在了环境变量的 `new_files` 中，这里正好用上。`if: env.new_files != ''` 是对该任务是否执行的一个前置判断，如果没有新增文章，就不需要创建 **Issue** 了；即如果 `env.new_files` 为空，就不需要执行当前任务了。

然后进入一个 `for` 循环，遍历 `new_files` 变量中的每个新增文章文件路径，类似 `_posts/2025-09-04-Test.md`；  
先去掉路径和文件后缀，获得文件名（`filename=$(basename "$file" .md)`），然后加上前后的斜杠（`path="/$filename/"`），最后的结果就类似 `/2025-09-04-Test/`。   
这里之所以要加上前后两个斜杠，是为了和 **Jekyll permalink** 匹配，即博客站点中的 `location.pathname`。只有保持原文一致，才能保证 `md5` 的转换结果一致，才能给生成的 **Issue** 形成正确的一对一映射。

我们将文件名作为 **Issue** 标题（`title="$filename"`），一个指向文章的链接作为 **Issue** 的第一条内容（`body="Comments for [$title]($path)"`）。    
最后通过 **GitHub API** 发送一条创建 **Issue** 的请求。请求头中的 `Authorization` 就是我们之前 在 `Repository Secret` 中添加的，这里通过 `secrets.GITALK_TOKEN` 调用。   
`https://api.github.com/repos/BlackDn/Gitalk-for-Blog/issues` 是 `GitHub API` 定义的 `url`，把 **GitHub账号名** 和 **Issue 仓库名** 替换一下就行： `https://api.github.com/repos/<GitHub Name>/<Issue Repo Name>/issues`  
`-d "{\"title\":\"$title\",\"body\":\"$body\",\"labels\":[\"gitalk\",\"$id\"]}` 中我们传入具体的数据作为请求体，都是上面定义好的变量，比较好理解。  

### 触发 GitHub Actions

确保 `.github/workflows/gitalk-issue.yml` 的文件改好后先把这个文件 `push` 到博客仓库。之后每次提交，如果在 `_post/` 中存在新增的文件，就会触发 **GitHub Actions**，最终在 **Issue 仓库** 根据文件名创建一个新的 Issue。   
而在文章页面渲染时，**Gitalk** 根据 `id` 找到对应的 **Issue**，就直接渲染出评论区了，不用再用 admin 账号触发一次初始化。


## 参考

1. [Gitalk Doc](https://github.com/gitalk/gitalk/blob/master/readme-cn.md)
2. [GitHub Actions Doc](https://docs.github.com/zh/actions) 
3. [GitHub API Doc](https://docs.github.com/en/rest?apiVersion=2022-11-28)
