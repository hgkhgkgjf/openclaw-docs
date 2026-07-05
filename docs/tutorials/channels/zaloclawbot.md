---
title: "Zalo ClawBot"
sidebarTitle: "Zalo ClawBot"
description: "OpenClaw 通道接入：Zalo ClawBot。通过外部插件接入，使用 Zalo Mini App QR 登录。"
---

# Zalo ClawBot

`Zalo ClawBot` 是一条和 `Zalo Personal` 不同的路线。

它不是去自动化你的个人 Zalo 客户端，而是通过外部插件接入一个更偏官方化的 Bot 路径，登录方式是 Zalo Mini App 二维码。

## 它和 Zalo Personal 的区别

| 路线 | 适合谁 | 核心方式 |
|------|------|------|
| [Zalo Personal](/tutorials/channels/zalouser) | 想直接自动化个人账号的人 | `zca-cli` 非官方自动化 |
| Zalo ClawBot | 想走更清晰插件化接入的人 | 外部插件 + Mini App QR 登录 |

## 推荐做法：直接用 onboard

```bash
openclaw onboard
```

在通道菜单里选择 Zalo ClawBot。

## 手动安装

```bash
openclaw plugins install "@zalo-platforms/openclaw-zaloclawbot@0.1.4"
openclaw config set plugins.entries.openclaw-zaloclawbot.enabled true
openclaw channels login --channel openclaw-zaloclawbot
openclaw gateway restart
```

然后用 Zalo 手机应用扫描终端里的二维码。

## 排障提示

### 二维码过期

重新执行：

```bash
openclaw channels login --channel openclaw-zaloclawbot
```

### 不确定该走哪条 Zalo 路线

优先按这个顺序判断：

1. 想走更清晰的插件化接入：先试 Zalo ClawBot
2. 想自动化个人 Zalo 账号：看 [Zalo Personal](/tutorials/channels/zalouser)

## 相关页面

- [通道总览](/tutorials/channels/)
- [Zalo Personal](/tutorials/channels/zalouser)
- [插件专题](/tutorials/plugins/)

