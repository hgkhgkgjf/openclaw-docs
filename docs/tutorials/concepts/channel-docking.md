---
title: "Channel Docking"
sidebarTitle: "通道停靠"
---

# Channel Docking：把同一个会话的回复换到另一个聊天软件

Channel Docking 像电话转接。
同一个 OpenClaw 会话不变，但后续回复从 Telegram 换到 Discord、Slack 或其他已绑定通道。

---

## 一个例子

Alice 同时有 Telegram 和 Discord：

```json5
{
  session: {
    identityLinks: {
      alice: ["telegram:123", "discord:456"]
    }
  }
}
```

她在 Telegram 里发送：

```text
/dock_discord
```

之后同一个会话的回复就去 Discord。

---

## 不会改变什么？

Docking 不会：

- 创建新账号。
- 绕过 allowlist。
- 让陌生人共享会话。
- 把历史搬到另一个会话。
- 自动连接新的聊天平台。

它只改“这条会话以后从哪里回复”。

---

## 前提

必须配置 `session.identityLinks`，而且源发送者和目标通道身份在同一组。

这能验证：Telegram 上的你和 Discord 上的你，是同一个被授权的人。

---

## 继续阅读

- [会话管理](/tutorials/concepts/session)
- [Channel 配置](/tutorials/gateway/config-channels)
- [连接聊天软件](/tutorials/channels/)

