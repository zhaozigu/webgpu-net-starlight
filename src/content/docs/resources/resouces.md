---
title: WebGPU 相关资料
description: 官方文档、实例等资源收集
---

## 文档

- 主流浏览器的 [支持情况](https://caniuse.com/webgpu) 查看
- [WebGPU 官方规范](https://www.w3.org/TR/webgpu/)
- [WebGPU Shading Language (WGSL)](https://www.w3.org/TR/WGSL/)
- [MDN 的 WebGPU API 文档](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [WebGPU 示例](https://webgpu.github.io/webgpu-samples/)
- 
## 框架

- [Babylon.js](https://www.babylonjs.com/) 是一个 Web 渲染引擎，v5.0 之后加入对 WebGPU 的 [支持](https://doc.babylonjs.com/setup/support/webGPU)。
- [Three.js 的 WebGPU 示例](https://threejs.org/examples/?q=webgpu)

## 其它语言

WebGPU 并非局限于 JavaScript/TypeScript，它同样支持 Rust 和 C++ 等语言。从浏览器实现层面来看，各大浏览器厂商采用了不同的技术栈：Chromium 和 Chrome 使用 C++ 来实现 WebGPU 功能，而 Firefox 则基于 Rust 语言构建其 WebGPU 实现。

开发者也可以选择直接使用这些底层图形库进行开发应用，特别是桌面应用，或者使用 [WebAssembly](https://webassembly.org/) 技术直接嵌入到网页中。

### Rust

[wgpu](https://wgpu.rs/)，基于 Rust 语言实现的 WebGPU 图形库，[Github 仓库地址](https://github.com/gfx-rs/wgpu)

### C++

[Google Dawn](https://dawn.googlesource.com/dawn) 是基于 C++ 实现的 WebGPU 图形库。[Github 镜像仓库](https://github.com/google/dawn)
