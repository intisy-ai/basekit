// basekit ships tsc's OUTPUT TREE rather than a bundle per subpath. A bundle per subpath would
// inline the modules below it, so a consumer importing both `basekit` and `basekit/auth` would load
// two copies of the root module and two copies of its cached config and logger state. The tree keeps
// one copy, resolved by ordinary Node lookup, which is how every consumer already reaches the
// library: each marks it external and takes it from the home store.
//
// So this staging step only carries across what tsc does not: the TeaVM output and the shared
// runtime's manifest.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

// copy-generated.mjs takes only .js, and the shared runtime's manifest is the one piece of generated
// output that is not code: a consumer's Gradle build reads it to learn what the runtime carries, so
// it has to reach dist/ too.
const MANIFEST = "generated/runtime.manifest.json";
await mkdir(dirname(join("dist", MANIFEST)), { recursive: true });
await copyFile(join("src", MANIFEST), join("dist", MANIFEST));

console.log("Staged the shared runtime manifest into dist/");
