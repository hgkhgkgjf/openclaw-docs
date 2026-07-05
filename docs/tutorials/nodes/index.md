---
title: "节点入门"
sidebarTitle: "节点"
description: "OpenClaw Nodes 节点入门：解释节点是什么、和 Gateway 有什么区别、iOS/Android/macOS/远程节点能做什么，以及如何配对和排查。"
---

# 节点入门

节点（Node）是连接到 Gateway 的设备。

它可以是你的手机、Mac、远程机器，也可以是一个无界面的 node host。节点不是 Gateway，它更像 Gateway 的“外接手脚”。

---

## 先分清 Gateway 和 Node

| 名词 | 人话解释 |
|------|----------|
| Gateway | 总服务台，负责接消息、调度 Agent、管理连接 |
| Node | 外接设备，给 Gateway 提供相机、Canvas、语音、远程命令等能力 |

举个例子：

```text
你在 Telegram 发消息
  ↓
Gateway 收到消息
  ↓
Agent 想让手机打开 Canvas 或拍照
  ↓
Gateway 调用已配对的手机 Node
```

---

## 节点能做什么

具体能力取决于平台和版本，常见能力包括：

- Canvas 可视化显示。
- [相机](/tutorials/nodes/camera)、截图、屏幕录制。
- [音频](/tutorials/nodes/audio)、[语音唤醒](/tutorials/nodes/voicewake)、朗读。
- [Talk Mode](/tutorials/nodes/talk)：实时语音、push-to-talk、只转写模式。
- [位置](/tutorials/nodes/location-command)。
- [媒体理解](/tutorials/nodes/media-understanding)。
- 远程机器命令执行。
- 设备状态、通知。

你可以把节点理解成“AI 可以请它帮忙的设备”。

---

## 节点怎么连接 Gateway

节点通过和控制 UI 类似的 WebSocket 连到 Gateway，同一个默认端口：

```text
127.0.0.1:18789
```

区别是节点连接时会声明：

```json
{
  "role": "node"
}
```

并告诉 Gateway 自己有哪些能力，例如 `canvas.*`、`camera.*`、`screen.record`、`location.get`。

支持 Talk 的节点还会声明 `talk` capability 或 `talk.*` 命令。
可信 Talk 节点默认允许这些 push-to-talk 命令：

- `talk.ptt.start`
- `talk.ptt.stop`
- `talk.ptt.cancel`
- `talk.ptt.once`

高风险命令仍然要按节点命令策略单独允许或审批。

---

## 节点需要配对

新节点不是连上就能用。Gateway 会创建配对请求，你需要批准。

常用命令：

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw devices reject <requestId>
openclaw nodes status
```

这一步像给新设备开门禁。批准后，这台设备才算被信任。

---

## 远程 node host

如果 Gateway 在一台机器上，但你想让命令在另一台机器执行，可以在另一台机器上运行 node host。

例子：

```bash
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"
```

如果 Gateway 只监听本机地址，需要先用 SSH 隧道或 Tailscale 让 node host 能安全连到它。

---

## 安全提醒

节点可以提供很强的能力，尤其是远程命令执行。所以要注意：

- 只批准你认识的设备。
- 高风险命令用 allowlist 或审批。
- 远程连接优先使用 Tailscale、VPN 或 SSH 隧道。
- 不要把 Gateway 端口直接暴露到公网。
- 节点权限变化时，重新检查配对请求。

---

## 常见问题

::: details 节点列表里看不到设备？

先确认 Gateway 在运行：

```bash
openclaw gateway status
```

再确认节点能访问 Gateway 地址和端口。如果是远程机器，优先检查 Tailscale 或 SSH 隧道。

:::

::: details 批准节点后还是不能用？

运行：

```bash
openclaw nodes status
openclaw nodes describe --node <id或名称>
```

看它是否在线，以及它声明了哪些命令能力。

:::

::: details Node 会替代 Gateway 吗？

不会。节点只是外接设备。消息入口、Agent 调度、会话管理仍然在 Gateway。

:::

---

## 继续阅读

- [Canvas 工具](/tutorials/tools/canvas)
- [节点相机](/tutorials/nodes/camera)
- [音频与语音消息](/tutorials/nodes/audio)
- [图片与媒体](/tutorials/nodes/images)
- [位置命令](/tutorials/nodes/location-command)
- [Media Understanding](/tutorials/nodes/media-understanding)
- [Talk Mode](/tutorials/nodes/talk)
- [节点故障排查](/tutorials/nodes/troubleshooting)
- [节点配对](/tutorials/channels/pairing)
- [Gateway 使用指南](/tutorials/gateway/)
- [Web 控制 UI](/tutorials/web/)
