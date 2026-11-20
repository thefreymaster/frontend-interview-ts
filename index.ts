import { createApp } from "./src/app.js";

const port = 4090;
const server = createApp().listen(port, () => {
  console.log(`Server running at http://localhost:${port}/api/v1`);
  console.log(`Swagger docs at http://localhost:${port}/api/v1/docs`);
});

const shutdown = () => {
  server.close();
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
