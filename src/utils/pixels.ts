import type { IPixel } from "../interfaces/pixels.js";

export const toPixelGrid = (_pixels: readonly IPixel[]): IPixel[][] => {
  throw new Error("TODO: construct 100 rows of 100 pixels");
};

export const findPixel = (
  _pixels: readonly IPixel[],
  _id: number,
): IPixel | undefined => {
  throw new Error("TODO: implement pixel lookup");
};
