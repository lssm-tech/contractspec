---
"@contractspec/lib.presentation-runtime-core": major
---

Publish presentation bundler helpers from generated package artifacts.

The Metro and Next helper sources are now TypeScript entrypoints that build into the package's standard `dist` surface. Package exports point at generated `dist` files for npm consumers, while Metro CommonJS config loading keeps working through a generated `dist/metro.cjs` require target.

The root barrel still exposes the bundler helpers, and dedicated `./metro` and `./next` subpaths are available for consumers that want focused imports.
