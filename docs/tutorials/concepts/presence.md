---
title: "在线状态"
sidebarTitle: "在线状态"
description: "说明 OpenClaw 在线状态如何记录 Gateway、客户端和节点实例，以及 instanceId、TTL、去重和调试方式。"
---

# 在线状态（Presence）

OpenClaw 的在线状态是一个轻量视图，用来列出当前能看到的实例：

- Gateway 本身。
- 连接到 Gateway 的客户端，例如 macOS 应用、WebChat、CLI。

它主要服务 macOS 应用的 Instances 标签页，让 operator 快速知道哪些实例在线。

---

## 在线状态字段

在线状态条目是结构化对象，包含以下字段：

- `instanceId`（可选但建议提供）：稳定的客户端标识（通常是 `connect.client.instanceId`）
- `host`：人类友好的主机名
- `ip`：尽力而为的 IP 地址
- `version`：客户端版本字符串
- `deviceFamily` / `modelIdentifier`：硬件提示
- `mode`：`ui`、`webchat`、`cli`、`backend`、`probe`、`test`、`node` 等
- `lastInputSeconds`："距离上次用户输入的秒数"（如果已知）
- `reason`：`self`、`connect`、`node-connected`、`periodic` 等
- `ts`：最后更新时间戳（自 epoch 以来的毫秒数）

---

## 生产者（在线状态的来源）

在线状态条目由几个模块写入，最后会合并到同一张表里。

### 1）网关自身条目

Gateway 启动时会生成一个 `self` 条目。这样即使还没有客户端连接，UI 也能显示 Gateway 主机。

### 2）WebSocket 连接

每个 WebSocket 客户端都会先发送 `connect` 请求。握手成功后，Gateway 会为这个连接插入或更新一条在线状态。

#### 为什么一次性 CLI 命令不显示

CLI 经常只是为了执行一次命令临时连接。为了避免 Instances 列表被短连接刷满，`client.mode === "cli"` 不会转换为在线状态条目。

### 3）`system-event` 信标

客户端可以通过 `system-event` 方法发送更丰富的周期性信标。mac 应用使用此功能报告主机名、IP 和 `lastInputSeconds`。

### 4）节点连接（role: node）

当节点通过网关 WebSocket 以 `role: node` 连接时，网关为该节点更新插入一个在线状态条目（与其他 WS 客户端相同的流程）。

---

## 合并 + 去重规则（为什么需要 `instanceId`）

在线状态条目存在一张内存映射里：

- 条目以 presence key 为键。
- 最好的键是稳定的 `instanceId`（来自 `connect.client.instanceId`），可以在重启后保持。
- 键不区分大小写。

如果客户端重连时没有稳定的 `instanceId`，列表里可能出现重复行。

---

## TTL 和有界大小

在线状态是有意短暂的：

- TTL：超过 5 分钟的条目会被修剪。
- 最大条目数：200，超过后先丢弃最旧条目。

这保持列表新鲜并避免无界的内存增长。

---

## 远程/隧道注意事项（回环 IP）

当客户端通过 SSH 隧道/本地端口转发连接时，网关可能看到远程地址为 `127.0.0.1`。为了避免覆盖客户端报告的良好 IP，回环远程地址会被忽略。

---

## 消费者

### macOS Instances 标签页

macOS 应用渲染 `system-presence` 的输出，并根据最后更新的时间应用小的状态指示器（Active/Idle/Stale）。

---

## 调试提示

- 要查看原始列表，对网关调用 `system-presence`。
- 如果看到重复：
  - 确认客户端在握手中发送稳定的 `client.instanceId`
  - 确认周期性信标使用相同的 `instanceId`
  - 检查连接派生的条目是否缺少 `instanceId`（重复是预期的）
