---
title: Its seams
---

# The seam of each subpath, and the vocabulary it mints

**Each library mints the vocabulary for the categories IT defines**, and no other repo mints on its
behalf. A key is an object literal behind a generated type, so importing one costs no runtime.

## `basekit`: the ecosystem vocabulary

The root module mints every capability, service and topic the ecosystem renders, generated from its
Java contracts into `contracts.keys`:

```ts
import { SETTINGS, SCREENS, COMMANDS, ACCOUNTS, ROUTING, ACTIVITY, CONFIG_CHANGED } from "@intisy-ai/basekit";
```

Capabilities are what a HOST consumes (`screens`, `settings`, `commands`, `plugin-management`,
`library-management`, `marketplace-source`, `cross-app-sync`, `config-history`, `custom-endpoints`).
Services are what another PLUGIN consumes (`accounts`, `routing`, `activity`). Topics are the
ecosystem's bare-named events (`config.changed`, `plugin.installed`, `proxy.status`, and the rest).

Its other seams are the ones every plugin uses without thinking about them: `loadConfig` /
`defineConfig` / `setConfigValue` for the two-location config system, `createLogger` for the
per-plugin log, `getApp` for app detection, and `configCommand` / `maybeRunConfigCli` for the
cross-app command framework.

## `basekit/ir`: `IrHandler`, and deliberately not `Provider`

The canonical IR is what every AI chat request, response and stream is carried as internally. The
seam is `IrHandler`: an id plus `handleIr(IrRequest, ctx)` returning an `IrResponse` or an IR event
stream. A vendor translator implements `VendorTranslator` / `StreamTranslator` in its own repo.

This module mints `IrHandler` and stops there. It contains no capability id, and it must never
contain the word `Provider`: someone with no providers, no proxies and no translators has to be able
to use it.

## `basekit/auth`: mints `provider`

```ts
import { PROVIDER } from "@intisy-ai/basekit/auth";
```

`Provider extends IrHandler`, which is what lets `basekit/proxy` route to one without knowing it is a
provider. This module also owns the account store (`config/accounts.json`) and the OAuth flows.

A provider is `handleIr`-only, with **zero** app-wire format code: it translates IR to its own
upstream vendor format, calls upstream, and decodes the answer back to IR. On a non-2xx outcome it
throws `HandleIrError` rather than returning it, because IR models a message and never an HTTP
envelope.

## `basekit/proxy`: mints `front-door`

```ts
import { FRONT_DOOR } from "@intisy-ai/basekit/proxy";
```

The front door is whatever first receives the app's wire request. It decodes that wire format into
IR, hands the IR to the router, and encodes the result back. The engine is parameterised by a
`RoutingProfile` and knows nothing about any app.

It reconstructs a `Response` from a thrown `HandleIrError` so rate-limit fallback and verbatim 4xx
still work, and it recognises that error **by its stable `name` marker, never `instanceof`**.
Providers are bundled independently, so class identity does not survive the bundle boundary; the
duck-typing is deliberate rather than sloppy.

## `basekit/loader/*`: a wildcard subpath, grouped by job

The only module with no Java at all, and the largest. Its 34 entry points group into five jobs:

| job | entry points |
| --- | --- |
| the TUI | `tui`, `screens`, `selection`, `format`, `action-row`, `state`, `notify` |
| the plugin manager seam | `plugin-manager`, `plugins`, `updater`, `wrapper` |
| the app home | `app-home`, `home-paths`, `app-descriptor`, `app-capabilities`, `config`, `json`, `projects` |
| the marketplace | `marketplace`, `catalog-sources`, `mcp` |
| the capability catalog | `capability-catalog`, `capability-shapes`, `custom-tab`, `custom-provider`, `settings-model`, `provider-catalog`, `provider-menu`, `provider-rows`, `account-menu`, `activity-seam`, `loader-commands`, `loader-runtime`, `proxy-runner` |

A loader takes these and adds its app's paths, names and front door. Nothing here decides which app
is running.

## `basekit/testing`: the contract kit

`runPluginContract(spec)` registers the tests asserting the behaviours every plugin gets from
basekit, in fully isolated temporary homes that never touch the real `~/.claude` or
`~/.config/opencode`. It ships on its own subpath precisely so a plugin bundling basekit never pulls
vitest into its bundle.
