---
title: "Health checks (macOS)"
---

# Health Checks on macOS

::: tip 先看人话
这页是从 OpenClaw 官方最新文档同步来的专题参考。新手不要一口气背完，先看标题和第一段；真正要配置这个功能时，再按步骤慢慢做。
:::

How to see whether the linked channel is healthy from the menu bar app.

## Menu bar

- Status dot now reflects Baileys health:
  - Green: linked + socket opened recently.
  - Orange: connecting/retrying.
  - Red: logged out or probe failed.
- Secondary line reads "linked · auth 12m" or shows the failure reason.
- "Run Health Check" menu item triggers an on-demand probe.

## Settings

- General tab gains a Health card showing: linked auth age, session-store path/count, last check time, last error/status code, and buttons for Run Health Check / Reveal Logs.
- Uses a cached snapshot so the UI loads instantly and falls back gracefully when offline.
- Channels tab surfaces channel status + controls for WhatsApp/Telegram (login QR, logout, probe, last disconnect/error).

## How the probe works

- App runs `openclaw health --json` via `ShellExecutor` every ~60s and on demand. The probe loads creds and reports status without sending messages.
- Cache the last good snapshot and the last error separately to avoid flicker; show the timestamp of each.

## When in doubt

- You can still use the CLI flow in [Gateway health](/tutorials/gateway/health) (`openclaw status`, `openclaw status --deep`, `openclaw health --json`) and tail `/tmp/openclaw/openclaw-*.log` for `web-heartbeat` / `web-reconnect`.

## Related

- [Gateway health](/tutorials/gateway/health)
- [macOS app](/tutorials/platforms/macos)
