export interface IPixel {
  id: number;
  healthy: boolean;
  meta_data: {
    intensity: number;
    color: "green" | "yellow" | "red";
  };
  sub_pixels: {
    red: number;
    green: number;
    blue: number;
  };
}
