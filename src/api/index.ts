import { createPixelsRouter, pixels, type PixelSource } from "./pixels.js";

export const api = { pixels };

export const createApi = (getPixels: PixelSource) => ({
  pixels: createPixelsRouter(getPixels),
});
