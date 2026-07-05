---
title: "用量跟踪"
sidebarTitle: "用量跟踪"
description: "OpenClaw 用量跟踪会读取模型提供商返回的用量和配额窗口，不自行估算账单。"
---

# 用量跟踪（Usage Tracking）

---

## 它记录什么

OpenClaw 会直接读取模型提供商的用量端点，显示对方报告的用量、配额和时间窗口。

这里不做账单预测，也不会替你估算最终费用；如果提供商没有返回用量信息，OpenClaw 就不显示这一项。

---

## 显示位置

- 聊天中的 `/status`：显示当前会话 Token、估算成本（仅 API 密钥）和当前模型提供商的用量快照（如果可用）。
- 聊天中的 `/usage off|tokens|full`：每响应用量页脚（OAuth 仅显示 Token）。
- 聊天中的 `/usage cost`：从 OpenClaw 会话日志聚合的本地成本摘要。
- CLI：`openclaw status --usage` 按提供商打印用量明细。
- CLI：`openclaw channels list` 在提供商配置旁打印相同的用量快照（使用 `--no-usage` 跳过）。
- macOS 菜单栏：Context 下的"Usage"部分（仅在可用时）。

---

## 提供商 + 凭证

- Anthropic (Claude)：认证配置文件中的 OAuth Token。
- GitHub Copilot：认证配置文件中的 OAuth Token。
- Gemini CLI：认证配置文件中的 OAuth Token。
- Antigravity：认证配置文件中的 OAuth Token。
- OpenAI Codex：认证配置文件中的 OAuth Token（存在时使用 accountId）。
- MiniMax：API 密钥（编程计划密钥；`MINIMAX_CODE_PLAN_KEY` 或 `MINIMAX_API_KEY`）；使用 5 小时编程计划窗口。
- z.ai：通过环境/配置/认证存储的 API 密钥。

如果没有匹配的 OAuth/API 凭证，用量会被隐藏。
