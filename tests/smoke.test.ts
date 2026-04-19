import assert from "node:assert/strict";
import test from "node:test";

import { formatSlug } from "../lib/payload/fields/slug.ts";

test("formatSlug normalizes page titles", () => {
  assert.equal(formatSlug("  Kalink Studio Launch Page  "), "kalink-studio-launch-page");
});
