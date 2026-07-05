---
title: "Markdown 格式化"
sidebarTitle: "Markdown 格式化"
description: "说明 OpenClaw 如何把 Markdown 解析为 IR，再按 Slack、Telegram、Signal 等通道渲染和分块。"
---

# Markdown 格式化

OpenClaw 不会让每个通道各自重新解析 Markdown。它先把出站 Markdown 转成一份共享的中间表示（IR），再按 Slack、Telegram、Signal 等通道分别渲染。

IR 保留纯文本，同时记录加粗、斜体、链接等范围。这样分块和渲染可以共用同一份结构，跨通道行为更稳定。

---

## 目标

- 一次解析，多处渲染。
- 先在 IR 上分块，再渲染，避免加粗、链接、行内代码跨块断裂。
- 同一份 IR 可以映射到 Slack mrkdwn、Telegram HTML 和 Signal 样式范围。

---

## 管道

1. 解析 Markdown -> IR
   - IR 是纯文本加上样式跨度（加粗/斜体/删除线/代码/剧透）和链接跨度。
   - 偏移量是 UTF-16 编码单元，以便 Signal 样式范围与其 API 对齐。
   - 仅当通道选择启用表格转换时才解析表格。
2. 分块 IR
   - 分块在渲染之前在 IR 文本上进行。
   - 内联格式不会跨块拆分；跨度按块切割。
3. 按通道渲染
   - Slack 使用 mrkdwn 标记，加粗、斜体、删除线、代码都在这里处理；链接变成 `<url|label>`。
   - Telegram 使用 HTML 标签，例如 `<b>`、`<i>`、`<s>`、`<code>`、`<pre><code>`、`<a href>`。
   - Signal 使用纯文本加 `text-style` 范围；当链接标签和 URL 不同时，链接会变成 `label (url)`。

---

## IR 示例

输入 Markdown：

```markdown
Hello world : see [docs](https://docs.openclaw.ai).
```

IR（示意图）：

```json
{
  "text": "Hello world : see docs.",
  "styles": [{ "start": 6, "end": 11, "style": "bold" }],
  "links": [{ "start": 19, "end": 23, "href": "https://docs.openclaw.ai" }]
}
```

---

## 使用场景

- Slack、Telegram 和 Signal 出站适配器从 IR 渲染。
- 其他通道（WhatsApp、iMessage、MS Teams、Discord）仍然使用纯文本或它们自己的格式规则，在启用时会在分块之前应用 Markdown 表格转换。

---

## 表格处理

Markdown 表格在聊天客户端之间并不被一致支持。使用 `markdown.tables` 按通道（和按账户）控制转换。

- `code`：将表格渲染为代码块（大多数通道的默认设置）。
- `bullets`：将每行转换为项目符号（Signal + WhatsApp 的默认设置）。
- `off`：禁用表格解析和转换；原始表格文本直接通过。

配置键：

```yaml
channels:
  discord:
    markdown:
      tables: code
    accounts:
      work:
        markdown:
          tables: off
```

---

## 分块规则

- 块限制来自通道适配器/配置，并应用于 IR 文本。
- 代码围栏作为单个块保留，并带有尾部换行，以便通道正确渲染。
- 列表前缀和引用前缀是 IR 文本的一部分，因此分块不会在前缀中间拆分。
- 内联样式（加粗/斜体/删除线/行内代码/剧透）永远不会跨块拆分；渲染器在每个块内重新打开样式。

如果你需要了解更多跨通道的分块行为，参见[流式输出 + 分块](/tutorials/concepts/streaming)。

---

## 链接策略

- Slack：`[label](url)` 会变成 `<url|label>`；裸 URL 保持原样。解析期间会禁用自动链接，避免重复包一层链接。
- Telegram：`[label](url)` 会变成 `<a href="url">label</a>`，使用 HTML 解析模式。
- Signal：`[label](url)` 会变成 `label (url)`。如果标签本身就是 URL，则不重复追加。

---

## 剧透

剧透标记（`||spoiler||`）仅为 Signal 解析，映射到 SPOILER 样式范围。其他通道将其视为纯文本。

---

## 如何添加或更新通道格式化器

1. 使用共享的 `markdownToIR(...)` 解析一次，并传入通道需要的选项，例如自动链接、标题样式、引用前缀。
2. 用 `renderMarkdownWithMarkers(...)` 和样式标记映射实现渲染器；Signal 则使用样式范围。
3. 渲染前调用 `chunkMarkdownIR(...)`，再逐块渲染。
4. 更新通道出站适配器，让它使用新的分块器和渲染器。
5. 补格式测试；如果通道使用分块，也补出站投递测试。

---

## 常见陷阱

- Slack 尖括号标记（`<@U123>`、`<#C123>`、`<https://...>`）必须保留；安全转义原始 HTML。
- Telegram HTML 要求在标签外转义文本以避免标记损坏。
- Signal 样式范围依赖 UTF-16 偏移量；不要使用码点偏移量。
- 为围栏代码块保留尾部换行，以便关闭标记位于自己的行上。
