---
title: "Canvas 工具与 A2UI"
sidebarTitle: "Canvas / A2UI"
description: "OpenClaw 工具系统：Canvas 工具与 A2UI。Canvas 让 Agent 在 iOS、Android 或 macOS 节点上打开网页、截取画面并呈现生成式 UI。"
---

# Canvas 工具与 A2UI

Canvas 工具让 Agent 在 iOS、Android 或 macOS 节点上呈现可视化内容。它可以打开网页、截取当前画面，也可以把 Agent 生成的 A2UI 界面推送到你的手机或电脑上。

::: info 适用平台
Canvas 需要配合已启用 Canvas 功能的节点使用，支持 iOS、Android 和 macOS。纯服务器部署没有可显示的节点界面，因此不能使用这个工具。
:::

## Canvas 是什么

Canvas 是 OpenClaw 客户端里的内置显示面板。可以把它理解成节点上的一块屏幕：

- Agent 可以在上面打开网页（WebView）
- Agent 可以运行 JavaScript 与页面交互
- Agent 可以截取当前 Canvas 的状态
- Agent 可以通过 A2UI 协议，把自己生成的界面推送到这块屏幕上

简单说，Canvas 负责把 Agent 的可视化结果显示在节点设备上，而不是只停留在聊天回复里。

## 快速上手

### 1. 确认节点已启用 Canvas

在 OpenClaw 客户端（手机或桌面端），打开对应节点的设置，确认 Canvas 功能已开启。

### 2. 在 Agent 会话中调用 Canvas

直接用自然语言告诉 Agent 你想做什么：

```text
在我的手机上打开 Canvas，显示 https://example.com
```

```text
用 Canvas 给我生成一个今日待办清单的 UI，推送到我的手机
```

### 3. 切换到节点的 Canvas 标签

在 OpenClaw 客户端中切换到 Canvas 标签页，就能看到 Agent 推送的内容。

## Canvas 动作一览

Canvas 工具支持以下动作，Agent 会根据任务自动选择合适的调用方式：

| 动作 | 说明 |
|------|------|
| `present` | 展开并显示节点上的 Canvas 面板 |
| `hide` | 隐藏 Canvas 面板 |
| `navigate` | 在 Canvas 的 WebView 中打开指定 URL |
| `eval` | 在 Canvas 的 WebView 中执行 JavaScript 代码 |
| `snapshot` | 截取当前 Canvas 的状态/截图 |
| `a2ui_push` | 推送 A2UI JSONL 帧，在 Canvas 上渲染 Agent 生成的 UI |
| `a2ui_reset` | 重置 A2UI 状态，清空已渲染的 UI |

::: tip
`nodes` 工具同样提供 Canvas 相关命令（如 `canvas.present`、`canvas.navigate` 等），用法和效果与 `canvas` 工具一致，适合在多节点场景中精确指定目标节点。
:::

---

## 各动作详解

### present / hide：显示与隐藏

控制节点上 Canvas 面板的可见状态：

```text
# 告诉 Agent：
打开我手机的 Canvas 面板
```

Agent 会调用 `present` 动作，节点屏幕上的 Canvas 标签随即弹出。`hide` 则将其收起。

---

### navigate：在 Canvas 中打开网页

Canvas 内置一个 WebView，支持直接加载任意网页：

```text
# 告诉 Agent：
在 Canvas 里打开我的个人主页 https://mysite.com
```

::: tip 与浏览器工具的区别
`navigate` 是在节点的 Canvas 面板中打开网页，内容直接出现在你的手机或电脑屏幕上，适合让用户查看。浏览器工具运行在服务端，更适合自动化抓取与操作。
:::

### eval：在 WebView 中执行 JavaScript

Agent 可以向 Canvas 的 WebView 注入并执行 JavaScript，实现动态交互：

```text
# 告诉 Agent：
在 Canvas 页面里执行 JS，把背景色改成深色主题
```

这个能力可以让 Agent 在已加载的网页上做二次改造，比如高亮某个区域、自动填写内容等。

---

### snapshot：截取 Canvas 状态

Agent 可以随时截取 Canvas 当前显示的内容，用于：

- 向你汇报当前画面内容
- 在多步骤任务中保存中间状态
- 作为下一步操作的视觉参考

```text
# 告诉 Agent：
截一下现在 Canvas 显示的内容，告诉我显示是否正确
```

---

### a2ui_push：推送 Agent 生成的 UI

Agent 可以生成卡片、列表、图表、表单等可视化界面，并通过 A2UI 协议推送到节点屏幕上渲染。

```text
# 告诉 Agent：
帮我生成一个本周任务进度的看板，推到我手机的 Canvas 上
```

Agent 会构造 A2UI JSONL 格式的帧数据并调用 `a2ui_push`，Canvas 收到后立即渲染成可视化界面。

---

### a2ui_reset：重置 A2UI 状态

清除当前 Canvas 上所有 A2UI 渲染的内容，恢复空白状态：

```text
# 告诉 Agent：
清空 Canvas 上的内容，重新开始
```

---

## 什么是 A2UI？

A2UI（Agent-to-UI）是 OpenClaw 定义的一套协议，专门用于让 Agent 生成结构化的 UI 描述，并将其渲染成真实界面。

核心概念：

- Agent 不是输出 HTML，而是输出结构化的 JSONL 帧（每行一个 JSON 对象）
- 每一帧描述一个 UI 组件（文本、图片、按钮、卡片等）
- 节点收到帧后，由 Canvas 渲染引擎负责绘制成实际界面

格式要求：

::: warning 版本兼容性
A2UI 当前仅支持 v0.8 JSONL 格式。v0.9 及 `createSurface` 接口不被接受。Agent 会自动生成正确格式，通常无需手动干预。
:::

A2UI JSONL 的每一行是一个独立的 JSON 帧，例如：

```jsonl
{"type":"text","content":"今日待办","style":{"fontSize":20,"fontWeight":"bold"}}
{"type":"divider"}
{"type":"text","content":"完成周报","style":{"color":"#4CAF50"}}
{"type":"text","content":"更新项目文档","style":{"color":"#FF9800"}}
{"type":"text","content":"下午 3 点开会","style":{"color":"#2196F3"}}
```

Canvas 收到后，会将其渲染成一个结构清晰的卡片界面，直接显示在你的手机屏幕上。

::: info 谁来写 A2UI？
通常情况下，Agent 会根据你的需求自动生成 A2UI 帧，你不需要手动编写 JSONL。如果你在开发自定义技能（Skill），可以在技能中按 v0.8 格式构造帧并调用 `a2ui_push`。
:::

---

## 配置说明

Canvas 工具通过 Agent 会话自动激活，无需额外配置文件。以下是关键前提条件：

| 条件 | 说明 |
|------|------|
| 节点平台 | 必须是 iOS、Android 或 macOS 节点 |
| Canvas 功能 | 节点客户端中需已开启 Canvas |
| 节点连接 | 节点必须在线并与 Agent 会话配对 |
| A2UI 版本 | 仅支持 v0.8 JSONL 格式 |

---

## nodes 工具中的 Canvas 命令

如果你在使用 `nodes` 工具管理多个节点，可以通过以下命令精确指定目标节点执行 Canvas 操作：

```text
# 告诉 Agent：
在 节点A 上打开 Canvas 并显示今日天气卡片
```

`nodes` 工具内置的 Canvas 命令与独立 `canvas` 工具功能完全一致：

- `canvas.present`：显示 Canvas
- `canvas.hide`：隐藏 Canvas
- `canvas.navigate`：打开 URL
- `canvas.eval`：执行 JavaScript
- `canvas.snapshot`：截图

---

## 常见使用场景

::: details 场景一：手机实时看板
让 Agent 定期拉取数据，生成 A2UI 卡片，推送到手机 Canvas，作为轻量的数据看板。
:::

::: details 场景二：Agent 汇报结果
Agent 完成任务后，可以通过 Canvas 推送结果卡片，把关键数字、状态和下一步放在一张界面里。
:::

::: details 场景三：远程打开网页
让 Agent 在你的手机 Canvas 里打开特定网页，并高亮/标注关键区域，省去你自己去找的步骤。
:::

::: details 场景四：调试与预览
开发自定义技能时，用 `snapshot` 截取 Canvas 状态，确认 A2UI 渲染效果是否符合预期。
:::

---

## 注意事项

::: warning
- Canvas 工具仅对已配对且在线的节点有效，离线节点无法接收推送
- A2UI 严格使用 v0.8 JSONL 格式，v0.9 格式和 `createSurface` 会被拒绝
- `eval` 执行的 JavaScript 运行在节点的 WebView 沙箱中，与节点系统隔离
- 频繁调用 `snapshot` 可能增加节点负载，建议仅在需要时使用
:::

---

_下一步：[技能系统（Skills）](/tutorials/tools/skills)_
