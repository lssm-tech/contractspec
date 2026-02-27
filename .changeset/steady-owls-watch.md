---
'@contractspec/bundle.library': patch
'@contractspec/app.web-landing': patch
---

Align ecosystem docs with the Cursor marketplace catalog model by documenting the root `.cursor-plugin/marketplace.json`, package-scoped plugin sources in `packages/apps-registry/cursor-marketplace`, and catalog-wide validation via `bun run plugin:contractspec:validate`.

Rename ecosystem navigation and docblocks from generic Plugin API and Registry wording to Marketplace Plugins, Authoring Templates, and Marketplace Manifest for consistent docs discoverability.
