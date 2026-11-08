---
title: 图片样式
description: fmtagno 图片位置字段一览：inline、float、absolute 定位，绕排、偏移、对齐、缩放、旋转、透明度，附各格式支持情况。
sidebar:
  order: 7
---

这些字段写在 `Image` 元素的 `style` 上，都不继承。图片的内容尺寸写在 props 的 `width`、`height`；样式里也能写 `width`、`height`，样式优先，还能写百分比。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

| 字段 | 值 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|---|
| `position` | `inline` `float` `absolute` | `"float"` | 跟文字走（默认）、浮动、绝对定位 | ✓ | ✓ `float` 不绕排，只左右对齐，并警告 | ✓ |
| `float` | `left` `right` | `"right"` | 浮动到哪边，默认 `left` | ✓ | ✓ | ✓ |
| `wrap` | `square` `tight` `topAndBottom` `none` `behind` `inFront` | `"square"` | 文字怎么绕排 | ✓ | — | 部分，见下文 |
| `wrapDistance` | 长度 | `6` | 图片和文字的间距，默认 6pt | ✓ | — | ✓ |
| `anchorTo` | `paragraph` `margin` `page` | `"page"` | 绝对定位时相对谁 | ✓ | `page`、`margin` | `page`、`margin`；`paragraph` ✗ |
| `x` / `y` | 长度 | `"10mm"` | 相对 `anchorTo` 的偏移 | ✓ | ✓ | ✓ |
| `horizontalAlign` | `left` `center` `right` | `"center"` | 水平对齐。inline 时在版心里对齐，绝对定位时在 `anchorTo` 里对齐 | ✓ | ✓ | inline ✓，绝对定位 — |
| `verticalAlign` | `top` `middle` `bottom` | `"bottom"` | 绝对定位时的竖直对齐 | — | ✓ | — |
| `objectFit` | `contain` `cover` `fill` | `"cover"` | 宽高都给时怎么缩放 | ✗ | ✓ | ✓ |
| `rotation` | 角度 | `90` | 旋转 | ✓ | ✓ | ✓ |
| `opacity` | 0–1 | `0.5` | 透明度 | ✗ | ✗ | ✓ |

## wrap 在各格式里

| 值 | 意思 | docx | html |
|---|---|---|---|
| `square` | 四周绕排 | ✓ | float |
| `tight` | 紧密绕排 | ✓ | 按 square 处理 |
| `topAndBottom` | 上下型，左右不排字 | ✓ | ✓ |
| `none` | 不绕排，叠在文字上 | ✓ | 浮动时 ✗ |
| `behind` | 衬于文字下方 | ✓（只对浮动、绝对定位有效） | 绝对定位时 ✓ |
| `inFront` | 浮于文字上方 | ✓ | 绝对定位时 ✓ |

pdf（Typst）不能让文字绕排图片，`wrap` 不起作用。

## 默认值不一样的地方

`position: absolute` 没写 `anchorTo` 时：docx 相对页面，html 相对版心。要三种格式一致，就写明 `anchorTo`。

## 例子

右边浮动，文字绕排：

```json
"style": { "position": "float", "float": "right", "wrap": "square", "wrapDistance": "4mm" }
```

整页背景图：

```json
"style": { "position": "absolute", "anchorTo": "page", "x": 0, "y": 0, "wrap": "behind" }
```

右上角角标（html 不认绝对定位的 `horizontalAlign`，要用 `x`）：

```json
"style": { "position": "absolute", "anchorTo": "margin", "horizontalAlign": "right", "y": 0 }
```
