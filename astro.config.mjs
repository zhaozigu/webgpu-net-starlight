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
          translations: { en: "Guides" },
          items: [
            "guides/getting-started",
            "guides/fundamental-object",
            "guides/wgsl",
            "guides/render-pipeline",
            "guides/buffers",
            "guides/bind-groups",
            "guides/uniforms",
            "guides/textures",
            "guides/depth",
            "guides/compute-shaders",
          ],
        },
        {
          label: "API 参考",
          translations: { en: "API Reference" },
          items: [
            "reference/example",
            "reference/gpu-buffer",
            "reference/gpu-texture",
            "reference/gpu-sampler",
            "reference/gpu-bind-group",
            "reference/gpu-render-pipeline",
            "reference/gpu-compute-pipeline",
            "reference/gpu-command-encoder",
          ],
        },
        {
          label: "实例",
          translations: { en: "Examples" },
          autogenerate: { directory: "examples" },
        },
        {
          label: "相关资源",
          translations: { en: "Resources" },
          autogenerate: { directory: "resources" },
        },
      ],
    }),
  ],
});
