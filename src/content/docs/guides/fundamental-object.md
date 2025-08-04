---
title: 基础对象
description: 学习 WebGPU 开发必备的基础的对象
sidebar:
  order: 3
---

WebGPU 相对于之前的 WebGL 会相对复杂一些，要进行 WebGPU 的开发，需要创建和配置很多的 JavaScript 对象。这些对象的的最终目标可以归结**为将命令发送到 GPU**。

更准确来讲，就是提交 **命令缓冲区**（command buffers）到客户 GPU 绑定的队列上。至少需要 6 个步骤：

1. 获取浏览器的 `Navigator`，可以在这里检查浏览器是否支持 WebGPU；
2. 如果浏览器支持 WebGPU，就可以从 `Navigator` 获取 `GPUAdapter`；
3. 使用 `GPUAdapter` 获取 `GPUDevice`；
4. 使用 `GPUDevice` 创建 `GPUCommandEncoder`
5. 配置编码器（encoder）记录命令到缓冲区（buffer）；
6. 提交命令缓冲区到 `GPUDevice` 绑定的 `GPUQueue`。

如果你想渲染图形，还需要额外的步骤，需要将 `GPUDevice` 和一个 `Canvas` 绑定。需要额外三个步骤：

1. 在 HTML 中获取 `Canvas` 元素;
2. 从 `Canvas` 元素中获取 `GPUCanvasContext`；
3. 使用 `GPUDevice` 和 canvas 格式配置 `GPUCanvasContext`；

一旦 `GPUDevice` 绑定到 `Canvas`，就可以通过调用 `GPUDevice` 上的方法渲染图形到 `Canvas`。

## Navigator

现代浏览器都有 [`Navigator` 对象](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)，包含了当前浏览器支持的功能。例如 `clipboard` 代表可以读取系统的剪贴板。

```js
if (!navigator.gpu) {
  throw new Error("WebGPU not supported.");
}
```

`gpu` 提供了两个重要的方法：

- `requestAdapter()`：返回一个 `GPUAdapter` 的 `Promise` 对象；
- `getPreferredCanvasFormat()`：返回一个字符串，浏览器下最好的 canvas 格式，例如：`bgra8unorm`

## GPUAdapter

**浏览器支持 WebGPU，不代表用户的硬件支持 WebGPU 的渲染和计算。** 因此需要使用 `requestAdapter` 获得 `GPUAdapter`。

需要注意的是，`requestAdapter` 返回的是一个 `Promise` 的占位对象。每一个 `Promise` 有三种状态：

- `pending`：操作还没有完成
- `fulfillment`：操作完成
- `rejection`：发生错误

通常会使用 `await` 等待操作完成：

```javascript
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error("No appropriate GPUAdapter found.");
}
```

获取到 `GPUAdapter` 后，就可以通过 `info` 获取到用户渲染和计算能力。

```javascript
const info = adapter.info;

if (info) {
  console.log("Vendor: " + info.vendor);
  console.log("Architecture: " + info.architecture);
  console.log("Device: " + info.device);
  console.log("Description: " + info.description);
}
```

完整的支持属性可以参考：[GPUAdapterInfo](https://www.w3.org/TR/webgpu/#gpuadapterinfo)

还有两个有用的参数，`features` 和 `limits`。

- `features`：可以获得 GPU 支持的功能；
- `limits`：可以获得 GPU 可以操作的最大/最小的操作参数；

`GPUAdapter` 最重要的功能是提供 `GPUDevice`，同样是返回 `Promise` 对象：

```javascript
const device = await adapter.requestDevice();
```

## 代码

```javascript
if (!navigator.gpu) {
  throw new Error("WebGPU not supported.");
}

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error("No appropriate GPUAdapter found.");
}

const info = adapter.info;

if (info) {
  console.log("Vendor: " + info.vendor);
  console.log("Architecture: " + info.architecture);
  console.log("Device: " + info.device);
  console.log("Description: " + info.description);
}

const device = await adapter.requestDevice();
```
