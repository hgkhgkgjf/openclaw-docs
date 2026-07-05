---
title: "Dreaming"
sidebarTitle: "Dreaming"
---

# Dreaming：后台整理记忆

Dreaming 是 OpenClaw 的后台记忆整理系统。它会把短期信号慢慢整理，把真正需要留意的内容提升到长期记忆。

默认关闭，属于进阶功能。

---

## 它写什么？

| 输出 | 用途 |
|------|------|
| `memory/.dreams/` | 机器状态、阶段信号、锁、检查点 |
| `DREAMS.md` | 给人看的梦境日记 |
| `MEMORY.md` | 真正长期记忆，只由深度阶段写入 |

---

## 三个阶段

| 阶段 | 做什么 | 是否写长期记忆 |
|------|--------|----------------|
| Light | 整理近期材料 | 否 |
| REM | 抽取主题和反复出现的想法 | 否 |
| Deep | 评分并提升需要留意记忆 | 是 |

可以把它想成：先收拾桌面，再看出规律，最后把需要留意纸条放进文件夹。

---

## 为什么要谨慎？

记忆越强，越要防止把错误、临时情绪或隐私内容写成长期事实。

所以 Dreaming 会用分数、出现次数、查询多样性和时间因素来决定是否提升。

---

## 新手建议

先不用开。
等你已经理解 [记忆搜索](/tutorials/concepts/memory-search) 和 [主动记忆](/tutorials/concepts/active-memory)，再考虑 Dreaming。

---

## 继续阅读

- [记忆 Memory](/tutorials/concepts/memory)
- [内置记忆引擎](/tutorials/concepts/memory-builtin)
- [QMD 记忆后端](/tutorials/concepts/memory-qmd)

