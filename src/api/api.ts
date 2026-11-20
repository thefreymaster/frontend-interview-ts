import type { IPixel } from "../interfaces/pixels.js";

export const DEFAULT_API_URL = "http://localhost:4090";

export const get = async (_baseUrl = DEFAULT_API_URL): Promise<IPixel[]> => {
  throw new Error("TODO: implement GET /api/v1/pixels");
};

export const getById = async (
  _id: number,
  _baseUrl = DEFAULT_API_URL,
): Promise<IPixel> => {
  throw new Error("TODO: implement GET /api/v1/pixels/:id");
};

export const api = {
  pixels: { get, getById },
};
