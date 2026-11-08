---
title: 内置组件
description: fmtagno 的十个内置组件：Document、Heading、Text、Code、List、Table、Image、PageBreak、Section、Slide，以及写在 runs 里的 InlineCode。
sidebar:
  order: 2
---

内置组件一共十个，外加只能写在 runs 里的 `InlineCode`。命令行里看完整的 props 定义：

```sh
fmtagno catalog          # 列出组件
fmtagno catalog --json   # 每个组件 props 的 JSON Schema
```

| 组件 | 干什么 | 容器 | 部位 |
|---|---|---|---|
| [Document](#document) | 根容器，也能用来分组 | 是 | — |
| [Heading](#heading) | 标题，1 到 6 级 | 否 | — |
| [Text](#text) | 一段正文 | 否 | — |
| [Code](#code) | 整段代码 | 否 | — |
| [List](#list) | 列表，可嵌套 | 否 | `level1`…`level9` `marker` `item` |
| [Table](#table) | 表格 | 否 | 见[表格](/guide/tables/) |
| [Image](#image) | 图片 | 否 | `caption` |
| [PageBreak](#pagebreak) | 分页 | 否 | — |
| [Section](#section) | 分节 | 是 | — |
| [Slide](#slide) | 一页幻灯片 | 是 | `title` `body` |

下面每个组件都列了内置默认样式。想改，见[样式](/guide/styles/)。

## Document

根容器，按顺序排列子元素。没有 props。

```json
"doc": { "type": "Document", "children": ["title", "intro"] }
```

`Document` 可以嵌套：把几段放进一个 `Document`，在它上面写样式，文字字段会传给里面每一段。自定义组件的模板也常用它当根元素。

## Heading

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `level` | 整数 1–6 | 是 | 第几级 |
| `text` | 字符串或 runs | 是 | 标题文字 |

```json
"title": { "type": "Heading", "props": { "level": 1, "text": "季度报告" } }
```

- 默认样式：加粗、`keepWithNext`、段前 12pt、段后 6pt、行高 1.25。字号 1 级 20pt（段前 18pt），2 级 16pt，3 级 14pt，4 级 12pt，5、6 级 11pt。
- 按级别改样式，用组件样式键 `Heading.1` … `Heading.6`。
- docx 里同时挂上 Word 的「标题 1」到「标题 6」，导航窗格和目录能用。

## Text

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `text` | 字符串或 runs | 是 | 段落文字，runs 写法见[文档结构](/guide/document/) |

```json
"intro": { "type": "Text", "props": { "text": ["运行 ", { "type": "InlineCode", "text": "fmtagno check" }, " 校验。"] } }
```

- 默认样式：段后 6pt。
- `text` 写空字符串 `""` 时，这一段照样占一行，三种格式一致。

## InlineCode

行内代码。不能单独当元素，只能写在 runs 里：

```json
{ "type": "InlineCode", "text": "fmtagno render doc.json -o out.pdf" }
```

默认样式：等宽字体（Menlo、Consolas、DejaVu Sans Mono），底色 `#F0F1F3`。改外观就写组件样式 `InlineCode`。

## Code

整段代码，保留空格和换行。

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `code` | 字符串 | 是 | 代码，换行写 `\n` |
| `language` | 字符串 | 否 | 语言名。只做标记，html 写成 `class="language-xxx"`，不做语法高亮 |
| `lineNumbers` | 布尔 | 否 | 显示行号，默认 `false` |

```json
"sample": {
  "type": "Code",
  "props": { "language": "json", "code": "{\n  \"type\": \"Text\"\n}", "lineNumbers": true }
}
```

默认样式：等宽字体、9pt、行高 1.4、底色 `#F6F8FA`、内边距 8pt、段后 8pt、`keepTogether`。

docx 的段落只在有边框时才用 `padding`，所以代码块在 docx 里没有内边距，渲染时会警告一次。要内边距，给它加一条和底色同色的边框。

## List

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `items` | 数组 | 是 | 列表项 |
| `ordered` | 布尔 | 否 | 带编号，默认 `false` |

每一项可以是：

- 字符串：`"写 JSON"`
- runs 数组：`[{ "text": "fmtagno render", "type": "InlineCode" }, " 出文件"]`
- 带子列表的对象：`{ "text": …, "items": [...], "ordered": true }`。`ordered` 不写就跟上一级一样。

```json
"list": {
  "type": "List",
  "props": {
    "ordered": true,
    "items": [
      "准备数据",
      { "text": "选择样式集", "items": ["report：报告", "slides：幻灯片"] },
      "渲染出文件"
    ]
  },
  "style": { "listStyleType": "cjk-decimal", "listMarkerFormat": "%1、" },
  "parts": { "level2": { "listStyleType": "decimal", "listMarkerFormat": "%1.%2" } }
}
```

- 默认样式：段后 6pt，`listIndent` 2em，`listHanging` 2em。
- 编号类型不写时按层级轮换：有序是 `decimal` → `lower-alpha` → `lower-roman`，无序是 `disc` → `circle` → `square`。
- 部位：`level1`…`level9` 管某一级，`marker` 管编号本身，`item` 管每一项的文字。
- 编号、缩进这些字段见[列表样式](/reference/list-style/)。

## Table

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `columns` | 格子数组 | 否 | 表头。写了就是第一行 |
| `rows` | 二维格子数组 | 是 | 数据行 |
| `widths` | 数组 | 否 | 各列宽度：比例、固定长度或 `"auto"` |
| `rowHeights` | 数组 | 否 | 各行高度 |
| `look` | 对象 | 否 | 哪些部位生效 |

```json
"price": {
  "type": "Table",
  "props": {
    "columns": ["品名", "单价"],
    "widths": [3, 1],
    "rows": [["苹果", "3.50"], ["梨", "4.00"]]
  },
  "parts": { "header": { "background": "#1A73E8", "color": "#FFFFFF" } }
}
```

默认样式：`0.5pt solid #999999` 边框，`cellPadding` 4pt，`repeatHeader` 开，段后 8pt；表头加粗、底色 `#F3F3F3`。

合并单元格、单格样式、行高、部位，都在[表格](/guide/tables/)里讲。

## Image

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `src` | 字符串 | 是 | 本地路径或网址。相对路径按文档所在目录找 |
| `alt` | 字符串 | 否 | 替代文字。图片放不进去时显示它 |
| `width` | 数字（pt） | 否 | 宽 |
| `height` | 数字（pt） | 否 | 高。只写宽或高时按比例算另一边 |
| `caption` | 字符串 | 否 | 图片说明，显示在图下面 |

```json
"logo": { "type": "Image", "props": { "src": "logo.png", "alt": "fmtagno", "width": 90, "caption": "图 1 标志" } }
```

默认样式：段后 6pt；说明文字 9pt、`#666666`（部位 `caption`）。格式支持和定位见[图片](/guide/images/)。

## PageBreak

分页，后面的内容从新的一页开始。没有 props。

```json
"break": { "type": "PageBreak" }
```

html 直接打开时看不出分页，打印或加 `--paged` 时才分页。

## Section

分节。每节从新的一页开始，能单独设纸张、方向、页边距、分栏、页眉页脚和页码起始值。只能直接放在 root 下面。

```json
"body": {
  "type": "Section",
  "props": { "landscape": true, "pageNumberStart": 1, "footer": "ftr" },
  "children": ["h1", "p1"]
}
```

props 和用法见[分节与页眉页脚](/guide/sections/)。

## Slide

一页 16:9 的幻灯片，子元素排在里面。

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | 字符串 | 否 | 幻灯片标题 |

```json
"cover": { "type": "Slide", "props": { "title": "封面" }, "children": ["cover-text"] }
```

- 部位：`title` 管标题（默认 20pt 加粗），`body` 管正文区。
- html、pdf 里一张占一页。
- docx 里变成一个二级标题加正文，后面分页；部位 `body` 在 docx 里不生效。
- 真正的 pptx 输出要到第二版。

## 下一步

- [样式](/guide/styles/)：样式写在哪、怎么叠加。
- [表格](/guide/tables/)、[图片](/guide/images/)、[分节与页眉页脚](/guide/sections/)。
