---
layout: post
title: Structured Outputs：约束 LLM 结构化输出
subtitle: JSON Schema，CFG/GBNF 组成的 Constrained Decoding
date: 2026-09-16
author: BlackDn
header-img: img/21mon1_06.jpg
catalog: true
tags:
  - AI
  - LLM
---

# Structured Outputs：约束 LLM 结构化输出

## 前言

之前提到过 SSE 的内容，这次跨一大步，深入模型内部，看看要如何才能让大模型百分百输出想要的结构化内容。
## Structured Outputs 结构化输出

顾名思义，**Structured Outputs（结构化输出）** 表示“让 AI 按照指定的数据结构输出结果”。  
虽然在日常生活中我们和 AI 交互，希望得到的结果大多是一段字符串，但在某些情况下，我们希望 AI 输出的内容是某些结构化的数据格式（大部分是 **JSON**）。  

举个例子，我在运维过程中遇到了一个错误，于是我去问 AI：

```
帮我分析一下这段日志，并告诉我：
1. 问题级别
2. 问题原因
3. 是否通过重试解决
   
AI 可能回答：
这是一个 P1 问题。
原因是 Kafka 消息发布失败。
这个问题可以尝试重试。
```

后来，项目引入了一个非常先进的软件，这个软件可以接收 AI 的分析结果，自动处理错误，比如重新发送 Kafka 消息。不过要求是 AI 必须给这个软件传输一个 **JSON** 数据：

```JSON
{
  "severity": "P1",
  "summary": "Kafka message publishing failed",
  "retryable": true
}
```

那么为了让这个自动工作流顺利进行，保证 AI 输出的结果是 JSON 就变得非常重要。  
显然，仅仅在 `Prompt` 中加入“请输出 JSON 格式”是不能百分百保证这个条件的。  

当 AI 开始和程序直接通信时，输出格式就变得非常重要。我们称这些特定结构的输出为 **Structured Outputs**。

## JSON Schema

为了保证输出的是 **JSON**，且为了保证输出的 **JSON** 符合下一个工作流的要求，就有了 **JSON Schema**。   
它是**用来描述 JSON 数据应该长什么样的一份规则**。

举个例子，有这样一个**JSON Schema**：

```JSON
{
  "type": "object",
  "properties": {
    "severity": {
      "type": "string",
      "enum": ["P1", "P2", "P3", "P4"]
    },
    "summary": {
      "type": "string"
    },
    "retryable": {
      "type": "boolean"
    }
  },
  "required": [
    "severity",
    "summary",
    "retryable"
  ],
  "additionalProperties": false
}
```

它规定了这个 JSON 的结构，且最后的 `"additionalProperties": false` 表示不允许出现 Schema 中没有定义的额外字段；  
它对许多字段进行了定义，比如 `"type": "object"` 表示这个数据是什么类型；`severity.type` 和 `summary.type` 需要是 `string`；`retryable.type` 需要是个 `boolean`；`severity.enum` 的值是 “P1～P4” 中的一个；`required` 表示上述三个字段都必须要有。   
所以这份 Schema 可以简单翻译成：

> 我要一个 JSON Object，它必须有 `severity`、`summary` 和 `retryable` 三个字段。其中 `severity` 只能是 P1～P4。

好了，我们现在已经有 **JSON Schema** 了，直接告诉 AI “请按照这个 Schema 输出” 不就好了吗？当然没有这么简单，这就不得不提 LLM 生成文字的逻辑了。
## LLM 和它的 Token

**LLM（Large Language Model）**，即我们熟知的**大语言模型**，它其实并不懂自然语言，它接收 **Token**，输出 **Token**。所以才要 **Tokenizer** 将自然语言分词，处理成 Token，再交给 LLM 分析。

> LLM本质上是一个预测下一个 token 的模型。

自然语言也好，函数也好，代码也好，对 LLM 来说都是 Tokens。而 LLM 生成文本的过程就是不断预测下一个 Token。这也是为什么 LLM 不是一次性输出全部的回答，而是需要一点点挤出来。

### 传统 LLM 的 Decoding

假设我们的模型现在生成到了：

```
  "severity":
```

下一步应该是什么？模型会对大量可能的 token 计算概率：

```
"P1"      35%
"P2"      28%
"P3"      15%
"P4"      10%
"hello"    3%
"world"    2%
"123"      1%
...
```

模型最终根据这些概率选择一个 token。虽然我们的 **JSON Schema** 中规定了这里应该是 `P1 ～ P4`，但其他值仍有被选择的概率（虽然很低）。  

这也是传统的 LLM **自由生成（Unconstrained Decoding）** 带来的苦恼：模型根据概率分布自由选择下一个 Token。即使在 `Prompt` 里写了“请严格返回 JSON”，模型依然可能因为随机采样而生成非法的字符串。

## Grammar 文法

为了解决这个问题，我们需要一个更强硬的规则，来定义输出内容合法与否。  
这套规则就是 **Grammar 文法**。  

比如 `answer ::= "YES" | "NO"` 就定义了 `answer` 的值要么是 “YES”，要么是 “NO”。  
既然如此，我们可以用 **Grammar** 来描述 **JSON**：

```
object
 ├── {
 ├── member
 ├── ,
 ├── member
 └── }

member
 ├── key
 ├── :
 └── value
```

这个就是一个简单的 **JSON** 格式的 **Grammar** 描述：  
一个 JSON 对象（object）由若干个 member 组成，头尾要有括号，中间用逗号分隔；  
一个 member（键值对） 由一个键和一个值组成，中间是一个冒号；  

于是就有了：

```
JSON Schema
     ↓
描述数据结构
     ↓
Grammar
     ↓
描述合法输出形式
```

### Chomsky Hierarchy 乔姆斯基层级

在 **Grammar** 之中，也分了不同层级。不同层级的 **Grammar** ，对复杂结构的表达能力不同。  
在**形式语言理论（Formal Language Theory）** 中，**Noam Chomsky** 提出了著名的 **Chomsky Hierarchy（乔姆斯基层级/乔姆斯基谱系）**，把形式文法按照表达能力分成不同的层级：

| 层级     | 含义                                 |
| ------ | ---------------------------------- |
| Type-0 | 无限制文法                              |
| Type-1 | 上下文有关文法（Context-Sensitive Grammar） |
| Type-2 | 上下文无关文法（Context-Free Grammar, CFG） |
| Type-3 | 正则文法（Regular Grammar）              |

越往上，Grammar 能表达的结构越复杂；  
越往下，规则越简单，也越容易进行高效处理。

### CFG：上下文无关文法

在某些复杂的情况下，JSON 会出现对象的**嵌套**或**递归**：

```JSON
{
  "key1": {
    "key2": [
      { "key3": 123 }
    ]
  }
}
```

为了**完整且精确**地描述这类嵌套/递归的 JSON 格式，我们就需要依靠 **CFG（Context-Free Grammar）**，即上下文无关文法：

**“上下文无关（Context-Free）”** 的意思是：在替换或展开一个语法变量（非终结符）时，完全不需要考虑它前后相邻的字符是什么。  
即无论该变量出现在句子的什么位置、上下文环境如何，只要看到它，就可以直接按照规则替换。 
比如遇到 `<json_value>  ::= <array> | <string> | "null"`，系统不需要检查它的前后是什么文本，可以直接按照规则进行文本的替换/生成。

```BNF
; 核心递归定义
<json_value>  ::= <object> | <array> | <string> | <number> | "true" | "false" | "null"

; Object 内部包含 Value，形成了递归
<object>      ::= "{" [ <members> ] "}"
<members>     ::= <pair> | <pair> "," <members>
<pair>        ::= <string> ":" <json_value>   ; <-- 注意这里：Value 又调回了 <json_value>

; Array 内部也包含 Value，同样形成了递归
<array>       ::= "[" [ <elements> ] "]"
<elements>    ::= <json_value> | <json_value> "," <elements>  ; <-- 这里也是递归
```

因为规则中存在 `<pair> ::= <string> ":" <json_value>`，而 `<json_value>` 又包含 `<object>`，这就形成了一个**自引用闭环（递归）**。这就是 CFG 赋予 JSON 能够嵌套成千上万层的底层数学基础。

**OpenAI** 对 **Structured Outputs** 的公开技术说明，就是使用 **Context-Free Grammar（CFG）** 来表达 **JSON Schema** 产生的结构约束： 
[OpenAI: Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/)

### GBNF：GGML Backus-Naur Form

**GBNF (GGML Backus-Naur Form)** 是专门用于大语言模型推理框架的一种 **CFG 描述格式**，常用于 `llama.cpp`、`vLLM`、`ollama` 等框架。  
看起来有点晦涩，简单来说就是一种**具体的，泛用的，基于 CFG 的 Grammar 表达格式**

我们之前写的 `answer ::= "YES" | "NO"`，还有上面的递归 CFG，实际上都用的是 GBNF 的语法：由**规则名**、`::=`（定义符号）以及**匹配规则**组成。  
 
`llama.cpp` 官方文档提供了 GBNF 的具体语法以及 JSON Grammar 示例，可以用来帮助理解：[llama.cpp: GBNF Guide](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)

##  Logits Masking 和 Token Masking

我们已经有了一系列约束输出合法性的规则了，那么要如何将这个规则应用到 LLM 中呢？ 

### Logits Masking

假设模型现在已经生成到了（Schema 要求 `answer ::= "YES" | "NO"`）：

```
  "answer":
```

模型下一步可能有很多候选 token，LLM 会为每个 Token 计算出 `Logits` ，用于表示其选取的概率。而根据我们的 Grammar，只有两个 token 是合法的：

```
YES       ✅
NO        ✅
hello     ❌
world    ❌
123       ❌
...
```

因此 LLM 给每个 token 做上标记（Mask），用于辨别其合法性（ `1=合法`，`0=不合法`）：

| Token | Logit | Mask |
| ----- | ----- | ---- |
| YES   | 5.2   | 1    |
| NO    | 4.8   | 1    |
| hello | 1.5   | 0    |
| world | 0.8   | 0    |
| 123   | 0.2   | 0    |

此时，之前打上的标记会和其原有的 **Logit** 结合，对于非法 token，会把把它的 `logit` 设置成 `-∞`，最终的结果就是：

| Token | Masked Logit |
| ----- | ------------ |
| YES   | 5.2          |
| NO    | 4.8          |
| hello | -∞           |
| world | -∞           |
| 123   | -∞           |

最后再通过 **Softmax** 将 **Logit** 转化为实际输出概率，由此非法 `token` 的概率将变为 0，就不会被输出了。  这一过程就是 **Logits Masking**。  

**Softmax（归一化指数函数）** 是一个激活函数，用于将 **Logits** 转化为“各元素介于 0 到 1 之间、且所有元素之和恰好等于 1”的概率分布向量，正好用来表示最终的输出概率。这里就不展开介绍了。

| Token | Possibility |
| ----- | ----------- |
| YES   | 55%         |
| NO    | 45%         |
| hello | 0%          |
| world | 0%          |
| 123   | 0%          |

> Logits Masking 就是在 logits 层面把不允许的候选 token 屏蔽掉。

OpenAI 的[公开技术说明](https://openai.com/index/introducing-structured-outputs-in-the-api/#constrained-decoding)正是以这种方式描述：根据 **Grammar** 计算有效 token，然后对下一次 sampling 使用 mask，使无效 token 的概率降为 0。

### Token Masking

这里为什么要提到 **Token Masking** 呢？因为这个术语的**歧义**非常多。  
有的说法认为，上述生成 `0/1 Mask` 的过程是 Token Masking；有的认为，Logits Mask 本质上就是 Token Mask 在推理/生成阶段的一种具体实现形式；总之众说纷纭。  

我在这里选择把 **Token Masking** 和 **Logits Masking** 分开。  
我支持这种定义：**Token Masking** 是指有策略地隐藏或屏蔽输入序列中的部分 Token，让模型在训练或推理时看不到这些内容，从而学习到更强的上下文理解和生成能力。主要可以分为 `MLM`，`Causal Masking / Attention Mask` ，`Padding Mask` 等。  
而 **Logits Masking** 已经处于 LLM 的 **Decoding** 阶段，没有。**Token Masking** 的参与。

| **维度**      | **Token Masking（ Token 掩码 ）**                               | **Logits Masking（ Logits 掩码 ）**               |
| ----------- | ----------------------------------------------------------- | --------------------------------------------- |
| **发生阶段**    | 模型**输入与内部计算**阶段（Transformer 内部）                             | 模型**输出采样**阶段（Softmax 之前）                      |
| **作用对象**    | 已输入的 Token 序列                                               | 模型准备输出下一个 Token 的 Logits 向量                   |
| **核心目的**    | 1. 隐藏未来文本防止偷看（Casual Mask）<br>2. 填充短文本保持等长批处理（Padding Mask） | 强制模型的输出 100% 符合特定的语法/格式（如 JSON、GBNF、正则表达式）    |
| **典型算法/场景** | BERT 的 Masked LM（MLM）、GPT 的因果注意力掩码（Causal Mask）             | 受限解码（Constrained Decoding）、Structured Outputs |

之所以在这里提一下也是为了提醒大家不要搞混了，也欢迎大家有自己的理解进行探讨。

## Constrained Decoding

我们之前提到了传统 LLM 的Decoding，会因为没有约束而生成一些意料之外的结果。  
但现在不一样了，我们有 **JSON Schema** 和 **Grammar（GBNF）** 这些强硬的合法性规则，有 **Logits Masking** 来应用这些规则。   

这些对 LLM 输出的约束，构成了 **Constrained Decoding（约束解码）**：

>不依赖 `Prompt` 约束模型，而是在**模型底层的采样机制**上动手，让所有不合规的选项在数学概率上直接失效。

### 三大流派

根据约束规则的复杂度，**Constrained Decoding** 主要分为三个流派：

| **流派 / 技术方案**                 | **约束目标**                    | **常用引擎 / 工具**                     | **原理机制**                                 |
| ----------------------------- | --------------------------- | --------------------------------- | ---------------------------------------- |
| **基于正则表达式** (Regex-guided)    | 字符串匹配、邮箱/电话格式、指定枚举值         | Outlines, Guidance                | 将正则编译为有限状态自动机 (DFA)，动态屏蔽不匹配正则路径的 Token。  |
| **基于无上下文文法** (CFG / GBNF)     | 嵌套 JSON、编程语言语法 (Python/SQL) | llama.cpp (GBNF), vLLM (XGrammar) | 将 Schema 编译为状态机与下推自动机 (PDA)，跟踪递归与括号嵌套状态。 |
| **基于前缀树** (Trie-based Search) | 词表锁定、实体名提取、闭卷问答             | FLAERT, OpenAI Entity Locking     | 构建可选词表的 Trie 树，每一步只允许模型沿着树节点延伸。          |

好消息是，看到这里我们已经懂得其中之一的流派了。  
最后来总结一下 **Constrained Decoding** 的优势和局限性：

### 优势

1. **100% 格式保障**：彻底消除了由于语法错误引发的解析崩溃。
2. **节省 Token 与延时**：避免了由于格式错误触发“重新请求 LLM（Prompt Re-ask）”带来的额外 Token 开销与延时。
3. **安全拦截**：可以防止大模型在敏感字段中生成非法字符。

### 局限性

1. **无法保障语义正确”**：它只能保证输出符合语法（如格式合规的 JSON），不能保证模型填入的内容逻辑正确（如虚构事实）。
2. **CPU / 内存开销**：随着约束文法变复杂，状态机的前置计算与 Logits 掩码会有微小的性能损耗（现代引擎如 XGrammar / outlines 已将其优化至微秒级）。
3. **限制发挥**：如果约束过于严格，可能会限制模型原有的推理能力（因为强制截断了模型的最佳推理路径）。

## 参考

1. [OpenAI: Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/)
2. [Wikipedia: Chomsky Hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy)
3. [llama.cpp: GBNF Guide](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
4. [AWS: Structured outputs on Amazon Bedrock: Schema-compliant AI responses](https://aws.amazon.com/cn/blogs/machine-learning/structured-outputs-on-amazon-bedrock-schema-compliant-ai-responses/)
5. [Structured Outputs and Constrained Decoding: Building LLM Pipelines That Never Return Broken JSON](https://www.chaitanyaprabuddha.com/blog/structured-outputs-constrained-decoding)
6. [Structured Output from LLMs: Constrained JSON Decoding](https://sesen.ai/blog/structured-output-llm-constrained-decoding)