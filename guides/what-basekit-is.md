---
title: What basekit is
---

# What basekit is, and what it is not

basekit is the shared foundation the ecosystem's plugins, providers, proxies and hosts are built out
of. It publishes as `@intisy-ai/basekit`, scoped only, and it is one package with several subpaths
because it is five libraries that were merged once it became clear they were released, pinned and
swept as a unit anyway.

| subpath | what lives there |
| --- | --- |
| `@intisy-ai/basekit` | config, logging, app detection, the hook guard, the command and config-CLI framework, the event bus, the activity seam, and the capability vocabulary the ecosystem renders |
| `@intisy-ai/basekit/ir` | the vendor-neutral canonical IR: its types, its `spi/`, and the `VendorTranslator` / `StreamTranslator` interfaces |
| `@intisy-ai/basekit/auth` | the provider and account library: `ProviderDef`, the account store, the OAuth flows |
| `@intisy-ai/basekit/proxy` | the generic routing and `:34567` HTTP-proxy engine, parameterised by a `RoutingProfile` |
| `@intisy-ai/basekit/loader/*` | the generic half of a loader: the TUI, the plugin-manager seam, the app home, the marketplace and the capability catalog |
| `@intisy-ai/basekit/testing` | the shared plugin contract kit, on its own subpath so a plugin bundling basekit never pulls vitest in |
| `@intisy-ai/basekit/runtime` | the shared Java class library a `brazier`-built TeaVM bundle links against instead of embedding its own |

The rest of these guides call the subpaths by their short names, `ir`, `auth`, `proxy`, `loader`.

## What it is not for

Every part of basekit has a neighbour it is confusable with, and the distinction is the same one
every time: **basekit is the generic engine, and the specifics live in the repo that owns them.**

- **basekit is not bayonet.** bayonet is the plugin *contract*: what a plugin is, what a host may ask
  of one, and the driver that runs it. basekit is *behaviour* a plugin or a host takes so it need not
  write its own. A plugin depends on bayonet by definition; it depends on basekit only when it wants
  what basekit does.
- **`ir` is not a translator.** It ships zero vendor translators. Every vendor lives in its own
  `*-translator` repo depending on this subpath. It does not contain the word `Provider` either,
  which is what lets `proxy` route without referencing `auth`.
- **`proxy` is not an app-proxy.** It carries no per-app logic at all. `claude-code-proxy` and
  `opencode-proxy` are the repos that know an app, and each is a `RoutingProfile` on top of this
  engine. A new proxy-using app gets its own `<app>-proxy`; it never gets a branch in here.
- **`loader` is not a loader.** `claude-code-loader` and `opencode-loader` are, and each carries only
  its app's paths, names and front door.
- **`auth` is not a provider.** A provider is a plugin implementing `handleIr` against one upstream
  vendor. This subpath is the vocabulary and the storage every provider implements against.

Read [the layer guide](layer.md) for the rule that keeps those apart, [the seams guide](seams.md) for
the one entry point each subpath offers, and [reaching it](reaching-it.md) for how a consumer gets
hold of any of it.
