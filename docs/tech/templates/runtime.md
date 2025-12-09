## ContractSpec Template Runtime (Phase 9)

Phase 9 introduces a full local-first runtime for templates so anyone can preview apps directly in the browser without provisioning any infrastructure.

### Building Blocks

- **Local database** – `@lssm/lib.runtime-local` wraps `sql.js` (SQLite WASM) and `IndexedDB` so we can seed demo data, run migrations, and persist state between sessions. Tests point the runtime to `node_modules/sql.js/dist` so CI doesn’t need a browser.
- **Local GraphQL** – `LocalGraphQLClient` wires Apollo Client + SchemaLink to resolvers for tasks, messaging, and i18n recipes. All `/templates`, `/studio`, and `/sandbox` previews use those resolvers so we never call remote APIs during demos.
- **Template registry + installer** – `.../templates/registry.ts` stores the catalog (todos, messaging, recipes). `TemplateInstaller` can seed the runtime (`install`) or export a base64 snapshot via the new `saveTemplateToStudio` mutation.
- **TemplateShell** – Shared UI wrapper that creates a `TemplateRuntimeProvider`, shows `LocalDataIndicator`, and (optionally) surfaces the new `SaveToStudioButton`.

### Runtime Flows

1. `/templates` now opens a modal that renders `TemplateShell` for each template. Users can explore without leaving the marketing site.
2. `/studio` switches to a tabbed mini-app (Projects, Canvas, Specs, Deploy) to showcase Studio surfaces with mock data. Visitors see a **preview** shell, while authenticated users (Better Auth via Sigil) unlock full persistence, versioning, and deployment controls.
3. `/sandbox` lets visitors pick a template and mode (Playground, Spec Editor, Visual Builder). The console at the bottom streams runtime events for transparency.

### GraphQL Mutations

- `saveTemplateToStudio(input: SaveTemplateInput!): SaveTemplateResult!` writes a placeholder project + spec so that templates installed from the sandbox appear in Studio. The mutation is intentionally simple right now: it records which template was imported, stores metadata, and returns `{ projectId, status: 'QUEUED' }` for the UI.
- `saveCanvasDraft(input: SaveCanvasDraftInput!): CanvasVersion!` snapshots the current Visual Builder nodes to a draft version tied to a canvas overlay. Inputs include `canvasId`, arbitrary `nodes` JSON, and an optional `label`. The resolver enforces org/org access before calling `CanvasVersionManager`.
- `deployCanvasVersion(input: DeployCanvasVersionInput!): CanvasVersion!` promotes a previously saved draft (`versionId`) to the deployed state. The returned object includes `status`, `nodes`, `createdAt`, and `createdBy` for UI timelines.
- `undoCanvasVersion(input: UndoCanvasInput!): CanvasVersion` rewinds the visual builder to the prior snapshot (returns `null` when history is empty) so Studio’s toolbar can surface “Undo” without shelling out to local storage.

### Studio GraphQL endpoint

- The landing app exposes the Studio schema at `/api/studio/graphql` via Yoga so React Query hooks (`useStudioProjects`, `useCreateStudioProject`, `useDeployStudioProject`, etc.) can talk to the bundle without spinning up a separate server.

### Spec Editor typing

- Studio’s spec editor now preloads Monaco with ambient declarations for `@lssm/lib.contracts` and `zod`, so snippets receive autocomplete and inline errors even before the spec ships to the backend. The helper lives in `presentation/components/studio/organisms/monaco-spec-types.ts` and registers the extra libs once per browser session via `monaco.languages.typescript.typescriptDefaults.addExtraLib`.
- Compiler options are aligned with our frontend toolchain (ES2020 + React JSX) which means drafts written in the editor behave like the compiled artifacts that flow through Studio pipelines.

### Spec templates

- Selecting a spec type now injects a ready-to-edit scaffold (capability, workflow, policy, dataview, component) so authors start from a canonical layout instead of a blank file. Templates live alongside `SpecEditor.tsx`, and we only overwrite the content when the previous value is empty or when the author explicitly switches types via the dropdown.

### Spec preview

- The validation side panel now embeds a `SpecPreview` widget that shows validation errors alongside transport artifacts (GraphQL schema, REST endpoints, component summaries) once a preview run completes. Tabs let authors toggle between “Validation” and “Artifacts,” mirroring the UX described in the Studio plan.

### Testing

- `src/templates/__tests__/runtime.test.ts` covers todos CRUD, messaging delivery, and recipe locale switching through the local GraphQL API.
- Studio infrastructure tests live in `src/__tests__/e2e/project-lifecycle.test.ts` and continue to exercise project creation + deploy flows.

### Next Steps

Future templates can register their React components via `registerTemplateComponents(templateId, components)` so TemplateShell can render them automatically. When new templates are added, remember to:

1. Update the registry entry (schema + tags).
2. Register components inside `presentation/components/templates`.
3. Document the template under `docs/templates/`.





