---
title: Tables
description: Writing fmtagno tables — header and rows, column widths (ratio, fixed, auto), merged cells, row heights, per-cell styles, part styles and the look switches.
sidebar:
  order: 5
---

Tables use the `Table` component. `columns` is the header, `rows` are the data rows, and each cell is a string, runs, or an object with merges and style.

```json
"price": {
  "type": "Table",
  "props": {
    "columns": ["Item", "Qty", "Price"],
    "rows": [["Apple", "2", "3.50"], ["Pear", "1", "4.00"]]
  }
}
```

## Props

| Prop | Type | Meaning |
|---|---|---|
| `columns` | array of cells | Header, optional. If present it is the first row (`firstRow`, `header`) |
| `rows` | 2-D array of cells | Data rows, required |
| `widths` | array | One width per column |
| `rowHeights` | array | One height per row. With a header, the header is the first entry |
| `look` | object | Which parts are active |

## Cells

Three forms:

```json
"Apple"
["Apple ", { "text": "new", "color": "#CF222E" }]
{ "text": "Results", "rowSpan": 2, "colSpan": 3, "style": { "align": "center" } }
```

Cell object fields:

| Field | Type | Meaning |
|---|---|---|
| `text` | string or runs | The text. Also accepted as `runs` |
| `rowSpan` | integer | Rows to merge downward, including this one. Default 1 |
| `colSpan` | integer | Columns to merge rightward, including this one. Default 1 |
| `style` | string / array / object | Style for this cell only, applied after part styles |

## Column widths

`widths` takes one value per column; the three forms can be mixed:

| Form | Example | Meaning |
|---|---|---|
| number | `3` | Ratio. After fixed and auto columns take their space, the rest is shared by ratio |
| string with a unit | `"20mm"` `"5.65pt"` | Fixed width. Units pt mm cm in px; no unit means pt |
| `"auto"` | `"auto"` | Grows to fit the text |

- If any column is a ratio, the table fills the text width (or the `width` in its style).
- If all columns are fixed or auto, the table is as wide as its columns add up to.
- Without `widths`, columns share the width equally. A count that doesn't match the columns also falls back to equal widths, with a warning.
- When ratio and auto columns are mixed, an auto column takes its text width, capped at one ratio share; longer text wraps. All three formats get the same widths. (Next release; in v0.1.0-alpha.2 PDF squeezes the auto column.)
- With only fixed and auto columns and no `tableLayout`, all three formats use auto layout.

Example: a section title bar with a thin color strip on the left and a cell that grows with the title:

```json
"widths": ["5.65pt", "auto"]
```

docx estimates auto columns from the character count; Word re-lays them out when it opens the file.

## Merged cells

Same rule as HTML: **each row lists only the cells that start in that row**. Positions covered by a `rowSpan` from above are skipped.

```json
"rows": [
  [{ "text": "Fruit", "rowSpan": 2 }, "Apple", "3.50"],
  ["Pear", "4.00"],
  [{ "text": "Total", "colSpan": 2 }, "7.50"]
]
```

The second row has only two cells because "Fruit" occupies the first column.

- Borders of a merged cell are taken from the block: top from its first row, bottom from its last.
- Rows with the wrong number of cells are padded to the widest row, with a warning.
- When two cells overlap, the one written first wins.

## Row heights

`rowHeights` takes one value per row:

| Form | Example | Meaning |
|---|---|---|
| length | `"28pt"`, `20` | Minimum height; more content makes it taller |
| object | `{ "height": "51pt", "rule": "exact" }` | Fixed height; extra content is clipped. `rule` is `atLeast` (default) or `exact` |
| `null` | `null` | No height for this row |

Only absolute lengths (pt mm cm in px). In pdf, a minimum height only applies to cells holding a single line of text.

## Parts

Tables can style parts separately, modelled on Word table styles:

| Part | Applies to |
|---|---|
| `table` | The whole table |
| `cell` | Every cell |
| `header` | The header row (`columns`) |
| `firstRow` / `lastRow` | First / last row (e.g. a total row) |
| `firstColumn` / `lastColumn` | First / last column |
| `oddRow` / `evenRow` | Odd / even rows, not counting header, first or last row |
| `oddColumn` / `evenColumn` | Odd / even columns, not counting first or last column |
| `topLeftCell` `topRightCell` `bottomLeftCell` `bottomRightCell` | Corner cells |

When a cell falls into several parts, they are applied in this order; later wins:

`table` → `cell` → odd/even columns → odd/even rows → first/last column → first/last row (`header` right after `firstRow`) → corners → per-cell `style`

Part styles can be written in three places: the element's `parts`, `Table.part` in the top-level `styles`, or a style set's `components`.

```json
"parts": {
  "header": { "background": "#1A73E8", "color": "#FFFFFF" },
  "evenRow": { "background": "#F5F7FA" },
  "lastRow": { "bold": true, "borderTop": "1.5pt double #333333" },
  "lastColumn": { "align": "right" }
}
```

Parts accept `padding`, `paddingLeft` and friends, affecting only the cells in that part; unset sides keep `cellPadding`. `verticalAlign` (`top` `middle` `bottom`) and `textRotation` on a part control text position and direction inside the cells.

## look: which parts are active

| Field | Default | Meaning |
|---|---|---|
| `firstRow` | `true` | First-row style. Always on when there is a header |
| `lastRow` | `false` | Last-row style |
| `firstColumn` | `true` | First-column style |
| `lastColumn` | `false` | Last-column style |
| `bandedRows` | `true` | Odd/even row styles |
| `bandedColumns` | `false` | Odd/even column styles |

```json
"look": { "lastRow": true, "lastColumn": true }
```

To use `lastRow`, `lastColumn`, `oddColumn` or `evenColumn`, switch them on in `look` first.

## Table style fields

Written in the table element's `style`:

| Field | Example | Meaning |
|---|---|---|
| `border` | `"0.5pt solid #999999"` | Outer border and inner lines |
| `borderTop` etc. | `"2pt solid #333333"` | One side of the outer border |
| `borderInsideH` / `borderInsideV` | `"none"` | Inner horizontal / vertical lines; default to `border` |
| `cellPadding` | `4` | Cell padding |
| `repeatHeader` | `true` | Repeat the header on each page; on by default |
| `rowBreak` | `false` | Whether a row may split across pages |
| `bandSize` | `2` | Rows per band, default 1 |
| `tableLayout` | `"fixed"` | Fixed or content-based column widths |
| `width` | `"80%"` | Table width |

Details and format support: [Table style](/en/reference/table-style/).

## Complete example

```json title="table.json"
{
  "version": "0.1",
  "meta": { "title": "Table example", "lang": "en" },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "t"] },
    "title": { "type": "Heading", "props": { "level": 2, "text": "Quote" } },
    "t": {
      "type": "Table",
      "props": {
        "columns": ["Category", "Item", "Qty", "Amount"],
        "widths": ["24mm", 3, "auto", 1],
        "rowHeights": ["24pt"],
        "rows": [
          [{ "text": "Fruit", "rowSpan": 2, "style": { "verticalAlign": "middle" } }, "Apple", "2", "7.00"],
          ["Pear", "1", "4.00"],
          ["Veg", "Cabbage", "3", { "text": "6.00", "style": { "color": "#CF222E" } }],
          [{ "text": "Total", "colSpan": 3 }, "17.00"]
        ],
        "look": { "lastRow": true, "lastColumn": true }
      },
      "style": { "border": "0.5pt solid #D0D7DE", "borderInsideV": "none", "fontSize": 10, "cellPadding": 5 },
      "parts": {
        "header": { "background": "#1A73E8", "color": "#FFFFFF" },
        "evenRow": { "background": "#F5F7FA" },
        "lastRow": { "bold": true, "borderTop": "1.5pt double #333333" },
        "lastColumn": { "align": "right" }
      }
    }
  }
}
```

## Format differences

| Feature | docx | pdf | html |
|---|---|---|---|
| Merged cells | ✓ | ✓ | ✓ |
| Auto column width | ✓ (Word re-lays out on open) | ✓ | ✓ |
| Minimum row height | ✓ | single-line cells only | ✓ |
| Fixed row height | ✓ | ✓ | treated as a minimum; content can grow it |
| Repeated header | ✓ | ✓ | when printing or with `--paged` |
| `rowBreak: false` | ✓ | ✗ | ✓ |
| `tableLayout` | ✓ | ✗ (follows `widths`) | ✓ |
| Part styles | written cell by cell as direct formatting | ✓ | ✓ |

docx can't produce real Word table styles yet, so part styles are written into each cell. Word merges two tables that touch, so fmtagno puts a very short empty paragraph after each table, using the table's `spaceAfter` as the gap.
