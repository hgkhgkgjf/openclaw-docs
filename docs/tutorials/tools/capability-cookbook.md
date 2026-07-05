---
title: "添加能力 Cookbook"
sidebarTitle: "添加能力"
---

# 添加能力 Cookbook：给核心贡献者看的路线图

这一页面向 OpenClaw 核心贡献者。普通插件开发者先看 [插件专题](/tutorials/plugins/)。

当你想给 OpenClaw 增加一个“新领域能力”，比如新的图像、视频、语音或未来某类供应商能力时，不要直接把某个 vendor 写死到通道里。

---

## 核心规则

```text
plugin 是所有权边界
capability 是共享核心契约
```

意思是：

- 核心定义大家都认的类型和接口。
- vendor 插件实现这个接口。
- 通道、工具、功能插件调用共享 runtime helper。
- 消费者不要直接依赖某个 vendor。

---

## 什么时候该创建 capability？

同时满足这些条件时再创建：

1. 未来可能有多个 vendor 实现它。
2. 通道、工具或插件都可能消费它。
3. 核心需要统一 fallback、policy、config 或投递行为。

如果只是某个 vendor 的小功能，先不要扩大成核心能力。

---

## 标准顺序

1. 定义类型契约。
2. 增加插件注册接口。
3. 增加共享 runtime helper。
4. 接一个真实 vendor 作为验证。
5. 让工具或通道改用 helper。
6. 补契约测试。
7. 写面向运维者的配置文档。

---

## 新手理解

不要让 Telegram 通道直接调用某个图片供应商。
应该让 Telegram 调 OpenClaw 的图片能力，而图片能力背后可以换 OpenAI、Google、MiniMax 或其他插件。

这样系统才不会越长越乱。

---

## 继续阅读

- [插件专题](/tutorials/plugins/)
- [媒体能力总览](/tutorials/tools/media-overview)
- [OpenClaw App SDK](/tutorials/concepts/openclaw-sdk)
