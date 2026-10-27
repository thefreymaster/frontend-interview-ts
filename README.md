# Frontend Interview

A hypothetical React and TypeScript coding interview: build a 100 by 100 pixel
grid and navigate to a selected pixel's details. This repository only supplies
the groundwork; the frontend solution is intentionally unfinished.

## Architecture

- **Frontend:** React 19 and TypeScript, served by Vite.
- **Routing:** React Router defines page routes and a shared header layout in
  `src/router/index.tsx`. `/` and `/pixels` render the empty `Pixels` component;
  `/pixels/:id` renders the empty `Pixel` component.
- **Data fetching:** TanStack React Query is configured in `src/main.tsx`.
  `usePixels` remains an empty hook for the interview exercise.
- **API exercise:** `get` and `getById` in `src/api/api.ts` are intentionally
  empty. No HTTP requests are implemented in the frontend.
- **Live updates:** `SocketIOProvider` owns the shared connection and is mounted
  inside `QueryClientProvider` in `src/main.tsx`. `App` mounts `usePixelUpdates`,
  which subscribes to that socket and updates React Query caches without
  rendering UI. `useSocketIO` exposes the socket, connection status, and errors.
- **Backend:** `index.ts` is a TypeScript Express server run with `tsx`.
  It provides pixel list/detail data, a user profile, and a Socket.IO stream.
  `openapi.ts` defines the API specification served by Swagger UI.

The page components return `null`. Grid rendering, click navigation, and detail
display are not implemented. The intended data flow for the exercise is:

```text
Pixels -> usePixels -> get -> GET /api/v1/pixels
Pixel -> getById -> GET /api/v1/pixels/:id
Socket.IO -> usePixelUpdates -> React Query cache -> pixel UI
```

| Location | Purpose |
| --- | --- |
| `src/api/api.ts` | Empty pixel list and detail fetch functions |
| `src/hooks/usePixels.ts` | Empty list query hook to implement |
| `src/hooks/usePixelUpdates.ts` | Implemented Socket.IO cache bridge |
| `src/hooks/useSocketIO.ts` | Shared socket and connection-state hook |
| `src/providers/SocketIOProvider.tsx` | Socket.IO connection lifecycle |
| `src/providers/SocketIOContext.ts` | Typed socket context |
| `src/api/pixelQueryKeys.ts` | Shared list/detail cache keys |
| `src/components/Pixels/Pixels.tsx` | Empty grid page |
| `src/components/Pixel/Pixel.tsx` | Empty detail page |
| `src/components/Header/Header.tsx` | Shared header |
| `src/interfaces/pixels.ts` | Shared `IPixel` data model |
| `src/interfaces/pixelEvents.ts` | Typed Socket.IO event contract |
| `src/router/index.tsx` | Page routes and shared layout |
| `index.ts` | Express API routes |
| `openapi.ts` | OpenAPI schemas and endpoint documentation |
| `vite.config.ts` | Frontend port and development API proxy |
| `tsconfig.server.json` | Server TypeScript configuration |

## Local Development

Use Node.js 24. With nvm installed, select the version pinned in `.nvmrc`
and install dependencies, including dev dependencies:

```bash
nvm install
nvm use
npm ci
```

`package.json` requires Node 24, and `.npmrc` enables strict engine checks so
installing under Node 14 fails immediately instead of producing a broken setup.

Run the backend and frontend in separate terminals:

```bash
npm run server
```

```bash
npm run dev
```

The frontend is configured for `http://localhost:5090`. The backend is configured
for `http://localhost:4090`. Vite proxies `/api/v1` requests and `/socket.io`
HTTP/WebSocket traffic to the backend.

Backend documentation URLs:

- Swagger UI: `http://localhost:4090/api/v1/docs`
- OpenAPI JSON: `http://localhost:4090/api-docs.json`

The server defines these endpoints. All use `GET` and require no authentication:

| Endpoint | Response |
| --- | --- |
| `/api/v1/pixels` | 10,000 freshly generated pixels for a 100 by 100 grid |
| `/api/v1/pixels/:id` | One pixel from the latest snapshot, or a JSON 404 |
| `/api/v1/user` | Mock user ID, name, email, and role |

Every request to `/api/v1/pixels` regenerates the data while keeping IDs from
`1` to `10000`. Each response contains exactly 9,400 green pixels (94%), 500
yellow pixels (5%), and 100 red pixels (1%), randomly distributed across IDs.
Intensity and RGB values are randomized on each refresh.

The detail endpoint returns the current live pixel state, shared across clients,
without regenerating it. Before the first list request, it uses data generated
at startup and changed by the simulation. Pixel responses disable HTTP caching.

Each pixel includes:

| Field | Description |
| --- | --- |
| `id` | Sequential pixel identifier |
| `healthy` | `true` for green pixels; `false` for yellow or red pixels |
| `meta_data.intensity` | Integer from 0 to 100 |
| `meta_data.color` | Mock label: `green`, `yellow`, or `red` |
| `sub_pixels.red` | Red channel value from 0 to 255 |
| `sub_pixels.green` | Green channel value from 0 to 255 |
| `sub_pixels.blue` | Blue channel value from 0 to 255 |

## Socket.IO Stream

The server changes pixel quality every five seconds using a 12-step pattern
that repeats every minute. Each step preserves exactly 9,400 green, 500 yellow,
and 100 red pixels. Only color and the corresponding `healthy` flag change
during the cycle; intensity and RGB values stay fixed until an HTTP list refresh.
Fetching the list resets the cycle with newly randomized data for all clients.

The same server on port `4090` handles HTTP and Socket.IO at `/socket.io`.
Socket.IO clients are required; this is not a plain WebSocket endpoint.

| Server Event | Payload | Purpose |
| --- | --- | --- |
| `pixels:snapshot` | `IPixel[]` | Full state on connection, reconnection, and HTTP list refresh |
| `pixel:update` | `IPixel` | Complete pixel data when that pixel's quality changes |
| `pixels:updated` | None | Marks the end of a simulation step |

The frontend buffers individual pixel events and applies them together at the
end of each step, avoiding a cache refresh for every pixel event. A reconnect
receives a fresh snapshot. The bridge removes only its own listeners when it
unmounts; the provider disconnects the shared socket when the app unmounts.

Components inside the provider can use `useSocketIO()` to access `socket`,
`status` (`connecting`, `connected`, `disconnected`, or `error`), and `error`.
The socket connects to the frontend's origin through the Vite proxy and
automatically attempts reconnection after a connection failure.

The interview's query hooks should use the keys in `src/api/pixelQueryKeys.ts`:
`["PIXELS"]` for the list and `["PIXEL", id]` for details, with a numeric `id`.
The bridge seeds the list cache and updates any existing detail caches.
The empty page components and HTTP fetch functions are still left to implement.

Other available commands:

| Command | Purpose |
| --- | --- |
| `npm run typecheck:server` | Type-check the server without starting it |
| `npm run build` | Type-check all projects and build the frontend |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the built frontend |

## HackerRank Setup

The repository's Node version requirement does not change HackerRank's runtime
automatically. In a project workspace with nvm installed, configure the
initialization/setup command to run the following from the repository root:

```bash
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
. "$NVM_DIR/nvm.sh" &&
nvm install &&
nvm use &&
nvm alias default 24 &&
node --version &&
npm ci
```

The version output must start with `v24.`. Setup and application commands may
run in separate shells, so explicitly load nvm and select the pinned version
in each startup command as well.

Frontend startup command:

```bash
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
. "$NVM_DIR/nvm.sh" && nvm use && npm run dev
```

Backend startup command:

```bash
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
. "$NVM_DIR/nvm.sh" && nvm use && npm run server
```

If nvm is unavailable or installing Node is prohibited, the question owner
must provide a workspace with Node 24. For a standard coding question rather
than a project workspace, the Node version is controlled by HackerRank's
available language runtimes, not these repository files.

## Interview Exercise

1. Implement the empty list and detail fetch functions.
2. Use the returned pixels to render a 100 by 100 grid in `Pixels`.
   Each pixel should be 5px wide and 5px high, have rounded corners, and use
   `meta_data.color` as its background color.
3. Clicking a pixel should navigate to `/pixels/:id`.
4. Display the selected pixel's health, metadata, and RGB sub-pixel values in
   `Pixel`.
5. Handle loading, error, and unknown-pixel states.
6. Render incoming quality changes without losing the grid layout or selected
   pixel.

## Page Layout

These diagrams illustrate the intended pages, not implemented UI.

Grid page (`/` or `/pixels`):

```text
+--------------------------------------------------------------+
| [Logo] Pixel Interview                     Interview starter |
+--------------------------------------------------------------+
| Pixels                                                       |
|                                                              |
|     o o o o o o o o ... o   <- 100 columns                   |
|     o o o o o o o o ... o                                    |
|     o o o o o o o o ... o                                    |
|     .                                                        |
|     .                      100 rows                          |
|     o o o o o o o o ... o                                    |
|                                                              |
| Each o is a colored, rounded 5px by 5px cell.                |
| Click a cell to navigate to /pixels/:id.                     |
+--------------------------------------------------------------+
```

Detail page (`/pixels/:id`):

```text
+--------------------------------------------------------------+
| [Logo] Pixel Interview                     Interview starter |
+--------------------------------------------------------------+
| < Back to pixels                                             |
|                                                              |
| Pixel #42                                                    |
|                                                              |
| Health:       true                                           |
| Intensity:    75                                             |
| Color:        green                                          |
|                                                              |
| RGB sub-pixel values                                         |
| Red: 128          Green: 64          Blue: 255               |
+--------------------------------------------------------------+
```

The detail values are illustrative. Use the selected pixel's API response.

These are interview requirements, not completed features. Keep the components
and pixel fetch functions empty until the exercise is implemented.
