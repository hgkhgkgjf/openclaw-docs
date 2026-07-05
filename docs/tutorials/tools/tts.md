---
title: "Text to Speech"
sidebarTitle: "TTS 文字转语音"
---

# TTS：让 OpenClaw 把回复说出来

TTS 是 Text to Speech，也就是文字转语音。OpenClaw 可以把 Agent 的回复变成音频，发到支持语音消息的通道里。

::: tip 和 Talk 的关系
TTS 是 Talk 的 `stt-tts` 模式里的“说出来”那一半。

provider-native `realtime` Talk 会在实时 provider 内部合成语音，不走这条 TTS 工具路径。
`transcription` 模式只转写，不合成助手语音。
:::

---

## 能用在哪些地方？

根据通道能力，TTS 可能表现为：

- Telegram 语音消息。
- WhatsApp 语音消息。
- Matrix 音频。
- 飞书音频。
- 其他通道里的音频附件。
- Talk 或电话场景里的音频流。

---

## 常见提供商

OpenClaw 支持多种语音提供商，常见有：

- OpenAI。
- ElevenLabs。
- Google。
- Microsoft。
- MiniMax。
- DeepInfra。
- xAI。
- 本地 CLI。

有些需要 API Key，有些可以本地运行。

---

## 快速配置思路

1. 选一个 TTS provider。
2. 配好 API Key 或本地命令。
3. 给默认 persona 选一个声音。
4. 在需要的通道开启语音输出。

示意：

```json5
{
  messages: {
    tts: {
      enabled: true,
      provider: "openai"
    }
  }
}
```

实际字段以当前版本配置为准。

---

## 什么时候不要开？

不建议在这些场景默认开启：

- 群聊里消息很多。
- 回复内容很长。
- 通道里有人不方便听音频。
- 成本敏感。

你可以只对特定通道、特定用户、特定命令开启。

---

## Talk 场景不要改全局 TTS

Talk session 的 provider 选择是单次会话范围。

Talk 客户端应该先调用：

```text
talk.catalog
```

拿到可用 provider、model、voice、locale，再在创建 Talk session 或 handoff 请求时传进去。

不要为了打开一次 Talk，就去改：

```text
messages.tts
```

全局 TTS 配置是给普通消息和工具输出用的，不应该被一次语音会话临时改掉。

---

## 继续阅读

- [媒体能力总览](/tutorials/tools/media-overview)
- [节点音频](/tutorials/nodes/audio)
- [Talk 节点能力](/tutorials/nodes/talk)
