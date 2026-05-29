---
title: "Secret Placeholder Conventions"
---

# Secret placeholder conventions

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

Use placeholders that are human-readable but do not resemble real secrets.

## Recommended style

- Prefer descriptive values like `example-openai-key-not-real` or `example-discord-bot-token`.
- For shell snippets, prefer `${OPENAI_API_KEY}` over inline token-like strings.
- Keep examples obviously fake and scoped to purpose (provider, channel, auth type).

## Avoid these patterns in docs

- Literal PEM private-key header or footer text.
- Prefixes that resemble live credentials, for example `sk-...`, `xoxb-...`, `AKIA...`.
- Realistic-looking bearer tokens copied from runtime logs.

## Example

```bash
# Good
export OPENAI_API_KEY="example-openai-key-not-real"

# Better (when the doc is about env wiring)
export OPENAI_API_KEY="${OPENAI_API_KEY}"
```
