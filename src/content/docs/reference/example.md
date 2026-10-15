---
title: WebGPU API 参考
description: WebGPU 核心对象的索引，链到缓冲区、纹理、绑定组和管线。
sidebar:
  label: 概览
  order: 1
---

这一节按对象整理 WebGPU 的常用接口。每个对象页只写规范里真实存在的成员，并链到对应教程。完整定义以 [WebGPU 规范](https://www.w3.org/TR/webgpu/) 为准。

## 从适配器到队列

```typescript
interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): GPUTextureFormat;
}

interface GPUAdapter {
  readonly features: GPUSupportedFeatures;
  readonly limits: GPUSupportedLimits;
  readonly info: GPUAdapterInfo;
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
}
```

`GPUDevice` 是创建资源的入口。常用方法：

| 方法 | 创建的对象 |
| --- | --- |
| `createBuffer` | [GPUBuffer](/reference/gpu-buffer/) |
| `createTexture` | [GPUTexture](/reference/gpu-texture/) |
| `createSampler` | [GPUSampler](/reference/gpu-sampler/) |
| `createBindGroupLayout` / `createBindGroup` | [GPUBindGroup](/reference/gpu-bind-group/) |
| `createPipelineLayout` | 把若干绑定组布局合成管线布局 |
| `createShaderModule` | 编译 WGSL |
| `createRenderPipeline` | [GPURenderPipeline](/reference/gpu-render-pipeline/) |
| `createComputePipeline` | [GPUComputePipeline](/reference/gpu-compute-pipeline/) |
| `createCommandEncoder` | [GPUCommandEncoder](/reference/gpu-command-encoder/) |
| `pushErrorScope` / `popErrorScope` | 捕获校验错误 |
| `destroy` | 销毁设备和它创建的资源 |

设备上还有只读的 `features`、`limits` 和 `queue`。`lost` 是一个会在设备丢失时兑现的 Promise。异步校验错误如果没有被 error scope 捕获，会以 `uncapturederror` 事件发出。

`getPreferredCanvasFormat()` 只返回 `"rgba8unorm"` 或 `"bgra8unorm"`。画布颜色附件和片元目标的 `format` 要用这个值。

## 资源怎么进着色器

- 顶点数据和索引数据是缓冲，绘制时用 `setVertexBuffer()` / `setIndexBuffer()`。
- Uniform、存储缓冲、纹理和采样器放进绑定组，用 `setBindGroup()`。
- 命令先录进 `GPUCommandEncoder`，`finish()` 得到 `GPUCommandBuffer`，再由 `GPUQueue.submit()` 执行。

教程顺序：

1. [WGSL 基础](/guides/wgsl/)
2. [渲染管线](/guides/render-pipeline/)
3. [缓冲区](/guides/buffers/)
4. [绑定组](/guides/bind-groups/)
5. [Uniform 缓冲区](/guides/uniforms/)
6. [纹理与采样器](/guides/textures/)
7. [深度缓冲](/guides/depth/)
8. [计算着色器](/guides/compute-shaders/)

## 更多资料

- [WebGPU 规范](https://www.w3.org/TR/webgpu/)
- [WGSL 规范](https://www.w3.org/TR/WGSL/)
- [MDN WebGPU API](https://developer.mozilla.org/docs/Web/API/WebGPU_API)
