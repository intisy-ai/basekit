import { describe, it, expect } from "vitest";
import { scoreOf, qualityLabel, isIpLimited, IP_LIMIT_COOLDOWN_MS } from "./scoring.js";
import { proxyEntry, proxyStore } from "./__tests__/fixtures.js";

const store = proxyStore();

describe("scoring", () => {
  it("penalizes IP-rate-limit hits (lower is better)", () => {
    const clean = proxyEntry({ url: "a", stats: { checks: 10, failures: 0, avgLatencyMs: 200, ipRateLimitHits: 0 } });
    const limited = proxyEntry({ url: "b", stats: { checks: 10, failures: 0, avgLatencyMs: 200, ipRateLimitHits: 3 } });
    expect(scoreOf(store, clean)).toBeLessThan(scoreOf(store, limited));
  });

  it("qualityLabel reflects IP-limit history", () => {
    expect(qualityLabel(proxyEntry({ stats: { checks: 20, failures: 0, avgLatencyMs: 150, ipRateLimitHits: 0 } }))).toBe("good");
    expect(qualityLabel(proxyEntry({ stats: { checks: 20, failures: 10, avgLatencyMs: 150, ipRateLimitHits: 5 } }))).toBe("poor");
  });

  it("isIpLimited is time-boxed", () => {
    const now = 1_000_000;
    expect(isIpLimited(proxyEntry({ stats: { lastRateLimitAt: now - 1000 } }), now)).toBe(true);
    expect(isIpLimited(proxyEntry({ stats: { lastRateLimitAt: now - IP_LIMIT_COOLDOWN_MS - 1 } }), now)).toBe(false);
    expect(isIpLimited(proxyEntry({ stats: {} }), now)).toBe(false);
  });
});
