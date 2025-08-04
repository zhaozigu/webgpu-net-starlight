// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

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
