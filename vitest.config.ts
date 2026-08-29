import { defineConfig } from "vitest/config";

/**
 * @remarks
 * The long timeout is load-bearing: the drift gate shells out to Gradle, and a cold build takes
 * several times vitest's 5s default. Without it that test times out on every clean checkout and
 * reports a failure that reads as drift, which is the flapping gate that teaches a reader to
 * ignore red.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "test/**/*.test.{ts,mjs}"],
    setupFiles: ["test/temp-home.setup.ts"],
    testTimeout: 600000,
    // Hooks get the same allowance: a suite that shells out to Gradle or rebuilds dist before its
    // first test needs longer than the 10s default, and the whole merged tree is what it builds.
    hookTimeout: 600000,
  },
});
