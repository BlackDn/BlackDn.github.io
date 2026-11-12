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

[**Gitalk**](https://github.com/gitalk/gitalk/tree/master) 是一款基于 **GitHub Issues** 的轻量级评论系统，广泛应用于静态博客（如 Jekyll、Hexo、Hugo 等）。它通过 GitHub 登录，利用仓库的 Issue 来存储评论内容，无需独立服务器或数据库。   
**Gitalk** 的插件化集成基本能让他做到即开即用，非常方便，而且评论可使用 Markdown 格式、纯前端渲染，与 GitHub 账号绑定还能有效减少垃圾评论。最最重要的是他完全免费，超级香=v=

## 配置并启用 Gitalk

### 新建 Gitalk Container 仓库

既然 **Gitalk** 的原理是把仓库中的 **Issue** 当作评论的数据库，那么我们就需要新建一个仓库作为 **Gitalk Container**   
当然，这个仓库不需要任何代码，不过记得仓库是 `public` 的

然后就没事了，咱们记下这个仓库名，配置的时候会用到。比如我的是 `Gitalk-for-Blog`

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

- `enable`：用于标识是否开启 `Gitalk`
- `clientID`：就是我们上面申请 **OAuth Application** 之后得到的 `Client ID`
- `clientSecret`：就是我们上面申请 **OAuth Application** 之后，生成的 `Client Secret`，相当于密码，别泄露给别人了
- `repo`：之前申请的 **Gitalk Container** 的仓库名，我的是 `Gitalk-for-Blog`
- `owner`：**Gitalk Container** 仓库所有者的 **GitHub** 账号，我这是我自己
- `admin`：**Gitalk Container** 仓库管理员的 **GitHub** 账号，其实就是仓库所有者和合作者（**collaborator**），有修改仓库 **Issue** 的权限，是一个列表
- `distractionFreeMode`：是否启用类似 Facebook 的阴影遮罩，就是输入的时候会给输入框以外的地方加遮罩，要注意 `false` 才是开启

#### Gitalk 可配置属性一览

这里放出所有可配置的属性

| 属性                    | 作用                                                              | 默认值                                              |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| `enable`              | 是否启用 **Gitalk**                                                 | （必填）                                             |
| `clientID`            | **OAuth Application** 的 `Client ID`                             | （必填）                                             |
| `clientSecret`        | **OAuth Application** 的 `Client Secret`                         | （必填）                                             |
| `repo`                | **Gitalk Container** 的仓库名                                       | （必填）                                             |
| `owner`               | **Gitalk Container** 的仓库所有者                                     | （必填）                                             |
| `admin`               | **Gitalk Container** 的仓库管理员                                     | （必填）                                             |
| `id`                  | 页面的唯一标识符（长度小于50）                                                | `location.href`                                  |
| `number`              | 页面的 issue ID 标识，若未定义则会使用`id`定位                                  | -1                                               |
| `labels`              | GitHub issue 的标签                                                | `['Gitalk']`                                     |
| `title`               | GitHub issue 的标题                                                | `document.title`                                 |
| `body`                | GitHub issue 的内容                                                | `location.href + header.meta[description]`       |
| `language`            | 设置语言，支持 `[en, zh-CN, zh-TW, es-ES, fr, ru, de, pl, ko, fa, ja]` | `navigator.language \|\| navigator.userLanguage` |
| `perPage`             | 每次加载的数据大小，最多 100                                                | 10                                               |
| `distractionFreeMode` | 类似Facebook评论框的全屏遮罩效果                                            | `false`                                          |
| `pagerDirection`      | 评论排序方式， `last`为按评论创建时间倒叙，`first`为按创建时间正序                        | `last`                                           |
| `createIssueManually` | 如果当前页面没有相应的 isssue 且登录的用户属于 admin，则会自动创建 issue                  | `false`                                          |
| `proxy`               | GitHub oauth 请求到反向代理，为了支持 CORS                                  | 太长了不想贴                                           |
| `flipMoveOptions`     | 评论列表的动画                                                         | 太长了不想贴                                           |
| `enableHotKey`        | 启用快捷键`(cmd\|ctrl + enter)` 提交评论                                 | `true`                                           |

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


### 配置 GitHub Actions YAML

**GitHub Actions** 是 GitHub 自己的持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和跑pipeline，这里就不过多介绍了。  
在项目仓库的代码中，**GitHub Actions** 使用 **YAML** 语法来定义工作流，每个工作流都作为单独的 **YAML** 文件存储在 `.github/workflows` 目录中。
所以我们新建文件 `.github/workflows/gitalk-issue.yml`：

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
            | awk '$1 == "A" && $2 ~ /^_posts\// {print $2}')

          echo "new_files=$NEW_FILES" >> $GITHUB_ENV

      - name: Create Issues
        if: env.new_files != ''
        env:
          GITALK_TOKEN: ${{ secrets.GITALK_TOKEN }}
          BASE_URL: https://blackdn.github.io
        run: |
          echo "New files: $new_files"

          for file in $new_files
          do
            echo "Processing file: $file"

            filename=$(basename "$file" .md)
            echo "Filename: $filename"

            # Generate Gitalk path and ID
            path="/$filename/"
            id=$(echo -n "$path" | md5sum | awk '{print $1}')

            # Generate absolute URL
            url="${BASE_URL}${path}"

            # Generate issue title and body
            title="$filename"
            body="Comments for [$title]($url)"

            echo "Issue ID: $id"
            echo "Issue URL: $url"
            echo "Issue body: $body"

            # Create GitHub Issue
            payload=$(jq -n \
              --arg title "$title" \
              --arg body "$body" \
              --arg id "$id" \
              '{
                title: $title,
                body: $body,
                labels: ["gitalk", $id]
              }')

            curl --fail-with-body -X POST \
              -H "Authorization: token $GITALK_TOKEN" \
              -H "Accept: application/vnd.github.v3+json" \
              https://api.github.com/repos/BlackDn/Gitalk-for-Blog/issues \
              -d "$payload"
          done

```

一开始写的时候下面跟了个 `gitalk-issue.yml` 的代码审计，不过后面发现有 bug 又修了几版，现在懒得再写审计了，有代码问题直接问 AI 好了😋。

### 触发 GitHub Actions

确保 `.github/workflows/gitalk-issue.yml` 的文件改好后先把这个文件 `push` 到博客仓库。之后每次提交，如果在 `_post/` 中存在新增的文件，就会触发 **GitHub Actions**，最终在 **Issue 仓库** 根据文件名创建一个新的 Issue。   
而在文章页面渲染时，**Gitalk** 根据 `id` 找到对应的 **Issue**，就直接渲染出评论区了，不用再用 admin 账号触发一次初始化。

### 补救措施

如果出现各种原因导致自动创建 Issue 失败，我们还可以手动创建一个 Issue，并为这个 Issue 添加 `Label`：`Gitalk` 和 `“md5加密后的结果”`  
`md5` 加密的明文则是 `/{文章不带路径和后缀的文件名}/`。  
比如提交了一篇文章：`/post/My-New-Post.md/`，加密的明文就是 `/My-New-Post/`。

但是为什么要这么麻烦呢？谁还记得只要用 admin 账号进入文章页面， **Gitalk** 会自动帮我们创建 Issue 这回事🐶

## 参考

1. [Gitalk Doc](https://github.com/gitalk/gitalk/blob/master/readme-cn.md)
2. [GitHub Actions Doc](https://docs.github.com/zh/actions) 
3. [GitHub API Doc](https://docs.github.com/en/rest?apiVersion=2022-11-28)
