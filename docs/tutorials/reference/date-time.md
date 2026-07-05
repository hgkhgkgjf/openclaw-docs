---
title: "Date and time"
---

# Date and time

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

OpenClaw 默认用主机本地时间写入传输层时间戳，只在系统提示词里使用用户时区。
Provider 返回的原始时间戳会保留下来，工具语义不被改写；如果需要当前时间，可以通过 `session_status` 获取。

## 消息信封时间（默认本地时间）

入站消息会带上一个精确到秒的时间戳：

```
[Provider ... Mon 2026-01-05 16:26:34 PST] message text
```

默认情况下，这个信封时间使用主机本地时区，不跟随 provider 的时区。

可以用下面的配置覆盖默认行为：

```json5
{
  agents: {
    defaults: {
      envelopeTimezone: "local", // "utc" | "local" | "user" | IANA timezone
      envelopeTimestamp: "on", // "on" | "off"
      envelopeElapsed: "on", // "on" | "off"
    },
  },
}
```

- `envelopeTimezone: "utc"`：使用 UTC。
- `envelopeTimezone: "local"`：使用主机时区。
- `envelopeTimezone: "user"`：使用 `agents.defaults.userTimezone`，未配置时回落到主机时区。
- 也可以直接写 IANA 时区，例如 `"America/Chicago"`。
- `envelopeTimestamp: "off"`：从信封头里移除绝对时间。
- `envelopeElapsed: "off"`：移除 `+2m` 这类相对耗时后缀。

### 示例

本地时间（默认）：

```
[WhatsApp +1555 Sun 2026-01-18 00:19:42 PST] hello
```

用户时区：

```
[WhatsApp +1555 Sun 2026-01-18 00:19:42 CST] hello
```

开启相对耗时：

```
[WhatsApp +1555 +30s Sun 2026-01-18T05:19:00Z] follow-up
```

## 系统提示词里的当前日期和时间

如果已知用户时区，系统提示词会加入单独的 Current Date & Time 区块，但只写时区，不写实时钟点。这样可以减少提示词缓存失效。

```
Time zone: America/Chicago
```

Agent 需要当前时间时应调用 `session_status` 工具，状态卡片里会包含时间戳。

## 系统事件行（默认本地时间）

插入 Agent 上下文的排队系统事件，也会使用和消息信封相同的时区选择。默认是主机本地时间。

```
System: [2026-01-12 12:19:17 PST] Model switched.
```

### 配置用户时区和时间格式

```json5
{
  agents: {
    defaults: {
      userTimezone: "America/Chicago",
      timeFormat: "auto", // auto | 12 | 24
    },
  },
}
```

- `userTimezone`：设置提示词上下文里的用户本地时区。
- `timeFormat`：控制提示词里的 12/24 小时制显示；`auto` 跟随系统偏好。

## 自动检测时间格式

当 `timeFormat: "auto"` 时，OpenClaw 会读取操作系统偏好（macOS/Windows），失败时回落到 locale 格式。检测结果按进程缓存，避免重复系统调用。

## 工具 payload 与连接器时间

通道工具会返回 provider 原生时间戳，同时补充统一字段：

- `timestampMs`: epoch milliseconds (UTC)
- `timestampUtc`: ISO 8601 UTC string

原始 provider 字段会保留，便于排查和下游转换。

- Slack: epoch-like strings from the API
- Discord: UTC ISO timestamps
- Telegram/WhatsApp: provider-specific numeric/ISO timestamps

如果需要本地时间，在下游按已知时区转换。

## Related docs

- [System Prompt](/tutorials/concepts/system-prompt)
- [Timezones](/tutorials/concepts/timezone)
- [Messages](/tutorials/concepts/messages)
