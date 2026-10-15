---
title: GPUSampler
description: 控制纹理过滤和越界坐标的不可变采样器
sidebar:
  order: 4
---

`GPUSampler` 用 `device.createSampler(descriptor)` 创建。创建之后不能修改。采样器本身没有额外方法，行为都在描述符里。

```typescript
interface GPUSamplerDescriptor {
  label?: string;
  addressModeU?: GPUAddressMode; // 默认 "clamp-to-edge"
  addressModeV?: GPUAddressMode;
  addressModeW?: GPUAddressMode;
  magFilter?: "nearest" | "linear"; // 默认 "nearest"
  minFilter?: "nearest" | "linear";
  mipmapFilter?: "nearest" | "linear";
  lodMinClamp?: number; // 默认 0
  lodMaxClamp?: number; // 默认 32
  compare?: GPUCompareFunction;
  maxAnisotropy?: number; // 默认 1
}

type GPUAddressMode = "clamp-to-edge" | "repeat" | "mirror-repeat";
```

绑定组布局里的采样器类型是另一回事：

| 布局类型 | 着色器用法 |
| --- | --- |
| `"filtering"` | `textureSample()`。放大和缩小过滤可以仍是 `"nearest"` |
| `"non-filtering"` | `textureLoad()`，或对不可过滤浮点格式采样 |
| `"comparison"` | 深度比较采样，描述符里要设置 `compare` |

`layout: "auto"` 会根据调用的是 `textureSample` 还是 `textureLoad` 选择类型。深度纹理不能使用 `"filtering"` 采样器，但可以用于 `"comparison"`。

## 相关页面

- 教程：[纹理与采样器](/guides/textures/)
- 规范：[GPUSampler](https://www.w3.org/TR/webgpu/#gpusampler)
