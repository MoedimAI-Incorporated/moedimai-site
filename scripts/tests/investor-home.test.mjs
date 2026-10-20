import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const html = readFileSync(new URL("../../public/index_1.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../../public/site/investor.js", import.meta.url), "utf8");
test("homepage conversions and navigation have real destinations", () => {
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]), m[1]);
  assert.ok(html.includes('id="enquiry-form"'));
  assert.ok(html.includes('method="post"'));
  assert.ok(js.includes('fetch("/api/interest"'));
  assert.ok(!/moedimharvest|Moedim Harvest/.test(html));
});
test("all homepage assets exist locally and images are proportionate", () => {
  for (const m of html.matchAll(/(?:src|href)="(\/site\/[^"?#]+)"/g))
    assert.ok(existsSync(new URL("../../public" + m[1], import.meta.url)), m[1]);
  const css = readFileSync(new URL("../../public/site/investor.css", import.meta.url), "utf8");
  assert.match(css, /\.founder-image img\s*\{[^}]*height:\s*auto/);
  assert.ok(html.includes("investor-agriculture.webp"));
  assert.ok(html.includes("investor-vivian.webp"));
});
test("marketing page cannot request hardware capture", () => {
  assert.ok(!/getUserMedia|getDisplayMedia|MediaRecorder|navigator\.geolocation/.test(js));
  assert.ok(!/<(?:video|audio)\b|\bcapture=/.test(html));
});
