# Multi‑File Prisma Schema Conventions (per database)

We adopt Prisma multi‑file schema (GA ≥ v6.7) to organize each database’s models by domain and to import core LSSM module schemas locally.

Canonical layout per DB:

```
prisma/
  schema/
    main.prisma             # datasource + generators only
    imported/
      lssm_sigil/*.prisma   # imported models/enums only (no datasource/generator)
      lssm_content/*.prisma # idem
    <domain>/*.prisma       # vertical‑specific models split by bounded context
```

Notes:

- Imported files contain only `model` and `enum` blocks (strip `datasource`/`generator`).
- Preserve `@@schema("…")` annotations to keep tables in their Postgres schemas; we now explicitly list schemas in `main.prisma` to avoid P1012: `schemas = ["public","lssm_sigil","lssm_content","lssm_featureflags","lssm_ops","lssm_planning","lssm_quill","lssm_geoterro"]`.
- Use `@lssm/app.cli-database` CLI: `database import|check|generate|migrate:*|seed` to manage a single DB; `@lssm/app.cli-databases` orchestrates multiple DBs.

## Typed merger config

- Define imported module list once per DB with a typed config:

```ts
// prisma-merger.config.ts
import { defineMergedPrismaConfig } from '@lssm/app.cli-database';

export default defineMergedPrismaConfig({
  modules: [
    '@lssm/app.cli-database-sigil',
    '@lssm/app.cli-database-content',
    // ...
  ],
});
```

- Then run `database import --target .` (no need to pass `--modules`).

## Prisma Config (prisma.config.ts)

We use Prisma Config per official docs to point Prisma to the multi-file schema folder and migrations:

```ts
// prisma.config.ts
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema'),
  migrations: { path: path.join('prisma', 'migrations') },
});
```

Reference: Prisma blog – Organize Your Prisma Schema into Multiple Files: https://www.prisma.io/blog/organize-your-prisma-schema-with-multi-file-support

---

# LSSM Auth (Sigil) – Models & Integration

This document tracks the identity models and integration points used by the LSSM Sigil module.

## Models (Prisma `lssm_sigil`)

- `User` – core identity with email, optional phone, role, passkeys, apiKeys
- `Session` – session tokens and metadata; includes `activeOrganizationId`
- `Account` – external providers (password, OAuth)
- `Organization` – tenant boundary; includes `type` additional field
- `Member`, `Invitation`, `Team`, `TeamMember` – org/teams
- `Role`, `Permission`, `PolicyBinding` – RBAC
- `ApiKey`, `Passkey` – programmable access and WebAuthn
- `SsoProvider` – OIDC/SAML provider configuration (org- or user-scoped)
- `OAuthApplication`, `OAuthAccessToken`, `OAuthConsent` – first/third-party OAuth

These mirror STRIT additions so Better Auth advanced plugins (admin, organization, apiKey, passkey, genericOAuth) work uniformly across apps.

## Better Auth (server)

Enabled methods:

- Email & password
- Phone OTP (Telnyx)
- Passkey (WebAuthn)
- API keys
- Organizations & Teams
- Generic OAuth (FranceConnect+ via OIDC with JWE/JWS using JOSE)

Server config lives at `packages/lssm/modules/sigil/src/application/services/auth.ts`.

## Clients (Expo / React)

Client config lives at `packages/lssm/modules/sigil/src/presentation/providers/auth/expo.ts` with plugins for admin, passkey, apiKey, organization, phone, genericOAuth.

## Environment Variables

Telnyx (phone OTP):

- `TELNYX_API_KEY`
- `TELNYX_MESSAGING_PROFILE_ID`
- `TELNYX_FROM_NUMBER`

FranceConnect+ (prefer LSSM*… but STRIT*… fallbacks are supported):

- `LSSM_FRANCECONNECTPLUS_DISCOVERY_URL`
- `LSSM_FRANCECONNECTPLUS_CLIENT_ID`
- `LSSM_FRANCECONNECTPLUS_CLIENT_SECRET`
- `LSSM_FRANCECONNECTPLUS_ENC_PRIVATE_KEY_PEM` (PKCS8; RSA-OAEP-256)

Generic:

- `API_URL_IDENTITIES` – base URL for Better Auth server
- `BETTER_AUTH_SECRET` – server secret

Keep this in sync with code changes to avoid drift.

## HCircle domain splits and auth removal

- Auth/identity models are not defined locally anymore. They come from `@lssm/app.cli-database-sigil` under the `lssm_sigil` schema.
- `packages/hcircle/libs/database-coliving/prisma/schema/domain/` is split by domain; newsletter/waiting list lives in `newsletter.prisma` and uses `@@map("waiting_list")`.
- To avoid collisions with module names, the local event models were renamed to `SocialEvent`, `SocialEventAttendee`, and `SocialEventRecurrence` with `@@map` pointing to existing table names.

---

## Vertical profiles (current)

### STRIT

- prisma-merger modules:
  - `@lssm/app.cli-database-sigil`, `@lssm/app.cli-database-content`, `@lssm/app.cli-database-ops`, `@lssm/app.cli-database-planning`, `@lssm/app.cli-database-quill`, `@lssm/app.cli-database-geoterro`
- main.prisma schemas:
  - `schemas = ["public","lssm_sigil","lssm_content","lssm_ops","lssm_planning","lssm_quill","lssm_geoterro"]`
- domain splits (`packages/strit/libs/database/prisma/schema/domain/`):
  - `bookings.prisma` (Booking, StritDocument + links to Content `File` and Sigil `Organization`)
  - `commerce.prisma` (Wholesale models; `sellerId` linked to Sigil `Organization`)
  - `files.prisma` (PublicFile, PublicFileAccessLog; `ownerId`→Organization, `uploadedBy`→User)
  - `geo.prisma` (PublicCountry, PublicAddress, City; links to Spots/Series)
  - `spots.prisma`, `urbanism.prisma`, `analytics.prisma`, `onboarding.prisma`, `referrals.prisma`, `subscriptions.prisma`, `content.prisma`
- auth models are imported from Sigil (no local auth tables).
- Back-relations for `Organization` (e.g., `files`, seller relations) are declared in the Sigil module to avoid scattering.

### ARTISANOS

- prisma-merger modules:
  - `@lssm/app.cli-database-sigil`, `@lssm/app.cli-database-content`, `@lssm/app.cli-database-featureflags`, `@lssm/app.cli-database-ops`, `@lssm/app.cli-database-planning`, `@lssm/app.cli-database-quill`, `@lssm/app.cli-database-geoterro`
- main.prisma schemas:
  - `schemas = ["public","lssm_sigil","lssm_content","lssm_featureflags","lssm_ops","lssm_planning","lssm_quill","lssm_geoterro"]`
- domain splits (`packages/artisanos/libs/database-artisan/prisma/schema/domain/`):
  - `sales.prisma` (Client, Quote, QuoteTemplate, Invoice, FollowUps)
  - `subsidies.prisma` (SubsidyProgram, AidApplication, SupportingDocument)
  - `projects.prisma` (Project, ProjectPlanningSettings)
  - `crm.prisma` (OrganizationProfessionalProfile, OrganizationCertification)
  - `professions.prisma`, `products.prisma`, `templates.prisma`, `analytics.prisma`, `onboarding.prisma`, `referrals.prisma`, `subscriptions.prisma`, `files.prisma`
- auth/organization/team models are provided by Sigil; local legacy copies were removed.
- Where names collide with Content, local models are prefixed (e.g., `PublicFile`) and use `@@map` to keep existing table names where applicable.

## Schema Dictionary: `@lssm/lib.schema`

### Purpose

Describe operation I/O once and generate:

- zod (runtime validation)
- GraphQL (Pothos types/refs)
- JSON Schema (via `zod-to-json-schema` or native descriptors)

### Primitives

- **FieldType<T>**: describes a scalar or composite field and carries:
  - `zod` schema for validation
  - optional JSON Schema descriptor
  - optional GraphQL scalar reference/name
- **SchemaModel**: named object model composed of fields. Exposes helpers:
  - `getZod(): z.ZodObject<ZodShapeFromFields<Fields>> | z.ZodArray<z.ZodObject<...>>`
    - Preserves each field's schema, optionality, and array-ness
    - Top-level lists are supported via `config.isArray: true`
  - `getJsonSchema(): JSONSchema7` (export for docs, MCP, forms)
  - `getPothosInput()` (GraphQL input object name)

### Conventions

- Name models with PascalCase; suffix with `Input`/`Result` when ambiguous.
- Use explicit enums for multi-value constants; reuse the same enum across input/output.
- Define domain enums via `defineEnum('Name', [...])` in the relevant domain package (e.g., `packages/strit/libs/contracts-strit/src/enums/`), not in `ScalarTypeEnum`.
- Reference those enums in `SchemaModel` fields directly (they expose `getZod`, `getPothos`, `getJsonSchema`).

#### Example (STRIT)

```ts
// packages/strit/libs/contracts-strit/src/enums/recurrence.ts
import { defineEnum } from '@lssm/lib.schema';
export const SpotEnum = {
  Weekday: () =>
    defineEnum('Weekday', ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as const),
  RecurrenceFrequency: () =>
    defineEnum('RecurrenceFrequency', [
      'DAILY',
      'WEEKLY',
      'MONTHLY',
      'YEARLY',
    ] as const),
} as const;
```

```ts
// usage in contracts
frequency: { type: SpotEnum.RecurrenceFrequency(), isOptional: false },
byWeekday: { type: SpotEnum.Weekday(), isOptional: true, isArray: true },
```

- Use `Date` type for temporal values and ensure ISO strings in JSON transports where needed.

### Mapping rules (summary)

- Strings → GraphQL `String`
- Numbers → `Int` if safe 32-bit integer else `Float`
- Booleans → `Boolean`
- Dates → custom `Date` scalar
- Arrays<T> → list of mapped T (set `isArray: true` on the field)
- Top-level arrays → set `isArray: true` on the model config
- Objects → input/output object types with stable field order
- Unions → supported for output; input unions map to JSON (structural input is not supported by GraphQL)

### JSON Schema export

Prefer `getZod()` + `zod-to-json-schema` for consistency. For advanced cases, provide a custom `getJsonSchema()` on the model.

### Example

```ts
import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';

// Nested model
const Weekday = new SchemaModel({
  name: 'Weekday',
  fields: {
    value: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

// Parent model with array field and nested object
const Rule = new SchemaModel({
  name: 'Rule',
  fields: {
    timezone: { type: ScalarTypeEnum.TimeZone(), isOptional: false },
    byWeekday: { type: Weekday, isOptional: true, isArray: true },
  },
});

const CreateThingInput = new SchemaModel({
  name: 'CreateThingInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    rule: { type: Rule, isOptional: false },
  },
});

// zod
const z = CreateThingInput.getZod();
```
