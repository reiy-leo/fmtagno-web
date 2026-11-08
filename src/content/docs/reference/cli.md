---
title: 命令行
description: fmtagno 的命令和参数：render、check、catalog，以及标准输入输出、自动读取的目录和调试变量。
sidebar:
  order: 1
---

```sh
fmtagno render <输入> -o <输出> [选项]
fmtagno check <输入> [选项]
fmtagno catalog [--json] [--catalog <路径>]...
fmtagno --version
fmtagno --help
```

## render

把 JSON 渲染成文件。

```sh
fmtagno render report.json -o report.docx
fmtagno render report.json -o report.html --paged
fmtagno render report.json -o report.pdf --style-sets themes/ --style-set formal
```

| 参数 | 说明 |
|---|---|
| `<输入>` | JSON 文件。写 `-` 从标准输入读 |
| `-o, --output <文件>` | 输出文件，必填。按扩展名选格式：`.docx`、`.pdf`、`.html` 或 `.htm`。写 `-` 输出到标准输出，这时要配 `--format` |
| `-f, --format <格式>` | 指定格式：`html`、`docx`、`pdf`。不写就看输出文件的扩展名 |
| `--paged` | 只对 html 有用：内嵌 Paged.js，打开就按页显示 |
| `--catalog <路径>` | 自定义组件的定义文件或目录，可以写多次 |
| `--style-sets <路径>` | 样式集文件或目录，可以写多次 |
| `--style-set <名字>` | 用哪个样式集，优先于文档里的 `styleSet` |

例子：从管道进、从管道出：

```sh
cat report.json | fmtagno render - -o - -f pdf > report.pdf
```

`xlsx`、`pptx` 要到第二版。现在写这两个扩展名会报错。

### --paged

html 默认是一长条网页，分页、页眉页脚、表头重复只在打印时出现。加 `--paged` 后：

- 按 `meta.page` 的纸张和页边距切页，`PageBreak` 后面从新页开始。
- 表格跨页时续页顶上重复表头（`repeatHeader: false` 时不重复）。
- 显示页眉页脚，填好页码。
- 排完版后 `<html>` 上会有 `data-fmtagno-ready="1"`。截图、打印的脚本可以等它。
- Paged.js（MIT，0.4.3）已经打包进二进制，离线能用。文件会大 500 KB 左右，打开时要等脚本排完。
- 屏幕上横竖混排没问题，打印时只用第一节的纸张。

## check

只校验，不出文件。参数和 `render` 的 `--catalog`、`--style-sets`、`--style-set` 一样。

```sh
fmtagno check report.json
# ok：展开后 12 个元素
```

「展开后」是指自定义组件展开成内置组件以后的元素数。

## catalog

列出能用的组件。

```sh
fmtagno catalog
fmtagno catalog --json
fmtagno catalog --catalog my-components/
```

| 参数 | 说明 |
|---|---|
| `--json` | 输出每个组件 props 的 JSON Schema，还有 `description`、`container` |
| `--catalog <路径>` | 一起列出这些定义里的自定义组件，可以写多次 |

`catalog` 不读当前目录的 `catalog/`，要看自定义组件就用 `--catalog` 指定。

## mcp

:::caution[尚未实现]
`fmtagno mcp`（以 MCP server 方式运行）还没做，现在运行会报错。
:::

## 自动读取的目录

`render` 和 `check` 会自动读**文档所在目录**下的：

| 目录 | 里面放 |
|---|---|
| `catalog/` | 自定义组件定义，一个文件一个组件 |
| `styles/` | 样式集文件，每个文件要写 `name` |

只读 `.json` 文件，不进子目录。从标准输入读文档时，没有「文档所在目录」，不自动读。

图片的相对路径也按文档所在目录找。

## 输出和退出码

- 警告打到标准错误，以「警告：」开头。同一个格式不支持的同一个字段只报一次。
- 成功时打「已生成 文件名」，退出码 0。
- 出错时打出错原因（中文，带元素 id），退出码非 0，不生成文件。

## 调试

出 pdf 时设 `FMTAGNO_DEBUG_TYPST=1`，会把生成的 Typst 源码打到标准错误：

```sh
FMTAGNO_DEBUG_TYPST=1 fmtagno render report.json -o report.pdf 2> report.typ.txt
```
