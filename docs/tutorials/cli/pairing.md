---
title: "openclaw pairing"
sidebarTitle: "pairing"
---

# `openclaw pairing`

`pairing` 用来批准“谁可以和 OpenClaw 说话”。很多聊天通道不会默认信任所有私聊用户，而是先让用户发起配对，再由你批准。

可以把它理解成门禁：有人敲门，OpenClaw 记下验证码，你确认后才放行。

```bash
openclaw pairing list
openclaw pairing list telegram
openclaw pairing approve telegram <code>
openclaw pairing approve --channel telegram --account work <code> --notify
```

## 什么时候用

- Telegram、Discord、Slack、WhatsApp 等通道里有人私聊机器人，但机器人不回复。
- 日志提示有 pending pairing request。
- 你想批准某个账号成为允许联系人。

## 最常见流程

先看某个通道有哪些待批准请求：

```bash
openclaw pairing list telegram
```

然后批准验证码：

```bash
openclaw pairing approve telegram <code>
```

如果是多账号通道，加上账号名：

```bash
openclaw pairing approve --channel telegram --account work <code>
```

## 一个很需要留意的细节

如果 OpenClaw 还没有设置命令 owner，第一次批准配对时，可能也会把这个人记录成命令 owner。owner 不是普通聊天权限，而是更高权限，能执行诊断、配置、审批等危险操作。

继续阅读：[通道配对](/tutorials/channels/pairing)。
