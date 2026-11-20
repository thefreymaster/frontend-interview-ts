import { Router } from "express";
import { getPixels as readPixels } from "../data/pixels.js";
import type { IPixel } from "../interfaces/pixels.js";

export type PixelSource = () => readonly IPixel[];

export const createPixelsRouter = (getPixels: PixelSource = readPixels): Router => {
  const router = Router();

  router.get("/", (_req, res) => {
    res.status(501).json({
      message: `TODO: return the ${getPixels().length} supplied pixels as JSON`,
    });
  });

  router.get("/grid", (_req, res) => {
    res.status(501).json({ message: "TODO: return toPixelGrid(getPixels())" });
  });

  router.get("/:id", (_req, res) => {
    res.status(501).json({ message: "TODO: validate the ID and return one pixel" });
  });

  return router;
};

export const pixels = createPixelsRouter();
