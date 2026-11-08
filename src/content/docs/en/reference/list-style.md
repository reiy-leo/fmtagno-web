---
title: List style
description: fmtagno list fields — numbering type, number format, marker color/font/size, indents, start value — and how multi-level lists work.
sidebar:
  order: 6
---

List fields go on a `List` element, or on its parts `level1` … `level9` for per-level settings. All except `listStart` inherit.

Legend: ✓ supported; ✗ ignored with a warning.

| Field | Value | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|---|
| `listStyleType` | see below | `"upper-roman"` | Number or bullet type | ✓ | ✓ | ✓ |
| `listMarkerFormat` | string; `%1` is this level's number | `"%1)"`, `"Article %1"`, `"%1.%2"` | Number template | ✓ | ✓ | ✓ |
| `listMarkerImage` | image path | `"dot.png"` | Image as bullet | ✗ | ✓ | ✓ |
| `listMarkerColor` | color | `"#1A73E8"` | Marker color | ✓ | ✓ | ✓ |
| `listMarkerFont` | font name | `"Wingdings"` | Marker font | ✓ | ✓ | ✓ |
| `listMarkerSize` | percentage number | `80` | Marker size relative to the text | ✓ | ✓ | ✓ |
| `listMarkerAlign` | `left` `center` `right` | `"right"` | Alignment within the marker area. Right-aligned, 1. to 10. line up on the dot | ✓ | ✓ | ✓ |
| `listMarkerGap` | length, or `"tab"` `"space"` `"none"` | `"space"` | Gap between marker and text | ✓ length treated as `tab`, with warning | ✓ | ✓ |
| `listIndent` | length | `"2em"` | Indent per level, accumulating | ✓ | ✓ | ✓ |
| `listHanging` | length | `"2em"` | Width of the marker area (hanging indent) | ✓ | ✓ | ✓ |
| `listStart` | integer | `5` | Starting number for ordered lists | ✓ | ✓ | ✓ |

## Numbering types

| Unordered | Looks like | Ordered | Looks like |
|---|---|---|---|
| `disc` | • | `decimal` | 1 2 3 |
| `circle` | ◦ | `decimal-leading-zero` | 01 02 03 |
| `square` | ▪ | `lower-alpha` / `upper-alpha` | a b c / A B C |
| `dash` | – | `lower-roman` / `upper-roman` | i ii iii / I II III |
| `none` | nothing | `cjk-decimal` | 一 二 三 |
| any 1–3 characters | e.g. `"▸"`, `"★"` | `cjk-ideographic` | 甲 乙 丙 |
| | | `circled-decimal` | ① ② ③ (above 20: (21)) |

- Without a type, levels rotate: ordered `decimal` → `lower-alpha` → `lower-roman`; unordered `disc` → `circle` → `square`.
- Ordered lists without `listMarkerFormat` use `"%1."` (`"%2."` on level 2, and so on).

## Multi-level lists

An item written as `{ "text": …, "items": [...] }` has a sub-list. Style each level on the parts `level1`, `level2`, …; unset levels follow the level above, and `listIndent` accumulates per level.

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
  "style": { "listStyleType": "upper-roman", "listMarkerFormat": "%1.", "listMarkerAlign": "right", "listIndent": "2.5em" },
  "parts": {
    "level2": { "listStyleType": "decimal", "listMarkerFormat": "%1.%2", "listMarkerColor": "#1A73E8" }
  }
}
```

Result:

```text
  I. Prepare data
 II. Pick a style set
     2.1 report
     2.2 slides
III. Render
```

`%1.%2` pulls in the parent level's number. When this level is `decimal`, parent numbers are written as Arabic digits too: the parent is "II.", this level shows "2.1", not "II.1".

## Parts

| Part | Applies to |
|---|---|
| `level1` … `level9` | One level |
| `marker` | The number or bullet itself, e.g. `{ "bold": true }` |
| `item` | Each item's text |

For document-wide changes use the component keys `List.level2`, `List.marker`, `List.item`.
