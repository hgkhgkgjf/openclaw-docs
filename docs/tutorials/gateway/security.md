---
title: "网关安全"
sidebarTitle: "安全"
description: "OpenClaw Gateway 安全指南：Token、反向代理、远程访问、频道白名单、工具权限和节点配对。"
---

# 网关安全

OpenClaw Gateway 是总机。
总机能收消息、调模型、调用工具、连接节点，所以它一定要管好。

最需要留意的一句话：不要把没有认证的 Gateway 暴露到公网。

---

## 先记住 5 条

1. 本机使用时，优先保持 `127.0.0.1:18789`。
2. 远程访问时，用 Tailscale、SSH 隧道、VPN 或带认证的反向代理。
3. 绑定到非本机地址时，一定要设置 Token 或等价认证。
4. 聊天频道要设置白名单或配对，不要让陌生人直接使用你的 Agent。
5. `exec`、浏览器、节点摄像头、录屏这类工具要按最小权限开启。

---

## 本机访问最安全

默认情况下，OpenClaw 控制 UI 在本机打开：

```text
http://127.0.0.1:18789/
```

这表示只有当前电脑能访问。
如果你只是个人使用，这通常就是最安全、最省心的方式。

常用命令：

```bash
openclaw gateway status
openclaw dashboard
openclaw doctor
```

---

## 远程访问怎么做

如果你想从手机、另一台电脑或服务器访问 OpenClaw，推荐顺序如下：

| 方式 | 适合谁 | 说明 |
|------|--------|------|
| Tailscale | 新手和个人用户 | 像给设备组一个私人局域网 |
| SSH 隧道 | 开发者 | 不开公网端口，只临时转发 |
| VPN | 团队或家庭服务器 | 访问范围更可控 |
| 反向代理 | 有运维经验的人 | 必须配置 HTTPS、认证和转发头 |

入门看 [远程访问](/tutorials/gateway/remote) 和 [Tailscale](/tutorials/gateway/tailscale)。

---

## Token 是什么

Token 像 Gateway 的门禁卡。
如果有人知道你的 Gateway 地址，又没有认证限制，就可能尝试连接你的控制面。

建议：

- 不要把 Token 写进公开文档
- 不要把带 Token 的 URL 截图发到公开群
- 团队共享时，优先用受控代理或 VPN
- 怀疑泄露时，重新生成 Token

可以用诊断命令检查当前配置：

```bash
openclaw doctor
openclaw gateway status
```

---

## Reverse Proxy Configuration

如果你使用 nginx、Caddy、Cloudflare Tunnel、Tailscale Serve/Funnel 或 ngrok 代理 Gateway，请记住：

- 代理层要有认证，不要只靠“地址很长”
- 代理到 Gateway 时要保留 WebSocket 支持
- 不要让代理把外部请求伪装成完全可信的 localhost 请求
- 只把你明确控制的代理加入 `gateway.trustedProxies`

一个反向代理至少应该做到：

```text
外部用户 → HTTPS + 认证 → 反向代理 → OpenClaw Gateway
```

如果你只是想自己远程用，Tailscale 通常比公网反代更省心。

---

## 聊天频道安全

频道是别人和你的 Agent 说话的入口。
如果入口太开放，陌生人可能消耗你的模型额度，甚至诱导 Agent 调用工具。

建议：

- 私聊默认使用配对或白名单
- 群聊默认要求 @ 提及
- WhatsApp、Telegram、Discord 等频道都要确认发送者范围
- 新频道先用自己的小号测试，再邀请别人使用

相关页面：

- [频道总览](/tutorials/channels/)
- [配对](/tutorials/channels/pairing)
- [频道故障排查](/tutorials/channels/troubleshooting)

---

## 工具权限安全

工具让 Agent 能做事，也带来风险。

尤其注意：

- `exec` 可以运行命令
- 浏览器工具可能登录真实网站
- 节点可能提供摄像头、麦克风、录屏、位置
- 自动化任务可能在你不盯着时运行

建议先看：

- [工具系统](/tutorials/tools/)
- [执行审批](/tutorials/tools/exec-approvals)
- [沙箱](/tutorials/gateway/sandboxing)
- [节点](/tutorials/nodes/)

---

## 最小权限原则

新手可以这样做：

1. 先只开 Web 控制 UI。
2. 再开一个频道，比如 Telegram。
3. 确认白名单和配对正确。
4. 再逐步开启浏览器、exec、节点等工具。
5. 最后再配置自动化和远程访问。

一步一步来，最容易知道问题出在哪里，也最不容易把门开太大。
