# title

## 前言

可以参考[Git基本操作及连接Github](https://blackdn.github.io/2022/03/08/Git-Basic-and-Github-2022/)

## 一个设备配置多个Github用户

其实一般情况下也不会有这个需求，但是因为公司的工作账号和个人账号是两个Github账号，然后为了方便~~摸鱼~~在工作之余折腾一些自己的东西（比如我的Github Page），所以还是想在一台机子上配置两个账户的。

### 生成ssh密钥

很多配置多个账户的文章都提到要大家生成两个ssh密钥，其实这是非必需的。重要的是在本地配置一个`config`配置文件（所以其实可以在配置文件中声明用同一个ssh密钥）但是为了方便起见，这里还是配置了连两个密钥。  
配置密钥的具体步骤可以参见：[配置SSH密钥](https://blackdn.github.io/2022/03/08/Git-Basic-and-Github-2022/#%E9%85%8D%E7%BD%AEssh%E5%AF%86%E9%92%A5)

### 编辑配置文件

配置文件`config`是实现多用户的精髓所在，我们需要在`~/.ssh/`目录下新建一个`config`文件（Windows应该在`/c/Users/you/.ssh/`的目录下），文件包含内容如下：

```
# user1
Host user1.github.com    #纯纯自定义的内容
HostName github.com    #这个不用变，除非是gitLab等其他平台
PreferredAuthentications publickey    #认证方式，我们用ssh公钥
IdentityFile ~/.ssh/id_rsa    #这个对应账号下加入的ssh认证文件
User user1    # 自定义的名字

# user2
Host user2.github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_ed25519
User user2
```

其实需要变的只有`IdentityFile`和`Host`的内容。在`user1`的github账号中我添加的ssh是`id_rsa.pub`，`user2`添加的是`id_ed25519.pub`，所以在`IdentityFile`中就要进行一个区分。

### 尝试连接

然后我们可以测试一下和github的连接。以往我们用的命令是：`ssh -T git@github.com`，但是现在为了告诉github我们连接的是哪个账户，需要对`@`后面的内容进行一个修改，改成我们的自己配置的`Host`：

```shell
~ ssh -T git@user1.github.com
Hi user1! You've successfully authenticated, but...
~ ssh -T git@user2.github.com   
Hi user2! You've successfully authenticated, but...
```

这样一来，基本就能在一台机子上成功区分两个用户了。  
不过还有最后一个坑点

### 连接仓库

最后一个坑点在于，我们克隆项目代码的时候，不能直接输入复制来的ssh命令，同样要把`@`后面的内容进行一个改，以OkHttp为例：

```
# 以user1去clone OkHttp：
git@user1:github.com:square/okhttp.git
# 以user2去clone OkHttp：
git@user2:github.com:square/okhttp.git
```

因为有些仓库设置了权限（private啥的），或者只有Organization里的账户允许提交仓库啥的（比如我的工作账号），所以还是要必要在一开始的时候明确使用的是哪个账号clone的。

此外，

### Git用户配置

### Git Stash的使用？

## 参考

1. [如何在一台电脑上设置多个github账号 | Dr. Xiaotao Shen](https://www.shenxt.info/post/2020-03-11-multi-github-in-one-pc/)

2. [记一次git多用户提交失败的折腾经验](https://blog.csdn.net/kydd2008/article/details/105070325)

3. [Git基本操作及连接Github - WelcomeQwQ](https://blackdn.github.io/2022/03/08/Git-Basic-and-Github-2022/)
