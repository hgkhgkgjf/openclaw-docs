---
title: "Talk Mode 对话模式"
sidebarTitle: "对话模式"
description: "OpenClaw Nodes：Talk Mode 支持本地 STT/TTS、浏览器实时语音、Gateway relay 和 transcription-only。"
---

# Talk Mode 对话模式

Talk Mode 是连续语音对话。
它不是发一条语音消息就结束，而是像打电话一样：听你说、等你停顿、发给模型、再把回复读出来。

最新版 Talk 有三种运行形态：

1. 原生节点 Talk：macOS/iOS/Android 本地识别语音，把文字交给 Gateway 会话，再用 `talk.speak` 播放回复。
2. 浏览器实时 Talk：Control UI 里直接开实时语音。客户端用 `talk.client.create` 创建 OpenAI WebRTC 或 Google provider WebSocket 会话。
3. Gateway 管理的 Talk session：客户端用 `talk.session.create` 创建 Gateway relay、transcription 或 managed-room 会话，再通过 `talk.session.appendAudio` 送音频。

::: tip 先看人话
普通手机 Talk 像“按住说话或连续对讲”。
浏览器 realtime Talk 像“网页直接接入实时语音模型”。
transcription-only 像“只听写字幕，不让 AI 出声回答”。
:::

---

## 基本流程

原生节点 Talk 的流程是：

1. 监听语音。
2. 检测你说完了。
3. 把语音转成文字。
4. 发给当前 Gateway 会话里的 Agent。
5. 等模型回复。
6. 用配置好的 TTS 读出来。

浏览器 realtime Talk 不直接把 provider tool call 丢给 `chat.send`。
它会通过：

```text
talk.client.toolCall
```

把 `openclaw_agent_consult` 转给 Gateway，由 Gateway 套用工具策略和会话规则。

---

## 常见配置

```json5
{
  talk: {
    provider: "elevenlabs",
    speechLocale: "zh-CN",
    silenceTimeoutMs: 1500,
    interruptOnSpeech: true,
    realtime: {
      provider: "openai",
      providers: {
        openai: {
          apiKey: "openai_api_key",
          model: "gpt-realtime",
          voice: "alloy",
        },
      },
      mode: "realtime",
      transport: "webrtc",
      brain: "agent-consult",
    },
  },
}
```

常见字段：

- `provider`：语音播放提供商
- `speechLocale`：语音识别语言
- `silenceTimeoutMs`：停顿多久算说完
- `interruptOnSpeech`：你插话时是否打断播放
- `realtime.provider`：浏览器/服务端实时语音 provider，例如 `openai` 或 `google`
- `realtime.providers.<provider>`：该 provider 的实时语音配置
- `realtime.mode`：通常是 `realtime`，也可能是 `transcription`
- `realtime.transport`：例如 `webrtc`、`provider-websocket`、`gateway-relay`
- `realtime.brain`：`agent-consult` 表示实时模型需要咨询 OpenClaw Agent

---

## 关键 RPC 怎么选

| 你要做什么 | 用哪个 RPC |
| --- | --- |
| 读取可用 Talk provider、模型、声音、模式 | `talk.catalog` |
| 创建浏览器自己持有的实时 provider 会话 | `talk.client.create` |
| 浏览器实时 provider 要咨询 OpenClaw Agent | `talk.client.toolCall` |
| 创建 Gateway 持有的 relay/transcription/managed-room 会话 | `talk.session.create` |
| 往 Gateway Talk session 追加 PCM 音频 | `talk.session.appendAudio` |
| 取消当前输出或打断播放 | `talk.session.cancelOutput` |
| 关闭 Talk session | `talk.session.close` |
| 只把文字合成语音 | `talk.speak` |

不要在打开语音 session 时改全局 `messages.tts`。
Talk 客户端应该先读 `talk.catalog`，再把选好的 provider、model、voice、locale 放进本次 session 或 handoff 请求里。

---

## transcription-only 是什么

`transcription` 模式只做转写，不让助手出声回答。
适合：

- 字幕。
- 听写。
- 会议旁听。
- 观察式语音捕获。

典型形状：

```json5
{
  mode: "transcription",
  transport: "gateway-relay",
  brain: "none"
}
```

客户端创建后，通过 `talk.session.appendAudio` 追加音频，通过 `talk.event` 接收 partial/final transcript。

---

## 使用提醒

- 第一次先在安静环境测试。
- 如果经常提前打断，调大 `silenceTimeoutMs`。
- 如果不想被回复声音打扰，先关闭 Talk Mode。
- 语音能力通常需要麦克风和扬声器权限。
- 支持 Talk 的节点会声明 `talk` capability，并声明自己支持的 `talk.*` 命令。
- 可信 Talk 节点默认允许 `talk.ptt.start`、`talk.ptt.stop`、`talk.ptt.cancel`、`talk.ptt.once` 这几个 push-to-talk 命令。
