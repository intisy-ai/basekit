import { describe, it, expect } from "vitest";
import { isCoolingDown } from "./ratelimit.js";
import { coreAccount } from "./__tests__/fixtures.js";

describe("isCoolingDown", () => {
  it("is true while coolingDownUntil is still in the future", () => {
    expect(isCoolingDown(coreAccount({ coolingDownUntil: 2000 }), 1000)).toBe(true);
  });

  it("is false once coolingDownUntil has passed", () => {
    expect(isCoolingDown(coreAccount({ coolingDownUntil: 1000 }), 2000)).toBe(false);
  });

  it("is false when the account was never put in cooldown", () => {
    expect(isCoolingDown(coreAccount(), 1000)).toBe(false);
  });
});
