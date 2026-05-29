---
title: "Agent runtime architecture"
---

# Agent runtime architecture

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

OpenClaw owns the built-in agent runtime directly. The runtime code lives under `src/agents/`, model/provider helpers live under `src/llm/`, and plugin-facing contracts are exposed through `openclaw/plugin-sdk/*` barrels.

## Runtime Layout

- `src/agents/embedded-agent-runner/`: built-in agent attempt loop, provider stream adapters, compaction, model selection, and session wiring.
- `src/agents/sessions/`: session persistence, extension loading, resource discovery, skills, prompts, themes, and TUI-backed tool renderers.
- `packages/agent-core/`: reusable agent core, lower-level harness types, messages, compaction helpers, prompt templates, and tool/session contracts.
- `src/agents/runtime/`: OpenClaw facade for `@openclaw/agent-core` plus local proxy utilities.
- `src/agents/agent-tools*.ts`: OpenClaw-owned tool definitions, schemas, policy, before/after hook adapters, and host edit support.
- `src/agents/agent-hooks/`: built-in runtime hooks such as compaction safeguards and context pruning.
- `src/llm/`: model/provider registry, transport helpers, and provider-specific stream implementations.

## Boundaries

Core code calls the built-in runtime through OpenClaw modules and SDK barrels, not through old external agent packages. Plugins use documented `openclaw/plugin-sdk/*` entrypoints and do not import `src/**` internals.

`@earendil-works/pi-tui` remains a third-party TUI dependency. It is used as a terminal component toolkit by the local TUI and session renderers; internalizing it would be a separate vendoring effort.

## Manifests

Resource packages declare OpenClaw resources in package metadata:

```json
{
  "openclaw": {
    "extensions": ["extensions/index.ts"],
    "skills": ["skills/*.md"],
    "prompts": ["prompts/*.md"],
    "themes": ["themes/*.json"]
  }
}
```

The package manager also discovers conventional `extensions/`, `skills/`, `prompts/`, and `themes/` directories.

## Runtime Selection

The default built-in runtime id is `openclaw`. Plugin harnesses can register additional runtime ids. `auto` selects a supporting plugin harness when one exists and otherwise uses the built-in OpenClaw runtime.

## Related

- [OpenClaw agent runtime workflow](/tutorials/reference/openclaw-agent-runtime)
- [Agent runtimes](/tutorials/concepts/agent-runtimes)
