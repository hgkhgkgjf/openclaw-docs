---
title: "Parallel Search"
sidebarTitle: "Parallel Search"
description: "OpenClaw Web 搜索提供商：Parallel Search。支持免 Key 的 parallel-free 和付费 parallel。"
---

# Parallel Search

Parallel 是 OpenClaw 里一条很实用的网页搜索路线，重点不是给人看搜索结果页，而是返回更适合 LLM 使用的高密度摘录。

它有两种模式：

- `parallel-free`：免费，不需要账号和 API Key
- `parallel`：付费，需要 `PARALLEL_API_KEY`

## 什么时候适合先用它

- 想让 Agent 做网页调研，但不想额外配置复杂搜索栈
- 想优先拿到适合模型推理的摘要，而不是给人点链接的普通 SERP
- 想在多轮搜索里复用 `sessionId`，让后续搜索更贴近前文任务

## 一个主要注意点

如果你使用的是 OpenAI Responses 模型，而且没有显式设置 `tools.web.search.provider`，OpenClaw 往往会优先走 OpenAI 原生 Web Search。

如果你明确想走 Parallel，要显式设置：

```json5
{
  tools: {
    web: {
      search: {
        provider: "parallel-free",
      },
    },
  },
}
```

或者：

```json5
{
  tools: {
    web: {
      search: {
        provider: "parallel",
      },
    },
  },
}
```

## 安装插件

```bash
openclaw plugins install @openclaw/parallel-plugin
openclaw gateway restart
```

## 付费版配置

```json5
{
  env: {
    PARALLEL_API_KEY: "par-...",
  },
  plugins: {
    entries: {
      parallel: {
        config: {
          webSearch: {
            apiKey: "par-...",
            baseUrl: "https://api.parallel.ai",
          },
        },
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "parallel",
      },
    },
  },
}
```

如果 Gateway 是后台服务，记得把 `PARALLEL_API_KEY` 放到 Gateway 实际运行的环境 里，而不是只 export 在你当前 shell。

## 参数怎么理解

Parallel 鼓励你同时提供两类信息：

- `objective`：这次到底要解决什么问题
- `search_queries`：2 到 3 组简短主要词

可以简单理解成：

```text
objective = 任务目标
search_queries = 搜索词
```

这样通常比只丢一条主要词更稳定。

## 中文用户的实用建议

1. 第一次先用 `parallel-free`
2. 跑通后再决定是否需要付费版
3. 连续调研任务尽量复用同一个 `sessionId`
4. 如果你本来就在用 OpenAI Responses，又想统一控制搜索来源，记得显式设置 provider

## 相关页面

- [Web 网络工具](/tutorials/tools/web)
- [Exa Search](/tutorials/tools/exa-search)
- [Perplexity Search](/tutorials/tools/perplexity-search)

