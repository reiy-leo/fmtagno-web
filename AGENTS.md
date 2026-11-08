# fmtagno-web

fmtagno 的文档站，线上地址 https://fmtagno.rei8t.dev 。教人写 fmtagno 的 JSON：文档结构、组件、样式字段、样式集、表格、分节、命令行。

fmtagno 本体在 https://github.com/reiy-leo/fmtagno ，这里只放文档。

## 技术栈

- Astro + Starlight，静态站。中文是默认语言（`src/content/docs/`），英文在 `src/content/docs/en/`，两边文件名一一对应。
- 部署到 Cloudflare Worker `fmtagno-web`，自定义域名 `fmtagno.rei8t.dev`。
- 用 API Token 部署时 Static Assets 上传会 401，所以 `scripts/build-inline-assets.mjs` 把 `dist/` 内联成 `worker/assets.generated.ts`，Worker 直接从内存返回文件。
- 包管理用 pnpm，不用 npm。

## 命令

```sh
pnpm install
pnpm dev        # 本地预览
pnpm build      # 出 dist/
pnpm deploy     # 构建、内联、wrangler deploy（要 CLOUDFLARE_API_TOKEN）
```

## 写文档的规矩

- 字段名、组件名、命令参数以 fmtagno 源码为准（`src/style.rs`、`src/components.rs`、`src/main.rs`），源码没有的不写，或标「尚未实现」。
- 中文按「像人说话」写：先说结论，短句，少用「被」「进行」「通过」「基于」。写完跑 AutoCorrect。
- 改了中文页，同步改英文页；反过来也一样。
- 侧边栏按目录自动生成，顺序用 frontmatter 的 `sidebar.order`。
- 文档里不放真实报告、样本或个人数据。

## 约定

- 每轮改完 commit 并 push 到 main。
- 不加登录、不加统计。
