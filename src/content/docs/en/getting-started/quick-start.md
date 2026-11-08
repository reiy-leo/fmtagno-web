---
title: Quick start
description: Write a minimal fmtagno JSON document, validate it, and render it to docx, pdf and html.
sidebar:
  order: 2
---

Five minutes: write JSON → `check` → `render`.

## 1. Write a JSON file

Create `report.json`:

```json title="report.json"
{
  "version": "0.1",
  "meta": { "title": "Quarterly report", "lang": "en", "page": { "size": "A4", "margin": "20mm" } },
  "styles": {
    "muted": { "color": "#666666", "fontSize": 10 }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "intro", "items", "price"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "Quarterly report" } },
    "intro": { "type": "Text", "props": { "text": "One JSON file, three formats." }, "style": "muted" },
    "items": { "type": "List", "props": { "ordered": false, "items": ["docx", "pdf", "html"] } },
    "price": {
      "type": "Table",
      "props": {
        "columns": ["Format", "Status"],
        "rows": [["docx", "v1"], ["pdf", "v1"], ["html", "v1"]]
      }
    }
  }
}
```

How to read it:

- `elements` holds every element, flat. The keys are element ids.
- `root` points at the root element, `doc`.
- `doc` is a `Document`; its `children` list the elements to show, in order.
- Each element says which component it is with `type`, gives content in `props`, and changes its look with `style`.
- `muted` is a named style defined in the top-level `styles`; `intro` refers to it by name.

## 2. Validate

```sh
fmtagno check report.json
# ok：展开后 5 个元素
```

(Messages are in Chinese for now; this one means "ok: 5 elements after expansion".)

Mistakes are reported with the element and field. For example, with `level` set to `7`:

```text
Error: report.json 校验没通过

Caused by:
    0: 在 `doc` 的子元素里
    1: 元素 `title`（Heading）的 props 不对
    2: level 要在 1 到 6 之间，现在是 7
```

That reads: "in the children of `doc` → props of element `title` (Heading) are wrong → level must be 1 to 6, got 7". Misspelled or unknown fields are errors too. fmtagno never silently ignores what you wrote.

## 3. Render

The output extension picks the format:

```sh
fmtagno render report.json -o report.docx
fmtagno render report.json -o report.pdf
fmtagno render report.json -o report.html
```

To page through the HTML in a browser (like Google Docs), add `--paged`:

```sh
fmtagno render report.json -o report.html --paged
```

Styles a format can't express produce a warning, and the file is still written:

```text
警告：docx 表达不了样式 `radius`（第一次出现在 `note`），已忽略
已生成 report.docx
```

("Warning: docx can't express style `radius` (first seen in `note`), ignored. Wrote report.docx.")

## 4. Tweak it

Try these, then render again:

- Center the title: add `"style": { "align": "center" }` to `title`.
- Blue header with white text: add
  `"parts": { "header": { "background": "#1A73E8", "color": "#FFFFFF" } }` to `price`.
- Indent the first line of every paragraph: add `"Text": { "textIndent": "2em" }` to the top-level `styles`. A key that is a component name applies to every element of that component.

## Next

- [Document structure](/en/guide/document/): every top-level field, how elements work, rich-text runs.
- [Components](/en/guide/components/): props of each built-in component.
- [Styles](/en/guide/styles/): where styles go and how they combine.
