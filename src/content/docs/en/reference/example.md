---
title: WebGPU API Reference
description: Index of the core WebGPU objects, with links to buffers, textures, bind groups, and pipelines
sidebar:
  label: Overview
  order: 1
---

These pages list the WebGPU interfaces used by the tutorials. Each page stays with members that exist in the specification. The complete definitions are in the [WebGPU specification](https://www.w3.org/TR/webgpu/).

## From the adapter to the queue

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

`GPUDevice` creates the resources. Common methods:

| Method | Object |
| --- | --- |
| `createBuffer` | [GPUBuffer](/en/reference/gpu-buffer/) |
| `createTexture` | [GPUTexture](/en/reference/gpu-texture/) |
| `createSampler` | [GPUSampler](/en/reference/gpu-sampler/) |
| `createBindGroupLayout` / `createBindGroup` | [GPUBindGroup](/en/reference/gpu-bind-group/) |
| `createPipelineLayout` | Combines bind group layouts into a pipeline layout |
| `createShaderModule` | Compiles WGSL |
| `createRenderPipeline` | [GPURenderPipeline](/en/reference/gpu-render-pipeline/) |
| `createComputePipeline` | [GPUComputePipeline](/en/reference/gpu-compute-pipeline/) |
| `createCommandEncoder` | [GPUCommandEncoder](/en/reference/gpu-command-encoder/) |
| `pushErrorScope` / `popErrorScope` | Capture validation errors |
| `destroy` | Destroy the device and resources it created |

The device also exposes read-only `features`, `limits`, and `queue`. `lost` is a promise that resolves when the device is lost. Validation errors that are not captured by an error scope are delivered as `uncapturederror` events.

`getPreferredCanvasFormat()` returns only `"rgba8unorm"` or `"bgra8unorm"`. Use that value for the canvas color attachment and the fragment target `format`.

## How resources reach a shader

- Vertex and index data are buffers, bound with `setVertexBuffer()` and `setIndexBuffer()`.
- Uniforms, storage buffers, textures, and samplers go in a bind group and are bound with `setBindGroup()`.
- Commands are recorded into a `GPUCommandEncoder`. `finish()` returns a `GPUCommandBuffer`, and `GPUQueue.submit()` runs it.

Tutorial order:

1. [WGSL basics](/en/guides/wgsl/)
2. [Render pipeline](/en/guides/render-pipeline/)
3. [Buffers](/en/guides/buffers/)
4. [Bind groups](/en/guides/bind-groups/)
5. [Uniform buffers](/en/guides/uniforms/)
6. [Textures and samplers](/en/guides/textures/)
7. [Depth buffer](/en/guides/depth/)
8. [Compute shaders](/en/guides/compute-shaders/)

## Further reading

- [WebGPU specification](https://www.w3.org/TR/webgpu/)
- [WGSL specification](https://www.w3.org/TR/WGSL/)
- [MDN WebGPU API](https://developer.mozilla.org/docs/Web/API/WebGPU_API)
