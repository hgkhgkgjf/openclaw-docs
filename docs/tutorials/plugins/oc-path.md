---
title: "OC Path 插件"
sidebarTitle: "OC Path"
description: "OC Path 插件为 openclaw path CLI 提供 oc:// 工作区文件寻址能力，可精确读取和修改 Markdown、JSONC、JSONL、YAML 中的单个节点。"
---

# OC Path 插件

内置的 `oc-path` 插件提供 [`openclaw path`](/tutorials/cli/path) 命令，用来处理 `oc://` 形式的工作区文件地址。

插件代码在 OpenClaw 仓库的 `extensions/oc-path/` 下，但默认不会启用。只有执行 `openclaw plugins enable oc-path` 后，CLI 才会按需加载它。

`oc://` 地址指向工作区文件里的一个具体叶子节点，也可以指向一组通配节点。当前支持这些文件类型：

- Markdown（`.md`、`.mdx`）：frontmatter、章节、列表项、字段。
- JSONC（`.jsonc`、`.json5`、`.json`）：保留注释和格式。
- JSONL（`.jsonl`、`.ndjson`）：按行处理记录。
- YAML（`.yaml`、`.yml`、`.lobster`）：通过 YAML 文档 API 处理 map、sequence、scalar 节点。

自托管用户、编辑器扩展、脚本和本地 Agent 工具可以用它读写文件里的一个小位置，而不必为每种文件格式各写一套解析器。

## 什么时候启用

当你希望脚本、hook 或本地 Agent 工具精确定位工作区状态时，可以启用 `oc-path`。例如：

- 读取一个 JSONC 配置叶子。
- 修改 Markdown frontmatter 的某个字段。
- 查找 JSONL 会话日志里的某类事件。
- 对 YAML 工作流里的一个步骤做 dry-run 修改。

它适合那些需要“小、可审查、可重复”的维护流程：先查看一个值，再查找匹配记录，先 dry-run，再只写回那个叶子节点。注释、换行和附近格式会尽量保持不变。

示例：

```bash
# 这个配置里 GitHub 插件是否启用？
openclaw path resolve 'oc://config.jsonc/plugins/github/enabled' --json

# 这个会话日志里出现过哪些 tool_call 名称？
openclaw path find 'oc://session.jsonl/[event=tool_call]/name' --json

# 这个小配置修改会写出哪些字节？
openclaw path set 'oc://config.jsonc/plugins/github/enabled' 'true' --dry-run
```

`oc-path` 不负责更高层语义。记忆写入仍由 memory 插件处理，配置管理仍由 config 命令处理，LKG 恢复和提升仍由对应逻辑处理。`oc-path` 只提供窄范围、保字节的文件寻址和编辑底层能力。

## 运行位置

插件在你执行 `openclaw` CLI 的主机上运行，不需要 Gateway 常驻，也不会打开网络端口。每个命令都是对指定文件的一次本地转换。

插件元数据位于 `extensions/oc-path/openclaw.plugin.json`：

```json
{
  "id": "oc-path",
  "name": "OC Path",
  "activation": {
    "onStartup": false,
    "onCommands": ["path"]
  },
  "commandAliases": [{ "name": "path", "kind": "cli" }]
}
```

`onStartup: false` 表示它不进入 Gateway 启动热路径。`onCommands: ["path"]` 表示第一次运行 `openclaw path ...` 时，CLI 才会懒加载插件。

## 启用和禁用

启用：

```bash
openclaw plugins enable oc-path
```

如果你同时运行 Gateway，重启一次，让 manifest 快照读到新状态。同一台主机上的 `openclaw path` 命令会立即按需加载插件。

禁用：

```bash
openclaw plugins disable oc-path
```

## 依赖

解析依赖都放在插件内部，启用 `oc-path` 不会把这些包拉进核心运行时：

| 依赖 | 用途 |
|------|------|
| `commander` | 组织 `resolve`、`find`、`set`、`validate`、`emit` 子命令 |
| `jsonc-parser` | 解析 JSONC，并在保留注释和尾逗号的前提下编辑叶子 |
| `markdown-it` | 为章节、列表项、字段模型提供 Markdown token |
| `yaml` | 解析、输出和编辑 YAML `Document`，尽量保留注释和 flow style |

JSONL 不额外引入依赖。它按行处理，每一行的 JSONC 解析仍走 `jsonc-parser`。

## 提供的能力

| 能力 | 实现位置 |
|------|----------|
| `openclaw path` CLI | `extensions/oc-path/cli-registration.ts` |
| `oc://` 解析和格式化 | `extensions/oc-path/src/oc-path/oc-path.ts` |
| 各格式 parse / emit / edit | `extensions/oc-path/src/oc-path/{md,jsonc,jsonl,yaml}` |
| 通用 resolve / find / set | `extensions/oc-path/src/oc-path/{resolve,find,edit}.ts` |
| redaction sentinel 防护 | `extensions/oc-path/src/oc-path/sentinel.ts` |

当前公开入口只有 CLI。底层 substrate verb 仍是插件内部实现；其他消费者应通过 CLI 使用，或自己基于 SDK 写插件。

## 与其他插件的关系

- `memory-*`：记忆写入走 memory 插件，不走 `oc-path`。`oc-path` 只是通用文件底层能力。
- LKG：`path` 不理解 Last-Known-Good 配置恢复。被 LKG 跟踪的文件，仍由下一次 `observe` 决定提升或恢复。面向 LKG 生命周期的原子多项 `set --batch` 仍属于计划中的能力。

## 安全

`set` 会通过 substrate 的 emit 路径写出原始字节，并自动应用 redaction sentinel 防护。

如果某个叶子包含 `__OPENCLAW_REDACTED__`，无论是完整值还是子串，写入都会被拒绝，错误码是 `OC_EMIT_SENTINEL`。CLI 输出给人或 JSON 管道时，也会把这个字面 sentinel 替换成 `[REDACTED]`，避免终端记录泄漏标记。

## 相关链接

- [`openclaw path` CLI 参考](/tutorials/cli/path)
- [管理插件](/tutorials/plugins/manage-plugins)
- [构建插件](/tutorials/plugins/building-plugins)
