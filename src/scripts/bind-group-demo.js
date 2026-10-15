import { createShaderModule, createWebGPUContext, popValidationError } from "./webgpu-demo.js";

const shader = `
struct ColorUniforms {
  color: vec4f,
}

struct ScaleUniforms {
  scale: f32,
}

@group(0) @binding(0) var<uniform> colorUniforms: ColorUniforms;
@group(0) @binding(1) var<uniform> scaleUniforms: ScaleUniforms;

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
  var positions = array<vec2f, 3>(
    vec2f(0.0, 0.5),
    vec2f(-0.5, -0.5),
    vec2f(0.5, -0.5),
  );
  return vec4f(positions[vertexIndex] * scaleUniforms.scale, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4f {
  return colorUniforms.color;
}
`;

export async function mountBindGroupDemo(canvasId, messages) {
  const { device, context, format } = await createWebGPUContext(canvasId, messages);
  device.pushErrorScope("validation");

  let pipeline;
  let bindGroup;
  let colorBuffer;
  let scaleBuffer;
  const colorData = new Float32Array(4);
  const scaleData = new Float32Array(4);

  try {
    colorBuffer = device.createBuffer({
      label: "Bind group color",
      size: colorData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    scaleBuffer = device.createBuffer({
      label: "Bind group scale",
      size: scaleData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const module = await createShaderModule(device, shader, "Bind group shader");
    pipeline = device.createRenderPipeline({
      label: "Bind group pipeline",
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
      label: "Color and scale",
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: colorBuffer } },
        { binding: 1, resource: { buffer: scaleBuffer } },
      ],
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
    colorData[0] = 0.95;
    colorData[1] = 0.35 + 0.25 * Math.sin(time);
    colorData[2] = 0.2;
    colorData[3] = 1;
    scaleData[0] = 0.45 + 0.4 * (0.5 + 0.5 * Math.sin(time * 1.4));
    device.queue.writeBuffer(colorBuffer, 0, colorData);
    device.queue.writeBuffer(scaleBuffer, 0, scaleData);

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
