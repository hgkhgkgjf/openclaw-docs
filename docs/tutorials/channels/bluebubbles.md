---
title: "BlueBubbles（已移除）"
sidebarTitle: "BlueBubbles（已移除）"
description: "OpenClaw 已移除 BlueBubbles 通道支持。新的 iMessage 接入请使用内置 imessage 插件和 imsg。"
---

# BlueBubbles（已移除）

::: danger 先看人话
不要再按旧教程配置 `channels.bluebubbles`。

OpenClaw 现在的 iMessage 路线是内置 `imessage` 插件 + [`imsg`](https://github.com/steipete/imsg)。BlueBubbles 支持已经从官方文档中移除。
:::

如果你是新用户，直接看：

- [iMessage](/tutorials/channels/imessage)

如果你以前已经有 BlueBubbles 配置，按迁移页走：

- [从 BlueBubbles 迁移到 iMessage](/tutorials/channels/imessage-from-bluebubbles)
- [BlueBubbles 移除公告](/tutorials/reference/announcements-bluebubbles-imessage)

---

## 为什么不能继续照旧配置

旧配置通常长这样：

```json5
{
  channels: {
    bluebubbles: {
      enabled: true,
      serverUrl: "http://192.168.1.100:1234",
      password: "example-password"
    }
  }
}
```

这条路线依赖 BlueBubbles Server、REST API 和 Webhook。
官方最新 OpenClaw 已经不再把它作为支持通道。

新路线不再使用：

- `channels.bluebubbles`
- `serverUrl`
- `password`
- BlueBubbles Webhook
- BlueBubbles Server 安装步骤

---

## 新路线是什么

新路线使用：

- `channels.imessage`
- `imsg rpc`
- macOS Messages.app
- 本地 CLI 或 SSH wrapper

最小示意：

```json5
{
  channels: {
    imessage: {
      enabled: true,
      cliPath: "/opt/homebrew/bin/imsg",
      dmPolicy: "pairing"
    }
  }
}
```

验证顺序：

```bash
imsg chats --limit 3
imsg rpc --help
openclaw channels status --probe --channel imessage
```

---

## 迁移时最容易漏什么

BlueBubbles 和 iMessage 有些行为配置可以搬过去，但传输配置不能搬。

可以搬：

- `dmPolicy`
- `allowFrom`
- `groupPolicy`
- `groupAllowFrom`
- `groups`
- `includeAttachments`
- `attachmentRoots`
- `mediaMaxMb`
- `textChunkLimit`
- `coalesceSameSenderDms`
- `actions`

不能搬：

- `serverUrl`
- `password`
- Webhook URL
- BlueBubbles Server 设置

::: warning 群聊最容易踩坑
如果你用 `groupPolicy: "allowlist"`，一定要带上 `groups`。

最小可用配置：

```json5
{
  channels: {
    imessage: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15555550123"],
      groups: {
        "*": { requireMention: true }
      }
    }
  }
}
```

只搬 `groupAllowFrom` 但忘了 `groups`，群消息会被丢掉。
:::

---

## 下一步

按顺序读：

1. [iMessage](/tutorials/channels/imessage)
2. [从 BlueBubbles 迁移到 iMessage](/tutorials/channels/imessage-from-bluebubbles)
3. [配对](/tutorials/channels/pairing)
