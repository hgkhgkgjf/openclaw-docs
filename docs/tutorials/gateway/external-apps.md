---
title: "外部应用接入 Gateway"
sidebarTitle: "外部应用"
description: "OpenClaw Gateway 集成：给脚本、CI、仪表盘、IDE 扩展等外部程序使用的当前推荐路径。"
---

# 外部应用接入 Gateway

这页讲的是**OpenClaw 进程外部**的程序，应该怎么接 OpenClaw。

例如：

- 你自己写的脚本
- CI 任务
- 管理后台或仪表盘
- IDE 扩展

当前官方推荐路径很明确：**通过 Gateway 协议和 RPC 接口接入。**

## 先讲结论

如果代码不跑在 OpenClaw 进程里面，就优先走：

1. Gateway 协议
2. Gateway RPC
3. 必要时退回 CLI

不要把内部插件 SDK 当成外部应用 SDK 来用。

## 今天能稳定用的接入面

| 接入面 | 适合做什么 |
|------|------|
| [Gateway 协议](/tutorials/gateway/protocol) | 建长连接、收事件、做实时状态同步 |
| [Gateway RPC 参考](/tutorials/reference/rpc) | 调 `agent`、`sessions.*`、`tools.*`、`approvals.*` 等方法 |
| [`openclaw agent`](/tutorials/cli/agent) | 一次性脚本调用 |
| [`openclaw message`](/tutorials/cli/message) | 从脚本发消息、做简单通道动作 |

## 外部应用和插件代码的边界

### 用 Gateway RPC 的场景

- Node / Python 脚本
- CI/CD
- IDE 扩展
- 外部 dashboard
- 独立后端服务

### 用插件 SDK 的场景

- Provider 插件
- Channel 插件
- Tool 插件
- Hook / Runtime 扩展

一句话：

```text
跑在 OpenClaw 外面，用 Gateway。
跑在 OpenClaw 里面，才用 Plugin SDK。
```

## 一个容易踩坑的点

官方目前**还没有公开发布的 npm 客户端包**可供你稳定依赖。

因此不要因为源码里看到某些内部 client 包名，就直接把它们加进生产依赖。

## 中文用户的实用建议

1. 做自动化脚本，先从 `openclaw agent` 开始
2. 做长期集成，再切 Gateway RPC
3. 升级 OpenClaw 后，顺手复查一遍 [Gateway RPC 参考](/tutorials/reference/rpc)

## 相关页面

- [Gateway 协议](/tutorials/gateway/protocol)
- [Gateway RPC 参考](/tutorials/reference/rpc)
- [CLI agent](/tutorials/cli/agent)
- [CLI message](/tutorials/cli/message)
- [插件 SDK 总览](/tutorials/plugins/sdk-overview)

