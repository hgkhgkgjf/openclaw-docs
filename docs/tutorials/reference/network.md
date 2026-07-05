---
title: "Network"
---

# Network

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

This hub links the core docs for how OpenClaw connects, pairs, and secures
devices across localhost, LAN, and tailnet.

## Core model

Most operations flow through the Gateway (`openclaw gateway`), a single long-running process that owns channel connections and the WebSocket control plane.

- Loopback first: the Gateway WS defaults to `ws://127.0.0.1:18789`.
  Non-loopback binds require a valid gateway auth path: shared-secret
  token/password auth, or a correctly configured non-loopback
  `trusted-proxy` deployment.
- One Gateway per host is recommended. For isolation, run multiple gateways with isolated profiles and ports ([Multiple Gateways](/tutorials/gateway/multiple-gateways)).
- Canvas host is served on the same port as the Gateway (`/__openclaw__/canvas/`, `/__openclaw__/a2ui/`), protected by Gateway auth when bound beyond loopback.
- Remote access is typically SSH tunnel or Tailscale VPN ([Remote Access](/tutorials/gateway/remote)).

Key references:

- [Gateway architecture](/tutorials/concepts/architecture)
- [Gateway protocol](/tutorials/gateway/protocol)
- [Gateway runbook](/tutorials/gateway)
- [Web surfaces + bind modes](/tutorials/web)

## Pairing + identity

- [Pairing overview (DM + nodes)](/tutorials/channels/pairing)
- [Gateway-owned node pairing](/tutorials/gateway/pairing)
- [Devices CLI (pairing + token rotation)](/tutorials/cli/devices)
- [Pairing CLI (DM approvals)](/tutorials/cli/pairing)

Local trust:

- Direct local loopback connects can be auto-approved for pairing to keep
  same-host UX smooth.
- OpenClaw also has a narrow backend/container-local self-connect path for
  trusted shared-secret helper flows.
- Tailnet and LAN clients, including same-host tailnet binds, still require
  explicit pairing approval.

## Discovery + transports

- [Discovery and transports](/tutorials/gateway/discovery)
- [Bonjour / mDNS](/tutorials/gateway/bonjour)
- [Remote access (SSH)](/tutorials/gateway/remote)
- [Tailscale](/tutorials/gateway/tailscale)

## Nodes + transports

- [Nodes overview](/tutorials/nodes)
- [Bridge protocol (legacy nodes, historical)](/tutorials/gateway/bridge-protocol)
- [Node runbook: iOS](/tutorials/platforms/ios)
- [Node runbook: Android](/tutorials/platforms/android)

## Security

- [Security overview](/tutorials/gateway/security)
- [Gateway config reference](/tutorials/gateway/configuration)
- [Troubleshooting](/tutorials/gateway/troubleshooting)
- [Doctor](/tutorials/gateway/doctor)

## Related

- [Gateway runbook](/tutorials/gateway)
- [Remote access](/tutorials/gateway/remote)
