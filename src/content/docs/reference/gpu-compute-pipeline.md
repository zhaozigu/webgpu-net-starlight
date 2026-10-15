---
title: GPUComputePipeline
description: 只包含计算阶段的管线
sidebar:
  order: 7
---

`GPUComputePipeline` 用 `device.createComputePipeline(descriptor)` 创建，异步版本是 `createComputePipelineAsync()`。它只有一个可编程阶段。

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

入口函数必须带 `@compute` 和 `@workgroup_size`。`getBindGroupLayout(index)` 的用法与渲染管线相同。

计算阶段没有顶点缓冲和颜色附件。输入输出都在绑定组里：

- `"storage"` 缓冲，或 WGSL 的 `var<storage, read_write>`
- `"read-only-storage"` 缓冲
- `"uniform"` 缓冲
- 存储纹理，访问模式 `"write-only"`、`"read-only"` 或 `"read-write"`

`"rgba8unorm"` 的 `"write-only"` 和 `"read-only"` 是核心能力。`"read-write"` 需要 `texture-formats-tier2`。

调度在 `GPUComputePassEncoder` 上：

```typescript
interface GPUComputePassEncoder {
  setPipeline(pipeline: GPUComputePipeline): undefined;
  setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup | null, dynamicOffsets?: number[]): undefined;
  dispatchWorkgroups(workgroupCountX: GPUSize32, workgroupCountY?: GPUSize32, workgroupCountZ?: GPUSize32): undefined;
  dispatchWorkgroupsIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): undefined;
  end(): undefined;
}
```

`dispatchWorkgroups()` 的参数是工作组数量。总线程数是工作组数量乘以 `@workgroup_size`。`workgroupCountY` 和 `workgroupCountZ` 默认 1。

## 相关页面

- 教程：[计算着色器](/guides/compute-shaders/)
- 规范：[GPUComputePipeline](https://www.w3.org/TR/webgpu/#gpucomputepipeline)
