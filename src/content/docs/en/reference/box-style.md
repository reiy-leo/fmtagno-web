---
title: Borders, background and box
description: fmtagno border, background, padding, width/height, vertical alignment, text rotation and corner radius fields, with per-format support.
sidebar:
  order: 5
---

These fields frame, shade and pad paragraphs, tables, table cells and images. None of them **inherit**: a border on the `Document` is not passed to every paragraph.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

## Borders

| Field | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|
| `border` | `"0.5pt solid #CCCCCC"` | All four sides | ✓ | ✓ | ✓ |
| `borderTop` `borderRight` `borderBottom` `borderLeft` | `"3pt solid #D4A72C"` | One side, overrides `border` | ✓ | ✓ | ✓ |
| `borderBetween` | `"0.5pt solid #EEEEEE"` | Line between adjacent paragraphs of the same style | ✓ | ✗ | ✗ |
| `borderInsideH` | `"none"` | Inner horizontal table lines; defaults to `border` | ✓ | ✓ | ✓ |
| `borderInsideV` | `"none"` | Inner vertical table lines; defaults to `border` | ✓ | ✓ | ✓ |
| `borderDiagonal` | | Diagonal cell line | not implemented | not implemented | not implemented |

How to write one side (string, object, `"none"`) and the line styles: [Values](/en/reference/units/).

## Background

| Field | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|
| `background` | `"#F5F7FA"` | Solid color, pattern or gradient | ✓ gradient uses first color | ✓ pattern blended to solid | ✓ pattern blended to solid |

In a run's `style` it shades only that bit of text.

## Box

| Field | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|
| `padding` | `8` | Padding on all sides | paragraphs only when bordered; table cells ✓ | ✓ | ✓ |
| `paddingTop` `paddingRight` `paddingBottom` `paddingLeft` | `2` | One side, overrides `padding` | same | ✓ | ✓ |
| `width` | `"80%"`, `"120mm"` | Width; percentages are of the text width | tables, images | ✓ | ✓ |
| `height` | `"40mm"` | Height | images | ✓ | ✓ |
| `verticalAlign` | `"middle"` | Vertical alignment: `top` `middle` `bottom` | table cells, absolutely positioned images | same | same |
| `textRotation` | `90` | Text direction: `0` `90` `270` | table cells | ✓ | ✓ |
| `radius` | `4` | Corner radius | ✗ | ✓ | ✓ |

On text, `verticalAlign` means super/subscript (`super` `sub`); on cells and images it means vertical alignment.

## Paragraph borders in docx

Word paragraphs have no real box, so fmtagno does this:

- Paragraph borders become Word paragraph borders.
- `padding` becomes the gap between border and text, so it only works when there is a border. Background without a border ignores `padding`, with a warning.
- For a shaded, padded callout, add a border in the same color as the background.

## Example

```json
"styles": {
  "note": {
    "background": "#FFF8C5",
    "borderLeft": "3pt solid #D4A72C",
    "padding": 8
  },
  "card": {
    "border": "0.5pt solid #D0D7DE",
    "radius": 6,
    "padding": 10,
    "background": { "gradient": "linear", "angle": 90, "stops": ["#FFFFFF", "#E8F0FE"] }
  }
}
```
