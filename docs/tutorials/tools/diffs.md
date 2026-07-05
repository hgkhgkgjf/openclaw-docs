---
title: "Diffs"
sidebarTitle: "Diffs 差异视图"
---

# Diffs：把修改内容变成清楚的对比图

`diffs` 是一个可选插件工具，用来把修改前后或 unified patch 渲染成只读差异视图。

它适合让 Agent 在聊天或画布里说明“改了什么”。

---

## 输入方式

两种常见输入：

1. `before` 和 `after`。
2. 一个 unified `patch`。

输出可以是：

- viewer URL。
- PNG 或 PDF 文件。
- 两者都有。

---

## 启用

```bash
openclaw plugins install diffs
```

配置示意：

```json5
{
  plugins: {
    entries: {
      diffs: {
        enabled: true
      }
    }
  }
}
```

---

## 什么时候用？

适合：

- 给非技术用户说明文档改动。
- 在聊天里发送补丁预览。
- 让 Agent 生成可查看的 diff 文件。

不适合：

- 真正应用补丁。
- 代替 Git。
- 把敏感代码发到不可信通道。

---

## 继续阅读

- [插件专题](/tutorials/plugins/)
- [Canvas 画布](/tutorials/tools/canvas)
- [Exec 命令工具](/tutorials/tools/exec)
