---
title: "斜杠命令"
sidebarTitle: "斜杠命令"
description: "OpenClaw 工具系统：斜杠命令。理解命令、指令、内联快捷键的区别，以及 /model default 等高频排障点。"
---

# 斜杠命令（Slash Commands）

现在的 OpenClaw 里，斜杠命令不只是“发一条 `/xxx`，得到一个回复”。

你会同时遇到三类东西：

- **命令**：整条消息就是 `/...`
- **指令**：像 `/think`、`/model`，既能单独发，也能夹在普通消息里
- **内联快捷键**：像 `/status`、`/help`，会优先被 Gateway 当场处理

理解这三者的区别后，很多“为什么设置没持久化”“为什么命令没走到模型”之类的问题就好排查了。

## 三种命令形态

| 类型 | 典型例子 | 行为 |
|------|------|------|
| 命令 | `/new`、`/reset`、`/commands` | 作为独立消息发送，由 Gateway 直接处理 |
| 指令 | `/think`、`/fast`、`/verbose`、`/model` | 单独发送时会写入当前会话；和正文一起发时通常只影响当前这条消息 |
| 内联快捷键 | `/help`、`/status`、`/whoami` | 优先本地处理，再决定剩余正文是否继续发给模型 |

## 快速上手

```text
/think high
/verbose on
/model
/model default
/status
```

## 最值得先记住的 4 个点

1. **`/model xxx` 会把模型固定到当前会话。**
2. **想恢复继承默认配置，要用 `/model default`。**
3. **指令混在普通消息里时，通常只影响这一条，不会永久改会话。**
4. **`! <cmd>` 和 `/bash <cmd>` 属于主机命令，仍受权限和审批控制。**

## 高用量命令

| 命令 | 作用 |
|------|------|
| `/status` | 查看当前执行/运行时状态、Gateway 健康、模型与配额摘要 |
| `/new` | 新建会话 |
| `/reset` | 原地重置当前会话 |
| `/compact` | 压缩上下文 |
| `/think <level>` | 调整思考深度 |
| `/verbose on\|off\|full` | 切换详细输出 |
| `/trace on\|off` | 只显示插件 trace / debug 输出 |
| `/fast [status\|auto\|on\|off\|default]` | 调整快速模式 |
| `/model [name\|#\|status]` | 查看或切换会话模型 |
| `/model default` | 清除当前会话固定模型 |
| `/elevated` | 临时提升权限 |
| `/exec ...` | 调整执行宿主、审批和安全策略 |

## `/model` 现在该怎么理解

最实用的记法：

```text
/model xxx      = 把当前会话固定到 xxx
/model status   = 看当前会话到底在用什么
/model default  = 取消固定，恢复继承默认配置
```

如果你已经改了 `agents.defaults.model.primary`，但某个旧会话还是继续用之前的模型，优先怀疑这个会话之前被 `/model ...` 固定过。

## 会话级和配置级不是一回事

通过斜杠命令改的，默认是**当前会话级设置**。它不会自动回写到 `openclaw.json`。

如果你想长期生效，还是要改配置。

## 一个常见场景

```text
/think high 帮我分析这个报错
```

这种写法更像“这次请深想一点”，而不是永久把会话改成高思考模式。

## 相关页面

- [模型 CLI](/tutorials/concepts/models)
- [openclaw status](/tutorials/cli/status)
- [Web 网络工具](/tutorials/tools/web)
