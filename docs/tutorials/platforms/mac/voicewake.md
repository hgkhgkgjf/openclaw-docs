---
title: "Voice Wake（macOS）"
---

# Voice Wake 与按键说话

::: tip 先看人话
这页是从 OpenClaw 官方最新文档同步来的专题参考。新手不要一口气背完，先看标题和第一段；真正要配置这个功能时，再按步骤慢慢做。
:::

## 模式

- 唤醒词模式（默认）：Speech 识别器常驻监听 `swabbleTriggerWords`。命中后开始收音，浮层显示临时转写文本，并在静音后自动发送。
- 按键说话（按住右 Option）：按住右 Option 立刻开始收音，不需要唤醒词。松开后会短暂等待，方便你修正文本，然后再转发。

## 运行行为（唤醒词）

- Speech 识别器运行在 `VoiceWakeRuntime` 中。
- 唤醒词和下一句话之间需要有一个可识别的停顿（约 0.55s）。即使命令还没开始，浮层和提示音也可以在停顿时出现。
- 静音窗口：正常说话时 2.0s；只听到唤醒词时 5.0s。
- 硬停止时间：120s，防止一次会话无限延长。
- 两次会话之间有 350ms debounce。
- 浮层由 `VoiceWakeOverlayController` 驱动，区分已确认文本和临时文本。
- 发送完成后，识别器会重新开始监听下一次唤醒。

## 生命周期约束

- 只要 Voice Wake 已启用且权限齐全，唤醒词识别器就应该保持监听；显式按键说话期间除外。
- 浮层是否可见，包括用户手动点击 X 关闭，都不能阻止识别器恢复监听。

## 旧版浮层卡住问题

以前如果浮层卡在屏幕上，用户手动关闭后，Voice Wake 可能看起来像是"死了"。原因是 runtime 的重启会被浮层可见状态挡住，而且后面没有新的重启计划。

现在的加固点：

- Wake runtime 重启不再受浮层可见状态阻塞。
- 浮层关闭完成后，会通过 `VoiceSessionCoordinator` 调用 `VoiceWakeRuntime.refresh(...)`，因此手动关闭也会恢复监听。

## 按键说话细节

- 热键检测使用全局 `.flagsChanged` 监听右 Option（`keyCode 61` + `.option`）。这里只观察事件，不拦截键盘输入。
- 收音管线在 `VoicePushToTalk` 中：立即启动 Speech，把临时转写流式显示到浮层，松开后调用 `VoiceWakeForwarder`。
- 按键说话开始时会暂停唤醒词 runtime，避免两个音频 tap 抢资源；松开后自动恢复。
- 权限要求：Microphone + Speech；要看到按键事件，还需要 Accessibility/Input Monitoring 授权。
- 外接键盘可能不按预期暴露右 Option；如果用户反馈漏触发，需要提供备用快捷键。

## 用户可见设置

- Voice Wake 开关：启用唤醒词 runtime。
- Hold Cmd+Fn to talk：启用按键说话监听。macOS 26 以下禁用。
- 语言和麦克风选择器、实时音量表、唤醒词表、本地测试器（只测试，不转发）。
- 麦克风断开时保留上次选择，显示断开提示，并临时回落到系统默认设备，等设备回来后再恢复。
- Sounds：唤醒和发送时播放提示音，默认是 macOS 的 Glass 系统声音。每个事件都可以选择 `NSSound` 能加载的文件（如 MP3/WAV/AIFF），也可以选择 No Sound。

## 转发行为

- Voice Wake 启用后，转写文本会转发到当前 gateway/agent，使用 macOS 应用的本地或远程模式。
- 回复会投递到最近使用的主 provider（WhatsApp/Telegram/Discord/WebChat）。如果投递失败，错误会写入日志，运行记录仍可在 WebChat/session logs 中查看。

## Forwarding payload

- `VoiceWakeForwarder.prefixedTranscript(_:)` prepends the machine hint before sending. Shared between wake-word and push-to-talk paths.

## 快速验证

- 打开 push-to-talk，按住 Cmd+Fn，说话后松开：浮层应显示临时转写并发送。
- 按住期间，菜单栏耳朵应保持放大（使用 `triggerVoiceEars(ttl:nil)`）；松开后恢复。

## Related

- [Voice wake](/tutorials/nodes/voicewake)
- [Voice overlay](/tutorials/platforms/mac/voice-overlay)
- [macOS app](/tutorials/platforms/macos)
