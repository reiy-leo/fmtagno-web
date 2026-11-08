---
title: 取值写法
description: fmtagno 样式里长度、颜色、字体、行高、边框、背景、列宽和纸张名的写法。
sidebar:
  order: 2
---

样式字段的值有几种固定的写法。写错了 `check` 会报错，并告诉你怎么写。

## 长度

**数字就是 pt。** 字符串可以带单位：

| 单位 | 例子 | 换算 | 用在哪 |
|---|---|---|---|
| 不带单位 | `12`、`"12"` | pt | 任何长度 |
| `pt` | `"10.5pt"` | 1pt = 1/72 in | 任何长度 |
| `mm` | `"20mm"` | | 任何长度 |
| `cm` | `"2.5cm"` | | 任何长度 |
| `in` | `"1in"` | 1in = 72pt | 任何长度 |
| `px` | `"16px"` | 1px = 0.75pt（96 dpi） | 任何长度 |
| `em` | `"2em"` | 当前字号的倍数 | 缩进、字间距、内边距等 |
| `line` | `"0.5line"` | 行数 | `spaceBefore`、`spaceAfter` |
| `%` | `"50%"` | 百分比 | 宽高 |

- `"2em"` 用在 `textIndent` 上就是首行缩进两个字。`marginLeft`、`marginRight`、`textIndent`、`hangingIndent` 写成 `em` 时，docx 里同时写 Word 按字符计的缩进（leftChars、rightChars、firstLineChars、hangingChars），在 Word 里改字号缩进跟着变；pdf、html 按字号算。
- `"0.5line"` 在 docx 里写成 Word 的「行」单位；pdf、html 按字号 × 1.2 × 行数算。
- `px` 是 CSS 的参考像素，不是屏幕的物理像素。CSS 定死了 1in = 96px = 72pt，所以换算和屏幕无关。Retina 屏只是用 2 个物理像素画 1px，打印出来的尺寸不变。
- 页面设置（纸张、页边距）、表格列宽、行高只认绝对长度（pt mm cm in px）。
- 可以写负数，比如 `"-2pt"`。

## 颜色

只认十六进制：

| 写法 | 例子 |
|---|---|
| `#RGB` | `"#c00"` |
| `#RRGGBB` | `"#1A73E8"` |
| `#RGBA` | `"#c008"` |
| `#RRGGBBAA` | `"#1A73E880"` |

- 大小写都行。
- 不认颜色名：`"red"` 会报错。
- 透明度（后两位）：html、pdf 支持，docx 忽略。
- 没有主题色。

## 字体：fontFamily

```json
"fontFamily": "Inter"
"fontFamily": { "latin": "Inter", "eastAsia": "思源黑体", "complex": "Noto Naskh Arabic" }
"fontFamily": { "latin": "Liberation Serif, Times New Roman", "eastAsia": "Noto Serif CJK SC, Songti SC, SimSun" }
```

| 键 | 管哪些字 |
|---|---|
| `latin` | 西文 |
| `eastAsia` | 中日韩 |
| `complex` | 阿拉伯文等复杂文种 |

- 写成字符串时三项都用它。
- 每项可以写逗号分隔的回退列表。html、pdf 按顺序找；docx 只取第一个名字。
- 后叠的样式只改它写了的文种，没写的保留。

## 行高：lineHeight

| 写法 | 例子 | 意思 |
|---|---|---|
| 数字 | `1.5` | 倍数：字号 × 1.5 |
| `em` 或 `%` | `"1.5em"`、`"150%"` | 同样是倍数 |
| 其他长度 | `"20pt"` | 固定值 |
| `{ "atLeast": 长度 }` | `{ "atLeast": "18pt" }` | 最小值 |

:::caution
`lineHeight` 写数字是**倍数**，不是 pt。要固定 20pt，写 `"20pt"`。
:::

倍数按 CSS 算（字号 × 倍数）。docx 里写成「最小值 = 字号 × 倍数」，不用 Word 的「多倍行距」。Word 的倍数乘的是字体自己的行高，会比 html、pdf 高出三四成。

## 边框

一条边可以写成字符串，也可以写成对象：

```json
"border": "1pt solid #CCCCCC"
"borderBottom": { "width": 2, "style": "double", "color": "#1A73E8" }
"borderInsideV": "none"
```

- 字符串里三样顺序随意，都能省：线宽默认 1pt，线型默认 `solid`，颜色默认黑色。
- `"none"` 表示没有线。

线型：

| 值 | 意思 | html | 说明 |
|---|---|---|---|
| `none` | 无 | none | |
| `solid` | 实线 | solid | |
| `dashed` | 虚线 | dashed | |
| `dotted` | 点线 | dotted | |
| `dashDot` | 点划线 | 画成 dashed | |
| `double` | 双线 | double | pdf 画成两条线 |
| `wave` | 波浪线 | 画成 solid | |

Word 的线宽只能在 0.25pt 到 12pt 之间，超出时取最近的值。

## 背景：background

三种写法：

```json
"background": "#F5F7FA"
"background": { "pattern": "pct20", "color": "#000000", "fill": "#FFFFFF" }
"background": { "gradient": "linear", "angle": 90, "stops": ["#FFFFFF", "#E8F0FE"] }
```

| 写法 | 字段 | docx | pdf | html |
|---|---|---|---|---|
| 纯色 | 颜色 | ✓ | ✓ | ✓ |
| 底纹 | `pattern` 底纹名，`color` 前景色（默认黑），`fill` 底色（默认白） | ✓ | 混成纯色 | 混成纯色 |
| 渐变 | `gradient` 只能是 `"linear"`，`angle` 角度（默认 90），`stops` 至少两个颜色 | 取第一个颜色 | ✓ | ✓ |

底纹名：`pct5` `pct10` `pct20` `pct25` `pct30` `pct40` `pct50` `pct60` `pct70` `pct75` `pct80` `pct90` `horzStripe` `vertStripe` `diagStripe` `reverseDiagStripe` `horzCross` `diagCross` `thinHorzStripe` `thinVertStripe` `thinDiagStripe` `thinReverseDiagStripe` `thinHorzCross` `thinDiagCross`。

## 表格列宽：widths

| 写法 | 例子 | 意思 |
|---|---|---|
| 大于 0 的数字 | `3` | 比例，分剩下的宽度 |
| 绝对长度 | `"20mm"` | 固定宽度 |
| `"auto"` | `"auto"` | 按内容撑开 |

详见[表格](/guide/tables/)。

## 表格行高：rowHeights

| 写法 | 例子 | 意思 |
|---|---|---|
| 绝对长度 | `"28pt"`、`20` | 最小高度 |
| 对象 | `{ "height": "20pt", "rule": "exact" }` | `rule` 是 `atLeast`（默认）或 `exact` |
| `null` | | 不管 |

## 纸张名

`A3` `A4` `A5` `B5` `Letter` `Legal`，大小写都行。也可以写 `{ "width": "180mm", "height": "260mm" }`。不认识的名字按 A4 处理，并给警告。

## 布尔和枚举

- 布尔写 `true` / `false`，不能写字符串 `"true"`。
- 枚举值区分大小写：`"topAndBottom"` 对，`"topandbottom"` 错。
