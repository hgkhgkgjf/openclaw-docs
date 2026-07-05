---
title: "输入指示器"
sidebarTitle: "输入指示器"
description: "说明 OpenClaw 输入指示器的默认行为、typingMode 模式、刷新间隔和静默回复限制。"
---

# 输入指示器（Typing Indicators）

运行活跃时，OpenClaw 可以向聊天通道发送“正在输入”状态。`agents.defaults.typingMode` 控制什么时候开始显示，`typingIntervalSeconds` 控制刷新间隔。

---

## 默认值

未设置 `agents.defaults.typingMode` 时，OpenClaw 使用旧版行为：

- 直接聊天：模型循环开始后立即显示输入状态。
- 有提及的群聊：立即显示输入状态。
- 没有提及的群聊：只有消息文本开始流式输出后才显示。
- 心跳运行：不显示输入状态。

---

## 模式

将 `agents.defaults.typingMode` 设置为以下之一：

- `never`：永远不显示输入指示器。
- `instant`：模型循环一开始就显示，即使后面只返回静默回复 Token。
- `thinking`：收到第一个推理增量时显示，需要 `reasoningLevel: "stream"`。
- `message`：收到第一个非静默文本增量时显示，忽略 `NO_REPLY` 静默 Token。

"触发多早"的顺序：
`never` → `message` → `thinking` → `instant`

---

## 配置

```json5
{
  agents: { defaults: { typingMode: "thinking", typingIntervalSeconds: 6 } },
}
```

你可以按会话覆盖模式或节奏：

```json5
{
  session: {
    typingMode: "message",
    typingIntervalSeconds: 4,
  },
}
```

---

## 注意事项

- `message` 模式不会为仅静默回复显示输入（如用于抑制输出的 `NO_REPLY` Token）。
- `thinking` 仅在运行流式推理（`reasoningLevel: "stream"`）时触发。如果模型不发出推理增量，输入不会开始。
- 心跳永远不显示输入，无论模式如何。
- `typingIntervalSeconds` 控制刷新节奏，不控制开始时间。默认值是 6 秒。
