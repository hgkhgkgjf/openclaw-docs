---
title: "模型 CLI"
sidebarTitle: "模型 CLI"
description: "OpenClaw 核心概念：模型 CLI。涵盖模型选择、会话固定模型、allowlist、fallback 和 /model default。"
---

# 模型 CLI

先记住一句：

```text
provider/model 选择的是模型来源，不一定等于底层运行时。
```

特别是 `openai/gpt-*` 这类模型，在当前 OpenClaw 里经常会和 Codex 运行时一起出现，所以“模型名”和“实际运行时”要分开看。

## 模型选择如何工作

OpenClaw 按以下顺序选择模型：

1. `agents.defaults.model.primary`
2. `agents.defaults.model.fallbacks`
3. 先做 provider 内部认证故障转移，再决定是否换到下一个 fallback

## 一个最近很重要的变化：会话固定模型

现在要把“配置默认模型”和“会话手动固定模型”分开理解。

### 配置默认模型

这是你在 `agents.defaults.model.primary` 里设置的值，影响：

- 新会话
- 没被手动固定模型的会话

### 会话固定模型

这些动作会把当前会话固定到某个模型：

- `/model ...`
- 某些 session patch / picker 操作

一旦固定后，这个会话不会自动跟随你后面改的默认配置。

### 想恢复继承默认配置怎么办

```text
/model default
```

这是最关键的恢复命令。

## allowlist 现在更值得注意

如果你配置了 `agents.defaults.models`，它不只是展示目录，还会成为 `/model` 和会话覆盖的白名单。

因此选了不在白名单里的模型时，OpenClaw 会在正常回复**之前**直接拒绝，用户侧很容易感觉成“没响应”。

## 在聊天中切换模型

```text
/model
/model list
/model 3
/model openai/gpt-5.2
/model default
/model status
```

最实用的记法：

- `/model xxx`：把当前会话固定到某个模型
- `/model status`：看当前会话到底在用什么
- `/model default`：清除当前会话固定模型，恢复继承默认配置

## 什么时候会走 fallback，什么时候不会

- **配置默认模型**：出问题时还能走 `fallbacks`
- **用户手动 `/model` 固定的模型**：这是严格选择，挂了就直接报错，不会静默切到别的模型
- **cron 单任务指定模型**：默认仍可使用配置回退链，除非任务自己显式清空 `fallbacks`

## 常用 CLI

```bash
openclaw models list
openclaw models status
openclaw models set <provider/model>
openclaw models set-image <provider/model>

openclaw models aliases list
openclaw models aliases add <alias> <provider/model>
openclaw models aliases remove <alias>

openclaw models fallbacks list
openclaw models fallbacks add <provider/model>
openclaw models fallbacks remove <provider/model>
openclaw models fallbacks clear
```

## 什么时候优先看这页

- 改了默认模型，但旧会话还在用老模型
- `/model` 后回复直接失败
- 想判断是模型不可用，还是 allowlist 拦住了
- 想搞清楚当前 provider/model 和 runtime 的关系

## 相关页面

- [斜杠命令](/tutorials/tools/slash-commands)
- [openclaw status](/tutorials/cli/status)
- [模型提供商](/tutorials/concepts/model-providers)
- [模型回退](/tutorials/concepts/model-failover)
