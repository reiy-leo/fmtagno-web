---
title: 页面设置
description: meta.page 和 Section 的字段：纸张、方向、页边距、装订线、分栏、页眉页脚、页码起始值，附各格式支持情况。
sidebar:
  order: 9
---

`meta.page` 是第一节的设置。后面每个 `Section` 的 props 用同样的字段，在上一节的基础上改。用法见[分节与页眉页脚](/guide/sections/)。

图例：✓ 支持；✗ 忽略；— 不适用。

| 字段 | 值 | 默认 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|---|---|
| `size` | 纸张名或 `{ width, height }` | `"A4"` | `"Letter"` | 纸张 | ✓ | ✓ | ✓ |
| `landscape` | 布尔 | `false` | `true` | 横向 | ✓ | ✓ | ✓ |
| `margin` | 长度 | `"20mm"` | `"25mm"` | 四边页边距 | ✓ | ✓ | ✓ |
| `marginTop` `marginRight` `marginBottom` `marginLeft` | 长度 | 同 `margin` | `"30mm"` | 单边页边距 | ✓ | ✓ | ✓ |
| `gutter` | 长度 | 0 | `"10mm"` | 装订线，加在左边距上 | ✓ | ✓ | ✓ |
| `columns` | 数字或 `{ count, gap }` | 1 | `{ "count": 2, "gap": "8mm" }` | 分栏，`gap` 默认 21pt | ✓ | ✓ | ✓ |
| `headerDistance` | 长度 | `"0.5in"` | `"12mm"` | 页眉离纸张上边多远 | ✓ | ✓ | `--paged` 时 ✓ |
| `footerDistance` | 长度 | `"0.5in"` | `"12mm"` | 页脚离纸张下边多远 | ✓ | ✓ | `--paged` 时 ✓ |
| `header` | 元素 id，或 `{ default, first, even }` | 无 | `"hdr"` | 页眉 | ✓ | ✓ | `--paged` 时 ✓ |
| `footer` | 同上 | 无 | `"ftr"` | 页脚 | ✓ | ✓ | `--paged` 时 ✓ |
| `pageNumberStart` | 整数 | 接着数 | `1` | 页码从几开始 | ✓ | ✓ | `--paged` 时 ✓ |

- 页面内容竖直对齐（Word 的 `vAlign`）尚未实现，现在写 `verticalAlign` 会报错。
- 纸张名：`A3` `A4` `A5` `B5` `Letter` `Legal`，大小写都行。不认识的按 A4 处理并警告。
- 页面设置只认绝对长度（pt mm cm in px）。
- html 没加 `--paged` 时，纸张和页边距只在打印时用（`@page`）。
- html 打印时只用第一节的纸张。

## 只在 Section 上的写法

- `"header": null` / `"footer": null`：清掉从上一节接过来的全部页眉或页脚。
- 对象里某一种写 `null`：这一种留空。不写：沿用上一节。

## 页码域

runs 里写 `{ "field": "page" }`、`{ "field": "pages" }`、`{ "field": "sectionPages" }`，分别是当前页码、总页数、本节页数。详见[分节与页眉页脚](/guide/sections/)。
