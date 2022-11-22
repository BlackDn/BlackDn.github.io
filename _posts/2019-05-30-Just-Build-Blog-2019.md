---
layout:   post
title:    个人博客的初步建成
subtitle:   上传图片的坑踩得我自闭！
date:     2019-05-30
auther:   BlackDn
header-img:     img/X148_015.jpg  
catalog:    true
tags:
        - Blog
---
# 个人博客后续建设——踩坑的博客的图片上传
个人博客算是搭了七七八八啦~因为我要求不高，所以没有设置评论、流量统计等功能，但是换了几张喜欢的图，重写了About结面，算是很满意啦。  
如果有图片不能显示的，可以换个浏览器。比如我的Microsoft Edge显示不出来的图片，在谷歌浏览器Chorme里就可以显示qwq  
**建议**:作为背景的图片，建议控制在300K以内。其实包括头像在内的所有图片都建议进行压缩，反正就是越小越好。太大的图片会影响页面的加载从而导致图片无法显示。

## 在博客中上传图片

一开始我打算先在之前的博客上把图片成功上传了再接着做其他事的，但是虽然成功把图片传到Github上了，但在博客中还是不能显示，都是图裂。  
在折腾了两天，尝试了各种方法之后，总算有了个可行的方法....  

### 失败的方法——图片上传到Github并引用url

既然都失败了，为什么还要说出来呢？因为还是学到了许多不会的东西，即使是很基础很基础的东西  
##### 创建文件夹并上传图片
先说说在Github里创建文件夹然后上传图片的方法！  
参考：  [如何在GitHub中上传图片](https://blog.csdn.net/Cassie_zkq/article/details/79968598)  
先在目录点击"Create New File"，这个时候创建的还是文件。在文件名后面加个“/”后，这个文件就会成为一个文件夹。但是由于Github不允许空文件夹的存在，所以要在“/”后继续创建文件，随便啥都行，比如我就习惯再创建一个“readme.txt”  
![createnew](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_Blog/createnew.jpg?raw=true)  
![newfolder](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_Blog/newfolder.jpg?raw=true)  
创建完后点击"up load file"就可以把本地的图片上传到Github了  

##### 失败的坑

一开始就是想利用GitHub作为图床，进行图片上传。但是把浏览器上端，GitHub的图片地址(如下)加入markdown中，虽然在预览中可以显示，但是到博客中却显示图裂。  
```
https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_Git/git.jpg
```
经过长达两天的摸索，初步判断是Jekyll的机制导致的。而我摸索出的可行方法是，用url代替网址。  
获取url的方法就是通过开发者模式，也就是在图片页面按F12，然后一直往下找...直到找到这个图片的url。我试了两个平台的  
1. GitHub：上传完图片后点开，F12开始爬，最后复制url，要注意的是前面需要加上“https://github.com/....”
2. 简书：其实CSDN等这些平台都是可以作为图床的。上传带图片的博客后，F12复制url，仍要注意在前面加上“http://....”

![geturl](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_Blog/getUrl.jpg?raw=true)
如果有人用上述方法后，在自己博客中仍不能看见图片，建议换个浏览器试试。比如我用Microsoft Edge仍然不能显示，但是Chorme就可以  
这种用第三方图床的方式虽然可行，但显然不是什么好方法。不说上传麻烦，我难不成每张图还要F12一个个找url吗...这谁顶得住啊.... 
不过以我目前的水平和见识确实没有什么好的解决办法。  
不出意外的话，如果没有擅长Jekyll的大佬救我，也许在不久的将来会放弃Jekyll去尝试hexo吧....

## 成功的方法（之一）

亲亲，这边建议直接用使用图床呢。  
网上搜了一下有直接用github仓库当图床的，配合[PicGo](https://picgo.github.io/PicGo-Doc/zh/guide/)使用更加方便。  
但是Github的不稳定是一个痛点，所以可以使用第三方图床。但是也有缺点啦，比如第三方图床可能会有大小限制要钱啥的。。。

