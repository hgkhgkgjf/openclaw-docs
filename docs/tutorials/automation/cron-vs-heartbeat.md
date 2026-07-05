---
title: "Cron 与 Heartbeat 对比"
sidebarTitle: "Cron vs Heartbeat"
description: "OpenClaw 自动化：Cron 与 Heartbeat 对比。固定间隔巡检用 Heartbeat，明确时间计划用 Cron。"
---

# Cron 与 Heartbeat 对比（Cron vs Heartbeat）

OpenClaw 有两种常见自动化方式：Heartbeat 和 Cron。Heartbeat 适合固定间隔巡检，Cron 适合明确时间计划。选错不会立刻出错，但会影响上下文、资源消耗和排障方式。

## 核心区别一览

| 特性 | Heartbeat（心跳）| Cron（定时任务）|
|------|-----------------|----------------|
| 触发方式 | 固定间隔（如每 5 分钟）| 精确时间计划（cron 表达式）|
| 会话状态 | 保持连续上下文 | 可选隔离 / 共享会话 |
| 适合场景 | 长时间监控、状态巡检 | 定时报告、批量处理 |
| 资源消耗 | 保持运行（Agent 常驻）| 按需唤醒（空闲时不消耗）|
| 时区支持 | 无（固定间隔）| 有（可配置 TZ）|
| 时间精度 | 相对时间（"每隔 X 分钟"）| 绝对时间（"每天 9:00"）|
| 上下文记忆 | 天然保持 | 主会话模式下保持 |

---

## Heartbeat 详解

Heartbeat 会按固定间隔向 Agent 发送消息，通常运行在主会话里。它适合“每隔一段时间看看有没有变化”的任务。

配置示例：

```json5
{
  agents: {
    "monitor-agent": {
      heartbeat: {
        // 启用心跳
        enabled: true,
        // 每 5 分钟发送一次心跳消息
        interval: "5m",
        // 心跳时发送给 Agent 的消息
        message: "检查系统状态，是否有异常需要处理？"
      }
    }
  }
}
```

适合 Heartbeat 的场景：

- 实时监控服务健康状态
- 定期检查消息队列或任务队列
- 需要 Agent 保持"随时待命"状态
- 任务之间有强依赖关系（需要记住上次检查结果）

::: info Heartbeat 的上下文优势
由于 Heartbeat 运行在主会话中，Agent 能记住之前所有的检查结果。比如："上次检查时服务 A 响应慢，这次检查看看是否恢复了。"
:::

---

## Cron 详解

Cron 在明确的时间点触发 Agent，例如每天 9 点、每周一早上或每月最后一天。任务完成后可以退出，也可以按配置使用共享会话。

配置示例：

```json5
{
  cron: {
    timezone: "Asia/Shanghai",
    jobs: [
      {
        // 每个工作日早上 9 点
        schedule: "0 9 * * 1-5",
        agent: "report-agent",
        message: "生成昨日数据汇总报告并发送到邮件",
        isolated: true  // 每次独立会话
      }
    ]
  }
}
```

适合 Cron 的场景：

- 每天定时发送报告
- 每周批量处理数据
- 需要在特定时刻（而非固定间隔）执行的任务
- 任务完全独立，不需要记住上次状态

---

## 两者结合使用

很多场景下，Heartbeat 和 Cron 可以配合使用，互相补充：

示例：监控 + 汇报

```json5
{
  agents: {
    "ops-agent": {
      // Heartbeat：每 10 分钟巡检一次
      heartbeat: {
        enabled: true,
        interval: "10m",
        message: "快速检查：服务状态是否正常？有无新告警？"
      }
    }
  },
  cron: {
    timezone: "Asia/Shanghai",
    jobs: [
      {
        // Cron：每天下班前生成完整日报
        schedule: "0 18 * * 1-5",
        agent: "ops-agent",
        message: "生成今日完整运维日报，包括：告警统计、处理情况、明日注意事项"
      }
    ]
  }
}
```

在这个配置中：

- Heartbeat 负责间隔巡检，Agent 保留当天的上下文。
- Cron 在固定时间触发，用已经积累的上下文生成日报。

---

## 决策指南

```text
需要保持上下文记忆（记住上次的状态）？
  ├── 是：Heartbeat（天然保持会话）
  └── 否 ↓

需要在特定时间点执行（如"每天9点"）？
  ├── 是：Cron
  └── 否 ↓

任务间隔固定（如"每5分钟"），不关心具体时钟时间？
  ├── 是：Heartbeat
  └── 否：两者结合，或重新评估需求
```

::: tip 简单判断
- 需要间隔巡检：用 Heartbeat
- 需要固定时间执行：用 Cron
- 既要巡检又要定时报表：两者结合
:::

---

_下一步：[Cron 定时任务详细配置](./cron-jobs) | [故障排查](./troubleshooting) | [自动化概览](./index)_
