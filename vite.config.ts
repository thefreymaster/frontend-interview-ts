import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "localhost",
    // HackerRank forwards preview requests using internal VM hostnames.
    allowedHosts: [".vm-provider.internal"],
    proxy: {
      "/api/v1": "http://localhost:4090",
      "/socket.io": {
        target: "http://localhost:4090",
        ws: true,
      },
    },
  },
});
