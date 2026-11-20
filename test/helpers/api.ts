import { once } from "node:events";
import { createServer } from "node:http";
import type { TestContext } from "node:test";
import { createApp } from "../../src/app.js";
import type { IPixel } from "../../src/interfaces/pixels.js";
import { makePixels } from "../fixtures/pixels.js";

export const startApi = async (
  t: TestContext,
  initialPixels: readonly IPixel[] = makePixels(),
) => {
  let currentPixels = initialPixels;
  const server = createServer(createApp(() => currentPixels));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
        server.closeAllConnections();
      }),
  );

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected a TCP address for the test server");
  }
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    get: (path: string): Promise<Response> =>
      fetch(`${baseUrl}${path}`, { signal: AbortSignal.timeout(5_000) }),
    replacePixels: (pixels: readonly IPixel[]) => {
      currentPixels = pixels;
    },
  };
};
