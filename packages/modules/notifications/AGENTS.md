# AI Agent Guide -- `@contractspec/module.notifications`

Scope: `packages/modules/notifications/*`

Notification center module providing multi-channel delivery, templating, and i18n for ContractSpec applications.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing)

## Public Exports

- `.` -- root barrel
- `./channels` -- delivery channel adapters (email, in-app, push)
- `./contracts` -- contract definitions (commands, queries, events)
- `./entities` -- domain entities (Notification, Preference, Channel)
- `./i18n` -- internationalization (en, es, fr catalogs, keys, locale, messages)
- `./notifications.capability` -- capability descriptor
- `./notifications.feature` -- feature descriptor
- `./templates` -- notification templates

## Guardrails

- Depends on `lib.bus` for event dispatch -- channel adapters must not send directly
- i18n catalogs must stay in sync across all supported locales (en, es, fr)
- Templates are the single source for notification content; do not inline message strings

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
