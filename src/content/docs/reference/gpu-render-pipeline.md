---
title: GPURenderPipeline
description: 顶点状态、图元、深度和片元目标组成的图形管线
sidebar:
  order: 6
---

`GPURenderPipeline` 用 `device.createRenderPipeline(descriptor)` 创建。异步版本是 `createRenderPipelineAsync()`。两者都会在描述符不合法时产生校验错误；异步版本把创建失败放进返回的 Promise。

```typescript
interface GPURenderPipelineDescriptor {
  label?: string;
  layout: GPUPipelineLayout | "auto";
  vertex: GPUVertexState;
  primitive?: GPUPrimitiveState;
  depthStencil?: GPUDepthStencilState;
  multisample?: GPUMultisampleState;
  fragment?: GPUFragmentState;
}
```

管线继承 `getBindGroupLayout(index)`。

## 顶点状态

```typescript
interface GPUVertexState {
  module: GPUShaderModule;
  entryPoint?: string;
  constants?: Record<string, number>;
  buffers?: (GPUVertexBufferLayout | null)[];
}

interface GPUVertexBufferLayout {
  arrayStride: GPUSize64;
  stepMode?: "vertex" | "instance"; // 默认 "vertex"
  attributes: GPUVertexAttribute[];
}

interface GPUVertexAttribute {
  format: GPUVertexFormat;
  offset: GPUSize64;
  shaderLocation: GPUIndex32;
}
```

`entryPoint` 可以省略，前提是模块里只有一个适合该阶段的入口。`arrayStride` 为 0 只在没有属性时合法。属性的 `offset` 必须按格式的分量大小对齐，`float32` 分量是 4 字节。

## 图元和片元

```typescript
interface GPUPrimitiveState {
  topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
  stripIndexFormat?: "uint16" | "uint32";
  frontFace?: "ccw" | "cw"; // 默认 "ccw"
  cullMode?: "none" | "front" | "back"; // 默认 "none"
  unclippedDepth?: boolean; // 设为 true 需要 feature "depth-clip-control"
}

interface GPUFragmentState {
  module: GPUShaderModule;
  entryPoint?: string;
  constants?: Record<string, number>;
  targets: (GPUColorTargetState | null)[];
}

interface GPUColorTargetState {
  format: GPUTextureFormat;
  blend?: GPUBlendState;
  writeMask?: GPUColorWriteFlags; // 默认全部通道
}
```

省略 `fragment` 时不能写颜色附件。只更新深度时要同时提供 `depthStencil`。画到画布上时，`targets[0].format` 要等于 `getPreferredCanvasFormat()`。

格式带有深度分量时必须提供 `depthWriteEnabled`。`depthWriteEnabled` 为 `true` 时还必须提供 `depthCompare`。

## 深度

```typescript
interface GPUDepthStencilState {
  format: GPUTextureFormat;
  depthWriteEnabled?: boolean; // 深度格式下必填
  depthCompare?: GPUCompareFunction; // depthWriteEnabled 为 true 时必填
  stencilFront?: GPUStencilFaceState;
  stencilBack?: GPUStencilFaceState;
  stencilReadMask?: GPUStencilValue;  // 默认 0xFFFFFFFF
  stencilWriteMask?: GPUStencilValue; // 默认 0xFFFFFFFF
  depthBias?: number;
  depthBiasSlopeScale?: number;
  depthBiasClamp?: number;
}
```

`GPUCompareFunction` 是 `"never"`、`"less"`、`"equal"`、`"less-equal"`、`"greater"`、`"not-equal"`、`"greater-equal"`、`"always"`。深度格式和渲染通道里的深度附件格式必须相同。

多重采样默认 `count: 1`。大于 1 时，颜色附件的 `sampleCount` 也要一致。

## 相关页面

- 教程：[渲染管线](/guides/render-pipeline/)、[深度缓冲](/guides/depth/)
- 规范：[GPURenderPipeline](https://www.w3.org/TR/webgpu/#gpurenderpipeline)
