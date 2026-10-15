---
title: GPUBindGroup
description: Attach buffers, textures, and samplers to shader binding numbers
sidebar:
  order: 5
---

Create a `GPUBindGroup` with `device.createBindGroup(descriptor)`. The object has no methods. The layout decides what kind of resource each binding number holds, and the bind group supplies the objects.

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

Passing a `GPUBuffer` directly is equivalent to a binding of that buffer. Passing a `GPUTexture` directly is equivalent to its default view.

## Layout

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

Each entry sets only one resource member. `visibility` combines `GPUShaderStage.VERTEX` (0x1), `FRAGMENT` (0x2), and `COMPUTE` (0x4).

```typescript
interface GPUBufferBindingLayout {
  type?: "uniform" | "storage" | "read-only-storage"; // default "uniform"
  hasDynamicOffset?: boolean; // default false
  minBindingSize?: GPUSize64; // default 0
}

interface GPUTextureBindingLayout {
  sampleType?: "float" | "unfilterable-float" | "depth" | "sint" | "uint"; // default "float"
  viewDimension?: GPUTextureViewDimension; // default "2d"
  multisampled?: boolean; // default false
}

interface GPUStorageTextureBindingLayout {
  access?: "write-only" | "read-only" | "read-write"; // default "write-only"
  format: GPUTextureFormat;
  viewDimension?: GPUTextureViewDimension; // default "2d"
}

interface GPUSamplerBindingLayout {
  type?: "filtering" | "non-filtering" | "comparison"; // default "filtering"
}
```

When `minBindingSize` is 0, pipeline creation does not check the size. Draw and dispatch validate that the buffer covers the shader variable. A uniform `offset` must be a multiple of `minUniformBufferOffsetAlignment`, which defaults to 256.

The array index in `createPipelineLayout({ bindGroupLayouts })` is the `@group` number. Both `GPURenderPipeline` and `GPUComputePipeline` provide `getBindGroupLayout(index)`. Use it to read the inferred layout when the pipeline was created with `layout: "auto"`.

## Related pages

- Guide: [Bind groups](/en/guides/bind-groups/)
- Specification: [GPUBindGroup](https://www.w3.org/TR/webgpu/#gpubindgroup)
