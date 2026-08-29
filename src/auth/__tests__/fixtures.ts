import type { IrResponse } from "../../ir/index.js";
import type { CoreAccount, ProviderDef } from "../types.js";

/**
 * One stored account with every required field filled in, so a test states only what it is about.
 *
 * @param overrides what this test cares about
 * @returns a complete account carrying those overrides
 */
export function coreAccount(overrides: Partial<CoreAccount> = {}): CoreAccount {
  return { id: "a@b.c", refresh: "r-a", ...overrides };
}

/**
 * An empty canonical response, for a driver whose answer is not what the test is about.
 *
 * @returns a well-formed response carrying no content
 */
export function emptyIrResponse(): IrResponse {
  return { id: "res-1", model: "stub-1", stopReason: "end_turn", content: [] };
}

/**
 * One provider definition with every required field filled in.
 *
 * @param overrides what this test cares about
 * @returns a complete definition carrying those overrides
 */
export function providerDef(overrides: Partial<ProviderDef> = {}): ProviderDef {
  return {
    id: "stub",
    label: "Stub",
    models: {},
    handleIr: async () => emptyIrResponse(),
    ...overrides,
  };
}
