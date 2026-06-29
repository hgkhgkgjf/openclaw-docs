---
title: "Cohere"
sidebarTitle: "Cohere"
description: "OpenClaw 模型接入：Cohere。支持兼容 OpenAI 的 Compatibility API。"
---

# Cohere

Cohere 在 OpenClaw 里走的是 **OpenAI 兼容接口** 路线，因此接入方式对很多人来说比较熟悉。

最重要的三个点：

- Provider id 是 `cohere`
- 环境变量是 `COHERE_API_KEY`
- 默认模型通常是 `cohere/command-a-03-2025`

## 快速开始

```bash
openclaw onboard --non-interactive \
  --auth-choice cohere-api-key \
  --cohere-api-key "$COHERE_API_KEY"
```

查看模型目录：

```bash
openclaw models list --provider cohere
```

## 配置示例

```json5
{
  env: {
    COHERE_API_KEY: "your-key",
  },
  agents: {
    defaults: {
      model: {
        primary: "cohere/command-a-03-2025",
      },
    },
  },
}
```

## 当前接入方式

| 项目 | 值 |
|------|------|
| Provider id | `cohere` |
| 鉴权环境变量 | `COHERE_API_KEY` |
| Onboarding | `--auth-choice cohere-api-key` |
| API 形态 | OpenAI-compatible |
| Base URL | `https://api.cohere.ai/compatibility/v1` |

## 一个常见坑

如果 Gateway 是后台服务、Docker 容器或远程守护进程，只在当前 shell 里 export `COHERE_API_KEY` 并不够。

你需要把变量放进 Gateway 真正运行的环境里。

## 如果当前环境里没有内置 Cohere

可以手动安装官方插件并重启：

```bash
openclaw plugins install @openclaw/cohere-provider
openclaw gateway restart
```

## 相关页面

- [模型提供商总览](/tutorials/providers/)
- [模型 CLI](/tutorials/concepts/models)
- [OpenAI](/tutorials/providers/openai)

