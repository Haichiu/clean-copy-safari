import assert from "node:assert/strict";
import test from "node:test";
import { cleanURL } from "../extension/clean-url.js";

test("removes common trackers and preserves useful parameters", () => {
  assert.deepEqual(
    cleanURL("https://example.com/search?q=privacy&utm_source=newsletter&fbclid=abc#results"),
    { url: "https://example.com/search?q=privacy#results", removed: 2 }
  );
});

test("removes duplicate and case-insensitive tracking parameters", () => {
  assert.deepEqual(
    cleanURL("https://example.com/?UTM_Source=a&utm_source=b&id=42"),
    { url: "https://example.com/?id=42", removed: 2 }
  );
});

test("applies safe domain-specific cleanup", () => {
  assert.deepEqual(
    cleanURL("https://www.youtube.com/watch?v=abc123&si=share-token&feature=shared&t=90"),
    { url: "https://www.youtube.com/watch?v=abc123&t=90", removed: 2 }
  );
  assert.deepEqual(
    cleanURL("https://www.amazon.com/dp/ABC?tag=affiliate-20&th=1"),
    { url: "https://www.amazon.com/dp/ABC?th=1", removed: 1 }
  );
});

test("does not modify unsupported or malformed URLs", () => {
  assert.deepEqual(cleanURL("about:blank"), { url: "about:blank", removed: 0 });
  assert.deepEqual(cleanURL("not a url"), { url: "not a url", removed: 0 });
});
