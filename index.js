import express from 'express'
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const generatePixels = (count) => {
  const colors = ["red", "yellow", "blue"];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    healthy: Math.random() < 0.9,
    meta_data: {
      intensity: Math.floor(Math.random() * 101),
      color: colors[Math.floor(Math.random() * colors.length)],
    },
  }));
};

app.get("/api/v1/pixels", (req, res) => {
  const pixels = generatePixels(1000);
  res.send(pixels)
});

// 404 route
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
