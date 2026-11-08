import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://fmtagno.rei8t.dev",
  integrations: [
    starlight({
      title: "fmtagno",
      description: "一份 JSON，出 Word、PDF 和网页。",
      logo: { src: "./src/assets/logo.svg", replacesTitle: true },
      favicon: "/favicon.svg",
      defaultLocale: "root",
      locales: {
        root: { label: "简体中文", lang: "zh-CN" },
        en: { label: "English", lang: "en" },
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/reiy-leo/fmtagno" }],
      editLink: { baseUrl: "https://github.com/reiy-leo/fmtagno-web/edit/main/" },
      lastUpdated: true,
      sidebar: [
        { label: "开始", translations: { en: "Getting started" }, items: [{ autogenerate: { directory: "getting-started" } }] },
        { label: "指南", translations: { en: "Guide" }, items: [{ autogenerate: { directory: "guide" } }] },
        { label: "参考", translations: { en: "Reference" }, items: [{ autogenerate: { directory: "reference" } }] },
      ],
    }),
  ],
});
