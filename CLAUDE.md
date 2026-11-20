# CLAUDE.md

## Project Overview

This branch is a TypeScript-only coding interview starter for developers who
do not work on frontends. It uses a Node.js CLI to report and inspect the same
10,000-pixel dataset used by the React interview on `main`.

The functions in `src/api/api.ts` and `src/pixels.ts` intentionally throw
`TODO` errors. Do not implement them unless explicitly requested. Do not add
or run tests unless requested.

There is no React, frontend, browser UI, Vite, routing, or CSS requirement.
Do not reintroduce frontend dependencies.

## Development Commands

- `bash setup.sh`: Install nvm if needed, select Node 24, and run `npm ci`.
- `npm ci`: Install dependencies when Node 24 is already active.
- `npm run server`: Start the supplied mock API at `http://localhost:4090`.
- `npm run dev -- --help`: Show CLI usage.
- `npm run dev -- summary`: Run the list/report exercise.
- `npm run dev -- pixel --id 42`: Run the HTTP detail exercise.
- `npm run dev -- watch --id 42`: Run the optional live-data exercise.
- `npm run typecheck`: Type-check the whole project without emitting files.
- `npm run typecheck:server`: Type-check the backend and shared types.
- `npm run build`: Compile all TypeScript into `dist/`.
- `npm start -- summary`: Run the compiled CLI.
- `npm run lint`: Run Node/TypeScript ESLint rules.

Run the backend in a separate terminal. The CLI connects directly to it, with
an optional `--base-url` override. Use `.js` extensions in TypeScript imports
to support NodeNext resolution and the compiled output.

## Architecture

- `index.ts`: Complete TypeScript Express API, Swagger UI, and Socket.IO
  quality simulation. This is supplied infrastructure, not candidate work.
- `openapi.ts`: Shared API documentation at `/api/v1/docs` and
  `/api/v1/docs.json`. `/api-docs.json` remains a legacy alias.
- `src/index.ts`: Supplied argument validation, command dispatch, JSON output,
  error reporting, and stream shutdown.
- `src/api/api.ts`: Candidate list and detail fetching. Returns
  `Promise<IPixel[]>` and `Promise<IPixel>`; Node has built-in `fetch`.
- `src/pixels.ts`: Candidate `summarizePixels` and optional `findPixel`.
  Inputs are readonly and must not be mutated.
- `src/stream.ts`: Complete framework-free Socket.IO client. Publishes full
  snapshots and batches individual updates until `pixels:updated`.
- `src/interfaces/`: Shared pixel model and typed server event contract.

## Exercise Requirements

1. Implement typed HTTP list and detail fetching with useful error handling.
2. Summarize health counts, color counts, and average intensity for any array
   size. Empty input returns zero counts and a zero average.
3. Print the selected pixel's ID, health, metadata, and RGB values via the CLI.
4. Handle invalid IDs, 404 responses, and an unavailable server.
5. Optionally implement ID-based in-memory lookup for live reports, returning
   `undefined` when the selected pixel is absent.

Commands currently fail with deliberate TODO messages until their exercise
functions are implemented. This is expected, not a scaffold bug.

## Backend Behavior

- `GET /api/v1/pixels` regenerates 10,000 pixels with fixed IDs and exactly
  9,400 green, 500 yellow, and 100 red pixels.
- Green pixels have `healthy: true`; yellow and red pixels have `healthy: false`.
- Intensity is an integer from 0 to 100; RGB channels are integers from 0 to 255.
- `GET /api/v1/pixels/:id` returns current live data or a JSON 404.
- `GET /api/v1/user` returns a fixed mock profile.
- Quality changes every five seconds in a 12-step, one-minute cycle.
  Each step preserves color counts; only color and health change.
- List requests reset the cycle, randomize intensity/RGB, and broadcast the
  new snapshot to all clients.
- `pixels:snapshot` carries `IPixel[]`, `pixel:update` carries `IPixel`, and
  `pixels:updated` marks the end of a batch.
- The stream helper resynchronizes on reconnect and returns a cleanup function.
- Reports use stdout; loading/connection messages and errors use stderr.
  One-off command failures exit nonzero; watch retries connection errors.
