import type { IPixel } from "./pixels.js";

export interface PixelServerEvents {
  "pixels:snapshot": (pixels: IPixel[]) => void;
  "pixel:update": (pixel: IPixel) => void;
  "pixels:updated": () => void;
}
