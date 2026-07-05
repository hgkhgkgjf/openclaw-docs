---
title: "系统提示词"
sidebarTitle: "系统提示词"
description: "说明 OpenClaw 如何为每次智能体运行组装系统提示词，包括工具、安全、技能、工作区、文档、时间和运行时信息。"
---

# 系统提示词（System Prompt）

OpenClaw 会为每次智能体运行组装自己的系统提示词，不使用 pi-coding-agent 的默认提示词。

提示词由 OpenClaw 组装并注入每次智能体运行。

---

## 结构

提示词有意精简，使用固定的部分：

- Tooling：当前工具列表和简短描述。
- Safety：安全提醒，主要用于避免权力寻求行为或绕过监督。
- Skills：如果有可用技能，告诉模型如何按需加载技能指令。
- OpenClaw Self-Update：说明如何运行 `config.apply` 和 `update.run`。
- Workspace：工作目录，也就是 `agents.defaults.workspace`。
- Documentation：本地 OpenClaw 文档路径，以及什么时候应该阅读。
- Workspace Files (injected)：说明下面会注入哪些引导文件。
- Sandbox：启用沙箱时，说明运行时、沙箱路径，以及是否有提升的 exec。
- Current Date & Time：用户本地时间、时区和时间格式。
- Reply Tags：支持的提供商可用的回复标签语法。
- Heartbeats：心跳提示和确认行为。
- Runtime：主机、操作系统、Node、模型、仓库根目录和思考级别。
- Reasoning：当前可见性级别，以及 `/reasoning` 切换提示。

系统提示词中的安全护栏是建议性的。它们引导模型行为但不强制执行策略。使用工具策略、exec 审批、沙箱和通道白名单进行硬执行；操作员可以按设计禁用这些。

---

## 提示词模式

OpenClaw 可以为子智能体渲染更小的系统提示词。运行时为每次运行设置 `promptMode`（不是用户面向的配置）：

- `full`（默认）：包含上述所有部分。
- `minimal`：用于子智能体；省略 Skills、Memory Recall、OpenClaw Self-Update、Model Aliases、User Identity、Reply Tags、Messaging、Silent Replies 和 Heartbeats。Tooling、Safety、Workspace、Sandbox、Current Date & Time（已知时）、Runtime 和注入的上下文仍然可用。
- `none`：仅返回基础身份行。

当 `promptMode=minimal` 时，额外注入的提示词标记为 Subagent Context 而非 Group Chat Context。

---

## 工作区引导注入

引导文件会被裁剪后附加到 Project Context 下。这样模型不用先显式读取文件，也能看到身份和配置上下文：

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md`（仅全新工作区）
- `MEMORY.md` 和/或 `memory.md`（工作区中存在时；可能注入其中一个或两个）

这些文件会在每个轮次注入上下文窗口，所以会消耗 Token。请保持简洁，尤其是 `MEMORY.md`。它会随着时间增长，可能造成上下文占用过高，并让会话更频繁地压缩。

> 注意：`memory/*.md` 每日文件不会自动注入。它们通过 `memory_search` 和 `memory_get` 按需访问；模型没有显式读取时，不计入上下文窗口。

大型文件用标记截断。每文件最大大小由 `agents.defaults.bootstrapMaxChars`（默认：20000）控制。跨文件的总注入引导内容由 `agents.defaults.bootstrapTotalMaxChars`（默认：24000）限制。缺失的文件注入简短的缺失文件标记。

子智能体会话仅注入 `AGENTS.md` 和 `TOOLS.md`（其他引导文件被过滤以保持子智能体上下文精简）。

内部钩子可以通过 `agent:bootstrap` 拦截此步骤来修改或替换注入的引导文件（例如将 `SOUL.md` 替换为备选人设）。

要检查每个注入文件贡献了多少（原始 vs 注入、截断，加上工具 schema 开销），使用 `/context list` 或 `/context detail`。参见[上下文](/tutorials/concepts/context)。

---

## 时间处理

用户时区已知时，系统提示词会包含 Current Date & Time 部分。为了让提示词缓存更稳定，这里现在只包含时区，不放动态时钟或时间格式。

当智能体需要当前时间时使用 `session_status`；状态卡包含时间戳行。

配置：

- `agents.defaults.userTimezone`
- `agents.defaults.timeFormat`（`auto` | `12` | `24`）

参见[时区处理](/tutorials/concepts/timezone)了解完整行为详情。

---

## 技能

存在可用技能时，OpenClaw 会注入一份紧凑的可用技能列表（`formatSkillsForPrompt`），并带上每个技能的文件路径。提示词会要求模型用 `read` 在列出位置加载 `SKILL.md`。没有可用技能时，Skills 部分会省略。

```text
<available_skills>
  <skill>
    <name>...</name>
    <description>...</description>
    <location>...</location>
  </skill>
</available_skills>
```

这保持了基础提示词精简，同时仍然启用有针对性的技能使用。

---

## 文档

可用时，系统提示词会包含 Documentation 部分，指向本地 OpenClaw 文档目录。这个目录可能来自仓库工作区里的 `docs/`，也可能来自 npm 包内置文档。该部分还会列出公共镜像、源仓库、社区 Discord 和 ClawHub（[https://clawhub.ai](https://clawhub.ai)）用于技能发现。

模型应先查本地文档来确认 OpenClaw 行为、命令、配置或架构；如果有权限，也可以自行运行 `openclaw status`。只有缺少访问权限时才需要问用户。
