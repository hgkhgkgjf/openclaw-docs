---
title: "功能特性"
sidebarTitle: "功能特性"
description: "OpenClaw 最新能力总览：多通道 Gateway、插件、模型提供商、Control UI、移动节点、媒体、工具、自动化和安全机制。"
---

# 功能特性

OpenClaw 的能力很多。新手不要一开始就背清单，可以先按“它能帮我做什么”来理解。

---

## 1. 一个 Gateway，接很多聊天软件

OpenClaw 的核心是 Gateway。你只运行一个 Gateway，就可以连接多个入口：

- Telegram
- WhatsApp
- Discord
- Slack
- Signal
- iMessage / BlueBubbles
- Google Chat
- Microsoft Teams
- Matrix
- Feishu / Lark
- LINE
- Mattermost
- Nextcloud Talk
- Nostr
- Twitch
- Zalo / Zalo Personal
- QQ Bot
- WeChat
- WebChat

你可以把它想成一个“统一收件箱”：不管消息从哪里来，最后都先到 Gateway，再由 Agent 处理。

---

## 2. 浏览器控制 UI

运行：

```bash
openclaw dashboard
```

会打开浏览器控制面板。它通常是新手最容易验证安装是否成功的地方。

控制 UI 可以用来：

- 直接和 Agent 聊天。
- 查看 Gateway 是否健康。
- 管理会话。
- 查看或调整配置。
- 管理节点和部分运行状态。

---

## 3. 插件扩展

OpenClaw 的很多新能力都通过插件接入。

插件可以做这些事：

- 增加新的模型提供商。
- 增加新的聊天通道。
- 增加新的工具。
- 增加语音、转录、图片生成、网页搜索等能力。
- 增加后台服务和自动化能力。

最新版的插件架构说明 manifest-first：先读插件清单，知道插件叫什么、能做什么、需要什么配置，再决定是否加载代码。

这能让系统更容易诊断，也更安全。

---

## 4. 多模型和本地模型

OpenClaw 支持很多模型提供商：

- OpenAI
- Anthropic
- Google
- DeepSeek
- Qwen
- Moonshot / Kimi
- OpenRouter
- LiteLLM
- Ollama
- vLLM
- SGLang
- 其他 OpenAI-compatible 或 Anthropic-compatible 服务

如果你追求隐私，可以用 Ollama、vLLM 这类本地或自托管模型。
如果你追求效果，可以用你信任的最新旗舰模型。

---

## 5. 多智能体路由

OpenClaw 可以把不同来源的消息分给不同 Agent。

例如：

- 家庭群消息走“生活助理”。
- 工作 Slack 消息走“工作助理”。
- 某个项目群走“项目专属 Agent”。

每个 Agent 可以有自己的工作区、会话和上下文，互不串台。

---

## 6. 移动节点和远程节点

节点是连接到 Gateway 的设备。

节点可以提供：

- Canvas 可视化界面。
- 相机、截图、屏幕录制。
- 语音输入和语音唤醒。
- 远程命令执行。
- 设备状态和通知能力。

节点必须经过配对批准。它不是随便连上来就能执行命令的。

---

## 7. 媒体能力

OpenClaw 不只处理文字，还可以处理：

- 图片
- 音频
- 视频
- 文档
- 语音消息转文字
- 文生图、文生视频等生成能力

具体能力取决于你启用的模型和插件。

---

## 8. 工具与自动化

Agent 可以使用工具完成任务，例如：

- 浏览网页。
- 执行命令。
- 搜索网页。
- 调用节点能力。
- 使用技能。
- 定时执行任务。
- 接收 webhook。
- 通过 heartbeat 主动检查待办。

危险工具可以配合审批、allowlist 和沙箱使用。

---

## 9. 安全默认值

OpenClaw 连接的是真实聊天软件，所以默认会把陌生输入当成不可信：

- 私信默认有配对或 allowlist 保护。
- 节点连接需要设备配对。
- 远程访问要配置认证。
- 非主会话可以放进沙箱。
- 高风险命令可以走审批。

新手只要记住：先本地跑通，再考虑远程开放。

---

## 继续阅读

- [OpenClaw 是怎么工作的](/tutorials/concepts/architecture)
- [Web 控制 UI](/tutorials/web/)
- [节点入门](/tutorials/nodes/)
- [插件专题](/tutorials/plugins/)
- [模型提供商](/tutorials/providers/)
