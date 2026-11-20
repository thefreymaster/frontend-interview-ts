import type { IPixel } from "../interfaces/pixels.js";

export const PIXEL_COUNT = 10000;

export const generatePixels = (count = PIXEL_COUNT): IPixel[] => {
  const redCount = Math.floor(count * 0.01);
  const yellowCount = Math.floor(count * 0.05);
  const colors: IPixel["meta_data"]["color"][] = Array.from(
    { length: count },
    (_, index) => {
      if (index < redCount) return "red";
      if (index < redCount + yellowCount) return "yellow";
      return "green";
    },
  );

  // Shuffle the fixed proportions so warning and failing pixels move on refresh.
  for (let index = colors.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [colors[index], colors[randomIndex]] = [colors[randomIndex], colors[index]];
  }

  return colors.map((color, index) => ({
    id: index + 1,
    healthy: color === "green",
    meta_data: {
      intensity: Math.floor(Math.random() * 101),
      color,
    },
    sub_pixels: {
      red: Math.floor(Math.random() * 256),
      green: Math.floor(Math.random() * 256),
      blue: Math.floor(Math.random() * 256),
    },
  }));
};

let pixels = generatePixels();

export const getPixels = (): readonly IPixel[] => pixels;

export const regeneratePixels = (): readonly IPixel[] => {
  pixels = generatePixels();
  return pixels;
};
