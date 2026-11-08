---
title: Image style
description: fmtagno image position fields — inline, float and absolute positioning, wrapping, offsets, alignment, fit, rotation and opacity — with per-format support.
sidebar:
  order: 7
---

These fields go in an `Image` element's `style` and don't inherit. The content size belongs in the props `width` and `height`; `width` and `height` in the style also work, take precedence, and accept percentages.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

| Field | Value | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|---|
| `position` | `inline` `float` `absolute` | `"float"` | Flow with text (default), float, absolute | ✓ | ✓ `float` aligns left/right without wrapping, with warning | ✓ |
| `float` | `left` `right` | `"right"` | Which side to float to, default `left` | ✓ | ✓ | ✓ |
| `wrap` | `square` `tight` `topAndBottom` `none` `behind` `inFront` | `"square"` | How text wraps | ✓ | — | partly, see below |
| `wrapDistance` | length | `6` | Gap between image and text, default 6pt | ✓ | — | ✓ |
| `anchorTo` | `paragraph` `margin` `page` | `"page"` | Reference for absolute positioning | ✓ | `page`, `margin` | `page`, `margin`; `paragraph` ✗ |
| `x` / `y` | length | `"10mm"` | Offset from `anchorTo` | ✓ | ✓ | ✓ |
| `horizontalAlign` | `left` `center` `right` | `"center"` | Horizontal alignment: within the text width when inline, within `anchorTo` when absolute | ✓ | ✓ | inline ✓, absolute — |
| `verticalAlign` | `top` `middle` `bottom` | `"bottom"` | Vertical alignment when absolute | — | ✓ | — |
| `objectFit` | `contain` `cover` `fill` | `"cover"` | Scaling when both width and height are given | ✗ | ✓ | ✓ |
| `rotation` | degrees | `90` | Rotation | ✓ | ✓ | ✓ |
| `opacity` | 0–1 | `0.5` | Opacity | ✗ | ✗ | ✓ |

## wrap per format

| Value | Meaning | docx | html |
|---|---|---|---|
| `square` | Wrap around the box | ✓ | float |
| `tight` | Wrap tightly | ✓ | treated as square |
| `topAndBottom` | Text above and below only | ✓ | ✓ |
| `none` | No wrap, overlaps text | ✓ | ✗ when floating |
| `behind` | Behind text | ✓ (floating or absolute only) | ✓ when absolute |
| `inFront` | In front of text | ✓ | ✓ when absolute |

pdf (Typst) can't wrap text around images, so `wrap` has no effect there.

## Different defaults

With `position: absolute` and no `anchorTo`, docx positions relative to the page and html relative to the margins. Set `anchorTo` to get the same result everywhere.

## Examples

Float right with text wrapping:

```json
"style": { "position": "float", "float": "right", "wrap": "square", "wrapDistance": "4mm" }
```

Full-page background:

```json
"style": { "position": "absolute", "anchorTo": "page", "x": 0, "y": 0, "wrap": "behind" }
```

Top-right badge (html ignores `horizontalAlign` on absolute images; use `x` there):

```json
"style": { "position": "absolute", "anchorTo": "margin", "horizontalAlign": "right", "y": 0 }
```
