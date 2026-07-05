---
title: grammY
sidebarTitle: "grammY"
description: "OpenClaw 的 Telegram 通道已切到 grammY 客户端。本页说明为什么选 grammY、当前实现、配置项和后续待补事项。"
---

# grammY 集成（Telegram Bot API）

## 为什么选择 grammY

- TypeScript 优先的 Bot API 客户端，内置长轮询 + Webhook 助手、中间件、错误处理、速率限制器。
- 比手动编写 fetch + FormData 更简洁的媒体助手；支持所有 Bot API 方法。
- 可扩展：通过自定义 fetch 支持代理、会话中间件（可选）、类型安全上下文。

## 当前实现

基于 fetch 的旧实现已经移除。grammY 现在是 Telegram 通道唯一的客户端路径，发送和 Gateway 监听都走它，默认启用 grammY 节流器。

`monitorTelegramProvider` 会创建一个 grammY `Bot`，然后接入提及和白名单门控。媒体下载走 `getFile` / `download`，回复投递走 `sendMessage`、`sendPhoto`、`sendVideo`、`sendAudio`、`sendDocument`。长轮询和 Webhook 都通过 `webhookCallback` 接入。

代理配置仍然放在 `channels.telegram.proxy`，实现上通过 grammY 的 `client.baseFetch` 使用 `undici.ProxyAgent`。

Webhook 相关代码分成两块：`webhook-set.ts` 封装 `setWebhook` / `deleteWebhook`，`webhook.ts` 托管回调、健康检查和优雅关闭。配置了 `channels.telegram.webhookUrl` 与 `channels.telegram.webhookSecret` 时，Gateway 使用 Webhook；否则使用长轮询。

会话路由规则如下：

- 直接聊天折叠到智能体主会话：`agent:<agentId>:<mainKey>`。
- 群组使用 `agent:<agentId>:telegram:group:<chatId>`。
- 回复会回到同一个 Telegram 通道。

常用配置项：

- `channels.telegram.botToken`
- `channels.telegram.dmPolicy`
- `channels.telegram.groups`
- `channels.telegram.allowFrom`
- `channels.telegram.groupAllowFrom`
- `channels.telegram.groupPolicy`
- `channels.telegram.mediaMaxMb`
- `channels.telegram.linkPreview`
- `channels.telegram.proxy`
- `channels.telegram.webhookSecret`
- `channels.telegram.webhookUrl`
- `channels.telegram.webhookHost`

`channels.telegram.streamMode` 可以在私有话题聊天中使用 `sendMessageDraft`（Bot API 9.3+）。这是 Telegram 草稿流，和通道块流式输出是两套机制。

测试目前覆盖了私信、群组提及门控和出站发送。媒体与 Webhook 场景还可以继续补。

## 待补事项

- 如果遇到 Bot API 429 错误，可选 grammY 插件（节流器）。
- 添加更多结构化媒体测试（贴纸、语音消息）。
- 使 Webhook 监听端口可配置（目前固定为 8787，除非通过网关连接）。
