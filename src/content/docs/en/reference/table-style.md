---
title: Table style
description: fmtagno table-only style fields, Table props, cell objects, parts and look switches, with per-format support.
sidebar:
  order: 8
---

How to write tables, with examples: [Tables](/en/guide/tables/). This page only lists the fields.

## Style fields

Written in a `Table` element's `style`; none of them inherit.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

| Field | Value | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|---|
| `tableLayout` | `fixed` `auto` | `"fixed"` | Fixed column widths or content-based | ✓ | — follows `widths` | ✓ |
| `cellPadding` | length | `4` | Cell padding, default 4pt | ✓ | ✓ | ✓ |
| `repeatHeader` | boolean | `false` | Repeat the header on each page, on by default | ✓ | ✓ | ✓ when printing or with `--paged` |
| `rowBreak` | boolean | `false` | Whether a row may split across pages; `false` keeps it whole | ✓ | ✗ | ✓ |
| `bandSize` | integer | `2` | Rows (columns) per band, default 1 | ✓ | ✓ | ✓ |
| `border` / `borderTop` etc. | border | `"0.5pt solid #999999"` | Outer border; `border` also draws inner lines | ✓ | ✓ | ✓ |
| `borderInsideH` / `borderInsideV` | border | `"none"` | Inner horizontal / vertical lines | ✓ | ✓ | ✓ |
| `width` | length or percentage | `"80%"` | Table width. With ratio columns the table stretches to it | ✓ | ✓ | ✓ |

Text fields (`fontSize`, `align`, …) on the table apply to the whole table; on a part they only affect those cells.

## Table props

| Prop | Type | Meaning |
|---|---|---|
| `columns` | array of cells | Header |
| `rows` | 2-D array of cells | Data rows, required |
| `widths` | array: number / absolute length / `"auto"` | Column widths |
| `rowHeights` | array: absolute length / `{ height, rule }` / `null` | Row heights |
| `look` | object | Part switches |

## Cell object

| Field | Type | Meaning |
|---|---|---|
| `text` (or `runs`) | string or runs | The text |
| `rowSpan` | integer | Rows to merge downward, including this one |
| `colSpan` | integer | Columns to merge rightward, including this one |
| `style` | style | This cell only, applied after part styles |

## Parts

`table` `cell` `header` `firstRow` `lastRow` `firstColumn` `lastColumn` `oddRow` `evenRow` `oddColumn` `evenColumn` `topLeftCell` `topRightCell` `bottomLeftCell` `bottomRightCell`

Order: `table` → `cell` → odd/even columns → odd/even rows → first/last column → first/last row → `header` → corners → per-cell `style`.

Parts accept text and paragraph fields, plus `background`, borders, `padding*`, `verticalAlign` (`top` `middle` `bottom`) and `textRotation` (`0` `90` `270`).

## look

| Field | Default |
|---|---|
| `firstRow` | `true` |
| `lastRow` | `false` |
| `firstColumn` | `true` |
| `lastColumn` | `false` |
| `bandedRows` | `true` |
| `bandedColumns` | `false` |
