---
title: 各格式支持情况
description: 同一份 JSON 在 docx、pdf、html 里哪些地方不一样：组件、图片、样式字段、分页和页眉页脚的支持对照表，以及下一版的改动。
sidebar:
  order: 10
---

同一份 JSON 在三种格式里尽量长得一样。某个格式表达不了的样式，渲染时忽略，打一条警告（同一个字段只报一次），不报错。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

## 三种格式各自怎么出

| | docx | pdf | html |
|---|---|---|---|
| 怎么生成 | docx-rs | 先转成 Typst，再编译 | 自己拼 HTML，自带 CSS |
| 字体 | 只写名字，打开时用对方电脑的字体 | 渲染时从本机找字体，嵌进文件 | 交给浏览器 |
| 图片 | 打包进文件 | 打包进文件 | 本地图写成 `data:` URI |
| 分页 | ✓ | ✓ | 打印或 `--paged` 时 |
| 页眉页脚、页码 | Word 域，打开后自己算 | 排完版算好 | 只在 `--paged` 时 |

## 组件

| 组件 | docx | pdf | html |
|---|---|---|---|
| Heading | ✓ 另外挂 Word「标题 1–6」 | ✓ | ✓ |
| Text、Code、List | ✓ | ✓ | ✓ |
| Code 的 `lineNumbers` | ✓ | ✓ | ✓ |
| Table | ✓ 部位样式逐格写 | ✓ | ✓ |
| Image | 只收 png、jpeg、gif、webp | 不收网址 | ✓ |
| PageBreak | ✓ | ✓ | 打印或 `--paged` 时 |
| Divider、Quote、Callout（下一版） | ✓ 内边距和线宽算进缩进；`radius` ✗ | ✓ | ✓ |
| TableOfContents（下一版） | Word TOC 域，更新域后才有页码 | ✓ 页码算好，可点 | 链接；`--paged` 时有页码 |
| Section | ✓ 每节末尾多一个空段落放节设置 | ✓ | `--paged` 时；打印只用第一节纸张 |
| Slide | 二级标题加正文，后面分页；部位 `body` ✗ | 一张一页 | 一张一页（16:9 框） |

## 图片

| | docx | pdf | html |
|---|---|---|---|
| png、jpeg、gif、webp | ✓ | ✓ | ✓ |
| svg | ✗，显示 alt | ✓ | ✓ |
| 网址 | ✗，显示 alt | ✗，显示 alt | ✓ |
| `float` 绕排 | ✓ | ✗，只左右对齐 | ✓ |
| `objectFit` | ✗ | ✓ | ✓ |
| `opacity` | ✗ | ✗ | ✓ |

## 文字字段

| 字段 | docx | pdf | html |
|---|---|---|---|
| `fontFamily` 回退列表 | 只取第一个名字 | ✓ | ✓ |
| `italic` | ✓ | 中文字体没有斜体 | ✓ |
| `underline` 双线、波浪 | ✓ | 画成单线，✗ | ✓ |
| `underlineColor` | ✗ | ✓ | ✓ |
| `strike: "double"` | ✓ | 画成单线，✗ | ✓ |
| `caps: "small"` | ✗ | ✓ | ✓ |
| `emphasisMark` | ✗ | ✗ | ✓ |
| `scale` | ✓ | ✗ | ✗ |
| `kerning` | ✗ | ✓ | ✓ |
| `lang` | — | ✓ | ✓ |
| 颜色透明度 | — | ✓ | ✓ |

## 段落字段

| 字段 | docx | pdf | html |
|---|---|---|---|
| `align: "distribute"` | ✓ | 按 `justify`，✗ | ✓ |
| `lineHeight: { atLeast }` | ✓ | ✓ | 按固定值 |
| `autoSpace` | ✗ | ✓ | ✓ |
| `kinsoku` | ✗ | — 默认就有 | ✓ |
| `wrap: false` | ✗ | ✗ | ✓ |
| `outlineLevel` | ✓ | — | — |
| `contextualSpacing` | ✗ | ✗ | ✗ |
| `borderBetween` | ✓ | ✗ | ✗ |

## 盒子和背景

| 字段 | docx | pdf | html |
|---|---|---|---|
| 段落 `padding` | 只在有边框时生效（内置的 Code 样式也会因此警告） | ✓ | ✓ |
| `radius` | ✗ | ✓ | ✓ |
| `background` 底纹 | ✓ | 混成纯色 | 混成纯色 |
| `background` 渐变 | 取第一个颜色 | ✓ | ✓ |
| 边框 `dashDot` / `wave` | ✓ | ✓ | 画成 dashed / solid |
| `borderDiagonal` | 尚未实现 | 尚未实现 | 尚未实现 |
| `textRotation` | 只在表格格子里 | ✓ | ✓ |

## 列表、表格、页面

| 字段 | docx | pdf | html |
|---|---|---|---|
| `listMarkerImage` | ✗ | ✓ | ✓ |
| `listMarkerGap` 写长度 | 按 `tab`，✗ | ✓ | ✓ |
| `tableLayout` | ✓ | — | ✓ |
| `rowBreak: false` | ✓ | ✗ | ✓ |
| 固定行高 `exact` | ✓ | ✓ | 按最小高度 |
| 最小行高 | ✓ | 只对单行文字的格子 | ✓ |
| 表头重复 | ✓ | ✓ | 打印或 `--paged` 时 |
| `meta.title` / `author` / `lang` | — | ✓ | ✓ |

## pdf 的字体

- 默认中文字体按这个顺序找：苹方、冬青黑体、Noto Sans CJK SC、思源黑体、微软雅黑。
- 都找不到时退回 Typst 自带字体，中文可能显示不全。
- 自己写的 `fontFamily` 排在默认列表前面。

## 下一版的改动

下面这些已经在开发分支上，还没发布（最新发布是 `v0.1.0-alpha.2`）：

- pdf、html：文字以换行结尾时，末尾补一行空行，和 Word 一样。
- pdf：固定行高不再让字体撑高；格子里改字号，行高不变。
- pdf：表格格子自己的行高（比如表头的 `lineHeight`）不再丢。
- pdf：字在行里按字体自己的上下高度摆，不再偏上。
- pdf：有左右缩进时，段前段后距不再丢。
- pdf：节开头和手动分页后保留段前距，和 Word 一致。
- pdf：字重按整个字体家族归一，MiSans 这类字重不是整百的字体也能正确加粗。
- docx：`hangingIndent` 首行不再往左伸。
- docx：绝对定位图片所在的段落不再多占一行。
- html `--paged`：屏幕上节与节之间的虚线和空白去干净。
