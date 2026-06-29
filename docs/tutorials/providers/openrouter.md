---
title: "OpenRouter"
sidebarTitle: "OpenRouter"
description: "OpenClaw 模型接入：OpenRouter。一个入口访问多家模型，也可承担图片、视频、音乐和语音相关能力。"
---

# OpenRouter

OpenRouter 提供一个统一 API，让你用一个入口访问很多模型。

它在 OpenClaw 里很常见，因为：

- 接法接近 OpenAI 兼容接口
- 一个账号就能试很多 provider / model
- 还能顺手承担图片、视频、音乐、TTS、语音转写等能力

## 最常见的两种接入方式

### OAuth

```bash
openclaw onboard --auth-choice openrouter-oauth
```

### API Key

```bash
openclaw onboard --auth-choice openrouter-api-key
```

如果你只是想先跑通，通常推荐先用向导，再决定是否手动细调。

## 配置示例

```json5
{
  env: { OPENROUTER_API_KEY: "sk-or-..." },
  agents: {
    defaults: {
      model: { primary: "openrouter/auto" },
    },
  },
}
```

第一次接入时，`openrouter/auto` 往往比一上来手填具体模型更稳。

## 模型引用怎么写

常见写法：

```text
openrouter/<provider>/<model>
```

例如：

- `openrouter/auto`
- `openrouter/anthropic/claude-sonnet-4-5`
- `openrouter/moonshotai/kimi-k2.6`

## Fusion 是什么

这是这页最容易被误解的点。

`Fusion` 不是普通模型别名，而是 **OpenRouter 的并行路由 / 裁决器**。

它会：

1. 并行询问多个模型
2. 由 OpenRouter 做评判
3. 返回一个最终答案

在 OpenClaw 里的模型引用通常写成：

```bash
openclaw models set openrouter/openrouter/fusion
```

这里双 `openrouter` 前缀不是写错了，而是：

- 第一个 `openrouter` 是 OpenClaw provider id
- 第二个 `openrouter/fusion` 是上游模型 slug

## 不只是文本模型

OpenRouter 现在还可以承担：

- 图片生成
- 视频生成
- 音乐生成
- TTS
- 入站语音转写

如果你想统一把多媒体能力也挂到一个云端入口，OpenRouter 是可行路线。

## 中文用户的实用建议

1. 第一次接入先用 `openrouter/auto`
2. 跑通后再切具体模型
3. 想试 Fusion 时，把它理解成“并行多模型裁决”，不要把它当普通型号
4. 如果你用 `/model` 固定了某个 OpenRouter 模型，后续想恢复默认配置，请用 `/model default`

## 相关页面

- [模型提供商总览](/tutorials/providers/)
- [模型 CLI](/tutorials/concepts/models)
- [OpenAI](/tutorials/providers/openai)
