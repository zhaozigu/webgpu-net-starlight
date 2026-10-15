export async function createWebGPUContext(canvasId, messages) {
  if (!navigator.gpu) {
    throw new Error(messages.notSupported);
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error(messages.noAdapter);
  }

  const device = await adapter.requestDevice();
  device.lost.then((info) => {
    if (info.reason !== "destroyed") {
      reportError(canvasId, new Error(info.message || messages.initFailed), messages);
    }
  });

  device.addEventListener("uncapturederror", (event) => {
    reportError(canvasId, event.error, messages);
  });

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error(`${messages.canvasNotFound}: ${canvasId}`);
  }

  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error(messages.noContext);
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode: "opaque",
  });

  return { device, canvas, context, format };
}

export async function createShaderModule(device, code, label) {
  const module = device.createShaderModule({ label, code });
  const info = await module.getCompilationInfo();
  const errors = info.messages.filter((message) => message.type === "error");
  if (errors.length > 0) {
    throw new Error(errors.map((message) => message.message).join("\n"));
  }
  return module;
}

export function reportError(canvasId, error, messages) {
  console.error(messages.initFailed, error);
  const errorElement = document.getElementById(`${canvasId}-error`);
  if (!errorElement) return;

  const message = error instanceof Error && error.message ? error.message : String(error);
  errorElement.style.display = "block";
  errorElement.replaceChildren();
  const strong = document.createElement("strong");
  strong.textContent = `${messages.error}: `;
  errorElement.append(strong, document.createTextNode(message));
}

export async function popValidationError(device) {
  const error = await device.popErrorScope();
  if (error) {
    throw error;
  }
}

export function mountDemos(kind, run) {
  const mount = () => {
    for (const el of document.querySelectorAll(`[data-demo="${kind}"]`)) {
      if (el.dataset.mounted === "true") continue;
      el.dataset.mounted = "true";

      let messages = {};
      try {
        messages = JSON.parse(el.dataset.messages || "{}");
      } catch {
        messages = {};
      }

      Promise.resolve(run(el.dataset.canvasId, messages, el)).catch((error) => {
        reportError(el.dataset.canvasId, error, messages);
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}
