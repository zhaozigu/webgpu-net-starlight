---
title: GPUBuffer
description: 顶点、索引、uniform 和存储数据使用的 GPU 缓冲
sidebar:
  order: 2
---

`GPUBuffer` 是一块 GPU 内存。顶点、索引、uniform、存储数据和间接绘制参数都用它。用 `device.createBuffer(descriptor)` 创建。

```typescript
interface GPUBufferDescriptor {
  label?: string;
  size: GPUSize64;          // 字节数，必须是 4 的倍数
  usage: GPUBufferUsageFlags;
  mappedAtCreation?: boolean;
}

interface GPUBuffer {
  readonly size: GPUSize64Out;
  readonly usage: GPUFlagsConstant;
  readonly mapState: "unmapped" | "pending" | "mapped";

  mapAsync(mode: GPUMapModeFlags, offset?: GPUSize64, size?: GPUSize64): Promise<undefined>;
  getMappedRange(offset?: GPUSize64, size?: GPUSize64): ArrayBuffer;
  unmap(): undefined;
  destroy(): undefined;
}
```

## usage

这些标志可以组合。有两条硬限制：`MAP_READ` 只能再加 `COPY_DST`，`MAP_WRITE` 只能再加 `COPY_SRC`。

| 标志 | 允许的操作 |
| --- | --- |
| `MAP_READ` | `mapAsync(GPUMapMode.READ)` |
| `MAP_WRITE` | `mapAsync(GPUMapMode.WRITE)` |
| `COPY_SRC` | 作为 `copyBufferToBuffer` / `copyBufferToTexture` 的源 |
| `COPY_DST` | 作为复制的目标，或 `writeBuffer()` 的目标 |
| `INDEX` | `setIndexBuffer()` |
| `VERTEX` | `setVertexBuffer()` |
| `UNIFORM` | 绑定类型 `"uniform"` |
| `STORAGE` | 绑定类型 `"storage"` 或 `"read-only-storage"` |
| `INDIRECT` | `drawIndirect()`、`dispatchWorkgroupsIndirect()` |
| `QUERY_RESOLVE` | `resolveQuerySet()` 的目标 |

## 写入

最常见的上传方式是 `queue.writeBuffer(buffer, bufferOffset, data)`。`bufferOffset` 必须是 4 的倍数，缓冲的 `usage` 必须包含 `COPY_DST`。

`mappedAtCreation: true` 会让缓冲一开始就处于映射状态，可以立刻 `getMappedRange()`，即使 `usage` 里没有 `MAP_READ` 或 `MAP_WRITE`。写完必须 `unmap()`，否则不能提交使用这块缓冲的命令。

映射状态下的缓冲不能同时被 GPU 使用。`mapAsync()` 会等到 GPU 用完对应范围。`unmap()` 或 `destroy()` 会使 `getMappedRange()` 返回的 `ArrayBuffer` 失效。

## 相关页面

- 教程：[缓冲区](/guides/buffers/)、[Uniform 缓冲区](/guides/uniforms/)
- 规范：[GPUBuffer](https://www.w3.org/TR/webgpu/#gpubuffer)
