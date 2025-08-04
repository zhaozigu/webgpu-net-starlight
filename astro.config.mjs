// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: "https://www.webgpu.net",
  integrations: [
    starlight({
      title: "WebGPU 学习网站",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/zhaozigu/webgpu-net-starlight",
        },
      ],
      sidebar: [
        {
          label: "学习指南",
          items: [{ label: "WebGPU 入门", slug: "guides/getting-started" }],
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
