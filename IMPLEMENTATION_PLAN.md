# Implementation Plan: Documentation System Strategy for ContractSpec

## Goal

- Deliver a living documentation system that stays in sync with contracts, is easy to adopt, and showcases interactive examples on /docs.

## Background

- Context: The monorepo uses Next.js with docs routed under `packages/apps/web-landing/src/app/(docs)/`, while docs content and components live in the library bundle under `packages/bundles/library`.
- Pain points: docs drift from evolving contracts, navigation is hard to maintain, and adoption requires too much manual setup.
- Business requirement: wow-worthy docs with interactive examples that help partners onboard quickly.

## Constraints

- Use the existing web landing app and library bundle structure for docs content.
- Use the design system (no raw HTML) and follow frontend patterns.
- TypeScript strict, no `any`, 2-space indent, semicolons, double quotes, trailing commas.
- File size limits: 250 lines (components 150, utilities 100).
- Conflict resolution priority: Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience.

## Deliverables

- Docs generator CLI and pipeline that outputs reference docs from contracts.
- Generated reference docs integrated into /docs on the web landing site.
- Getting Started, docs generation guide, FAQ, and troubleshooting pages.
- Curated example pages with runnable snippets and demos.
- Versioned docs strategy and deployment pipeline.
- Search and optional interactive sandbox support.

## Success Metrics

- All public contracts have generated reference pages on every release.
- Docs build and deploy automatically with no drift from contracts.
- Example apps run with minimal configuration and are linked from docs.
- Partner feedback confirms improved navigation and adoption speed.

## ContractSpec Alignment

- Contracts to create (type + path + owners):
  - Command: `DocsGenerateCommand` -> `packages/libs/contracts/src/docs/commands/docsGenerate.command.ts` (owners: docs-platform)
  - Command: `DocsPublishCommand` -> `packages/libs/contracts/src/docs/commands/docsPublish.command.ts` (owners: docs-platform)
  - Query: `DocsIndexQuery` -> `packages/libs/contracts/src/docs/queries/docsIndex.query.ts` (owners: docs-platform)
  - Query: `ContractReferenceQuery` -> `packages/libs/contracts/src/docs/queries/contractReference.query.ts` (owners: docs-platform)
  - Event: `DocsGeneratedEvent` -> `packages/libs/contracts/src/docs/events/docsGenerated.event.ts` (owners: docs-platform)
  - Event: `DocsPublishedEvent` -> `packages/libs/contracts/src/docs/events/docsPublished.event.ts` (owners: docs-platform)
  - Capability: `DocumentationSystemCapability` -> `packages/libs/contracts/src/docs/capabilities/documentationSystem.capability.ts` (owners: docs-platform)
  - Presentation: `DocsLayoutPresentation` -> `packages/libs/contracts/src/docs/presentations/docsLayout.presentation.ts` (owners: docs-platform)
  - Presentation: `DocsReferencePagePresentation` -> `packages/libs/contracts/src/docs/presentations/docsReferencePage.presentation.ts` (owners: docs-platform)
  - Form: `DocsSearchForm` -> `packages/libs/contracts/src/docs/forms/docsSearch.form.ts` (owners: docs-platform)
  - Data View: `DocsIndexDataView` -> `packages/libs/contracts/src/docs/views/docsIndex.dataView.ts` (owners: docs-platform)
  - Data View: `ContractReferenceDataView` -> `packages/libs/contracts/src/docs/views/contractReference.dataView.ts` (owners: docs-platform)
  - Data View: `ExampleCatalogDataView` -> `packages/libs/contracts/src/docs/views/exampleCatalog.dataView.ts` (owners: docs-platform)
- Deliverable to contract mapping:
  - Docs generator and pipeline -> `DocsGenerateCommand`, `DocsGeneratedEvent`, `DocumentationSystemCapability`.
  - Reference docs and search -> `DocsIndexQuery`, `ContractReferenceQuery`, `DocsIndexDataView`, `ContractReferenceDataView`, `DocsSearchForm`.
  - Docs UI and layout -> `DocsLayoutPresentation`, `DocsReferencePagePresentation`.
  - Examples and demos -> `ExampleCatalogDataView`.
  - Deployment/versioning -> `DocsPublishCommand`, `DocsPublishedEvent`.
- Required contract metadata (all new contracts): `name`, `version`, `description`, `goal`, `context`, `owners`, `tags`.
- IO schema and policy definitions required for each contract (input/output Zod schema, policy for auth, visibility, retention, and PII).
- Registry updates: register new contracts in `packages/libs/contracts/src/registry.ts` (or current registry entrypoint) and export from `packages/libs/contracts/src/index.ts`.
- Versioning strategy: semantic versioning aligned to product releases; breaking changes require version bumps, deprecation windows, and migration notes.

## Delivery Steps

1. Define the ContractSpec contracts listed above with metadata, IO schemas, and policy definitions; update registry and exports.
2. Run `contractspec generate` to scaffold handlers, data views, and presentations as needed.
3. Build the docs generator in `packages/tools/docs-generator` using contract types; expose `bun run docs:generate`; output MDX/JSON into `packages/bundles/library`.
4. Integrate generated docs into `packages/apps/web-landing/src/app/(docs)/` using design system components and presentation contracts; wire `DocsSearchForm` and data views.
5. Author Getting Started, docs generation guide, FAQ, and troubleshooting pages in the library bundle; connect to presentations and data views.
6. Curate examples from `packages/examples`: ensure runnable setup, create `/docs/examples/*` pages, embed snippets and interactive components.
7. Implement docs versioning and deployment pipeline; align docs builds to contract versions and apply deprecation strategy for breaking changes.
8. Add search indexing and optional interactive sandboxes backed by queries/data views, behind feature flags if needed.
9. Add or update tests and documentation as needed for the generator and web landing integration.

## Impact & Diff

- Run `contractspec impact` before committing.
- Run `contractspec impact --baseline main` for PR summaries.
- Use `contractspec diff <refA>..<refB> --json` when comparing versions.
- If breaking changes appear, bump contract versions and add deprecation/migration notes.

## Validation

- Run `contractspec ci --check-drift` before PR/push.
- Run lint and tests for affected packages (repo scripts) and validate `bun run docs:generate` output.

## Post-plan Verification

- Business: confirm contract goals and context align with adoption and documentation outcomes.
- Technical: run Greptile/Graphite review if configured and summarize findings; ensure `contractspec impact` reports no unexpected breaking changes.

