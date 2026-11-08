---
title: 快速上手
description: 写一份最小的 fmtagno JSON，校验，再渲染成 docx、pdf、html。
sidebar:
  order: 2
---

五分钟跑通：写 JSON → `check` → `render`。

## 1. 写一份 JSON

新建 `report.json`：

```json title="report.json"
{
  "version": "0.1",
  "meta": { "title": "季度报告", "lang": "zh-CN", "page": { "size": "A4", "margin": "20mm" } },
  "styles": {
    "muted": { "color": "#666666", "fontSize": 10 }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "intro", "items", "price"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "季度报告" } },
    "intro": { "type": "Text", "props": { "text": "一份 JSON，出三种格式。" }, "style": "muted" },
    "items": { "type": "List", "props": { "ordered": false, "items": ["docx", "pdf", "html"] } },
    "price": {
      "type": "Table",
      "props": {
        "columns": ["格式", "状态"],
        "rows": [["docx", "第一版"], ["pdf", "第一版"], ["html", "第一版"]]
      }
    }
  }
}
```

读法：

- `elements` 里平铺所有元素，键是元素 id。
- `root` 指向根元素 `doc`。
- `doc` 是 `Document`，用 `children` 按顺序列出要显示的元素。
- 每个元素用 `type` 说明是什么组件，用 `props` 给内容，用 `style` 改外观。
- `muted` 是一个命名样式，写在顶层 `styles` 里，`intro` 用名字引用它。

## 2. 校验

```sh
fmtagno check report.json
# ok：展开后 5 个元素
```

写错了会直接告诉你哪个元素、哪个字段。比如把 `level` 写成 `7`：

```text
Error: report.json 校验没通过

Caused by:
    0: 在 `doc` 的子元素里
    1: 元素 `title`（Heading）的 props 不对
    2: level 要在 1 到 6 之间，现在是 7
```

字段名拼错、多写了没有的字段，也都会报错。fmtagno 不会悄悄忽略你写的东西。

## 3. 渲染

按输出文件的扩展名选格式：

```sh
fmtagno render report.json -o report.docx
fmtagno render report.json -o report.pdf
fmtagno render report.json -o report.html
```

想在浏览器里一页页看（像 Google Docs 那样），加 `--paged`：

```sh
fmtagno render report.json -o report.html --paged
```

某个格式表达不了的样式会打一条警告，文件照样生成：

```text
警告：docx 表达不了样式 `radius`（第一次出现在 `note`），已忽略
已生成 report.docx
```

## 4. 改一改

试试这几处，再渲染一次看效果：

- 给标题居中：在 `title` 上加 `"style": { "align": "center" }`。
- 表头换成蓝底白字：在 `price` 上加
  `"parts": { "header": { "background": "#1A73E8", "color": "#FFFFFF" } }`。
- 正文首行缩进两个字：在顶层 `styles` 里加 `"Text": { "textIndent": "2em" }`。键是组件名时，对这类组件全部生效。

## 下一步

- [文档结构](/guide/document/)：顶层每个字段、元素的写法、富文本 runs。
- [组件](/guide/components/)：每个内置组件的 props。
- [样式](/guide/styles/)：样式写在哪、怎么叠加。
