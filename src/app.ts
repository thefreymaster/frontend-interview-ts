import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "../openapi.js";
import { api, createApi } from "./api/index.js";
import type { PixelSource } from "./api/pixels.js";

export const createApp = (getPixels?: PixelSource): Express => {
  const app = express();
  const routes = getPixels ? createApi(getPixels) : api;

  app.use(express.json());
  app.use(
    "/api/v1/pixels",
    (_req, res, next) => {
      res.set("Cache-Control", "no-store");
      next();
    },
    routes.pixels,
  );
  app.get(["/api/v1/docs.json", "/api-docs.json"], (_req, res) => {
    res.json(openApiDocument);
  });
  app.use(
    "/api/v1/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: "/api/v1/docs.json" },
    }),
  );
  app.use((_req, res) => {
    res.status(404).json({ message: "Not found" });
  });
  app.use(
    (error: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        next(error);
        return;
      }
      res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    },
  );

  return app;
};
