---
title: "子智能体"
sidebarTitle: "子智能体"
description: "OpenClaw 工具系统：子智能体（Sub-Agents）。子智能体（Sub-Agents）让主 Agent 可以启动并协调其他 Agent 来并行完成复杂任务。就像一个项目经理把工作分配给团队成…"
---

# 子智能体（Sub-Agents）

子智能体（Sub-Agents）让主 Agent 可以启动并协调其他 Agent 来并行完成复杂任务。就像一个项目经理把工作分配给团队成员一样，主 Agent 可以将大任务拆分成多个子任务，分发给专门的子 Agent 处理，最后汇总结果。

---

## 先讲人话

子智能体就是“主助手临时请来的帮手”。

比如你让 OpenClaw 同时看三个项目：

- 一个帮手看项目 A。
- 一个帮手看项目 B。
- 一个帮手看项目 C。
- 主助手最后把三份结果合成一份报告。

如果任务很小，比如“帮我改一句话”，不需要子智能体。
如果任务很大、能拆成几块，子智能体才有意义。

::: tip 新手建议
先不要急着打开很高的并发数。
子智能体越多，花费的模型 Token 越多，权限管理也越复杂。
:::

---

## 快速上手

多数普通对话不需要你手动“启用子智能体”。
能不能使用子智能体，取决于当前 Agent 的工具策略。官方当前说明里，`coding` 和 `full` 这类工具配置会暴露 `sessions_spawn`；偏消息聊天的配置可能不会暴露。

先在同一个会话里看可用工具：

```text
/tools
```

如果里面看不到 `sessions_spawn` 或 `subagents`，说明当前会话不能启动子智能体。
这时不要乱改配置，先确认你确实需要并行任务，再参考官方工具策略配置。

让主 Agent 协调子 Agent 的例子：

主 Agent 会根据任务复杂度自动决定是否启动子 Agent：

```text
帮我同时分析三个代码库的结构，并生成对比报告
```

主 Agent 会启动三个子 Agent，分别分析不同的代码库，然后汇总结果。

---

## 工作方式

```text
用户消息
    ↓
主 Agent 分析任务
    ↓
决定需要子 Agent
    ↓
启动子 Agent 1  启动子 Agent 2  启动子 Agent 3
    ↓                ↓               ↓
  完成任务A        完成任务B        完成任务C
    ↓                ↓               ↓
          主 Agent 收集结果
                ↓
          汇总并回复用户
```

子 Agent 完成任务后，其输出会以工具调用结果的形式返回给主 Agent，主 Agent 负责整合最终答案。

你平时不需要记住内部格式。
只要知道：子 Agent 不直接替你做最终决定，最后仍由主 Agent 汇总和回复。

---

## 完整配置示例

下面是“调节子智能体行为”的配置，不是新手第一天必填项。
字段路径要放在 `agents.defaults.subagents` 下面。

```json5
{
  agents: {
    defaults: {
      subagents: {
        maxConcurrent: 8,        // 全局并发上限，默认 8
        maxSpawnDepth: 1,        // 默认不允许子 Agent 再继续生子 Agent
        maxChildrenPerAgent: 5,  // 每个会话最多同时挂几个子 Agent
        runTimeoutSeconds: 900,  // 单次运行超时；0 表示不设超时
        archiveAfterMinutes: 60, // 完成后多久自动归档
      },
    },
  },
}
```

---

## 在聊天里管理子智能体

当前官方推荐用斜杠命令查看和控制当前会话的子智能体：

```text
/subagents list
/subagents kill <id|#|all>
/subagents log <id|#> [limit] [tools]
/subagents info <id|#>
/subagents send <id|#> <message>
/subagents steer <id|#> <message>
/subagents spawn <agentId> <task> [--model <model>] [--thinking <level>]
```

最常用的是前三个：

| 命令 | 人话解释 |
|------|----------|
| `/subagents list` | 看当前有哪些子智能体 |
| `/subagents kill <id|#|all>` | 停止一个或全部子智能体 |
| `/subagents log <id|#>` | 看某个子智能体做了什么 |

不要为了等待结果反复刷 `/subagents list`。子智能体完成后会把结果宣布回主会话。

## 宣布流程（Announce）

子 Agent 启动时会向主 Agent 发出声明（Announce），告知自己的能力和任务范围。这个机制确保主 Agent 了解每个子 Agent 的状态：

Announce 可以理解成“帮手报到”：
我是谁、会做什么、现在准备好了。

::: details 宣布机制详情
1. 主 Agent 创建子 Agent 请求
2. 子 Agent 初始化，加载分配的工具和技能
3. 子 Agent 向主 Agent 宣布就绪，附带能力描述
4. 主 Agent 确认接收，开始分配任务
5. 任务完成后，子 Agent 返回结果并关闭
:::

---

## 工具策略（Tool Policy）

你可以限制子 Agent 可以使用的工具，避免子 Agent 拥有过多权限：

```json5
{
  tools: {
    profile: "coding",
    alsoAllow: ["sessions_spawn", "subagents"],
  },
  agents: {
    defaults: {
      subagents: {
        maxConcurrent: 3,
      },
    },
  },
}
```

::: tip 最小权限原则
子 Agent 通常只需要完成特定任务，不需要完整权限。
具体允许哪些工具，要以当前版本的工具策略和 `/tools` 输出为准。
:::

比如只让子 Agent 查网页，就不要给它运行命令的权限。
这能减少误操作，也更容易排查问题。

---

## 认证继承

子 Agent 默认继承主 Agent 的认证信息（API Key、OAuth Token 等），无需单独配置：

::: details 认证继承说明
- 子 Agent 使用与主 Agent 相同的 AI 模型 API Key
- 子 Agent 访问外部服务时使用主 Agent 的凭证
- 如果需要子 Agent 使用不同凭证，可以在子 Agent 配置中单独指定
:::

---

## 上下文传递

默认情况下，原生子智能体是隔离的：它不会自动拿到主会话的完整聊天记录。
只有任务确实依赖当前对话细节时，才让它使用 `context: "fork"`。

```json5
{
  agents: {
    defaults: {
      subagents: {
        model: "openai/gpt-5.4-mini",
        thinking: "low",
      },
    },
  },
}
```

::: warning
传递过多上下文会增加 Token 消耗。
默认隔离模式通常更省，也更不容易把无关信息带进去。
:::

简单理解：给帮手看的材料越多，成本越高，也越容易把无关信息带进去。
默认值通常已经够用。

---

## 停止子 Agent

有时你需要手动停止运行中的子 Agent：

```text
/subagents kill <id|#|all>
```

---

## 使用限制

| 限制项 | 默认值 | 说明 |
|--------|--------|------|
| 最大并发数 | 8 | `agents.defaults.subagents.maxConcurrent`，全局并发上限 |
| 单个超时 | 0 | `runTimeoutSeconds`，0 表示不设默认超时 |
| 嵌套深度 | 1 | `maxSpawnDepth`，默认不允许子 Agent 再启动子 Agent |
| 每个会话子数量 | 5 | `maxChildrenPerAgent`，限制一个会话下面同时挂多少子 Agent |

::: details 修改限制配置
```json5
{
  agents: {
    defaults: {
      subagents: {
        maxConcurrent: 5,
        runTimeoutSeconds: 300,
        maxSpawnDepth: 1,
      },
    },
  },
}
```
:::

---

_下一步：[斜杠命令（Slash Commands）](/tutorials/tools/slash-commands) | [工具系统总览](/tutorials/tools/)_
