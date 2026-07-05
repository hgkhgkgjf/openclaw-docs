---
title: "Task Flow 任务流"
sidebarTitle: "任务流"
description: "OpenClaw 自动化：Task Flow 用来跟踪多步骤后台流程，适合跨重启、跨子任务的复杂自动化。"
---

# Task Flow 任务流

Task Flow 是比单个 Task 更高一层的“流程记录”。
如果 Task 是一张工作单，Task Flow 就是一串工作单组成的流程。

比如“生成市场日报”不是一步：

1. 检查数据源是否可用
2. 收集数据
3. 清洗数据
4. 让模型总结
5. 等你审批
6. 发送到 Slack

这就适合用 Task Flow 来跟踪。

---

## 什么时候需要 Task Flow

| 场景 | 用什么 |
|------|--------|
| 只跑一个后台任务 | [Tasks](/tutorials/automation/tasks) |
| 每天固定时间运行 | [Cron](/tutorials/automation/cron-jobs) |
| 当前对话稍后继续 | [Heartbeat 对比](/tutorials/automation/cron-vs-heartbeat) |
| 多步骤、可恢复、要跟踪进度 | Task Flow |

---

## 常用命令

```bash
openclaw tasks flow list
openclaw tasks flow show <flow-id>
openclaw tasks flow cancel <flow-id>
```

你可以把它理解成：

- `list`：看看有哪些流程
- `show`：看某个流程卡在哪一步
- `cancel`：取消整个流程和它下面还在跑的任务

---

## 和 Tasks 的关系

Task Flow 不替代 Task。
它是用多个 Task 拼出来的流程。

```text
Task Flow: weekly-report
  - Task 1: collect-data
  - Task 2: summarize
  - Task 3: wait-for-approval
  - Task 4: deliver
```

看单个后台任务，用 `openclaw tasks ...`。
看整条流程，用 `openclaw tasks flow ...`。

---

## 和 ClawFlow 的关系

旧名字 ClawFlow 已经改名为 Task Flow。
如果你在旧文档或旧配置里看到 ClawFlow，可以先按 Task Flow 理解。

