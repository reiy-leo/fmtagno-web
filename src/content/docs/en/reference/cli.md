---
title: Command line
description: fmtagno commands and options — render, check, catalog — plus stdin/stdout, auto-loaded directories and the debug variable.
sidebar:
  order: 1
---

```sh
fmtagno render <input> -o <output> [options]
fmtagno check <input> [options]
fmtagno catalog [--json] [--catalog <path>]...
fmtagno --version
fmtagno --help
```

Messages and help text are in Chinese for now.

## render

Renders JSON to a file.

```sh
fmtagno render report.json -o report.docx
fmtagno render report.json -o report.html --paged
fmtagno render report.json -o report.pdf --style-sets themes/ --style-set formal
```

| Option | Meaning |
|---|---|
| `<input>` | JSON file. `-` reads from stdin |
| `-o, --output <file>` | Output file, required. The extension picks the format: `.docx`, `.pdf`, `.html` or `.htm`. `-` writes to stdout and then needs `--format` |
| `-f, --format <fmt>` | Force a format: `html`, `docx`, `pdf`. Otherwise taken from the output extension |
| `--paged` | html only: embed Paged.js so the page displays as pages |
| `--catalog <path>` | Custom component definition file or directory; repeatable |
| `--style-sets <path>` | Style set file or directory; repeatable |
| `--style-set <name>` | Style set to use; overrides the document's `styleSet` |

Pipe in, pipe out:

```sh
cat report.json | fmtagno render - -o - -f pdf > report.pdf
```

`xlsx` and `pptx` arrive in version 2; those extensions are errors for now.

### --paged

By default html is one long page; page breaks, headers, footers and repeated table headers only appear when printing. With `--paged`:

- Pages are cut using the paper and margins from `meta.page`; content after `PageBreak` starts a new page.
- Tables that cross pages repeat their header (unless `repeatHeader: false`).
- Headers and footers are shown with page numbers filled in.
- When layout finishes, `<html>` gets `data-fmtagno-ready="1"`. Screenshot or print scripts can wait for it.
- Paged.js (MIT, 0.4.3) is bundled in the binary and works offline. Files grow by about 500 KB and take a moment to lay out when opened.
- Mixed portrait/landscape looks right on screen, but printing uses the first section's paper.

## check

Validates without writing a file. Accepts the same `--catalog`, `--style-sets` and `--style-set` as `render`.

```sh
fmtagno check report.json
# ok：展开后 12 个元素
```

The message means "ok: 12 elements after expansion", i.e. after custom components are expanded into built-ins.

## catalog

Lists available components.

```sh
fmtagno catalog
fmtagno catalog --json
fmtagno catalog --catalog my-components/
```

| Option | Meaning |
|---|---|
| `--json` | Print each component's props JSON Schema, plus `description` and `container` |
| `--catalog <path>` | Also list custom components from these definitions; repeatable |

`catalog` does not read a `catalog/` directory automatically; pass it with `--catalog`.

## mcp

:::caution[Not implemented yet]
`fmtagno mcp` (run as an MCP server) isn't built yet; running it is an error.
:::

## Auto-loaded directories

`render` and `check` automatically read these directories next to **the document**:

| Directory | Contents |
|---|---|
| `catalog/` | Custom component definitions, one per file |
| `styles/` | Style set files, each with a `name` |

Only `.json` files, no subdirectories. When the document comes from stdin there is no document directory, so nothing is auto-loaded.

Relative image paths also resolve from the document's directory.

## Output and exit codes

- Warnings go to stderr, prefixed with `警告：` ("Warning:"). Each unsupported field is reported once per format.
- On success it prints `已生成 <file>` ("Wrote <file>") and exits 0.
- On error it prints the reason (with element ids), exits non-zero and writes no file.

## Debugging

For pdf output, set `FMTAGNO_DEBUG_TYPST=1` to print the generated Typst source to stderr:

```sh
FMTAGNO_DEBUG_TYPST=1 fmtagno render report.json -o report.pdf 2> report.typ.txt
```
