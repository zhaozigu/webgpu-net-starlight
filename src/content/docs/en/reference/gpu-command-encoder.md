---
title: GPUCommandEncoder
description: Record render passes, compute passes, and copies, then submit them to the queue
sidebar:
  order: 8
---

Create a `GPUCommandEncoder` with `device.createCommandEncoder()`. It records a command buffer and does not run the work. Execution happens in `device.queue.submit()`.

```typescript
interface GPUCommandEncoder {
  beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder;
  beginComputePass(descriptor?: GPUComputePassDescriptor): GPUComputePassEncoder;

  copyBufferToBuffer(
    source: GPUBuffer,
    sourceOffset: GPUSize64,
    destination: GPUBuffer,
    destinationOffset: GPUSize64,
    size: GPUSize64,
  ): undefined;
  copyBufferToTexture(source: GPUTexelCopyBufferInfo, destination: GPUTexelCopyTextureInfo, copySize: GPUExtent3D): undefined;
  copyTextureToBuffer(source: GPUTexelCopyTextureInfo, destination: GPUTexelCopyBufferInfo, copySize: GPUExtent3D): undefined;
  copyTextureToTexture(source: GPUTexelCopyTextureInfo, destination: GPUTexelCopyTextureInfo, copySize: GPUExtent3D): undefined;

  clearBuffer(buffer: GPUBuffer, offset?: GPUSize64, size?: GPUSize64): undefined;
  resolveQuerySet(querySet: GPUQuerySet, firstQuery: GPUSize32, queryCount: GPUSize32, destination: GPUBuffer, destinationOffset: GPUSize64): undefined;

  finish(descriptor?: GPUCommandBufferDescriptor): GPUCommandBuffer;
}
```

After `beginRenderPass()` or `beginComputePass()`, call `end()` on that pass before beginning another pass or calling `finish()`. The encoder cannot be used after `finish()`.

The render pass methods used most often are `setPipeline`, `setBindGroup`, `setVertexBuffer`, `setIndexBuffer`, `draw`, `drawIndexed`, and `end`. Indirect draws use `drawIndirect` and `drawIndexedIndirect`.

## GPUQueue

`GPUDevice.queue` is the device's `GPUQueue`.

```typescript
interface GPUQueue {
  submit(commandBuffers: GPUCommandBuffer[]): undefined;
  onSubmittedWorkDone(): Promise<undefined>;

  writeBuffer(
    buffer: GPUBuffer,
    bufferOffset: GPUSize64,
    data: BufferSource,
    dataOffset?: GPUSize64,
    size?: GPUSize64,
  ): undefined;

  writeTexture(
    destination: GPUTexelCopyTextureInfo,
    data: BufferSource,
    dataLayout: GPUTexelCopyBufferLayout,
    size: GPUExtent3D,
  ): undefined;

  copyExternalImageToTexture(
    source: GPUCopyExternalImageSourceInfo,
    destination: GPUCopyExternalImageDestInfo,
    copySize: GPUExtent3D,
  ): undefined;
}
```

A command buffer passed to `submit()` can be submitted only once. On one queue, `writeBuffer()`, `writeTexture()`, and `submit()` run in call order.

`onSubmittedWorkDone()` resolves when the work submitted to that queue before this call has finished. It does not cover commands submitted later.

For `writeBuffer()`, `dataOffset` and `size` are counted in elements when `data` is a `TypedArray`, and in bytes when `data` is an `ArrayBuffer` or `DataView`. If `size` is omitted, the copy runs from `dataOffset` through the end of `data`. The number of bytes copied must be a multiple of 4.

## Related pages

- Guides: [Fundamental objects](/en/guides/fundamental-object/), [Render pipeline](/en/guides/render-pipeline/)
- Specification: [GPUCommandEncoder](https://www.w3.org/TR/webgpu/#gpucommandencoder), [GPUQueue](https://www.w3.org/TR/webgpu/#gpuqueue)
