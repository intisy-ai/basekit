import type { ProxyEntry, ProxyStore } from "../store.js";

/**
 * A proxy pool with every required field filled in, so a test states only what it is about.
 *
 * @param overrides what this test cares about
 * @returns a complete store carrying those overrides
 */
export function proxyStore(overrides: Partial<ProxyStore> = {}): ProxyStore {
  return { version: 2, modes: {}, providers: {}, proxies: [], assignments: {}, manualSelection: {}, ...overrides };
}

/**
 * One pooled proxy with every required field filled in.
 *
 * @param overrides what this test cares about
 * @returns a complete entry carrying those overrides
 */
export function proxyEntry(overrides: Partial<ProxyEntry> = {}): ProxyEntry {
  return {
    url: "http://proxy.invalid:8080",
    provider: "manual",
    scope: { type: "global" },
    stats: { checks: 0, failures: 0, avgLatencyMs: 0, ipRateLimitHits: 0 },
    ...overrides,
  };
}
