---
title: 列表样式
description: fmtagno 列表字段一览：编号类型、编号模板、编号颜色字体字号、缩进、起始值，以及多级列表的写法。
sidebar:
  order: 6
---

列表字段写在 `List` 元素上，或者写在它的部位 `level1` … `level9` 上分级设置。除 `listStart` 外都会继承。

图例：✓ 支持；✗ 忽略并警告。

| 字段 | 值 | 例子 | 意思 | docx | pdf | html |
|---|---|---|---|---|---|---|
| `listStyleType` | 见下表 | `"cjk-decimal"` | 编号或符号类型 | ✓ | ✓ | ✓ |
| `listMarkerFormat` | 字符串，`%1` 是本级编号 | `"%1、"`、`"第%1条"`、`"%1.%2"` | 编号模板 | ✓ | ✓ | ✓ |
| `listMarkerImage` | 图片路径 | `"dot.png"` | 用图片当项目符号 | ✗ | ✓ | ✓ |
| `listMarkerColor` | 颜色 | `"#1A73E8"` | 编号颜色 | ✓ | ✓ | ✓ |
| `listMarkerFont` | 字体名 | `"Wingdings"` | 编号字体 | ✓ | ✓ | ✓ |
| `listMarkerSize` | 百分比数字 | `80` | 编号字号，相对正文 | ✓ | ✓ | ✓ |
| `listMarkerAlign` | `left` `center` `right` | `"right"` | 编号在编号区里怎么对齐。右对齐时 1. 到 10. 的点能对齐 | ✓ | ✓ | ✓ |
| `listMarkerGap` | 长度，或 `"tab"` `"space"` `"none"` | `"space"` | 编号和正文之间 | ✓ 长度按 `tab` 处理并警告 | ✓ | ✓ |
| `listIndent` | 长度 | `"2em"` | 每一级缩进多少，逐级累加 | ✓ | ✓ | ✓ |
| `listHanging` | 长度 | `"2em"` | 编号区宽度（悬挂缩进） | ✓ | ✓ | ✓ |
| `listStart` | 整数 | `5` | 有序列表从几开始 | ✓ | ✓ | ✓ |

## 编号类型

| 无序 | 样子 | 有序 | 样子 |
|---|---|---|---|
| `disc` | • | `decimal` | 1 2 3 |
| `circle` | ◦ | `decimal-leading-zero` | 01 02 03 |
| `square` | ▪ | `lower-alpha` / `upper-alpha` | a b c / A B C |
| `dash` | – | `lower-roman` / `upper-roman` | i ii iii / I II III |
| `none` | 不显示 | `cjk-decimal` | 一 二 三 |
| 任意 1–3 个字符 | 如 `"▸"`、`"★"` | `cjk-ideographic` | 甲 乙 丙 |
| | | `circled-decimal` | ① ② ③（超过 20 写成 (21)） |

- 不写类型时按层级轮换：有序 `decimal` → `lower-alpha` → `lower-roman`，无序 `disc` → `circle` → `square`。
- 有序编号不写 `listMarkerFormat` 时，默认是 `"%1."`（第二级 `"%2."`，以此类推）。

## 多级列表

`items` 里写 `{ "text": …, "items": [...] }` 就是子列表。每一级的样式写在部位 `level1`、`level2` … 上，没写的级别沿用上一级，`listIndent` 每级自动累加。

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
  "style": { "listStyleType": "cjk-decimal", "listMarkerFormat": "%1、", "listMarkerAlign": "right", "listIndent": "2.5em" },
  "parts": {
    "level2": { "listStyleType": "decimal", "listMarkerFormat": "%1.%2", "listMarkerColor": "#1A73E8" }
  }
}
```

出来是：

```text
一、准备数据
二、选择样式集
    2.1 report：报告
    2.2 slides：幻灯片
三、渲染出文件
```

`%1.%2` 里引用上一级的编号。本级是 `decimal` 时，上几级也写成阿拉伯数字：上一级是「二、」，本级出「2.1」而不是「二.1」。

## 部位

| 部位 | 管什么 |
|---|---|
| `level1` … `level9` | 某一级 |
| `marker` | 编号本身，比如 `{ "bold": true }` |
| `item` | 每一项的文字 |

全文统一改，用组件样式键：`List.level2`、`List.marker`、`List.item`。
