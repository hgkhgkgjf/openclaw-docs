---
title: "Hostinger 部署"
sidebarTitle: "Hostinger"
description: "OpenClaw 安装部署：Hostinger 1-Click 或 VPS 方式运行 OpenClaw。"
---

# Hostinger 部署

Hostinger 提供两种路线：

- 1-Click OpenClaw：平台帮你准备基础设施，最快。
- VPS 方式：你自己管理服务器和 Docker，更可控。

---

## 1-Click 方式

适合想省事的人。

大致流程：

1. 选择 Hostinger OpenClaw 方案。
2. 在面板里选择模型或填 API Key。
3. 选择 Telegram、WhatsApp 等频道。
4. 完成部署。
5. 从 hPanel 打开 OpenClaw Dashboard。

这种方式的重点不是命令，而是记住保存好 Gateway token 和模型密钥。

---

## VPS 方式

适合想自己控制服务器的人。

你需要关注：

- Docker 容器是否正常运行
- `~/.openclaw` 状态目录是否持久化
- Gateway token 是否保存
- 更新时是否正确拉取新镜像

遇到问题先看 Docker Manager 日志。

---

## 安全提醒

- 不要把控制 UI 公开给所有人。
- API Key 不要贴到工单截图里。
- WhatsApp / Telegram 频道先用自己的账号测试。
- 若使用公网域名，必须有 HTTPS 和认证。

