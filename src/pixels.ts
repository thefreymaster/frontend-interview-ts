import type { IPixel } from "./interfaces/pixels.js";

export interface PixelSummary {
  total: number;
  healthy: number;
  unhealthy: number;
  colors: Record<IPixel["meta_data"]["color"], number>;
  averageIntensity: number;
}

export const summarizePixels = (_pixels: readonly IPixel[]): PixelSummary => {
  throw new Error("TODO: implement pixel summary");
};

export const findPixel = (
  _pixels: readonly IPixel[],
  _id: number,
): IPixel | undefined => {
  throw new Error("TODO: implement pixel lookup");
};
