---
title: "llama.cpp Provider"
sidebarTitle: "llama.cpp Provider"
description: "OpenClaw 插件专题：llama.cpp Provider。用于本地 GGUF 向量嵌入，常见于 memorySearch.provider = local。"
---

# llama.cpp Provider

`llama-cpp` 是 OpenClaw 官方提供的一个外部 Provider 插件，主要用途不是普通聊天，而是给本地记忆检索提供 GGUF 向量嵌入能力。

最常见的触发条件是：

```json5
memorySearch.provider = "local"
```

## 它解决什么问题

OpenClaw 主 npm 包不会自带 `node-llama-cpp` 这类原生依赖。

这样做的好处是：

- 普通用户升级 OpenClaw 更稳
- 不会因为主包更新，把你手动装好的本地原生运行时冲掉

## 安装

```bash
openclaw plugins install @openclaw/llama-cpp-provider
```

## 配置示例

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "local",
        local: {
          modelPath: "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf",
        },
      },
    },
  },
}
```

## 什么时候你其实不需要它

如果你只是想：

- 本地跑聊天模型
- 用 Ollama 或 LM Studio 跑主模型
- 做普通私有化对话

那你不一定需要 `llama-cpp` 这条路线。

它更偏向：

- 本地记忆检索
- GGUF 嵌入
- 原生依赖安装

## 原生依赖注意点

官方建议优先使用 Node 24。

如果你是源码 checkout + pnpm 的安装方式，可能还需要：

```bash
pnpm approve-builds
pnpm rebuild node-llama-cpp
```

## 更省心的替代路线

如果你只是想低摩擦地启用本地记忆检索，优先试：

- [Ollama](/tutorials/providers/ollama)
- [LM Studio](/tutorials/providers/lmstudio)

## 相关页面

- [插件专题](/tutorials/plugins/)
- [记忆系统](/tutorials/concepts/memory)
- [Ollama](/tutorials/providers/ollama)
- [LM Studio](/tutorials/providers/lmstudio)

