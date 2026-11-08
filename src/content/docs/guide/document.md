---
title: 文档结构
description: fmtagno JSON 的顶层字段、元素写法、children、props、style、parts，以及文字的 runs 写法。
sidebar:
  order: 1
---

一份 fmtagno 文档是一个 JSON 对象。所有元素平铺在 `elements` 里，用 id 互相引用，`root` 指向根元素。这套结构沿用 [json-render](https://github.com/vercel-labs/json-render)。

## 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `version` | 字符串 | 否 | 文档格式版本，现在写 `"0.1"`。只做标记 |
| `meta` | 对象 | 否 | 标题、作者、语言、纸张，见下文 |
| `root` | 字符串 | 是 | 根元素的 id |
| `elements` | 对象 | 是 | 全部元素，键是 id，值是元素 |
| `styles` | 对象 | 否 | 命名样式和组件样式，见[样式](/guide/styles/) |
| `styleSet` | 字符串 | 否 | 用哪个样式集，见[样式集](/guide/style-sets/) |
| `styleSets` | 对象 | 否 | 文档里直接定义的样式集 |
| `components` | 数组 | 否 | 文档里直接定义的自定义组件，见[自定义组件](/guide/custom-components/) |

写了上表以外的字段会报错。所有对象都是这个规矩：**拼错的字段不会悄悄忽略**。

## meta

| 字段 | 类型 | 例子 | 说明 |
|---|---|---|---|
| `title` | 字符串 | `"季度报告"` | 文档标题。html 写进 `<title>`，pdf 写进文件属性 |
| `author` | 字符串 | `"Rei"` | 作者。html 写进 `<meta>`，pdf 写进文件属性 |
| `lang` | 字符串 | `"zh-CN"` | 文档语言（BCP 47）。html 默认 `zh-CN`，pdf 默认 `zh` |
| `page` | 对象 | `{ "size": "A4" }` | 纸张、页边距、页眉页脚，见[页面设置](/reference/page/) |

docx 现在不写 `title`、`author`、`lang`。

## 元素

```json
"intro": {
  "type": "Text",
  "props": { "text": "一份 JSON，出三种格式。" },
  "style": "muted"
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `type` | 字符串 | 组件名。内置组件见[组件](/guide/components/)，也可以是自定义组件 |
| `props` | 对象 | 组件自己的参数。多写、少写必填的、类型不对，都报错 |
| `style` | 字符串 / 数组 / 对象 | 这个元素的样式，见下文 |
| `parts` | 对象 | 部位样式，键是部位名，比如表格的 `header` |
| `children` | 字符串数组 | 子元素 id，按顺序排。只有容器组件能写 |

规则：

- id 随便起，在 `elements` 里唯一就行。
- 每个元素只能引用一次。同一段文字要出现两次，就写两个元素。
- 引用成环会报错。
- 没有引用到的元素不渲染，会打一条警告。
- `root` 不一定是 `Document`。不是的话，fmtagno 在外面自动包一层。

容器组件有三个：`Document`、`Section`、`Slide`。`Document` 也能嵌套，用来把几个元素编成一组。

## style 的三种写法

```json
"style": "muted"
"style": ["muted", "center"]
"style": ["muted", { "fontSize": 11 }]
"style": { "color": "#CF222E", "bold": true }
```

- 字符串：命名样式的名字。
- 数组：按顺序叠，后面的覆盖前面的。数组里能混写名字和对象。
- 对象：直接写样式字段，字段表见「参考」一栏。

名字先在当前样式集的 `styles` 里找，找不到再到顶层 `styles` 找，都没有就报错。

## parts：部位样式

有的组件能分成几个部位，各自设样式。

```json
"parts": {
  "header": { "background": "#1A73E8", "color": "#FFFFFF" },
  "evenRow": { "background": "#F5F7FA" }
}
```

| 组件 | 部位 |
|---|---|
| `Table` | `table` `cell` `header` `firstRow` `lastRow` `firstColumn` `lastColumn` `oddRow` `evenRow` `oddColumn` `evenColumn` `topLeftCell` `topRightCell` `bottomLeftCell` `bottomRightCell` |
| `List` | `level1` … `level9` `marker` `item` |
| `Image` | `caption` |
| `Slide` | `title` `body` |

写了组件没有的部位会报错。表格部位的细节见[表格](/guide/tables/)。

## 文字：字符串或 runs

文字类的 props 有两种写法：Heading 的 `text`、Text 的 `text`、List 的每一项、表格的每一格。

纯字符串：

```json
"text": "一份 JSON，出三种格式。"
```

runs 数组。数组里可以直接写字符串，也可以写对象：

```json
"text": [
  "Text 可以写 runs：",
  { "text": "加粗", "bold": true }, "、",
  { "text": "红字", "color": "#CF222E" }, "、",
  { "text": "代码", "type": "InlineCode" }, "、",
  { "text": "链接", "href": "https://github.com/reiy-leo/fmtagno" }, "。"
]
```

run 对象的字段：

| 字段 | 类型 | 例子 | 说明 |
|---|---|---|---|
| `text` | 字符串 | `"加粗"` | 文字。`\n` 是换行 |
| `bold` | 布尔 | `true` | 加粗，简写 |
| `italic` | 布尔 | `true` | 斜体，简写 |
| `underline` | 布尔 / 线型 | `"wavy"` | 下划线，简写。线型见[文字样式](/reference/text-style/) |
| `color` | 颜色 | `"#CF222E"` | 文字颜色，简写 |
| `style` | 字符串 / 数组 / 对象 | `{ "verticalAlign": "super" }` | 完整的文字样式。只能写文字字段，外加 `background` |
| `href` | 字符串 | `"https://…"` | 链接。默认蓝色（`#0563C1`）加下划线 |
| `type` | `"InlineCode"` | | 行内代码，外观由 `InlineCode` 组件样式决定 |
| `field` | `"page"` / `"pages"` / `"sectionPages"` | | 页码、总页数、本节页数，见[分节与页眉页脚](/guide/sections/) |
| `image` | 字符串 | `"logo.png"` | 行内图片，写了就不显示 `text`，见[图片](/guide/images/) |
| `width` / `height` | 数字（pt） | `40` | 行内图片的宽高，只写一个时按比例算另一个 |

run 的样式按这个顺序叠：段落的文字样式 → 行内代码的 `InlineCode` 样式 → 链接默认色 → `bold` 这类简写 → run 的 `style`。

:::note[下一版]
文字以 `\n` 结尾时，Word 里末尾会多一行空行。下一版起 pdf 和 html 也一样多一行，三种格式对齐。
:::

## 一份完整的例子

```json title="structure.json"
{
  "version": "0.1",
  "meta": { "title": "结构示例", "author": "fmtagno", "lang": "zh-CN" },
  "styles": {
    "muted": { "color": "#666666" },
    "center": { "align": "center" }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "lead", "group"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "结构示例" }, "style": "center" },
    "lead": {
      "type": "Text",
      "props": { "text": ["普通文字，", { "text": "加粗", "bold": true }, "，", { "text": "上标", "style": { "verticalAlign": "super" } }, "。\n第二行。"] },
      "style": ["muted", { "fontSize": 11 }]
    },
    "group": { "type": "Document", "children": ["g1", "g2"], "style": { "color": "#1A73E8" } },
    "g1": { "type": "Text", "props": { "text": "嵌套的 Document 把两段编成一组，" } },
    "g2": { "type": "Text", "props": { "text": "组上的文字颜色两段都继承。" } }
  }
}
```
