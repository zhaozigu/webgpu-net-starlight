---
title: GPUTexture
description: 采样、存储和渲染附件使用的纹理
sidebar:
  order: 3
---

`GPUTexture` 用 `device.createTexture(descriptor)` 创建。采样、作为存储纹理，以及作为颜色或深度附件，都是它的用途。

```typescript
interface GPUTextureDescriptor {
  label?: string;
  size: GPUExtent3D;
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
  dimension?: "1d" | "2d" | "3d"; // 默认 "2d"
  mipLevelCount?: GPUIntegerCoordinate; // 默认 1
  sampleCount?: GPUSize32; // 默认 1
  viewFormats?: GPUTextureFormat[];
}

interface GPUTexture {
  createView(descriptor?: GPUTextureViewDescriptor): GPUTextureView;
  destroy(): undefined;

  readonly width: GPUIntegerCoordinateOut;
  readonly height: GPUIntegerCoordinateOut;
  readonly depthOrArrayLayers: GPUIntegerCoordinateOut;
  readonly mipLevelCount: GPUIntegerCoordinateOut;
  readonly sampleCount: GPUSize32Out;
  readonly format: GPUTextureFormat;
  readonly usage: GPUFlagsConstant;
  readonly dimension: GPUTextureDimension;
}
```

`size` 可以是 `[width, height, depthOrArrayLayers]`，也可以是 `{ width, height, depthOrArrayLayers }`。

## usage

| 标志 | 允许的操作 |
| --- | --- |
| `COPY_SRC` | 作为纹理复制的源 |
| `COPY_DST` | 作为复制或 `writeTexture()` 的目标 |
| `TEXTURE_BINDING` | 在着色器里被采样或 `textureLoad` |
| `STORAGE_BINDING` | 作为存储纹理。格式还必须支持对应的访问模式 |
| `RENDER_ATTACHMENT` | 作为颜色、深度或多重采样附件 |

普通颜色格式都支持 `COPY_SRC`、`COPY_DST` 和 `TEXTURE_BINDING`。`"rgba8unorm"` 还可以作为 `"write-only"` 存储纹理和渲染附件。`"bgra8unorm"` 可以画到画布上，但作为存储纹理需要 `bgra8unorm-storage` feature。

`"depth24plus"` 支持 `RENDER_ATTACHMENT`。它的深度表示不透明，不能用 texel copy 读写深度值。

## 上传

`queue.writeTexture(destination, data, dataLayout, size)`：

- `destination` 是 `GPUTexelCopyTextureInfo`：`{ texture, mipLevel?, origin?, aspect? }`
- `dataLayout` 是 `GPUTexelCopyBufferLayout`：`{ offset?, bytesPerRow?, rowsPerImage? }`
- 多于一行时必须提供 `bytesPerRow`，并且它必须是 256 的倍数
- `offset` 默认 0，如果设置，必须是 512 的倍数

`copyExternalImageToTexture()` 的目标还必须同时带有 `RENDER_ATTACHMENT` 和 `COPY_DST`。

绑定到着色器时，资源一般是 `texture.createView()`。当前规范也允许直接传入 `GPUTexture`，表示默认视图。

## 相关页面

- 教程：[纹理与采样器](/guides/textures/)、[深度缓冲](/guides/depth/)、[计算着色器](/guides/compute-shaders/)
- 规范：[GPUTexture](https://www.w3.org/TR/webgpu/#gputexture)
