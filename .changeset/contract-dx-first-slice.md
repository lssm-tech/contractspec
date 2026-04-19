---
"@contractspec/lib.contracts-spec": minor
"@contractspec/module.workspace": minor
"@contractspec/bundle.workspace": minor
"@contractspec/app.cli-contractspec": minor
---

Improve DX and reliability for app-config, theme, and feature authoring.

- add explicit contract validators and assertion helpers for app-config, theme, and feature surfaces in `@contractspec/lib.contracts-spec`
- make `theme` a first-class authored target in workspace discovery and structure validation, and route authored `app-config`, `theme`, and `feature` checks through package-level validators in `@contractspec/bundle.workspace`
- add `contractspec create theme` and align app-config scaffolding with `key`-based refs and semver string versions across the CLI and shared templates
