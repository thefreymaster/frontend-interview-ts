import assert from "node:assert/strict";
import test from "node:test";
import {
  getPixels,
  PIXEL_COUNT,
  regeneratePixels,
} from "../src/data/pixels.js";

test("the supplied dataset has 10000 pixels and the documented color counts", () => {
  const pixels = getPixels();
  assert.equal(pixels.length, PIXEL_COUNT);
  const counts = { green: 0, yellow: 0, red: 0 };
  for (const [index, pixel] of pixels.entries()) {
    assert.equal(pixel.id, index + 1);
    assert.equal(pixel.healthy, pixel.meta_data.color === "green");
    counts[pixel.meta_data.color]++;
  }
  assert.deepEqual(counts, { green: 9400, yellow: 500, red: 100 });
});

test("regeneration replaces shared data without mutating the previous snapshot", () => {
  const previous = getPixels();
  const before = JSON.stringify(previous);
  const replacement = regeneratePixels();
  assert.notStrictEqual(replacement, previous);
  assert.strictEqual(getPixels(), replacement);
  assert.equal(replacement.length, PIXEL_COUNT);
  assert.equal(JSON.stringify(previous), before);
});
