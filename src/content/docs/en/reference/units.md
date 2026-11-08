---
title: Values
description: How to write lengths, colors, fonts, line heights, borders, backgrounds, column widths and paper names in fmtagno styles.
sidebar:
  order: 2
---

Style values come in a few fixed shapes. Get one wrong and `check` reports it and tells you the expected form.

## Lengths

**A number is pt.** Strings may carry a unit:

| Unit | Example | Conversion | Where |
|---|---|---|---|
| none | `12`, `"12"` | pt | any length |
| `pt` | `"10.5pt"` | 1pt = 1/72 in | any length |
| `mm` | `"20mm"` | | any length |
| `cm` | `"2.5cm"` | | any length |
| `in` | `"1in"` | 1in = 72pt | any length |
| `px` | `"16px"` | 1px = 0.75pt (96 dpi) | any length |
| `em` | `"2em"` | multiple of the current font size | indents, letter spacing, padding, … |
| `line` | `"0.5line"` | number of lines | `spaceBefore`, `spaceAfter` |
| `%` | `"50%"` | percentage | widths and heights |

- `"2em"` on `textIndent` is a two-character first-line indent. docx writes it as Word's character-based indent.
- `"0.5line"` becomes Word's line unit in docx; pdf and html compute font size × 1.2 × lines.
- Page settings (paper, margins), table column widths and row heights take absolute lengths only (pt mm cm in px).
- Negative values are fine, e.g. `"-2pt"`.

## Colors

Hex only:

| Form | Example |
|---|---|
| `#RGB` | `"#c00"` |
| `#RRGGBB` | `"#1A73E8"` |
| `#RGBA` | `"#c008"` |
| `#RRGGBBAA` | `"#1A73E880"` |

- Case doesn't matter.
- No color names: `"red"` is an error.
- Alpha (the last two digits): supported by html and pdf, ignored by docx.
- No theme colors.

## Fonts: fontFamily

```json
"fontFamily": "Inter"
"fontFamily": { "latin": "Inter", "eastAsia": "Source Han Sans SC", "complex": "Noto Naskh Arabic" }
"fontFamily": { "latin": "Liberation Serif, Times New Roman", "eastAsia": "Noto Serif CJK SC, Songti SC, SimSun" }
```

| Key | Script |
|---|---|
| `latin` | Latin |
| `eastAsia` | Chinese, Japanese, Korean |
| `complex` | Arabic and other complex scripts |

- A plain string sets all three.
- Each entry may be a comma-separated fallback list. html and pdf try them in order; docx uses only the first name.
- A later style only changes the scripts it names; the rest are kept.

## Line height: lineHeight

| Form | Example | Meaning |
|---|---|---|
| number | `1.5` | Multiple: font size × 1.5 |
| `em` or `%` | `"1.5em"`, `"150%"` | Also a multiple |
| other length | `"20pt"` | Exact |
| `{ "atLeast": length }` | `{ "atLeast": "18pt" }` | Minimum |

:::caution
A number in `lineHeight` is a **multiple**, not pt. For exactly 20pt, write `"20pt"`.
:::

Multiples follow CSS (font size × multiple). docx writes them as "at least font size × multiple" rather than Word's "multiple" spacing: Word multiplies the font's own line height, which comes out 30–40% taller than html and pdf.

## Borders

One side, as a string or an object:

```json
"border": "1pt solid #CCCCCC"
"borderBottom": { "width": 2, "style": "double", "color": "#1A73E8" }
"borderInsideV": "none"
```

- In the string, the three parts can come in any order and all are optional: width defaults to 1pt, style to `solid`, color to black.
- `"none"` means no line.

Line styles:

| Value | Meaning | html | Note |
|---|---|---|---|
| `none` | none | none | |
| `solid` | solid | solid | |
| `dashed` | dashed | dashed | |
| `dotted` | dotted | dotted | |
| `dashDot` | dash-dot | drawn as dashed | |
| `double` | double | double | pdf draws two lines |
| `wave` | wave | drawn as solid | |

Word only allows border widths from 0.25pt to 12pt; values outside are clamped.

## Background: background

Three forms:

```json
"background": "#F5F7FA"
"background": { "pattern": "pct20", "color": "#000000", "fill": "#FFFFFF" }
"background": { "gradient": "linear", "angle": 90, "stops": ["#FFFFFF", "#E8F0FE"] }
```

| Form | Fields | docx | pdf | html |
|---|---|---|---|---|
| solid | a color | ✓ | ✓ | ✓ |
| pattern | `pattern` name, `color` foreground (default black), `fill` background (default white) | ✓ | blended to a solid color | blended to a solid color |
| gradient | `gradient` must be `"linear"`, `angle` in degrees (default 90), `stops` with at least two colors | first color only | ✓ | ✓ |

Pattern names: `pct5` `pct10` `pct20` `pct25` `pct30` `pct40` `pct50` `pct60` `pct70` `pct75` `pct80` `pct90` `horzStripe` `vertStripe` `diagStripe` `reverseDiagStripe` `horzCross` `diagCross` `thinHorzStripe` `thinVertStripe` `thinDiagStripe` `thinReverseDiagStripe` `thinHorzCross` `thinDiagCross`.

## Table column widths: widths

| Form | Example | Meaning |
|---|---|---|
| number > 0 | `3` | Ratio of the remaining width |
| absolute length | `"20mm"` | Fixed width |
| `"auto"` | `"auto"` | Fit the content |

See [Tables](/en/guide/tables/).

## Table row heights: rowHeights

| Form | Example | Meaning |
|---|---|---|
| absolute length | `"28pt"`, `20` | Minimum height |
| object | `{ "height": "20pt", "rule": "exact" }` | `rule` is `atLeast` (default) or `exact` |
| `null` | | No height |

## Paper names

`A3` `A4` `A5` `B5` `Letter` `Legal`, case-insensitive. Or `{ "width": "180mm", "height": "260mm" }`. Unknown names fall back to A4 with a warning.

## Booleans and enums

- Booleans are `true` / `false`, not the string `"true"`.
- Enum values are case-sensitive: `"topAndBottom"` works, `"topandbottom"` doesn't.
