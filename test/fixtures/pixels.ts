import type { IPixel } from "../../src/interfaces/pixels.js";

export const makePixels = (count = 10000): IPixel[] =>
  Array.from({ length: count }, (_, index) => {
    const color = (["green", "yellow", "red"] as const)[index % 3];
    return {
      id: index + 1,
      healthy: color === "green",
      meta_data: { color, intensity: index % 101 },
      sub_pixels: {
        red: index % 256,
        green: (index + 1) % 256,
        blue: (index + 2) % 256,
      },
    };
  });
