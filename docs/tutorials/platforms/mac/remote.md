---
title: "远程控制"
---

# 远程 OpenClaw（macOS 到远程主机）

::: tip 先看人话
这页说明 macOS App 如何控制另一台主机上的 OpenClaw Gateway。常见做法是走 SSH 隧道；如果你已经有 Tailscale Serve 或可信反向代理，也可以直连 `ws/wss`。
:::

这个流程让 macOS App 作为远程控制端，连接运行在另一台桌面机或服务器上的 OpenClaw Gateway。健康检查、Voice Wake 转发和 Web Chat 都复用 Settings 到 General 里的远程配置。

## 模式

- Local（this Mac）：所有内容都在这台 Mac 上运行，不使用 SSH。
- Remote over SSH（默认）：OpenClaw 命令在远程主机上执行。macOS App 使用 `-o BatchMode`、你选择的身份密钥和本地端口转发建立 SSH 连接。
- Remote direct（ws/wss）：不走 SSH 隧道。macOS App 直接连接 Gateway URL，例如 Tailscale Serve 或 HTTPS 反向代理地址。

## 远程传输方式

远程模式支持两种传输方式：

- SSH tunnel（默认）：使用 `ssh -N -L ...` 把 Gateway 端口转发到本机 localhost。由于隧道是 loopback，Gateway 看到的节点 IP 会是 `127.0.0.1`。
- Direct（ws/wss）：直接连接 Gateway URL。Gateway 会看到真实客户端 IP。

在 SSH tunnel 模式下，发现到的 LAN/tailnet 主机会保存为 `gateway.remote.sshTarget`。App 会把 `gateway.remote.url` 保持在本地隧道端点，例如 `ws://127.0.0.1:18789`，这样 CLI、Web Chat 和本地 node-host 服务都会使用同一个安全的 loopback 传输。

远程模式下，浏览器自动化由 CLI node host 负责，不由原生 macOS App 节点负责。App 会尽量启动已安装的 node host 服务；如果你需要从这台 Mac 控制浏览器，请用 `openclaw node install ...` 和 `openclaw node start` 安装并启动，或前台运行 `openclaw node run ...`，然后把任务发给这个具备浏览器能力的节点。

## 远程主机准备

1. 安装 Node + pnpm，并构建或安装 OpenClaw CLI（`pnpm install && pnpm build && pnpm link --global`）。
2. 确认非交互 shell 的 PATH 中能找到 `openclaw`。必要时软链接到 `/usr/local/bin` 或 `/opt/homebrew/bin`。
3. 开启 SSH key 认证。离开局域网后，建议使用 Tailscale IP 保持稳定可达。

## macOS App 设置

1. 打开 Settings 到 General。
2. 在 OpenClaw runs 下选择 Remote over SSH，并设置：
   - Transport：`SSH tunnel` 或 `Direct (ws/wss)`。
   - SSH target：`user@host`，可带 `:port`。
     - 如果 Gateway 在同一 LAN 且发布了 Bonjour，可以从发现列表中选择，自动填充该字段。
   - Gateway URL（仅 Direct 模式）：`wss://gateway.example.ts.net`，本地或 LAN 可用 `ws://...`。
   - Identity file（高级）：SSH key 路径。
   - Project root（高级）：远程命令使用的 checkout 路径。
   - CLI path（高级）：可运行的 `openclaw` 入口或二进制路径；如果远程有广播信息，会自动填充。
3. 点击 Test remote。成功表示远程 `openclaw status --json` 能正常运行。失败通常是 PATH 或 CLI 问题；exit 127 表示远程找不到 CLI。
4. 之后健康检查和 Web Chat 会自动走这条 SSH 隧道。

## Web Chat

- SSH tunnel：Web Chat 通过转发后的 WebSocket 控制端口连接 Gateway，默认端口是 18789。
- Direct（ws/wss）：Web Chat 直接连接配置的 Gateway URL。
- 现在不再有单独的 WebChat HTTP server。

## 权限

- 远程主机需要和本机一样的 TCC 授权，包括 Automation、Accessibility、Screen Recording、Microphone、Speech Recognition 和 Notifications。在那台机器上跑一次 onboarding 完成授权。
- 节点会通过 `node.list` / `node.describe` 广播权限状态，Agent 可以据此判断哪些能力可用。

## 安全注意事项

- 远程主机优先使用 loopback bind，再通过 SSH 或 Tailscale 连接。
- SSH 隧道使用严格 host-key 检查。先信任主机 key，让它写入 `~/.ssh/known_hosts`。
- 如果 Gateway 绑定到非 loopback 地址，必须启用 Gateway 认证：Token、密码，或配合 `gateway.auth.mode: "trusted-proxy"` 的身份感知反向代理。
- 参见[安全](/tutorials/gateway/security)和 [Tailscale](/tutorials/gateway/tailscale)。

## WhatsApp 登录流程（远程）

- 在远程主机上运行 `openclaw channels login --verbose`。用手机 WhatsApp 扫码。
- 如果认证过期，也在那台远程主机上重新登录。健康检查会暴露链接问题。

## 故障排查

- exit 127 / not found：非登录 shell 的 PATH 里找不到 `openclaw`。把它加入 `/etc/paths`、shell rc，或软链接到 `/usr/local/bin` / `/opt/homebrew/bin`。
- Health probe failed：检查 SSH 连通性、PATH，以及 Baileys 是否已登录（`openclaw status --json`）。
- Web Chat stuck：确认 Gateway 在远程主机上运行，转发端口和 Gateway WS 端口一致；UI 需要健康的 WS 连接。
- Node IP shows 127.0.0.1：SSH 隧道下这是预期行为。如果希望 Gateway 看到真实客户端 IP，把 Transport 切到 Direct (ws/wss)。
- Dashboard works but Mac capabilities are offline：说明 App 的 operator/control 连接正常，但 companion node 未连接或缺少命令能力。打开菜单栏设备区，检查 Mac 是否为 `paired · disconnected`。对于 `wss://*.ts.net` Tailscale Serve 端点，证书轮换后 App 会在 macOS 信任新证书时清理旧 TLS leaf pin 并重试。如果证书不被系统信任，或主机不是 Tailscale Serve 名称，请检查证书或改用 Remote over SSH。
- Voice Wake：远程模式会自动转发触发短语，不需要单独 forwarder。

## 通知声音

脚本可以通过 `openclaw` 和 `node.invoke` 为每条通知指定声音，例如：

```bash
openclaw nodes notify --node <id> --title "Ping" --body "Remote gateway ready" --sound Glass
```

App 不再提供全局“默认声音”开关；调用方按请求选择声音，或者不指定声音。

## Related

- [macOS app](/tutorials/platforms/macos)
- [Remote access](/tutorials/gateway/remote)
