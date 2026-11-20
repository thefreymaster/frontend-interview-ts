import { parseArgs } from "node:util";

const DEFAULT_API_URL = "http://localhost:4090";

const help = `TypeScript Pixel Interview

Usage:
  npm run dev -- list
  npm run dev -- grid
  npm run dev -- pixel --id 42

Options:
  --id <number>     Positive integer pixel ID
  --base-url <url>  API server (default: ${DEFAULT_API_URL})
  -h, --help       Show this help

The pixel routes, grid, and lookup functions are intentionally unfinished.
Start the mock API in another terminal with: npm run server`;

const parsePixelId = (value: string | undefined): number => {
  const id = Number(value);
  if (!value || !Number.isSafeInteger(id) || id < 1) {
    throw new Error("--id must be a positive integer");
  }
  return id;
};

const printJson = (value: unknown) => {
  console.log(JSON.stringify(value, null, 2));
};

const requestJson = async (path: string, baseUrl: string) => {
  const url = `${baseUrl}${path}`;
  console.error(`Loading ${url}...`);
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(
      `GET ${url} failed: HTTP ${response.status} ${response.statusText}`,
    );
  }
  printJson(await response.json());
};

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

  const [command = "list", ...extra] = positionals;
  if (extra.length > 0) {
    throw new Error(
      "Unexpected arguments. Run npm run dev -- --help for usage.",
    );
  }

  const url = new URL(values["base-url"]);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("--base-url must be an HTTP or HTTPS URL");
  }
  const baseUrl = url.href.replace(/\/$/, "");

  switch (command) {
    case "list":
      if (values.id !== undefined) {
        throw new Error("--id is only supported by pixel");
      }
      await requestJson("/api/v1/pixels", baseUrl);
      break;
    case "grid":
      if (values.id !== undefined) {
        throw new Error("--id is only supported by pixel");
      }
      await requestJson("/api/v1/pixels/grid", baseUrl);
      break;
    case "pixel": {
      const id = parsePixelId(values.id);
      await requestJson(`/api/v1/pixels/${id}`, baseUrl);
      break;
    }
    default:
      throw new Error(
        `Unknown command "${command}". Use list, grid, or pixel.`,
      );
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
