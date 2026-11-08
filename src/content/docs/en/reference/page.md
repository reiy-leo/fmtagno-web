---
title: Page setup
description: Fields of meta.page and Section — paper, orientation, margins, gutter, columns, headers and footers, page-number start — with per-format support.
sidebar:
  order: 9
---

`meta.page` is the first section's setup. Each later `Section` uses the same fields in its props and changes the previous section's settings. Usage: [Sections, headers and footers](/en/guide/sections/).

Legend: ✓ supported.

| Field | Value | Default | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|---|---|
| `size` | paper name or `{ width, height }` | `"A4"` | `"Letter"` | Paper | ✓ | ✓ | ✓ |
| `landscape` | boolean | `false` | `true` | Landscape | ✓ | ✓ | ✓ |
| `margin` | length | `"20mm"` | `"25mm"` | All four margins | ✓ | ✓ | ✓ |
| `marginTop` `marginRight` `marginBottom` `marginLeft` | length | same as `margin` | `"30mm"` | One margin | ✓ | ✓ | ✓ |
| `gutter` | length | 0 | `"10mm"` | Binding gutter, added to the left margin | ✓ | ✓ | ✓ |
| `columns` | number or `{ count, gap }` | 1 | `{ "count": 2, "gap": "8mm" }` | Columns; `gap` defaults to 21pt | ✓ | ✓ | ✓ |
| `headerDistance` | length | `"0.5in"` | `"12mm"` | Header distance from the top edge | ✓ | ✓ | ✓ with `--paged` |
| `footerDistance` | length | `"0.5in"` | `"12mm"` | Footer distance from the bottom edge | ✓ | ✓ | ✓ with `--paged` |
| `header` | element id, or `{ default, first, even }` | none | `"hdr"` | Header | ✓ | ✓ | ✓ with `--paged` |
| `footer` | same | none | `"ftr"` | Footer | ✓ | ✓ | ✓ with `--paged` |
| `pageNumberStart` | integer | continues | `1` | First page number | ✓ | ✓ | ✓ with `--paged` |

- Vertical alignment of page content (Word's `vAlign`) is not implemented; `verticalAlign` here is currently an error.
- Paper names: `A3` `A4` `A5` `B5` `Letter` `Legal`, case-insensitive. Unknown names fall back to A4 with a warning.
- Page settings take absolute lengths only (pt mm cm in px).
- Without `--paged`, html only uses paper and margins when printing (`@page`).
- html printing uses the first section's paper.

## Section-only forms

- `"header": null` / `"footer": null`: clear every header or footer inherited from the previous section.
- `null` for one kind inside the object: that kind is empty. Leaving a key out: carry over.

## Page number fields

In runs, `{ "field": "page" }`, `{ "field": "pages" }` and `{ "field": "sectionPages" }` show the current page, total pages and pages in the section. See [Sections, headers and footers](/en/guide/sections/).
