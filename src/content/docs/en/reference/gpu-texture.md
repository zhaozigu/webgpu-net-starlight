---
title: GPUTexture
description: Textures used for sampling, storage, and render attachments
sidebar:
  order: 3
---

Create a `GPUTexture` with `device.createTexture(descriptor)`. Sampling, storage, and color or depth attachments are all uses of the same object.

```typescript
interface GPUTextureDescriptor {
  label?: string;
  size: GPUExtent3D;
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
  dimension?: "1d" | "2d" | "3d"; // default "2d"
  mipLevelCount?: GPUIntegerCoordinate; // default 1
  sampleCount?: GPUSize32; // default 1
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

`size` may be an array of width, height, and depth-or-array-layers, or an object with those properties.

## usage

| Flag | Allowed operation |
| --- | --- |
| `COPY_SRC` | Source of a texture copy |
| `COPY_DST` | Destination of a copy or of `writeTexture()` |
| `TEXTURE_BINDING` | Sampled or loaded in a shader |
| `STORAGE_BINDING` | Storage texture. The format must also allow that access mode |
| `RENDER_ATTACHMENT` | Color, depth, or multisampled attachment |

Plain color formats support `COPY_SRC`, `COPY_DST`, and `TEXTURE_BINDING`. `"rgba8unorm"` can also be a `"write-only"` storage texture and a render attachment. `"bgra8unorm"` can be a canvas format, but using it as a storage texture requires the `bgra8unorm-storage` feature.

`"depth24plus"` supports `RENDER_ATTACHMENT`. Its depth representation is opaque, so texel copies cannot read or write those depth values.

## Uploading

`queue.writeTexture(destination, data, dataLayout, size)`:

- `destination` is a `GPUTexelCopyTextureInfo`: texture, optional mip level, origin, and aspect
- `dataLayout` is a `GPUTexelCopyBufferLayout`: optional offset, `bytesPerRow`, and `rowsPerImage`
- A copy of more than one texel-block row must set `bytesPerRow`, and that value must be a multiple of 256
- `offset` defaults to 0 and, when set, must be a multiple of 512

The destination of `copyExternalImageToTexture()` must also include both `RENDER_ATTACHMENT` and `COPY_DST`.

Shader bindings normally take `texture.createView()`. The current specification also accepts a `GPUTexture` directly, which means the default view.

## Related pages

- Guides: [Textures and samplers](/en/guides/textures/), [Depth buffer](/en/guides/depth/), [Compute shaders](/en/guides/compute-shaders/)
- Specification: [GPUTexture](https://www.w3.org/TR/webgpu/#gputexture)
