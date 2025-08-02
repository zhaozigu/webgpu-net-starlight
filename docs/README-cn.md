# WebGPU 学习网站

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

**[English Version](README.md)**

一个全面的 WebGPU 图形编程学习平台，提供交互式示例、教程和 API 文档。

## ✨ 特性

- 📚 **全面的教程** - 从基础概念到高级主题的完整学习路径
- 🎮 **交互式示例** - 实时 WebGPU 演示和实时代码编辑
- 📖 **API 参考** - 完整的 WebGPU API 文档
- 🎨 **现代界面** - 使用 Astro 和 Starlight 构建的响应式设计
- 🚀 **高性能** - 静态生成以实现快速加载

## 🚀 项目结构

```
.
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 图片和静态资源
│   ├── components/           # 可重用的 Astro 组件
│   │   └── WebGPUCanvas.astro # 交互式 WebGPU 画布组件
│   ├── content/
│   │   └── docs/             # 文档内容 (Markdown/MDX)
│   │       ├── guides/       # 学习指南
│   │       ├── reference/    # API 参考
│   │       └── examples/     # 交互式示例
│   └── content.config.ts     # 内容集合配置
├── astro.config.mjs          # Astro 和 Starlight 配置
├── package.json
└── tsconfig.json
```

### 内容组织

- **学习指南** (`guides/`) - 手写的教程和学习材料
- **API 参考** (`reference/`) - WebGPU API 文档
- **示例** (`examples/`) - 具有实时代码执行的交互式 WebGPU 演示

### 交互式组件

该项目包含一个自定义的 `WebGPUCanvas` 组件，支持：
- 实时 WebGPU 代码执行
- WGSL 着色器代码演示
- 错误处理和状态管理
- 多画布实例支持

## 🧞 开发命令

所有命令都在项目根目录的终端中运行：

| 命令 | 操作 |
|---------|--------|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 在 localhost:4321 启动本地开发服务器 |
| `pnpm build` | 构建生产站点到 ./dist/ |
| `pnpm preview` | 在部署前本地预览构建 |
| `pnpm astro check` | 类型检查项目 |

## 🛠️ 技术栈

- **Astro v5.6.1** - 现代静态站点生成器
- **Starlight v0.35.2** - 文档主题框架
- **TypeScript** - 严格类型配置
- **pnpm** - 包管理器（必需，非 npm/yarn）
- **WebGPU API** - 现代图形 API

## 🚀 快速开始

1. 克隆仓库并安装依赖：
```bash
git clone https://github.com/zhaozigu/webgpu-net-starlight.git
cd webgpu-net-starlight
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

3. 打开 http://localhost:4321 开始学习 WebGPU！

## 📖 学习资源

- [WebGPU 规范](https://www.w3.org/TR/webgpu/) - 官方 WebGPU 标准
- [WGSL 规范](https://www.w3.org/TR/WGSL/) - WebGPU 着色语言
- [Starlight 文档](https://starlight.astro.build/) - 了解更多文档框架
- [Astro 文档](https://docs.astro.build) - 了解更多 Astro

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来帮助改进这个学习平台！

## 📄 许可证

本项目基于 MIT 许可证开源。