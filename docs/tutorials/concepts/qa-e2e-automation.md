---
title: "QA E2E Automation"
sidebarTitle: "QA 自动化"
---

# QA E2E Automation：从端到端验证 OpenClaw 没坏

QA E2E Automation 是维护者用来跑端到端场景的体系。它会启动测试 Gateway、模拟或连接真实通道，然后检查 Agent、通道、工具、消息投递是否按预期工作。

---

## 它覆盖什么？

可能覆盖：

- QA 通道。
- Matrix、Telegram、Discord、Slack 真实通道。
- 模型 provider。
- 消息线程。
- 附件和媒体。
- exec 审批。
- OpenTelemetry 冒烟。

---

## 常见命令方向

源码 checkout 中可能使用：

```bash
pnpm qa:lab:up
pnpm openclaw qa matrix --profile fast --fail-fast
pnpm openclaw qa telegram
pnpm openclaw qa discord
pnpm openclaw qa slack
```

这些是维护者命令，npm 正式包不一定包含 QA Lab。

---

## 新手要不要跑？

普通用户不用跑。
如果你只是装 OpenClaw，用 `openclaw doctor`、`channels status --probe` 和实际发消息测试即可。

---

## 继续阅读

- [QA 测试通道](/tutorials/channels/qa-channel)
- [Matrix QA](/tutorials/concepts/qa-matrix)
- [Gateway 诊断包](/tutorials/gateway/diagnostics)

