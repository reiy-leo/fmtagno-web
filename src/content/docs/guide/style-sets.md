---
title: 样式集
description: 把一整套外观写成样式集，在文档里选用，或放进单独的文件给很多文档共用；支持 extends 继承和 $变量。
sidebar:
  order: 4
---

样式集是一整套外观：全局样式、组件样式、命名样式放在一起。同一份文档换个样式集，就换一套外观，内容不用动。

## 写在文档里

```json
{
  "styleSet": "formal",
  "styleSets": {
    "formal": {
      "global": {
        "fontFamily": { "latin": "Times New Roman", "eastAsia": "宋体" },
        "fontSize": 12,
        "lineHeight": 1.5
      },
      "components": {
        "Heading": { "fontFamily": { "eastAsia": "黑体" }, "bold": true },
        "Heading.1": { "fontSize": 22, "align": "center" },
        "Text": { "textIndent": "2em" },
        "Table.header": { "background": "#F2F2F2", "bold": true },
        "List.level2": { "listStyleType": "circle" }
      },
      "styles": { "muted": { "color": "#666666" } }
    },
    "modern": {
      "extends": "formal",
      "global": { "fontFamily": { "latin": "Inter", "eastAsia": "思源黑体" }, "fontSize": 11 }
    }
  }
}
```

| 字段 | 位置 | 说明 |
|---|---|---|
| `styleSet` | 文档顶层 | 用哪个样式集。命令行 `--style-set` 能临时换 |
| `styleSets` | 文档顶层 | 样式集定义，键是样式集名 |
| `global` | 样式集里 | 全局样式，所有元素都继承 |
| `components` | 样式集里 | 组件样式，键是组件名或 `组件名.部位`，同[样式](/guide/styles/)里的组件样式键 |
| `styles` | 样式集里 | 这个样式集里的命名样式 |
| `extends` | 样式集里 | 在另一个样式集的基础上改 |
| `name` | 样式集里 | 样式集名。单独成文件时必填 |

规则：

- `global` 只能写会继承的字段（文字、段落、列表）。写 `border`、`background` 这类会报错，它们不该铺到每个元素上。
- `extends` 只能单继承。父样式集先叠，子样式集后叠。成环会报错。
- 没写 `styleSet`、命令行也没给 `--style-set`，就不用任何样式集。
- 选了不存在的样式集会报错，并列出现有的。

## 顶层 styles 和样式集的关系

顶层 `styles` 不属于任何样式集，选哪个样式集都生效。

- 组件样式：顶层 `styles` 叠在样式集的组件样式**后面**。文档自己写的优先。
- 命名样式：先在当前样式集的 `styles` 里找，找不到再到顶层 `styles` 找。

## 放进单独的文件

一套公司模板写成单独的 JSON 文件，很多文档共用。文件里要写 `name`：

```json title="styles/formal.json"
{
  "name": "formal",
  "global": { "fontSize": 12, "lineHeight": 1.5 },
  "components": {
    "Heading.1": { "fontSize": 22, "align": "center" },
    "Text": { "textIndent": "2em" }
  },
  "styles": { "muted": { "color": "#666666" } }
}
```

fmtagno 从这几个地方读样式集文件：

1. 文档旁边的 `styles/` 目录，自动读。
2. `--style-sets` 指定的文件或目录，可以写多次。

目录里只读 `.json` 文件，不进子目录。同名的样式集定义两次会报错。文件里的样式集和文档里 `styleSets` 同名时，**文档里的优先**。

```sh
fmtagno render report.json -o report.pdf --style-sets ~/templates/ --style-set formal
```

`--style-set` 优先于文档里的 `styleSet`。

## 变量

`global` 里以 `$` 开头的键是变量，不是样式字段。用的地方写 `${名字}`：

```json
"global": {
  "$brand": "#8DC63F",
  "$gray": "#666666",
  "$line": "1pt solid ${brand}",
  "fontSize": 11
},
"components": { "Heading": { "color": "${brand}" } },
"styles": { "box": { "borderBottom": "${line}" } }
```

- 变量能用在：样式集的 `global`、`components`、`styles`；顶层 `styles`；元素的 `style`、`parts`、单格 `style`；组件的 `props`（比如 run 的 `color`、自定义组件的参数）。
- 整个值就是 `${x}` 时，换成变量原来的值，数字、对象都行。
- 夹在别的文字里时按文字拼进去，这时变量只能是文字或数字：`"1pt solid ${brand}"`。
- 变量值里也能引用别的变量。成环、没定义，都报错。
- `extends` 的子样式集能用父样式集的变量。同名时子样式集的覆盖父的。
- 要写字面的 `${`，写成 `$${`。
- 变量名只能用字母、数字、`_` 和 `-`。
- **没选样式集时没有变量**，这时写 `${x}` 会报「变量没定义」。

## 改自定义组件里面的样式

样式集可以指名改某个自定义组件：

```json
"components": {
  "PriceTable": { "fontSize": 10 },
  "PriceTable:t": { "border": "0.5pt solid #333333" },
  "PriceTable:t.header": { "background": "#333333" }
}
```

- `PriceTable`：组件展开后的根元素。
- `PriceTable:t`：组件模板里 id 为 `t` 的元素。
- `PriceTable:t.header`：再接部位名。

自定义组件模板里写的样式排在通用组件样式后面，`Table` 这类通用样式改不动它，要改就用上面这种指名的键。

## 完整例子

```json title="style-set.json"
{
  "version": "0.1",
  "meta": { "title": "样式集示例", "lang": "zh-CN", "page": { "size": "A4", "margin": "20mm" } },
  "styleSet": "report",
  "styleSets": {
    "report": {
      "global": {
        "$brand": "#1A73E8",
        "$border": "#D0D7DE",
        "fontFamily": { "latin": "Liberation Serif, Times New Roman", "eastAsia": "Noto Serif CJK SC, Songti SC, SimSun" },
        "fontSize": 11,
        "lineHeight": 1.6
      },
      "components": {
        "Heading": { "fontFamily": { "eastAsia": "Noto Sans CJK SC, PingFang SC, Microsoft YaHei" }, "color": "#1F2328" },
        "Heading.1": { "fontSize": 22, "align": "center", "spaceAfter": 12 },
        "Heading.2": { "borderBottom": "1pt solid ${border}", "padding": 2 },
        "Text": { "textIndent": "2em", "align": "justify" },
        "Table.header": { "background": "${brand}", "color": "#FFFFFF" },
        "Table.evenRow": { "background": "#F5F7FA" }
      },
      "styles": {
        "note": { "background": "#FFF8C5", "borderLeft": "3pt solid #D4A72C", "padding": 8, "textIndent": 0 }
      }
    }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "intro", "h-table", "table", "tip"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "样式集示例" } },
    "intro": { "type": "Text", "props": { "text": ["这份文档用 ", { "type": "InlineCode", "text": "report" }, " 样式集：正文宋体，首行缩进两个字；标题黑体。"] } },
    "h-table": { "type": "Heading", "props": { "level": 2, "text": "表格" } },
    "table": {
      "type": "Table",
      "props": { "columns": ["品名", "单价"], "widths": [3, 1], "rows": [["苹果", "3.50"], ["梨", "4.00"], ["桃", "5.00"]] },
      "style": { "border": "0.5pt solid ${border}" }
    },
    "tip": { "type": "Text", "props": { "text": "提示框用样式集里的命名样式 note。" }, "style": "note" }
  }
}
```

换一套外观试试：

```sh
fmtagno render style-set.json -o a.pdf
fmtagno render style-set.json -o b.pdf --style-sets my-themes/ --style-set dark
```
