---
title: "表情回应"
sidebarTitle: "表情回应"
description: "OpenClaw 表情回应工具说明：跨通道发送收到、完成、失败等轻量状态，减少不必要的文字回复。"
---

# 表情回应（Reactions）

表情回应让 Agent 可以给一条消息加 reaction，而不是再发一整句文字。它适合表达“收到”“完成”“失败”这类轻量状态。

---

## 为什么需要表情回应？

自动化跑起来以后，Agent 经常会处理一串消息。如果每个步骤都回复一句“收到”“处理中”“已完成”，聊天窗口很快会被刷屏。reaction 的价值就是把这些状态压到原消息上。

::: info 常见使用场景
- 确认收到消息，正在处理
- 标记任务已完成
- 标记任务失败或拒绝执行
- 表示任务正在等待外部条件
- 对用户反馈做轻量回应
:::

---

## 跨通道语义统一

各个平台的 reaction API 不一样。OpenClaw 在内部把它们收成同一套语义，Agent 不需要分别记 Telegram、Discord 或 Slack 的细节。

| 平台 | 实现方式 | OpenClaw 统一语义 |
|------|----------|-------------------|
| Telegram | 消息反应（Message Reaction） | Reactions API |
| Discord | 消息表情（Message Emoji Reaction） | Reactions API |
| Slack | 表情回应（Emoji Reaction） | Reactions API |
| Web Chat | 内置表情面板 | Reactions API |

用户在哪个平台说话都一样：Agent 调同一个接口，具体平台差异由 OpenClaw 适配层处理。

---

## Agent 如何使用表情回应

Agent 可以通过内置工具发送 reaction。下面这个例子会让 Agent 在开始处理时先标记“收到”，完成后再标记“完成”：

```bash
openclaw run "处理用户请求时，先发送 :thumbs_up: 表示收到，完成后发送 :white_check_mark:"
```

::: details 工具调用示例（开发者参考）

内部工具名是 `send_reaction`：

```json5
{
  tool: "send_reaction",
  params: {
    messageId: "msg_12345",
    emoji: ":thumbs_up:"
  }
}
```

需要撤掉 reaction 时，用 `remove_reaction`：

```json5
{
  tool: "remove_reaction",
  params: {
    messageId: "msg_12345",
    emoji: ":thumbs_up:"
  }
}
```
:::

---

## 配置

可以在配置文件里启用 reaction，并按语义指定默认表情：

```json5
{
  tools: {
    reactions: {
      enabled: true,

      // 按语义映射表情
      semantics: {
        "received": ":thumbs_up:",
        "completed": ":white_check_mark:",
        "failed": ":x:",
        "thinking": ":thinking:"
      }
    }
  }
}
```

::: tip 按通道单独配置
如果某个通道不支持 reaction，或你不想在这个通道里使用它，可以单独关闭：

```json5
{
  channels: {
    "my-webhook": {
      reactions: { enabled: false }
    }
  }
}
```
:::

---

## 注意事项

::: warning 平台限制
- Telegram 只能使用它允许的 reaction，不能随便发任意 Unicode 表情。
- Discord 机器人需要有添加 reaction 的权限，旧配置里可能没有勾上。
- Webhook 这类自定义通道可能不支持 reaction。OpenClaw 通常会忽略这次操作，而不是强行报错。
:::

---

_下一步：[工具系统总览](/tutorials/tools/)_
