---
'@contractspec/lib.contracts-spec': minor
'@contractspec/lib.ai-agent': minor
'@contractspec/lib.content-gen': minor
'@contractspec/lib.video-gen': minor
'@contractspec/lib.support-bot': minor
'@contractspec/lib.knowledge': minor
'@contractspec/lib.lifecycle': minor
'@contractspec/module.lifecycle-core': minor
'@contractspec/module.lifecycle-advisor': minor
'@contractspec/module.notifications': minor
'@contractspec/module.learning-journey': minor
---

Add full i18n support across all 10 packages with en/fr/es locales (460 keys total).

- add shared `createI18nFactory<K>()` to `@contractspec/lib.contracts-spec/translations` to eliminate ~1,450 lines of duplicated boilerplate
- add `src/i18n/` modules to all 10 packages with typed keys, locale resolution, message catalogs (en/fr/es), and completeness tests
- thread `locale` parameter through public options interfaces and runtime functions in every package
- convert all 55 `getDefaultI18n()` call sites in ai-agent to locale-aware `createAgentI18n()`
- add locale-keyed keyword dictionaries (en/fr/es) to support-bot classifier
- add `getLocalizedStageMeta()` and `getLocalizedStagePlaybooks()` to lifecycle packages
- add `localeChannels` on notification templates with fr/es content for all standard templates
- add `getXpSourceLabel(source, locale)` for localized XP source display in learning-journey
- fix `slugify()` in content-gen to support non-Latin characters via Unicode property escapes
- enable `i18next/no-literal-string` ESLint rule (warn, jsx-text-only) for all 10 packages
- add `scripts/check-i18n-parity.ts` CI script and `bun run i18n:check` for catalog key parity verification
