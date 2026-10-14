---
title: GPUBuffer
description: GPU memory for vertices, indices, uniforms, and storage
sidebar:
  order: 2
---

A `GPUBuffer` is a block of GPU memory. Vertices, indices, uniforms, storage data, and indirect draw arguments all use one. Create it with `device.createBuffer(descriptor)`.

```typescript
interface GPUBufferDescriptor {
  label?: string;
  size: GPUSize64;          // bytes, multiple of 4
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

Flags can be combined, with two hard limits: `MAP_READ` may only be combined with `COPY_DST`, and `MAP_WRITE` may only be combined with `COPY_SRC`.

| Flag | Allowed operation |
| --- | --- |
| `MAP_READ` | `mapAsync(GPUMapMode.READ)` |
| `MAP_WRITE` | `mapAsync(GPUMapMode.WRITE)` |
| `COPY_SRC` | Source of `copyBufferToBuffer` or `copyBufferToTexture` |
| `COPY_DST` | Destination of a copy, or of `writeBuffer()` |
| `INDEX` | `setIndexBuffer()` |
| `VERTEX` | `setVertexBuffer()` |
| `UNIFORM` | Binding type `"uniform"` |
| `STORAGE` | Binding type `"storage"` or `"read-only-storage"` |
| `INDIRECT` | `drawIndirect()` and `dispatchWorkgroupsIndirect()` |
| `QUERY_RESOLVE` | Destination of `resolveQuerySet()` |

## Writing

The usual upload path is `queue.writeBuffer(buffer, bufferOffset, data)`. `bufferOffset` must be a multiple of 4, and the buffer `usage` must include `COPY_DST`.

`mappedAtCreation: true` creates the buffer already mapped, so `getMappedRange()` works immediately even without `MAP_READ` or `MAP_WRITE`. Call `unmap()` before submitting commands that use the buffer.

A mapped buffer cannot be used by the GPU at the same time. `mapAsync()` waits until the GPU is done with the range. `unmap()` or `destroy()` detaches every `ArrayBuffer` returned by `getMappedRange()`.

## Related pages

- Guides: [Buffers](/en/guides/buffers/), [Uniform buffers](/en/guides/uniforms/)
- Specification: [GPUBuffer](https://www.w3.org/TR/webgpu/#gpubuffer)
