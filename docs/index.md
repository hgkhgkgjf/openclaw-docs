---
layout: home
title: OpenClaw 中文文档 | 安装教程 · 源码剖析 · AI智能体框架
description: OpenClaw 中文完整文档，767篇教程。安装部署、Gateway配置、Web控制UI、节点、WhatsApp/Telegram/Discord/飞书多通道接入，支持 Claude、DeepSeek、Ollama 本地模型，源码剖析与架构分析。
head:
  - - meta
    - name: keywords
      content: OpenClaw, ClawdBot, clawdbot, openclaw, AI智能体, AI Agent, 多通道机器人, WhatsApp机器人, Telegram机器人, Discord机器人, Slack机器人, 飞书机器人, Signal机器人, iMessage机器人, 自动回复, 群聊机器人, 智能体框架, 通道适配器, 上下文管理, 状态机, Gateway, 本地大模型, Ollama, DeepSeek, 通义千问, Kimi, OpenRouter, MCP, 私有部署, 本地部署, Node.js, TypeScript, Docker, 源码剖析, 架构分析, 项目拆解, 从0到1, 开源AI助手, 开源AI框架
hero:
  name: OpenClaw 中文教程
  text: 先让你用懂，再带你看懂源码
  tagline: 覆盖最新版 Gateway、Web 控制 UI、节点、插件、通道、模型、工具和智能体执行链路。先用零基础教程跑起来，再用工程视角拆源码。
  actions:
    - theme: brand
      text: 零基础照着做
      link: /tutorials/getting-started/grandma-guide
    - theme: alt
      text: 阅读完整拆解主线
      link: /beginner-openclaw-guide/
    - theme: alt
      text: 进入 AI 重点框架
      link: /beginner-openclaw-framework-focus/
---

<div class="oc-home-seo">

<!-- ── 三大核心模块卡片 ── -->
<section class="oc-module-grid">

<a href="/tutorials/" class="oc-module oc-module--tutorials">
<div class="oc-module-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
</div>
<div class="oc-module-body">
<span class="oc-module-num">00</span>
<h3>安装教程</h3>
<p>从安装到控制 UI、Gateway、通道和模型配置，手把手带你跑起来。先能用，再深入。</p>
</div>
<span class="oc-module-arrow">&rarr;</span>
</a>

<a href="/beginner-openclaw-guide/" class="oc-module oc-module--primary">
<div class="oc-module-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v15H3z"/><path d="M10 12h4m-2-2v4"/></svg>
</div>
<div class="oc-module-body">
<span class="oc-module-num">01</span>
<h3>完整工程主线</h3>
<p>从 CLI 到 Gateway、插件、节点、Routing 与 Agent 执行，按真实链路拆解模块边界与调用关系。</p>
</div>
<span class="oc-module-arrow">&rarr;</span>
</a>

<a href="/beginner-openclaw-framework-focus/" class="oc-module oc-module--secondary">
<div class="oc-module-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83"/></svg>
</div>
<div class="oc-module-body">
<span class="oc-module-num">02</span>
<h3>AI 核心框架</h3>
<p>梳理上下文管理、状态机、工具策略、模型回退、记忆系统、Hook 与插件注入机制。</p>
</div>
<span class="oc-module-arrow">&rarr;</span>
</a>

<a href="/beginner-openclaw-guide/04-通道适配器框架与账号生命周期" class="oc-module oc-module--tertiary">
<div class="oc-module-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/><path d="M7 8l3 3-3 3m5 0h3"/></svg>
</div>
<div class="oc-module-body">
<span class="oc-module-num">03</span>
<h3>通道适配器实现</h3>
<p>重点讲接口合同、注册链路、账号生命周期、入站路由与出站发送的工程实现。</p>
</div>
<span class="oc-module-arrow">&rarr;</span>
</a>

</section>

<!-- ── 数据指标条 ── -->
<section class="oc-metrics">
<div class="oc-metric"><span class="oc-metric-val">200+</span><span class="oc-metric-key">深度文档</span></div>
<div class="oc-metric-sep"></div>
<div class="oc-metric"><span class="oc-metric-val">3</span><span class="oc-metric-key">学习主线</span></div>
<div class="oc-metric-sep"></div>
<div class="oc-metric"><span class="oc-metric-val">680</span><span class="oc-metric-key">教程文档</span></div>
<div class="oc-metric-sep"></div>
<div class="oc-metric"><span class="oc-metric-val">40+</span><span class="oc-metric-key">函数级剖析</span></div>
</section>

<!-- ── 你将学到什么 ── -->
<section class="oc-home-panel">
<h2 class="oc-section-label">你将学到什么</h2>
<p class="oc-section-desc">本项目文档面向「要动手实现」的读者，而不只是看概念。你会系统理解 OpenClaw 的智能体框架、通道适配器、上下文管理、状态机、Gateway 控制面与工程化边界。</p>
<div class="oc-home-tags">
<span>源码路径明确</span>
<span>小白友好讲解</span>
<span>可直接复刻</span>
<span>覆盖 AI 核心</span>
<span>函数级精度</span>
<span>状态机驱动</span>
</div>
</section>

<!-- ── 学习入口 ── -->
<section class="oc-home-entry-grid">
<article class="oc-home-entry oc-home-entry--highlight">
<h3>Track 0</h3>
<p class="oc-home-entry-title">新手入门 · 安装教程</p>
<p>还没装好 OpenClaw？从这里开始。按“准备、复制命令、看到什么算成功、失败看哪里”的节奏，一步一步跑起来。</p>
<a href="/tutorials/getting-started/grandma-guide">零基础照着做 &rarr;</a>
</article>
<article class="oc-home-entry">
<h3>Track A</h3>
<p class="oc-home-entry-title">项目完整拆解主线</p>
<p>先建立全局工程脑图，理解系统如何从输入消息走到模型回复再返回通道。涵盖 CLI、Gateway、插件、节点、路由、Agent 全链路。</p>
<a href="/beginner-openclaw-guide/">进入主线 &rarr;</a>
</article>
<article class="oc-home-entry">
<h3>Track B</h3>
<p class="oc-home-entry-title">AI 重点框架专项</p>
<p>聚焦上下文工程、执行状态机、工具策略与审批、模型回退、记忆系统等 AI 实现核心，可直接复刻。</p>
<a href="/beginner-openclaw-framework-focus/">进入专项 &rarr;</a>
</article>
<article class="oc-home-entry">
<h3>Track C</h3>
<p class="oc-home-entry-title">通道适配器框架</p>
<p>重点学习通道接口合同、注册机制、账号生命周期、路由与发送解耦，这是对接外部平台的主线。</p>
<a href="/beginner-openclaw-guide/53-函数级剖析-通道适配器框架实现">看函数级实战 &rarr;</a>
</article>
</section>

<!-- ── 推荐路径 ── -->
<section class="oc-home-path">
<h3>推荐阅读路径（从 0 到 1）</h3>
<ol>
<li>第一步：看「<a href="/tutorials/getting-started/grandma-guide">零基础照着做</a>」，把 OpenClaw 装好，并先用控制 UI 发出第一条消息。</li>
<li>第二步：看「项目完整拆解主线」，建立全局工程脑图与模块边界概念。</li>
<li>第三步：看「AI 重点框架专项」，弄清楚上下文、状态机与工具策略实现原理。</li>
<li>最后：看函数级剖析章节，按步骤复刻核心能力到你自己的项目中。</li>
</ol>
</section>

<!-- ── 常见问题 FAQ ── -->
<section class="oc-home-faq">
<h2>常见问题</h2>

<details>
<summary><strong>OpenClaw 是什么？</strong></summary>
<p>OpenClaw 是一款自托管的多通道 AI 助手平台。它通过 Gateway 统一连接浏览器控制 UI、聊天通道、移动节点、工具和模型，让你的 AI 助手运行在 WhatsApp、Telegram、Discord、Slack、Signal、iMessage、飞书等入口上。</p>
</details>

<details>
<summary><strong>OpenClaw 支持哪些聊天平台？</strong></summary>
<p>支持 <strong>WhatsApp、Telegram、Discord、Slack、Signal、iMessage/BlueBubbles、飞书（Feishu）、Mattermost、Google Chat、Microsoft Teams、Matrix、LINE、Zalo、QQ、WeChat、Nostr、Twitch、IRC、WebChat</strong> 等入口。</p>
</details>

<details>
<summary><strong>OpenClaw 支持哪些 AI 模型？</strong></summary>
<p>支持 <strong>Anthropic Claude、OpenAI GPT、DeepSeek、通义千问（Qwen）、Kimi（月之暗面）、智谱 GLM、MiniMax、Ollama 本地大模型</strong>，以及通过 OpenRouter、LiteLLM、Cloudflare AI Gateway 接入的其他模型。</p>
</details>

<details>
<summary><strong>OpenClaw 怎么安装？</strong></summary>
<p>推荐使用安装脚本，或运行 <code>npm install -g openclaw@latest</code>，然后执行 <code>openclaw onboard --install-daemon</code> 完成配置并安装 Gateway 后台服务。支持 macOS、Linux、Windows，Windows 完整体验推荐 WSL2。详见<a href="/tutorials/installation/">安装教程</a>。</p>
</details>

<details>
<summary><strong>OpenClaw 和 ClawdBot 是什么关系？</strong></summary>
<p>OpenClaw 的前身就是 <strong>ClawdBot</strong>，项目品牌升级后正式更名为 OpenClaw，功能与代码库保持延续。如果你之前使用过 ClawdBot，OpenClaw 就是它的新版本。</p>
</details>

<details>
<summary><strong>OpenClaw Gateway 是什么？</strong></summary>
<p>OpenClaw Gateway 是核心常驻进程，负责统一管理所有通道连接、消息路由、Agent 调度与会话存储。新手推荐通过 <code>openclaw onboard --install-daemon</code> 安装为后台服务，默认监听 18789 端口。</p>
</details>

<details>
<summary><strong>OpenClaw 支持本地大模型吗？</strong></summary>
<p>支持。OpenClaw 可通过 <strong>Ollama</strong> 接入本地大模型（如 Llama、Qwen、DeepSeek 等），实现完全私有化部署，无需外部 API，数据不出本地。</p>
</details>

</section>

<!-- ── 品牌说明（SEO） ── -->
<section class="oc-home-rebrand">
<h3>关于 OpenClaw</h3>
<p>OpenClaw 是一款面向开发者和高级用户的开源个人 AI 助手平台，支持 <strong>WhatsApp、Telegram、Discord、Slack、Signal、iMessage/BlueBubbles、飞书（Feishu）、Mattermost、Microsoft Teams、Google Chat、Matrix、LINE、Zalo、QQ、WeChat、WebChat</strong> 等入口。本文档同步覆盖最新 Gateway、Control UI、节点、插件与 Agent 核心模块。</p>
<p>支持接入 <strong>Anthropic Claude、OpenAI GPT、DeepSeek、通义千问（Qwen）、Kimi（月之暗面）、智谱 GLM、MiniMax、Ollama 本地大模型</strong>等主流 AI 提供商，也可通过 OpenRouter、LiteLLM、Cloudflare AI Gateway 统一代理。</p>
<p>如果你想先用起来，先看零基础照着做；如果你想理解实现，再进入源码剖析、架构分析与复刻实战。</p>
</section>

</div>
