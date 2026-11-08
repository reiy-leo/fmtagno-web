---
title: Sections, headers and footers
description: Set paper and margins in meta.page, split the document with Section, use first-page and odd/even headers and footers, and insert page numbers, total pages and section pages in runs.
sidebar:
  order: 6
---

Paper settings go in `meta.page`, which is the first section's setup. To change paper, orientation or headers and footers midway, put `Section` elements under the root.

## Paper: meta.page

```json
"meta": {
  "page": {
    "size": "A4",
    "margin": "25mm",
    "headerDistance": "12mm",
    "footerDistance": "12mm",
    "header": "hdr",
    "footer": "ftr"
  }
}
```

All fields are in [Page setup](/en/reference/page/). The common ones:

| Field | Example | Meaning |
|---|---|---|
| `size` | `"A4"`, `{ "width": "180mm", "height": "260mm" }` | Paper, default A4 |
| `landscape` | `true` | Landscape |
| `margin` | `"20mm"` | All four margins, default 20mm |
| `marginTop` etc. | `"30mm"` | One margin, overrides `margin` |
| `header` / `footer` | `"hdr"` | Element id used as header / footer |
| `pageNumberStart` | `1` | First page number |

## Sections: Section

```json
"elements": {
  "doc":   { "type": "Document", "children": ["cover", "body", "wide"] },
  "cover": { "type": "Section", "props": { "header": { "first": null }, "footer": { "first": null } }, "children": ["c-h"] },
  "body":  { "type": "Section", "props": { "pageNumberStart": 1 }, "children": ["b-h", "b-p"] },
  "wide":  { "type": "Section", "props": { "landscape": true, "columns": { "count": 2, "gap": "8mm" }, "header": null }, "children": ["w-p"] }
}
```

- Each section starts on a new page.
- `Section` can only sit directly under the root.
- Fields a section doesn't set carry over from the previous section, like Word's "Link to Previous".
- You don't need any `Section`; then the whole document is one section.
- Leading content outside any `Section` counts as the first section. But nothing outside a `Section` may follow a `Section`.

Section props:

| Prop | Type | Meaning |
|---|---|---|
| `size` | paper name or `{ width, height }` | Paper |
| `landscape` | boolean | Landscape |
| `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft` | length | Margins |
| `gutter` | length | Binding gutter, added to the left margin |
| `columns` | number or `{ count, gap }` | Columns; `gap` defaults to 21pt |
| `headerDistance` / `footerDistance` | length | Distance of header / footer from the paper edge, default 0.5in |
| `header` / `footer` | id, object or `null` | This section's header / footer; see below |
| `pageNumberStart` | integer | Restart page numbers at this value |

## Headers and footers

Header and footer content are ordinary elements in `elements`, referenced by id:

```json
"hdr": { "type": "Text", "props": { "text": "fmtagno example" }, "style": { "fontSize": 9, "align": "right", "borderBottom": "0.5pt solid #999999", "paddingBottom": 2 } },
"ftr": { "type": "Text", "props": { "text": ["Page ", { "field": "page" }, " of ", { "field": "pages" }] }, "style": { "fontSize": 9, "align": "center" } }
```

Ways to write `header` / `footer`:

| Form | Meaning |
|---|---|
| `"hdr"` | Use `hdr` on every page (sets `default` only) |
| `{ "default": "a", "first": "b", "even": "c" }` | Separate: normal pages, first page of the section, even pages |
| `{ "first": null }` | Empty first page; the rest carries over |
| `null` (on a Section) | Clear every header (or footer) inherited from the previous section |
| omitted | Carry over from the previous section |

Rules:

- Inside the object, `null` means "empty for this kind"; leaving a key out means "carry over".
- `first` and `even` carry over too. If the cover sets `"first": null`, later sections also get an empty first page until one sets `first` again.
- Setting `first` (even to `null`) turns on "different first page" for that section. Header and footer share this switch: if only the header sets `first`, the first-page footer uses `default`.
- If any section sets `even`, the whole document turns on "different odd and even pages". Sections without `even` use `default` on even pages.
- Header and footer elements can't also appear in the body, and can't contain `PageBreak`, `Section` or `Slide`.
- They inherit the root (`Document`) style.
- Images work in headers and footers too; see [Images](/en/guide/images/).

## Page numbers

Write `field` in a run:

| Form | Shows |
|---|---|
| `{ "field": "page" }` | Current page number |
| `{ "field": "pages" }` | Total pages |
| `{ "field": "sectionPages" }` | Pages in this section |

```json
{ "text": "1", "field": "page", "bold": true }
```

- Text styles work.
- `text` is optional. If given, it is a placeholder shown before Word updates fields, or in html without paging.
- Numbering follows Word's rules: each section continues from the previous one; `pageNumberStart` restarts it.
- Odd and even pages go by page number, not physical page count.

## Complete example

```json title="sections.json"
{
  "version": "0.1",
  "meta": {
    "title": "Sections example",
    "lang": "en",
    "page": { "size": "A4", "margin": "25mm", "headerDistance": "12mm", "footerDistance": "12mm", "header": "hdr-doc", "footer": "ftr" }
  },
  "root": "d",
  "elements": {
    "d": { "type": "Document", "children": ["cover", "body", "wide"] },
    "cover": { "type": "Section", "props": { "header": { "first": null }, "footer": { "first": null } }, "children": ["c-h", "c-t"] },
    "c-h": { "type": "Heading", "props": { "level": 1, "text": "Sections example" } },
    "c-t": { "type": "Text", "props": { "text": "The cover has no header or footer." } },
    "body": {
      "type": "Section",
      "props": { "pageNumberStart": 1, "header": { "default": "hdr-odd", "even": "hdr-even" }, "footer": { "first": "ftr" } },
      "children": ["b-h", "b-t", "b-pb", "b-t2"]
    },
    "b-h": { "type": "Heading", "props": { "level": 1, "text": "Chapter 1" } },
    "b-t": { "type": "Text", "props": { "text": "Page numbers restart at 1 and odd and even pages have different headers. The first page keeps the cover's empty first-page header; the footer sets first again, so it shows." } },
    "b-pb": { "type": "PageBreak" },
    "b-t2": { "type": "Text", "props": { "text": "This is page 2, with the even-page header." } },
    "wide": {
      "type": "Section",
      "props": { "landscape": true, "margin": "15mm", "columns": { "count": 2, "gap": "8mm" }, "header": null },
      "children": ["w-h", "w-t"]
    },
    "w-h": { "type": "Heading", "props": { "level": 2, "text": "Landscape, two columns" } },
    "w-t": { "type": "Text", "props": { "text": "This section is landscape with two columns and no header; the footer carries over." } },
    "hdr-doc": { "type": "Text", "props": { "text": "Sections example" }, "style": { "fontSize": 9, "color": "#666666", "align": "right" } },
    "hdr-odd": { "type": "Text", "props": { "text": "Chapter 1" }, "style": { "fontSize": 9, "color": "#666666", "align": "right", "borderBottom": "0.5pt solid #999999", "paddingBottom": 2 } },
    "hdr-even": { "type": "Text", "props": { "text": "Sections example" }, "style": { "fontSize": 9, "color": "#666666", "align": "left", "borderBottom": "0.5pt solid #999999", "paddingBottom": 2 } },
    "ftr": {
      "type": "Text",
      "props": { "text": ["Page ", { "text": "1", "field": "page", "bold": true }, " · section has ", { "field": "sectionPages" }, " · ", { "field": "pages" }, " total"] },
      "style": { "fontSize": 9, "color": "#666666", "align": "center" }
    }
  }
}
```

## Format differences

| | docx | pdf | html |
|---|---|---|---|
| Per-section paper and orientation | ✓ | ✓ | ✓ on screen with `--paged`; printing uses the first section's paper |
| Columns | ✓ | ✓ | ✓ |
| Headers and footers | ✓ | ✓ | only with `--paged` |
| Page numbers | Word fields, computed when opened | computed after layout | filled in with `--paged`; otherwise shows `text` |

- docx: each section ends with an extra empty paragraph that carries the section settings — Word does the same. LibreOffice doesn't support the section-pages field and shows `text`.
- html: when printing mixed portrait/landscape documents, landscape pages get cut off. Use pdf for printing.
