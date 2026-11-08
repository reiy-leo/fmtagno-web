---
title: 文字样式
description: fmtagno 文字字段一览：字体、字号、颜色、加粗、下划线、删除线、上下标、字间距、高亮等，附各格式支持情况。
sidebar:
  order: 3
---

文字字段管字的样子。它们都会从父元素继承（`verticalAlign` 除外），也能写在 run 的 `style` 上，只改一小段文字。

图例：✓ 支持；✗ 忽略并警告；— 忽略，不警告。

| 字段 | 值 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|---|
| `fontFamily` | 字体名或按文种分开的对象 | `{ "latin": "Inter", "eastAsia": "思源黑体" }` | 字体，见[取值写法](/reference/units/) | ✓ 只取每项第一个名字 | ✓ | ✓ |
| `fontSize` | 长度 | `12`、`"10.5pt"` | 字号 | ✓ | ✓ | ✓ |
| `color` | 颜色 | `"#333333"` | 文字颜色 | ✓ | ✓ | ✓ |
| `bold` | 布尔 | `true` | 加粗 | ✓ | ✓ | ✓ |
| `italic` | 布尔 | `true` | 斜体 | ✓ | ✓ 中文字体没有斜体 | ✓ |
| `underline` | 布尔或线型 | `"wavy"` | 下划线 | ✓ | ✓ 双线、波浪线画成单线并警告 | ✓ |
| `underlineColor` | 颜色 | `"#CF222E"` | 下划线颜色 | ✗ | ✓ | ✓ |
| `strike` | 布尔、`"single"` 或 `"double"` | `true` | 删除线 | ✓ | ✓ 双线画成单线并警告 | ✓ |
| `verticalAlign` | `"super"` `"sub"` | `"super"` | 上标、下标 | ✓ | ✓ | ✓ |
| `caps` | `"all"` `"small"` | `"small"` | 全大写、小型大写 | ✓ `small` ✗ | ✓ | ✓ |
| `letterSpacing` | 长度 | `"0.1em"`、`1` | 字间距 | ✓ | ✓ | ✓ |
| `highlight` | 颜色 | `"#FFF8C5"` | 高亮底色，任意颜色 | ✓ | ✓ | ✓ |
| `emphasisMark` | `"dot"` `"comma"` `"circle"` `"underDot"` | `"dot"` | 着重号 | ✗ | ✗ | ✓ |
| `scale` | 百分比数字 | `80` | 字符横向缩放 | ✓ | ✗ | ✗ |
| `kerning` | 布尔 | `true` | 字距调整 | ✗ | ✓ | ✓ |
| `lang` | BCP 47 语言代码 | `"en-US"` | 这段文字的语言 | — | ✓ | ✓ |
| `hidden` | 布尔 | `true` | 隐藏文字 | ✓ | ✓ | ✓ |

## 线型

`underline` 的值：

| 值 | 意思 |
|---|---|
| `true` / `"single"` | 单线 |
| `false` / `"none"` | 无 |
| `"double"` | 双线 |
| `"thick"` | 粗线 |
| `"dotted"` | 点线 |
| `"dashed"` | 虚线 |
| `"wavy"` | 波浪线 |

## run 上的 background

run 的 `style` 里还能写 `background`，给这一小段文字加底色（行内代码就是这么画的）。写法见[取值写法](/reference/units/)。

```json
{ "text": "重点", "style": { "background": "#FFF8C5", "bold": true } }
```

## 例子

```json
"intro": {
  "type": "Text",
  "props": { "text": [
    "普通字，",
    { "text": "加粗红字", "bold": true, "color": "#CF222E" }, "，",
    { "text": "上标", "style": { "verticalAlign": "super" } }, "，",
    { "text": "删除线", "style": { "strike": true } }, "，",
    { "text": "波浪下划线", "underline": "wavy" }, "，",
    { "text": "高亮", "style": { "highlight": "#FFF8C5" } }, "。"
  ] },
  "style": { "fontFamily": { "latin": "Inter", "eastAsia": "思源黑体" }, "fontSize": 11, "letterSpacing": "0.05em" }
}
```
