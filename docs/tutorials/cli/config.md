---
title: "openclaw config"
sidebarTitle: "config"
---

# `openclaw config`

`config` 用来读取、修改、校验 `openclaw.json`。它适合脚本和高级用户；新手如果不确定路径，优先用 `openclaw configure` 交互向导。

常用：

```bash
openclaw config file
openclaw config get agents.defaults.model.primary
openclaw config set plugins.entries.tokenjuice.enabled true
openclaw config validate
openclaw config schema
```

## `config set` 的值怎么解析

默认情况下，`openclaw config set` 会先尝试按 JSON5 解析；解析不了时，再把它当普通字符串写入。

例如：

```bash
openclaw config set agents.defaults.heartbeat.every "0m"
openclaw config set gateway.port 19001 --strict-json
openclaw config set channels.whatsapp.groups '["*"]' --strict-json
```

如果你加了 `--strict-json`，就表示：

- 只接受标准 JSON
- 解析失败时不会回退成普通字符串
- `--json` 现在可以继续用，但它本质上是 `--strict-json` 的旧别名

这意味着带注释、尾逗号、未加引号对象键这类 JSON5 才允许 的写法，在 `--strict-json` 下会直接报错。

实用建议：

- 想确保脚本写入的是严格结构化值，用 `--strict-json`
- 想图省事写配置片段，又接受 JSON5 风格，用默认模式
- 改完后始终跑一次 `openclaw config validate`

## 什么时候用

- 想看当前配置文件在哪里。
- 想在脚本里设置某个明确的配置路径。
- 想校验配置是否能被 Gateway 读取。
- 想把配置 schema 交给编辑器或 CI。

## 新手提醒

`config set` 会直接写配置。路径写错可能不会达到你想要的效果，所以改完一定跑：

```bash
openclaw config validate
openclaw doctor
```

继续阅读：[配置参考](/tutorials/gateway/configuration-reference)。
