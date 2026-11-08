---
title: Built-in components
description: fmtagno's ten built-in components — Document, Heading, Text, Code, List, Table, Image, PageBreak, Section, Slide — plus InlineCode for runs.
sidebar:
  order: 2
---

There are ten built-in components, plus `InlineCode`, which only lives inside runs. To see the full props definitions:

```sh
fmtagno catalog          # list components
fmtagno catalog --json   # JSON Schema of every component's props
```

| Component | Purpose | Container | Parts |
|---|---|---|---|
| [Document](#document) | Root container; also for grouping | yes | — |
| [Heading](#heading) | Heading, levels 1–6 | no | — |
| [Text](#text) | A paragraph | no | — |
| [Code](#code) | A code block | no | — |
| [List](#list) | List, can nest | no | `level1`…`level9` `marker` `item` |
| [Table](#table) | Table | no | see [Tables](/en/guide/tables/) |
| [Image](#image) | Image | no | `caption` |
| [PageBreak](#pagebreak) | Page break | no | — |
| [Section](#section) | Section | yes | — |
| [Slide](#slide) | One slide | yes | `title` `body` |

Each component's built-in default style is listed below. To change it, see [Styles](/en/guide/styles/).

## Document

The root container; lays out its children in order. No props.

```json
"doc": { "type": "Document", "children": ["title", "intro"] }
```

`Document` can be nested: put a few paragraphs in one, style it, and text fields flow down to each child. Custom component templates often use it as their root.

## Heading

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `level` | integer 1–6 | yes | Heading level |
| `text` | string or runs | yes | Heading text |

```json
"title": { "type": "Heading", "props": { "level": 1, "text": "Quarterly report" } }
```

- Defaults: bold, `keepWithNext`, 12pt before, 6pt after, line height 1.25. Sizes: level 1 20pt (18pt before), 2 16pt, 3 14pt, 4 12pt, 5 and 6 11pt.
- Style a single level with the component keys `Heading.1` … `Heading.6`.
- In docx, headings also get Word's "Heading 1–6" styles, so the navigation pane and TOC work.

## Text

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `text` | string or runs | yes | Paragraph text; runs are explained in [Document structure](/en/guide/document/) |

```json
"intro": { "type": "Text", "props": { "text": ["Run ", { "type": "InlineCode", "text": "fmtagno check" }, " to validate."] } }
```

- Default: 6pt after.
- An empty string `""` still takes up one line, in all three formats.

## InlineCode

Inline code. Not an element on its own; it only appears in runs:

```json
{ "type": "InlineCode", "text": "fmtagno render doc.json -o out.pdf" }
```

Default: monospace (Menlo, Consolas, DejaVu Sans Mono) on `#F0F1F3`. Change it with the `InlineCode` component style.

## Code

A code block; spaces and line breaks are kept.

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `code` | string | yes | The code; use `\n` for new lines |
| `language` | string | no | Language name. Only a label: html writes `class="language-xxx"`; no syntax highlighting |
| `lineNumbers` | boolean | no | Show line numbers, default `false` |

```json
"sample": {
  "type": "Code",
  "props": { "language": "json", "code": "{\n  \"type\": \"Text\"\n}", "lineNumbers": true }
}
```

Defaults: monospace, 9pt, line height 1.4, background `#F6F8FA`, padding 8pt, 8pt after, `keepTogether`.

docx paragraphs only use `padding` when they have a border, so code blocks get no padding in docx and you'll see one warning. For padding, add a border in the background color.

## List

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `items` | array | yes | List items |
| `ordered` | boolean | no | Numbered, default `false` |

Each item can be:

- a string: `"Write JSON"`
- a runs array: `[{ "text": "fmtagno render", "type": "InlineCode" }, " to get files"]`
- an object with a sub-list: `{ "text": …, "items": [...], "ordered": true }`. Without `ordered` it follows the parent level.

```json
"list": {
  "type": "List",
  "props": {
    "ordered": true,
    "items": [
      "Prepare data",
      { "text": "Pick a style set", "items": ["report", "slides"] },
      "Render"
    ]
  },
  "style": { "listStyleType": "upper-roman", "listMarkerFormat": "%1." },
  "parts": { "level2": { "listStyleType": "decimal", "listMarkerFormat": "%1.%2" } }
}
```

- Defaults: 6pt after, `listIndent` 2em, `listHanging` 2em.
- Without a type, levels rotate: ordered `decimal` → `lower-alpha` → `lower-roman`; unordered `disc` → `circle` → `square`.
- Parts: `level1`…`level9` for a level, `marker` for the number or bullet, `item` for each item's text.
- Numbering and indent fields: [List style](/en/reference/list-style/).

## Table

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `columns` | array of cells | no | Header row; if present it is the first row |
| `rows` | 2-D array of cells | yes | Data rows |
| `widths` | array | no | Column widths: ratio, fixed length or `"auto"` |
| `rowHeights` | array | no | Row heights |
| `look` | object | no | Which parts are active |

```json
"price": {
  "type": "Table",
  "props": {
    "columns": ["Item", "Price"],
    "widths": [3, 1],
    "rows": [["Apple", "3.50"], ["Pear", "4.00"]]
  },
  "parts": { "header": { "background": "#1A73E8", "color": "#FFFFFF" } }
}
```

Defaults: `0.5pt solid #999999` borders, `cellPadding` 4pt, `repeatHeader` on, 8pt after; header bold on `#F3F3F3`.

Merged cells, per-cell styles, row heights and parts are in [Tables](/en/guide/tables/).

## Image

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `src` | string | yes | Local path or URL. Relative paths resolve from the document's directory |
| `alt` | string | no | Alt text, shown when the image can't be embedded |
| `width` | number (pt) | no | Width |
| `height` | number (pt) | no | Height. Give one and the other keeps the aspect ratio |
| `caption` | string | no | Caption shown below the image |

```json
"logo": { "type": "Image", "props": { "src": "logo.png", "alt": "fmtagno", "width": 90, "caption": "Figure 1. Logo" } }
```

Defaults: 6pt after; caption 9pt `#666666` (part `caption`). Format support and positioning: [Images](/en/guide/images/).

## PageBreak

Starts a new page. No props.

```json
"break": { "type": "PageBreak" }
```

Plain html shows no page breaks; they appear when printing or with `--paged`.

## Section

A section. Each one starts on a new page and can set its own paper size, orientation, margins, columns, headers and footers, and page-number start. Sections can only sit directly under the root.

```json
"body": {
  "type": "Section",
  "props": { "landscape": true, "pageNumberStart": 1, "footer": "ftr" },
  "children": ["h1", "p1"]
}
```

Props and usage: [Sections, headers and footers](/en/guide/sections/).

## Slide

One 16:9 slide; children are laid out inside.

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `title` | string | no | Slide title |

```json
"cover": { "type": "Slide", "props": { "title": "Cover" }, "children": ["cover-text"] }
```

- Parts: `title` (default 20pt bold) and `body`.
- In html and pdf each slide takes one page.
- In docx a slide becomes a level-2 heading plus its content, followed by a page break; the `body` part has no effect there.
- Real pptx output comes in version 2.

## Next

- [Styles](/en/guide/styles/): where styles go and how they combine.
- [Tables](/en/guide/tables/), [Images](/en/guide/images/), [Sections, headers and footers](/en/guide/sections/).
