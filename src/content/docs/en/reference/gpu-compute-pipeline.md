---
title: GPUComputePipeline
description: A pipeline with only a compute stage
sidebar:
  order: 7
---

Create a `GPUComputePipeline` with `device.createComputePipeline(descriptor)`. The async form is `createComputePipelineAsync()`. It has one programmable stage.

```typescript
interface GPUComputePipelineDescriptor {
  label?: string;
  layout: GPUPipelineLayout | "auto";
  compute: {
    module: GPUShaderModule;
    entryPoint?: string;
    constants?: Record<string, number>;
  };
}
```

The entry point must be marked `@compute` and `@workgroup_size`. `getBindGroupLayout(index)` works the same way as on a render pipeline.

A compute stage has no vertex buffers and no color attachments. Inputs and outputs are bindings:

- a `"storage"` buffer, or WGSL `var<storage, read_write>`
- a `"read-only-storage"` buffer
- a `"uniform"` buffer
- a storage texture whose access is `"write-only"`, `"read-only"`, or `"read-write"`

`"write-only"` and `"read-only"` access for `"rgba8unorm"` are core. `"read-write"` requires the `texture-formats-tier2` feature.

Dispatch uses `GPUComputePassEncoder`:

```typescript
interface GPUComputePassEncoder {
  setPipeline(pipeline: GPUComputePipeline): undefined;
  setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup | null, dynamicOffsets?: number[]): undefined;
  dispatchWorkgroups(workgroupCountX: GPUSize32, workgroupCountY?: GPUSize32, workgroupCountZ?: GPUSize32): undefined;
  dispatchWorkgroupsIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): undefined;
  end(): undefined;
}
```

The arguments to `dispatchWorkgroups()` are workgroup counts. The thread count is that count multiplied by `@workgroup_size`. `workgroupCountY` and `workgroupCountZ` default to 1.

## Related pages

- Guide: [Compute shaders](/en/guides/compute-shaders/)
- Specification: [GPUComputePipeline](https://www.w3.org/TR/webgpu/#gpucomputepipeline)
