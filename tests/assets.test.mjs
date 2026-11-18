import test from "node:test";
import assert from "node:assert/strict";
import { places } from "../src/places.mjs";
import { cameraForBuilding } from "../src/world-config.mjs";
test("all five portfolio sections have unique, reachable buildings", () => {
  assert.deepEqual(
    places.map((p) => p.id),
    ["about", "projects", "skills", "gallery", "contact"],
  );
  assert.equal(new Set(places.map((p) => p.pos.join(","))).size, 5);
  for (const p of places) {
    assert.ok(p.name && p.subtitle && p.description);
    assert.match(p.color, /^#[0-9a-f]{6}$/i);
    assert.ok(Math.hypot(p.pos[0], p.pos[2]) < 5.5, "building fits on island");
    assert.ok(cameraForBuilding(p.pos).position.every(Number.isFinite));
  }
});
