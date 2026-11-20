import assert from "node:assert/strict";
import test from "node:test";
import { startApi } from "./helpers/api.js";

test("the supplied HTTP harness can read the API documentation", async (t) => {
  const api = await startApi(t);
  const response = await api.get("/api/v1/docs.json");
  assert.equal(response.status, 200);
  const document = await response.json();
  assert.ok(typeof document === "object" && document !== null && "openapi" in document);
  assert.equal(document.openapi, "3.0.3");
});

test.todo("GET /api/v1/pixels returns all supplied pixels without mutation");
test.todo("GET /api/v1/pixels/:id finds a pixel by ID in an unsorted fixture");
test.todo("GET /api/v1/pixels/:id returns 400 for malformed or nonpositive IDs");
test.todo("GET /api/v1/pixels/:id returns 404 for an absent positive integer ID");
test.todo("GET /api/v1/pixels/grid returns 100 rows of 100 cells in input order");
test.todo("toPixelGrid creates independent rows without mutating frozen input");
test.todo("toPixelGrid rejects input lengths other than 10000");
test.todo("follow-up: ID lookup stays correct after api.replacePixels");
