---
title: "Building CLI backend plugins"
sidebarTitle: "CLI backend plugins"
---

# Building CLI backend plugins

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

CLI backend plugins let OpenClaw call a local AI CLI as a text inference
backend. The backend appears as a provider prefix in model refs:

```text
acme-cli/acme-large
```

Use a CLI backend when the upstream integration is already exposed as a local
command, when the CLI owns local login state, or when the CLI is a useful
fallback if API providers are unavailable.

::: info 说明
If the upstream service exposes a normal HTTP model API, write a
  [provider plugin](/tutorials/plugins/sdk-provider-plugins) instead. If the upstream
  runtime owns complete agent sessions, tool events, compaction, or background
  task state, use an [agent harness](/tutorials/plugins/sdk-agent-harness).
:::


## What the plugin owns

A CLI backend plugin has three contracts:

| Contract             | File                   | Purpose                                                   |
| -------------------- | ---------------------- | --------------------------------------------------------- |
| Package entry        | `package.json`         | Points OpenClaw at the plugin runtime module              |
| Manifest ownership   | `openclaw.plugin.json` | Declares the backend id before runtime loads              |
| Runtime registration | `index.ts`             | Calls `api.registerCliBackend(...)` with command defaults |

The manifest is discovery metadata. It does not execute the CLI and does not
register runtime behavior. Runtime behavior starts when the plugin entry calls
`api.registerCliBackend(...)`.

## Minimal backend plugin


  ### 步骤 1：Create package metadata

    ```json package.json
    {
      "name": "@acme/openclaw-acme-cli",
      "version": "1.0.0",
      "type": "module",
      "openclaw": {
        "extensions": ["./index.ts"],
        "compat": {
          "pluginApi": ">=2026.3.24-beta.2",
          "minGatewayVersion": "2026.3.24-beta.2"
        },
        "build": {
          "openclawVersion": "2026.3.24-beta.2",
          "pluginSdkVersion": "2026.3.24-beta.2"
        }
      },
      "dependencies": {
        "openclaw": "^2026.3.24"
      },
      "devDependencies": {
        "typescript": "^5.9.0"
      }
    }
    ```

    Published packages must ship built JavaScript runtime files. If your source
    entry is `./src/index.ts`, add `openclaw.runtimeExtensions` that points at
    the built JavaScript peer. See [Entry points](/tutorials/plugins/sdk-entrypoints).



  ### 步骤 2：Declare backend ownership

    ```json openclaw.plugin.json
    {
      "id": "acme-cli",
      "name": "Acme CLI",
      "description": "Run Acme's local AI CLI through OpenClaw",
      "cliBackends": ["acme-cli"],
      "setup": {
        "cliBackends": ["acme-cli"],
        "requiresRuntime": false
      },
      "activation": {
        "onStartup": false
      },
      "configSchema": {
        "type": "object",
        "additionalProperties": false
      }
    }
    ```

    `cliBackends` is the runtime ownership list. It lets OpenClaw auto-load the
    plugin when config or model selection mentions `acme-cli/...`.

    `setup.cliBackends` is the descriptor-first setup surface. Add it when
    model discovery, onboarding, or status should recognize the backend without
    loading plugin runtime. Use `requiresRuntime: false` only when those static
    descriptors are enough for setup.



  ### 步骤 3：Register the backend

    ```typescript index.ts
    import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
    import {
      CLI_FRESH_WATCHDOG_DEFAULTS,
      CLI_RESUME_WATCHDOG_DEFAULTS,
      type CliBackendPlugin,
    } from "openclaw/plugin-sdk/cli-backend";

    function buildAcmeCliBackend(): CliBackendPlugin {
      return {
        id: "acme-cli",
        liveTest: {
          defaultModelRef: "acme-cli/acme-large",
          defaultImageProbe: false,
          defaultMcpProbe: false,
          docker: {
            npmPackage: "@acme/acme-cli",
            binaryName: "acme",
          },
        },
        config: {
          command: "acme",
          args: ["chat", "--json"],
          output: "json",
          input: "stdin",
          modelArg: "--model",
          sessionArg: "--session",
          sessionMode: "existing",
          sessionIdFields: ["session_id", "conversation_id"],
          systemPromptFileArg: "--system-file",
          systemPromptWhen: "first",
          imageArg: "--image",
          imageMode: "repeat",
          reliability: {
            watchdog: {
              fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
              resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS },
            },
          },
          serialize: true,
        },
      };
    }

    export default definePluginEntry({
      id: "acme-cli",
      name: "Acme CLI",
      description: "Run Acme's local AI CLI through OpenClaw",
      register(api) {
        api.registerCliBackend(buildAcmeCliBackend());
      },
    });
    ```

    The backend id must match the manifest `cliBackends` entry. The registered
    `config` is only the default; user config under
    `agents.defaults.cliBackends.acme-cli` is merged over it at runtime.




## Config shape

`CliBackendConfig` describes how OpenClaw should launch and parse the CLI:

| Field                                     | Use                                                         |
| ----------------------------------------- | ----------------------------------------------------------- |
| `command`                                 | Binary name or absolute command path                        |
| `args`                                    | Base argv for fresh runs                                    |
| `resumeArgs`                              | Alternate argv for resumed sessions; supports `{sessionId}` |
| `output` / `resumeOutput`                 | Parser: `json`, `jsonl`, or `text`                          |
| `input`                                   | Prompt transport: `arg` or `stdin`                          |
| `modelArg`                                | Flag used before the model id                               |
| `modelAliases`                            | Map OpenClaw model ids to CLI-native ids                    |
| `sessionArg` / `sessionArgs`              | How to pass a session id                                    |
| `sessionMode`                             | `always`, `existing`, or `none`                             |
| `sessionIdFields`                         | JSON fields OpenClaw reads from CLI output                  |
| `systemPromptArg` / `systemPromptFileArg` | System prompt transport                                     |
| `systemPromptWhen`                        | `first`, `always`, or `never`                               |
| `imageArg` / `imageMode`                  | Image path support                                          |
| `serialize`                               | Keep same-backend runs ordered                              |
| `reliability.watchdog`                    | No-output timeout tuning                                    |

Prefer the smallest static config that matches the CLI. Add plugin callbacks
only for behavior that really belongs to the backend.

## Advanced backend hooks

`CliBackendPlugin` can also define:

| Hook                               | Use                                                    |
| ---------------------------------- | ------------------------------------------------------ |
| `normalizeConfig(config, context)` | Rewrite legacy user config after merge                 |
| `resolveExecutionArgs(ctx)`        | Add request-scoped flags such as thinking effort       |
| `prepareExecution(ctx)`            | Create temporary auth or config bridges before launch  |
| `transformSystemPrompt(ctx)`       | Apply a final CLI-specific system prompt transform     |
| `textTransforms`                   | Bidirectional prompt/output replacements               |
| `defaultAuthProfileId`             | Prefer a specific OpenClaw auth profile                |
| `authEpochMode`                    | Decide how auth changes invalidate stored CLI sessions |
| `nativeToolMode`                   | Declare whether the CLI has always-on native tools     |
| `bundleMcp` / `bundleMcpMode`      | Opt into OpenClaw's loopback MCP tool bridge           |

Keep these hooks provider-owned. Do not add CLI-specific branches to core when a
backend hook can express the behavior.

## MCP tool bridge

CLI backends do not receive OpenClaw tools by default. If the CLI can consume an
MCP configuration, opt in explicitly:

```typescript
return {
  id: "acme-cli",
  bundleMcp: true,
  bundleMcpMode: "codex-config-overrides",
  config: {
    command: "acme",
    args: ["chat", "--json"],
    output: "json",
  },
};
```

Supported bridge modes are:

| Mode                     | Use                                                              |
| ------------------------ | ---------------------------------------------------------------- |
| `claude-config-file`     | CLIs that accept an MCP config file                              |
| `codex-config-overrides` | CLIs that accept config overrides on argv                        |
| `gemini-system-settings` | CLIs that read MCP settings from their system settings directory |

Only enable the bridge when the CLI can actually consume it. If the CLI has its
own built-in tool layer that cannot be disabled, set `nativeToolMode:
"always-on"` so OpenClaw can fail closed when a caller requires no native tools.

## User configuration

Users can override any backend default:

```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "acme-cli": {
          command: "/opt/acme/bin/acme",
          args: ["chat", "--json", "--profile", "work"],
          modelAliases: {
            large: "acme-large-2026",
          },
        },
      },
      model: {
        primary: "openai/gpt-5.5",
        fallbacks: ["acme-cli/large"],
      },
    },
  },
}
```

Document the minimum override users are likely to need. Usually that is only
`command` when the binary is outside `PATH`.

## Verification

For bundled plugins, add a focused test around the builder and setup
registration, then run the plugin's targeted test lane:

```bash
pnpm test extensions/acme-cli
```

For local or installed plugins, verify discovery and one real model run:

```bash
openclaw plugins inspect acme-cli --runtime --json
openclaw agent --message "reply exactly: backend ok" --model acme-cli/acme-large
```

If the backend supports images or MCP, add a live smoke that proves those paths
with the real CLI. Do not rely on static inspection for prompt, image, MCP, or
session-resume behavior.

## Checklist

::: tip 验证
`package.json` has `openclaw.extensions` and built runtime entries for published packages
:::

::: tip 验证
`openclaw.plugin.json` declares `cliBackends` and intentional `activation.onStartup`
:::

::: tip 验证
`setup.cliBackends` is present when setup/model discovery should see the backend cold
:::

::: tip 验证
`api.registerCliBackend(...)` uses the same backend id as the manifest
:::

::: tip 验证
User overrides under `agents.defaults.cliBackends.<id>` still win
:::

::: tip 验证
Session, system prompt, image, and output parser settings match the real CLI contract
:::

::: tip 验证
Targeted tests and at least one live CLI smoke prove the backend path
:::


## Related

- [CLI backends](/tutorials/gateway/cli-backends) - user configuration and runtime behavior
- [Building plugins](/tutorials/plugins/building-plugins) - package and manifest basics
- [Plugin SDK overview](/tutorials/plugins/sdk-overview) - registration API reference
- [Plugin manifest](/tutorials/plugins/manifest) - `cliBackends` and setup descriptors
- [Agent harness](/tutorials/plugins/sdk-agent-harness) - full external agent runtimes
