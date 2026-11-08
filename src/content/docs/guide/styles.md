---
title: 样式
description: fmtagno 的样式写在哪、哪些字段会继承、多处样式按什么顺序叠加，以及内置默认样式。
sidebar:
  order: 3
---

样式是一个平铺的对象，字段名跟 CSS 走：

```json
{ "fontSize": 12, "color": "#333333", "lineHeight": 1.5, "borderBottom": "1pt solid #D0D7DE" }
```

字段取值以 Word 能表达的为准。某个格式表达不了的字段，渲染时忽略，打一条警告，不报错。写了不存在的字段会报错。

## 字段分几组

字段在 JSON 里都平铺在一层，分组只是为了查起来方便：

| 组 | 例子 | 参考页 |
|---|---|---|
| 文字 | `fontFamily` `fontSize` `color` `bold` `underline` | [文字样式](/reference/text-style/) |
| 段落 | `align` `lineHeight` `spaceBefore` `textIndent` | [段落样式](/reference/paragraph-style/) |
| 边框、背景、盒子 | `border` `background` `padding` `width` | [边框、背景和盒子](/reference/box-style/) |
| 列表 | `listStyleType` `listMarkerFormat` `listIndent` | [列表样式](/reference/list-style/) |
| 图片位置 | `position` `float` `wrap` `x` `y` | [图片样式](/reference/image-style/) |
| 表格 | `cellPadding` `repeatHeader` `tableLayout` | [表格样式](/reference/table-style/) |

长度、颜色、边框这些值怎么写，见[取值写法](/reference/units/)。

## 样式写在哪

有四个地方，写法一样：

1. **元素的 `style`**：只管这一个元素。
2. **元素的 `parts`**：只管这个元素的某个部位。
3. **顶层 `styles`**：
   - 键是组件名，就是**组件样式**，对这类组件全部生效：`"Text"`、`"Heading.1"`、`"Table.header"`。
   - 其他键是**命名样式**，元素用名字引用：`"style": "muted"`。
4. **样式集**：一整套外观，可以放进单独的文件给很多文档共用。见[样式集](/guide/style-sets/)。

```json
"styles": {
  "Text": { "textIndent": "2em" },
  "Heading.1": { "align": "center" },
  "Table.header": { "background": "#1A73E8", "color": "#FFFFFF" },
  "muted": { "color": "#666666", "fontSize": 10 }
}
```

组件样式的键：

| 键 | 管什么 |
|---|---|
| `Heading` `Text` `Code` `List` `Table` `Image` `Slide` `Section` `Document` | 这类组件的全部元素 |
| `InlineCode` | runs 里的行内代码 |
| `Heading.1` … `Heading.6` | 某一级标题 |
| `List.level1` … `List.level9`、`List.marker`、`List.item` | 列表的某一级、编号、项文字 |
| `Table.header`、`Table.evenRow` 等 | 表格部位，见[表格](/guide/tables/) |
| `Image.caption`、`Slide.title`、`Slide.body` | 其他部位 |
| `自定义组件名` | 自定义组件展开后的根元素 |
| `自定义组件名:模板元素id` | 自定义组件里的某个元素，后面还能接 `.部位` |

键里的组件名不存在、部位不存在，都会报错。

## 继承

像 CSS 一样，有的字段会从父元素传给子元素，有的不会。

- **会继承**：文字字段、大部分段落字段、列表字段。具体是 `fontFamily` `fontSize` `color` `bold` `italic` `underline` `underlineColor` `strike` `caps` `letterSpacing` `highlight` `emphasisMark` `scale` `kerning` `lang` `hidden` `align` `lineHeight` `textIndent` `hangingIndent` `widowControl` `contextualSpacing` `autoSpace` `kinsoku` `direction`，以及全部 `list*` 字段（`listStart` 除外）。
- **不继承**：`verticalAlign` `spaceBefore` `spaceAfter` `marginLeft` `marginRight` `keepWithNext` `keepTogether` `pageBreakBefore` `wrap` `outlineLevel`，全部边框、背景、盒子、图片位置、表格字段，还有 `listStart`。

所以在 `Document` 上写 `fontSize`，全文都变；在 `Document` 上写 `border`，只有它自己有框。

## 叠加顺序

一个元素的最终样式，按下面的顺序叠。后面的覆盖前面的：

1. 父元素传下来的会继承的字段。根元素的「父」是内置全局默认值，再叠上样式集的 `global`。
2. 内置的组件默认样式：先 `Heading`，再 `Heading.1`。
3. 样式集的组件样式：先 `Heading`，再 `Heading.1`。
4. 顶层 `styles` 里的组件样式：同样先 `Heading` 再 `Heading.1`。
5. 自定义组件模板里写的 `style`。
6. 指名自定义组件的组件样式：`Notice`、`Notice:head`。
7. 元素自己的 `style`。数组里后面的覆盖前面的。
8. runs 上的文字样式（只管这一小段文字）。

几点说明：

- 第 1 步排最低。组件样式总能盖过继承来的值，和 CSS 一样。
- 第 4 步在第 3 步后面。样式集当底子，文档自己写的优先。
- 部位样式按同样的顺序叠：内置 → 样式集 → 顶层 `styles` → 模板的 `parts` → `组件名:元素id.部位` → 元素自己的 `parts`。部位样式最后叠在元素样式上面。
- `fontFamily` 按文种合并。先写 `"fontFamily": "Times New Roman"`，再写 `{ "eastAsia": "黑体" }`，结果是西文 Times、中文黑体。

## 内置默认样式

什么都不写时就是这套：

| 键 | 默认值 |
|---|---|
| 全局 | `fontSize` 10.5，`lineHeight` 1.5 |
| `Heading` | 加粗，`keepWithNext`，段前 12，段后 6，`lineHeight` 1.25 |
| `Heading.1` … `Heading.6` | 字号 20 / 16 / 14 / 12 / 11 / 11；1 级段前 18 |
| `Text` | 段后 6 |
| `Code` | 等宽字体，9pt，`lineHeight` 1.4，底色 `#F6F8FA`，内边距 8，段后 8，`keepTogether` |
| `InlineCode` | 等宽字体，底色 `#F0F1F3` |
| `List` | 段后 6，`listIndent` 2em，`listHanging` 2em |
| `Table` | 边框 `0.5pt solid #999999`，`cellPadding` 4，`repeatHeader`，段后 8 |
| `Table.header` | 加粗，底色 `#F3F3F3` |
| `Image` | 段后 6 |
| `Image.caption` | 9pt，`#666666` |
| `Slide.title` | 20pt，加粗 |

数字单位都是 pt。等宽字体是 `Menlo, Consolas, DejaVu Sans Mono`。链接默认 `#0563C1` 加下划线。

## 例子

```json title="styles-basic.json"
{
  "version": "0.1",
  "meta": { "title": "样式示例", "lang": "zh-CN" },
  "styles": {
    "Document": { "fontSize": 11, "lineHeight": 1.6 },
    "Heading.1": { "align": "center", "color": "#1F2328" },
    "Text": { "textIndent": "2em", "align": "justify" },
    "note": { "background": "#FFF8C5", "borderLeft": "3pt solid #D4A72C", "padding": 8, "textIndent": 0 }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "p1", "tip"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "样式示例" } },
    "p1": { "type": "Text", "props": { "text": "正文首行缩进两个字，两端对齐。字号和行高写在 Document 上，全文继承。" } },
    "tip": { "type": "Text", "props": { "text": "提示框用命名样式 note：左边粗线、浅黄底。" }, "style": "note" }
  }
}
```
