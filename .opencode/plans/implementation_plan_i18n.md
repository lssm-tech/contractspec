# i18n Implementation Plan

> **Generated**: 2026-02-20
> **Scope**: 10 packages across libs/ and modules/
> **Target locales**: en (default), fr, es (matching existing ai-agent pattern)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Existing Infrastructure](#2-existing-infrastructure)
3. [Package Audit Results](#3-package-audit-results)
4. [Implementation Strategy](#4-implementation-strategy)
5. [Implementation Phases](#5-implementation-phases)
6. [Per-Package Work Breakdown](#6-per-package-work-breakdown)
7. [Shared Patterns & Conventions](#7-shared-patterns--conventions)
8. [Progress Tracker](#8-progress-tracker)

---

## 1. Executive Summary

### Current State

| Metric                                                                  | Value                   |
| ----------------------------------------------------------------------- | ----------------------- |
| Packages audited                                                        | 10                      |
| Packages with i18n support                                              | 1 (ai-agent -- partial) |
| Total hardcoded user-facing strings                                     | **~870+**               |
| Critical user-facing strings (error messages, templates, bot responses) | **~120**                |
| AI/LLM prompts needing locale                                           | **~20**                 |
| Schema/entity descriptions (lower priority)                             | **~500+**               |

### Key Finding

The monorepo has a **mature i18n foundation** in `@contractspec/lib.contracts-spec/translations` (TranslationSpec, TranslationRegistry, ICU format support, plural rules, tenant overrides, validation). The `ai-agent` package is the only one that has adopted it, providing a reference implementation with 90+ typed keys across en/fr/es catalogs. The remaining 9 packages have **zero i18n support**.

### Decision: Use Existing Internal Infrastructure

We will **not** add a third-party i18n runtime library. The existing `contracts-spec` translation system + the `ai-agent` i18n pattern provides everything needed:

- `defineTranslation()` for catalog entries
- `TranslationRegistry` for lookup with fallback chains
- `resolveLocale()` for locale resolution
- Typed message keys for compile-time safety
- Catalog completeness tests

---

## 2. Existing Infrastructure

### Foundation Layer (`@contractspec/lib.contracts-spec/translations`)

| Component                    | Location                     | Purpose                                                            |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| `TranslationSpec`            | `translations/spec.ts`       | Defines translation entries with ICU hints, plural rules, variants |
| `TranslationRegistry`        | `translations/registry.ts`   | Locale-aware registry with fallback chain support                  |
| `validateTranslationSpec()`  | `translations/validation.ts` | Validates catalogs, ICU format, placeholder consistency            |
| `defineTranslation()`        | `translations/spec.ts`       | Factory for creating typed translation entries                     |
| `Locale` scalar type         | `@contractspec/lib.schema`   | BCP 47 regex-validated locale type                                 |
| `HandlerContext.translation` | `contracts-spec/types.ts`    | Runtime translation context for operation handlers                 |

### Reference Implementation (`@contractspec/lib.ai-agent/i18n`)

| Component                          | Location           | Purpose                                                               |
| ---------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `SUPPORTED_LOCALES`                | `i18n/locale.ts`   | `['en', 'fr', 'es']`                                                  |
| `resolveLocale()`                  | `i18n/locale.ts`   | Priority chain: runtime > spec > default, with base-language fallback |
| `I18N_KEYS`                        | `i18n/keys.ts`     | 90+ typed keys organized by domain                                    |
| `createAgentI18n(locale)`          | `i18n/messages.ts` | Factory returning `AgentI18n` with `t(key, params?)`                  |
| `getDefaultI18n()`                 | `i18n/messages.ts` | Convenience for default-locale instance                               |
| `catalogs/en.ts`, `fr.ts`, `es.ts` | `i18n/catalogs/`   | Complete catalogs using `defineTranslation()`                         |
| `i18n.test.ts`                     | `i18n/`            | Catalog completeness + interpolation tests                            |

### ESLint Guard Rail

- `eslint-plugin-i18next` is installed (devDep)
- `no-literal-string` rule is **globally OFF** in `eslint.config.js`
- `eslint.config.i18n.js` exists for future per-package enforcement
- **Action**: Enable `no-literal-string` per-package as each package completes i18n adoption

---

## 3. Package Audit Results

### Scorecard

| Package                     | Hardcoded Strings |          Critical Strings          | i18n Grade | Phase |
| --------------------------- | :---------------: | :--------------------------------: | :--------: | :---: |
| `libs/ai-agent`             |      ~9 gaps      |    56 `getDefaultI18n()` calls     |   **B+**   |   1   |
| `libs/content-gen`          |        ~50        |     ~30 (prompts + templates)      |   **F**    |   1   |
| `libs/video-gen`            |        ~46        |     ~25 (narration + prompts)      |   **F**    |   2   |
| `libs/support-bot`          |        ~49        |   ~28 (bot responses + keywords)   |   **F**    |   2   |
| `libs/knowledge`            |        16         |   11 (access reasons + prompts)    |   **F**    |   2   |
| `modules/learning-journey`  |       ~390        |      ~19 (errors + XP labels)      |   **F**    |   3   |
| `libs/lifecycle`            |        87         | 87 (all user-facing stage content) |   **F**    |   3   |
| `modules/lifecycle-core`    |        29         |       29 (milestone catalog)       |   **F**    |   3   |
| `modules/lifecycle-advisor` |        93         |       93 (playbook content)        |   **F**    |   3   |
| `modules/notifications`     |        93         |      23 (templates + errors)       |   **F**    |   3   |

### Per-Package Detail

#### 3.1 `@contractspec/lib.ai-agent` -- Grade: B+

**Status**: Best in class. Has full i18n infrastructure with 90+ keys across en/fr/es catalogs.

**Gaps**:

- **56 call sites use `getDefaultI18n()`** (always English) instead of locale-aware `createAgentI18n(locale)`. Only 4 files use the locale-aware path.
- **9 hardcoded strings bypass i18n entirely**:
  - `telemetry/posthog.ts` lines 248, 260, 271 -- PostHog dependency error messages
  - `providers/types.ts` line 297 -- `ProviderNotAvailableError` constructor template
  - `providers/claude-agent-sdk/adapter.ts` line 463 -- "Error: " prefix
  - `providers/opencode-sdk/tool-bridge.ts` line 276 -- "Error: " prefix
  - `interop/spec-consumer.ts` lines 99-105 -- hardcoded markdown TOC anchors
- `mcp-server.ts` calls `createAgentI18n()` without passing available `spec.locale`
- `ExportOptions` type missing a `locale` field

**Work**: Thread locale through 56 call sites, add 9 missing keys, fix MCP locale passthrough.

---

#### 3.2 `@contractspec/lib.content-gen` -- Grade: F

**Status**: Zero i18n support. 9 source files, ~50 hardcoded English strings.

**Critical items**:

- 4 AI system prompts (English-only LLM instructions)
- ~18 content body templates with embedded English grammar
- 7 default CTAs (`"Learn more"`, `"Explore the sandbox"`, etc.)
- 10 section/FAQ headings
- 8 email subject line patterns
- `slugify` function strips non-Latin characters (`[^a-z0-9]`)
- No `locale` parameter on `GeneratorOptions` or `ContentBrief`

**Work**: Add `locale` to `GeneratorOptions`/`ContentBrief`, create i18n module, extract ~50 strings, inject locale into LLM prompts, fix `slugify`.

---

#### 3.3 `@contractspec/lib.video-gen` -- Grade: F

**Status**: Zero i18n support. 34 source files, ~46 hardcoded strings (excluding docblocks).

**Critical items**:

- 7 AI/LLM system prompts controlling narration language
- 9 narration/content template strings (become on-screen video text)
- 9 composition default props/labels
- `NarrationConfig.language` field exists but is never read or used
- No `locale` on `VideoBrief` or generator options
- Typography system is Latin-optimized (no CJK/Arabic font stack)

**Work**: Add `locale` to `VideoBrief`, wire `NarrationConfig.language`, create i18n module, localize prompts, make composition labels prop-driven, extend font stacks.

---

#### 3.4 `@contractspec/lib.support-bot` -- Grade: F

**Status**: Zero i18n support. 11 source files, ~49 hardcoded strings.

**Critical items**:

- 18 bot response templates in `auto-responder.ts` (email greetings, closings, category intros, signatures)
- 13 English-only keyword dictionaries in `classifier.ts` (heuristic classification only works for English)
- 5 AI prompt templates
- `SupportTicket.locale` field **exists but is never read or used anywhere**
- Bot responses (`"Hi there,"`, `"-- ContractSpec Support"`) go directly to end users

**Work**: Wire `SupportTicket.locale`, create `SupportBotMessages` interface with locale injection, create locale-keyed keyword dictionaries, add locale to LLM prompts.

---

#### 3.5 `@contractspec/lib.knowledge` -- Grade: F

**Status**: Zero i18n support. 16 source files, 16 hardcoded strings.

**Critical items**:

- 5 access-control denial reason strings in `guard.ts` (returned in `KnowledgeAccessResult.reason`)
- 4 LLM prompt templates in `query/service.ts` (system prompt, "Question:/Context:" labels, "No relevant documents found.")
- 2 thrown error messages
- 5 email formatting labels in `gmail-adapter.ts` ("Subject:", "From:", "To:", "Date:")
- No `locale` on `RetrievalOptions` or `KnowledgeQueryConfig`

**Work**: Add `locale` to `KnowledgeQueryConfig`, externalize access denial strings with error codes, make LLM prompts locale-aware.

---

#### 3.6 `@contractspec/module.learning-journey` -- Grade: F

**Status**: Zero i18n support. 24 source files, ~390 hardcoded strings.

**Critical items**:

- 12 error messages in contract operations (user-facing API errors)
- 7 XP breakdown source labels (`"base"`, `"score_bonus"`, etc.) -- potentially shown in UI
- ~250+ entity field descriptions (lower priority)
- ~28 event descriptions
- Track spec interfaces (`title`, `description`, `instructions`, `actionLabel`) carry user-facing content with no locale dimension
- No `locale` on `LearnerEntity`

**Work**: Add i18n keys for 12 error messages, add `locale` to `LearnerEntity`, use enum constants for XP sources, create i18n module for critical strings. Entity descriptions are lower priority.

---

#### 3.7 `@contractspec/lib.lifecycle` -- Grade: F

**Status**: Zero i18n support. 6 source files, 87 hardcoded strings.

**Critical items**:

- `LIFECYCLE_STAGE_META` record contains 64 user-facing strings (7 names, 7 questions, 19 signals, 12 traps, 19 focus areas)
- 15 enum display values in `axes.ts` used as both identifiers and labels
- 6 template strings in `formatters.ts` with English word order (`"Stage ${order} . ${name}"`)
- 1 error message

**Work**: Extract `LIFECYCLE_STAGE_META` into locale-keyed structure, separate enum identity from display labels, make formatters locale-aware.

---

#### 3.8 `@contractspec/module.lifecycle-core` -- Grade: F

**Status**: Zero i18n support. 11 files, 29 hardcoded strings (all in one JSON file).

**Critical items**:

- `milestones-catalog.json` has 7 milestone titles, 7 descriptions, 15 action items -- all user-facing
- Upstream `LIFECYCLE_STAGE_META` strings pass through `lifecycle-orchestrator.ts`
- No `locale` parameter on `LifecycleOrchestrator.run()`

**Work**: Extract `milestones-catalog.json` into locale-keyed structure, add `locale` to orchestrator, coordinate with `lib.lifecycle` i18n.

---

#### 3.9 `@contractspec/module.lifecycle-advisor` -- Grade: F

**Status**: Zero i18n support. 7 files, 93 hardcoded strings.

**Critical items**:

- `stage-playbooks.ts`: 14 action titles, 14 action descriptions, 7 ceremony titles, 7 ceremony copy, 21 focus area labels, 14 emoji cues
- `library-stage-map.ts`: 14 library descriptions
- 2 dynamic fallback template literals in `recommendation-engine.ts`
- All public APIs lack locale parameter

**Work**: Extract both data files into locale-keyed catalogs, handle template literals with ICU MessageFormat, add `locale` to public methods.

---

#### 3.10 `@contractspec/module.notifications` -- Grade: F

**Status**: Zero i18n support. 7 files, 93 hardcoded strings.

**Critical items**:

- 17 user-facing notification template strings (email subjects, bodies, in-app titles, push messages, action labels)
- 4 error specification strings
- Template system has no locale dimension at all
- `renderTemplate()` and `renderNotificationTemplate()` accept no locale parameter
- `ChannelNotification` interface has no locale field
- 21 contract metadata strings

**Work**: Extend template interfaces to support per-locale content, add `locale` to render functions, create i18n module for templates and errors.

---

## 4. Implementation Strategy

### 4.1 Pattern: Per-Package i18n Module

Each package creates its own i18n module following the `ai-agent` pattern:

```
src/i18n/
  index.ts          # barrel exports
  keys.ts           # typed message keys organized by domain
  locale.ts         # SUPPORTED_LOCALES, resolveLocale()
  messages.ts       # createXxxI18n(locale), getDefaultI18n()
  catalogs/
    index.ts        # catalog barrel
    en.ts           # English reference catalog (always first)
    fr.ts           # French catalog
    es.ts           # Spanish catalog
```

### 4.2 Key Conventions

```typescript
// keys.ts - Typed keys organized by domain
export const ERROR_KEYS = {
  courseNotFound: "learning.errors.courseNotFound",
  alreadyEnrolled: "learning.errors.alreadyEnrolled",
} as const;

export const TEMPLATE_KEYS = {
  welcomeSubject: "notifications.template.welcome.subject",
  welcomeBody: "notifications.template.welcome.body",
} as const;

export const I18N_KEYS = { ...ERROR_KEYS, ...TEMPLATE_KEYS } as const;
```

```typescript
// catalogs/en.ts
import { defineTranslation } from "@contractspec/lib.contracts-spec/translations";
import { I18N_KEYS } from "../keys";

export const en = {
  [I18N_KEYS.courseNotFound]: defineTranslation({
    locale: "en",
    key: I18N_KEYS.courseNotFound,
    value: "Course does not exist",
  }),
  // ...
};
```

```typescript
// messages.ts
import { TranslationRegistry } from "@contractspec/lib.contracts-spec/translations";

export interface XxxI18n {
  t: (key: string, params?: Record<string, string>) => string;
}

export function createXxxI18n(locale?: string): XxxI18n { /* ... */ }
```

### 4.3 What Gets i18n Keys vs. What Stays Hardcoded

| String Type                                     | Action               | Rationale                             |
| ----------------------------------------------- | -------------------- | ------------------------------------- |
| Error messages shown to users                   | **i18n key**         | Directly user-facing                  |
| Bot/notification templates                      | **i18n key**         | Directly user-facing                  |
| AI/LLM system prompts                           | **Locale parameter** | Append `"Respond in ${locale}"`       |
| Content generation templates                    | **i18n key**         | User-facing output                    |
| Lifecycle stage content (names, signals, traps) | **i18n key**         | User-facing guidance                  |
| Ceremony copy/motivational text                 | **i18n key**         | User-facing                           |
| Schema/entity `.describe()` strings             | **Defer**            | Developer-facing documentation        |
| Contract `meta.description/goal/context`        | **Defer**            | Developer-facing unless exposed in UI |
| DocBlock documentation                          | **Defer**            | Developer-facing                      |
| Schema.org `@type` values                       | **Keep hardcoded**   | Standard vocabulary                   |
| Internal error messages (never shown to users)  | **Keep hardcoded**   | Developer debugging only              |

### 4.4 AI/LLM Prompt Localization

For packages with AI generation (content-gen, video-gen, support-bot, knowledge):

```typescript
// Append locale instruction to system prompts
const systemPrompt = `${basePrompt}\n\nRespond in ${locale ?? "English"}.`;
```

This is the simplest effective approach -- LLMs handle multilingual output well with explicit locale instructions.

---

## 5. Implementation Phases

### Phase 1: Fix ai-agent + Bootstrap content-gen (Highest Impact)

**Goal**: Complete the reference implementation and prove the pattern on a second package.

| Task                                                   | Package     | Effort | Priority |
| ------------------------------------------------------ | ----------- | ------ | -------- |
| Thread locale through 56 `getDefaultI18n()` call sites | ai-agent    | Medium | P0       |
| Add 9 missing i18n keys + catalog entries              | ai-agent    | Low    | P0       |
| Fix `mcp-server.ts` locale passthrough                 | ai-agent    | Low    | P0       |
| Add `locale` to `ExportOptions` type                   | ai-agent    | Low    | P1       |
| Add `locale` to `GeneratorOptions`/`ContentBrief`      | content-gen | Low    | P0       |
| Create `src/i18n/` module (keys, catalogs, messages)   | content-gen | Medium | P0       |
| Extract ~50 strings into en catalog                    | content-gen | Medium | P0       |
| Inject locale into 4 AI system prompts                 | content-gen | Low    | P0       |
| Fix `slugify` for non-Latin scripts                    | content-gen | Low    | P1       |
| Create fr.ts and es.ts catalogs                        | content-gen | Medium | P1       |

### Phase 2: AI-Facing Packages (video-gen, support-bot, knowledge)

**Goal**: Ensure all AI-powered packages produce locale-correct output.

| Task                                                          | Package     | Effort | Priority |
| ------------------------------------------------------------- | ----------- | ------ | -------- |
| Add `locale` to `VideoBrief`, wire `NarrationConfig.language` | video-gen   | Low    | P0       |
| Create `src/i18n/` module                                     | video-gen   | Medium | P0       |
| Extract ~25 critical strings (narration, prompts, defaults)   | video-gen   | Medium | P0       |
| Make composition labels prop-driven                           | video-gen   | Low    | P1       |
| Extend font stacks for non-Latin                              | video-gen   | Low    | P2       |
| Wire `SupportTicket.locale` through pipeline                  | support-bot | Low    | P0       |
| Create `SupportBotMessages` interface                         | support-bot | Medium | P0       |
| Extract 18 bot response templates                             | support-bot | Medium | P0       |
| Create locale-keyed keyword dictionaries                      | support-bot | Medium | P1       |
| Add `locale` to `KnowledgeQueryConfig`                        | knowledge   | Low    | P0       |
| Externalize 5 access denial strings with error codes          | knowledge   | Low    | P0       |
| Make LLM prompts locale-aware                                 | knowledge   | Low    | P0       |
| Create fr/es catalogs for all 3 packages                      | all         | High   | P1       |

### Phase 3: Modules + Lifecycle (Broadest Scope)

**Goal**: Complete coverage across all modules.

| Task                                                        | Package           | Effort | Priority |
| ----------------------------------------------------------- | ----------------- | ------ | -------- |
| Extract `LIFECYCLE_STAGE_META` into locale-keyed structure  | lifecycle         | Medium | P0       |
| Separate enum identity from display labels in axes          | lifecycle         | Low    | P0       |
| Make formatters locale-aware                                | lifecycle         | Medium | P1       |
| Extract `milestones-catalog.json` to locale-keyed structure | lifecycle-core    | Low    | P0       |
| Add `locale` to `LifecycleOrchestrator.run()`               | lifecycle-core    | Low    | P0       |
| Extract `stage-playbooks.ts` into locale catalogs           | lifecycle-advisor | Medium | P0       |
| Extract `library-stage-map.ts` into locale catalogs         | lifecycle-advisor | Low    | P0       |
| Handle 2 template literals with ICU MessageFormat           | lifecycle-advisor | Low    | P1       |
| Extend template interfaces for per-locale content           | notifications     | Medium | P0       |
| Add `locale` to `renderNotificationTemplate()`              | notifications     | Low    | P0       |
| Create i18n module for templates + errors                   | notifications     | Medium | P0       |
| Add i18n keys for 12 error messages                         | learning-journey  | Low    | P0       |
| Add `locale` to `LearnerEntity`                             | learning-journey  | Low    | P0       |
| Use enum constants for XP sources                           | learning-journey  | Low    | P1       |
| Create fr/es catalogs for all 5 packages                    | all               | High   | P1       |

### Phase 4: Hardening & Enforcement (Post-Implementation)

| Task                                                                              | Effort | Priority |
| --------------------------------------------------------------------------------- | ------ | -------- |
| Enable `no-literal-string` ESLint rule per-package                                | Low    | P1       |
| Add catalog completeness tests to every package                                   | Medium | P0       |
| Add CI check: all catalogs must have matching key sets                            | Low    | P0       |
| Document i18n pattern in contributor guide                                        | Low    | P1       |
| Consider extracting shared `createI18n` factory to contracts-spec or a shared lib | Medium | P2       |

---

## 6. Per-Package Work Breakdown

### 6.1 `libs/ai-agent` (Completing Existing)

**Files to modify**:

| File                                        | Change                                     |
| ------------------------------------------- | ------------------------------------------ |
| `src/i18n/keys.ts`                          | Add ~9 new keys for uncovered strings      |
| `src/i18n/catalogs/en.ts`                   | Add 9 new entries                          |
| `src/i18n/catalogs/fr.ts`                   | Add 9 new entries                          |
| `src/i18n/catalogs/es.ts`                   | Add 9 new entries                          |
| `src/telemetry/posthog.ts`                  | Replace 3 hardcoded strings with i18n keys |
| `src/providers/types.ts`                    | Replace 1 hardcoded string                 |
| `src/providers/claude-agent-sdk/adapter.ts` | Replace 1 hardcoded string, thread locale  |
| `src/providers/opencode-sdk/tool-bridge.ts` | Replace 1 hardcoded string, thread locale  |
| `src/interop/spec-consumer.ts`              | Replace 4 hardcoded strings, thread locale |
| `src/tools/mcp-server.ts`                   | Pass `spec.locale` to `createAgentI18n()`  |
| `src/exporters/types.ts`                    | Add `locale?: string` to `ExportOptions`   |
| ~15 files with `getDefaultI18n()`           | Replace with `createAgentI18n(locale)`     |

**Estimated string count**: 9 new keys + 56 call site updates

---

### 6.2 `libs/content-gen` (New i18n Module)

**New files**:

| File                         | Content                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `src/i18n/index.ts`          | Barrel exports                                                                          |
| `src/i18n/keys.ts`           | ~50 typed keys: PROMPT_KEYS, BLOG_KEYS, EMAIL_KEYS, LANDING_KEYS, SOCIAL_KEYS, SEO_KEYS |
| `src/i18n/locale.ts`         | SUPPORTED_LOCALES, resolveLocale()                                                      |
| `src/i18n/messages.ts`       | createContentGenI18n(locale)                                                            |
| `src/i18n/catalogs/index.ts` | Catalog barrel                                                                          |
| `src/i18n/catalogs/en.ts`    | English reference catalog (~50 entries)                                                 |
| `src/i18n/catalogs/fr.ts`    | French catalog                                                                          |
| `src/i18n/catalogs/es.ts`    | Spanish catalog                                                                         |
| `src/i18n/i18n.test.ts`      | Catalog completeness tests                                                              |

**Files to modify**:

| File                             | Change                                                         |
| -------------------------------- | -------------------------------------------------------------- |
| `src/types.ts`                   | Add `locale?: string` to `GeneratorOptions` and `ContentBrief` |
| `src/generators/blog.ts`         | Replace ~12 hardcoded strings, inject locale into LLM prompt   |
| `src/generators/email.ts`        | Replace ~18 hardcoded strings, inject locale into LLM prompt   |
| `src/generators/landing-page.ts` | Replace ~15 hardcoded strings, inject locale into LLM prompt   |
| `src/generators/social.ts`       | Replace ~10 hardcoded strings, inject locale into LLM prompt   |
| `src/seo/optimizer.ts`           | Replace ~3 hardcoded strings, fix `slugify` for non-Latin      |
| `package.json`                   | Add i18n export paths                                          |

---

### 6.3 `libs/video-gen` (New i18n Module)

**New files**: Same structure as content-gen (~8 files)

**Files to modify**:

| File                                          | Change                                           |
| --------------------------------------------- | ------------------------------------------------ |
| `src/types.ts`                                | Add `locale?: string` to `VideoBrief`            |
| `src/generators/script-generator.ts`          | Replace 7 prompt/template strings, inject locale |
| `src/generators/scene-planner.ts`             | Replace 9 strings, inject locale                 |
| `src/compositions/api-overview.tsx`           | Make hardcoded labels into props                 |
| `src/compositions/social-clip.tsx`            | Make default CTA into prop                       |
| `src/compositions/primitives/brand-frame.tsx` | Make watermark into prop                         |
| `src/design/typography.ts`                    | Extend font stacks for CJK/Arabic                |
| `package.json`                                | Add i18n export paths                            |

**Estimated new keys**: ~25 critical + ~20 composition defaults

---

### 6.4 `libs/support-bot` (New i18n Module)

**New files**: Same structure (~8 files)

**Files to modify**:

| File                         | Change                                                             |
| ---------------------------- | ------------------------------------------------------------------ |
| `src/bot/auto-responder.ts`  | Accept `SupportBotMessages` via options, wire `ticket.locale`      |
| `src/tickets/classifier.ts`  | Accept locale-keyed keyword dictionaries, add locale to LLM prompt |
| `src/rag/ticket-resolver.ts` | Replace 5 strings, add locale parameter                            |
| `src/bot/tools.ts`           | Replace 6 strings (errors + descriptions)                          |
| `src/bot/feedback-loop.ts`   | Return structured data instead of formatted strings                |
| `src/spec.ts`                | Make appended instruction configurable                             |
| `package.json`               | Add i18n export paths                                              |

**Estimated new keys**: ~49 keys

---

### 6.5 `libs/knowledge` (Lightweight i18n)

**New files**: Minimal i18n module (~5 files -- smaller package)

**Files to modify**:

| File                                  | Change                                                      |
| ------------------------------------- | ----------------------------------------------------------- |
| `src/access/guard.ts`                 | Replace 5 reason strings with keyed messages + error codes  |
| `src/query/service.ts`                | Add `locale` to config, localize prompts, extract 4 strings |
| `src/ingestion/document-processor.ts` | Replace 1 error message                                     |
| `src/ingestion/storage-adapter.ts`    | Replace 1 error message                                     |
| `src/types.ts`                        | Add `locale?: string` to `RetrievalOptions`                 |
| `package.json`                        | Add i18n export paths                                       |

**Estimated new keys**: ~16 keys

---

### 6.6 `libs/lifecycle` (Content-Heavy Extraction)

**New files**: i18n module (~8 files)

**Files to modify**:

| File                      | Change                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/types/stages.ts`     | Extract `LIFECYCLE_STAGE_META` content into locale catalog; expose `getStageMetadata(stage, locale)` function |
| `src/types/axes.ts`       | Separate enum identity from display labels; add label lookup function                                         |
| `src/utils/formatters.ts` | Accept locale or `t()` function; return structured data where possible                                        |
| `src/types/milestones.ts` | Add `locale?: string` to interfaces                                                                           |
| `package.json`            | Add i18n export paths                                                                                         |

**Estimated new keys**: ~87 keys (high volume but mechanically straightforward -- content is well-centralized)

---

### 6.7 `modules/lifecycle-core` (Catalog Extraction)

**New files**: Locale-keyed milestone catalogs

**Files to modify**:

| File                                         | Change                                                            |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `src/data/milestones-catalog.json`           | Transform to locale-keyed structure or replace with `.ts` catalog |
| `src/planning/milestone-planner.ts`          | Accept `locale` parameter, use locale-keyed catalog               |
| `src/orchestrator/lifecycle-orchestrator.ts` | Add `locale` to `run()`, pass to upstream                         |
| `package.json`                               | Add i18n export paths                                             |

**Estimated new keys**: ~29 keys

---

### 6.8 `modules/lifecycle-advisor` (Data File Extraction)

**New files**: i18n module (~8 files)

**Files to modify**:

| File                                           | Change                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `src/data/stage-playbooks.ts`                  | Extract 77 strings into locale catalog                             |
| `src/data/library-stage-map.ts`                | Extract 14 strings into locale catalog                             |
| `src/recommendations/recommendation-engine.ts` | Handle 2 template literals with parameterized messages, add locale |
| `src/recommendations/library-recommender.ts`   | Add locale parameter                                               |
| `src/ceremony/ceremony-designer.ts`            | Add locale parameter                                               |
| `package.json`                                 | Add i18n export paths                                              |

**Estimated new keys**: ~93 keys

---

### 6.9 `modules/notifications` (Template System Refactor)

**New files**: i18n module (~8 files)

**Files to modify**:

| File                     | Change                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `src/templates/index.ts` | Extend `NotificationTemplateDefinition` for per-locale content; add `locale` to `renderNotificationTemplate()` |
| `src/contracts/index.ts` | Replace 4 error strings with i18n keys; keep contract metadata as-is for now                                   |
| `src/channels/index.ts`  | Add `locale` to `ChannelNotification` interface; replace 2 user-facing strings                                 |
| `src/entities/index.ts`  | No change (entity descriptions deferred)                                                                       |
| `package.json`           | Add i18n export paths                                                                                          |

**Estimated new keys**: ~23 critical keys (templates + errors)

---

### 6.10 `modules/learning-journey` (Error-Focused)

**New files**: Lightweight i18n module focused on error keys

**Files to modify**:

| File                          | Change                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `src/contracts/operations.ts` | Replace 8 error strings with i18n keys                                            |
| `src/contracts/onboarding.ts` | Replace 4 error strings with i18n keys                                            |
| `src/engines/xp.ts`           | Use enum constants for 7 XP source labels                                         |
| `src/entities/learner.ts`     | Add `locale` field to `LearnerEntity`                                             |
| `src/track-spec.ts`           | Add locale awareness to `title`/`description`/`instructions`/`actionLabel` fields |
| `package.json`                | Add i18n export paths                                                             |

**Estimated new keys**: ~19 critical keys (errors + XP labels)

---

## 7. Shared Patterns & Conventions

### 7.1 Locale Parameter Convention

Every public function that produces user-facing output should accept an optional `locale?: string` parameter. When absent, fall back to `"en"`.

```typescript
function generateBlogPost(brief: ContentBrief, options?: GeneratorOptions): BlogPost;
// options.locale defaults to "en" via resolveLocale()
```

### 7.2 Catalog Completeness Test Template

Every package with an i18n module should include this test:

```typescript
import { I18N_KEYS } from "../keys";
import { en } from "../catalogs/en";
import { fr } from "../catalogs/fr";
import { es } from "../catalogs/es";

describe("i18n catalog completeness", () => {
  const allKeys = Object.values(I18N_KEYS);

  it("en catalog covers all keys", () => {
    for (const key of allKeys) {
      expect(en[key]).toBeDefined();
    }
  });

  it("fr catalog covers all keys", () => {
    for (const key of allKeys) {
      expect(fr[key]).toBeDefined();
    }
  });

  it("es catalog covers all keys", () => {
    for (const key of allKeys) {
      expect(es[key]).toBeDefined();
    }
  });
});
```

### 7.3 Package Export Convention

```json
{
  "exports": {
    "./i18n": {
      "import": "./dist/i18n/index.js",
      "types": "./dist/i18n/index.d.ts"
    },
    "./i18n/catalogs/en": {
      "import": "./dist/i18n/catalogs/en.js",
      "types": "./dist/i18n/catalogs/en.d.ts"
    },
    "./i18n/catalogs/fr": {
      "import": "./dist/i18n/catalogs/fr.js",
      "types": "./dist/i18n/catalogs/fr.d.ts"
    },
    "./i18n/catalogs/es": {
      "import": "./dist/i18n/catalogs/es.js",
      "types": "./dist/i18n/catalogs/es.d.ts"
    }
  }
}
```

### 7.4 Error Code Convention

For packages with user-facing errors, always include a stable error code alongside the translated message:

```typescript
errors: {
  COURSE_NOT_FOUND: {
    description: t("learning.errors.courseNotFound"), // translated
    code: "COURSE_NOT_FOUND", // stable, language-independent
    http: 404,
  },
}
```

---

## 8. Progress Tracker

### Phase 1

- [x] `libs/ai-agent` -- Thread locale through 55 call sites (17 files: unified-agent, json-runner, approval/workflow, spec/spec, spec/registry, providers/registry, providers/types, tools/tool-adapter, exporters/opencode-exporter, exporters/claude-agent-exporter, interop/spec-consumer, interop/tool-consumer, telemetry/posthog, providers/opencode-sdk/{adapter,tool-bridge,agent-bridge}, providers/claude-agent-sdk/{adapter,tool-bridge}). Added locale to UnifiedAgentConfig, ToolExecutionContext, SpecConsumerConfig, ToolConsumerConfig, ToolServerConfig, SpecMarkdownOptions, SpecPromptOptions, ClaudeAgentSDKConfig, OpenCodeSDKConfig. 55 tests pass.
- [x] `libs/ai-agent` -- Add 4 missing i18n keys + catalog entries (en/fr/es) — error.provider.notAvailable, error.telemetry.\*
- [x] `libs/ai-agent` -- Fix `mcp-server.ts` locale passthrough — createAgentI18n(spec.locale)
- [x] `libs/ai-agent` -- Add `locale` to `ExportOptions`
- [x] `libs/ai-agent` -- Update `ProviderNotAvailableError` to use i18n key
- [x] `libs/ai-agent` -- Update `posthog.ts` to use i18n for 3 error strings
- [x] `libs/content-gen` -- Add `locale` to `GeneratorOptions`
- [x] `libs/content-gen` -- Create `src/i18n/` module (keys, locale, messages, catalogs, index)
- [x] `libs/content-gen` -- Create English reference catalog (47 entries)
- [x] `libs/content-gen` -- Replace hardcoded strings in 4 generators + SEO optimizer
- [x] `libs/content-gen` -- Inject locale into 4 AI system prompts
- [x] `libs/content-gen` -- Fix `slugify` for non-Latin scripts (Unicode property escapes)
- [x] `libs/content-gen` -- Create fr.ts and es.ts catalogs (47 entries each)
- [x] `libs/content-gen` -- Add catalog completeness tests (25 tests, all passing)
- [x] `libs/content-gen` -- Add i18n export paths to package.json (exports + publishConfig)

### Phase 2

- [x] `libs/video-gen` -- Add `locale` to `VideoBrief` + `VideoGeneratorOptions`
- [x] `libs/video-gen` -- Create `src/i18n/` module (24 keys) + en/fr/es catalogs
- [x] `libs/video-gen` -- Replace hardcoded strings in script-generator + scene-planner (prompts + templates)
- [x] `libs/video-gen` -- Wire locale through VideoGenerator -> ScenePlanner/ScriptGenerator
- [x] `libs/video-gen` -- Add i18n export paths to package.json + completeness tests (23 tests pass)
- [x] `libs/support-bot` -- Create `SupportBotI18n` interface + i18n module (37 keys)
- [x] `libs/support-bot` -- Replace hardcoded strings in auto-responder (templates, greetings, closings, category intros)
- [x] `libs/support-bot` -- Replace hardcoded strings in ticket-resolver (labels, actions, escalation)
- [x] `libs/support-bot` -- Replace hardcoded strings in feedback-loop (status labels)
- [x] `libs/support-bot` -- Add locale to AutoResponderOptions + TicketResolverOptions
- [x] `libs/support-bot` -- Add i18n export paths to package.json + completeness tests (37 tests pass)
- [x] `libs/support-bot` -- Create locale-keyed keyword dictionaries (classifier: CATEGORY_KEYWORDS, PRIORITY_HINTS, SENTIMENT_HINTS, INTENT_KEYWORDS for en/fr/es; locale on TicketClassifierOptions; LLM prompt via i18n; 37 tests pass)
- [x] `libs/knowledge` -- Add `locale` to `KnowledgeQueryConfig`/`RetrievalOptions`
- [x] `libs/knowledge` -- Externalize access denial strings (5 guard messages) + query strings (4 keys)
- [x] `libs/knowledge` -- Make LLM prompts locale-aware (system prompt + user message template)
- [x] `libs/knowledge` -- Externalize gmail ingestion labels (5 keys: Subject, Snippet, From, To, Date)
- [x] `libs/knowledge` -- Create i18n module (14 keys) + en/fr/es catalogs + completeness tests (30 tests pass)

### Phase 3

- [x] `libs/lifecycle` -- Extract `LIFECYCLE_STAGE_META` into locale-keyed catalog via `getLocalizedStageMeta(locale)`
- [x] `libs/lifecycle` -- Separate enum identity (slugs, order) from display labels (names, questions, signals, traps, focusAreas)
- [x] `libs/lifecycle` -- Make formatters locale-aware (`formatStageSummary`, `summarizeAxes`, `createRecommendationDigest`, `getStageLabel`)
- [x] `libs/lifecycle` -- Create i18n module (73 keys) + en/fr/es catalogs + completeness tests (26 tests pass)
- [x] `libs/lifecycle` -- Add `@contractspec/lib.contracts-spec` dependency + i18n export paths
- [x] `modules/lifecycle-core` -- Extract milestones catalog (7 milestones, 29 keys) to i18n + en/fr/es catalogs
- [x] `modules/lifecycle-core` -- Add `locale` to `LifecycleOrchestratorOptions`, use `getLocalizedStageMeta(locale)`
- [x] `modules/lifecycle-core` -- Add `@contractspec/lib.contracts-spec` dependency + i18n exports (21 tests pass)
- [x] `modules/lifecycle-advisor` -- Extract playbooks + library map into catalogs (79 keys, getLocalizedStagePlaybooks + getLocalizedLibraryStageMap)
- [x] `modules/lifecycle-advisor` -- Handle template literals with ICU MessageFormat
- [x] `modules/lifecycle-advisor` -- Create i18n module + catalogs + tests (31 tests pass)
- [x] `modules/notifications` -- Extend template interfaces for per-locale content (localeChannels on templates)
- [x] `modules/notifications` -- Add `locale` to render functions + channel interfaces (renderNotificationTemplate + WebhookChannel)
- [x] `modules/notifications` -- Create i18n module for templates + errors (7 keys)
- [x] `modules/notifications` -- Create fr/es catalogs + completeness tests (28 tests pass)
- [x] `modules/learning-journey` -- Add i18n keys for XP source labels (6 keys via getXpSourceLabel)
- [x] `modules/learning-journey` -- Add `locale` to `LearnerEntity`
- [x] `modules/learning-journey` -- Use enum constants for XP sources (SOURCE_KEY_MAP)
- [x] `modules/learning-journey` -- Create i18n module + catalogs + tests (24 tests pass)

### Phase 4 (Hardening)

- [x] Enable `no-literal-string` ESLint rule per-package (warn, jsx-text-only mode for all 10 packages; ignores tests, catalogs, types)
- [x] Add CI check for catalog key parity (`bun run i18n:check` — scripts/check-i18n-parity.ts, verifies en/fr/es key parity across 10 packages)
- [x] Document i18n pattern in contributor guide (`.opencode/plans/i18n-contributor-guide.md`)
- [x] Extract shared i18n factory to contracts-spec (`createI18nFactory<K>` in `@contractspec/lib.contracts-spec/translations/i18n-factory.ts`; all 10 messages.ts + locale.ts refactored; ~1,450 lines eliminated; 302 tests pass)
