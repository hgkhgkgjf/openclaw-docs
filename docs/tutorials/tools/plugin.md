---
title: "插件系统"
sidebarTitle: "插件系统"
description: "OpenClaw 工具系统：用保姆级方式解释最新插件系统、manifest-first 架构、插件能力类型、常用命令和安全边界。"
---

# 插件系统

插件就是给 OpenClaw 加能力的“小组件”。

你不需要修改 OpenClaw 核心代码，就能通过插件增加：

- 新模型提供商。
- 新聊天通道。
- 新工具。
- 语音、转录、图片生成、视频生成。
- 网页搜索、网页抓取。
- 后台服务、Webhook、自动化能力。

---

## 先用人话理解

OpenClaw 核心像一台主机。插件像外接设备。

主机不需要把所有设备都焊死在里面，只要约定好接口：

```text
插件先说清楚：我是谁、我能做什么、我需要哪些配置。
OpenClaw 再决定：要不要启用、能不能加载、该交给谁使用。
```

这就是新版的 manifest-first 思路。

---

## manifest-first 是什么？

每个原生插件都有一个清单文件，通常叫：

```text
openclaw.plugin.json
```

这个文件会先告诉 OpenClaw：

- 插件 ID 是什么。
- 插件属于哪类能力。
- 需要哪些配置项。
- 提供哪些命令、通道、模型或工具。
- 是否有启用条件。

这样 OpenClaw 不必一上来就执行插件代码，也能先做配置校验、诊断提示和 UI 呈现。

对新手来说，你只要记住：

先看清单，再加载代码。这样更可控，也更容易排查问题。

---

## 插件能提供哪些能力

| 能力 | 例子 |
|------|------|
| 模型提供商 | OpenAI、Anthropic、Google、Ollama、vLLM |
| 通道 | Matrix、Mattermost、Twitch、Zalo、QQ、WeChat |
| 语音 | TTS、语音识别、实时语音 |
| 媒体 | 图片理解、图片生成、视频生成 |
| 网页能力 | Web search、Web fetch、Firecrawl |
| Gateway 发现 | Bonjour、远程发现 |
| 后台服务 | Webhook、自动化、诊断服务 |
| 工具 | Agent 可以调用的新能力 |

---

## 常用命令

```bash
# 查看插件
openclaw plugins list

# 查看某个插件详情
openclaw plugins inspect <插件ID>

# 安装插件
openclaw plugins install <插件来源>

# 启用插件
openclaw plugins enable <插件ID>

# 禁用插件
openclaw plugins disable <插件ID>

# 检查插件问题
openclaw plugins doctor
```

如果你不知道插件 ID，先运行：

```bash
openclaw plugins list
```

---

## 常见插件状态怎么理解

| 状态 | 意思 |
|------|------|
| enabled | 已启用 |
| disabled | 已安装但未启用 |
| blocked | 被配置或策略阻止 |
| config valid | 配置能通过校验 |
| compatibility advisory | 能用，但用了较旧模式 |
| legacy warning | 能用，但建议迁移到新接口 |
| hard error | 加载或配置有硬错误，需要处理 |

看到 warning 不一定代表坏了。先读提示，再决定是否需要改。

---

## 插件和通道是什么关系？

很多聊天通道现在都是插件化的。

例如 Matrix、Mattermost、Nostr、Twitch、Zalo、QQ、WeChat 等，都可以通过插件接入。插件负责“怎么和这个平台说话”，Gateway 负责“把消息放进统一流程”。

你可以这样理解：

```text
平台协议细节 → 通道插件负责
统一会话、权限、回复流 → Gateway 负责
```

这样核心系统不用写死每个平台的特殊逻辑。

---

## 插件和工具是什么关系？

工具是 Agent 能调用的动作。插件可以注册工具。

例如：

- 网页抓取插件提供 `web_fetch`。
- 搜索插件提供搜索工具。
- 通道插件提供消息动作。
- 语音插件提供转录或朗读能力。

Agent 看到的是“工具”，OpenClaw 背后会找到对应插件去执行。

---

## 插件安全

插件运行时可能拥有和 OpenClaw 相近的权限。安装第三方插件前要谨慎。

建议：

1. 优先使用官方或可信来源。
2. 看插件需要哪些权限。
3. 不要随便安装来历不明的本地路径插件。
4. 对高风险工具配合审批、allowlist 和沙箱。
5. 出问题先跑 `openclaw doctor` 和 `openclaw plugins doctor`。

---

## 开发者该记住的边界

如果你要写插件，记住这几条：

- 插件通过 `openclaw/plugin-sdk/*` 和核心通信。
- 插件自己的逻辑留在插件目录里。
- 核心不应该写死某个插件 ID。
- 新能力尽量通过清单和能力注册表达。
- 兼容老 hook，但新插件优先用明确能力注册。

---

## 继续阅读

- [工具系统总览](/tutorials/tools/)
- [创建 Skills](/tutorials/tools/creating-skills)
- [通道总览](/tutorials/channels/)
- [功能特性](/tutorials/concepts/features)
