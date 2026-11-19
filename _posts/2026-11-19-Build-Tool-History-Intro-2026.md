---
layout: post
title: Build Tool：构建工具演进史
subtitle: Java 的 Ant，Maven，Gradle 以及前端从 npm 到 Webpack 与 Vite
date: 2026-11-19
author: BlackDn
header-img: img/21mon1_06.jpg
catalog: true
tags:
  - Build
---
# Build Tool：构建工具演进史
## 前言

在日常开发中，我们经常执行 `build`、`test`、`install` 等命令，构建成功时，万事大吉；构建失败时，却可能需要在 Gradle、npm、数据库、环境变量和依赖仓库之间反复排查。    
有这么多工具这么多任务，再加上**软件工程的复杂程度不断增长，我们单靠手动命令已经难以可靠地管理整个构建过程。**     

于是 **Build Tool（构建工具）** 开始出现，并随之不断发展。  
比较为人熟知的就是 **Java** 从 **Ant** 演进到 **Maven** 和 **Gradle**；前端项目形成 **npm**、**webpack**、**Vite** 等工具组成的生态。

## Build Tool 的由来

在软件开发中，我们编写的代码通常不能直接运行，例如 Java：

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

需要先经过编译 `javac Main.java`，生成中间文件 `Main.class`，然后才能执行 `java Main` 运行文件。

随着项目规模扩大，除了编译之外，还会涉及：下载第三方依赖、执行单元测试、代码检查、打包等等，这些步骤统称为：**Build（构建）**    
构建的目标是：

> 将源代码转换为可以运行、部署或发布的软件产物。

但如果项目逐渐增加到数百个源文件，并且引入第三方库、自动化测试、资源文件和多个子模块，事情就会变得复杂。  
假设我们有一个包含数百个 Java 文件的大型项目，如果全部手动执行：

```
javac *.java
java ...
jar ...
```

会出现很多问题：

1. 操作繁琐：每次发布都需要执行大量命令，容易遗漏步骤。
2. 难以协作：团队成员可能不同的操作流程和顺序会导致不同构建的结果。
3. 依赖管理困难：每个人自己手动下载依赖，版本容易混乱。
4. 构建过程无法复用：相同的命令和操作不断重复，浪费时间且容易出错。

于是构建工具出现了。它们的核心目标非常简单：用配置代替手工操作，让构建过程自动化、标准化和可重复。  
**构建工具**不仅仅是把源代码编译成可执行文件的工具。在现代软件项目中，它还可以负责组织任务、管理依赖、运行测试、生成构建产物，并将这些步骤串联成一条自动化工作流。

## Build Tool 的演进

### Make：构建工具的祖先

**Make** 诞生于 1976 年，主要用于 C/C++ 项目。开发者通过编写：

```makefile
app: main.o utils.o
	gcc main.o utils.o -o app
```

定义目标（Target）、依赖（Dependency）和规则（Rule），然后通过执行 `make` 命令，自动完成构建。

Make 的一个重要贡献，是将目标（Target）、依赖（Dependency）和规则（Rule）组织成明确的**依赖关系**，并根据文件的变化判断哪些目标需要重新构建。  
这种机制使 **增量构建（Incremental Build）** 成为自动化构建中的重要能力。这一思想至今仍然影响着 Gradle、Bazel 等现代构建系统。

不过随着项目增长，配置越来越复杂，**Make** 局限性也随之体现：缺少统一标准、跨平台能力较弱、依赖管理能力不足等。于是开始出现新的构建工具。

### Java 构建工具：从脚本编排到声明式构建

#### Ant 的自动化构建

2000 年左右，Apache 推出了 **Ant**，其目标很明确：

> 为 Java 提供类似 Make 的自动化构建能力。

配置方式采用 **XML**，文件名通常为 `build.xml`：

```xml
<project>
    <target name="compile">
        ...
    </target>
</project>
```

配置完文件后，只需要执行 `ant` 就可以进行自动化构建。由于 Ant 基于 Java 实现，可以运行在不同操作系统上，相比依赖特定平台命令的构建脚本，具有更好的跨平台能力。  

但是缺点也比较明显：需要手动在 `xml` 中定义所有步骤、XML 冗长、项目之间结构不统一等。  
由于其可扩展性和灵活性太强，两个团队在没有事先约定的情况下完全可以用不同的命名定义相同的操作：

```text
Team A:
compile → test → package

Team B:
build → verify → deploy
```

久而久之，随着项目变大，维护成本会跟着水涨船高。

#### Maven：约定优于配置

2004 年，**Maven** 出现。它不仅是为了执行构建任务，也与 Java 项目**依赖管理**和标准化的需求密切相关。  
它提出了一个非常重要的思想：

> Convention over Configuration（约定优于配置）

- 默认使用 `src/main/java` 存放生产代码。
- 默认使用 `src/test/java` 存放测试代码。
- 默认采用标准的构建生命周期（ `compile`、`test`、`package` 等）。

Maven 使用 `pom.xml` 描述项目的元数据、依赖、插件和构建配置。

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

通过这样的声明，Maven 可以自动解析并下载项目所需的依赖，不再需要开发者手动下载 JAR 文件并配置每个文件的路径。

当然 Maven 也遇到了自己的瓶颈，除了 **XML 过于冗长**之外，其还难以表达动态生成代码、多环境构建、条件判断等复杂的逻辑，因此**配置灵活性有限**。再加上大型项目过多的 `Modules` 会明显延长构建速度，

#### Gradle：Build as Code

**Gradle** 于 2008 年发布了它的第一个开源版本，旨在结合并超越 Apache Ant 的灵活性以及 Apache Maven 的依赖管理与约定优于配置的特性。它的目标非常明确：

> 保留 Maven 的生态，提供更灵活的构建能力。

因此，Gradle 在 Maven 等工具已有的基础上，进一步提供了灵活的任务模型、插件机制和可编程的构建配置。

**Gradle** 支持 Groovy DSL 和 Kotlin DSL  
我定义一个名为 `hello` 的 Task，并在任务执行时输出一条信息：

```kotlin
tasks.register("hello") {
    doLast {
        println("Hello Build")
    }
}
```

**Task 任务**是 Gradle 的核心概念，如 `compileJava`，`test`，`jar` 等。Gradle 的构建过程可以根据任务依赖关系形成任务图，即 **Dependency Graph**，再按相应规则执行任务。  
与 Maven 相比，Gradle 在任务编排和构建逻辑定制方面更加灵活，同时也提供**增量构建**和**构建缓存**等能力。对于没有变化的任务会直接复用历史结果。

相比 XML，**Gradle** 脚本本身就是代码，因此可以处理条件判断，循环，封装函数等复杂逻辑。  
不过，复杂的业务逻辑可能会带来更高的维护难度（比如有很多的 `if` 或者 `for` 语句）。也因此，Gradle 的出现并不意味着对 Maven 的取代。Maven 的标准化和约定仍然具有很大价值，Gradle 则适合需要更灵活构建模型的项目。

**Java 构建工具的演进并不是简单的工具替代，而是构建自动化、依赖管理和项目标准化能力不断发展的过程。**

### JavaScript 前端工程化：从脚本引用到现代构建工具

与 Java 构建工具相对集中于项目构建不同，JavaScript 前端工程化涉及运行时环境、包管理、模块打包和开发服务器等多个领域。这些工具并不是简单的替代关系，而是在不同阶段逐渐形成协作体系。

早期，页面没那么复杂，不需要那么多效果，我们通常直接把 **JavaScript** 写在 **HTML** 中，或者通过多个 `<script>` 标签引入：

```html
<script src="utils.js"></script>
<script src="app.js"></script>
```

这种方式简单直接。但随着应用规模增长，开发者逐渐需要解决模块组织、第三方依赖、代码转换和资源优化等问题。  
需要注意的是，JavaScript 的**包管理**、**模块打包**和**构建自动化**并不是同一条工具演进路线。它们逐渐结合，形成了今天的前端工程化体系。

#### Node.js 的诞生

JavaScript 原本只能运行在浏览器，通过浏览器提供的 **JavaScript Engine** 执行，比如我们常说的 **V8 Engine** （V8 引擎）就是 Chrome 所使用的。   
但是，浏览器中的 JavaScript 受到安全沙箱限制，不能像普通后端程序一样自由访问本地文件系统或创建、管理操作系统进程。

2009 年，Ryan Dahl 发布了 **Node.js**。    
**Node.js** 是一个基于 V8 的 **JavaScript Runtime Environment（JS 运行时环境）**，它让 JavaScript 能够脱离浏览器运行，并提供文件系统（File System）、网络通信（HTTP）、进程管理（Process）等能力。  
这带来了一个重要变化：JavaScript 不再只能用于浏览器端开发，也可以用于服务端程序、命令行工具以及开发工具链。

> Node.js 让 JavaScript 不再只是浏览器语言，而成为一门通用开发语言。

随着 JavaScript 应用场景的扩展，开发者开始编写和分享越来越多的通用代码与工具，将某个功能封装成一个独立的模块，供其他项目重复使用。

然而，如何方便地复用、分享和管理这些代码，也逐渐成为一个新的问题。  
在早期的前端开发中，开发者通常需要手动下载第三方 JavaScript 文件，将它们放进项目目录，再通过 HTML 引入。  
这种方式存在不少问题：

- **依赖管理困难**：需要自行下载、保存和维护第三方库及其版本。
- **加载顺序复杂**：如果一个 JavaScript 文件依赖另一个文件，就必须保证依赖项先加载。
- **代码复用不便**：不同项目需要重复下载和维护相同的库。
- **全局命名空间污染（Global Namespace Pollution）**：传统的浏览器 Script 加载模式缺乏天然的模块隔离机制，不同文件之间容易出现全局变量命名冲突。

#### npm：包管理工具

2009 年，Isaac Z. Schlueter 开始开发 **npm**，并于 2010 年推出了较为成熟的版本。  

npm 最初主要服务于 Node.js 生态，旨在帮助开发者更方便地安装、管理和发布可复用的 JavaScript 包（Package）。通过 npm，开发者不再需要手动下载和维护每一个第三方库，而是可以通过命令行安装所需的依赖，并借助 `package.json` 等文件记录项目的依赖信息。

如今，npm 已是 JavaScript 生态中重要的 **包管理工具（Package Management Tool）**，其由多个部分组成，包括**命令行工具（CLI）**、**Registry** 和用于发现软件包的网站。

开发者可以将依赖声明在 `package.json` 中：

```json
{
  "name": "demo",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack"
  },
  "devDependencies": {
    "webpack": "^5.0.0"
  }
}
```

执行：

```bash
npm install
npm run build
```

这两条命令承担着不同的工作：`npm install` 负责安装依赖，`npm run build` 则执行我们定义的构建脚本。  
由于我们在 `package.json` 中声明了 `"build": "webpack"`，即通过 **webpack** 进行项目构建。

#### Bundle：工程化打包输出

随着项目规模增长，浏览器需要加载的 JavaScript 模块数量也会增加。大量独立模块可能带来更多网络请求和模块加载开销，尤其是在 HTTP/1.1 时代，这类问题更加明显。   
于是工程化工具会把这些模块打包成少量文件，将项目中的多个模块及其依赖关系进行分析、处理，再将它们组织成一个或多个可供浏览器加载的输出文件的过程。  
这个打包的过程称为 **Bundling**，而打包的结果称为 **Bundle**，负责完成这个过程的工具叫作 **Bundler（模块打包工具）**。

```
500 个 JS 文件
↓
bundle.js
```

Bundle 的主要作用是将模块及其依赖组织成适合浏览器加载的资源。现代 Bundler 通常还会结合 **Tree Shaking**、**Code Splitting** 和 **Minification** 等优化手段，减少无用代码和资源体积，改善应用加载性能。

#### Webpack：模块打包工具

理论上，开发者可以自己手动把多个 JavaScript 文件合并成一个文件，也就是自己手动进行 **Bundling**。但实际情况要更加复杂：

- 一个模块可能依赖多个其他模块。
- 依赖模块本身又可能有自己的依赖。
- 项目中不仅有 JavaScript，还有 CSS、图片、字体等资源。
- 不同浏览器对 JavaScript 语法的支持程度不同，还需要代码转换。

如果所有事情都由开发者手动处理，维护成本相当高。于是，**Module Bundler（模块打包工具）** 开始发挥作用。它能够从项目入口出发，自动分析模块之间的依赖关系，递归构建 **Dependency Graph（依赖关系图）**，然后按照规则完成模块处理和打包。

**Webpack** 是一个非常流行的静态模块打包工具（Static Module Bundler），它从一个或多个**入口文件（Entry）** 开始，分析项目中的模块依赖关系，**构建依赖图（Dependency Graph）**，通过 **Loaders** 将不同类型的文件转换为模块，并通过 **Plugins** 扩展构建流程中的各种能力。最终将所需模块打包成一个或多个 Bundle，供浏览器加载。


```
Entry [指定应用的入口模块]
↓
Dependency Graph [递归分析模块之间的依赖关系]
↓
Loaders & Plugins [转换模块、处理资源、扩展构建能力]
↓
Output [生成一个或多个 Bundle 及其他资源]
```

#### Vite：现代前端工程化构建

Webpack 传统的开发模式通常需要在启动开发服务器之前，对整个应用进行模块分析和打包。随着项目越来越大，启动时间和热更新速度可能受到影响。  

2020年， Vue.js 的作者尤雨溪（Evan You）发布 **Vite** 首个公开原型版本，利用了现代浏览器对 Native ES Modules 的支持，改变了开发阶段的工作方式：

- **Dev 开发阶段（No-Bundle）**：按需提供源代码模块，浏览器通过原生 ESM 加载；按需编译并返回源码。

在**开发阶段**，传统 Bundler 通常需要提前处理整个应用的模块依赖，而 Vite 则通过 Dev Server 按需提供源代码模块。当浏览器请求某个模块时，Vite 才对其进行必要的转换，并通过原生 ESM 加载。这种方式减少了开发服务器启动前的整体打包工作量。

不过，npm 中的第三方依赖并不一定都是浏览器可以直接使用的 ESM 格式。为此，Vite 引入了 **Dependency Pre-Bundling（依赖预构建）**，提前处理 CommonJS、UMD 等模块格式，同时合并部分包含大量内部模块的依赖，减少浏览器的请求数量。

此外，Vite 还提供了 **HMR（Hot Module Replacement，热模块替换）**。当开发者修改代码时，Vite 可以通过 WebSocket 通知浏览器更新相应模块，而不需要重新加载整个页面，从而提高开发反馈速度。

- **Prod 生产阶段**：早期默认采用预配置的 Rollup 进行打包优化，后期逐步向基于 Rust 的 Rolldown 演进，以统一开发与生产环境的构建体验，生成适合部署的静态资源。

虽然开发阶段采用 No-Bundle，但**生产环境**仍然需要进行打包优化。避免直接部署大量相互依赖的独立模块，产生的网络请求及加载开销。Vite 会通过 Bundling、Tree Shaking、Code Splitting 和 Minification 等方式，生成适合部署的静态资源。

在底层实现上，Vite 最初采用 esbuild 进行依赖预构建，使用 Rollup 进行生产构建。随着工具链的发展，Vite 8 开始采用基于 Rust 的 Rolldown 作为核心打包工具，并结合 Oxc 处理代码解析、转换和压缩，进一步统一开发与生产环境的构建能力。

相比传统 Bundler，Vite 更加注重开发体验，通过利用现代浏览器能力和更快的底层工具链，降低前端工程化的配置与维护成本。

### 小结

最初的 **Make**，通过定义目标、依赖和规则来自动执行编译任务；   
Java 生态中的 **Ant、Maven 和 Gradle**，逐步完善构建任务编排、依赖管理和项目标准化；  
JavaScript 生态中的 **Node.js、npm、Webpack 和 Vite**，解决运行环境、包管理、模块打包以及现代前端开发体验等问题。构建工具的职责早已不再局限于编译代码，而是逐渐覆盖了软件从开发、测试到打包和发布的整个过程。

需要注意的是，这些工具并不是简单的替代关系。它们解决的问题各不相同，也经常协同工作：npm 负责管理 JavaScript 依赖，Webpack 和 Vite 负责前端模块处理与构建，而 Gradle 和 Maven 则承担 Java 项目的构建与依赖管理。

> 构建工具的演进，本质上是软件工程复杂度不断增长后，开发者对自动化、标准化和效率持续追求的结果。


## 参考

1. [GNU Make Manual](https://www.gnu.org/software/make/manual/make.html)
2. [Apache Ant](https://ant.apache.org/manual/)
3. [Maven – Introduction to the POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html) 
4. [Gradle – Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
5. [Gradle's Evolution – A Conversation with Adam Murdoch](https://blog.gradle.org/gradles-evolution-a-conversation-with-adam-murdoch)
6. [Node.js – About](https://nodejs.org/en/about)
7. [About npm](https://docs.npmjs.com/about-npm)
8. [Webpack – Concepts](https://webpack.js.org/concepts/)
9. [Why Vite?](https://vite.dev/guide/why)
10. [Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8)