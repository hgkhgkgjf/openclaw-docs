---
title: "Channel UI Presentation Refactor"
sidebarTitle: "Channel UI 计划"
---

# Channel UI Presentation Refactor

这个计划关注：把“消息想表达什么”和“某个聊天平台怎么渲染”分开。

核心思路：

- Agent 输出语义化 `presentation`。
- 通道插件声明自己支持什么。
- Gateway 自动降级不支持的显示能力。
- 不让核心代码依赖 Discord、Slack、Telegram 的原生 UI 结构。

继续阅读：[消息呈现](/tutorials/plugins/message-presentation)。

## 新手比喻

Agent 先说“我要表达一个按钮、一段正文、一张图”。
Slack、Telegram、Discord 再各自决定怎么画出来。
这样核心不需要写死每个平台的 UI 细节，插件也更容易维护。
