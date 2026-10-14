import { createShaderModule, createWebGPUContext, popValidationError } from "./webgpu-demo.js";

const shader = `
struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vs_main(@location(0) position: vec2f, @location(1) uv: vec2f) -> VertexOut {
  var out: VertexOut;
  out.position = vec4f(position, 0.0, 1.0);
  out.uv = uv;
  return out;
}

@group(0) @binding(0) var gradientTex: texture_2d<f32>;
@group(0) @binding(1) var gradientSampler: sampler;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  return textureSample(gradientTex, gradientSampler, uv);
}
`;

export async function mountTextureDemo(canvasId, messages) {
  const { device, context, format } = await createWebGPUContext(canvasId, messages);
  device.pushErrorScope("validation");

  try {
    const size = 64;
    const bytesPerRow = 256;
    const pixels = new Uint8Array(bytesPerRow * size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const checker = ((x >> 3) ^ (y >> 3)) & 1;
        const offset = y * bytesPerRow + x * 4;
        pixels[offset] = checker ? 232 : 28;
        pixels[offset + 1] = checker ? 164 : 78;
        pixels[offset + 2] = checker ? 64 : 130;
        pixels[offset + 3] = 255;
      }
    }

    const texture = device.createTexture({
      label: "Checker texture",
      size: [size, size],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture(
      { texture },
      pixels,
      { bytesPerRow },
      { width: size, height: size },
    );

    const sampler = device.createSampler({
      label: "Nearest sampler",
      magFilter: "nearest",
      minFilter: "nearest",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
    });

    const vertices = new Float32Array([
      -0.7, -0.7, 0, 1,
      0.7, -0.7, 1, 1,
      0.7, 0.7, 1, 0,
      -0.7, -0.7, 0, 1,
      0.7, 0.7, 1, 0,
      -0.7, 0.7, 0, 0,
    ]);
    const vertexBuffer = device.createBuffer({
      label: "Textured quad",
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const module = await createShaderModule(device, shader, "Texture shader");
    const pipeline = device.createRenderPipeline({
      label: "Texture pipeline",
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 4 * 4,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x2" },
              { shaderLocation: 1, offset: 2 * 4, format: "float32x2" },
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

    const bindGroup = device.createBindGroup({
      label: "Texture bind group",
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: texture.createView() },
        { binding: 1, resource: sampler },
      ],
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
    pass.setBindGroup(0, bindGroup);
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
