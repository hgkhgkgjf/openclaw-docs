#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const docsDir = join(root, 'docs');

const phrasePatterns = [
  ['此外', /此外/g, 3],
  ['至关重要/关键/重要', /至关重要|关键性|关键的|重要的|核心的/g, 2],
  ['深入探讨/深挖/吃透', /深入探讨|深挖|吃透/g, 2],
  ['强调/突出/彰显/展示', /强调|突出|彰显|展示/g, 2],
  ['无缝/直观/强大', /无缝|直观|强大/g, 2],
  ['持续/不断演变/格局', /持续|不断演变|格局/g, 2],
  ['证明/体现/标志着/奠定基础', /证明|体现|标志着|奠定基础/g, 3],
  ['不仅...而且/而是', /不仅[^。\n]{0,40}(而且|而是)/g, 4],
  ['模糊归因', /专家认为|行业报告显示|观察者指出|一些批评者认为|多个来源/g, 4],
  ['泛化乐观结尾', /未来.*(光明|值得期待)|令人兴奋|迈出.*重要一步|继续.*旅程/g, 4],
  ['聊天机器人痕迹', /当然！|希望这.*帮助|请告诉我|您说得.*正确/g, 6],
  ['破折号', /—/g, 1],
  ['emoji', /[\u{1F300}-\u{1FAFF}]/gu, 3],
  ['过度粗体', /\*\*[^*\n]{2,40}\*\*/g, 1],
  ['内联粗体标题列表', /^\s*[-*]\s+\*\*[^*\n]+：\*\*/gm, 4],
];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.vitepress') continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(abs));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(abs);
    }
  }
  return files;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

const results = walk(docsDir).map((file) => {
  const text = readFileSync(file, 'utf8');
  const hits = [];
  let score = 0;

  for (const [label, pattern, weight] of phrasePatterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length === 0) continue;
    score += matches.length * weight;
    hits.push({
      label,
      count: matches.length,
      line: lineOf(text, matches[0].index ?? 0),
    });
  }

  const bytes = statSync(file).size;
  const density = bytes === 0 ? 0 : score / (bytes / 1000);
  return {
    file: relative(root, file),
    score,
    density: Number(density.toFixed(2)),
    hits,
  };
}).filter((item) => item.score > 0);

results.sort((a, b) => b.score - a.score || b.density - a.density);

const limit = Number(process.argv[2] ?? 40);
for (const item of results.slice(0, limit)) {
  const detail = item.hits
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((hit) => `${hit.label}:${hit.count}@L${hit.line}`)
    .join(' | ');
  console.log(`${String(item.score).padStart(4)}  ${String(item.density).padStart(6)}  ${item.file}  ${detail}`);
}

console.error(`\nScanned ${walk(docsDir).length} markdown files; ${results.length} files matched humanizer audit patterns.`);
