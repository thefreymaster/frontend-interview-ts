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
  The provided `usePixels` hook calls the empty list fetch function.
- **API exercise:** `get` and `getById` in `src/api/api.ts` are intentionally
  empty. No HTTP requests are implemented in the frontend.
- **Backend:** `index.ts` is a TypeScript Express server run with `tsx`.
  It provides pixel list/detail data and a user profile.
  `openapi.ts` defines the API specification served by Swagger UI.

The page components return `null`. Grid rendering, click navigation, and detail
display are not implemented. The intended data flow for the exercise is:

```text
Pixels -> usePixels -> get -> GET /api/v1/pixels
Pixel -> getById -> GET /api/v1/pixels/:id
```

| Location | Purpose |
| --- | --- |
| `src/api/api.ts` | Empty pixel list and detail fetch functions |
| `src/hooks/usePixels.ts` | Provided React Query list hook |
| `src/components/Pixels/Pixels.tsx` | Empty grid page |
| `src/components/Pixel/Pixel.tsx` | Empty detail page |
| `src/components/Header/Header.tsx` | Shared header |
| `src/interfaces/pixels.ts` | Shared `IPixel` data model |
| `src/router/index.tsx` | Page routes and shared layout |
| `index.ts` | Express API routes |
| `openapi.ts` | OpenAPI schemas and endpoint documentation |
| `vite.config.ts` | Frontend port and development API proxy |
| `tsconfig.server.json` | Server TypeScript configuration |

## Local Development

Use Node.js 20+ and install dependencies, including dev dependencies:

```bash
npm install
```

Run the backend and frontend in separate terminals:

```bash
npm run server
```

```bash
npm run dev
```

The frontend is configured for `http://localhost:5090`. The backend is configured
for `http://localhost:4090`. Vite proxies `/api/v1` requests to the backend.

Backend documentation URLs:

- Swagger UI: `http://localhost:4090/api/v1/docs`
- OpenAPI JSON: `http://localhost:4090/api-docs.json`

The server defines these endpoints. All use `GET` and require no authentication:

| Endpoint | Response |
| --- | --- |
| `/api/v1/pixels` | 10,000 pixels for a 100 by 100 grid |
| `/api/v1/pixels/:id` | One pixel, or a JSON 404 if the ID is not found |
| `/api/v1/user` | Mock user ID, name, email, and role |

Pixel data is generated once per server start. IDs range from `1` to `10000`,
and list/detail responses use the same data until the server restarts.

Each pixel includes:

| Field | Description |
| --- | --- |
| `id` | Sequential pixel identifier |
| `healthy` | Mock health flag |
| `meta_data.intensity` | Integer from 0 to 100 |
| `meta_data.color` | Mock label: `red`, `yellow`, or `blue` |
| `sub_pixels.red` | Red channel value from 0 to 255 |
| `sub_pixels.green` | Green channel value from 0 to 255 |
| `sub_pixels.blue` | Blue channel value from 0 to 255 |

Other available commands:

| Command | Purpose |
| --- | --- |
| `npm run typecheck:server` | Type-check the server without starting it |
| `npm run build` | Type-check all projects and build the frontend |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the built frontend |

## Interview Exercise

1. Implement the empty list and detail fetch functions.
2. Use the returned pixels to render a 100 by 100 grid in `Pixels`.
   Each pixel should be 5px wide and 5px high, have rounded corners, and use
   `meta_data.color` as its background color.
3. Clicking a pixel should navigate to `/pixels/:id`.
4. Display the selected pixel's health, metadata, and RGB sub-pixel values in
   `Pixel`.
5. Handle loading, error, and unknown-pixel states.

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
| Color:        blue                                           |
|                                                              |
| RGB sub-pixel values                                         |
| Red: 128          Green: 64          Blue: 255               |
+--------------------------------------------------------------+
```

The detail values are illustrative. Use the selected pixel's API response.

These are interview requirements, not completed features. Keep the components
and pixel fetch functions empty until the exercise is implemented.
