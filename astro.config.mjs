// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";
import vercelStatic from "@astrojs/vercel";

// Canonical origin for sitemap, canonical URLs, Open Graph, and robots.txt.
// This matches the existing site config. Change it if production uses another host.
const site = "https://www.webgpu.net";
const ogImage = new URL("/og.png", site).href;
const ogAlt = "WebGPU 学习网站 — tutorials, examples, and API reference";

// https://astro.build/config
export default defineConfig({
  site,
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJax],
  },
  adapter: vercelStatic({
    imageService: true,
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    starlight({
      title: {
        en: "WebGPU Learning Website",
        'zh-CN': "WebGPU 学习网站",
      },
      description: "用中文和英文学习 WebGPU：教程、可运行示例与 API 参考。",
      components: {
        Hero: "./src/components/home/Hero.astro",
        Head: "./src/components/seo/Head.astro",
      },
      head: [
        { tag: "meta", attrs: { property: "og:image", content: ogImage } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: ogAlt } },
        { tag: "meta", attrs: { name: "twitter:image", content: ogImage } },
        { tag: "meta", attrs: { name: "twitter:image:alt", content: ogAlt } },
        { tag: "meta", attrs: { name: "theme-color", content: "#121826" } },
      ],
      defaultLocale: "root",
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        en: {
          label: "English",
          lang: 'en',
        }
      },
      customCss: ["./src/mathjax.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/zhaozigu/webgpu-net-starlight",
        },
      ],
      sidebar: [
        {
          label: "教程",
          autogenerate: { directory: "guides" },
        },
        {
          label: "API 参考",
          autogenerate: { directory: "reference" },
        },
        {
          label: "实例",
          autogenerate: { directory: "examples" },
        },
        {
          label: "相关资源",
          autogenerate: { directory: "resources" },
        },
      ],
    }),
    sitemap({
      filter: (page) => !page.includes("/404"),
      i18n: {
        defaultLocale: "zh-CN",
        locales: {
          "zh-CN": "zh-CN",
          en: "en",
        },
      },
    }),
  ],
});
