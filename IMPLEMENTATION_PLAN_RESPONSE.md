# ContractSpec Growth + Ecosystem Execution Plan

## PR plan (titles + scope)

### PR 1: Hands-on guides + verified examples

- Deliver 3-5 runnable guides with commands and expected output.
- Add example packages for each guide and wire them into the examples registry.
- Extend CI to validate new example packages.

Files touched (expected):

- packages/bundles/library/src/components/docs/guides/\*
- packages/bundles/library/src/components/docs/guides/guides.docblocks.ts
- packages/apps/web-landing/src/app/docs/guides/\*/page.tsx
- packages/examples/\* (new or updated example packages)
- packages/modules/examples/src/builtins.ts
- .github/workflows/quickstart-smoke-test.yml

Acceptance criteria:

- Each guide can be completed end-to-end in < 30 minutes.
- Each guide links to an example package with build + validate scripts.
- CI runs every linked example.

Test plan:

- bun run lint
- For each new example: bun run build; bun run validate
- Validate .github/workflows/quickstart-smoke-test.yml covers the new examples

### PR 2: Docs IA + SEO intent pages

- Add intent-driven pages for common search queries.
- Tighten internal linking from homepage -> install -> start here -> guides -> examples.
- Add metadata (title/description) for intent pages.

Files touched (expected):

- packages/apps/web-landing/src/components/docs-sidebar-nav.tsx
- packages/bundles/library/src/components/docs/DocsIndexPage.tsx
- packages/bundles/library/src/components/docs/intent/\*
- packages/apps/web-landing/src/app/docs/intent/\*/page.tsx
- packages/apps/web-landing/src/app/docs/\*/page.tsx (metadata exports)

Acceptance criteria:

- Dedicated pages exist for each intent cluster.
- Link graph has no orphan pages.
- Metadata sanity checks pass.

Test plan:

- bun run lint --filter @contractspec/app.web-landing
- bun run build:web (or bun run build)

### PR 3: Plugin API + starter kit + reference plugin

- Define a stable plugin API for generators, validators, adapters, formatters, and registry resolvers.
- Provide a create-contractspec-plugin starter kit.
- Ship one real reference plugin.

Files touched (expected):

- packages/libs/plugins/\* (new plugin API package)
- packages/apps/cli-contractspec/src/commands/plugins/_ or generate/_
- packages/tools/create-contractspec-plugin/\*
- packages/integrations/\* (reference plugin)
- packages/bundles/library/src/components/docs/ecosystem/\*

Acceptance criteria:

- create-contractspec-plugin generates a working plugin package.
- Docs explain extension points clearly.
- One integration plugin ships as a reference implementation.

Test plan:

- bun run lint --filter @contractspec/lib.plugins
- bun run test --filter @contractspec/lib.plugins (if tests added)
- Run starter kit locally and execute its test harness

### PR 4: Contextual Studio conversion hooks

- Add non-intrusive Studio prompts only after success moments.
- Extend waitlist form to capture role, company size, use case, and current stack.

Files touched (expected):

- packages/apps/cli-contractspec/src/commands/quickstart/index.ts
- packages/bundles/library/src/components/docs/shared/StudioPrompt.tsx
- packages/bundles/library/src/components/docs/guides/\*
- packages/bundles/marketing/src/components/marketing/waitlist-section.tsx
- packages/bundles/marketing/src/libs/email/waitlist-application.ts

Acceptance criteria:

- Prompts appear only after “core success” events or relevant pages.
- No nagging or blocking behavior.
- Waitlist form collects required fields only.

Test plan:

- bun run lint --filter @contractspec/app.cli-contractspec
- bun run lint --filter @contractspec/app.web-landing
- contractspec quickstart --dry-run (manual smoke)
- Verify waitlist submission includes new fields

### PR 5: Community + RFC + trust

- Add public roadmap labels and a clear contributor flow.
- Add RFC process for breaking changes and plugin API evolution.
- Add Security & Trust page and policy.

Files touched (expected):

- CONTRIBUTING.md
- SECURITY.md (new)
- ROADMAP.md (new)
- .github/ISSUE_TEMPLATE/rfc.md or .github/DISCUSSION_TEMPLATE/rfc.yml
- packages/bundles/library/src/components/docs/safety/\* (Security & Trust docblocks + page)

Acceptance criteria:

- New contributor can open a PR without private help.
- RFC template exists and is referenced.
- Security & Trust page is honest and complete.

Test plan:

- bun run lint
- Verify docs nav links to Security & Trust page

## Concrete page list (docs/site)

Guides (hands-on):

- /docs/guides/nextjs-one-endpoint
- /docs/guides/spec-validation-and-typing
- /docs/guides/generate-docs-clients-schemas
- /docs/guides/ci-contract-diff-gating
- /docs/guides/openapi-migration (optional)

Intent/SEO pages:

- /docs/intent/contract-first-api
- /docs/intent/spec-driven-development
- /docs/intent/deterministic-codegen
- /docs/intent/schema-validation-typescript
- /docs/intent/openapi-alternative
- /docs/intent/generate-client-from-schema

Ecosystem:

- /docs/ecosystem/plugins
- /docs/ecosystem/integrations
- /docs/ecosystem/templates
- /docs/ecosystem/registry

Trust:

- /docs/safety/security-and-trust

## Plugin API outline (interfaces + lifecycle)

Core interfaces:

- ContractSpecPlugin
  - meta: id, version, compatibility, type, provides
  - setup(context)
- PluginContext
  - logger, workspace config, registry access, generator hooks, telemetry hooks
- PluginCapability
  - generator, validator, adapter, formatter, registryResolver

Lifecycle:

- register(): declare extensions and surfaces
- configure(options): per-workspace config
- validate(specs): add checks
- generate(specs): emit outputs
- postGenerate(outputs): diff/format
- dispose(): cleanup

Registry:

- PluginRegistry to register/resolve plugins
- Discovery via .contractsrc.json or package.json (contractspec.plugins)
- Optional remote registry resolver plugin (git/npm)

## Studio conversion points (where + why)

CLI:

- After contractspec quickstart success: prompt about managed policies, org workflows, audit trails.
- After contractspec ci --check-drift success: prompt about managed policy gates and remote registry.

Docs:

- Guides on CI gating, team adoption, and templates show a single CTA block.
- Examples index surfaces “Need shared registry + approvals?” prompt after listing examples.

Waitlist:

- Extend to collect role, company size, use case, current stack.
- Show only on context-specific pages and CLI success prompts.

## Risks + mitigations

- Guides exceed 30 minutes: keep scope to one endpoint/workflow; test timings.
- Plugin API bloat: keep core interfaces minimal; optional capabilities in separate packages.
- Docs sprawl: use intent pages + guide index; enforce nav linking.
- Studio prompts too pushy: only show after success moments; limit to once per session.
- CI time increases: limit smoke tests to 2-3 key examples; validate others via examples validation.

## Final QA checklist

- New user path: install CLI -> run quickstart -> complete a guide -> example builds + validates.
- Existing codebase adoption: Next.js endpoint guide or OpenAPI migration guide -> CI gating works.
- Plugin author path: create-contractspec-plugin -> pass tests -> register in config.
- Studio evaluation path: success prompt -> waitlist submission -> OSS remains usable.
