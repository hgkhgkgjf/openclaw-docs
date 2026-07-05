---
title: "OpenClaw 是怎么工作的（系统架构）"
sidebarTitle: "OpenClaw 是怎么工作的"
description: "用生活化语言解释 OpenClaw 最新架构：Gateway、控制 UI、通道、插件、Agent、模型、节点和安全配对。"
---

# OpenClaw 是怎么工作的？

这篇文章尽量不用术语堆人。你可以先把 OpenClaw 想成一个“AI 总服务台”。

你给它发消息，它负责找到 AI、拿到答案、再把答案送回你常用的地方。这个“地方”可以是浏览器控制台，也可以是 Telegram、WhatsApp、Discord、Slack、飞书、iMessage 等聊天软件。

---

## 一句话版

OpenClaw = 一个自托管 Gateway 网关 + 一个 AI Agent + 很多通道、插件和节点。

自托管的意思是：它运行在你自己的电脑或服务器上。你的配置、会话、记忆和很多数据默认都在你自己机器上。

再说得更白一点：

```text
你准备一台电脑当服务台。
OpenClaw 在这台电脑上值班。
你从浏览器或聊天软件发消息。
OpenClaw 去问 AI，再把答案送回来。
```

所以第一次学习时，不要先问“源码里有多少模块”。
先问：“我发出去的一句话，最后怎么回到我这里？”

---

## 用“家庭总机”来理解

以前家里有电话总机，外面打进来的电话都先到总机，再转给对应的人。

OpenClaw 也类似：

- Gateway 网关：总机，所有连接都先到它这里。
- Control UI：浏览器里的操作面板，你可以直接在里面聊天和管理配置。
- Channel 通道：Telegram、WhatsApp、Discord 等聊天软件入口。
- Agent 智能体：真正处理任务的人，负责理解问题、调用工具、组织回复。
- Model 模型：AI 大脑，比如 OpenAI、Anthropic、本地 Ollama 等。
- Plugin 插件：给系统加能力，比如新模型、新通道、新工具。
- Node 节点：手机、Mac、远程机器等设备，可以提供相机、Canvas、语音、远程命令等能力。

```text
你发消息
  ↓
通道或控制 UI
  ↓
Gateway 网关
  ↓
Agent 智能体
  ↓
模型 + 工具 + 记忆
  ↓
Gateway 网关
  ↓
原路回复给你
```

---

## 最新架构里的几个重点

### 1. Gateway 是唯一的“总入口”

官方最新版把 Gateway 定位得更清楚：它是控制平面，也是单一事实来源。

这两个词听起来很硬，翻成人话是：

- 控制平面：谁能连进来、消息往哪走、工具能不能用，都由它管。
- 单一事实来源：状态以 Gateway 这里为准，不让每个地方各说各话。

它负责：

- 管理长连接。
- 管理浏览器 Control UI。
- 管理通道连接。
- 管理节点连接。
- 校验请求格式和权限。
- 广播 `agent`、`chat`、`presence`、`health`、`heartbeat`、`cron` 等事件。

最后这一行不用背。它只是说：Gateway 会把“AI 正在回复、设备在线、服务健康、定时任务触发”等状态通知给需要知道的人。

默认地址是：

```text
127.0.0.1:18789
```

这是本机地址。默认情况下，外面的人不能直接访问。

### 2. Control UI 是新手第一站

以前很多教程会直接让你先接聊天软件。现在更推荐先打开控制 UI：

```bash
openclaw dashboard
```

它会打开浏览器界面。你可以先在浏览器里发一句话，确认 AI 能回复，再去接 Telegram 或 WhatsApp。

### 3. 通道越来越插件化

OpenClaw 支持很多聊天平台。常见的 Telegram、WhatsApp、Discord、Slack、Signal、iMessage、Google Chat、WebChat 等由 Gateway 统一管理。

更多平台通过插件提供，比如 Matrix、Mattermost、Microsoft Teams、LINE、Nostr、Twitch、Zalo、QQ、WeChat 等。

你可以把插件理解成“插排”：核心系统不必把所有电器焊死在墙里，而是通过统一接口接进来。

普通用户不需要先学习插件开发。
你只要知道：有些聊天平台是核心自带，有些是插件接入；如果某个通道打不开，可以顺手检查插件状态。

### 4. 节点是“外接设备”

节点不是另一个 Gateway。节点是连到 Gateway 的设备。

例如：

- iPhone 节点可以提供语音、Canvas、相机等能力。
- Android 节点可以提供聊天、语音、Canvas、相机等能力。
- 远程机器节点可以帮 Agent 在另一台机器上执行允许的命令。

节点连接 Gateway 时会告诉 Gateway：“我是节点，我能提供这些能力。”
比如手机节点可能提供相机和语音，远程机器节点可能提供命令执行。

### 5. 安全不只靠提示词

OpenClaw 不会只对 AI 说“你要小心”。它在代码层做限制：

- 新设备要配对批准。
- 新私信用户默认要配对或进入白名单。
- 远程访问要走 token、password、Tailscale 或可信代理。
- 会造成实际变化的操作要防止重复执行。
- 高风险工具可以走审批和沙箱。

这就像家门不是靠“请不要进来”的纸条保护，而是要有门锁、钥匙和门禁记录。

---

## 一条消息的完整旅程

假设你在 Telegram 里发：

```text
帮我整理今天的待办。
```

系统大概会这样走：

1. Telegram Bot 收到消息。
2. 通道插件把消息交给 Gateway。
3. Gateway 检查这个发送者是否允许使用。
4. Gateway 找到该消息应该进入哪个 Agent 和哪个会话。
5. Agent 读取历史上下文、记忆和当前消息。
6. Agent 选择模型和工具。
7. 模型生成回复，工具按策略执行。
8. Gateway 收到流式结果。
9. Gateway 把回复交回 Telegram 通道。
10. 你在 Telegram 里看到答案。

---

## 你应该先记住的 3 条规则

1. Gateway 要一直运行。
   它停了，所有通道和控制 UI 都会失去总服务台。

2. 先用控制 UI 验证，再接聊天软件。
   这样排查问题最简单。

3. 远程访问一定先看安全配置。
   不要随便把 `18789` 端口暴露到公网。

---

## 继续阅读

- [快速开始](/tutorials/getting-started/getting-started)
- [网关使用指南](/tutorials/gateway/)
- [Web 控制 UI](/tutorials/web/)
- [节点入门](/tutorials/nodes/)
- [插件专题](/tutorials/plugins/)
