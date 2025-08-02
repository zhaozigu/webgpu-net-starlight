# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese-language WebGPU learning website ("WebGPU 学习网站") built with Astro and Starlight. It serves as a comprehensive educational platform for learning WebGPU graphics programming, featuring interactive examples, tutorials, and API documentation.

## Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at localhost:4321 |
| `pnpm build` | Build production site to ./dist/ |
| `pnpm preview` | Preview build locally before deploying |
| `pnpm astro check` | Type check the project |

## Architecture

- **Framework**: Astro v5.6.1 with Starlight v0.35.2 (documentation-focused theme)
- **Package Manager**: pnpm (required, not npm/yarn)
- **Content System**: File-based with `.md` and `.mdx` files in `src/content/docs/`
- **TypeScript**: Strict configuration extending Astro's recommended settings
- **Interactive Components**: Custom WebGPU canvas component for live demonstrations

### Key Directories

- `src/content/docs/` - Documentation pages (Markdown/MDX)
- `src/components/` - Reusable Astro components, including WebGPUCanvas
- `src/assets/` - Images and static assets for content
- `public/` - Static files served directly
- `astro.config.mjs` - Astro and Starlight configuration

### Content Structure

The site uses Starlight's sidebar configuration with Chinese labels:
- **学习指南** (Learning Guides) - Manual entries for tutorials
- **API 参考** (API Reference) - Auto-generated from reference directory
- **实例** (Examples) - Auto-generated from examples directory with interactive WebGPU demos

### Interactive WebGPU Component

The site features a custom `WebGPUCanvas.astro` component that:
- Accepts vertex and fragment shader code as props
- Handles WebGPU initialization and error states
- Provides live, interactive WebGPU demonstrations
- Includes proper error handling with Chinese error messages
- Supports multiple canvas instances on the same page

#### WebGPUCanvas Usage

```astro
<WebGPUCanvas
  id="unique-canvas-id"
  title="演示标题"
  width={800}
  height={600}
  vertexShader={`WGSL vertex shader code`}
  fragmentShader={`WGSL fragment shader code`}
/>
```

### Configuration

- Main config in `astro.config.mjs` defines Chinese site title and GitHub social link
- Content collections use Starlight's schema via `src/content.config.ts`
- TypeScript extends Astro's strict preset for maximum type safety

## Development Notes

- All content is in Chinese language, including UI text and error messages
- WGSL (WebGPU Shading Language) code is embedded directly in MDX files
- Interactive examples use real WebGPU API calls, requiring WebGPU-compatible browsers
- Content structure follows educational progression from basic concepts to advanced examples
- GitHub repository link points to `https://github.com/zhaozigu/webgpu-net-starlight`