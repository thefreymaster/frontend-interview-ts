import { createServer } from "node:http";
import express, { type Response } from "express";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";
import type { PixelServerEvents } from "./src/interfaces/pixelEvents.js";
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
const httpServer = createServer(app);
const io = new Server<Record<string, never>, PixelServerEvents>(httpServer);
const port = 4090;
const pixelCount = 10000;
const updateIntervalMs = 5000;
const cycleSteps = 12;

app.use(express.json());

const generatePixels = (count: number): IPixel[] => {
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

let basePixels = generatePixels(pixelCount);
let pixels = basePixels;
let cycleStep = 0;

io.on("connection", (socket) => {
  socket.emit("pixels:snapshot", pixels);
});

const updateTimer = setInterval(() => {
  cycleStep = (cycleStep + 1) % cycleSteps;
  const offset = Math.floor((pixelCount * cycleStep) / cycleSteps);
  const updates: IPixel[] = [];

  // Rotate the original quality pattern, preserving counts and repeating each minute.
  pixels = basePixels.map((basePixel, index) => {
    const color = basePixels[(index + offset) % pixelCount].meta_data.color;
    const currentPixel = pixels[index];

    if (currentPixel.meta_data.color === color) {
      return currentPixel;
    }

    const pixel: IPixel = {
      ...basePixel,
      healthy: color === "green",
      meta_data: { ...basePixel.meta_data, color },
    };
    updates.push(pixel);
    return pixel;
  });

  for (const pixel of updates) {
    io.emit("pixel:update", pixel);
  }
  io.emit("pixels:updated");
}, updateIntervalMs);

app.get("/api/v1/pixels", (_req, res: Response<IPixel[]>) => {
  basePixels = generatePixels(pixelCount);
  pixels = basePixels;
  cycleStep = 0;
  io.emit("pixels:snapshot", pixels);
  res.set("Cache-Control", "no-store");
  res.json(pixels);
});

app.get<{ id: string }, IPixel | ApiError>("/api/v1/pixels/:id", (req, res) => {
  res.set("Cache-Control", "no-store");
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

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/api/v1`);
  console.log(`Socket.IO stream at http://localhost:${port}/socket.io`);
  console.log(`Swagger docs at http://localhost:${port}/api/v1/docs`);
});

const shutdown = () => {
  clearInterval(updateTimer);
  io.close();
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
