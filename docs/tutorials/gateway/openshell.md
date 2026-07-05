---
title: "OpenShell"
sidebarTitle: "OpenShell"
---

# OpenShell：用托管沙盒替代本机 Docker

OpenShell 是 OpenClaw 的托管沙盒后端。你可以不在本机跑 Docker，而是让 OpenClaw 通过 `openshell` CLI 创建远程沙盒，用 SSH 执行命令。

适合想要云端、隔离、可复用执行环境的用户。

---

## 前提

你需要：

- 已安装 `openshell` CLI。
- 有 OpenShell 账号和沙盒权限。
- OpenClaw Gateway 正在运行。

---

## 基本配置

示意：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "openshell",
        scope: "session",
        workspaceAccess: "rw"
      }
    }
  },
  plugins: {
    entries: {
      openshell: {
        enabled: true,
        config: {
          from: "openclaw",
          mode: "remote"
        }
      }
    }
  }
}
```

重启 Gateway 后，下一次 Agent 运行会创建或复用 OpenShell 沙盒。

---

## mirror 和 remote 怎么选？

| 模式 | 谁是主工作区 | 特点 |
|------|--------------|------|
| `mirror` | 本机 | 每次 exec 前后同步，像 Docker 后端 |
| `remote` | OpenShell 沙盒 | 初次种子同步，之后远程为准 |

新手如果还在本机编辑文件，选 `mirror` 更清楚。
长期云端 Agent 或 CI 场景，`remote` 成本更低。

---

## 验证

```bash
openclaw sandbox list
openclaw sandbox explain
```

如果远程里看不到本机新改动，先确认你是不是用了 `remote` 模式。

---

## 继续阅读

- [沙盒机制](/tutorials/gateway/sandboxing)
- [Exec 命令工具](/tutorials/tools/exec)
- [Docker VM Runtime](/tutorials/installation/docker-vm-runtime)

