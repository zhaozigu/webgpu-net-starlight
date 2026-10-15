---
title: GPURenderPipeline
description: Graphics pipeline made from vertex state, primitives, depth, and fragment targets
sidebar:
  order: 6
---

Create a `GPURenderPipeline` with `device.createRenderPipeline(descriptor)`. The async form is `createRenderPipelineAsync()`. An invalid descriptor produces a validation error. The async method places creation failure on the returned promise.

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

The pipeline inherits `getBindGroupLayout(index)`.

## Vertex state

```typescript
interface GPUVertexState {
  module: GPUShaderModule;
  entryPoint?: string;
  constants?: Record<string, number>;
  buffers?: (GPUVertexBufferLayout | null)[];
}

interface GPUVertexBufferLayout {
  arrayStride: GPUSize64;
  stepMode?: "vertex" | "instance"; // default "vertex"
  attributes: GPUVertexAttribute[];
}

interface GPUVertexAttribute {
  format: GPUVertexFormat;
  offset: GPUSize64;
  shaderLocation: GPUIndex32;
}
```

`entryPoint` may be omitted when the module has exactly one entry point for that stage. `arrayStride` may be 0 only when the layout has no attributes. An attribute `offset` must be aligned to the format's component size, which is 4 bytes for `float32` components.

## Primitives and fragments

```typescript
interface GPUPrimitiveState {
  topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
  stripIndexFormat?: "uint16" | "uint32";
  frontFace?: "ccw" | "cw"; // default "ccw"
  cullMode?: "none" | "front" | "back"; // default "none"
  unclippedDepth?: boolean; // true requires the "depth-clip-control" feature
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
  writeMask?: GPUColorWriteFlags; // default: all channels
}
```

Omitting `fragment` means the pipeline cannot write a color attachment. Writing depth only still requires `depthStencil`. For a canvas, `targets[0].format` must equal `getPreferredCanvasFormat()`.

## Depth

```typescript
interface GPUDepthStencilState {
  format: GPUTextureFormat;
  depthWriteEnabled?: boolean; // required when the format has a depth aspect
  depthCompare?: GPUCompareFunction; // required when depthWriteEnabled is true
  stencilFront?: GPUStencilFaceState;
  stencilBack?: GPUStencilFaceState;
  stencilReadMask?: GPUStencilValue;  // default 0xFFFFFFFF
  stencilWriteMask?: GPUStencilValue; // default 0xFFFFFFFF
  depthBias?: number;
  depthBiasSlopeScale?: number;
  depthBiasClamp?: number;
}
```

`GPUCompareFunction` is `"never"`, `"less"`, `"equal"`, `"less-equal"`, `"greater"`, `"not-equal"`, `"greater-equal"`, or `"always"`. The depth format must match the depth attachment in the render pass.

Multisampling defaults to `count: 1`. A count greater than 1 must match the color attachment `sampleCount`.

## Related pages

- Guides: [Render pipeline](/en/guides/render-pipeline/), [Depth buffer](/en/guides/depth/)
- Specification: [GPURenderPipeline](https://www.w3.org/TR/webgpu/#gpurenderpipeline)
