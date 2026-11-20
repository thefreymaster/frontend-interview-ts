import { parseArgs } from "node:util";
import { api, DEFAULT_API_URL } from "./api/api.js";
import { findPixel, summarizePixels } from "./pixels.js";
import { subscribeToPixelUpdates } from "./stream.js";

const help = `TypeScript Pixel Interview

Usage:
  npm run dev -- summary
  npm run dev -- pixel --id 42
  npm run dev -- watch [--id 42]

Options:
  --id <number>     Pixel ID (integer from 1 to 10000)
  --base-url <url>  API server (default: ${DEFAULT_API_URL})
  -h, --help       Show this help

The fetch, summary, and lookup functions are intentionally unfinished.
Start the mock API in another terminal with: npm run server`;

const parsePixelId = (value: string | undefined): number => {
  const id = Number(value);
  if (!value || !Number.isInteger(id) || id < 1 || id > 10000) {
    throw new Error("--id must be an integer from 1 to 10000");
  }
  return id;
};

const printJson = (value: unknown) => {
  console.log(JSON.stringify(value, null, 2));
};

const watchPixels = (baseUrl: string, id?: number): Promise<void> =>
  new Promise((resolve, reject) => {
    let stopStream = () => {};
    const cleanup = () => {
      stopStream();
      process.off("SIGINT", onSignal);
      process.off("SIGTERM", onSignal);
    };
    const onSignal = () => {
      cleanup();
      resolve();
    };

    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);

    stopStream = subscribeToPixelUpdates({
      baseUrl,
      onPixels: (pixels) => {
        try {
          const summary = summarizePixels(pixels);
          if (id === undefined) {
            printJson(summary);
          } else {
            printJson({ summary, pixel: findPixel(pixels, id) ?? null });
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      },
      onStatus: (status) => console.error(`[stream] ${status}`),
      onError: (error) => console.error(`[stream] ${error.message}`),
    });
  });

const main = async () => {
  const { values, positionals } = parseArgs({
    options: {
      id: { type: "string" },
      "base-url": { type: "string", default: DEFAULT_API_URL },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(help);
    return;
  }

  const [command = "summary", ...extra] = positionals;
  if (extra.length > 0) {
    throw new Error("Unexpected arguments. Run npm run dev -- --help for usage.");
  }

  const url = new URL(values["base-url"]);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("--base-url must be an HTTP or HTTPS URL");
  }
  const baseUrl = url.href.replace(/\/$/, "");

  switch (command) {
    case "summary":
      if (values.id !== undefined) {
        throw new Error("--id is only supported by pixel and watch");
      }
      console.error("Loading pixels...");
      printJson(summarizePixels(await api.pixels.get(baseUrl)));
      break;
    case "pixel": {
      const id = parsePixelId(values.id);
      console.error(`Loading pixel #${id}...`);
      printJson(await api.pixels.getById(id, baseUrl));
      break;
    }
    case "watch":
      await watchPixels(
        baseUrl,
        values.id === undefined ? undefined : parsePixelId(values.id),
      );
      break;
    default:
      throw new Error(`Unknown command "${command}". Use summary, pixel, or watch.`);
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
