---
title: WebGPU API 参考
description: WebGPU 核心 API 接口和方法参考文档
---

WebGPU API 提供了访问现代 GPU 功能的完整接口集。以下是主要的 API 组件和接口。

## 核心接口

### Navigator.gpu

全局 GPU 接口，用于请求 WebGPU 适配器。

```typescript
interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): GPUTextureFormat;
}
```

### GPUAdapter

表示 GPU 适配器，提供设备请求和能力查询功能。

```typescript
interface GPUAdapter {
  readonly features: GPUSupportedFeatures;
  readonly limits: GPUSupportedLimits;
  readonly info: GPUAdapterInfo;
  
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
}
```

### GPUDevice

WebGPU 的核心接口，用于创建所有 GPU 资源。

```typescript
interface GPUDevice {
  readonly features: GPUSupportedFeatures;
  readonly limits: GPUSupportedLimits;
  readonly queue: GPUQueue;
  
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
  createTexture(descriptor: GPUTextureDescriptor): GPUTexture;
  createSampler(descriptor?: GPUSamplerDescriptor): GPUSampler;
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
  createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline;
}
```

## 渲染相关

### GPURenderPipeline

渲染管线对象，定义图形渲染的完整流程。

### GPUTexture

纹理资源，用于存储图像数据。

### GPUBuffer

缓冲区资源，用于存储顶点、索引或其他数据。

## 计算相关

### GPUComputePipeline

计算管线对象，用于执行计算着色器。

### GPUBindGroup

资源绑定组，将着色器资源绑定到管线。

## 更多信息

- [WebGPU 官方规范](https://www.w3.org/TR/webgpu/)
- [WebGPU Explainer](https://gpuweb.github.io/gpuweb/explainer/)
- [MDN WebGPU 文档](https://developer.mozilla.org/docs/Web/API/WebGPU_API)
