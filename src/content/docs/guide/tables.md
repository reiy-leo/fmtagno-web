---
title: 表格
description: fmtagno 表格的写法：表头和数据行、列宽（比例、固定、auto）、合并单元格、行高、单格样式、部位样式和 look 开关。
sidebar:
  order: 5
---

表格用 `Table` 组件。`columns` 是表头，`rows` 是数据行，每格可以是字符串、runs，或者带合并和样式的对象。

```json
"price": {
  "type": "Table",
  "props": {
    "columns": ["品名", "数量", "单价"],
    "rows": [["苹果", "2", "3.50"], ["梨", "1", "4.00"]]
  }
}
```

## props 一览

| prop | 类型 | 说明 |
|---|---|---|
| `columns` | 格子数组 | 表头，可不写。写了就是第一行（`firstRow`、`header`） |
| `rows` | 二维格子数组 | 数据行，必填 |
| `widths` | 数组 | 各列宽度，一列一个值 |
| `rowHeights` | 数组 | 各行高度，一行一个值。有表头时表头是第一项 |
| `look` | 对象 | 哪些部位生效 |

## 格子

三种写法：

```json
"苹果"
["苹果 ", { "text": "新品", "color": "#CF222E" }]
{ "text": "检测结果", "rowSpan": 2, "colSpan": 3, "style": { "align": "center" } }
```

格子对象的字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| `text` | 字符串或 runs | 文字。也可以叫 `runs` |
| `rowSpan` | 整数 | 往下合并几行，含自己，默认 1 |
| `colSpan` | 整数 | 往右合并几列，含自己，默认 1 |
| `style` | 字符串 / 数组 / 对象 | 只给这一格的样式，叠在部位样式之后 |

## 列宽

`widths` 一列一个值，三种写法可以混用：

| 写法 | 例子 | 意思 |
|---|---|---|
| 数字 | `3` | 比例。固定列和 auto 列占完以后，剩下的宽度按比例分 |
| 带单位的字符串 | `"20mm"` `"5.65pt"` | 固定宽度。单位 pt mm cm in px，不带单位当 pt |
| `"auto"` | `"auto"` | 按格子里的文字撑开 |

- 只要有一列是比例，表格就撑满版心（或撑到样式里的 `width`）。
- 全是固定列和 auto 列时，表格宽度就是各列加起来，不撑满。
- 没写 `widths` 时各列平分。个数和列数对不上时也平分，并给警告。
- 比例列和 auto 列混写时，auto 列按文字宽度算，最多占一份比例的宽度，文字更长就折行。三种格式列宽一致。（下一版；v0.1.0-alpha.2 的 PDF 里 auto 列会被压窄）
- 只有固定列和 auto 列、又没写 `tableLayout` 时，三种格式都按自动布局排。

例子：章节标题条，左边一条细色块，右边按标题长短变宽：

```json
"widths": ["5.65pt", "auto"]
```

docx 的 auto 列先按字数估一个宽度，Word 打开后再按内容重排。

## 合并单元格

规则和 HTML 一样：**每行只写从这一行开始的格子**，上面 `rowSpan` 占掉的位置不写。

```json
"rows": [
  [{ "text": "水果", "rowSpan": 2 }, "苹果", "3.50"],
  ["梨", "4.00"],
  [{ "text": "合计", "colSpan": 2 }, "7.50"]
]
```

第二行只写两格，因为第一列让「水果」占了。

- 合并格的边框按整块算：上边框取首行，下边框取末行。
- 某行格子数对不上时，按最宽的一行补齐空格，并给警告。
- 两格重叠时，先写的算数。

## 行高

`rowHeights` 一行一个值：

| 写法 | 例子 | 意思 |
|---|---|---|
| 长度 | `"28pt"`、`20` | 最小高度，内容多了会撑高 |
| 对象 | `{ "height": "51pt", "rule": "exact" }` | 固定高度，内容多了会裁掉。`rule` 是 `atLeast`（默认）或 `exact` |
| `null` | `null` | 这一行不管 |

行高只收绝对长度（pt mm cm in px）。pdf 里最小高度只对单行文字的格子有效。

## 部位

表格能分部位设样式，规则照 Word 的表格样式：

| 部位 | 管什么 |
|---|---|
| `table` | 整张表 |
| `cell` | 每个格子 |
| `header` | 表头（`columns` 那一行） |
| `firstRow` / `lastRow` | 第一行 / 最后一行（比如合计行） |
| `firstColumn` / `lastColumn` | 第一列 / 最后一列 |
| `oddRow` / `evenRow` | 奇数行 / 偶数行，不算表头和首末行 |
| `oddColumn` / `evenColumn` | 奇数列 / 偶数列，不算首末列 |
| `topLeftCell` `topRightCell` `bottomLeftCell` `bottomRightCell` | 四个角的格子 |

一个格子同时落在几个部位时，按这个顺序叠，后面的覆盖前面的：

`table` → `cell` → 奇偶列 → 奇偶行 → 首末列 → 首末行（`header` 跟在 `firstRow` 后面）→ 四角 → 单格 `style`

部位样式写在三个地方：元素的 `parts`、顶层 `styles` 的 `Table.部位`、样式集的 `components`。

```json
"parts": {
  "header": { "background": "#1A73E8", "color": "#FFFFFF" },
  "evenRow": { "background": "#F5F7FA" },
  "lastRow": { "bold": true, "borderTop": "1.5pt double #333333" },
  "lastColumn": { "align": "right" }
}
```

部位上能写 `padding`、`paddingLeft` 这些，只改这个部位里的格子，没写的边还用 `cellPadding`。部位上的 `verticalAlign`（`top` `middle` `bottom`）和 `textRotation` 管格子里文字的位置和方向。

## look：哪些部位生效

| 字段 | 默认 | 说明 |
|---|---|---|
| `firstRow` | `true` | 首行样式。有表头时首行总是生效 |
| `lastRow` | `false` | 末行样式 |
| `firstColumn` | `true` | 首列样式 |
| `lastColumn` | `false` | 末列样式 |
| `bandedRows` | `true` | 奇偶行样式 |
| `bandedColumns` | `false` | 奇偶列样式 |

```json
"look": { "lastRow": true, "lastColumn": true }
```

要用 `lastRow`、`lastColumn`、`oddColumn`、`evenColumn`，先在 `look` 里打开。

## 表格样式字段

写在表格元素的 `style` 上：

| 字段 | 例子 | 说明 |
|---|---|---|
| `border` | `"0.5pt solid #999999"` | 外框和内线 |
| `borderTop` 等 | `"2pt solid #333333"` | 外框某一边 |
| `borderInsideH` / `borderInsideV` | `"none"` | 内部横线 / 竖线，不写就用 `border` |
| `cellPadding` | `4` | 格子内边距 |
| `repeatHeader` | `true` | 跨页时每页重复表头，默认开 |
| `rowBreak` | `false` | 一行能不能拆到两页 |
| `bandSize` | `2` | 几行算一条带，默认 1 |
| `tableLayout` | `"fixed"` | 列宽固定或按内容 |
| `width` | `"80%"` | 表格宽度 |

字段细节和各格式支持见[表格样式](/reference/table-style/)。

## 完整例子

```json title="table.json"
{
  "version": "0.1",
  "meta": { "title": "表格示例", "lang": "zh-CN" },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "t"] },
    "title": { "type": "Heading", "props": { "level": 2, "text": "报价单" } },
    "t": {
      "type": "Table",
      "props": {
        "columns": ["类别", "品名", "数量", "金额"],
        "widths": ["20mm", 3, "auto", 1],
        "rowHeights": ["24pt"],
        "rows": [
          [{ "text": "水果", "rowSpan": 2, "style": { "verticalAlign": "middle" } }, "苹果", "2", "7.00"],
          ["梨", "1", "4.00"],
          ["蔬菜", "白菜", "3", { "text": "6.00", "style": { "color": "#CF222E" } }],
          [{ "text": "合计", "colSpan": 3 }, "17.00"]
        ],
        "look": { "lastRow": true, "lastColumn": true }
      },
      "style": { "border": "0.5pt solid #D0D7DE", "borderInsideV": "none", "fontSize": 10, "cellPadding": 5 },
      "parts": {
        "header": { "background": "#1A73E8", "color": "#FFFFFF" },
        "evenRow": { "background": "#F5F7FA" },
        "lastRow": { "bold": true, "borderTop": "1.5pt double #333333" },
        "lastColumn": { "align": "right" }
      }
    }
  }
}
```

## 各格式的差别

| 功能 | docx | pdf | html |
|---|---|---|---|
| 合并单元格 | ✓ | ✓ | ✓ |
| 列宽 auto | ✓（Word 打开后重排） | ✓ | ✓ |
| 最小行高 | ✓ | 只对单行文字的格子 | ✓ |
| 固定行高 | ✓ | ✓ | 按最小高度处理，内容多了会撑高 |
| 表头重复 | ✓ | ✓ | 打印或 `--paged` 时 |
| `rowBreak: false` | ✓ | ✗ | ✓ |
| `tableLayout` | ✓ | ✗（按 `widths` 排） | ✓ |
| 部位样式 | 逐格写成直接格式 | ✓ | ✓ |

docx 还生成不了真正的 Word 表格样式，部位样式会逐格写进去。Word 里两张表紧挨着会合成一张。所以 fmtagno 在每张表后面放一个很矮的空段落，用表格的 `spaceAfter` 当间距。
