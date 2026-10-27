export interface IPixel {
  id: number;
  healthy: boolean;
  meta_data: {
    intensity: number;
    color: "red" | "yellow" | "blue";
  };
  sub_pixels: {
    red: number;
    green: number;
    blue: number;
  };
}
