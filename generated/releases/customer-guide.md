# Customer Upgrade Guide



### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- No manual migration steps recorded.

### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- No manual migration steps recorded.

### Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Enable ContractSpec Connect in the workspace config: Turn on the Connect adapter flow before relying on task-scoped context, review, replay, or evaluation artifacts.
  - Add or merge a `connect` section in `.contractsrc.json` with `enabled: true` and the storage paths that should hold Connect artifacts.
  - Route risky edits or shell execution through `contractspec connect plan` and `contractspec connect verify` so decisions, review packets, and replay bundles are captured.
  - Use the generated docs and exported agentpacks metadata so downstream agent tooling sees the same Connect contract surface as the CLI.

### Expand the spec-pack docs into a fuller learning path across the public docs site.
- No manual migration steps recorded.

### Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Rewrite workflow imports to safe subpaths: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Import `defineWorkflow`, `WorkflowSpec`, and `WorkflowRegistry` from `@contractspec/lib.contracts-spec/workflow/spec`.
  - Import `WorkflowRunner` from `@contractspec/lib.contracts-spec/workflow/runner` and `InMemoryStateStore` from `@contractspec/lib.contracts-spec/workflow/adapters`.
  - Keep Node-only work inside "use step" functions, not the "use workflow" module graph.

### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
- Upgrade to the rebuilt package versions: Pull the patch releases for the affected Contractspec React/browser packages.
  - Upgrade the affected Contractspec package versions after this release is published.
  - Rebuild the downstream production bundle so it picks up the republished artifacts.

### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- Add .release.yaml companions for changesets: Published release changesets now require a structured release capsule.
  - Create `.changeset/<slug>.release.yaml` next to each published changeset.
  - Record customer impact, migration notes, validation commands, and evidence in the release capsule.
  - Run `contractspec release build` before `contractspec release check --strict`.