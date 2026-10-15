import { createShaderModule, createWebGPUContext, popValidationError } from "./webgpu-demo.js";

const computeShader = `
@group(0) @binding(0) var outputTex: texture_storage_2d<rgba8unorm, write>;

struct Params {
  time: f32,
}

@group(0) @binding(1) var<uniform> params: Params;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let size = textureDimensions(outputTex);
  if (id.x >= size.x || id.y >= size.y) {
    return;
  }

  let uv = vec2f(f32(id.x) / f32(size.x), f32(id.y) / f32(size.y));
  let wave = 0.5 + 0.5 * sin(uv.x * 18.0 + params.time * 2.0);
  let color = vec4f(uv.x, wave * (1.0 - uv.y), 0.35 + 0.65 * uv.y, 1.0);
  textureStore(outputTex, vec2i(i32(id.x), i32(id.y)), color);
}
`;

const renderShader = `
struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0),
  );
  var uvs = array<vec2f, 3>(
    vec2f(0.0, 1.0),
    vec2f(2.0, 1.0),
    vec2f(0.0, -1.0),
  );
  var out: VertexOut;
  out.position = vec4f(positions[vertexIndex], 0.0, 1.0);
  out.uv = uvs[vertexIndex];
  return out;
}

@group(0) @binding(0) var outputTex: texture_2d<f32>;
@group(0) @binding(1) var outputSampler: sampler;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  return textureSample(outputTex, outputSampler, uv);
}
`;

export async function mountComputeDemo(canvasId, messages) {
  const { device, canvas, context, format } = await createWebGPUContext(canvasId, messages);
  device.pushErrorScope("validation");

  let computePipeline;
  let renderPipeline;
  let computeBindGroup;
  let renderBindGroup;
  let uniformBuffer;
  const uniformData = new Float32Array(4);
  const workgroupsX = Math.ceil(canvas.width / 8);
  const workgroupsY = Math.ceil(canvas.height / 8);

  try {
    const storageTexture = device.createTexture({
      label: "Compute output",
      size: [canvas.width, canvas.height],
      format: "rgba8unorm",
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
    });
    uniformBuffer = device.createBuffer({
      label: "Compute time",
      size: uniformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const computeModule = await createShaderModule(device, computeShader, "Compute shader");
    computePipeline = device.createComputePipeline({
      label: "Compute pipeline",
      layout: "auto",
      compute: { module: computeModule, entryPoint: "main" },
    });
    computeBindGroup = device.createBindGroup({
      label: "Compute resources",
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: storageTexture.createView() },
        { binding: 1, resource: { buffer: uniformBuffer } },
      ],
    });

    const renderModule = await createShaderModule(device, renderShader, "Compute present shader");
    const sampler = device.createSampler({ magFilter: "nearest", minFilter: "nearest" });
    renderPipeline = device.createRenderPipeline({
      label: "Present compute texture",
      layout: "auto",
      vertex: { module: renderModule, entryPoint: "vs_main" },
      fragment: {
        module: renderModule,
        entryPoint: "fs_main",
        targets: [{ format }],
      },
      primitive: { topology: "triangle-list" },
    });
    renderBindGroup = device.createBindGroup({
      label: "Present resources",
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: storageTexture.createView() },
        { binding: 1, resource: sampler },
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
    uniformData[0] = time;
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const encoder = device.createCommandEncoder();
    const computePass = encoder.beginComputePass();
    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, computeBindGroup);
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
    computePass.end();

    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0.3, g: 0.3, b: 0.3, a: 1 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });
    renderPass.setPipeline(renderPipeline);
    renderPass.setBindGroup(0, renderBindGroup);
    renderPass.draw(3);
    renderPass.end();
    device.queue.submit([encoder.finish()]);
  }
}
