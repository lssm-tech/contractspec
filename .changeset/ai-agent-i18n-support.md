---
'@contractspec/lib.ai-agent': minor
---

feat: add multi-language (i18n) support for all user-facing strings

Adds full internationalization to the ai-agent package with English, French, and Spanish support:

- **i18n module** (`src/i18n/`): `createAgentI18n(specLocale?, runtimeLocale?)` and `getDefaultI18n()` with `{placeholder}` interpolation, backed by the `TranslationRegistry` from `@contractspec/lib.contracts`
- **130+ typed message keys** organized by domain: agent prompts, knowledge, tools, interop, errors, exports, approval, and logs
- **3 complete catalogs**: English (reference), French (formal "vous"), Spanish (formal "usted")
- **Locale resolution**: runtime override > spec-level `locale` > default ("en"), with regional variant fallback (e.g. "fr-CA" -> "fr")
- **Spec/type changes**: `locale?: string` added to `AgentSpec`, `AgentCallOptions`, and `AgentSessionState`

All hardcoded strings across the package now go through the i18n system:

- Interop spec/tool consumers (markdown headings, prompt sections, error messages)
- Provider adapters and tool bridges (Claude Agent SDK, OpenCode SDK)
- Exporters (Claude Agent, OpenCode markdown/JSON generation, validation)
- Agent runners, knowledge injector, MCP server, approval workflow

New `./i18n` entrypoint exported from `package.json` for direct access to keys, catalogs, and locale utilities.
