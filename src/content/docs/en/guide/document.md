---
title: Document structure
description: Top-level fields of an fmtagno JSON document, how elements work (children, props, style, parts), and rich text with runs.
sidebar:
  order: 1
---

An fmtagno document is one JSON object. All elements sit flat in `elements`, reference each other by id, and `root` points at the root element. The structure comes from [json-render](https://github.com/vercel-labs/json-render).

## Top-level fields

| Field | Type | Required | Meaning |
|---|---|---|---|
| `version` | string | no | Format version, currently `"0.1"`. Informational only |
| `meta` | object | no | Title, author, language, paper; see below |
| `root` | string | yes | Id of the root element |
| `elements` | object | yes | All elements, keyed by id |
| `styles` | object | no | Named styles and component styles; see [Styles](/en/guide/styles/) |
| `styleSet` | string | no | Which style set to use; see [Style sets](/en/guide/style-sets/) |
| `styleSets` | object | no | Style sets defined inline |
| `components` | array | no | Custom components defined inline; see [Custom components](/en/guide/custom-components/) |

Any other field is an error. This holds for every object: **misspelled fields are never silently ignored**.

## meta

| Field | Type | Example | Meaning |
|---|---|---|---|
| `title` | string | `"Quarterly report"` | Document title. html puts it in `<title>`, pdf in the file metadata |
| `author` | string | `"Rei"` | Author. html writes a `<meta>` tag, pdf puts it in the file metadata |
| `lang` | string | `"en"` | Document language (BCP 47). Defaults: html `zh-CN`, pdf `zh` |
| `page` | object | `{ "size": "A4" }` | Paper, margins, headers and footers; see [Page setup](/en/reference/page/) |

docx doesn't write `title`, `author` or `lang` yet.

## Elements

```json
"intro": {
  "type": "Text",
  "props": { "text": "One JSON file, three formats." },
  "style": "muted"
}
```

| Field | Type | Meaning |
|---|---|---|
| `type` | string | Component name. Built-ins are listed in [Components](/en/guide/components/); custom components work too |
| `props` | object | The component's parameters. Extra fields, missing required ones and wrong types are errors |
| `style` | string / array / object | This element's style; see below |
| `parts` | object | Part styles, keyed by part name, e.g. a table's `header` |
| `children` | array of strings | Child element ids, in order. Container components only |

Rules:

- Ids can be anything, as long as they are unique in `elements`.
- Each element can be referenced only once. To show the same text twice, write two elements.
- Reference cycles are errors.
- Elements nobody references are not rendered, and you get a warning.
- `root` doesn't have to be a `Document`; if it isn't, fmtagno wraps it in one.

There are three containers: `Document`, `Section` and `Slide`. `Document` can be nested to group elements.

## Three ways to write style

```json
"style": "muted"
"style": ["muted", "center"]
"style": ["muted", { "fontSize": 11 }]
"style": { "color": "#CF222E", "bold": true }
```

- A string is the name of a named style.
- An array is applied in order; later entries win. You can mix names and objects.
- An object holds style fields directly; see the Reference section for all fields.

Names are looked up in the current style set's `styles` first, then in the top-level `styles`. An unknown name is an error.

## parts: styling parts of a component

Some components have parts that can be styled separately.

```json
"parts": {
  "header": { "background": "#1A73E8", "color": "#FFFFFF" },
  "evenRow": { "background": "#F5F7FA" }
}
```

| Component | Parts |
|---|---|
| `Table` | `table` `cell` `header` `firstRow` `lastRow` `firstColumn` `lastColumn` `oddRow` `evenRow` `oddColumn` `evenColumn` `topLeftCell` `topRightCell` `bottomLeftCell` `bottomRightCell` |
| `List` | `level1` … `level9` `marker` `item` |
| `Image` | `caption` |
| `Slide` | `title` `body` |

Unknown parts are errors. Table parts are covered in [Tables](/en/guide/tables/).

## Text: a string or runs

Text props take two forms: Heading `text`, Text `text`, each List item, and each table cell.

A plain string:

```json
"text": "One JSON file, three formats."
```

An array of runs. Items can be plain strings or objects:

```json
"text": [
  "Text can use runs: ",
  { "text": "bold", "bold": true }, ", ",
  { "text": "red", "color": "#CF222E" }, ", ",
  { "text": "code", "type": "InlineCode" }, ", ",
  { "text": "a link", "href": "https://github.com/reiy-leo/fmtagno" }, "."
]
```

Run fields:

| Field | Type | Example | Meaning |
|---|---|---|---|
| `text` | string | `"bold"` | The text. `\n` is a line break |
| `bold` | boolean | `true` | Bold, shorthand |
| `italic` | boolean | `true` | Italic, shorthand |
| `underline` | boolean / line style | `"wavy"` | Underline, shorthand. Styles in [Text style](/en/reference/text-style/) |
| `color` | color | `"#CF222E"` | Text color, shorthand |
| `style` | string / array / object | `{ "verticalAlign": "super" }` | Full text style. Text fields only, plus `background` |
| `href` | string | `"https://…"` | Link. Blue (`#0563C1`) and underlined by default |
| `type` | `"InlineCode"` | | Inline code, styled by the `InlineCode` component style |
| `field` | `"page"` / `"pages"` / `"sectionPages"` | | Page number, total pages, pages in section; see [Sections, headers and footers](/en/guide/sections/) |
| `image` | string | `"logo.png"` | Inline image; `text` is not shown. See [Images](/en/guide/images/) |
| `width` / `height` | number (pt) | `40` | Inline image size. Give one and the other keeps the aspect ratio |

A run's style is built in this order: the paragraph's text style → `InlineCode` style for inline code → link defaults → shorthands like `bold` → the run's `style`.

:::note[Next release]
When text ends with `\n`, Word shows one more empty line at the end. From the next release pdf and html do the same, so all three match.
:::

## A complete example

```json title="structure.json"
{
  "version": "0.1",
  "meta": { "title": "Structure example", "author": "fmtagno", "lang": "en" },
  "styles": {
    "muted": { "color": "#666666" },
    "center": { "align": "center" }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "lead", "group"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "Structure example" }, "style": "center" },
    "lead": {
      "type": "Text",
      "props": { "text": ["Plain text, ", { "text": "bold", "bold": true }, ", ", { "text": "superscript", "style": { "verticalAlign": "super" } }, ".\nSecond line."] },
      "style": ["muted", { "fontSize": 11 }]
    },
    "group": { "type": "Document", "children": ["g1", "g2"], "style": { "color": "#1A73E8" } },
    "g1": { "type": "Text", "props": { "text": "A nested Document groups these two paragraphs," } },
    "g2": { "type": "Text", "props": { "text": "and both inherit the group's text color." } }
  }
}
```
