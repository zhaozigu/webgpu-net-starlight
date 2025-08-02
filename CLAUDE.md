# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a documentation site built with Astro and Starlight, focused on WebGPU-related content. The project name "webgpu-net" suggests it's intended to document WebGPU networking or web framework topics.

## Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at localhost:4321 |
| `pnpm build` | Build production site to ./dist/ |
| `pnpm preview` | Preview build locally before deploying |
| `pnpm astro check` | Type check the project |

## Architecture

- **Framework**: Astro with Starlight (documentation-focused theme)
- **Package Manager**: pnpm
- **Content System**: File-based with `.md` and `.mdx` files in `src/content/docs/`
- **TypeScript**: Strict configuration extending Astro's recommended settings
- **Routing**: File-based routing where each file in `src/content/docs/` becomes a route

### Key Directories

- `src/content/docs/` - Documentation pages (Markdown/MDX)
- `src/assets/` - Images and static assets for content
- `public/` - Static files served directly
- `astro.config.mjs` - Astro and Starlight configuration

### Content Structure

The site uses Starlight's sidebar configuration with:
- **Guides** section with manual entries
- **Reference** section with auto-generated navigation from directory structure

### Configuration

- Main config in `astro.config.mjs` defines site title, social links, and sidebar structure
- Content collections defined in `src/content.config.ts` using Starlight's schema
- TypeScript config extends Astro's strict preset

## Development Notes

- Content is written in Markdown/MDX with frontmatter for metadata
- Images should be placed in `src/assets/` and referenced with relative links
- Sidebar navigation is configured in `astro.config.mjs`
- The site uses Starlight components like Card and CardGrid for enhanced layouts