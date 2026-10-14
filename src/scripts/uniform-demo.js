import { createShaderModule, createWebGPUContext, popValidationError } from "./webgpu-demo.js";

const shader = `
struct Uniforms {
  color: vec4f,
  offset: vec2f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
  var positions = array<vec2f, 3>(
    vec2f(0.0, 0.5),
    vec2f(-0.5, -0.5),
    vec2f(0.5, -0.5),
  );
  let position = positions[vertexIndex] + uniforms.offset;
  return vec4f(position, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4f {
  return uniforms.color;
}
`;

export async function mountUniformDemo(canvasId, messages) {
  const { device, context, format } = await createWebGPUContext(canvasId, messages);
  device.pushErrorScope("validation");

  let pipeline;
  let bindGroup;
  let uniformBuffer;
  const uniformData = new Float32Array(8);

  try {
    uniformBuffer = device.createBuffer({
      label: "Frame uniforms",
      size: uniformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const module = await createShaderModule(device, shader, "Uniform shader");
    pipeline = device.createRenderPipeline({
      label: "Uniform pipeline",
      layout: "auto",
      vertex: { module, entryPoint: "vs_main" },
      fragment: {
        module,
        entryPoint: "fs_main",
        targets: [{ format }],
      },
      primitive: { topology: "triangle-list" },
    });

    bindGroup = device.createBindGroup({
      label: "Uniform bind group",
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    draw(0);
  } catch (error) {
    await device.popErrorScope();
    throw error;
  }

  await popValidationError(device);

  const startedAt = performance.now();
  const frame = () => {
    if (!document.getElementById(canvasId)) return;
    draw((performance.now() - startedAt) / 1000);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  function draw(time) {
    uniformData[0] = 0.45 + 0.55 * Math.sin(time * 1.3);
    uniformData[1] = 0.35 + 0.45 * Math.sin(time * 1.7 + 2);
    uniformData[2] = 0.4 + 0.5 * Math.sin(time * 1.1 + 4);
    uniformData[3] = 1;
    uniformData[4] = Math.sin(time) * 0.35;
    uniformData[5] = Math.cos(time * 0.8) * 0.25;
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

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
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }
}
