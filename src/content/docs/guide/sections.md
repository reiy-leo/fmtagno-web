---
title: 分节与页眉页脚
description: 用 meta.page 设纸张和页边距，用 Section 分节；页眉页脚分首页、奇偶页；runs 里插页码、总页数、本节页数。
sidebar:
  order: 6
---

纸张设置写在 `meta.page`，它就是第一节的设置。要在中途换纸张、换方向、换页眉页脚，就在 root 下面放 `Section`。

## 纸张：meta.page

```json
"meta": {
  "page": {
    "size": "A4",
    "margin": "25mm",
    "headerDistance": "12mm",
    "footerDistance": "12mm",
    "header": "hdr",
    "footer": "ftr"
  }
}
```

字段全表见[页面设置](/reference/page/)。常用的：

| 字段 | 例子 | 说明 |
|---|---|---|
| `size` | `"A4"`、`{ "width": "180mm", "height": "260mm" }` | 纸张，默认 A4 |
| `landscape` | `true` | 横向 |
| `margin` | `"20mm"` | 四边页边距，默认 20mm |
| `marginTop` 等 | `"30mm"` | 单边页边距，覆盖 `margin` |
| `header` / `footer` | `"hdr"` | 页眉、页脚用的元素 id |
| `pageNumberStart` | `1` | 页码从几开始 |

## 分节：Section

```json
"elements": {
  "doc":   { "type": "Document", "children": ["cover", "body", "wide"] },
  "cover": { "type": "Section", "props": { "header": { "first": null }, "footer": { "first": null } }, "children": ["c-h"] },
  "body":  { "type": "Section", "props": { "pageNumberStart": 1 }, "children": ["b-h", "b-p"] },
  "wide":  { "type": "Section", "props": { "landscape": true, "columns": { "count": 2, "gap": "8mm" }, "header": null }, "children": ["w-p"] }
}
```

- 每节从新的一页开始。
- `Section` 只能直接放在 root 下面。
- 节上没写的字段沿用上一节，和 Word 的「链接到前一节」一样。
- root 下面不写 `Section` 也行，整份文档就是一节。
- 开头一段可以不放进 `Section`，算作第一节。但 `Section` 后面不能再跟不在 `Section` 里的内容。

Section 的 props：

| prop | 类型 | 说明 |
|---|---|---|
| `size` | 纸张名或 `{ width, height }` | 纸张 |
| `landscape` | 布尔 | 横向 |
| `margin`、`marginTop`、`marginRight`、`marginBottom`、`marginLeft` | 长度 | 页边距 |
| `gutter` | 长度 | 装订线，加在左边距上 |
| `columns` | 数字或 `{ count, gap }` | 分栏，`gap` 默认 21pt |
| `headerDistance` / `footerDistance` | 长度 | 页眉、页脚离纸边多远，默认 0.5in |
| `header` / `footer` | id、对象或 `null` | 本节的页眉、页脚，见下文 |
| `pageNumberStart` | 整数 | 本节页码从几重新开始 |

## 页眉页脚

页眉页脚的内容是普通元素，跟正文一样写在 `elements` 里，然后用 id 引用：

```json
"hdr": { "type": "Text", "props": { "text": "fmtagno 示例文档" }, "style": { "fontSize": 9, "align": "right", "borderBottom": "0.5pt solid #999999", "paddingBottom": 2 } },
"ftr": { "type": "Text", "props": { "text": ["第 ", { "field": "page" }, " 页，共 ", { "field": "pages" }, " 页"] }, "style": { "fontSize": 9, "align": "center" } }
```

`header`、`footer` 的写法：

| 写法 | 意思 |
|---|---|
| `"hdr"` | 每页都用 `hdr`（只改 `default`） |
| `{ "default": "a", "first": "b", "even": "c" }` | 分开设：普通页、本节第一页、偶数页 |
| `{ "first": null }` | 本节第一页留空，其他沿用 |
| `null`（写在 Section 上） | 清掉从上一节接过来的全部页眉（或页脚） |
| 不写 | 沿用上一节 |

规则：

- 对象里写 `null` 表示这一种留空，不写表示沿用上一节。
- `first`、`even` 也会沿用。封面写了 `"first": null`，后面各节的首页也留空，要显示就在那一节重新设 `first`。
- 只要设了 `first`（包括 `null`），本节首页就单独处理（Word 的「首页不同」）。页眉和页脚共用这个开关：只给页眉设了 `first` 时，首页的页脚用 `default`。
- 任何一节设了 `even`，整份文档就开「奇偶页不同」。没设 `even` 的节，偶数页用 `default`。
- 页眉页脚里的元素不能同时出现在正文里，也不能放 `PageBreak`、`Section`、`Slide`。
- 它们的样式继承根元素（`Document`）。
- 页眉页脚里也能放图片，见[图片](/guide/images/)。

## 页码

在 runs 里写 `field`：

| 写法 | 显示 |
|---|---|
| `{ "field": "page" }` | 当前页码 |
| `{ "field": "pages" }` | 全文总页数 |
| `{ "field": "sectionPages" }` | 本节页数 |

```json
{ "text": "1", "field": "page", "bold": true }
```

- 可以带文字样式。
- `text` 可以不写。写了就是占位值，Word 更新域之前、html 不分页时显示它。
- 页码按 Word 的规则数：每节接着上一节往下数；节上写了 `pageNumberStart` 就从那个数重新开始。
- 奇偶页按页码算，不按物理页数。

## 完整例子

```json title="sections.json"
{
  "version": "0.1",
  "meta": {
    "title": "分节示例",
    "lang": "zh-CN",
    "page": { "size": "A4", "margin": "25mm", "headerDistance": "12mm", "footerDistance": "12mm", "header": "hdr-doc", "footer": "ftr" }
  },
  "root": "d",
  "elements": {
    "d": { "type": "Document", "children": ["cover", "body", "wide"] },
    "cover": { "type": "Section", "props": { "header": { "first": null }, "footer": { "first": null } }, "children": ["c-h", "c-t"] },
    "c-h": { "type": "Heading", "props": { "level": 1, "text": "分节示例" } },
    "c-t": { "type": "Text", "props": { "text": "封面不显示页眉页脚。" } },
    "body": {
      "type": "Section",
      "props": { "pageNumberStart": 1, "header": { "default": "hdr-odd", "even": "hdr-even" }, "footer": { "first": "ftr" } },
      "children": ["b-h", "b-t", "b-pb", "b-t2"]
    },
    "b-h": { "type": "Heading", "props": { "level": 1, "text": "第一章" } },
    "b-t": { "type": "Text", "props": { "text": "这一节页码从 1 开始，奇偶页的页眉不一样。首页的页眉沿用封面的 first: null，留空；页脚重新设了 first，照常显示。" } },
    "b-pb": { "type": "PageBreak" },
    "b-t2": { "type": "Text", "props": { "text": "这是第 2 页，用偶数页页眉。" } },
    "wide": {
      "type": "Section",
      "props": { "landscape": true, "margin": "15mm", "columns": { "count": 2, "gap": "8mm" }, "header": null },
      "children": ["w-h", "w-t"]
    },
    "w-h": { "type": "Heading", "props": { "level": 2, "text": "横向分两栏" } },
    "w-t": { "type": "Text", "props": { "text": "这一节横向、分两栏，没有页眉，页脚沿用前面的。" } },
    "hdr-doc": { "type": "Text", "props": { "text": "分节示例" }, "style": { "fontSize": 9, "color": "#666666", "align": "right" } },
    "hdr-odd": { "type": "Text", "props": { "text": "第一章" }, "style": { "fontSize": 9, "color": "#666666", "align": "right", "borderBottom": "0.5pt solid #999999", "paddingBottom": 2 } },
    "hdr-even": { "type": "Text", "props": { "text": "分节示例" }, "style": { "fontSize": 9, "color": "#666666", "align": "left", "borderBottom": "0.5pt solid #999999", "paddingBottom": 2 } },
    "ftr": {
      "type": "Text",
      "props": { "text": ["第 ", { "text": "1", "field": "page", "bold": true }, " 页 · 本节 ", { "field": "sectionPages" }, " 页 · 共 ", { "field": "pages" }, " 页"] },
      "style": { "fontSize": 9, "color": "#666666", "align": "center" }
    }
  }
}
```

## 各格式的差别

| | docx | pdf | html |
|---|---|---|---|
| 分节换纸张、方向 | ✓ | ✓ | `--paged` 屏幕上 ✓；打印只用第一节的纸张 |
| 分栏 | ✓ | ✓ | ✓ |
| 页眉页脚 | ✓ | ✓ | 只在 `--paged` 时显示 |
| 页码 | 写成 Word 的域，打开后自己算 | 排完版算好 | `--paged` 时填好；否则显示 `text` |

- docx：每节末尾会多一个空段落，用来放这一节的设置，Word 自己分节也是这样。LibreOffice 不认「本节页数」域，只显示 `text`。
- html：横竖混排的文档打印时，横向那几页会裁掉一块。要打印请出 pdf。
