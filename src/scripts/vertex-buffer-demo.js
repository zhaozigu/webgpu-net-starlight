import { createShaderModule, createWebGPUContext, popValidationError } from "./webgpu-demo.js";

const shader = `
struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
}

@vertex
fn vs_main(
  @location(0) position: vec2f,
  @location(1) color: vec3f,
) -> VertexOut {
  var out: VertexOut;
  out.position = vec4f(position, 0.0, 1.0);
  out.color = color;
  return out;
}

@fragment
fn fs_main(@location(0) color: vec3f) -> @location(0) vec4f {
  return vec4f(color, 1.0);
}
`;

export async function mountVertexBufferDemo(canvasId, messages) {
  const { device, context, format } = await createWebGPUContext(canvasId, messages);
  device.pushErrorScope("validation");

  try {
    const vertices = new Float32Array([
      0.0, 0.5, 1.0, 0.25, 0.2,
      -0.5, -0.5, 0.2, 0.85, 0.35,
      0.5, -0.5, 0.25, 0.45, 1.0,
    ]);

    const vertexBuffer = device.createBuffer({
      label: "Colored triangle vertices",
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const module = await createShaderModule(device, shader, "Vertex buffer shader");
    const pipeline = device.createRenderPipeline({
      label: "Vertex buffer pipeline",
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 5 * 4,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x2" },
              { shaderLocation: 1, offset: 2 * 4, format: "float32x3" },
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
    });

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
    });
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
  } catch (error) {
    await device.popErrorScope();
    throw error;
  }

  await popValidationError(device);
}
