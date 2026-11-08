---
title: 安装
description: 下载 fmtagno 的预编译二进制，或者从源码编译。
sidebar:
  order: 1
---

fmtagno 是一个单独的可执行文件，不依赖 Word、LibreOffice 或别的程序。下载下来放进 `PATH` 就能用。

:::caution[alpha 版]
现在只有 GitHub 上的预发布版，最新是 `v0.1.0-alpha.2`。Homebrew 安装还没上线。
:::

## 下载预编译版

1. 打开 [GitHub Releases](https://github.com/reiy-leo/fmtagno/releases)，找到最新的预发布版。
2. 按你的系统下载压缩包。现在有三种：
   - macOS Intel（x86_64）
   - macOS Apple Silicon（arm64）
   - Linux x86_64
3. 用同一页的 `SHA256SUMS` 核对一下（可选）：

   ```sh
   shasum -a 256 -c SHA256SUMS --ignore-missing
   ```

4. 解压，找到里面的 `fmtagno` 文件，放进 `PATH` 里的目录，比如 `~/.local/bin`：

   ```sh
   tar -xzf 下载的文件.tar.gz
   mkdir -p ~/.local/bin
   mv 解压出来的路径/fmtagno ~/.local/bin/
   ```

5. 看看装好没有：

   ```sh
   fmtagno --version
   # fmtagno 0.1.0-alpha.2
   ```

macOS 第一次运行可能提示「无法验证开发者」。到「系统设置 → 隐私与安全性」里点「仍要打开」，或者执行：

```sh
xattr -d com.apple.quarantine ~/.local/bin/fmtagno
```

## 从源码编译

要装 Rust（2024 edition，也就是 1.85 以上）。编译 Typst 很吃内存，建议留 4 GB 以上。

```sh
git clone https://github.com/reiy-leo/fmtagno.git
cd fmtagno
cargo build --release
./target/release/fmtagno --version
```

## 字体

- **docx**：只写字体名，用户打开时用自己电脑上的字体。
- **html**：同上，交给浏览器。
- **pdf**：字体在渲染时嵌进文件，所以要在**你这台机器**上找得到。默认按这个顺序找中文字体：苹方（PingFang SC）、冬青黑体、Noto Sans CJK SC、思源黑体、微软雅黑。都没有时退回 Typst 自带字体，中文可能显示不全。

Linux 上出 PDF，先装一套中文字体：

```sh
# Debian / Ubuntu
sudo apt install fonts-noto-cjk
```

## 下一步

[快速上手](/getting-started/quick-start/)：写一份 JSON，出三种文件。
