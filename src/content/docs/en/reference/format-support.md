---
title: Format support
description: Where the same JSON differs between docx, pdf and html — support tables for components, images, style fields, pagination and headers/footers, plus next-release changes.
sidebar:
  order: 10
---

The same JSON aims to look the same in all three formats. Styles a format can't express are ignored with a warning (once per field), never an error.

Legend: ✓ supported; ✗ ignored with a warning; — ignored silently.

## How each format is produced

| | docx | pdf | html |
|---|---|---|---|
| Engine | docx-rs | converted to Typst, then compiled | hand-built HTML with its own CSS |
| Fonts | names only; the reader's computer supplies them | found on the rendering machine and embedded | left to the browser |
| Images | packed into the file | packed into the file | local images as `data:` URIs |
| Page breaks | ✓ | ✓ | when printing or with `--paged` |
| Headers, footers, page numbers | Word fields, computed on open | computed after layout | only with `--paged` |

## Components

| Component | docx | pdf | html |
|---|---|---|---|
| Heading | ✓ also gets Word "Heading 1–6" | ✓ | ✓ |
| Text, Code, List | ✓ | ✓ | ✓ |
| Code `lineNumbers` | ✓ | ✓ | ✓ |
| Table | ✓ part styles written per cell | ✓ | ✓ |
| Image | png, jpeg, gif, webp only | no URLs | ✓ |
| PageBreak | ✓ | ✓ | when printing or with `--paged` |
| Divider, Quote, Callout (next release) | ✓ padding and line width go into the indent; `radius` ✗ | ✓ | ✓ |
| TableOfContents (next release) | Word TOC field; page numbers after updating fields | ✓ page numbers computed, clickable | links; page numbers with `--paged` |
| Section | ✓ extra empty paragraph at each section end holds its settings | ✓ | with `--paged`; printing uses the first section's paper |
| Slide | level-2 heading plus content, then a page break; `body` part ✗ | one per page | one per page (16:9 box) |

## Images

| | docx | pdf | html |
|---|---|---|---|
| png, jpeg, gif, webp | ✓ | ✓ | ✓ |
| svg | ✗, shows alt | ✓ | ✓ |
| URLs | ✗, shows alt | ✗, shows alt | ✓ |
| `float` wrapping | ✓ | ✗, left/right alignment only | ✓ |
| `objectFit` | ✗ | ✓ | ✓ |
| `opacity` | ✗ | ✗ | ✓ |

## Text fields

| Field | docx | pdf | html |
|---|---|---|---|
| `fontFamily` fallback lists | first name only | ✓ | ✓ |
| `italic` | ✓ | CJK fonts have no italic | ✓ |
| `underline` double, wavy | ✓ | drawn single, ✗ | ✓ |
| `underlineColor` | ✗ | ✓ | ✓ |
| `strike: "double"` | ✓ | drawn single, ✗ | ✓ |
| `caps: "small"` | ✗ | ✓ | ✓ |
| `emphasisMark` | ✗ | ✗ | ✓ |
| `scale` | ✓ | ✗ | ✗ |
| `kerning` | ✗ | ✓ | ✓ |
| `lang` | — | ✓ | ✓ |
| color alpha | — | ✓ | ✓ |

## Paragraph fields

| Field | docx | pdf | html |
|---|---|---|---|
| `align: "distribute"` | ✓ | as `justify`, ✗ | ✓ |
| `lineHeight: { atLeast }` | ✓ | ✓ | as exact |
| `autoSpace` | ✗ | ✓ | ✓ |
| `kinsoku` | ✗ | — on by default | ✓ |
| `wrap: false` | ✗ | ✗ | ✓ |
| `outlineLevel` | ✓ | — | — |
| `contextualSpacing` | ✗ | ✗ | ✗ |
| `borderBetween` | ✓ | ✗ | ✗ |

## Box and background

| Field | docx | pdf | html |
|---|---|---|---|
| paragraph `padding` | only with a border (the built-in Code style warns for this reason) | ✓ | ✓ |
| `radius` | ✗ | ✓ | ✓ |
| `background` pattern | ✓ | blended to solid | blended to solid |
| `background` gradient | first color | ✓ | ✓ |
| border `dashDot` / `wave` | ✓ | ✓ | drawn as dashed / solid |
| `borderDiagonal` | not implemented | not implemented | not implemented |
| `textRotation` | table cells only | ✓ | ✓ |

## Lists, tables, page

| Field | docx | pdf | html |
|---|---|---|---|
| `listMarkerImage` | ✗ | ✓ | ✓ |
| `listMarkerGap` as a length | as `tab`, ✗ | ✓ | ✓ |
| `tableLayout` | ✓ | — | ✓ |
| `rowBreak: false` | ✓ | ✗ | ✓ |
| exact row height | ✓ | ✓ | as minimum |
| minimum row height | ✓ | single-line cells only | ✓ |
| repeated header | ✓ | ✓ | when printing or with `--paged` |
| `meta.title` / `author` / `lang` | — | ✓ | ✓ |

## pdf fonts

- Default CJK fonts are tried in this order: PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Microsoft YaHei.
- If none is found, Typst's bundled fonts are used and CJK characters may be missing.
- Your own `fontFamily` goes in front of the default list.

## Markdown (next release)

`-o report.md` or `-f md` writes Markdown in GitHub's flavor (GFM). Markdown has no styling, so only the structure is kept. Useful for READMEs, feeding to AI, or diffs.

| Content | Written as |
|---|---|
| Heading | `#` to `######` |
| Text | A paragraph; line breaks in the text become a trailing backslash |
| Bold, italic, strike, super/subscript, links, inline code | `**`, `*`, `~~`, `<sup>` `<sub>`, `[text](url)`, backticks; nothing is marked when it matches the paragraph itself |
| List | `1.` and `-`, nested lists indented to the parent's text |
| Table | A GFM table when it has a header row and no merged cells; otherwise an inline HTML table |
| Code | A fenced block with the language; `lineNumbers` is ignored |
| Quote | `>` |
| Callout | A GitHub alert `> [!NOTE]`; 💡 becomes TIP, ⚠️ WARNING, ❗ IMPORTANT, ⛔ 🚫 CAUTION; other icons stay in front of the text |
| Divider | `---` |
| TableOfContents | A list of links to the headings; each heading it lists gets an `<a id>` anchor |
| Image | `![alt](src)` with the path as written, not embedded; `caption` becomes an italic line below |
| Section, Slide | Content only; a Slide's `title` becomes a level-2 heading |

Dropped with a warning: PageBreak, headers and footers, page-number fields. Dropped silently: fonts, sizes, colors, spacing, borders, alignment and other styling.

## Next release

These are on the development branch but not released yet (latest release: `v0.1.0-alpha.2`):

- New format: Markdown (`.md`), see “Markdown (next release)” above.
- pdf, html: text ending in a line break gets one more empty line at the end, like Word.
- pdf: exact line heights are no longer stretched by the font; changing font size in a cell keeps the line height.
- pdf: a cell's own line height (e.g. the header's `lineHeight`) is no longer lost.
- pdf: glyphs sit in the line box using the font's own ascender/descender, no longer riding high.
- pdf: space before/after is no longer dropped when the paragraph has left/right indents.
- pdf: space before is kept at section starts and after manual page breaks, like Word.
- pdf: font weights are normalized per family, so fonts like MiSans with non-round weights bold correctly.
- docx: `hangingIndent` no longer pushes the first line to the left.
- docx: the paragraph anchoring an absolutely positioned image no longer takes up a line.
- html `--paged`: the dashed lines and gaps between sections on screen are gone.
