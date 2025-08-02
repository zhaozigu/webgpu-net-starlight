# WebGPU Learning Website

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

**[中文版](docs/README-cn.md)**

A comprehensive WebGPU graphics programming learning platform featuring interactive examples, tutorials, and API documentation.

## ✨ Features

- 📚 **Comprehensive Tutorials** - Complete learning path from basic concepts to advanced topics
- 🎮 **Interactive Examples** - Real-time WebGPU demos with live code editing
- 📖 **API Reference** - Complete WebGPU API documentation
- 🎨 **Modern Interface** - Responsive design built with Astro and Starlight
- 🚀 **High Performance** - Static generation for fast loading

## 🚀 Project Structure

```
.
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images and static resources
│   ├── components/           # Reusable Astro components
│   │   └── WebGPUCanvas.astro # Interactive WebGPU canvas component
│   ├── content/
│   │   └── docs/             # Documentation content (Markdown/MDX)
│   │       ├── guides/       # Learning guides
│   │       ├── reference/    # API reference
│   │       └── examples/     # Interactive examples
│   └── content.config.ts     # Content collections configuration
├── astro.config.mjs          # Astro and Starlight configuration
├── package.json
└── tsconfig.json
```

### Content Organization

- **Learning Guides** (`guides/`) - Hand-written tutorials and learning materials
- **API Reference** (`reference/`) - WebGPU API documentation
- **Examples** (`examples/`) - Interactive WebGPU demonstrations with live code execution

### Interactive Components

The project includes a custom `WebGPUCanvas` component that supports:
- Real-time WebGPU code execution
- WGSL shader code demonstrations
- Error handling and state management
- Multiple canvas instances support

## 🧞 Development Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at localhost:4321 |
| `pnpm build` | Build production site to ./dist/ |
| `pnpm preview` | Preview build locally before deploying |
| `pnpm astro check` | Type check the project |

## 🛠️ Tech Stack

- **Astro v5.6.1** - Modern static site generator
- **Starlight v0.35.2** - Documentation theme framework
- **TypeScript** - Strict type configuration
- **pnpm** - Package manager (required, not npm/yarn)
- **WebGPU API** - Modern graphics API

## 🚀 Quick Start

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/zhaozigu/webgpu-net-starlight.git
cd webgpu-net-starlight
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open http://localhost:4321 to start learning WebGPU!

## 📖 Learning Resources

- [WebGPU Specification](https://www.w3.org/TR/webgpu/) - Official WebGPU standard
- [WGSL Specification](https://www.w3.org/TR/WGSL/) - WebGPU Shading Language
- [Starlight Docs](https://starlight.astro.build/) - Learn more about the documentation framework
- [Astro Docs](https://docs.astro.build) - Learn more about Astro

## 🤝 Contributing

Issues and Pull Requests are welcome to help improve this learning platform!

## 📄 License

This project is licensed under the MIT License.