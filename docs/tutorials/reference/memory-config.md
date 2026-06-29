---
title: "Memory Config"
sidebarTitle: "记忆配置"
---

# Memory Config

记忆配置决定 OpenClaw 如何保存、搜索和注入长期信息。

常见选择：

- 内置 SQLite 记忆。
- QMD 本地资料后端。
- Honcho 或外部记忆服务。
- Dreaming 后台整理。

继续阅读：[记忆 Memory](/tutorials/concepts/memory)。

## 新手怎么选

个人使用先用内置记忆，不要一开始就接复杂外部服务。
团队知识库多、数据量大、需要更强检索时，再考虑 QMD、Wiki 或外部后端。

配置后先检查：

```bash
openclaw memory status --deep
openclaw doctor
```

## 会话记录召回的最小配置

如果你希望 `memory_search` 能召回旧会话，不要只开一个实验开关就收工。

内置记忆后端常见最小配置：

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        experimental: { sessionMemory: true },
        sources: ["memory", "sessions"],
      },
    },
  },
  tools: {
    sessions: { visibility: "agent" },
  },
}
```

如果你用的是 QMD，还要再补一层会话导出：

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        experimental: { sessionMemory: true },
        sources: ["memory", "sessions"],
      },
    },
  },
  memory: {
    backend: "qmd",
    qmd: {
      sessions: { enabled: true },
    },
  },
  tools: {
    sessions: { visibility: "agent" },
  },
}
```

三个常见坑：

- 只开 `sessionMemory`，却没把 `"sessions"` 放进 `sources`
- 用 QMD，但没开 `memory.qmd.sessions.enabled`
- 保持默认 `tools.sessions.visibility = "tree"`，结果新会话看不到旧会话

默认的 `tree` 更保守，只暴露当前会话和它派生出来的子会话。
如果你要让同一 Agent 在不同 DM / 网关会话之间做历史召回，通常要有意改成 `agent`。
