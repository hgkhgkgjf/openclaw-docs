---
title: "安全文件操作"
sidebarTitle: "安全文件操作"
description: "说明 OpenClaw 如何用 @openclaw/fs-safe 安全处理本地文件路径、写入、解压、临时目录和密钥文件。"
---

# 安全文件操作

OpenClaw 会读写本地文件：配置、会话、插件、技能、临时下载、压缩包解压、密钥文件，都离不开文件系统。

这页讲一个容易误会的点：OpenClaw 使用 `@openclaw/fs-safe` 让文件操作更稳、更不容易越界，但它不是沙箱。

::: tip 先看人话
`fs-safe` 像“带护栏的文件工具箱”。它能帮 OpenClaw 拒绝危险路径、限制只能在指定根目录里操作、用原子写入减少写坏文件的概率。

但它不是保险柜。如果你想隔离不信任的人，要用单独 OS 用户、容器、虚拟机或单独 Gateway。
:::

---

## OpenClaw 用它保护哪些事

OpenClaw 会把安全敏感的本地文件操作尽量放到 `@openclaw/fs-safe` 这类统一工具里，例如：

- 限制路径只能在某个根目录内。
- 拒绝 `..` 这种试图跳出目录的路径。
- 拒绝不该出现的绝对路径。
- 写配置和状态文件时使用原子替换，减少半截文件。
- 解压压缩包时限制大小、文件数量、链接和目标目录。
- 创建临时工作区，用完后清理。
- 保存密钥或私有状态时使用更严格的文件权限。

这些保护的目标是：可信的 OpenClaw 代码在处理不可信路径输入时，不要轻易踩坑。

不可信路径输入可能来自：

- 用户消息。
- 模型输出。
- 插件参数。
- 通道事件。
- 配置里引用的文件名。

---

## 默认不启用 Python helper

OpenClaw 当前默认把 fs-safe 的 POSIX Python helper 关掉。

原因很朴素：

- Gateway 不应该默认启动一个长期 Python 辅助进程。
- 很多桌面、Docker、CI、打包应用环境并不需要它。
- 默认关闭可以让安装行为更可预测。

默认行为等价于：

```bash
OPENCLAW_FS_SAFE_PYTHON_MODE=off
```

如果你明确需要更强的 POSIX 文件描述符相对操作保护，可以手动打开。

有 Python 就用，没有就退回 Node 路径：

```bash
OPENCLAW_FS_SAFE_PYTHON_MODE=auto
```

必须启用 Python helper，否则直接失败：

```bash
OPENCLAW_FS_SAFE_PYTHON_MODE=require
```

指定 Python 路径：

```bash
OPENCLAW_FS_SAFE_PYTHON=/usr/bin/python3
```

通用环境变量也可以用：

```bash
FS_SAFE_PYTHON_MODE=auto
FS_SAFE_PYTHON=/usr/bin/python3
```

::: warning 什么时候用 `require`
只有当 Python helper 是你安全方案的一部分时，才用 `require`。
如果只是“有就更好，没有也能跑”，用 `auto`。
:::

---

## 不开 Python 还保护什么

即使 Python helper 关闭，OpenClaw 仍然会使用 fs-safe 的 Node 路径保护：

- 拒绝 `..`、绝对路径、错误分隔符等路径逃逸。
- 通过受信任根目录来解析文件，而不是自己拼字符串。
- 在需要拒绝符号链接或硬链接的 API 上执行对应策略。
- 读取文件时做身份检查。
- 写状态文件时使用同目录临时文件再替换。
- 限制读取大小和解压大小。
- 对密钥、状态文件使用更私有的权限。

这已经覆盖普通个人 OpenClaw 部署的大多数风险。

---

## Python helper 多保护什么

在 POSIX 系统上，fs-safe 的 Python helper 会保持一个 Python 进程，用文件描述符相对操作来处理一些父目录变更，例如：

- `rename`
- `remove`
- `mkdir`
- `stat`
- `list`
- 部分写入路径

它主要减少一种很细的风险：同一个系统用户下，另一个本地进程在“检查路径”和“真正修改文件”之间偷偷替换父目录。

如果你的机器上有不可信本地进程，而且它们能改 OpenClaw 正在操作的目录，才更需要这层防护。

---

## 插件作者应该怎么做

如果你写 OpenClaw 插件，请按这个规则来：

- 路径来自消息、模型、配置或插件参数时，不要直接用 Node 的 `fs` 操作。
- 优先使用 `openclaw/plugin-sdk/*` 里提供的文件、路径、临时目录和密钥辅助函数。
- 需要解压压缩包时，必须限制大小、文件数量、链接和目标目录。
- 写密钥文件时，用 OpenClaw 的 secret/private-state helper，不要自己手写 `fs.writeFile` 加 `chmod`。

::: tip 简单判断
只要路径不是你代码里写死的，而是别人传进来的，就当它“不可信”。
:::

---

## 它不是沙箱

`fs-safe` 只是文件操作护栏。
它不能替代：

- 操作系统用户隔离。
- 容器隔离。
- 虚拟机隔离。
- Gateway 工具权限策略。
- `exec` 审批和沙箱。

如果你要让互不信任的人共用系统，不要指望一个库来完成隔离。
正确做法是拆边界：

- 不同 Gateway。
- 不同 OS 用户。
- 不同主机或容器。
- 不同凭据和工作区。

---

## 相关页面

- [安全总览](/tutorials/gateway/security/)
- [沙箱](/tutorials/gateway/sandboxing)
- [Exec 审批](/tutorials/tools/exec-approvals)
- [密钥与 SecretRef](/tutorials/gateway/secrets)
