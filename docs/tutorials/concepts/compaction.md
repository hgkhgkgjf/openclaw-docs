---
title: "压缩"
sidebarTitle: "压缩"
description: "OpenClaw 概念：上下文窗口与压缩（Compaction）。说明长会话接近模型上下文上限时，OpenClaw 如何摘要旧历史并保留最近消息。"
---

# 上下文窗口与压缩（Compaction）

每个模型都有一个上下文窗口，也就是它一次能看到的最大 Token 数。长时间运行的聊天会累积消息和工具结果；一旦窗口接近上限，OpenClaw 会压缩较旧的历史记录，让请求保持在限制范围内。

---

## 什么是压缩

压缩会把较旧的对话整理成一个简短摘要，同时保留最近的消息。摘要存储在会话历史中，因此后续请求使用：

- 压缩摘要
- 压缩点之后的最近消息

压缩结果会写入会话的 JSONL 历史记录。

---

## 配置

在 `openclaw.json` 中使用 `agents.defaults.compaction` 设置来配置压缩行为（模式、目标 Token 数等）。

---

## 自动压缩（默认开启）

当会话接近或超过模型的上下文窗口时，OpenClaw 会触发自动压缩，并可能使用压缩后的上下文重试原始请求。

你会看到：

- 在详细模式下显示 `Auto-compaction complete`
- `/status` 显示 `Compactions: <count>`

在压缩之前，OpenClaw 可以运行一次静默的记忆刷新轮次，将持久性笔记写入磁盘。参见[记忆](/tutorials/concepts/memory)了解详情和配置。

---

## 手动压缩

使用 `/compact`（可选附带说明）来强制执行一次压缩：

```text
/compact Focus on decisions and open questions
```

---

## 上下文窗口来源

上下文窗口是模型特定的。OpenClaw 使用配置的模型提供商（Provider）目录中的模型定义来确定限制。

---

## 压缩与修剪的区别

- 压缩（Compaction）：摘要化并写入 JSONL。
- 会话修剪（Session pruning）：只修剪旧的工具结果，只在内存中按请求进行。

参见 [/concepts/session-pruning](/tutorials/concepts/session-pruning) 了解修剪详情。

---

## 提示

- 当会话感觉陈旧或上下文臃肿时使用 `/compact`。
- 大型工具输出已经被截断；修剪可以进一步减少工具结果的累积。
- 如果需要一个全新的开始，`/new` 或 `/reset` 会开始一个新的会话 ID。
