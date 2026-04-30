# @contractspec/lib.notification

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add provider delta contracts, Google Drive knowledge ingestion, and governed mutation execution for workspace knowledge.
  - @contractspec/lib.bus@3.7.29
  - @contractspec/lib.contracts-spec@6.4.0

## 0.2.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
  - @contractspec/lib.bus@3.7.28
  - @contractspec/lib.contracts-spec@6.3.0

## 0.2.0

### Minor Changes

- Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.notification (minor), @contractspec/module.notifications (patch), @contractspec/lib.design-system (minor), @contractspec/example.crm-pipeline (patch), @contractspec/example.wealth-snapshot (patch), @contractspec/example.saas-boilerplate (patch)
  - Migration: Move new notification integrations away from the module shim.; Provide notification items and callbacks to the design-system shell without coupling it to a delivery runtime.
  - Deprecations: The `@contractspec/module.notifications` package remains import-compatible for this release, but new code should import contracts from `@contractspec/lib.contracts-spec/notifications` and runtime helpers from `@contractspec/lib.notification`.

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.bus@3.7.27
  - @contractspec/lib.contracts-spec@6.2.0
