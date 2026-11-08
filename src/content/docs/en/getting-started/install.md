---
title: Install
description: Download a prebuilt fmtagno binary, or build it from source.
sidebar:
  order: 1
---

fmtagno is a single executable. It doesn't need Word, LibreOffice or anything else. Download it, put it on your `PATH`, done.

:::caution[Alpha]
Only GitHub pre-releases exist for now; the latest is `v0.1.0-alpha.2`. Homebrew isn't available yet.
:::

## Download a prebuilt binary

1. Open [GitHub Releases](https://github.com/reiy-leo/fmtagno/releases) and find the latest pre-release.
2. Download the archive for your system. Three are available:
   - macOS Intel (x86_64)
   - macOS Apple Silicon (arm64)
   - Linux x86_64
3. Optionally verify it against `SHA256SUMS` from the same page:

   ```sh
   shasum -a 256 -c SHA256SUMS --ignore-missing
   ```

4. Extract it and move the `fmtagno` file into a directory on your `PATH`, e.g. `~/.local/bin`:

   ```sh
   tar -xzf downloaded-file.tar.gz
   mkdir -p ~/.local/bin
   mv path/to/extracted/fmtagno ~/.local/bin/
   ```

5. Check it works:

   ```sh
   fmtagno --version
   # fmtagno 0.1.0-alpha.2
   ```

If macOS says the developer can't be verified on first run, click "Open Anyway" in System Settings → Privacy & Security, or run:

```sh
xattr -d com.apple.quarantine ~/.local/bin/fmtagno
```

## Build from source

You need Rust with the 2024 edition (1.85 or newer). Compiling Typst takes a lot of memory; 4 GB or more is a good idea.

```sh
git clone https://github.com/reiy-leo/fmtagno.git
cd fmtagno
cargo build --release
./target/release/fmtagno --version
```

## Fonts

- **docx**: only font names are written. The reader's computer supplies the fonts.
- **html**: same, the browser picks fonts.
- **pdf**: fonts are embedded at render time, so they must be installed on **the machine running fmtagno**. For Chinese text it looks for PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC and Microsoft YaHei, in that order. If none is found it falls back to Typst's bundled fonts, and CJK characters may be missing.

To render PDFs on Linux, install a CJK font first:

```sh
# Debian / Ubuntu
sudo apt install fonts-noto-cjk
```

## Next

[Quick start](/en/getting-started/quick-start/): write one JSON file and get three outputs.
