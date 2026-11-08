---
title: Images
description: Standalone images with the Image component, inline images with a run's image field; how images are embedded, which image formats each output supports, and float and absolute positioning.
sidebar:
  order: 7
---

There are two ways to place an image:

- **Image component**: a block of its own, with an optional caption; can float or be absolutely positioned.
- **Inline image**: written in runs, sitting on a line with text. Works in paragraphs, table cells, headers and footers.

## Image component

```json
"logo": {
  "type": "Image",
  "props": { "src": "images/logo.png", "alt": "fmtagno logo", "width": 90, "caption": "Figure 1. Logo" },
  "style": { "horizontalAlign": "center" }
}
```

| Prop | Type | Required | Meaning |
|---|---|---|---|
| `src` | string | yes | Local path or URL |
| `alt` | string | no | Alt text; shown as `[alt]` when the image can't be embedded |
| `width` | number (pt) | no | Width |
| `height` | number (pt) | no | Height. Give one and the other keeps the aspect ratio |
| `caption` | string | no | Caption below the image; style it with the `caption` part |

- Size can also go in the style: `"style": { "width": "50%" }`. Style `width`/`height` take precedence and accept percentages (of the text width).
- Images wider than the text area shrink to fit (except absolutely positioned ones).

## Inline images

Write `image` in a run:

```json
"text": [{ "image": "images/logo.png", "width": 40, "height": 20 }, " Company name"]
```

| Field | Type | Meaning |
|---|---|---|
| `image` | string | Local path or URL. `text` is not shown |
| `width` | number (pt) | Width |
| `height` | number (pt) | Height. Give one and the other keeps the aspect ratio |

Same in table cells:

```json
"rows": [[{ "runs": [{ "image": "logo.png", "width": 40 }, " content"] }, "next cell"]]
```

## Paths and embedding

- Relative paths resolve from **the document's directory**. When the document comes from stdin, they resolve from the current directory.
- Local images are **embedded in the output**: packed into docx and pdf, written as `data:` URIs in html. The output file works on its own.
- Missing images: docx and pdf show the alt text, html keeps the original path; all three warn.

## Image formats per output

| Image | docx | pdf | html |
|---|---|---|---|
| png, jpeg, gif, webp | ✓ | ✓ | ✓ |
| svg | ✗, shows alt | ✓ | ✓ |
| URL (http/https) | ✗, shows alt | ✗, shows alt | ✓ (linked, not embedded) |

For images in all three formats, use png or jpeg.

## Positioning

Images flow with the text by default (`position: inline`). The other two modes:

- `float`: floats left or right with text wrapping around it.
- `absolute`: placed relative to the page, the margins or the paragraph, taking no space. Good for full-page backgrounds and badges.

```json
"badge": {
  "type": "Image",
  "props": { "src": "badge.png", "width": 60 },
  "style": { "position": "float", "float": "right", "wrap": "square", "wrapDistance": 6 }
}
```

```json
"bg": {
  "type": "Image",
  "props": { "src": "bg.png", "width": 595, "height": 842 },
  "style": { "position": "absolute", "anchorTo": "page", "x": 0, "y": 0, "wrap": "behind" }
}
```

All fields: [Image style](/en/reference/image-style/). Format differences:

| | docx | pdf | html |
|---|---|---|---|
| `inline` + `horizontalAlign` | ✓ | ✓ | ✓ |
| `float` with text wrap | ✓ | ✗, aligned left/right only, no wrap | ✓ |
| `absolute` | ✓ | ✓ (`page`, `margin`) | ✓; `anchorTo: paragraph` unsupported |
| `wrap` modes | ✓ | ✗ | partly |
| `wrapDistance` | ✓ | ✗ | ✓ |
| `rotation` | ✓ | ✓ | ✓ |
| `objectFit` | ✗ | ✓ | ✓ |
| `opacity` | ✗ | ✗ | ✓ |

For `absolute` without `anchorTo`, docx positions relative to the page and html relative to the margins. Set `anchorTo` explicitly to get the same result everywhere.

## Complete example

Put a `logo.png` next to the JSON, then render:

```json title="images.json"
{
  "version": "0.1",
  "meta": { "title": "Image example", "lang": "en", "page": { "header": "hdr" } },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "logo", "p", "t"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "Image example" } },
    "logo": {
      "type": "Image",
      "props": { "src": "logo.png", "alt": "Logo", "width": 120, "caption": "Figure 1. A standalone image, centered" },
      "style": { "horizontalAlign": "center" },
      "parts": { "caption": { "align": "center" } }
    },
    "p": { "type": "Text", "props": { "text": ["An inline image ", { "image": "logo.png", "height": 12 }, " sits on the line with text."] } },
    "t": {
      "type": "Table",
      "props": { "columns": ["Image", "Note"], "widths": ["auto", 1], "rows": [[{ "runs": [{ "image": "logo.png", "width": 40 }] }, "Images work in table cells too"]] }
    },
    "hdr": { "type": "Text", "props": { "text": [{ "image": "logo.png", "height": 14 }, " Image in the header"] }, "style": { "fontSize": 9 } }
  }
}
```
