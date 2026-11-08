---
title: Custom components
description: Build your own components from built-ins — definition file format, prop types, {{prop}} substitution, the $children slot, catalog directories and how styles override.
sidebar:
  order: 8
---

A custom component combines built-in components and is used in JSON just like one. fmtagno expands it into built-ins before rendering, so it works in all three formats.

Custom components can only be built from built-ins and other custom components; no code.

## Defining a component

One component per file, written in JSON:

```json title="catalog/callout.json"
{
  "name": "Notice",
  "description": "A callout with a title; children go below the title",
  "container": true,
  "props": {
    "title": { "type": "inline", "required": true, "description": "Notice title" },
    "tone": { "type": "string", "default": "#1a73e8", "description": "Title color" }
  },
  "template": {
    "root": "box",
    "elements": {
      "box": { "type": "Document", "children": ["head", "$children"] },
      "head": {
        "type": "Text",
        "props": { "text": "{{title}}" },
        "style": { "bold": true, "color": "{{tone}}", "background": "#F5F7FA", "padding": 6 }
      }
    }
  }
}
```

Using it:

```json
"tip": { "type": "Notice", "props": { "title": "Tip" }, "children": ["tip-body"] },
"tip-body": { "type": "Text", "props": { "text": "Component definitions live in a catalog/ directory next to the document." } }
```

## Definition fields

| Field | Type | Required | Meaning |
|---|---|---|---|
| `name` | string | yes | Component name. Starts with an uppercase letter; letters, digits and `_` only; can't clash with a built-in |
| `description` | string | no | Shown by `fmtagno catalog` |
| `container` | boolean | no | Whether it takes children, default `false` |
| `props` | object | no | Parameter definitions, keyed by name |
| `template` | object | yes | Template: `root` is the root element id, `elements` works like the document's `elements` |

Each parameter:

| Field | Meaning |
|---|---|
| `type` | `string` (default), `number`, `integer`, `boolean`, `array`, `object`, `inline` (string or runs), `any` |
| `required` | Required, default `false` |
| `default` | Default value; must match `type` |
| `description` | Goes into the schema from `catalog --json` |

## Template rules

- **Whole-value substitution**: a string that is exactly `"{{title}}"` is replaced by the parameter value — arrays and objects too, such as runs or a table's `rows`.
- **Text substitution**: inside other text it's replaced as text, e.g. `"Chapter {{n}}: {{title}}"`. The parameter must then be a string, number or boolean.
- Optional parameters with no value and no default become empty.
- Referencing an undefined parameter in the template is an error.
- **Slot**: a container must put `"$children"` exactly once in some template element's `children`; the instance's children go there. Non-containers can't use it.
- Template element ids can't contain dots.
- Templates can use other custom components, up to 32 levels deep; deeper is treated as a cycle.

## Ids after expansion

- The instance id goes to the template's root element. Above, `tip` becomes that `Document`.
- Other template elements get `instanceId.templateId`, e.g. `tip.head`. You'll see these ids in error messages.

## Validation

All of these are errors:

- Missing required parameter.
- Unknown parameter.
- Wrong parameter type.
- `children` on a non-container.
- The same component defined twice.

## Where definitions live

Three places, all usable together:

1. A `catalog/` directory next to the document, read automatically.
2. Files or directories given with `--catalog` (repeatable). `render`, `check` and `catalog` all accept it.
3. The document's `components` array — handy when sending a whole document at once (e.g. from an AI).

Only `.json` files are read, not subdirectories.

```json
{
  "components": [
    {
      "name": "Signature",
      "description": "Sign-off: right-aligned name and date",
      "props": { "who": { "type": "string", "required": true }, "date": { "type": "string" } },
      "template": {
        "root": "s",
        "elements": {
          "s": { "type": "Text", "props": { "text": "{{who}}  {{date}}" }, "style": { "align": "right", "color": "#666666" } }
        }
      }
    }
  ]
}
```

`fmtagno catalog` does not read a nearby `catalog/`; pass `--catalog` to list custom components:

```sh
fmtagno catalog --catalog catalog/
fmtagno catalog --json --catalog catalog/
```

## How styles combine

- `style` and `parts` in the template are the component's default look.
- They rank **after** generic component styles. A top-level `"Text": {...}` won't change the Notice's title.
- To change something inside, use a named key:

  | Key | Applies to |
  |---|---|
  | `Notice` | The root element after expansion |
  | `Notice:head` | The template element with id `head` |
  | `PriceTable:t.header` | The `header` part of template element `t` |

- `style` and `parts` written on the instance win over everything.

The full order is in [Styles](/en/guide/styles/).

## Complete example

```json title="custom.json"
{
  "version": "0.1",
  "meta": { "title": "Custom component example", "lang": "en" },
  "components": [
    {
      "name": "Chapter",
      "description": "Chapter heading plus a lead paragraph",
      "props": {
        "n": { "type": "integer", "required": true },
        "title": { "type": "string", "required": true },
        "lead": { "type": "inline", "default": "" }
      },
      "template": {
        "root": "h",
        "elements": {
          "h": { "type": "Document", "children": ["title", "lead"] },
          "title": { "type": "Heading", "props": { "level": 2, "text": "Chapter {{n}}: {{title}}" } },
          "lead": { "type": "Text", "props": { "text": "{{lead}}" }, "style": { "color": "#666666" } }
        }
      }
    },
    {
      "name": "Notice",
      "description": "A callout with a title",
      "container": true,
      "props": {
        "title": { "type": "inline", "required": true },
        "tone": { "type": "string", "default": "#1a73e8" }
      },
      "template": {
        "root": "box",
        "elements": {
          "box": { "type": "Document", "children": ["head", "$children"] },
          "head": { "type": "Text", "props": { "text": "{{title}}" }, "style": { "bold": true, "color": "{{tone}}", "background": "#F5F7FA", "padding": 6 } }
        }
      }
    }
  ],
  "styles": {
    "Notice:head": { "fontSize": 12 }
  },
  "root": "doc",
  "elements": {
    "doc": { "type": "Document", "children": ["ch1", "tip"] },
    "ch1": { "type": "Chapter", "props": { "n": 1, "title": "Why custom components", "lead": ["Combine common layouts ", { "text": "once", "bold": true }, ", use them in one line."] } },
    "tip": { "type": "Notice", "props": { "title": "Tip", "tone": "#CF222E" }, "children": ["tip-body"] },
    "tip-body": { "type": "Text", "props": { "text": "Definitions can live in catalog/, or right in the document like this." } }
  }
}
```
