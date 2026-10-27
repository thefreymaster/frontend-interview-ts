import express, { type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";
import type { IPixel } from "./src/interfaces/pixels.js";

interface User {
  id: string;
  name: string;
  email: string;
  role: "viewer" | "admin";
}

interface ApiError {
  message: string;
}

const app = express();
const port = 4090;

app.use(express.json());

const generatePixels = (count: number): IPixel[] => {
  const colors = ["red", "yellow", "blue"] as const;

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    healthy: Math.random() < 0.9,
    meta_data: {
      intensity: Math.floor(Math.random() * 101),
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    sub_pixels: {
      red: Math.floor(Math.random() * 256),
      green: Math.floor(Math.random() * 256),
      blue: Math.floor(Math.random() * 256),
    },
  }));
};

// Keep mock values stable so list and detail responses agree.
const pixels = generatePixels(10000);

app.get("/api/v1/pixels", (_req, res: Response<IPixel[]>) => {
  res.json(pixels);
});

app.get<{ id: string }, IPixel | ApiError>("/api/v1/pixels/:id", (req, res) => {
  const id = Number(req.params.id);
  const pixel = pixels.find((item) => item.id === id);

  if (!pixel) {
    res.status(404).json({ message: "Pixel not found" });
    return;
  }

  res.json(pixel);
});

const mockUser: User = {
  id: "user-001",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "viewer",
};

app.get("/api/v1/user", (_req, res: Response<User>) => {
  res.json(mockUser);
});

app.get("/api-docs.json", (_req, res) => {
  res.json(openApiDocument);
});

app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: { url: "/api-docs.json" },
  }),
);

app.use((_req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/api/v1`);
  console.log(`Swagger docs at http://localhost:${port}/api/v1/docs`);
});
