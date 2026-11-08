---
title: Text style
description: fmtagno text fields — font, size, color, bold, underline, strikethrough, super/subscript, letter spacing, highlight and more — with per-format support.
sidebar:
  order: 3
---

Text fields control how characters look. All of them inherit from the parent (except `verticalAlign`), and they can also go in a run's `style` to change just that bit of text.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

| Field | Value | Example | Meaning | docx | pdf | html |
|---|---|---|---|---|---|---|
| `fontFamily` | font name or per-script object | `{ "latin": "Inter", "eastAsia": "Source Han Sans SC" }` | Font; see [Values](/en/reference/units/) | ✓ first name of each entry only | ✓ | ✓ |
| `fontSize` | length | `12`, `"10.5pt"` | Font size | ✓ | ✓ | ✓ |
| `color` | color | `"#333333"` | Text color | ✓ | ✓ | ✓ |
| `bold` | boolean | `true` | Bold | ✓ | ✓ | ✓ |
| `italic` | boolean | `true` | Italic | ✓ | ✓ CJK fonts have no italic | ✓ |
| `underline` | boolean or line style | `"wavy"` | Underline | ✓ | ✓ double and wavy drawn single, with warning | ✓ |
| `underlineColor` | color | `"#CF222E"` | Underline color | ✗ | ✓ | ✓ |
| `strike` | boolean, `"single"` or `"double"` | `true` | Strikethrough | ✓ | ✓ double drawn single, with warning | ✓ |
| `verticalAlign` | `"super"` `"sub"` | `"super"` | Superscript, subscript | ✓ | ✓ | ✓ |
| `caps` | `"all"` `"small"` | `"small"` | All caps, small caps | ✓ `small` ✗ | ✓ | ✓ |
| `letterSpacing` | length | `"0.1em"`, `1` | Letter spacing | ✓ | ✓ | ✓ |
| `highlight` | color | `"#FFF8C5"` | Highlight, any color | ✓ | ✓ | ✓ |
| `emphasisMark` | `"dot"` `"comma"` `"circle"` `"underDot"` | `"dot"` | CJK emphasis marks | ✗ | ✗ | ✓ |
| `scale` | percentage number | `80` | Horizontal character scaling | ✓ | ✗ | ✗ |
| `kerning` | boolean | `true` | Kerning | ✗ | ✓ | ✓ |
| `lang` | BCP 47 code | `"en-US"` | Language of this text | — | ✓ | ✓ |
| `hidden` | boolean | `true` | Hidden text | ✓ | ✓ | ✓ |

## Line styles

Values for `underline`:

| Value | Meaning |
|---|---|
| `true` / `"single"` | single |
| `false` / `"none"` | none |
| `"double"` | double |
| `"thick"` | thick |
| `"dotted"` | dotted |
| `"dashed"` | dashed |
| `"wavy"` | wavy |

## background on runs

A run's `style` also accepts `background`, which shades just that bit of text (that's how inline code is drawn). Forms are in [Values](/en/reference/units/).

```json
{ "text": "key point", "style": { "background": "#FFF8C5", "bold": true } }
```

## Example

```json
"intro": {
  "type": "Text",
  "props": { "text": [
    "Plain, ",
    { "text": "bold red", "bold": true, "color": "#CF222E" }, ", ",
    { "text": "superscript", "style": { "verticalAlign": "super" } }, ", ",
    { "text": "struck", "style": { "strike": true } }, ", ",
    { "text": "wavy underline", "underline": "wavy" }, ", ",
    { "text": "highlighted", "style": { "highlight": "#FFF8C5" } }, "."
  ] },
  "style": { "fontFamily": { "latin": "Inter", "eastAsia": "Source Han Sans SC" }, "fontSize": 11, "letterSpacing": "0.05em" }
}
```
