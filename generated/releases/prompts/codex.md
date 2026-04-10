Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/app.cli-contractspec: unknown -> 4.3.0
@contractspec/app.web-landing: unknown -> latest
@contractspec/bundle.library: unknown -> 3.8.10
@contractspec/bundle.marketing: unknown -> 3.8.10
@contractspec/bundle.workspace: unknown -> 4.2.0
@contractspec/integration.builder-telegram: unknown -> 0.1.0
@contractspec/integration.builder-voice: unknown -> 0.1.0
@contractspec/integration.builder-whatsapp: unknown -> 0.1.0
@contractspec/integration.provider.claude-code: unknown -> 0.1.0
@contractspec/integration.provider.codex: unknown -> 0.1.0
@contractspec/integration.provider.copilot: unknown -> 0.1.0
@contractspec/integration.provider.gemini: unknown -> 0.1.0
@contractspec/integration.provider.local-model: unknown -> 0.1.0
@contractspec/integration.provider.stt: unknown -> 0.1.0
@contractspec/integration.runtime: unknown -> 3.8.9
@contractspec/integration.runtime.hybrid: unknown -> 0.1.0
@contractspec/integration.runtime.local: unknown -> 0.1.0
@contractspec/integration.runtime.managed: unknown -> 0.1.0
@contractspec/lib.accessibility: unknown -> 3.7.16
@contractspec/lib.builder-runtime: unknown -> 0.1.0
@contractspec/lib.builder-spec: unknown -> 0.1.0
@contractspec/lib.contracts-runtime-client-react: unknown -> 3.8.5
@contractspec/lib.contracts-spec: unknown -> 5.1.0
@contractspec/lib.design-system: unknown -> 3.8.10
@contractspec/lib.example-shared-ui: unknown -> 6.0.17
@contractspec/lib.mobile-control: unknown -> 0.1.0
@contractspec/lib.presentation-runtime-react: unknown -> 36.0.5
@contractspec/lib.provider-runtime: unknown -> 0.1.0
@contractspec/lib.provider-spec: unknown -> 0.1.0
@contractspec/lib.surface-runtime: unknown -> 0.5.17
@contractspec/lib.ui-kit: unknown -> 3.8.9
@contractspec/lib.ui-kit-web: unknown -> 3.9.9
@contractspec/lib.ui-link: unknown -> 3.7.13
@contractspec/lib.video-gen: unknown -> 2.7.17
@contractspec/module.builder-workbench: unknown -> 0.1.0
@contractspec/module.examples: unknown -> 3.8.9
@contractspec/module.execution-console: unknown -> 0.1.0
@contractspec/module.mobile-review: unknown -> 0.1.0
@contractspec/tool.bun: unknown -> 3.7.13
agentpacks: unknown -> 1.7.13

Required steps:
- [assisted] Adopt the Builder v3 control-plane packages: Wire provider/runtime integrations through the governed Builder v3 workbench and mobile-review surfaces.
  - Install the Builder v3 contracts and runtime packages alongside the provider integrations you intend to expose in the authoring surface.
  - Use the Builder workbench and mobile-review modules as the host UI surfaces instead of building separate readiness or export orchestration shells.
  - Validate managed, local, and hybrid runtime mode selection plus provider routing before promoting the control-plane workflow to operators.
- [manual] Adopt the Connect CLI workflow: Use the built-in Connect commands instead of custom local wrappers for risky file or command mutations.
  - Initialize the workspace with `contractspec connect init --scope workspace`.
  - Use `contractspec connect context`, `plan`, and `verify` to capture task context and mutation verdicts before edits or shell execution.
  - Keep replay and evaluation artifacts under `.contractspec/connect/` so review and audit flows can consume the same evidence bundle.
- [manual] Review the updated spec-pack learning path: Confirm the new guide pages and cross-links appear in the expected docs navigation flow.
  - Open the public docs overview and verify the new learning-path entries for Connect, module bundles, and hosting the Builder workbench.
  - Follow the related-page links between the spec overview, architecture references, and Studio/Builder guides to confirm the intended navigation loop.
- [manual] Verify production bundles no longer import the dev JSX runtime: Check released JS artifacts for `react/jsx-dev-runtime` imports or `jsxDEV(` call sites.
  - Rebuild the affected package set with the updated `@contractspec/tool.bun`.
  - Scan `dist/` output for `react/jsx-dev-runtime` imports and `jsxDEV(` call sites before publishing.
- [manual] Verify hardened Builder bootstrap and local-daemon flows: Confirm the new preset, mobile-review, and local runtime registration surfaces are wired through the workbench snapshot.
  - Update any bootstrap orchestration to use the managed, local-daemon, or hybrid preset values exposed by the Builder contracts.
  - Register a local daemon through the runtime integration and confirm the resulting trust and lease details appear in the Builder snapshot surfaces.
  - Review the mobile-review and operator status cards to verify channel-native actions and comparison posture are rendered from the shared snapshot model.
- [manual] Scaffold release capsule companions: Add release capsules for changesets and include validation evidence.
  - Run `contractspec release init` for new release work.
  - Keep `.changeset/*.md` and `.changeset/*.release.yaml` together in the same PR.
  - Use `contractspec release brief` or `contractspec upgrade prompt` to generate maintainer, customer, and agent guidance.
- [assisted] Use generated release manifests in tooling: Prefer generated release artifacts for changelog and upgrade flows.
  - Run `contractspec release build` to populate `generated/releases/`.
  - Point changelog or upgrade tooling at `generated/releases/manifest.json` and `generated/releases/upgrade-manifest.json`.
- [manual] Rewrite workflow imports to safe subpaths: Use narrow workflow entrypoints so sandboxed workflow runtimes do not pull Node-only runner code.
  - Replace broad workflow barrel imports with the specific `workflow/spec`, `workflow/runner`, `workflow/adapters`, and `workflow/expression` subpaths you need.
  - Keep `crypto` and other Node-only dependencies in step functions instead of workflow entrypoints.