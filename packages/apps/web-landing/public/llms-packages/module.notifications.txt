# `@contractspec/module.notifications`

Compatibility shim for the former notification module package.

Canonical notification contracts now live under `@contractspec/lib.contracts-spec/notifications`. Reusable notification entities, schema contributions, channels, templates, and i18n live in `@contractspec/lib.notification`.

## Migration

Prefer new imports for new code:

```ts
import { NotificationsFeature } from "@contractspec/lib.contracts-spec/notifications";
import { createChannelRegistry } from "@contractspec/lib.notification/channels";
import { notificationsSchemaContribution } from "@contractspec/lib.notification/entities";
```

Existing imports from `@contractspec/module.notifications` remain supported during the compatibility window. The module shim intentionally preserves:

- `notificationsSchemaContribution.moduleId === "@contractspec/module.notifications"`.
- `NotificationsFeature.meta.key === "modules.notifications"`.
- Existing export subpaths including `./channels`, `./contracts`, `./entities`, `./i18n`, `./i18n/catalogs/*`, `./notifications.capability`, `./notifications.feature`, and `./templates`.

## Local Commands

- `bun run test`
- `bun run typecheck`
- `bun run lint:check`
- `bun run build`
