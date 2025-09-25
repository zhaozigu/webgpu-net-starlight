// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";
import vercelStatic from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://www.webgpu.net",
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
  ],
});
