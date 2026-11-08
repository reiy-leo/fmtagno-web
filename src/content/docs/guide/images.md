---
title: 图片
description: 用 Image 组件放独立的图片，用 run 的 image 放行内图片；图片怎么嵌进文件，各格式支持哪些图片格式，浮动和绝对定位怎么写。
sidebar:
  order: 7
---

图片有两种放法：

- **Image 组件**：独占一块，可以带说明文字，可以浮动或绝对定位。
- **行内图片**：写在 runs 里，跟文字排在一行。段落、表格格子、页眉页脚里都能用。

## Image 组件

```json
"logo": {
  "type": "Image",
  "props": { "src": "images/logo.png", "alt": "fmtagno 标志", "width": 90, "caption": "图 1 标志" },
  "style": { "horizontalAlign": "center" }
}
```

| prop | 类型 | 必填 | 说明 |
|---|---|---|---|
| `src` | 字符串 | 是 | 本地路径或网址 |
| `alt` | 字符串 | 否 | 替代文字，图片放不进去时显示 `[alt]` |
| `width` | 数字（pt） | 否 | 宽 |
| `height` | 数字（pt） | 否 | 高。只写一个时按图片比例算另一个 |
| `caption` | 字符串 | 否 | 图下的说明文字，样式用部位 `caption` 改 |

- 宽高也能写在样式里：`"style": { "width": "50%" }`。样式里的 `width`、`height` 优先，还能写百分比（相对版心宽）。
- 图片比版心宽时自动缩到版心宽（绝对定位的图片除外）。

## 行内图片

在 run 里写 `image`：

```json
"text": [{ "image": "images/logo.png", "width": 40, "height": 20 }, " 公司名称"]
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `image` | 字符串 | 本地路径或网址。写了就不显示 `text` |
| `width` | 数字（pt） | 宽 |
| `height` | 数字（pt） | 高。只写一个时按比例算另一个 |

表格格子里也一样：

```json
"rows": [[{ "runs": [{ "image": "logo.png", "width": 40 }, " 内容"] }, "右边一格"]]
```

## 路径和嵌入

- 相对路径按**文档所在目录**找。从标准输入读文档时，按当前目录找。
- 本地图片会**嵌进输出文件**：docx、pdf 里打包进去，html 里写成 `data:` URI。生成的文件单独拿走也能看。
- 读不到的图片：docx、pdf 改成显示 alt 文字，html 保留原路径；都会给警告。

## 各格式支持的图片

| 图片 | docx | pdf | html |
|---|---|---|---|
| png、jpeg、gif、webp | ✓ | ✓ | ✓ |
| svg | ✗，显示 alt | ✓ | ✓ |
| 网址（http/https） | ✗，显示 alt | ✗，显示 alt | ✓（直接引用，不嵌入） |

要三种格式都出图，用 png 或 jpeg。

## 定位

图片默认跟着文字走（`position: inline`）。另外两种：

- `float`：浮动到左边或右边，文字绕排。
- `absolute`：按页面、版心或段落定位，不占位置。适合整页背景、角标。

```json
"badge": {
  "type": "Image",
  "props": { "src": "badge.png", "width": 60 },
  "style": { "position": "float", "float": "right", "wrap": "square", "wrapDistance": 6 }
}
```

```json
"bg": {
  "type": "Image",
  "props": { "src": "bg.png", "width": 595, "height": 842 },
  "style": { "position": "absolute", "anchorTo": "page", "x": 0, "y": 0, "wrap": "behind" }
}
```

全部字段见[图片样式](/reference/image-style/)。各格式差别：

| | docx | pdf | html |
|---|---|---|---|
| `inline` + `horizontalAlign` | ✓ | ✓ | ✓ |
| `float` 文字绕排 | ✓ | ✗，只左右对齐，不绕排 | ✓ |
| `absolute` | ✓ | ✓（`page`、`margin`） | ✓；`anchorTo: paragraph` 不支持 |
| `wrap` 各种绕排 | ✓ | ✗ | 部分 |
| `wrapDistance` | ✓ | ✗ | ✓ |
| `rotation` | ✓ | ✓ | ✓ |
| `objectFit` | ✗ | ✓ | ✓ |
| `opacity` | ✗ | ✗ | ✓ |

`absolute` 不写 `anchorTo` 时，docx 按页面定位，html 按版心定位。要三种格式一致，就把 `anchorTo` 写明。

## 完整例子

把一张 `logo.png` 放在 JSON 旁边再渲染：

```json title="images.json"
{
  "version": "0.1",
  "meta": { "title": "图片示例", "lang": "zh-CN", "page": { "header": "hdr" } },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "logo", "p", "t"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "图片示例" } },
    "logo": {
      "type": "Image",
      "props": { "src": "logo.png", "alt": "标志", "width": 120, "caption": "图 1 独立的图片，居中" },
      "style": { "horizontalAlign": "center" },
      "parts": { "caption": { "align": "center" } }
    },
    "p": { "type": "Text", "props": { "text": ["行内图片 ", { "image": "logo.png", "height": 12 }, " 跟文字排在一行。"] } },
    "t": {
      "type": "Table",
      "props": { "columns": ["图", "说明"], "widths": ["auto", 1], "rows": [[{ "runs": [{ "image": "logo.png", "width": 40 }] }, "表格格子里也能放图"]] }
    },
    "hdr": { "type": "Text", "props": { "text": [{ "image": "logo.png", "height": 14 }, " 页眉里的图"] }, "style": { "fontSize": 9 } }
  }
}
```
