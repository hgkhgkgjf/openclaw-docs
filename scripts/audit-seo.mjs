import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SITE_URL = 'https://openclaw-docs.dx3n.cn'
const DIST = 'docs/.vitepress/dist'

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (entry.endsWith('.html')) files.push(full)
  }
  return files
}

function getAttr(html, selector, attr = 'content') {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<meta[^>]+${escaped}[^>]+${attr}="([^"]+)"`, 'i'))
    || html.match(new RegExp(`<meta[^>]+${attr}="([^"]+)"[^>]+${escaped}`, 'i'))
  return match?.[1] || ''
}

function getCanonical(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1]
    || html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)?.[1]
    || ''
}

function expectedCanonical(file) {
  const rel = relative(DIST, file)
  if (rel === 'index.html') return `${SITE_URL}/`
  return `${SITE_URL}/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`
}

function jsonLdTypes(html, rel) {
  const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  const types = new Set()

  for (const script of scripts) {
    try {
      const data = JSON.parse(script[1])
      const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data]
      for (const item of graph) {
        if (item && typeof item === 'object' && item['@type']) types.add(item['@type'])
      }
    } catch (err) {
      failures.push(`${rel}: invalid JSON-LD (${err.message})`)
    }
  }

  return types
}

if (!existsSync(DIST)) {
  console.error(`Missing build output: ${DIST}`)
  process.exit(1)
}

const failures = []
const htmlFiles = walk(DIST).filter((file) => !file.endsWith('/404.html'))

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8')
  const rel = relative(DIST, file)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || ''
  const description = getAttr(html, 'name="description"')
  const canonical = getCanonical(html)
  const ogUrl = getAttr(html, 'property="og:url"')
  const jsonLdCount = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>/g)].length
  const structuredTypes = jsonLdTypes(html, rel)
  const expected = expectedCanonical(file)

  if (!title) failures.push(`${rel}: missing <title>`)
  if (!description || description.length < 20) failures.push(`${rel}: missing or short meta description`)
  if (description.length > 180) failures.push(`${rel}: meta description longer than 180 chars`)
  if (canonical !== expected) failures.push(`${rel}: canonical mismatch (${canonical || 'missing'} != ${expected})`)
  if (ogUrl !== canonical) failures.push(`${rel}: og:url mismatch (${ogUrl || 'missing'} != ${canonical || 'missing canonical'})`)
  if (jsonLdCount < 1) failures.push(`${rel}: missing JSON-LD`)
  if (rel === 'index.html') {
    if (!structuredTypes.has('WebSite')) failures.push(`${rel}: missing WebSite JSON-LD`)
    if (!structuredTypes.has('Organization')) failures.push(`${rel}: missing Organization JSON-LD`)
    if (!structuredTypes.has('FAQPage')) failures.push(`${rel}: missing FAQPage JSON-LD`)
  } else {
    if (!structuredTypes.has('BreadcrumbList')) failures.push(`${rel}: missing BreadcrumbList JSON-LD`)
    if (!structuredTypes.has('TechArticle')) failures.push(`${rel}: missing TechArticle JSON-LD`)
  }
}

const robots = readFileSync(join(DIST, 'robots.txt'), 'utf-8')
if (!/Sitemap:\s*https:\/\/openclaw-docs\.dx3n\.cn\/sitemap\.xml/i.test(robots)) {
  failures.push('robots.txt: missing canonical sitemap URL')
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf-8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
if (!sitemapUrls.includes(`${SITE_URL}/`)) failures.push('sitemap.xml: missing homepage')
if (sitemapUrls.some((url) => !url.startsWith(`${SITE_URL}/`))) {
  failures.push('sitemap.xml: contains URL outside canonical host')
}

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`)
  for (const failure of failures.slice(0, 100)) console.error(`- ${failure}`)
  if (failures.length > 100) console.error(`...and ${failures.length - 100} more`)
  process.exit(1)
}

console.log(`SEO audit passed: ${htmlFiles.length} HTML pages, ${sitemapUrls.length} sitemap URLs`)
