---
title: "openclaw qr"
sidebarTitle: "qr"
---

# `openclaw qr`

用于二维码相关流程，例如某些通道登录、配对或设备连接。

## 什么时候用

- 通道登录需要扫码。
- 设备或节点配对流程显示二维码。
- 终端里需要重新显示二维码。

## 新手提醒

二维码通常有有效期。如果扫码失败、提示过期或手机没反应，重新生成即可。
如果多次失败，问题一般不在二维码本身，而在网络、账号登录状态或 Gateway 是否可达。

移动端配对时还要注意 URL 安全规则：

- 私有局域网地址和 `.local` Bonjour 主机可以继续用 `ws://`。
- Tailscale `.ts.net`、Tailnet CGNAT 地址和公网地址不要用 `ws://`，请用 Tailscale Serve/Funnel 或 `wss://`。
- 如果加了 `--remote`，需要配置 `gateway.remote.url`，或者开启 `gateway.tailscale.mode=serve|funnel`。

排障顺序：

```bash
openclaw channels status --probe
openclaw logs --follow
openclaw doctor
```

## 常见误会

二维码只是登录或配对的载体，不是账号本身。
如果重复扫码失败，通常要查账号状态、网络、手机端权限或 Gateway 连接，而不是一直刷新二维码。
