---
layout: post
title: SSE 协议
subtitle: 原理解析+Demo演示
date: 2026-05-15
author: BlackDn
header-img: img/moriya_150_033.jpg
catalog: true
tags:
  - AI
  - Web
  - Protocol
---

# SSE 协议

## 前言

我真服了，换电脑的时候忘记备份了，原来这篇文章都写好了，现在又不得不重新写QAQ   

我们在和 AI Chat 交流的时候，会发现大部分 AI 回复都是类似打字机，一个字一个字蹦出来。  
一开始我还以为这是前端实现的动画呢，后来发现这其实是服务端交互的协议实现的，这就是 SSE 协议。

## SSE 是什么

**SSE（Server-Sent Events）**，即**服务器发送事件**，是一种**基于 HTTP 的单向实时通信协议**。   

我们都知道基本的 HTTP 请求，通过三次握手建立连接，客户端请求，服务端回复，连接断开。

```
Browser
    │
    │ Request
    ▼
Server
    │
    │ Response
    ▼
Browser
```

而 SSE 允许在保持连接的情况下，服务端主动向前端发送消息   
他的实现方法说来简单：服务端回复的时候，不会马上发送 END 结束连接（后面再介绍是怎么做到的）；从而让连接保持，服务端持续发送消息

```
Browser
      │
      │ Request
      ▼
Server
      │
      │ data: token1
      │
      │ data: token2
      │
      │ data: token3
      │
      │ ...
      ▼
Browser
```

这对于 AI Chat 这类产品来说非常契合：  
用户和 AI Chat 交互的时候，往往是发送一个问题，然后等待 AI 回复。而在 AI 的背后，回复内容的生成往往是交给 LLM 的，**Token by Token** 地生成内容，这就导致即便是服务端其实也不能一下子生成所有内容，而是通过 LLM 一点点生成，最后将内容全部拼起来才是最终的结果。  

这也解决了我一开始的疑问，这种 AI Chat 呈现出的“打字机”效果并不是客户端特意实现的，而是服务端本身就一点点发送，客户端只要把收到的内容展现出来就好。

## 为什么是 SSE

其实 AI Chat 的需求非常简单，只要客户端能及时拿到服务端生成的内容即可。当然有很多种方法可以实现，但唯有 SSE 在**效果**和**成本**上都令人非常满意。正如之前所说，非常契合。   
其他方法也不是不行，我们挑几个来看看。

### 等待，然后一次性获取

最简单的方法当然是先等待，等到服务端把所有的内容都生成好拼好，再一次性发给前端。  
当然这种实践非常不友好，客户端需要保持等待很长一段时间，用户体验不是很友好；而且还容易出现许多意外，比如因为等待时间太长连接断开、比如因为内容太多发送失败。一旦出现错误，还需要重新进入等待环节。  
所以我们 pass 掉这种方法。

### 客户端轮询（Polling）

另一种技术成本比较低的方法就是客户端不断轮询，去询问服务端有没有新东西生成。  
由于客户端并不知道服务端什么时候会生成新内容，如果想要提高及时性就只能提高轮询频次，但这会导致产生大量没有意义的请求，这对后续看 Log 或者带宽流量来说都是不想见到的。而降低了轮询频次又会让用户陷入等待的缺点。  
或许对于某个情况下存在轮询频次的最优选择，但一旦换一个环境，换上不同的网络条件、用户高并发等，又需要去探索新的最优轮询频次，非常不人性化。  
所以我们接着看其他方法。

### WebSocket

**WebSocket** 当然可以满足我们的需求，它的效果也足够好足够强大，毕竟是**全双工实时通信**，但他输在了其成本上。  
WebSocket 有自己的通信协议，需要搭配网关，自己实现心跳保活、重连逻辑以及子协议解析，开发和调试成本更高。  
此外，我们前面也提到，我们的场景基本上是客户端给服务端发一条消息，然后服务端给客户端持续发送若干条消息，在这个过程中，客户端基本不对服务端主动交互。因此 WebSocket 的一半功能我们也没用上，非常浪费。

## SSE 的工作原理

我们之前提到，**SSE** 本质还是 **HTTP**，这点从其请求中便可窥见一二。   
客户端发送的是一个普通的 HTTP 请求，不过在请求头中藏了些小巧思（以 ChatGPT 为例）：

```
POST /conversation
Accept: text/event-stream
Connection: keep-alive
Cache-Control: no-cache
```

SSE 使用的 **MIME type** 是 `text/event-stream`，就是告诉服务端，接下来要通过 EventStream 一点点发送数据了。  
而事件流本质上是一个 `UTF-8 text stream`，一条 event 由若干行 `data` 组成，共同构成一次请求，也一起组成了一次问题的最终回答。

服务器会先给一个返回，告诉客户端我收到了你这个请求：

```
200 OK
Content-Type: text/event-stream
Connection: keep-alive
Cache-Control: no-cache
```

不过在这个返回里，服务器不会立即结束 **Response**，而是继续通过 `data` 发送消息。    

在浏览器的请求页面，我们可以在 `EventSteam` 的 Tab 下发现所有的 `data` 消息。如果手快的话，我们就能看到这个 **Response** 已经返回了 `200 OK`，但 `data` 消息仍在不断发送中，对应页面上的“打字机”效果不断展示。

![SSE Display in ChatGPT](https://s41.ax1x.com/2026/09/15/pnnl2CR.png)

最终只有在服务器主动结束 response，或者网络连接断开时，这次 **HTTP Response** 才真正结束。

### SSE 的数据格式

| 格式         | 含义             |
| ---------- | -------------- |
| `data:`    | Event 数据       |
| `event:`   | Event 类型       |
| `id:`      | Event ID       |
| `retry:`   | 断线后的重连等待时间     |
| `:`        | 注释 / Heartbeat |
| 空行         | Event 结束       |
| 多个 `data:` | 一条 Event 的多行数据 |

- `data`：是 SSE 消息实际内容的基本单元，一个 `data` 通常包含一个或若干个文字。一个 SSE 请求返回的内容可能有多个 `data`，所有 `data` 组成了 AI 返回的实际内容。虽然现在市面上绝大部份的产品在 `data` 中放的都是 **JSON**，不过实际上这没有硬性要求，只要是文本内容都可以。
- `event`：事件类型，通常 `data` 的数据类型为 `message`。允许自定义不同的类型，比如 `error`，`progress`，`completed` 等。前后端通过约定可以对不同的数据类型采取不同的处理。
- `id`：可以理解为每条事件的编号（因为每个 EventStream 中会有多条数据），可以快速定位到对应的事件。客户端会记录最后一个收到的 `event ID`，当出现意外网络断开再重连时，会带上 `Last-Event-ID`，这样服务端就知道从哪条事件开始发了，提高断线恢复能力和重试效率。
- `retry`：规定触发重连的时间。`retry: 5000` 表示连接断开 5000ms 后尝试重新连接。
- `:`：通常用作注释或者发条空消息作为心跳保活，避免网关代理等其他因超时而关闭连接。

值得注意的是，如果一个 **SSE Event** 想要包含多条 `data`，他们之间会有一个 `\n`，通过其换行表示 `data` 的结束。  
由于 SSE Event 数据通过一条空行表示结束，因此最后一条 `data` 之后会有一个 `\n\n`，第一个 `\n` 表示 `data` 的结束，第二个 `\n` 是一个空行，表示 Event 的结束。

```
// 这是一条 Event：
event: message
data: {"content":"Hello"}
data: {"content":"World"}
data: {"content":"Black"}
data: [DONE]
(这里还有一个空行)

//这是4条 Event：
event: message
data: {"content":"Hello"}

event: message
data: {"content":"World"}

event: message
data: {"content":"Black"}

event: message
data: [DONE]
(这里还有一个空行)
```

#### 多行 data

SSE 允许一个 event 有多个 `data` 行：

```
data: hello
data: world
```

因为 `data` 本身是字符数据，所以客户端解析的时候会自动组合多行 `data` 的内容（中间的换行会被保留），所以页面上就会显示：

```
hello
world
```

不过随着要传递的消息越来越多，现在更多**使用一条 Event 一条 data** 的格式，而 `data` 采用 JSON 的形式。


### 易混淆点：Cache-Control 和 keep-alive

我们可能会在请求头或响应头中看到这两个参数：`Connection: keep-alive` 和 `Cache-Control: no-cache` 。这两个参数既可以出现在请求头，也可以出现在响应头，他们在 SSE 中有点作用但不多，很多人会误认为他们是 SSE 的实现关键，其实不然（`keep-alive` 这名字误导性太强了）

#### Connection: keep-alive

这个字段在 **HTTP/1.0** 和 **HTTP/1.1** 中使用的比较多，通常情况下 HTTP 连接都是在客户端发起请求之前建立的，而在服务器发送响应后则会被关闭，但在某些情况下一些客户端和服务器希望保持这些连接，方便后续交互。这就催生了这个头字段 `Connection: keep-alive`。  
严格来说，我们称它用于保持 **HTTP 持久连接（persistent connection）**，而在大部分情况下 HTTP 持久连接通常是建立在同一个 TCP 连接之上的，所以我们可以简单理解为：

> `Connection: keep-alive` 允许多个 HTTP 请求/响应复用同一个 TCP连接。

知道它的作用后，我们很容易得出一个结论：`Connection: keep-alive` 在 SSE 中并没有什么关键作用，或者可以说，没什么作用。  
`Connection: keep-alive` 聚焦于两次请求使用同一个 HTTP 连接；而 SSE 的需求是，在单次请求中保持连接，服务端得以持续发送消息。  
所以他们完全处于不同领域，不要因为它的名字而被混淆了。  

不过现在基本没这个问题了，因为 `Connection: keep-alive` 在 **HTTP/2** 和 **HTTP/3** 中已被禁用，主流浏览器如 Firefox、Chrome 会将其自动忽略。比如在 ChatGPT 中，他的请求头和响应头中就没有这个字段。

#### Cache-Control: no-cache

伴随 SSE 的通常是 `Cache-Control: no-cache` 或 `Cache-Control: no-store`

- `no-cache`: 可以缓存，但使用缓存之前必须向服务器重新验证。
- `no-store`: 不允许缓存。

由于 SSE 是**实时数据流**，缓存在其中发挥的作用并不大，而且我们也不希望浏览器、代理服务器之类的中间层把 SSE 数据缓存起来。所以上述两个值在实际应用中都可以看到，也都可以使用。  
本质上都是避免缓存机制干扰实时事件流。

### EventSource

**EventSource** 可以帮助我们方便地在客户端收发 SSE 消息：

```javascript
const source = new EventSource("/api/conversations");
```

这样发送的消息自己就是 `event-stream`，不需要我们再构造请求头。  
此外在收到服务端的消息时，也会自动帮我们解析 JSON。还有默认的断线重连，很方便。  

不过，他的缺陷也比较明显，原生 `EventSource` 主要是 GET 请求，而现代 AI 服务大多需要 `Authorization` 等自定义请求头，但 `EventSource` 不支持这一点。  
因此很多 AI Chat 并不是直接使用 `EventSource`，而是利用 `fetch + ReadableStream` 来消费 SSE 数据流：

```javascript
const response = await fetch("/chat", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>"
  }
});

const reader = response.body.getReader();
```

## SSE Demo

我们自己写一个 Demo 来体验一下 SSE 在代码层面的收发流程：

### 服务端 

创建一个 `server.js` 作为服务端：

```javascript
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // SSE
  if (req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    let count = 0;
    const timer = setInterval(() => {
      count++;
      res.write(`data: Hello SSE ${count}\n\n`);
    }, 1000);

    return;
  }

  if (req.url === "/") {
    fs.createReadStream("./index.html").pipe(res);
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

这里我们提供了一个 `/events` 接口给前端调用，用于建立 SSE 连接并发送 Events。  
我们为 **Response Header** 设置 `"Content-Type": "text/event-stream"`，告诉前端这是一个 **SSE Event Stream**。这样浏览器的 `EventSource` 会按照 SSE 的规则解析 Response Body （如果是 JSON 就能很方便的解析，不过我这里偷懒直接发的 String）。  

最后每隔一秒发送一条 `SSE Event`。因为我们的 `data` 带了两个 `\n\n`，所以这里的每一条都是一个 **Event**，每个 **Event** 中都带了一个 `data`，每个 `data` 中都是一个简单的 String。  
这里没有写在普通 HTTP 请求中常见的 `res.end();`，因为 SSE 允许一直保持连接，让服务端一直发送数据。在没有网络问题、网关、负载均衡等其他条件的影响下，我一直不关他就可以一直发。  

### 前端

再创建一个 `index.html` 简单搭个页面：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SSE Demo</title>
</head>

<body>
  <h1>SSE Demo</h1>
  <div id="messages"></div>
  <script>
    const messages = document.getElementById("messages");
    const source = new EventSource("/events");

    source.onmessage = (event) => {
      const div = document.createElement("div");
      div.textContent = event.data;
      
      messages.appendChild(div);
    };

    source.onerror = () => {
      console.log("SSE connection error");
    };
  </script>
</body>
</html>
```

这里就比较简单，我们通过 **EventSource** 调用服务端提供的 `/events` 接口，然后静静等待回复，把每一次回复的结果添加到页面上。   
这里我们并不需要自己配置请求头啥的，`new EventSource("/events")` 会自己调用 `GET  /events`，并且帮我们带上 SSE 所需的请求头。

### 效果展示

![Demo](https://s41.ax1x.com/2026/09/15/pnnrRTs.png)

## 参考

1. [HTML: The Living Standard - Server-sent events](https://html.spec.whatwg.org/dev/server-sent-events.html?utm_source=chatgpt.com)
2. [MDN: Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events?utm_source=chatgpt.com)
3. [RFC 9112 - HTTP/1.1 - keep-alive](https://www.rfc-editor.org/rfc/rfc9112.html?utm_source=chatgpt.com#name-keep-alive-connections)
4. [MDN: Keep-Alive header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Keep-Alive)
5. [MDN: Cache-Control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control?utm_source=chatgpt.com)
6. [MDN: EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource?utm_source=chatgpt.com)