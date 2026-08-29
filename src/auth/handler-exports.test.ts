import { describe, it, expect } from "vitest";
import { providerHandlerExports } from "./handler-exports.js";
import { emptyIrResponse, providerDef } from "./__tests__/fixtures.js";

function fakeAccountController() {
  return {
    list: () => [],
    enable: () => {},
    remove: () => {},
    login: async () => null,
  };
}

describe("providerHandlerExports", () => {
  it("builds handleIr from the driver", () => {
    const driver = providerDef({
      id: "stub",
      models: { "stub-1": { name: "Stub 1" } },
      handleIr: async () => emptyIrResponse(),
    });
    const result = providerHandlerExports(driver);
    expect(result.handleIr).toBe(driver.handleIr);
  });

  it("includes accounts/loginFlow/menu/menuModel when the driver supports them", () => {
    const driver = providerDef({
      id: "claude",
      label: "Claude",
      accounts: fakeAccountController(),
      loginFlow: async () => ({ url: "https://example.com", complete: async () => null }),
    });
    const result = providerHandlerExports(driver);
    expect(result.accounts).toBe(driver.accounts);
    expect(result.loginFlow).toBe(driver.loginFlow);
    expect(typeof result.menu).toBe("function");
    expect(typeof result.menuModel).toBe("function");
    // both are callable against the real menu-model builder without throwing
    expect(() => result.menuModel!()).not.toThrow();
  });

  it("omits accounts/loginFlow/menu/menuModel when the driver has none (custom-auth-style)", () => {
    const driver = providerDef({ id: "custom", label: "Custom endpoint" });
    const result = providerHandlerExports(driver);
    expect(result.accounts).toBeUndefined();
    expect(result.loginFlow).toBeUndefined();
    expect(result.menu).toBeUndefined();
    expect(result.menuModel).toBeUndefined();
    expect("accounts" in result).toBe(false);
    expect("menu" in result).toBe(false);
    expect("menuModel" in result).toBe(false);
  });
});
