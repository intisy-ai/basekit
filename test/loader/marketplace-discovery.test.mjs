// fetchCatalogsAsync reaches child_process, app-descriptor.js and state.js, and each test needs a
// FRESH copy of all three: a stale app-descriptor.js (with its cached activeDescriptor) or a stale S
// (with catalogFetched already true) would carry an earlier test's answer into this one. The loader
// module is ESM, so `exec` is bound at link time and cannot be patched on the module object; the
// module is mocked instead, and vi.resetModules() plus a dynamic import is what re-evaluates the
// subtree.
import { describe, it, beforeEach, afterEach, vi } from "vitest";
import assert from "node:assert";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { execCalls } = vi.hoisted(() => ({ execCalls: [] }));

// Every network read goes through `exec`, so capturing it keeps this off the real network entirely:
// no curl process is ever spawned and no callback fires, which is what the assertions rely on.
vi.mock("child_process", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, exec: (command) => { execCalls.push(command); } };
});

let dir;
const saved = {};
const KEYS = ["HUB_APPS_FILE", "HUB_CONFIG_DIR", "HUB_APP_ID"];

function registry(discovery) {
  writeFileSync(join(dir, "apps.json"), JSON.stringify({
    zeta: { id: "zeta", label: "Zeta", home: { candidates: [dir] }, ...(discovery ? { discovery } : {}) },
  }));
}

async function loadMarketplace() {
  vi.resetModules();
  execCalls.length = 0;
  const marketplace = await import("../../dist/loader/marketplace.js");
  const { S } = await import("../../dist/loader/state.js");
  const { FEATURED_PLUGINS } = await import("../../dist/loader/env.js");
  return { marketplace, S, FEATURED_PLUGINS, execCalls };
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "basekit-marketplace-disc-"));
  for (const key of KEYS) { saved[key] = process.env[key]; delete process.env[key]; }
  process.env.HUB_APPS_FILE = join(dir, "apps.json");
  process.env.HUB_CONFIG_DIR = dir;
  process.env.HUB_APP_ID = "zeta";
});

afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
  }
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
});

describe("marketplace discovery: an app's declared traits decide where its catalog looks", () => {
  it("an app declaring no awesomeList gets the built-in verified list seeded as Curated", async () => {
    registry({});
    const { marketplace, S, FEATURED_PLUGINS } = await loadMarketplace();

    marketplace.fetchCatalogsAsync();

    assert.strictEqual(S.MARKETPLACE_CATALOG.length, FEATURED_PLUGINS.length);
    assert.ok(S.MARKETPLACE_CATALOG.every((entry) => entry.category === "Curated"));
    assert.deepEqual(
      S.MARKETPLACE_CATALOG.map((entry) => entry.full_name).sort(),
      FEATURED_PLUGINS.map((entry) => entry.full_name).sort(),
    );
  });

  it("an app declaring an awesomeList does not get the built-in list seeded, and fetches its own", async () => {
    const declaredUrl = "https://raw.githubusercontent.com/zeta-org/awesome-zeta/main/README.md";
    registry({ awesomeList: declaredUrl });
    const { marketplace, S, execCalls: calls } = await loadMarketplace();

    marketplace.fetchCatalogsAsync();

    assert.strictEqual(S.MARKETPLACE_CATALOG.length, 0, "no FEATURED_PLUGINS entries should be seeded");
    assert.ok(calls.some((cmd) => cmd.includes(declaredUrl)), "the declared awesome list must be fetched");
    assert.ok(calls.every((cmd) => !cmd.includes("awesome-opencode")), "no hardcoded awesome list may run");
  });

  it("an app declaring no topic issues no topic search, and one declaring a topic searches it", async () => {
    registry({});
    const noTopic = await loadMarketplace();
    noTopic.marketplace.fetchCatalogsAsync();
    const topicSearches = noTopic.execCalls.filter((cmd) => cmd.includes("q=topic:"));
    assert.ok(
      topicSearches.every((cmd) => cmd.includes("mcp-server")),
      "an app with no declared topic must issue no topic search of its own, only the unconditional mcp-server one",
    );

    registry({ topic: "zeta-plugin" });
    const withTopic = await loadMarketplace();
    withTopic.marketplace.fetchCatalogsAsync();
    assert.ok(
      withTopic.execCalls.some((cmd) => cmd.includes("q=topic:zeta-plugin")),
      "an app declaring a topic must have it searched",
    );
  });
});
