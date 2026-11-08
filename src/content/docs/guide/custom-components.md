---
title: 自定义组件
description: 把内置组件拼成自己的组件：定义文件的格式、prop 类型、{{prop}} 替换、$children 插槽、catalog 目录和样式覆盖规则。
sidebar:
  order: 8
---

自定义组件把几个内置组件拼在一起，JSON 里像内置组件一样引用。渲染前 fmtagno 先把它展开成内置组件，所以三种格式都能用。

自定义组件只能用内置组件和别的自定义组件拼，不能写代码。

## 定义一个组件

一个文件一个组件，用 JSON 写：

```json title="catalog/callout.json"
{
  "name": "Callout",
  "description": "带标题的提示框，子元素放在标题下面",
  "container": true,
  "props": {
    "title": { "type": "inline", "required": true, "description": "提示框标题" },
    "tone": { "type": "string", "default": "#1a73e8", "description": "标题颜色" }
  },
  "template": {
    "root": "box",
    "elements": {
      "box": { "type": "Document", "children": ["head", "$children"] },
      "head": {
        "type": "Text",
        "props": { "text": "{{title}}" },
        "style": { "bold": true, "color": "{{tone}}", "background": "#F5F7FA", "padding": 6 }
      }
    }
  }
}
```

用的时候：

```json
"tip": { "type": "Callout", "props": { "title": "提示" }, "children": ["tip-body"] },
"tip-body": { "type": "Text", "props": { "text": "组件定义放在文档旁边的 catalog/ 目录里。" } }
```

## 定义文件的字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `name` | 字符串 | 是 | 组件名。大写字母开头，只能用字母、数字、`_`，不能和内置组件重名 |
| `description` | 字符串 | 否 | 说明，`fmtagno catalog` 会显示 |
| `container` | 布尔 | 否 | 能不能放子元素，默认 `false` |
| `props` | 对象 | 否 | 参数定义，键是参数名 |
| `template` | 对象 | 是 | 模板：`root` 是根元素 id，`elements` 和文档的 `elements` 写法一样 |

每个参数：

| 字段 | 说明 |
|---|---|
| `type` | `string`（默认）、`number`、`integer`、`boolean`、`array`、`object`、`inline`（字符串或 runs）、`any` |
| `required` | 必填，默认 `false` |
| `default` | 默认值，类型要和 `type` 对得上 |
| `description` | 说明，会写进 `catalog --json` 的 schema |

## 模板规则

- **整个替换**：字符串正好是 `"{{title}}"` 时，整个换成参数的值。数组、对象也行，比如 runs、表格的 `rows`。
- **文字替换**：夹在文字里时按文字替换，比如 `"第 {{n}} 章：{{title}}"`。这时参数只能是字符串、数字或布尔。
- 没给值、也没默认值的可选参数，换成空。
- 模板里引用了没定义的参数，报错。
- **插槽**：容器组件要在模板某个元素的 `children` 里写一次 `"$children"`，实例的子元素放到那里。不是容器就不能写。
- 模板元素的 id 不能带点号。
- 模板里可以用别的自定义组件，最多套 32 层，超过就当成环报错。

## 展开后的 id

- 实例的 id 留给模板的根元素。上面的例子里，`tip` 展开后就是那个 `Document`。
- 模板里其他元素的 id 变成 `实例id.模板id`，比如 `tip.head`。报错信息里会看到这种 id。

## 校验

这些都会报错：

- 少写必填参数。
- 写了没定义的参数。
- 参数类型不对。
- 不是容器却写了 `children`。
- 组件定义了不止一次。

## 定义放在哪

三个地方，都能用：

1. 文档旁边的 `catalog/` 目录，自动读。
2. `--catalog` 指定的文件或目录，可以写多次。`render`、`check`、`catalog` 三个命令都认。
3. 文档里的 `components` 数组，适合一次传完整份文档（比如 AI 生成时）。

目录里只读 `.json` 文件，不进子目录。

```json
{
  "components": [
    {
      "name": "Signature",
      "description": "落款：右对齐的署名和日期",
      "props": { "who": { "type": "string", "required": true }, "date": { "type": "string" } },
      "template": {
        "root": "s",
        "elements": {
          "s": { "type": "Text", "props": { "text": "{{who}} {{date}}" }, "style": { "align": "right", "color": "#666666" } }
        }
      }
    }
  ]
}
```

`fmtagno catalog` 不读文档旁边的 `catalog/`，要看自定义组件就加 `--catalog`：

```sh
fmtagno catalog --catalog catalog/
fmtagno catalog --json --catalog catalog/
```

## 样式怎么叠

- 模板里写的 `style`、`parts` 是组件的默认外观。
- 它们排在通用组件样式**后面**。顶层 `styles` 里写 `"Text": {...}`，改不动 Callout 里的标题。
- 要改组件里面，用指名的键：

  | 键 | 管什么 |
  |---|---|
  | `Callout` | 展开后的根元素 |
  | `Callout:head` | 模板里 id 为 `head` 的元素 |
  | `PriceTable:t.header` | 模板元素 `t` 的部位 `header` |

- 实例上写的 `style`、`parts` 优先级最高。

叠加的完整顺序见[样式](/guide/styles/)。

## 完整例子

```json title="custom.json"
{
  "version": "0.1",
  "meta": { "title": "自定义组件示例", "lang": "zh-CN" },
  "components": [
    {
      "name": "Chapter",
      "description": "章节标题加一段导语",
      "props": {
        "n": { "type": "integer", "required": true },
        "title": { "type": "string", "required": true },
        "lead": { "type": "inline", "default": "" }
      },
      "template": {
        "root": "h",
        "elements": {
          "h": { "type": "Document", "children": ["title", "lead"] },
          "title": { "type": "Heading", "props": { "level": 2, "text": "第 {{n}} 章：{{title}}" } },
          "lead": { "type": "Text", "props": { "text": "{{lead}}" }, "style": { "color": "#666666" } }
        }
      }
    },
    {
      "name": "Callout",
      "description": "带标题的提示框",
      "container": true,
      "props": {
        "title": { "type": "inline", "required": true },
        "tone": { "type": "string", "default": "#1a73e8" }
      },
      "template": {
        "root": "box",
        "elements": {
          "box": { "type": "Document", "children": ["head", "$children"] },
          "head": { "type": "Text", "props": { "text": "{{title}}" }, "style": { "bold": true, "color": "{{tone}}", "background": "#F5F7FA", "padding": 6 } }
        }
      }
    }
  ],
  "styles": {
    "Callout:head": { "fontSize": 12 }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["ch1", "tip"] },
    "ch1": { "type": "Chapter", "props": { "n": 1, "title": "为什么要自定义组件", "lead": ["把常用的排版", { "text": "组合起来", "bold": true }, "，JSON 里一行引用。"] } },
    "tip": { "type": "Callout", "props": { "title": "提示", "tone": "#CF222E" }, "children": ["tip-body"] },
    "tip-body": { "type": "Text", "props": { "text": "定义可以放在 catalog/ 目录，也可以像这样直接写进文档。" } }
  }
}
```
