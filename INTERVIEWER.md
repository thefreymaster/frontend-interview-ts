# Interviewer Guide

This is a 45-minute senior-engineer interview: 20 minutes implementing three
endpoints, 15 minutes testing, and 10 minutes on a scaling follow-up.
Install dependencies and confirm the supplied harness works before the clock
starts. No frontend, summaries, streaming, or data-generation work is required.

## Endpoints (20 Minutes)

The Router in `src/api/pixels.ts` is already mounted. Its `getPixels` callback
defaults to the shared store in `src/data/pixels.ts`. All three handlers return
501 TODO responses; candidates complete them without changing the bootstrap.
`toPixelGrid` and the optional `findPixel` in `src/utils/pixels.ts` remain TODOs.

| Endpoint | Expected behavior |
| --- | --- |
| `GET /api/v1/pixels` | Return the supplied array as JSON; do not generate a separate dataset. |
| `GET /api/v1/pixels/:id` | Return one object by ID, not array position. Invalid, nonpositive, fractional, or unsafe IDs produce 400; absent positive integer IDs produce 404. |
| `GET /api/v1/pixels/grid` | Return 100 distinct rows of 100 complete pixel objects, preserving input order without mutation. |

A linear `.find()` is sufficient for the core lookup. Do not require a Map yet.
For the grid, O(n) time and O(n) output storage are appropriate. Pixel objects
may be shared; deep cloning is not required. The helper should throw on input
lengths other than 10000. The supplied error middleware converts such an
internal dataset error to JSON with status 500.

## Tests (15 Minutes)

`npm test` uses Node's built-in runner with the existing `tsx` loader.
`test/pixels.test.ts` has a working HTTP example and TODO test names, not
finished acceptance tests. Passing only the setup checks is not completion.

`startApi(t, fixture)` starts the real app on an ephemeral loopback port and
closes it after the test. It supplies `api.get(path)` and
`api.replacePixels(nextFixture)`. `makePixels(count)` provides deterministic
pixel objects; use small or shuffled fixtures for lookup scenarios.

Look for status and JSON assertions, missing and malformed IDs, row
boundaries (99/100 and 9999), independent rows, preserved order, and unchanged
inputs. Row identity must be tested on the utility directly: JSON serialization
does not preserve array-reference identity. Include empty or wrong-sized grid
inputs, which should be rejected rather than silently truncated.

## Follow-Up (10 Minutes)

Ask: "How would you optimize repeated ID lookups, and keep them correct when
the dataset is replaced?"

Discuss or implement an ID index with O(n) construction and expected O(1)
lookup. Probe when it is worth the extra memory, and how to avoid rebuilding
it on every request. A replacement with the same length must still invalidate
the index; array length alone is not a safe cache key.

Use `api.replacePixels` to change IDs or metadata and check for stale results.
The shared store also exposes `regeneratePixels` for an explicit refresh.
An immutable snapshot reference or version can drive invalidation. The final
TODO test is a follow-up prompt, not a core requirement.

Assess clear code, API contracts, meaningful tests, and explained trade-offs.
Do not score solely on speed, syntax choices, or familiarity with tooling.
