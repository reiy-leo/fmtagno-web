---
title: Paragraph style
description: fmtagno paragraph fields — alignment, spacing, line height, indents, pagination control and CJK typesetting switches — with per-format support.
sidebar:
  order: 4
---

Paragraph fields control how a whole paragraph is laid out. Fields marked ✓ under "Inherits" pass down to children.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

| Field | Value | Example | Meaning | Inherits | docx | pdf | html |
|---|---|---|---|---|---|---|---|
| `align` | `left` `center` `right` `justify` `distribute` | `"justify"` | Alignment. `distribute` spreads characters evenly | ✓ | ✓ | ✓ `distribute` treated as `justify`, with warning | ✓ |
| `spaceBefore` | length or `"Nline"` | `12`, `"0.5line"` | Space before | | ✓ | ✓ | ✓ |
| `spaceAfter` | same | `6` | Space after | | ✓ | ✓ | ✓ |
| `lineHeight` | multiple, length or `{ atLeast }` | `1.5`, `"20pt"` | Line height; see [Values](/en/reference/units/) | ✓ | ✓ | ✓ | ✓ minimum treated as exact |
| `marginLeft` | length | `"2em"` | Left indent of the whole paragraph | | ✓ | ✓ | ✓ |
| `marginRight` | length | `"2em"` | Right indent of the whole paragraph | | ✓ | ✓ | ✓ |
| `textIndent` | length | `"2em"` | First-line indent | ✓ | ✓ | ✓ | ✓ |
| `hangingIndent` | length | `"2em"` | Hanging indent: first line stays, the rest move in | ✓ | ✓ | ✓ | ✓ |
| `keepWithNext` | boolean | `true` | Keep on the same page as the next paragraph | | ✓ | ✓ | ✓ |
| `keepTogether` | boolean | `true` | Don't split this paragraph across pages | | ✓ | ✓ | ✓ |
| `pageBreakBefore` | boolean | `true` | Page break before | | ✓ | ✓ | ✓ |
| `widowControl` | boolean | `false` | Widow/orphan control | ✓ | ✓ | ✓ | ✓ |
| `autoSpace` | boolean | `true` | Auto spacing between CJK and Latin text or digits | ✓ | ✗ | ✓ | ✓ |
| `kinsoku` | boolean | `true` | CJK line-breaking rules | ✓ | ✗ | — on by default | ✓ |
| `direction` | `ltr` `rtl` | `"rtl"` | Text direction | ✓ | ✓ | ✓ | ✓ |
| `wrap` | boolean | `false` | Line wrapping; `false` means no wrapping | | ✗ | ✗ | ✓ |
| `outlineLevel` | 1–9 | `1` | Outline level for Word's navigation pane | | ✓ | — | — |
| `contextualSpacing` | boolean | `true` | No spacing between paragraphs of the same style | ✓ | ✗ | ✗ | ✗ |

:::note
`contextualSpacing` is accepted but not implemented in any format yet; it produces a warning.
:::

## Combining indents

- Use either `textIndent` or `hangingIndent`. If both are set, `hangingIndent` wins.
- Two-character first-line indent: `"textIndent": "2em"`.
- "First line flush, the rest indented" (numbered clauses, references): `"hangingIndent": "2em"`.
- Indent the whole paragraph: `"marginLeft": "2em"`; combines with either of the above.

:::note[Next release]
In docx, `hangingIndent` currently pushes the first line out to the left, unlike pdf and html. From the next release the first line stays put in all three formats.
:::

## Spacing

- Space before and after doesn't inherit; it only applies to the paragraph that sets it.
- Built-in defaults: paragraphs 6pt after; headings 12pt before (level 1: 18pt), 6pt after.
- Word keeps space before at the start of a section and after a manual page break. pdf currently drops it; from the **next release** it matches Word.

## Example

```json
"styles": {
  "Text": { "textIndent": "2em", "align": "justify", "lineHeight": 1.6, "spaceAfter": "0.5line" },
  "quote": { "marginLeft": "2em", "marginRight": "2em", "textIndent": 0, "color": "#666666" },
  "Heading.1": { "align": "center", "pageBreakBefore": true }
}
```
