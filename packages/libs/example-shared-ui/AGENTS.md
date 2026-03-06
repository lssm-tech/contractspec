# AI Agent Guide — `@contractspec/lib.example-shared-ui`

Scope: `packages/libs/example-shared-ui/*`

Shared React components and hooks for ContractSpec example apps. Provides the common layout, editors, and overlays used across all examples.

## Quick Context

- **Layer**: lib
- **Consumers**: example apps

## Public Exports

| Subpath                      | Description                    |
| ---------------------------- | ------------------------------ |
| `.`                          | Main entry                     |
| `./EvolutionDashboard`       | Evolution dashboard component  |
| `./EvolutionSidebar`         | Evolution sidebar component    |
| `./hooks/*`                  | Shared React hooks             |
| `./lib/*`                    | Shared utilities               |
| `./LocalDataIndicator`       | Local data status indicator    |
| `./MarkdownView`             | Markdown renderer              |
| `./OverlayContextProvider`   | Overlay context provider       |
| `./PersonalizationInsights`  | Personalization panel          |
| `./SaveToStudioButton`       | Studio save button             |
| `./SpecEditorPanel`          | Spec editor panel              |
| `./TemplateShell`            | Shared layout for all examples |
| `./utils/*`                  | Utility functions              |
| `./overlay-types`            | Overlay type definitions       |

## Guardrails

- Low blast radius — only example apps depend on this package.
- `TemplateShell` is the shared layout for all examples; structural changes affect every example app.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
