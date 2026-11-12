---
layout: post
title: Tool Calling：LLM 的函数/工具调用
subtitle: 从最初的函数调用到 MCP 标准化连接
date: 2026-09-20
author: BlackDn
header-img: img/21mon1_06.jpg
catalog: true
tags:
  - AI
  - LLM
---

# Tool Calling：LLM 的函数/工具调用

## 前言

这次来研究一下 Function Calling / Tool Calling  
看看 LLM 和 Host 与外界服务交互的机制。

## LLM 与宿主程序的 Tool Calling

在开发 AI Agent 或 RAG 应用时，我们经常会给 LLM 传入一个 `tools` 参数，接着模型就能返回一个函数调用指令，甚至帮我们查好了数据库、发出了邮件。  
看起来，**大语言模型（LLM）** 似乎有了操作系统句柄，能够像一个管理员般帮我们做事。实际并非如此。

正如我们之前的文章中提到的那样，**LLM 的本质永远是一个无状态的、基于概率计算和结果预测的文本生成器**。 它没有网络权限，也没有数据库连接池，更不可能直接运行我们的接口代码。  而这些操作的背后，都有着 LLM 的 **Tool Calling** 的身影。

### Tool Calling 和 Function Calling

这里先做一个名词定义。  
在大部分的文档里 **Function Calling** 会比较常见，因为最初大家都是这么叫的，最初的大模型通常一次请求只能选择调用一个函数。而现在随着 **Agent** 功能不断扩展，已经不仅限于调用函数，还可以进行网络搜索、查询数据库、代码审计等，**Tool Calling** 的叫法也开始呈现。

2023 年 6 月，**OpenAI** 首次在 **Chat Completions API** 中发布了 **Function Calling（函数调用）** 能力。当时 API 使用 `functions` 和 `function_call` 参数，开发者可以向模型描述可用函数，模型则根据用户输入决定是否生成函数调用请求。

2023 年 11 月，随着 `GPT-4 Turbo` 和 DevDay 的发布，OpenAI 对 **Chat Completions API** 进行了扩展，将原来的 `functions` 参数升级为更通用的 `tools`，并引入 `tool_calls` 和 `tool_choice` 等字段，于是就开始用 **Tool Calling** 指代工具调用的整体概念。  
同时，升级后的大模型还支持**并行函数调用（Parallel Function Calling）**，模型可以在一次响应中返回多个函数调用请求。

例如，用户问“帮我查询北京和上海的天气”，模型就可以在一次响应中同时返回两个 `tool_calls`：
- `get_weather(city="Beijing")`
- `get_weather(city="Shanghai")`

因此，**Function Calling 更强调通过函数定义表达调用意图，而 Tool Calling 是更广义的工具调用概念**。在本文语境下，两者可以视为同一类机制的不同叫法。

### LLM 生成结构化内容

举个例子，当我们问 AI Chat： `“帮我查询一下今天上海的天气。”`，我们得到的结果是`“今天上海天气晴朗，温度 25°C。”`。这中间会有个调用 `get_weather()` 函数的过程，但往往会被我们所忽略。  
毕竟我们直接得到了一个自然语言的回复，可能会下意识误认为是 LLM 直接执行了函数，拿到了结果最后生成回复，但实则不然。

严格来说，LLM 本身并没有直接执行 `get_weather()` 的能力。它做的事情，本质上仍然是**生成 token**。他生成的是一段结构化内容，类似这样：

```JSON
{
  "name": "get_weather",
  "arguments": {
    "city": "Shanghai"
  }
}
```

LLM 生成的这段回复会给到其外部包装的应用程序，即**宿主程序（Host Application）**，由宿主程序去调用具体的函数获取结果，这就是 **Tool Calling** 的过程。

这和我们之前提到的 **Structured Outputs** 有很大的关系：**Structured Outputs** 解决的是模型输出结构的约束问题，而 **Tool Calling** 则是在此基础上，建立了一套模型与宿主程序之间的工具调用交互机制。  
在支持的 API 和配置下，我们可以通过 Structured Outputs 的**严格模式（Strict Mode）**，让模型生成的 Tool Arguments 符合指定的 JSON Schema。通常配置为 `"strict": true`。

因此，Tool Calling 通常使用结构化数据（比如 JSON）表达调用意图，模型生成工具调用的请求，并将其交给宿主程序，由宿主程序识别模型的调用意图，并进一步执行相应操作。


```
[ 用户输入 ] ──> [ 宿主程序 (Host App) ] ──(带上 Tool Schema)──> [ LLM ]
                                                                   │
                                                            (生成结构化内容)
                                                                   ▼
[ 宿主程序 (Host App) ] <──(收到 {"name": "get_weather", ...})───────┘
         │
    (代为执行 API)
         │
         ▼
[ 外部数据库 / API ]
```

### 宿主程序调用函数

我们平时直接交互的大部分都是**宿主程序（Host）**，其包括图形化界面/命令行以及围绕模型搭建的后台服务系统，比如 ChatGPT，比如 Gemini。   

如果使用过 **OpenCode**、**Cursor** 等这种 **解耦模型（Model-Agnostic）** 的 AI 工具，则会有更深的体会。他们强调**宿主程序与 LLM 之间的职责边界**，我们可以在使用过程中随时切换模型。他们把 LLM 当做可随时替换的推理引擎（Engine），而把所有的工具（Tools）、状态管理、系统权限留给宿主程序自身。

**Tool Calling** 实际上包括了从 LLM 决策和宿主程序执行的过程，即：

> LLM 负责“决策与表达”（通过生成结构化文本），宿主程序（Host/Client）负责“翻译与执行”（去调用具体应用或 API）。

因此，**Tool Calling** 是 LLM 与宿主程序共同完成的一种**协同协议能力**

### LLM 和宿主程序的 Tool Calling 交互

举个例子：  

- 我们在 ChatGPT 中提问：“今天上海天气怎么样？”  
- LLM 模型决策：**GPT-4o** 发现自己不知道最新的天气，于是输出了一段特定格式的 JSON（Tool Call），意思是：“我需要调用 `get_weather(city="Shanghai")`”
- 宿主程序 ChatGPT 后台服务拦截到了这段 JSON，于是替模型发起了真实的请求，去调用`get_weather API`。
- 宿主程序拿到了搜索返回的结果，并将其作为 `role: "tool"` 的消息打包，回传给 GPT-4o。
- 最终输出：GPT-4o 整理摘要，输出自然语言：“今天上海天气晴朗，温度 25°C。”

在这个过程中，发起网络请求、解析网页、处理 Cookie 和 API 密钥的，全都是 OpenAI 的宿主程序，模型自己连网线都没见过。

我们可以把 **Tool Calling** 拆成两个阶段来看：

1. **LLM 的 Tool Use 决策能力**：理解 Schema 与上下文，保证输出参数和格式的正确性。
2. **宿主程序的 Tool Execution 执行能力**：解析 JSON、发起网络 HTTP 请求、连接数据库等。负责拦截、校验、鉴权与 API 路由能力。

LLM 和宿主程序各司其职，共同实现了 **Tool Calling** 的能力：

> Tool Calling 是 LLM 生成结构化的调用请求，而 Host Application 负责执行这个请求。

## Tool Calling 的实现

为了让“LLM 决策到宿主程序执行”这一过程自动化，现代 LLM 框架（如 OpenAI、LangChain、LlamaIndex等）抽象出了一套标准的交互协议，通常包含 **4-Step Loop**，即一个完整的 Tool Calling 生命周期。

### Tool Calling Lifecycle


```
[1. Tool Definition] ──> [2. Tool Call] ──> [3. Tool Execution] ──> [4. Tool Result]
 (JSON Schema 声明)      (LLM 返回结构化意图)   (宿主程序拦截并执行)      (结果回传给 LLM)
```

#### Tool Definition：声明

开发人员用 **JSON Schema** 向 LLM 描述当前可用的函数、参数类型以及 `description`（描述），即告诉 LLM，我们现在有哪些 Tool 可以用，这些 Tool 分别是做什么的。    
简单来说，**Tool Definition** 是其他工具/程序向 LLM 提供的“自我介绍”与“使用说明书”。类似以往我们给客户端暴露 API 接口，现在我们给 LLM 暴露“有哪些其他工具为你提供服务”。  

**Tool Definition** 通常用 JSON Schema 描述工具的名称、功能和参数。在实际项目中，它可以直接定义在代码中，也可以通过 JSON、YAML 等配置文件维护，具体取决于所使用的框架。    
模型对 Tool 的理解依赖于 **Tool Definition** 提供的名称、描述和参数 Schema，其中 `description` 尤其重要。因此，我们经常通过 **Prompt Engineering** 优化工具描述和参数说明，提高模型选择工具及生成参数的准确性。

**Tool Definition** 的自我介绍通常要包含一些基本问题，比如“工具叫什么？ 工具能做什么？ 需要什么参数？ 参数是什么类型？”等。比如这样：

```JSON
{
  "name": "get_weather",
  "description": "Get the current weather for a city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "The city name"
      }
    },
    "required": ["city"]
  }
}
```

#### Tool Call：意图

LLM 评估对话上下文，认为当前需要借助外部能力，于是停止输出自然语言，转而输出一段特定格式的响应：

```JSON
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_weather_123",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"city\": \"Shanghai\"}"
      }
    }
  ]
}
```

#### Tool Execution：执行

**宿主程序（Application Host）** 接收到模型返回的工具调用请求后，根据具体 API 协议解析调用信息，提取函数名、参数和调用 ID。

例如，在 OpenAI Chat Completions API 中，其通过 `finish_reason: "tool_calls"` 判断模型返回了工具调用请求；在 Responses API 中，则需要识别输出项中的 `function_call` 类型。  
宿主程序随后进行参数校验、权限检查和工具路由，再调用对应的函数或外部 API。

#### Tool Result：回传

宿主程序将执行结果格式化后，重新追加到对话历史中，再次发送给 LLM：

```JSON
{
  "role": "tool",
  "tool_call_id": "call_weather_123",
  "content": "{\"weather\": \"sunny\", \"temperature\": \"25\"}"
}
```

LLM 收到结果后，结合前文，最终给用户生成一句通顺的自然语言回答：“今天上海天气晴朗，温度 25°C。”

需要注意的是，不同 API 的工具调用和结果回传格式可能不同。例如，Chat Completions API 使用 `role: "tool"` 消息回传结果，而 Responses API 使用 `function_call_output` 输出项。  
虽然具体协议格式不同，但它们的核心交互过程是一致的：模型提出调用请求，宿主程序负责执行，再将结果交还模型。

### Tool Calling 的本质：Message Protocol

走完一遍 **Tool Calling** 的流程后，我们会发现，比起是否执行函数，Tool Calling 最核心的东西其实是**消息的传递**。  
LLM 和宿主程序之间结构化的消息传递和执行的决策共同完成一次函数的调用，并将调用的结果重新加工成自然语言，最后完成用户的需求。

所以从架构角度来看，Tool Calling 更适合被称为 **LLM 和 Application 之间的一种消息交互协议**


```
                                   Tool Call               
┌────────────┐       ┌────────────┐        ┌────────────┐  
│    User    ├───────►    LLM     ├────────► Application│  
└──────▲─────┘       └────────────┘        └──────┬─────┘  
       │                                          │        
       │                                          │ Execute
       │   Tool Result                            │        
┌──────┴─────┐       ┌────────────┐Result  ┌──────▼─────┐  
│    LLM     ◄───────┤ Application◄────────┤    Tool    │  
└────────────┘       └────────────┘        └────────────┘  
```

#### 间接传递消息的设计

**Tool Call** 的输入内容是 LLM 生成的，Tool 的选择是 LLM 决定的，但我们仍然选择在中间加一层，让 Host 进行 Tool 的调用。这种 `LLM -> Host -> LLM` 的间接消息传递的设计，不直接赋予 LLM 执行的能力，主要是考虑到**安全边界（Security Boundary）与权限隔离。**    

LLM 是无状态、不可预测的概率模型，其输出具有概率性，即便我们使用了Structured Outputs 保证参数符合 Schema，也不能保证模型的调用意图一定合理或安全。（比如现在越来越多的黑客使用大模型进行攻击）

因此，在执行模型的调用请求之前，我们需要进行参数校验、身份鉴权、权限控制、Rate Limit 等防范，必要时还需要引入 Human-in-the-loop 人工确认机制。在如今的架构下，这些都是由宿主程序实现的。

通过将**决策**和**执行**分离，我们可以将真正的系统权限保留在宿主程序和受控的工具执行环境中。

## MCP：标准化连接

一开始，不同应用、不同模型、不同工具之间的集成方式可能完全不同，我们需要“点对点”地写代码：

- Agent A 想要连接 GitHub，需要手写一段把 GitHub API 转成 JSON Schema 的代码；
- Agent A 想要连 PostgreSQL，要手写一段 SQL 查询的工具定义。
- 引入了新的 Agent B，它也要连接 GitHub。由于 Agent B 和 Agent A 不同，不能复用 Agent A 的代码，我还要重新写一个新的连接 GitHub 的代码。

当 Tool 数量、Agent 框架越来越多时，问题也随之浮现，这样的方式非常割裂，难以构建且难以维护。  
为了标准化 Agent 和 Tool 之间的连接，这就有了 **MCP**。

**MCP（Model Context Protocol）** 定义了统一的通信规范，它为**宿主程序**和**外部工具/数据源**提供了**标准化连接**，使两者能够标准化地发现、描述和交互。  
MCP 将宿主程序定义为 `Client`，它发起对工具的调用；将外部工具/数据源定义为 `Server`，提供各种 Tool 功能或数据。

- **MCP Client**：通过 `stdio` 或 `Streamable HTTP` 与 MCP Server 建立连接，发现并调用 Server 提供的工具。
- **MCP Server**：通过 MCP 协议暴露 Tools、Resources 和 Prompts 等能力，供 Client 发现和使用。

其中，`stdio` 主要用于本地进程间通信，`Streamable HTTP` 则主要用于远程服务通信。早期版本使用的 HTTP + SSE 传输方式目前已经被 Streamable HTTP 取代，但为了兼容旧版本，部分实现仍然支持它。


```
                              ┌──────────────────────────────────────────────────┐                 
                              │                         MCP                      │                 
                              │                                                  │                 
┌──────┐  Tool Calling        │  ┌───────────────┐   MCP Protocol   ┌──────────┐ │     ┌──────────┐
│ LLM  │ <──────────────────> │  │   MCP Client  │ <──────────────> │MCP Server│ │ <─> │Resources │
└──────┘  (JSON / Grammar)    │  │ (Run in Host) │   (stdio / SSE)  └──────────┘ │     └──────────┘
                              │  └───────────────┘                               │                 
                              └──────────────────────────────────────────────────┘                 
```

要注意的是，MCP 并没有代替 Tool Calling，他们分别解决了不同的问题，是可以在系统里共存的：

- **LLM 与 MCP Client 之间**：继续使用经典的 Tool Calling / Structured Output 协议交互。
- **MCP Client 与 MCP Server 之间**：通过 MCP 协议 进行动态工具发现（Tool Discovery）与远程调用。

### 小结

LLM 的能力演进，本质上是**用极简的文本概率生成能力，去拟合复杂的软件工程接口**。

- **Structured Outputs** 解决了“模型输出能不能被程序稳定解析”的问题
- **Tool Calling** 解决了“模型如何表达调用意图并交由程序执行”的问题
- **MCP** 则解决了“各种工具和数据源如何标准化接入”的问题

## 参考

1. [OpenAI: Function calling](https://developers.openai.com/api/docs/guides/function-calling?api-mode=responses)
2. [Anthropic: Tool use with Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
3. [Google Gemini: Function calling with the Gemini API](https://ai.google.dev/gemini-api/docs/function-calling?utm_source=chatgpt.com)
4. [MCP: What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)