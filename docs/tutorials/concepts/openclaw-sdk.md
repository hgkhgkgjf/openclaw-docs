---
title: "OpenClaw App SDK"
sidebarTitle: "App SDK"
description: "OpenClaw App SDK 是外部程序连接 Gateway 的客户端 API，适合脚本、仪表盘、CI、IDE 扩展等场景。"
---

# OpenClaw App SDK

OpenClaw App SDK 是给“外部程序”用的。
如果你写了一个脚本、网页后台、CI 任务、IDE 扩展，想连接 OpenClaw Gateway，就可以用它。

包名通常是：

```bash
@openclaw/sdk
```

---

## 它和插件 SDK 有什么区别

| 名称 | 跑在哪里 | 用来做什么 |
|------|----------|------------|
| App SDK | OpenClaw 外面 | 外部应用连接 Gateway |
| Plugin SDK | OpenClaw 里面 | 插件注册频道、工具、模型、上下文引擎 |

一句话：

- 写外部脚本、仪表盘、CI：用 App SDK
- 写 OpenClaw 插件：用 Plugin SDK

---

## 能做什么

App SDK 可以：

- 连接 Gateway
- 列出 Agent
- 发起 Agent run
- 等待结果
- 取消运行
- 读取会话
- 监听事件流
- 查看模型和工具
- 处理审批
- 下载运行产物
- 查看可用运行环境

---

## 一个最小例子

```ts
import { OpenClaw } from "@openclaw/sdk";

const oc = new OpenClaw({
  url: "ws://127.0.0.1:18789",
  token: process.env.OPENCLAW_GATEWAY_TOKEN,
});

await oc.connect();

const agent = await oc.agents.get("main");
const run = await agent.run({
  input: "帮我总结今天的待办。",
  sessionKey: "daily-summary",
});

const result = await run.wait();
console.log(result.status);
```

---

## 查看可用运行环境

最新版 SDK 已经支持只读查看运行环境。

这里的“环境”可以先理解成：OpenClaw 可以把任务放到哪里执行。
最常见的是 Gateway 本机；如果你配对了节点，也可能看到节点环境。

```ts
const { environments } = await oc.environments.list();

for (const environment of environments) {
  console.log(environment.id, environment.type, environment.status);
}
```

如果想单独检查某一个环境：

```ts
const gateway = await oc.environments.status("gateway");
console.log(gateway.status);
```

新手先记住两点：

1. `oc.environments.list()` 可以用来“看看现在有哪些地方能跑任务”。
2. `oc.environments.status(id)` 可以用来“看看某个地方现在能不能用”。

目前它是只读能力。也就是说，SDK 可以列出和查询环境，但还不能通过 SDK 创建或删除环境。

---

## 什么时候用它

- 想从 CI 里触发 OpenClaw 做代码审查
- 想做一个自己的管理面板
- 想让内部系统调用 Agent
- 想把 OpenClaw 接进 IDE 插件
- 想批量创建会话或读取运行结果
- 想让外部系统判断 Gateway 本机或节点是否可用

如果只是日常聊天，不需要 SDK；打开 [Web 控制 UI](/tutorials/web/) 就够了。
