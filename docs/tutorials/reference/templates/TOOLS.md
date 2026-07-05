---
title: "TOOLS.md template"
---

# TOOLS.md - Local Notes

::: tip 先看人话
这页是从 OpenClaw 官方最新文档同步来的专题参考。新手不要一口气背完，先看标题和第一段；真正要配置这个功能时，再按步骤慢慢做。
:::

Skills define _how_ tools work. This file is for _your_ specifics : the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Related

- [Agent workspace](/tutorials/concepts/agent-workspace)
