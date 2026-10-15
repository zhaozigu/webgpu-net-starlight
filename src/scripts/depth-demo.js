import { createShaderModule, createWebGPUContext, popValidationError } from "./webgpu-demo.js";

const shader = `
struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
}

@vertex
fn vs_main(@location(0) position: vec3f, @location(1) color: vec3f) -> VertexOut {
  var out: VertexOut;
  out.position = vec4f(position, 1.0);
  out.color = color;
  return out;
}

@fragment
fn fs_main(@location(0) color: vec3f) -> @location(0) vec4f {
  return vec4f(color, 1.0);
}
`;

export async function mountDepthDemo(canvasId, messages, el) {
  const depthEnabled = el?.dataset.depth !== "false";
  const { device, canvas, context, format } = await createWebGPUContext(canvasId, messages);
  device.pushErrorScope("validation");

  try {
    const vertices = new Float32Array([
      0.15, 0.2, 0.3, 0.25, 0.45, 0.95,
      -0.35, -0.6, 0.3, 0.25, 0.45, 0.95,
      0.65, -0.6, 0.3, 0.25, 0.45, 0.95,
      0.1, 0.65, 0.6, 0.9, 0.3, 0.25,
      -0.75, -0.45, 0.6, 0.9, 0.3, 0.25,
      0.85, -0.45, 0.6, 0.9, 0.3, 0.25,
    ]);
    const vertexBuffer = device.createBuffer({
      label: "Depth triangles",
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const module = await createShaderModule(device, shader, "Depth shader");
    const pipeline = device.createRenderPipeline({
      label: depthEnabled ? "Depth pipeline" : "Painter pipeline",
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 6 * 4,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" },
              { shaderLocation: 1, offset: 3 * 4, format: "float32x3" },
            ],
          },
        ],
      },
      fragment: {
        module,
        entryPoint: "fs_main",
        targets: [{ format }],
      },
      primitive: { topology: "triangle-list" },
      ...(depthEnabled
        ? {
            depthStencil: {
              format: "depth24plus",
              depthWriteEnabled: true,
              depthCompare: "less",
            },
          }
        : {}),
    });

    let depthView;
    if (depthEnabled) {
      const depthTexture = device.createTexture({
        label: "Depth attachment",
        size: [canvas.width, canvas.height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
      depthView = depthTexture.createView();
    }

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0.3, g: 0.3, b: 0.3, a: 1 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      ...(depthView
        ? {
            depthStencilAttachment: {
              view: depthView,
              depthClearValue: 1,
              depthLoadOp: "clear",
              depthStoreOp: "discard",
            },
          }
        : {}),
    });
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(6);
    pass.end();
    device.queue.submit([encoder.finish()]);
  } catch (error) {
    await device.popErrorScope();
    throw error;
  }

  await popValidationError(device);
}
