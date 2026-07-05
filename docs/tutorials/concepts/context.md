---
title: "上下文"
sidebarTitle: "上下文"
description: "说明 OpenClaw 上下文窗口里包含什么，如何用 /context、/status、/usage tokens 和 /compact 检查与管理。"
---

# 上下文（Context）

“上下文”就是 OpenClaw 在一次运行中发给模型的全部内容。它受模型上下文窗口限制，也就是 Token 上限。

初学者心智模型：

- 系统提示词：OpenClaw 构建的规则、工具、技能列表、时间/运行时，以及注入的工作区文件。
- 对话历史：你的消息和当前会话里的助手消息。
- 工具调用、工具结果和附件：命令输出、文件读取、图像、音频等。

上下文 _不等同于_ "记忆"：记忆可以存储在磁盘上并在稍后重新加载；上下文是当前模型窗口内的内容。

---

## 快速开始（检查上下文）

- `/status` → 快速查看"我的窗口有多满？"以及会话设置。
- `/context list` → 注入了什么 + 大致大小（按文件 + 总计）。
- `/context detail` → 更详细的分解：按文件、按工具 schema 大小、按技能条目大小和系统提示词大小。
- `/usage tokens` → 在正常回复后附加每次回复的用量信息。
- `/compact` → 将较旧的历史记录摘要为紧凑条目以释放窗口空间。

另见：[斜杠命令](/tutorials/tools/slash-commands)、[Token 使用与成本](/tutorials/concepts/usage-tracking)、[压缩](/tutorials/concepts/compaction)。

---

## 示例输出

值会根据模型、提供商（Provider）、工具策略和工作区内容而变化。

### `/context list`

```text
Context breakdown
Workspace: <workspaceDir>
Bootstrap max/file: 20,000 chars
Sandbox: mode=non-main sandboxed=false
System prompt (run): 38,412 chars (~9,603 tok) (Project Context 23,901 chars (~5,976 tok))

Injected workspace files:
- AGENTS.md: OK | raw 1,742 chars (~436 tok) | injected 1,742 chars (~436 tok)
- SOUL.md: OK | raw 912 chars (~228 tok) | injected 912 chars (~228 tok)
- TOOLS.md: TRUNCATED | raw 54,210 chars (~13,553 tok) | injected 20,962 chars (~5,241 tok)
- IDENTITY.md: OK | raw 211 chars (~53 tok) | injected 211 chars (~53 tok)
- USER.md: OK | raw 388 chars (~97 tok) | injected 388 chars (~97 tok)
- HEARTBEAT.md: MISSING | raw 0 | injected 0
- BOOTSTRAP.md: OK | raw 0 chars (~0 tok) | injected 0 chars (~0 tok)

Skills list (system prompt text): 2,184 chars (~546 tok) (12 skills)
Tools: read, edit, write, exec, process, browser, message, sessions_send, …
Tool list (system prompt text): 1,032 chars (~258 tok)
Tool schemas (JSON): 31,988 chars (~7,997 tok) (counts toward context; not shown as text)
Tools: (same as above)

Session tokens (cached): 14,250 total / ctx=32,000
```

### `/context detail`

```text
Context breakdown (detailed)
…
Top skills (prompt entry size):
- frontend-design: 412 chars (~103 tok)
- oracle: 401 chars (~101 tok)
… (+10 more skills)

Top tools (schema size):
- browser: 9,812 chars (~2,453 tok)
- exec: 6,240 chars (~1,560 tok)
… (+N more tools)
```

---

## 什么会计入上下文窗口

模型接收到的所有内容都会计入，包括：

- 系统提示词（所有部分）。
- 对话历史。
- 工具调用 + 工具结果。
- 附件/转录（图像/音频/文件）。
- 压缩摘要和修剪产物。
- 提供商"包装器"或隐藏头（不可见，但仍然计入）。

---

## OpenClaw 如何构建系统提示词

系统提示词由 OpenClaw 负责构建，每次运行时重新生成。它包括：

- 工具列表 + 简短描述。
- 技能列表（仅元数据；见下文）。
- 工作区位置。
- 时间（UTC + 如果配置了则转换为用户时间）。
- 运行时元数据（主机/操作系统/模型/思考）。
- 注入的工作区引导文件，位于 Project Context 下。

完整分解：[系统提示词](/tutorials/concepts/system-prompt)。

---

## 注入的工作区文件（Project Context）

默认情况下，OpenClaw 注入一组固定的工作区文件（如果存在）：

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md`（仅首次运行）

大型文件使用 `agents.defaults.bootstrapMaxChars`（默认 `20000` 字符）按文件截断。OpenClaw 还通过 `agents.defaults.bootstrapTotalMaxChars`（默认 `24000` 字符）对跨文件的总引导注入进行上限控制。`/context` 显示 原始 vs 注入 大小以及是否发生了截断。

---

## 技能：注入的 vs 按需加载的

系统提示词包含一个紧凑的技能列表，包括名称、描述和位置。这个列表也会消耗上下文。

技能指令默认不直接注入。模型应该只在需要时读取对应技能的 `SKILL.md`。

---

## 工具：有两种成本

工具以两种方式影响上下文：

1. 系统提示词中的工具列表文本，也就是你看到的 "Tooling" 部分。
2. 工具 schema（JSON）。这些 schema 会发给模型，方便模型调用工具。它们计入上下文，即使你看不到纯文本内容。

`/context detail` 分解了最大的工具 schema，以便你可以看到什么占主导。

---

## 命令、指令和"内联快捷方式"

斜杠命令由网关处理。有几种不同的行为：

- 独立命令：仅包含 `/...` 的消息会作为命令运行。
- 指令：`/think`、`/verbose`、`/reasoning`、`/elevated`、`/model`、`/queue` 会在模型看到消息前被剥离。
  - 仅包含指令的消息会持久化会话设置。
  - 普通消息中的内联指令作为每条消息的提示。
- 内联快捷方式：仅限白名单发送者。普通消息中的某些 `/...` Token 可以立即运行，例如 "hey /status"，并在模型看到剩余文本前被剥离。

详情：[斜杠命令](/tutorials/tools/slash-commands)。

---

## 会话、压缩和修剪（持久化的内容）

跨消息持久化的内容取决于机制：

- 普通历史会持久化在会话记录中，直到被压缩或修剪策略处理。
- 压缩会把摘要持久化到记录中，同时保留最近消息的完整内容。
- 修剪只会从本次运行的内存提示词里移除旧工具结果，不重写记录。

文档：[会话](/tutorials/concepts/session)、[压缩](/tutorials/concepts/compaction)、[会话修剪](/tutorials/concepts/session-pruning)。

---

## `/context` 实际报告什么

`/context` 可用时，会优先使用最近一次运行实际构建出来的系统提示词报告：

- `System prompt (run)`：从最后一次具备工具能力的嵌入式运行中捕获，并持久化在会话存储中。
- `System prompt (estimate)`：没有运行报告时即时估算，例如通过不生成报告的 CLI 后端运行时。

无论哪种方式，它只报告大小和主要贡献者，不会转储完整系统提示词或工具 schema。
