---
title: GPUCommandEncoder
description: 录制渲染通道、计算通道和复制命令，再提交到队列
sidebar:
  order: 8
---

`GPUCommandEncoder` 用 `device.createCommandEncoder()` 创建。它把操作录进命令缓冲，自己不执行。执行发生在 `device.queue.submit()`。

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

一次 `beginRenderPass()` 或 `beginComputePass()` 之后，必须先 `end()` 那个通道，才能再开始别的通道或调用 `finish()`。`finish()` 之后编码器不能再使用。

渲染通道编码器上最常用的方法是 `setPipeline`、`setBindGroup`、`setVertexBuffer`、`setIndexBuffer`、`draw`、`drawIndexed` 和 `end`。间接绘制使用 `drawIndirect` / `drawIndexedIndirect`。

## GPUQueue

`GPUDevice.queue` 是这条设备的 `GPUQueue`。

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

`submit()` 接受的命令缓冲只能提交一次。同一队列上的 `writeBuffer()`、`writeTexture()` 和 `submit()` 按调用顺序生效。

`onSubmittedWorkDone()` 在这次调用之前提交到该队列的工作完成时兑现。它不表示之后又提交的命令也完成了。

`dataOffset` 和 `size` 的单位取决于 `data`：传 `TypedArray` 时按元素计，传 `ArrayBuffer` 或 `DataView` 时按字节计。省略 `size` 时，从 `dataOffset` 一直复制到数据末尾。复制到 GPU 的字节数必须是 4 的倍数。

## 相关页面

- 教程：[基础对象](/guides/fundamental-object/)、[渲染管线](/guides/render-pipeline/)
- 规范：[GPUCommandEncoder](https://www.w3.org/TR/webgpu/#gpucommandencoder)、[GPUQueue](https://www.w3.org/TR/webgpu/#gpuqueue)
