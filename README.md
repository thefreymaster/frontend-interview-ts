## Getting Started

Node 24 is required and pinned in `.nvmrc`. If it is already installed:

```bash
npm ci
```

Otherwise, run:

```bash
bash setup.sh
```

The setup script installs nvm v0.40.8 if missing, installs Node 24, sets it as
your default, and installs dependencies. It requires Bash, curl, internet
access, and permission to write to your nvm directory (normally `$HOME/.nvm`).
Open a new terminal afterward, or load nvm and run `nvm use` in the current one.

Start the supplied backend in one terminal:

```bash
npm run server
```

In another terminal, see the CLI usage:

```bash
npm run dev -- --help
```

The following commands work after implementing the exercise functions:

```bash
npm run dev -- summary
npm run dev -- pixel --id 42
npm run dev -- watch
npm run dev -- watch --id 42
```

The default command is `summary`. Use `--base-url http://localhost:4090` to
select an API server explicitly. Pixel IDs must be integers from 1 to 10000.
Reports go to stdout as JSON; loading messages and errors go to stderr.
One-off command failures exit with a nonzero status. Press Ctrl+C to stop
watching and disconnect the socket.

There is no frontend server or development proxy. The CLI connects directly
to the backend at `http://localhost:4090`.

## Interview Exercise

### Core Tasks

1. Implement `get` and `getById` in `src/api/api.ts` using Node's built-in
   `fetch`. Keep their typed return values and respect the `baseUrl` argument.
   Handle network failures and non-success HTTP responses, including 404s,
   with meaningful errors.
2. Implement `summarizePixels` in `src/pixels.ts`. Return the total number of
   pixels, healthy and unhealthy counts, counts for each color, and average
   intensity. Use `healthy` for health counts and `meta_data.color` for color
   counts. Accept any array size, do not mutate the input, and return zero for
   every count and the average when the array is empty.
3. Use `summary` to fetch and report the dataset. Use `pixel --id 42` to fetch
   and display that pixel's ID, health, metadata, and RGB sub-pixel values.
   The CLI already wires these commands to your functions.
4. Verify that invalid IDs, unknown pixels, and an unavailable server produce
   useful errors rather than unhandled exceptions.

The summary has this shape. The average below is illustrative and varies with
the randomly generated data:

```json
{
  "total": 10000,
  "healthy": 9400,
  "unhealthy": 600,
  "colors": {
    "green": 9400,
    "yellow": 500,
    "red": 100
  },
  "averageIntensity": 50.12
}
```

### Optional Extension

Implement `findPixel` in `src/pixels.ts` using the pixel's ID, returning
`undefined` when it is absent and leaving the input unchanged. Run
`watch --id 42` to report a summary and the selected pixel as quality changes.
An absent selected pixel is printed as `null`.

The supplied stream helper handles connection lifecycle, full snapshots,
batched updates, and reconnection. Candidates do not need to know Socket.IO.
The interesting part is consuming typed data and keeping the selected pixel
and report in sync. Connection errors are logged while the client retries.

For a shorter interview, stop after the core tasks. Discuss response
validation, request timeouts, lookup complexity, or automated testing if time
permits; no additional libraries are necessary to complete the exercise.

## Project Layout

| Location | Purpose |
| --- | --- |
| `src/api/api.ts` | Candidate: typed list and detail HTTP fetch functions |
| `src/pixels.ts` | Candidate: summary and optional in-memory lookup |
| `src/index.ts` | Supplied CLI argument parsing, output, and error handling |
| `src/stream.ts` | Supplied framework-free Socket.IO connection and batching |
| `src/interfaces/pixels.ts` | Shared `IPixel` data model |
| `src/interfaces/pixelEvents.ts` | Typed Socket.IO event contract |
| `index.ts` | Supplied Express mock API and quality simulation |
| `openapi.ts` | OpenAPI specification |

```text
summary -> get -> GET /api/v1/pixels -> summarizePixels -> JSON
pixel --id 42 -> getById -> GET /api/v1/pixels/42 -> JSON
watch -> Socket.IO -> batched pixels -> summarizePixels / findPixel -> JSON
```

## Mock API

All endpoints use `GET` and require no authentication:

| Endpoint | Response |
| --- | --- |
| `/api/v1/pixels` | 10,000 freshly generated pixels |
| `/api/v1/pixels/:id` | One pixel from the current live state, or a JSON 404 |
| `/api/v1/user` | Mock user ID, name, email, and role |
| `/api/v1/docs` | Swagger UI |
| `/api/v1/docs.json` | OpenAPI JSON |

Open Swagger at `http://localhost:4090/api/v1/docs`. The legacy
`/api-docs.json` path is also available on the backend.

Every list request regenerates the dataset, keeping IDs from 1 to 10000.
Each response has exactly 9,400 green pixels (94%), 500 yellow pixels (5%),
and 100 red pixels (1%), randomly distributed across IDs. Green pixels are
healthy; yellow and red pixels are not. Pixel responses disable HTTP caching.

| Field | Description |
| --- | --- |
| `id` | Sequential pixel identifier |
| `healthy` | Whether the pixel is green |
| `meta_data.intensity` | Integer from 0 to 100 |
| `meta_data.color` | `green`, `yellow`, or `red` |
| `sub_pixels.red` | Red channel value from 0 to 255 |
| `sub_pixels.green` | Green channel value from 0 to 255 |
| `sub_pixels.blue` | Blue channel value from 0 to 255 |

Detail requests do not regenerate data. They return the current live state,
including changes made since startup or the latest list request.

### Live Updates

The same backend handles Socket.IO at `/socket.io`; it is not a plain
WebSocket endpoint. Quality changes every five seconds in a 12-step pattern
that repeats every minute. Each step preserves the exact color counts.
Only color and health change during the cycle; intensity and RGB values stay
fixed until a list request regenerates them.

| Server Event | Payload | Purpose |
| --- | --- | --- |
| `pixels:snapshot` | `IPixel[]` | Full state on connection, reconnection, or list refresh |
| `pixel:update` | `IPixel` | Complete data for a changed pixel |
| `pixels:updated` | None | End of a simulation step |

The stream helper buffers individual changes and publishes one consistent
array per completed step. A snapshot replaces the array and clears pending
updates. A list request resets the simulation and broadcasts its snapshot to
all clients, so another client's refresh also affects a running watch.
Summary counts stay constant; `watch --id 42` makes individual changes visible.

## Other Commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Type-check all TypeScript without emitting files |
| `npm run typecheck:server` | Type-check only the backend and its shared types |
| `npm run build` | Compile the CLI and backend into `dist/` |
| `npm start -- summary` | Run the compiled CLI (after building) |
| `npm run lint` | Run Node/TypeScript ESLint rules |

The compiled backend can also run with `node dist/index.js`.

## HackerRank Setup

Use a Node.js/TypeScript project workspace with a terminal; no browser preview
or exposed frontend port is needed. The workspace must support Node 24.
If runtime installation is permitted, use `bash setup.sh` as the setup command.

Setup and startup may run in different shells. Load nvm in each terminal:

```bash
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
. "$NVM_DIR/nvm.sh" && nvm use && npm run server
```

Keep the backend running, then use the CLI commands in a second terminal
with Node 24 active. Check connectivity inside the workspace with
`curl -i http://127.0.0.1:4090/api/v1/user` or inspect the specification with
`curl http://127.0.0.1:4090/api/v1/docs.json`.

If installing Node is prohibited, the question owner must provide a workspace
with Node 24. Repository settings do not change HackerRank's runtime.
