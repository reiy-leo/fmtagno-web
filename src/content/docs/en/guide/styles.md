---
title: Styles
description: Where fmtagno styles go, which fields inherit, the order styles are combined in, and the built-in defaults.
sidebar:
  order: 3
---

A style is a flat object with CSS-like field names:

```json
{ "fontSize": 12, "color": "#333333", "lineHeight": 1.5, "borderBottom": "1pt solid #D0D7DE" }
```

Values follow what Word can express. If a format can't express a field, it is ignored with a warning — not an error. Unknown fields are errors.

## Field groups

All fields sit at one level in JSON. The groups only help you find them:

| Group | Examples | Reference |
|---|---|---|
| Text | `fontFamily` `fontSize` `color` `bold` `underline` | [Text style](/en/reference/text-style/) |
| Paragraph | `align` `lineHeight` `spaceBefore` `textIndent` | [Paragraph style](/en/reference/paragraph-style/) |
| Borders, background, box | `border` `background` `padding` `width` | [Borders, background and box](/en/reference/box-style/) |
| List | `listStyleType` `listMarkerFormat` `listIndent` | [List style](/en/reference/list-style/) |
| Image position | `position` `float` `wrap` `x` `y` | [Image style](/en/reference/image-style/) |
| Table | `cellPadding` `repeatHeader` `tableLayout` | [Table style](/en/reference/table-style/) |

How to write lengths, colors, borders and so on: [Values](/en/reference/units/).

## Where styles go

Four places, all written the same way:

1. **An element's `style`**: that element only.
2. **An element's `parts`**: one part of that element.
3. **Top-level `styles`**:
   - A key that is a component name is a **component style** and applies to every element of that component: `"Text"`, `"Heading.1"`, `"Table.header"`.
   - Any other key is a **named style** that elements reference by name: `"style": "muted"`.
4. **Style sets**: a whole look, which can live in a separate file and be shared. See [Style sets](/en/guide/style-sets/).

```json
"styles": {
  "Text": { "textIndent": "2em" },
  "Heading.1": { "align": "center" },
  "Table.header": { "background": "#1A73E8", "color": "#FFFFFF" },
  "muted": { "color": "#666666", "fontSize": 10 }
}
```

Component style keys:

| Key | Applies to |
|---|---|
| `Heading` `Text` `Code` `List` `Table` `Image` `Slide` `Section` `Document` | All elements of that component |
| `InlineCode` | Inline code in runs |
| `Heading.1` … `Heading.6` | One heading level |
| `List.level1` … `List.level9`, `List.marker`, `List.item` | A list level, the marker, item text |
| `Table.header`, `Table.evenRow`, … | Table parts; see [Tables](/en/guide/tables/) |
| `Image.caption`, `Slide.title`, `Slide.body` | Other parts |
| `CustomName` | Root element of an expanded custom component |
| `CustomName:templateId` | One element inside a custom component, optionally followed by `.part` |

Unknown component names or parts in keys are errors.

## Inheritance

As in CSS, some fields pass from parent to child and some don't.

- **Inherited**: text fields, most paragraph fields and list fields. Specifically `fontFamily` `fontSize` `color` `bold` `italic` `underline` `underlineColor` `strike` `caps` `letterSpacing` `highlight` `emphasisMark` `scale` `kerning` `lang` `hidden` `align` `lineHeight` `textIndent` `hangingIndent` `widowControl` `contextualSpacing` `autoSpace` `kinsoku` `direction`, and every `list*` field except `listStart`.
- **Not inherited**: `verticalAlign` `spaceBefore` `spaceAfter` `marginLeft` `marginRight` `keepWithNext` `keepTogether` `pageBreakBefore` `wrap` `outlineLevel`, every border, background, box, image-position and table field, and `listStart`.

So `fontSize` on the `Document` changes the whole document, while `border` on the `Document` only frames the document itself.

## Combination order

An element's final style is built in this order; later steps win:

1. Inherited fields from the parent. The root's "parent" is the built-in global defaults plus the style set's `global`.
2. Built-in component defaults: `Heading`, then `Heading.1`.
3. The style set's component styles: `Heading`, then `Heading.1`.
4. Component styles from the top-level `styles`: again `Heading`, then `Heading.1`.
5. The `style` written in a custom component's template.
6. Component styles that name the custom component: `Callout`, `Callout:head`.
7. The element's own `style`. Later array entries win.
8. Text styles on runs (for that bit of text only).

Notes:

- Step 1 is the weakest. Component styles always beat inherited values, as in CSS.
- Step 4 comes after step 3: the style set is the base, the document's own styles win.
- Part styles follow the same order: built-in → style set → top-level `styles` → template `parts` → `Name:elementId.part` → the element's own `parts`. Part styles are applied on top of the element's style.
- `fontFamily` merges per script. `"fontFamily": "Times New Roman"` followed by `{ "eastAsia": "SimHei" }` gives Times for Latin and SimHei for CJK.

## Built-in defaults

This is what you get when you write nothing:

| Key | Default |
|---|---|
| global | `fontSize` 10.5, `lineHeight` 1.5 |
| `Heading` | bold, `keepWithNext`, 12 before, 6 after, `lineHeight` 1.25 |
| `Heading.1` … `Heading.6` | sizes 20 / 16 / 14 / 12 / 11 / 11; level 1 has 18 before |
| `Text` | 6 after |
| `Code` | monospace, 9pt, `lineHeight` 1.4, background `#F6F8FA`, padding 8, 8 after, `keepTogether` |
| `InlineCode` | monospace, background `#F0F1F3` |
| `List` | 6 after, `listIndent` 2em, `listHanging` 2em |
| `Table` | border `0.5pt solid #999999`, `cellPadding` 4, `repeatHeader`, 8 after |
| `Table.header` | bold, background `#F3F3F3` |
| `Image` | 6 after |
| `Image.caption` | 9pt, `#666666` |
| `Slide.title` | 20pt, bold |

Numbers are in pt. Monospace is `Menlo, Consolas, DejaVu Sans Mono`. Links default to `#0563C1`, underlined.

## Example

```json title="styles-basic.json"
{
  "version": "0.1",
  "meta": { "title": "Style example", "lang": "en" },
  "styles": {
    "Document": { "fontSize": 11, "lineHeight": 1.6 },
    "Heading.1": { "align": "center", "color": "#1F2328" },
    "Text": { "textIndent": "2em", "align": "justify" },
    "note": { "background": "#FFF8C5", "borderLeft": "3pt solid #D4A72C", "padding": 8, "textIndent": 0 }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["title", "p1", "tip"] },
    "title": { "type": "Heading", "props": { "level": 1, "text": "Style example" } },
    "p1": { "type": "Text", "props": { "text": "Paragraphs are justified with a first-line indent. Font size and line height are set on the Document and inherited everywhere." } },
    "tip": { "type": "Text", "props": { "text": "This callout uses the named style note: a thick left border on pale yellow." }, "style": "note" }
  }
}
```
