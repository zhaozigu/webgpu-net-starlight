---
title: WebGPU 入门
description: 开始学习 WebGPU 的第一步指南
---

WebGPU 是下一代 Web 图形 API，提供了现代化的 GPU 访问能力，支持高性能的图形渲染和通用计算。

## 什么是 WebGPU？

WebGPU 是一个现代化的 Web 标准，它提供了：

- **高性能图形渲染**：直接访问 GPU 硬件能力
- **计算着色器支持**：在 GPU 上执行并行计算任务
- **现代化设计**：基于 Vulkan、Metal 和 D3D12 等现代图形 API
- **跨平台兼容**：支持桌面和移动设备

## 浏览器支持

目前 WebGPU 在以下浏览器中可用：

- Chrome 113+ (默认启用)
- Firefox Nightly (需要启用实验功能)
- Safari Technology Preview (实验性支持)

## 第一个 WebGPU 程序

让我们创建一个简单的 WebGPU 应用程序：

```javascript
// 检查浏览器是否支持 WebGPU
if (!navigator.gpu) {
  throw new Error('WebGPU 不被当前浏览器支持');
}

// 请求 GPU 适配器
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error('无法获取 WebGPU 适配器');
}

// 请求 GPU 设备
const device = await adapter.requestDevice();

console.log('WebGPU 设备已成功初始化！');
```

## 下一步

- 学习 [渲染管线基础](/guides/render-pipeline)
- 了解 [着色器编程](/guides/shaders)
- 探索 [计算着色器](/guides/compute-shaders)

## 相关资源

- [WebGPU 官方规范](https://www.w3.org/TR/webgpu/)
- [WebGPU Shading Language (WGSL)](https://www.w3.org/TR/WGSL/)
- [WebGPU 示例](https://webgpu.github.io/webgpu-samples/)