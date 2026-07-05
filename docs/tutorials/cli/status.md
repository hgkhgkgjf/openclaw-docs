---
title: "openclaw status"
sidebarTitle: "status"
description: "OpenClaw CLI：status。用于快速诊断 Gateway、会话运行时、通道健康、配额和部分 SecretRef 状态。"
---

# `openclaw status`

`status` 是 OpenClaw 最适合先跑的排障命令之一。

现在它不只是“看看服务活没活着”，还会把运行时、会话模型、通道健康、配额、部分 SecretRef 诊断尽量压缩到一屏里。

```bash
openclaw status
openclaw status --all
openclaw status --deep
openclaw status --usage
openclaw status --json
```

## 它会告诉你什么

- Gateway 是否在线
- 当前版本、更新信息和 Git SHA
- 当前会话到底跑在哪个运行时
- 模型、provider、配额和部分价格/额度状态
- 通道、会话、节点、服务是否正常
- 部分 SecretRef / 凭据是否可读

## `status`、`--all`、`--deep` 怎么选

- `openclaw status`：最快，适合日常看一眼
- `openclaw status --all`：更完整，适合升级后巡检
- `openclaw status --deep`：会做真实探测，适合通道/连通性排障
- `openclaw status --usage`：重点看 provider 剩余额度或窗口占用
- `openclaw status --json`：给脚本和 CI 用

## 一个最近很需要留意的排障点：会话固定模型

如果当前会话被 `/model ...` 固定到了某个模型，而你后来又改了配置默认模型，`status` 会把这两件事一起显示出来。

这时候请记住：

```text
想恢复继承默认配置，用 /model default
```

不是重启 Gateway，也不是重新跑向导。

## `Execution` 和 `Runtime` 不一样

- `Execution`：更偏执行宿主，比如 direct、docker 等
- `Runtime`：更偏当前会话到底是 OpenClaw Default、Codex、CLI backend 还是 ACP backend

排障“为什么同一个 provider/model 行为不一样”时，这两个字段很有用。

## SecretRef / 配额诊断

新版 `status` 会尽量在只读前提下告诉你：

- 某个 SecretRef 是不是可解析
- 当前命令路径能不能拿到它
- 某些 provider 的额度还剩多少

因此看到 “token unavailable in this command path” 这类提示时，不要立刻理解成“服务挂了”，它也可能只是当前命令上下文拿不到密钥。

## 排障三连

```bash
openclaw status --all
openclaw doctor
openclaw logs --follow
```

如果 `status` 说 Gateway 不在线，再看：

```bash
openclaw gateway status
openclaw gateway restart
```

继续阅读：[Gateway 总览](/tutorials/gateway/)。
