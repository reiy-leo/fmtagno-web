---
title: 表格样式
description: fmtagno 表格专用的样式字段、Table 的 props、格子对象、部位和 look 开关，附各格式支持情况。
sidebar:
  order: 8
---

表格的写法和例子见[表格](/guide/tables/)。这一页只列字段。

## 样式字段

写在 `Table` 元素的 `style` 上，都不继承。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

| 字段 | 值 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|---|
| `tableLayout` | `fixed` `auto` | `"fixed"` | 列宽固定，或按内容自动调 | ✓ | — 按 `widths` 排 | ✓ |
| `cellPadding` | 长度 | `4` | 格子内边距，默认 4pt | ✓ | ✓ | ✓ |
| `repeatHeader` | 布尔 | `false` | 跨页时每页重复表头，默认开 | ✓ | ✓ | 打印或 `--paged` 时 ✓ |
| `rowBreak` | 布尔 | `false` | 一行能不能拆到两页，`false` 是不拆 | ✓ | ✗ | ✓ |
| `bandSize` | 整数 | `2` | 几行（列）算一条带，默认 1 | ✓ | ✓ | ✓ |
| `border` / `borderTop` 等 | 边框 | `"0.5pt solid #999999"` | 外框；`border` 也当内线 | ✓ | ✓ | ✓ |
| `borderInsideH` / `borderInsideV` | 边框 | `"none"` | 内部横线 / 竖线 | ✓ | ✓ | ✓ |
| `width` | 长度或百分比 | `"80%"` | 表格宽度。有比例列时撑到这个宽度 | ✓ | ✓ | ✓ |

格子里的文字字段（`fontSize`、`align` 等）写在表格上就对全表生效，写在部位上只管那些格子。

## Table 的 props

| prop | 类型 | 说明 |
|---|---|---|
| `columns` | 格子数组 | 表头 |
| `rows` | 二维格子数组 | 数据行，必填 |
| `widths` | 数组：数字 / 绝对长度 / `"auto"` | 列宽 |
| `rowHeights` | 数组：绝对长度 / `{ height, rule }` / `null` | 行高 |
| `look` | 对象 | 部位开关 |

## 格子对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `text`（或 `runs`） | 字符串或 runs | 文字 |
| `rowSpan` | 整数 | 往下合并几行，含自己 |
| `colSpan` | 整数 | 往右合并几列，含自己 |
| `style` | 样式 | 只给这一格，叠在部位样式之后 |

## 部位

`table` `cell` `header` `firstRow` `lastRow` `firstColumn` `lastColumn` `oddRow` `evenRow` `oddColumn` `evenColumn` `topLeftCell` `topRightCell` `bottomLeftCell` `bottomRightCell`

叠加顺序：`table` → `cell` → 奇偶列 → 奇偶行 → 首末列 → 首末行 → `header` → 四角 → 单格 `style`。

部位上能写文字、段落字段，还有 `background`、边框、`padding*`、`verticalAlign`（`top` `middle` `bottom`）、`textRotation`（`0` `90` `270`）。

## look

| 字段 | 默认 |
|---|---|
| `firstRow` | `true` |
| `lastRow` | `false` |
| `firstColumn` | `true` |
| `lastColumn` | `false` |
| `bandedRows` | `true` |
| `bandedColumns` | `false` |
