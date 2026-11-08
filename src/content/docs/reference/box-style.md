---
title: 边框、背景和盒子
description: fmtagno 的边框、背景、内边距、宽高、竖直对齐、文字方向、圆角字段，附各格式支持情况。
sidebar:
  order: 5
---

这些字段给段落、表格、表格格子、图片画框、加底色、留内边距。它们都**不继承**：写在 `Document` 上的边框不会传给每一段。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

## 边框

| 字段 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|
| `border` | `"0.5pt solid #CCCCCC"` | 四条边 | ✓ | ✓ | ✓ |
| `borderTop` `borderRight` `borderBottom` `borderLeft` | `"3pt solid #D4A72C"` | 单边，覆盖 `border` | ✓ | ✓ | ✓ |
| `borderBetween` | `"0.5pt solid #EEEEEE"` | 相邻同样式段落之间的线 | ✓ | ✗ | ✗ |
| `borderInsideH` | `"none"` | 表格内部横线，不写就用 `border` | ✓ | ✓ | ✓ |
| `borderInsideV` | `"none"` | 表格内部竖线，不写就用 `border` | ✓ | ✓ | ✓ |
| `borderDiagonal` | | 单元格斜线 | 尚未实现 | 尚未实现 | 尚未实现 |

一条边的写法（字符串、对象、`"none"`）和线型见[取值写法](/reference/units/)。

## 背景

| 字段 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|
| `background` | `"#F5F7FA"` | 底色：纯色、底纹或渐变 | ✓ 渐变取第一个颜色 | ✓ 底纹混成纯色 | ✓ 底纹混成纯色 |

写在 run 的 `style` 上时，只给那一小段文字加底色。

## 盒子

| 字段 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|
| `padding` | `8` | 四边内边距 | 段落只在有边框时生效；表格格子 ✓ | ✓ | ✓ |
| `paddingTop` `paddingRight` `paddingBottom` `paddingLeft` | `2` | 单边内边距，覆盖 `padding` | 同上 | ✓ | ✓ |
| `width` | `"80%"`、`"120mm"` | 宽。百分比相对版心 | 表格、图片 | ✓ | ✓ |
| `height` | `"40mm"` | 高 | 图片 | ✓ | ✓ |
| `verticalAlign` | `"middle"` | 竖直对齐：`top` `middle` `bottom` | 表格格子、绝对定位的图片 | 同左 | 同左 |
| `textRotation` | `90` | 文字方向：`0` `90` `270` | 表格格子 | ✓ | ✓ |
| `radius` | `4` | 圆角 | ✗ | ✓ | ✓ |

`verticalAlign` 写在文字上是上下标（`super` `sub`），写在格子、图片上是竖直对齐。

## docx 的段落边框

Word 的段落没有真正的「盒子」，fmtagno 这样处理：

- 段落的边框写成 Word 的段落边框。
- `padding` 变成边框和文字之间的距离，所以只在有边框时生效。只有背景、没有边框时，`padding` 不起作用，会警告。
- 想要一个有底色、有内边距的提示框，加一条和底色同色的边框就行。

## 例子

```json
"styles": {
  "note": {
    "background": "#FFF8C5",
    "borderLeft": "3pt solid #D4A72C",
    "padding": 8
  },
  "card": {
    "border": "0.5pt solid #D0D7DE",
    "radius": 6,
    "padding": 10,
    "background": { "gradient": "linear", "angle": 90, "stops": ["#FFFFFF", "#E8F0FE"] }
  }
}
```
