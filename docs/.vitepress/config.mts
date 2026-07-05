import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function sortByPrefix(a: string, b: string): number {
  const pa = a.match(/^(\d+)/)
  const pb = b.match(/^(\d+)/)
  if (pa && pb) return Number(pa[1]) - Number(pb[1])
  if (pa) return -1
  if (pb) return 1
  return a.localeCompare(b, 'zh-Hans-CN')
}

/** 从 markdown 文件提取 H1 标题，失败时回退到文件名 */
function extractTitle(filePath: string, fallback: string): string {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)/m)
    if (match) {
      // 去掉开头的编号前缀如 "00 " "01 " "12 "
      return match[1].replace(/^\d+\s+/, '').trim()
    }
  } catch {}
  // 去掉文件名中的编号前缀
  return fallback.replace(/^\d+-/, '').trim()
}

interface SidebarItem {
  text: string
  link: string
}

function listMdItems(dir: string): SidebarItem[] {
  const abs = resolve(__dirname, '..', dir)
  const files: string[] = []

  function walk(currentAbs: string, currentRel = '') {
    for (const entry of readdirSync(currentAbs, { withFileTypes: true })) {
      const rel = currentRel ? `${currentRel}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        walk(resolve(currentAbs, entry.name), rel)
        continue
      }
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md' && entry.name !== 'index.md') {
        files.push(rel)
      }
    }
  }

  walk(abs)
  files.sort(sortByPrefix)

  return files.map((f) => {
    const name = f.replace(/\.md$/, '')
    const title = extractTitle(resolve(abs, f), name)
    return {
      text: title,
      link: `/${dir}/${name}`,
    }
  })
}

/** 按编号范围过滤侧边栏项 */
function filterByRange(items: SidebarItem[], min: number, max: number): SidebarItem[] {
  return items.filter((item) => {
    const match = item.link.match(/\/(\d+)-/)
    if (!match) return false
    const num = Number(match[1])
    return num >= min && num <= max
  })
}

// 预加载所有项
const guideItems = listMdItems('beginner-openclaw-guide')
const frameworkItems = listMdItems('beginner-openclaw-framework-focus')

// 教程项
const tutGettingStarted = listMdItems('tutorials/getting-started')
// 快速入门核心 4 页（固定顺序）
const tutGettingStartedCore: SidebarItem[] = [
  { text: '零基础照着做', link: '/tutorials/getting-started/grandma-guide' },
  { text: '快速开始（先跑通控制 UI）', link: '/tutorials/getting-started/getting-started' },
  { text: '安装 OpenClaw', link: '/tutorials/installation/' },
  { text: '命令行向导安装', link: '/tutorials/getting-started/wizard' },
  { text: '安装后配置与常见问题', link: '/tutorials/getting-started/setup' },
]
// 快速入门进阶参考（排除核心 4 页）
const tutGettingStartedCoreLinks = new Set(tutGettingStartedCore.map((i) => i.link))
const tutGettingStartedExtra = tutGettingStarted.filter((i) => !tutGettingStartedCoreLinks.has(i.link))

const tutInstallation = listMdItems('tutorials/installation')
const tutGateway = listMdItems('tutorials/gateway')
const tutChannels = listMdItems('tutorials/channels')
const tutProvidersAll = listMdItems('tutorials/providers')
// 自定义提供商单独置于底部分组，从自动列表中排除避免重复
const tutProviders = tutProvidersAll.filter((i) => i.link !== '/tutorials/providers/custom')
const tutProvidersCustom: SidebarItem[] = [
  { text: '自定义模型提供商', link: '/tutorials/providers/custom' },
]
const tutConcepts = listMdItems('tutorials/concepts')
const tutAutomation = listMdItems('tutorials/automation')
const tutHelp = listMdItems('tutorials/help')
const tutTools = listMdItems('tutorials/tools')
const tutPlugins = listMdItems('tutorials/plugins')
const tutCli = listMdItems('tutorials/cli')
const tutReference = listMdItems('tutorials/reference')
const tutPlatforms = listMdItems('tutorials/platforms')
const tutDiagnostics = listMdItems('tutorials/diagnostics')
const tutPlan = listMdItems('tutorials/plan')
const tutWeb = listMdItems('tutorials/web')
const tutNodes = listMdItems('tutorials/nodes')

const SITE_URL = 'https://openclaw-docs.dx3n.cn'
const DEFAULT_TITLE = 'OpenClaw 中文文档 | 源码剖析 · 安装教程 · AI智能体框架'
const DEFAULT_DESCRIPTION = 'OpenClaw 中文完整文档，覆盖安装部署、源码剖析、Gateway配置、Web控制UI、节点、WhatsApp/Telegram/Discord/飞书多通道接入，支持 Claude、DeepSeek、Ollama 本地模型。'

const homepageJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'OpenClaw 中文文档',
      alternateName: ['ClawdBot 文档', 'ClawdBot Docs', 'openclaw docs', 'OpenClaw 源码剖析'],
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'zh-CN',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?search={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'OpenClaw',
      alternateName: 'ClawdBot',
      url: `${SITE_URL}/`,
      sameAs: ['https://github.com/yeuxuan/openclaw-docs'],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'OpenClaw 是什么？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenClaw 是一款自托管的多通道 AI 助手平台，通过 Gateway 统一连接控制 UI、聊天通道、节点、工具和模型，让你的 AI 助手在浏览器、手机和常用聊天软件中运行。',
          },
        },
        {
          '@type': 'Question',
          name: 'OpenClaw 支持哪些聊天平台？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenClaw 支持 WhatsApp、Telegram、Discord、Slack、Signal、iMessage、飞书（Feishu）、Mattermost、Google Chat、MS Teams、Matrix、Zalo、IRC 等主流即时通讯平台。',
          },
        },
        {
          '@type': 'Question',
          name: 'OpenClaw 支持哪些 AI 模型？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenClaw 支持 Anthropic Claude、OpenAI GPT、DeepSeek、通义千问（Qwen）、Kimi（月之暗面）、智谱 GLM、MiniMax、Ollama 本地大模型，以及通过 OpenRouter、LiteLLM、Cloudflare AI Gateway 接入的其他模型。',
          },
        },
        {
          '@type': 'Question',
          name: 'OpenClaw 怎么安装？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenClaw 推荐通过安装脚本或 npm 安装，然后运行 openclaw onboard --install-daemon 完成向导配置并安装 Gateway 后台服务。支持 macOS、Linux、Windows，Windows 完整体验推荐 WSL2。',
          },
        },
        {
          '@type': 'Question',
          name: 'OpenClaw 和 ClawdBot 是什么关系？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenClaw 的前身就是 ClawdBot，项目品牌升级后正式更名为 OpenClaw，功能与代码库保持延续，如果你之前使用过 ClawdBot，OpenClaw 就是它的新版本。',
          },
        },
        {
          '@type': 'Question',
          name: 'OpenClaw Gateway 是什么？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenClaw Gateway 是核心常驻进程，负责统一管理所有通道连接、消息路由、Agent 调度与会话存储。通过 openclaw gateway 命令启动，默认监听 18789 端口。',
          },
        },
        {
          '@type': 'Question',
          name: 'OpenClaw 支持本地大模型吗？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '支持。OpenClaw 可通过 Ollama 接入本地大模型（如 Llama、Qwen、DeepSeek 等），实现完全私有化部署，无需外部 API，数据不出本地。',
          },
        },
      ],
    },
  ],
})

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function pagePathToUrl(page: string): { path: string; canonical: string } {
  const path = page
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
  return {
    path,
    canonical: path ? `${SITE_URL}/${path}` : `${SITE_URL}/`,
  }
}

function sectionName(path: string): string {
  if (!path) return '首页'
  if (path.startsWith('beginner-openclaw-guide')) return '完整工程主线'
  if (path.startsWith('beginner-openclaw-framework-focus')) return 'AI 核心框架'
  if (path.startsWith('tutorials/getting-started')) return '快速入门'
  if (path.startsWith('tutorials/installation')) return '安装部署'
  if (path.startsWith('tutorials/gateway')) return 'Gateway'
  if (path.startsWith('tutorials/channels')) return '通道接入'
  if (path.startsWith('tutorials/providers')) return '模型 Provider'
  if (path.startsWith('tutorials/concepts')) return '核心概念'
  if (path.startsWith('tutorials/tools')) return '工具系统'
  if (path.startsWith('tutorials/plugins')) return '插件专题'
  if (path.startsWith('tutorials/cli')) return 'CLI 命令'
  if (path.startsWith('tutorials/automation')) return '自动化'
  if (path.startsWith('tutorials/help')) return '帮助与调试'
  return 'OpenClaw 教程'
}

function buildPageJsonLd(path: string, canonical: string, title: string, description: string): string {
  if (!path) return homepageJsonLd

  const titleText = stripHtml(title || DEFAULT_TITLE)
  const descriptionText = stripHtml(description || DEFAULT_DESCRIPTION)
  const section = sectionName(path)
  const sectionPath = path.includes('/') ? `${SITE_URL}/${path.split('/')[0]}/` : canonical

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: section, item: sectionPath },
          { '@type': 'ListItem', position: 3, name: titleText, item: canonical },
        ],
      },
      {
        '@type': 'TechArticle',
        '@id': `${canonical}#article`,
        headline: titleText,
        description: descriptionText,
        inLanguage: 'zh-CN',
        url: canonical,
        mainEntityOfPage: canonical,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  })
}

export default withMermaid(defineConfig({
  markdown: {
    config(md) {
      // vitepress-plugin-mermaid overrides VitePress's highlight function,
      // bypassing the {{ }} escaping that VitePress normally applies to code blocks.
      // Re-apply escaping by wrapping the fence and code_inline renderers.
      const escapeBraces = (html: string) =>
        html.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')

      const origFence = md.renderer.rules.fence
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const result = origFence
          ? origFence.call(this, tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        return escapeBraces(result)
      }

      const origCodeInline = md.renderer.rules.code_inline
      md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
        const result = origCodeInline
          ? origCodeInline.call(this, tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        return escapeBraces(result)
      }
    },
  },
  lang: 'zh-CN',
  title: DEFAULT_TITLE,
  titleTemplate: ':title | OpenClaw 中文文档',
  description: DEFAULT_DESCRIPTION,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: SITE_URL,
    transformItems(items) {
      return items.map((item) => {
        // 首页最高权重，每日更新
        if (item.url === '') {
          return { ...item, changefreq: 'daily', priority: 1.0 }
        }
        // 教程目录页
        if (item.url.endsWith('/') && item.url !== '') {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
        // 普通文档页
        return { ...item, changefreq: 'weekly', priority: 0.7 }
      })
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'google-site-verification', content: '7B8csMYFOdvV0gzceMtR7a35llw1xqWXLeFp3AY4joo' }],
    ['meta', { name: 'msvalidate.01', content: 'FDCCD88DCD82F43265BDB13F25164705' }],
    ['meta', { name: 'indexnow-key', content: 'b5c07ad1556cbf950d03b26f7e17f4e8' }],
    ['meta', { name: 'google-adsense-account', content: 'ca-pub-8945138028622018' }],
    ['script', { async: 'true', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8945138028622018', crossorigin: 'anonymous' }],
    ['meta', { name: 'author', content: 'OpenClaw' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { name: 'keywords', content: 'OpenClaw, ClawdBot, clawdbot, openclaw, AI智能体, AI Agent, 多通道机器人, WhatsApp机器人, Telegram机器人, Discord机器人, Slack机器人, 飞书机器人, Signal机器人, iMessage机器人, Mattermost, MS Teams, 自动回复, 群聊机器人, 智能体框架, 通道适配器, 上下文管理, 状态机, Gateway, 本地大模型, Ollama, DeepSeek, 通义千问, Kimi, 智谱GLM, OpenRouter, MCP, 私有部署, 本地部署, Node.js, TypeScript, Docker, 源码剖析, 项目拆解, 开源AI助手, 开源AI框架' }],
    ['meta', { name: 'theme-color', content: '#161412' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'OpenClaw 中文文档' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/og-image.png` }],
    // Microsoft Clarity
    ['script', { type: 'text/javascript' }, `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vo93r5hbry");`],
  ],
  transformHead({ page, title, description: pageDesc }) {
    const { path, canonical } = pagePathToUrl(page)
    const ogTitle = stripHtml(title || DEFAULT_TITLE)
    const ogDesc = stripHtml(pageDesc || DEFAULT_DESCRIPTION)
    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:type', content: path ? 'article' : 'website' }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: ogDesc }],
      ['meta', { name: 'twitter:title', content: ogTitle }],
      ['meta', { name: 'twitter:description', content: ogDesc }],
      ['script', { type: 'application/ld+json' }, buildPageJsonLd(path, canonical, ogTitle, ogDesc)],
    ]
  },
  themeConfig: {
    siteTitle: 'OpenClaw 文档',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    nav: [
      { text: '首页', link: '/' },
      {
        text: '教程',
        items: [
          { text: '教程中心', link: '/tutorials/' },
          { text: '零基础照着做', link: '/tutorials/getting-started/grandma-guide' },
          { text: '安装部署', link: '/tutorials/installation/' },
          { text: '网关配置', link: '/tutorials/gateway/' },
          { text: '通道接入', link: '/tutorials/channels/' },
          { text: 'AI 模型', link: '/tutorials/providers/' },
          { text: '核心概念', link: '/tutorials/concepts/' },
          { text: '工具系统', link: '/tutorials/tools/' },
          { text: '插件专题', link: '/tutorials/plugins/' },
          { text: 'CLI 命令', link: '/tutorials/cli/' },
          { text: '参考资料', link: '/tutorials/reference/' },
          { text: '平台支持', link: '/tutorials/platforms/' },
          { text: '诊断专题', link: '/tutorials/diagnostics/' },
          { text: '架构计划', link: '/tutorials/plan/' },
          { text: 'Web 控制 UI', link: '/tutorials/web/' },
          { text: '节点', link: '/tutorials/nodes/' },
          { text: '自动化', link: '/tutorials/automation/' },
          { text: '帮助与调试', link: '/tutorials/help/' },
        ],
      },
      { text: '项目拆解', link: '/beginner-openclaw-guide/' },
      { text: '重点框架', link: '/beginner-openclaw-framework-focus/' },
    ],
    sidebar: {
      '/tutorials/getting-started/': [
        {
          text: '导航',
          items: [{ text: '教程中心', link: '/tutorials/' }],
        },
        {
          text: '新手必读',
          collapsed: false,
          items: tutGettingStartedCore,
        },
        {
          text: '进阶参考',
          collapsed: true,
          items: tutGettingStartedExtra,
        },
      ],
      '/tutorials/installation/': [
        {
          text: '安装部署',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutInstallation,
          ],
        },
      ],
      '/tutorials/gateway/': [
        {
          text: '网关配置与运维',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutGateway,
          ],
        },
      ],
      '/tutorials/channels/': [
        {
          text: '通道接入',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutChannels,
          ],
        },
      ],
      '/tutorials/providers/': [
        {
          text: '模型 Provider',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutProviders,
          ],
        },
        {
          text: '自定义接入',
          collapsed: false,
          items: tutProvidersCustom,
        },
      ],
      '/tutorials/concepts/': [
        {
          text: '核心概念',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutConcepts,
          ],
        },
      ],
      '/tutorials/tools/': [
        {
          text: '工具系统',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutTools,
          ],
        },
      ],
      '/tutorials/plugins/': [
        {
          text: '插件专题',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: '插件专题', link: '/tutorials/plugins/' },
            ...tutPlugins,
          ],
        },
      ],
      '/tutorials/cli/': [
        {
          text: 'CLI 命令专题',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: 'CLI 命令专题', link: '/tutorials/cli/' },
            ...tutCli,
          ],
        },
      ],
      '/tutorials/reference/': [
        {
          text: '参考资料专题',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: '参考资料专题', link: '/tutorials/reference/' },
            ...tutReference,
          ],
        },
      ],
      '/tutorials/platforms/': [
        {
          text: '平台支持',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: '平台支持', link: '/tutorials/platforms/' },
            ...tutPlatforms,
          ],
        },
      ],
      '/tutorials/diagnostics/': [
        {
          text: '诊断专题',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: '诊断专题', link: '/tutorials/diagnostics/' },
            ...tutDiagnostics,
          ],
        },
      ],
      '/tutorials/plan/': [
        {
          text: '架构计划',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: '架构计划', link: '/tutorials/plan/' },
            ...tutPlan,
          ],
        },
      ],
      '/tutorials/web/': [
        {
          text: 'Web 控制 UI',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: 'Web 控制 UI', link: '/tutorials/web/' },
            ...tutWeb,
          ],
        },
      ],
      '/tutorials/nodes/': [
        {
          text: '节点',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            { text: '节点入门', link: '/tutorials/nodes/' },
            ...tutNodes,
          ],
        },
      ],
      '/tutorials/automation/': [
        {
          text: '自动化',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutAutomation,
          ],
        },
      ],
      '/tutorials/help/': [
        {
          text: '帮助与故障排查',
          items: [
            { text: '教程中心', link: '/tutorials/' },
            ...tutHelp,
          ],
        },
      ],
      '/beginner-openclaw-guide/': [
        {
          text: '导航台',
          items: [{ text: '项目完整拆解导航', link: '/beginner-openclaw-guide/' }],
        },
        {
          text: '阶段一 · 全局认知',
          collapsed: false,
          items: filterByRange(guideItems, 0, 6),
        },
        {
          text: '阶段二 · 模型与扩展',
          collapsed: true,
          items: filterByRange(guideItems, 7, 11),
        },
        {
          text: '阶段三 · 智能体框架',
          collapsed: true,
          items: filterByRange(guideItems, 12, 26),
        },
        {
          text: '阶段四 · Gateway 控制平面',
          collapsed: true,
          items: filterByRange(guideItems, 27, 42),
        },
        {
          text: '阶段五 · 复刻与补齐',
          collapsed: true,
          items: filterByRange(guideItems, 43, 99),
        },
      ],
      '/beginner-openclaw-framework-focus/': [
        {
          text: '导航台',
          items: [{ text: 'AI 核心框架导航', link: '/beginner-openclaw-framework-focus/' }],
        },
        {
          text: '框架总览与路线',
          collapsed: false,
          items: filterByRange(frameworkItems, 0, 6),
        },
        {
          text: 'AI 原理系列',
          collapsed: true,
          items: filterByRange(frameworkItems, 7, 15),
        },
        {
          text: '实战系列',
          collapsed: true,
          items: filterByRange(frameworkItems, 16, 21),
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yeuxuan/openclaw-docs' },
    ],
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换暗色模式',
    lightModeSwitchTitle: '切换亮色模式',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    footer: {
      message: '用工程视角拆解 AI 智能体框架',
      copyright: 'OpenClaw Implementation Guide',
    },
    outline: {
      label: '页面目录',
      level: [2, 3],
    },
    returnToTopLabel: '回到顶部',
    lastUpdated: {
      text: '最后更新',
    },
  },
  mermaid: {
    theme: 'default',
  },
}))
