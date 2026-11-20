# TypeScript Pixel Interview

45 minutes: implement three endpoints, test them, then discuss scaling.
Server setup, 10,000 pixels, types, and a test harness are supplied.

## Setup

Use Node 24. If needed, run `bash setup.sh` to install Node and dependencies.
Otherwise:

```bash
npm ci
```

Start the backend:

```bash
npm run server
```

API: `http://localhost:4090`. Swagger: `http://localhost:4090/api/v1/docs`.

## Endpoints (20 Minutes)

Complete the mounted Router in `src/api/pixels.ts`. Its `getPixels()` callback
provides the current dataset; do not generate new data for each request.

1. `GET /api/v1/pixels`: return the pixel array as JSON.
2. `GET /api/v1/pixels/:id`: return one matching pixel. Use 400 for invalid
   IDs and 404 for an absent positive integer ID.
3. `GET /api/v1/pixels/grid`: return 100 independent rows of 100 cells,
   preserving input order. Implement `toPixelGrid` in `src/utils/pixels.ts`;
   reject other input sizes. `findPixel` is an optional lookup helper.

Keep the supplied types and do not mutate input. Routes initially return 501.
After implementing them, try these in another terminal:

```bash
curl http://localhost:4090/api/v1/pixels
curl http://localhost:4090/api/v1/pixels/42
curl http://localhost:4090/api/v1/pixels/grid
```

## Tests (15 Minutes)

Run `npm test` and complete the TODO cases in `test/pixels.test.ts`.
Fixtures and an HTTP helper are supplied in `test/`. Cover missing IDs,
validation, grid boundaries, independent rows, wrong input sizes, and
immutability. The passing setup checks alone do not complete the exercise.

Also run `npm run typecheck` and `npm run lint`.

## Follow-Up (10 Minutes)

How would you optimize repeated ID lookups while keeping results correct
after the dataset is replaced? Discuss complexity, memory, and tests.
