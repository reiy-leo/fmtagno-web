---
title: Style sets
description: Package a whole look as a style set, pick it per document, or keep it in a separate file shared by many documents; supports extends and $variables.
sidebar:
  order: 4
---

A style set is a complete look: global style, component styles and named styles together. Switch the style set and the same document gets a different look; the content stays untouched.

## Inline in the document

```json
{
  "styleSet": "formal",
  "styleSets": {
    "formal": {
      "global": {
        "fontFamily": { "latin": "Times New Roman", "eastAsia": "SimSun" },
        "fontSize": 12,
        "lineHeight": 1.5
      },
      "components": {
        "Heading": { "fontFamily": { "eastAsia": "SimHei" }, "bold": true },
        "Heading.1": { "fontSize": 22, "align": "center" },
        "Text": { "textIndent": "2em" },
        "Table.header": { "background": "#F2F2F2", "bold": true },
        "List.level2": { "listStyleType": "circle" }
      },
      "styles": { "muted": { "color": "#666666" } }
    },
    "modern": {
      "extends": "formal",
      "global": { "fontFamily": { "latin": "Inter", "eastAsia": "Source Han Sans SC" }, "fontSize": 11 }
    }
  }
}
```

| Field | Where | Meaning |
|---|---|---|
| `styleSet` | document top level | Which style set to use. `--style-set` on the command line overrides it |
| `styleSets` | document top level | Style set definitions, keyed by name |
| `global` | in a set | Global style, inherited by every element |
| `components` | in a set | Component styles; keys are component names or `Component.part`, same as the keys in [Styles](/en/guide/styles/) |
| `styles` | in a set | Named styles belonging to this set |
| `extends` | in a set | Build on another style set |
| `name` | in a set | Set name. Required in a separate file |

Rules:

- `global` only accepts inherited fields (text, paragraph, list). `border`, `background` and the like are errors there — they shouldn't spread to every element.
- `extends` is single inheritance. The parent is applied first, then the child. Cycles are errors.
- With no `styleSet` and no `--style-set`, no style set is used.
- Choosing a set that doesn't exist is an error that lists the available ones.

## Top-level styles vs. style sets

The top-level `styles` belong to no style set and apply whichever set is chosen.

- Component styles: top-level `styles` are applied **after** the style set's component styles, so the document's own styles win.
- Named styles: looked up in the current set's `styles` first, then in the top-level `styles`.

## In a separate file

Write a house style as its own JSON file and share it. The file needs a `name`:

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

fmtagno reads style set files from:

1. a `styles/` directory next to the document, automatically;
2. files or directories given with `--style-sets` (repeatable).

Only `.json` files are read, not subdirectories. Defining the same set name twice is an error. When a file and the document's `styleSets` define the same name, **the document wins**.

```sh
fmtagno render report.json -o report.pdf --style-sets ~/templates/ --style-set formal
```

`--style-set` overrides the document's `styleSet`.

## Variables

Keys in `global` that start with `$` are variables, not style fields. Use them as `${name}`:

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

- Variables work in: the set's `global`, `components` and `styles`; the top-level `styles`; an element's `style`, `parts` and per-cell `style`; and component `props` (a run's `color`, custom component parameters, …).
- When the whole value is `${x}`, it is replaced by the variable's original value — numbers and objects included.
- Inside other text it is spliced in as text, so the variable must be a string or number: `"1pt solid ${brand}"`.
- Variables can reference other variables. Cycles and undefined names are errors.
- A child set (`extends`) can use its parent's variables; on a name clash the child wins.
- Write `$${` for a literal `${`.
- Names may only use letters, digits, `_` and `-`.
- **No style set, no variables**: `${x}` then fails with "variable not defined".

## Styling inside custom components

A style set can target a specific custom component:

```json
"components": {
  "PriceTable": { "fontSize": 10 },
  "PriceTable:t": { "border": "0.5pt solid #333333" },
  "PriceTable:t.header": { "background": "#333333" }
}
```

- `PriceTable`: the component's root element after expansion.
- `PriceTable:t`: the template element with id `t`.
- `PriceTable:t.header`: add a part name.

Styles written in a component's template rank after generic component styles, so a plain `Table` style can't override them. Use the named keys above.

## Complete example

```json title="style-set.json"
{
  "version": "0.1",
  "meta": { "title": "Style set example", "lang": "en", "page": { "size": "A4", "margin": "20mm" } },
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
        "Heading": { "fontFamily": { "latin": "Liberation Sans, Arial" }, "color": "#1F2328" },
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
    "title": { "type": "Heading", "props": { "level": 1, "text": "Style set example" } },
    "intro": { "type": "Text", "props": { "text": ["This document uses the ", { "type": "InlineCode", "text": "report" }, " style set: serif body with a first-line indent, sans-serif headings."] } },
    "h-table": { "type": "Heading", "props": { "level": 2, "text": "Table" } },
    "table": {
      "type": "Table",
      "props": { "columns": ["Item", "Price"], "widths": [3, 1], "rows": [["Apple", "3.50"], ["Pear", "4.00"], ["Peach", "5.00"]] },
      "style": { "border": "0.5pt solid ${border}" }
    },
    "tip": { "type": "Text", "props": { "text": "This callout uses the set's named style note." }, "style": "note" }
  }
}
```

Try another look:

```sh
fmtagno render style-set.json -o a.pdf
fmtagno render style-set.json -o b.pdf --style-sets my-themes/ --style-set dark
```
