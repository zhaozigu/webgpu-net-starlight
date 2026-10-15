---
title: GPUBindGroup
description: 把缓冲、纹理和采样器按绑定号交给着色器
sidebar:
  order: 5
---

`GPUBindGroup` 用 `device.createBindGroup(descriptor)` 创建。它本身没有方法。布局决定每个绑定号是什么资源，绑定组填入具体对象。

```typescript
interface GPUBindGroupDescriptor {
  label?: string;
  layout: GPUBindGroupLayout;
  entries: GPUBindGroupEntry[];
}

interface GPUBindGroupEntry {
  binding: GPUIndex32;
  resource: GPUBindingResource;
}

type GPUBindingResource =
  | GPUSampler
  | GPUTexture
  | GPUTextureView
  | GPUBuffer
  | GPUBufferBinding
  | GPUExternalTexture;

interface GPUBufferBinding {
  buffer: GPUBuffer;
  offset?: GPUSize64;
  size?: GPUSize64;
}
```

直接传 `GPUBuffer` 等价于 `{ buffer }`。直接传 `GPUTexture` 等价于它的默认视图。

## 布局

```typescript
interface GPUBindGroupLayoutEntry {
  binding: GPUIndex32;
  visibility: GPUShaderStageFlags;
  buffer?: GPUBufferBindingLayout;
  sampler?: GPUSamplerBindingLayout;
  texture?: GPUTextureBindingLayout;
  storageTexture?: GPUStorageTextureBindingLayout;
  externalTexture?: GPUExternalTextureBindingLayout;
}
```

每一项只能填写一种资源成员。`visibility` 是 `GPUShaderStage.VERTEX`（0x1）、`FRAGMENT`（0x2）、`COMPUTE`（0x4）的组合。

```typescript
interface GPUBufferBindingLayout {
  type?: "uniform" | "storage" | "read-only-storage"; // 默认 "uniform"
  hasDynamicOffset?: boolean; // 默认 false
  minBindingSize?: GPUSize64; // 默认 0
}

interface GPUTextureBindingLayout {
  sampleType?: "float" | "unfilterable-float" | "depth" | "sint" | "uint"; // 默认 "float"
  viewDimension?: GPUTextureViewDimension; // 默认 "2d"
  multisampled?: boolean; // 默认 false
}

interface GPUStorageTextureBindingLayout {
  access?: "write-only" | "read-only" | "read-write"; // 默认 "write-only"
  format: GPUTextureFormat;
  viewDimension?: GPUTextureViewDimension; // 默认 "2d"
}

interface GPUSamplerBindingLayout {
  type?: "filtering" | "non-filtering" | "comparison"; // 默认 "filtering"
}
```

`minBindingSize` 为 0 时，管线创建不检查大小，绘制或 dispatch 时再检查缓冲是否盖得住着色器变量。Uniform 的 `offset` 必须是 `minUniformBufferOffsetAlignment` 的倍数，默认限制是 256。

`createPipelineLayout({ bindGroupLayouts })` 的数组下标就是 `@group` 编号。`GPURenderPipeline` 和 `GPUComputePipeline` 都有 `getBindGroupLayout(index)`；管线使用 `layout: "auto"` 时，用它取出推断布局。

## 相关页面

- 教程：[绑定组](/guides/bind-groups/)
- 规范：[GPUBindGroup](https://www.w3.org/TR/webgpu/#gpubindgroup)
