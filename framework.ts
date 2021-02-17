import {
  copyToBuffer,
  createCapture,
  createImage,
  Dimensions,
} from "./utils.ts";

export class Framework {
  device: GPUDevice;
  dimensions: Dimensions;

  static async getDevice(features: GPUFeatureName[] = []): Promise<GPUDevice> {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter?.requestDevice({
      nonGuaranteedFeatures: features,
    });

    if (!device) {
      throw new Error("no suitable adapter found");
    }

    return device;
  }

  constructor(dimensions: Dimensions, device: GPUDevice) {
    this.dimensions = dimensions;
    this.device = device;
  }

  async run() {}
  render(encoder: GPUCommandEncoder, view: GPUTextureView) {}

  async renderImage() {
    await this.run();
    const { texture, outputBuffer } = createCapture(
      this.device,
      this.dimensions,
    );
    const encoder = this.device.createCommandEncoder();
    this.render(encoder, texture.createView());
    copyToBuffer(encoder, texture, outputBuffer, this.dimensions);
    this.device.queue.submit([encoder.finish()]);
    await createImage(outputBuffer, this.dimensions);
  }
}