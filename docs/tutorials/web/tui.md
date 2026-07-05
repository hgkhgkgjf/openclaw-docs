---
title: "TUI"
sidebarTitle: "TUI"
---

# TUI：终端里的 OpenClaw 界面

TUI 是 Terminal UI，适合喜欢终端的用户。它不需要浏览器，也能查看会话、发送消息、观察运行状态。

适合：

- 服务器 SSH 环境。
- 开发者调试。
- 不方便打开浏览器的机器。

如果你是新手，先用：

```bash
openclaw dashboard
```

等主链路跑通后，再尝试 TUI。浏览器控制台更清楚。

## TUI 适合什么

- 远程服务器没有图形界面。
- 需要在 SSH 里临时查看状态。
- 浏览器打不开，但 CLI 还能连 Gateway。

如果 TUI 卡住或显示异常，先退出终端界面，回到普通命令：

```bash
openclaw status
openclaw logs --follow
```
