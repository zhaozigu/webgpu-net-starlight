---
title: GPUSampler
description: Immutable sampler controlling filtering and out-of-range coordinates
sidebar:
  order: 4
---

Create a `GPUSampler` with `device.createSampler(descriptor)`. It cannot be changed afterwards. The sampler object has no extra methods; the behavior lives in the descriptor.

```typescript
interface GPUSamplerDescriptor {
  label?: string;
  addressModeU?: GPUAddressMode; // default "clamp-to-edge"
  addressModeV?: GPUAddressMode;
  addressModeW?: GPUAddressMode;
  magFilter?: "nearest" | "linear"; // default "nearest"
  minFilter?: "nearest" | "linear";
  mipmapFilter?: "nearest" | "linear";
  lodMinClamp?: number; // default 0
  lodMaxClamp?: number; // default 32
  compare?: GPUCompareFunction;
  maxAnisotropy?: number; // default 1
}

type GPUAddressMode = "clamp-to-edge" | "repeat" | "mirror-repeat";
```

The sampler type on a bind group layout is separate:

| Layout type | Shader use |
| --- | --- |
| `"filtering"` | `textureSample()`. The min and mag filters may still be `"nearest"` |
| `"non-filtering"` | `textureLoad()`, or sampling an unfilterable float format |
| `"comparison"` | Depth comparison sampling. The descriptor sets `compare` |

`layout: "auto"` picks the type from whether the shader calls `textureSample` or `textureLoad`. A depth texture cannot use a `"filtering"` sampler, but it can use a `"comparison"` sampler.

## Related pages

- Guide: [Textures and samplers](/en/guides/textures/)
- Specification: [GPUSampler](https://www.w3.org/TR/webgpu/#gpusampler)
