# CLAUDE.md

## Project Overview

This branch is a TypeScript-only coding interview starter for developers who
do not work on frontends. The 45-minute interview covers three Express
endpoints (20 minutes), tests (15 minutes), and a lookup-scaling follow-up
(10 minutes).

The handlers in `src/api/pixels.ts` intentionally return 501 TODO responses.
`toPixelGrid` and optional `findPixel` in `src/utils/pixels.ts` intentionally
throw TODO errors. Do not complete candidate implementations or TODO tests
unless explicitly requested. Supplied infrastructure tests may be run.

There is no React, frontend, browser UI, Vite, routing, or CSS requirement.
Do not reintroduce frontend dependencies.

## Development Commands

- `bash setup.sh`: Install nvm if needed, select Node 24, and run `npm ci`.
- `npm ci`: Install dependencies when Node 24 is already active.
- `npm run server`: Start the supplied Express app at `http://localhost:4090`.
- `npm run dev -- --help`: Show CLI usage.
- `npm run dev -- list`: Request the pixel array through the supplied CLI.
- `npm run dev -- grid`: Run the 100-by-100 grid construction exercise.
- `npm run dev -- pixel --id 42`: Run the HTTP detail exercise.
- `npm test`: Run setup tests and candidate TODO tests with Node's test runner.
- `npm run typecheck`: Type-check the whole project without emitting files.
- `npm run typecheck:server`: Type-check the backend and shared types.
- `npm run build`: Compile all TypeScript into `dist/`.
- `npm start -- list`: Run the compiled CLI.
- `npm run lint`: Run Node/TypeScript ESLint rules.

Core work is verified with HTTP requests and the supplied test harness.
The CLI is a supplied HTTP client, not candidate work. Use `.js` extensions
in TypeScript imports for NodeNext resolution.

## Architecture

- `index.ts`: Supplied server entry point; listens on port 4090 and handles
  shutdown. Do not import it from tests or candidate code.
- `src/app.ts`: Supplied app factory, Router mounting, Swagger UI, and JSON
  error handling. It does not start a server.
- `src/data/pixels.ts`: Supplied generation and shared pixel state. Import
  `getPixels` to read the current dataset without starting a server or timer.
  `regeneratePixels` explicitly replaces the dataset. Requests do not
  regenerate data, and there are no timers or streaming updates.
- `openapi.ts`: Shared API documentation at `/api/v1/docs` and
  `/api/v1/docs.json`. `/api-docs.json` remains a legacy alias.
- `src/index.ts`: Supplied CLI argument parsing and HTTP requests.
- `src/api/index.ts`: Preserves the grouped `api.pixels` Router export and
  supplies `createApi` for fixture-based apps.
- `src/api/pixels.ts`: Mounted candidate Router. `createPixelsRouter` accepts
  a `getPixels` callback so tests can supply or replace the dataset.
- `src/utils/pixels.ts`: Candidate grid and optional lookup helpers. Inputs
  are readonly and must not be mutated.
- `src/interfaces/pixels.ts`: Shared pixel model.
- `test/helpers/api.ts`: Ephemeral HTTP server and fixture replacement.
- `test/fixtures/pixels.ts`: Deterministic fixtures.
- `test/pixels.test.ts`: HTTP harness example and candidate TODO cases.
- `test/data.test.ts`: Supplied dataset regression checks.

## Exercise Requirements

1. Complete `GET /api/v1/pixels` to return the supplied dataset.
2. Complete `GET /api/v1/pixels/:id` to return one matching object. Invalid
   IDs produce 400; absent positive integer IDs produce 404.
3. Complete `GET /api/v1/pixels/grid` and `toPixelGrid` to convert exactly
   10,000 pixels into 100 independent rows of 100 cells,
   preserving input order and leaving the input unchanged. Reject any other
   input size. Pixel objects may be shared.
4. Fill in tests for response contracts, validation, lookup, grid boundaries,
   row identity, input sizes, and non-mutation.
5. Discuss or implement faster repeated lookup and correct invalidation after
   a dataset replacement. This follow-up is not a fourth endpoint.

There is no summary endpoint, frontend, streaming requirement, or candidate
fetch work. Keep `/grid` before `/:id`. `npm test` deliberately reports TODO
cases until candidates write them; passing setup tests alone is not completion.

## Backend Behavior

- `getPixels()` supplies 10,000 pixels with fixed IDs and exactly
  9,400 green, 500 yellow, and 100 red pixels.
- Green pixels have `healthy: true`; yellow and red pixels have `healthy: false`.
- Intensity is an integer from 0 to 100; RGB channels are integers from 0 to 255.
- Three pixel routes are mounted and initially return JSON TODO responses
  with status 501.
- Swagger is at `/api/v1/docs`; its JSON is at `/api/v1/docs.json`.
- The supplied CLI prints JSON to stdout and errors to stderr, exiting
  nonzero for failures.
