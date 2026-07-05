---
title: "配对"
sidebarTitle: "配对"
description: "OpenClaw 配对用于批准私信发送者和节点设备，避免未知来源直接接入 Gateway。"
---

# 配对

“配对”就是让所有者明确批准访问。它主要管两件事：

1. 私信配对（谁被允许与助手对话）
2. 节点配对（哪些设备/节点被允许加入网关网络）

安全上下文：[安全](/tutorials/gateway/security)

---

## 1) 私信配对（入站聊天访问）

当通道配置了 DM 策略 `pairing` 时，未知发送者会收到一个短码，其消息不会被处理，直到你批准。

默认 DM 策略文档见：[安全](/tutorials/gateway/security)

配对码：

- 8 个字符，大写，不含易混淆字符（`0O1I`）。
- 1 小时后过期。助手只会在创建新请求时发送配对消息（大约每个发送者每小时一次）。
- 待处理的私信配对请求默认每个通道上限为 3 个；在一个过期或被批准之前，额外的请求将被忽略。

### 批准发送者

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

支持的通道：`telegram`、`whatsapp`、`signal`、`imessage`、`discord`、`slack`、`feishu`。

### 状态存储位置

存储在 `~/.openclaw/credentials/` 下：

- 待处理请求：`<channel>-pairing.json`
- 已批准白名单存储：`<channel>-allowFrom.json`

请将这些文件视为敏感数据（它们控制对你助手的访问权限）。

---

## 2) 节点设备配对（iOS/Android/macOS/无头节点）

节点以 `role: node` 的设备身份连接到网关。网关会创建一个设备配对请求，必须被批准。

### 通过 Telegram 配对（推荐用于 iOS）

如果你使用了 `device-pair` 插件，可以完全通过 Telegram 进行首次设备配对：

1. 在 Telegram 中给你的助手发消息：`/pair`
2. 助手回复两条消息：一条说明和一条单独的设置码，方便在 Telegram 中复制。
3. 在手机上打开 OpenClaw iOS 应用，进入“设置 > 网关”。
4. 粘贴设置码并连接。
5. 回到 Telegram：`/pair approve`

设置码是一个 base64 编码的 JSON 负载，包含：

- `url`：网关 WebSocket URL（`ws://...` 或 `wss://...`）
- `token`：短期有效的配对 Token

在设置码有效期间，请像对待密码一样保管它。

### 远程和局域网设置码

如果手机通过 Tailscale、公网域名或其他远程方式连接 Gateway，建议使用 Tailscale Serve/Funnel 或其他 `wss://` Gateway URL。

明文 `ws://` 设置码只接受这些安全边界内的地址：

- 本机 loopback，例如 `127.0.0.1`。
- 私有局域网地址。
- `.local` Bonjour 主机名。
- Android 模拟器 host。

Tailnet CGNAT 地址、`.ts.net` 名称和公网主机仍按 fail closed 处理，不会发出 QR/setup code。

::: tip 记不住就看这一句
家里局域网可以 `ws://`，跨网或公网就用 `wss://`。
:::

### 批准节点设备

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw devices reject <requestId>
```

### 节点配对状态存储

存储在 `~/.openclaw/devices/` 下：

- `pending.json`（短期有效；待处理请求会过期）
- `paired.json`（已配对设备 + Token）

### 说明

- 旧版 `node.pair.*` API（CLI：`openclaw nodes pending/approve`）是一个单独的网关拥有的配对存储。WS 节点仍需设备配对。

---

## 相关文档

- 安全模型 + 提示注入：[安全](/tutorials/gateway/security)
- 安全更新（运行 doctor）：[更新](/tutorials/installation/updating)
- 通道配置：
  - Telegram：[Telegram](/tutorials/channels/telegram)
  - WhatsApp：[WhatsApp](/tutorials/channels/whatsapp)
  - Signal：[Signal](/tutorials/channels/signal)
  - BlueBubbles（iMessage）：[BlueBubbles](/tutorials/channels/bluebubbles)
  - iMessage：[iMessage](/tutorials/channels/imessage)
  - Discord：[Discord](/tutorials/channels/discord)
  - Slack：[Slack](/tutorials/channels/slack)
