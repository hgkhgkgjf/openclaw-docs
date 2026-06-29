---
title: "Raft"
sidebarTitle: "Raft"
description: "OpenClaw 通道接入：Raft External Agent。通过本机 Raft CLI 和 wake bridge 接入。"
---

# Raft

`Raft` 通道不是普通“收到消息就直接推给 Gateway”的聊天接入。
它更像一条**本机 CLI 桥接路线**：Raft 给 OpenClaw 一个经过认证的 wake 提示，OpenClaw 再通过本机 `raft` CLI 去检查消息、发送回复。

## 适合什么场景

- 你已经在用 Raft Workspace
- 你要把 OpenClaw 接成一个 Raft External Agent
- 你能在 Gateway 所在主机上安装并登录 `raft` CLI

## 安装

```bash
openclaw plugins install @openclaw/raft
openclaw gateway restart
```

## 前提条件

- 已有 Raft workspace 和 External Agent
- Gateway 主机上已经能执行 `raft`
- 对应的 `raft` profile 已经登录，并绑定到目标 External Agent

Raft 的鉴权状态由 **Raft CLI 自己**保存，OpenClaw 不替你保管这份登录态。

## 基本配置

```json5
{
  channels: {
    raft: {
      enabled: true,
      profile: "openclaw",
    },
  },
}
```

如果只有默认账户，也可以把 profile 放到 Gateway 环境里：

```bash
RAFT_PROFILE=openclaw
```

一个 Gateway 要连多个 Raft External Agent 时，可以用多账户写法：

```json5
{
  channels: {
    raft: {
      accounts: {
        support: { profile: "support-agent" },
        engineering: { profile: "engineering-agent" },
      },
    },
  },
}
```

## 它是怎么工作的

Gateway 启动后，大体会做这些事：

1. 在本机开一个仅 loopback 可见的 wake 入口
2. 启动 `raft --profile <profile> agent bridge`
3. 只接受经过认证的 wake 提示
4. 收到 wake 后，拉起一次 OpenClaw Agent 回合
5. 由 Agent 自己再去执行：

```bash
raft --profile openclaw message check
raft --profile openclaw message send
```

这意味着一个关键区别：

```text
Raft wake bridge 负责“叫醒”
真正读消息和发回复，还是靠 raft CLI
```

所以它不像 Telegram/Slack 那样天然就是“消息进来 -> 最终回复自动发回去”。

## 验证

先看基础状态：

```bash
openclaw channels status --probe
openclaw plugins inspect raft --runtime --json
```

然后从 Raft External Agent 那边发一条消息，观察 Gateway 日志是否出现 bridge 启动和 inbound wake。

## 常见排障

### `raft` 命令不存在

先在 Gateway 主机上确认：

```bash
raft --help
```

如果命令都不存在，先装 CLI，再重启 Gateway。

### bridge 一启动就退出

通常先查两件事：

1. `profile` 是否写对
2. 这个 profile 是否真的已经登录并关联目标 External Agent

最直接的办法是手动运行：

```bash
raft --profile <profile> agent bridge
```

看 CLI 自己给出的报错。

### 收到了 wake，但没有回消息

这往往不是 bridge 坏了，而是 Agent 没有权限或没有机会执行 `raft message check` / `raft message send`。

排查顺序建议：

1. 看 Agent 的工具权限
2. 看是否允许执行 `raft` 命令
3. 看日志里有没有实际调用 `message check` / `message send`

## 相关页面

- [通道总览](/tutorials/channels/)
- [插件专题](/tutorials/plugins/)
- [Gateway 总览](/tutorials/gateway/)
