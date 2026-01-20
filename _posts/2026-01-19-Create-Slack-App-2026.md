---
layout: post
title: Slack App 的创建和连接
subtitle: Http 和 Socket 两种连接方式
date: 2026-01-19
author: BlackDn
header-img: img/21mon1_04.jpg
catalog: true
tags:
  - Tutorial
---
> "且行且忘且随风，且行且看且从容。"
# Slack App 的创建和连接
## 前言

因为某些机缘巧合，接触了一下Slack App的创建，还挺方便的，可以在 Slack Workspace 中实现自己的工具机器人或者聊天机器人。

## Slack App

**Slack App** 是基于 Slack 官方 API 构建的应用程序。它可以通过**机器人（Bot）**、**斜杠命令（Slash Commands）**、**事件订阅（Events）** 和**交互式组件（按钮、表单、弹窗）** 与用户在聊天中进行交互。Slack App 本身并不运行在 Slack 内部，而是由开发者部署在独立的后端服务上，通过安全授权的方式与 Slack 平台通信。

### 创建一个新的 Slack App

我们可以在 [Slack App Dahboard](https://api.slack.com/apps) 新建一个 Slack App，在创建的时候有两个方式可选：

- `From a manifest`：通过 `Manifest` 文件创建。我们可以通过代码的方式，在 Manifest 文件中对App进行配置，比如监听哪些事件、给定什么权限等等。可以痛殴
- `From scratch`：从零开始创建。这种方式不会对 Slack App 有任何预配置，而是进入到 Slack App 的管理页面后，通过图形界面手动添加监听事件、启用功能。缺点是配置分散，难以复制。

不过要注意的是，**From scratch 创建的 App，后期也可以导出为 Manifest**；反之，**From manifest 创建的 App，也可以通过 Dashboard 修改配置**。  
简单来说，`Manifest` 文件就像是一个静态的配置文件，可以帮我们快速创建一个预设配置的 Slack App。但是如果这个 App 并不满足我们的要求，我们可以随时在面板上进行调整，并且可以按需导出新的 `Manifest` 文件

作为 Demo 示例我们一切从简，选择 `From scratch` 就好。当然你手头上有现成的 `Manifest` 也可以随意尝试。

然后选择对应的 Workspace 就好了，创建成功后，在对应的 Workspace 中就能找到这个 App，并且可以将其添加到 Channel 中。  
但是这个时候 App 只是一个单纯的 App，我们需要进一步对其配置，以便我们能收到对应的事件信息。

## 部署 Http Mode 的 Slack App


### 1. 创建本地监听服务

因为 Http 模式下，App的推送是端到端的，需要设定一个本地端口进行监听  
这里用 `node.js` 启动本地服务，找一个喜欢的路径，我这里是 `/slack-app`    

安装依赖：

```bash
npm init -y
npm install express body-parser
```

创建 `index.js`：

```javascript
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Slack 会发送 JSON，所以用 body-parser 解析
app.use(bodyParser.json());

// Slack 事件接收 endpoint
app.post('/events/slack', (req, res) => {
    const body = req.body;

    // Slack 的 URL 验证（第一次添加事件订阅时会发 challenge）
    if (body.type === 'url_verification') {
        return res.send({ challenge: body.challenge });
    }

    console.log('收到 Slack 事件:', JSON.stringify(body, null, 2));

    // Slack 要求返回 200
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

启动服务器，保持监听：

```bash
> node index.js             
Server is running on port 3000
```

通过 `ngrok` 暴露本地 `url` （没有 `ngrok` 可以通过 `homebrew` 安装）   
要注意的是 `ngrok` 从 v3 版本开始要求必须注册账号并绑定 `authtoken` 才能使用，如有需要可见 [Trouble Shooting](./#trouble-shooting)。

```bash
> ngrok http 3000

Session Status                online                                                                
Account                       Luoyang Gao (Plan: Free)                                              
Version                       3.34.1                                                                
Region                        Asia Pacific (ap)                                                     
Latency                       380ms                                                                 
Web Interface                 http://127.0.0.1:4040                                                 
Forwarding                    https://unfanatically-hydrocinnamoyl-madalene.ngrok-free.dev -> http:/
                                                                                                    
Connections                   ttl     opn     rt1     rt5     p50     p90                           
                              0       0       0.00    0.00    0.00    0.00  
```

成功后，我们可以看到一个转发 `Forwarding` 字段有一个 `ngrok` 帮我们生成的 `url`，这就是我们暴露的 host。   
由于在上面的 `node.js` 文件中我们监听的是 `/events/slack`，所以最终我们的 `url` 是：

```bash
https://unfanatically-hydrocinnamoyl-madalene.ngrok-free.dev/events/slack
```


### 2. 配置 Slack App

在 Dashboard 中，`Socket Mode -> Connect using Socket Mode -> Enable Socket Mode` 确保其关闭（因为我们现在玩的是 Http 模式，等到后面 Socket 模式再打开）    

在 `Event Subscriptions -> Request URL` 中，将上面 `ngrok` 生成的监听端口给设置进去并 Verify 一下，然后查看 `Subscribe to bot events` 中的事件，特别是 `app_mention` 是否已经订阅，这个事件在我们的 App 被其他用户 @ 后会触发。

### 3.与 Slack App 交互

回到 Slack，我们在 Workspace 中新建一个 Channel，添加这个 Slack App，@他并发送消息。这时我们的本地服务就会收到消息。 

![pZ6RETJ.md.png](https://s41.ax1x.com/2026/01/20/pZ6RETJ.md.png)


![](https://s41.ax1x.com/2025/12/25/pZJCp6K.png)
## 启用 Socket Mode

上面讲述了 Http 模式的交互，痛点很明显，即 **需要指定的公网 HTTP 接口**    
另一种 **Socket Mode** 交互则更加方便，他将事件直接通过 `WebSocket`链接，因此不需要指定公网 HTTP 接口。  
这个模式通过 `App-Level Token` 和 `Bot Token` 来连接 Slack App 和 我们的服务：

- **App-Level Token**（`xapp-...`）：在 `Dashboard` 中通过 `Basic Information -> App-Level Tokens` 获取。Slack 通过这个 token 验证我们的 App 合法存在，从而允许建立 WebSocket 连接。
- **Bot Token** （`xoxb-...`）：在 `Dashboard` 中通过 `OAuth & Permissions -> OAuth Tokens` 获取。代表 Bot 的用户身份，用于与 Slack API 交互，以此来发送消息、读取内容、响应事件等。

在 Dashboard 的 **Socket Mode** 页面中，我们启用 **Socket Mode** 后，我们找到并记下上面的两个 Token，然后就不需要 request_url 了。在 **Event Subscriptions** 页面里会看到如下提示：

```
Socket Mode is enabled. You won’t need to specify a Request URL.
```

#### 为 Socket Mode 创建新的 node.js

先安装 Slack 提供的依赖：

```bash
npm install @slack/bolt
```

我这新建了 `index_for_socket.js` 

```javascript
const { App } = require('@slack/bolt');

// 初始化 Bolt，启用 Socket Mode
const app = new App({
  token: 'xoxb-',   // xoxb-xxxx
  appToken: 'xapp-', // xapp-xxxx
  socketMode: true
});

// 监听@事件
app.event('app_mention', async ({ event, say }) => {
  console.log('[DEBUG] 收到 @ 事件:', event.text);
  await say(`你 @ 我啦！我看到你的消息: ${event.text}`);
});

// 启动本地 Socket Mode 监听
(async () => {
  await app.start();
  console.log('⚡ Socket Mode 本地监听中...');
})();
```

完事后启动并在 Slack 中发送消息：

```bash
node index_for_socket.js
```

![](https://s41.ax1x.com/2026/01/20/pZ6fia4.png)

![](https://s41.ax1x.com/2025/12/25/pZJCPmD.png)

## 参考

1. [Slack App Events](https://docs.slack.dev/reference/events)
2. [ngrok](https://ngrok.com/)