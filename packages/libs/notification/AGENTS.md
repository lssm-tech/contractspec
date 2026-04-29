# AI Agent Guide — `@contractspec/lib.notification`

Scope: `packages/libs/notification/*`

Library-first notification runtime helpers for ContractSpec applications.

## Architecture

- `src/contracts` re-exports canonical notification contracts from `@contractspec/lib.contracts-spec/notifications`.
- `src/entities` owns notification schema entities and exports both canonical and legacy schema contributions.
- `src/channels`, `src/templates`, and `src/i18n` own reusable notification runtime helpers.
- `src/notifications.capability.ts` and `src/notifications.feature.ts` re-export canonical contracts-spec notification surfaces.

## Public Surface

- Canonical schema contribution: `notificationsSchemaContribution.moduleId === "@contractspec/lib.notification"`.
- Legacy compatibility contribution: `legacyNotificationsSchemaContribution.moduleId === "@contractspec/module.notifications"`.
- Keep `exports` and `publishConfig.exports` aligned when adding or moving subpaths.

## Guardrails

- Do not import `@contractspec/module.notifications` from this library.
- Keep i18n catalogs in sync across `en`, `es`, and `fr`.
- Keep channel/template behavior compatible with the former module implementation.
