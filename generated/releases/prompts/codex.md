Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/bundle.library: unknown -> 3.10.0
@contractspec/bundle.workspace: unknown -> 4.7.0
@contractspec/example.integration-hub: unknown -> 3.9.0
@contractspec/integration.runtime: unknown -> 3.10.0
@contractspec/lib.contracts-integrations: unknown -> 3.9.0
@contractspec/lib.contracts-spec: unknown -> 6.3.0
@contractspec/lib.design-system: unknown -> 4.4.2

Required steps:
- [assisted] Declare logical env variables before framework aliases: Use workspace environment definitions and app targets instead of duplicating public env names across apps.
  - Define shared logical variables under `.contractsrc.json > environment.variables`.
  - Add app targets for each package/framework that needs concrete aliases.
  - Keep secret values behind `secretRef` or environment/secret providers.
- [assisted] Use the floating PageOutline variant for wide desktop shells: AppShell now uses the floating outline automatically; direct PageOutline consumers can opt in with `variant="floating"`.
  - Use `variant="floating"` for direct web PageOutline usage that should reduce when inactive.
  - Keep `variant="rail"` or `variant="compact"` where a static inline outline is still preferred.
- [assisted] Use the reusable credential setup block: Replace bespoke integration credential setup panels with the shared setup model and components when rendering managed/BYOK flows.
  - Import `IntegrationCredentialSetupBlock` or `buildIntegrationCredentialSetupModel` from `@contractspec/bundle.library/components/integrations`.
  - Pass credential manifests and optional workspace environment config to render requirements and target-specific aliases.
  - Pass secret references, not raw secret values, when displaying configured BYOK credentials.
- [assisted] Reuse the Integration Hub credential setup fixtures: Import the setup metadata when building docs, previews, or custom BYOK onboarding flows from the example package.
  - Import `integrationHubCredentialManifest` and `integrationHubEnvironmentConfig` from `@contractspec/example.integration-hub/setup`.
  - Keep raw provider secrets out of config values; pass secret references such as `env://POSTHOG_PERSONAL_API_KEY` instead.
  - Materialize public app aliases only for non-secret fields such as public origins or project keys.